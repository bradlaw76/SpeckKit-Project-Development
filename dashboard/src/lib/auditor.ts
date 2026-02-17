/**
 * SpeckKit Dashboard — Auditor Module
 *
 * Core intelligence for file inventory and compliance auditing.
 * For each governed project:
 * 1. Crawls the full repo tree (single API call)
 * 2. Pattern-matches files against audit patterns
 * 3. Compares against the project's SpeckKit profile requirements
 * 4. Computes compliance score
 * 5. Generates suggestions for missing files
 */

import { getRepoTree, getFileText, type TreeEntry } from './github-api';
import {
  AUDIT_PATTERNS,
  getRequiredPatterns,
  getOptionalPatterns,
  type AuditPattern,
  type FileCategory,
} from '../config/audit-patterns';
import type { RegistryProject, ProjectTemplate } from './registry';
import { CACHE_TTL_MS, STORAGE_KEYS } from '../config/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileMatch {
  path: string;
  pattern: AuditPattern;
  size?: number;
}

export interface MissingFile {
  pattern: AuditPattern;
  severity: 'required' | 'optional' | 'recommended';
  suggestion: string;
}

export interface AuditResult {
  project: RegistryProject;
  profile: string;
  repoOwner: string;
  repoName: string;
  isPrivate: boolean;
  totalFiles: number;
  tree: TreeEntry[];
  /** Files matched by audit patterns, grouped by category */
  matchedFiles: Record<FileCategory, FileMatch[]>;
  /** All matched files flat */
  allMatches: FileMatch[];
  /** Required files that are missing */
  missingRequired: MissingFile[];
  /** Optional files that are missing */
  missingOptional: MissingFile[];
  /** Total required files for the profile */
  totalRequired: number;
  /** Found required files */
  foundRequired: number;
  /** Compliance score: (found required / total required) * 100 */
  complianceScore: number;
  /** Suggestions for improving compliance */
  suggestions: string[];
  /** Cross-project references found in the manifest */
  projectReferences: Array<{
    projectId: string;
    relationship: string;
    manifestUrl: string;
    reason: string;
  }>;
  /** Audit timestamp */
  auditedAt: number;
  /** Any errors during audit */
  errors: string[];
}

// ---------------------------------------------------------------------------
// Glob Matching
// ---------------------------------------------------------------------------

/**
 * Simple glob matcher supporting:
 * - * (any chars except /)
 * - ** (any path segments)
 * - ? (single char)
 *
 * Case-insensitive matching.
 */
function globToRegex(pattern: string): RegExp {
  let regexStr = '';
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    if (char === '*' && pattern[i + 1] === '*') {
      // ** matches any path segments
      regexStr += '.*';
      i += 2;
      if (pattern[i] === '/') i++; // skip trailing /
    } else if (char === '*') {
      // * matches any chars except /
      regexStr += '[^/]*';
      i++;
    } else if (char === '?') {
      regexStr += '[^/]';
      i++;
    } else if (char === '.') {
      regexStr += '\\.';
      i++;
    } else {
      regexStr += char;
      i++;
    }
  }
  return new RegExp(`^${regexStr}$`, 'i');
}

/**
 * Test if a file path matches a glob pattern.
 */
function matchesPattern(filePath: string, pattern: string): boolean {
  const regex = globToRegex(pattern);
  return regex.test(filePath);
}

// ---------------------------------------------------------------------------
// Repo URL Parsing
// ---------------------------------------------------------------------------

function parseRepoUrl(url: string | undefined | null): { owner: string; repo: string } | null {
  if (!url) return null;

  // Handle: https://github.com/owner/repo or github.com/owner/repo
  const ghMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (ghMatch) {
    return { owner: ghMatch[1], repo: ghMatch[2].replace(/\.git$/, '') };
  }

  // Handle: owner/repo shorthand
  const shortMatch = url.match(/^([^/]+)\/([^/]+)$/);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2].replace(/\.git$/, '') };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

interface AuditCache {
  results: Record<string, AuditResult>;
  timestamp: number;
}

function getCachedAudit(projectId: string): AuditResult | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.auditCache);
    if (!raw) return null;
    const cache: AuditCache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL_MS) return null;
    return cache.results[projectId] || null;
  } catch {
    return null;
  }
}

function setCachedAudit(projectId: string, result: AuditResult): void {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.auditCache);
    const cache: AuditCache = raw
      ? JSON.parse(raw)
      : { results: {}, timestamp: Date.now() };
    cache.results[projectId] = result;
    cache.timestamp = Date.now();
    sessionStorage.setItem(STORAGE_KEYS.auditCache, JSON.stringify(cache));
  } catch {
    // Storage full or disabled — skip caching
  }
}

// ---------------------------------------------------------------------------
// Auditor
// ---------------------------------------------------------------------------

/**
 * Audit a single governed project.
 */
export async function auditProject(
  project: RegistryProject,
  template: ProjectTemplate,
  token: string | null,
  force = false
): Promise<AuditResult> {
  // Check cache first
  if (!force) {
    const cached = getCachedAudit(project.id);
    if (cached) return cached;
  }

  const errors: string[] = [];
  const parsed = parseRepoUrl(project.repo);
  if (!parsed) {
    return createErrorResult(project, `Cannot parse repo URL: ${project.repo}`);
  }

  const { owner, repo } = parsed;

  // 1. Crawl the full repo tree
  let tree: TreeEntry[] = [];
  let isPrivate = false;
  try {
    const treeResult = await getRepoTree(owner, repo, 'main', token);
    tree = treeResult.tree.filter(e => e.type === 'blob'); // files only
    if (treeResult.truncated) {
      errors.push('Repository tree was truncated — very large repo. Some files may be missing from audit.');
    }
  } catch (err) {
    return createErrorResult(project, `Failed to fetch repo tree: ${err}`);
  }

  // 2. Try to detect if private
  try {
    const { getRepoMeta } = await import('./github-api');
    const meta = await getRepoMeta(owner, repo, token);
    isPrivate = meta.private;
  } catch {
    // Can't determine — assume public
  }

  // 3. Determine the project's profile
  const profile = project.type || template.defaults.profile;

  // 4. Match files against patterns
  const matchedFiles: Record<FileCategory, FileMatch[]> = {
    'speckkit-required': [],
    'speckkit-optional': [],
    governance: [],
    documentation: [],
    configuration: [],
    testing: [],
    community: [],
    code: [],
    asset: [],
  };
  const allMatches: FileMatch[] = [];
  const matchedPaths = new Set<string>();

  for (const pattern of AUDIT_PATTERNS) {
    for (const file of tree) {
      if (matchesPattern(file.path, pattern.pattern) && !matchedPaths.has(`${file.path}::${pattern.pattern}`)) {
        matchedPaths.add(`${file.path}::${pattern.pattern}`);
        const match: FileMatch = { path: file.path, pattern, size: file.size };
        matchedFiles[pattern.category].push(match);
        allMatches.push(match);
      }
    }
  }

  // 5. Check required files for the profile
  const requiredPatterns = getRequiredPatterns(profile);
  const missingRequired: MissingFile[] = [];

  for (const rp of requiredPatterns) {
    const found = tree.some(f => matchesPattern(f.path, rp.pattern));
    if (!found) {
      missingRequired.push({
        pattern: rp,
        severity: 'required',
        suggestion: rp.suggestion || `Missing required file: ${rp.label} (${rp.pattern})`,
      });
    }
  }

  // 6. Check optional files
  const optionalPatterns = getOptionalPatterns(profile);
  const missingOptional: MissingFile[] = [];

  for (const op of optionalPatterns) {
    const found = tree.some(f => matchesPattern(f.path, op.pattern));
    if (!found) {
      missingOptional.push({
        pattern: op,
        severity: 'optional',
        suggestion: op.suggestion || `Consider adding: ${op.label} (${op.pattern})`,
      });
    }
  }

  // 7. Check for README (recommended for all)
  const hasReadme = tree.some(f => matchesPattern(f.path, 'README.md'));
  if (!hasReadme) {
    missingRequired.push({
      pattern: AUDIT_PATTERNS.find(p => p.pattern === 'README.md')!,
      severity: 'recommended',
      suggestion: 'Every repository should have a README.md file.',
    });
  }

  // 8. Compute compliance score
  const totalRequired = requiredPatterns.length;
  const foundRequired = totalRequired - missingRequired.filter(m => m.severity === 'required').length;
  const complianceScore = totalRequired > 0 ? Math.round((foundRequired / totalRequired) * 100) : 100;

  // 9. Generate suggestions
  const suggestions: string[] = missingRequired.map(m => m.suggestion);
  if (missingOptional.length > 0) {
    suggestions.push(
      `${missingOptional.length} optional file(s) could improve project quality: ${missingOptional.map(m => m.pattern.label).join(', ')}`
    );
  }

  // 10. Try to read project references from the manifest
  let projectReferences: AuditResult['projectReferences'] = [];
  try {
    const manifestContent = await getFileText(owner, repo, 'SYSTEM_MANIFEST.json.md', 'main', token);
    const firstBrace = manifestContent.indexOf('{');
    const lastBrace = manifestContent.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const manifest = JSON.parse(manifestContent.substring(firstBrace, lastBrace + 1));
      if (manifest.projectReferences?.references) {
        projectReferences = manifest.projectReferences.references;
      }
    }
  } catch {
    // No manifest or parse error — skip
  }

  const result: AuditResult = {
    project,
    profile,
    repoOwner: owner,
    repoName: repo,
    isPrivate,
    totalFiles: tree.length,
    tree,
    matchedFiles,
    allMatches,
    missingRequired,
    missingOptional,
    totalRequired,
    foundRequired,
    complianceScore,
    suggestions,
    projectReferences,
    auditedAt: Date.now(),
    errors,
  };

  setCachedAudit(project.id, result);
  return result;
}

/**
 * Audit all governed projects from the registry.
 * Batches requests to respect rate limits (3 concurrent).
 */
export async function auditAllProjects(
  projects: RegistryProject[],
  template: ProjectTemplate,
  token: string | null,
  onProgress?: (completed: number, total: number, current: string) => void,
  force = false
): Promise<AuditResult[]> {
  const results: AuditResult[] = [];
  const batchSize = 3;

  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (project) => {
        onProgress?.(results.length, projects.length, project.name);
        return auditProject(project, template, token, force);
      })
    );
    results.push(...batchResults);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createErrorResult(project: RegistryProject, error: string): AuditResult {
  return {
    project,
    profile: project.type || 'unknown',
    repoOwner: '',
    repoName: '',
    isPrivate: false,
    totalFiles: 0,
    tree: [],
    matchedFiles: {
      'speckkit-required': [],
      'speckkit-optional': [],
      governance: [],
      documentation: [],
      configuration: [],
      testing: [],
      community: [],
      code: [],
      asset: [],
    },
    allMatches: [],
    missingRequired: [],
    missingOptional: [],
    totalRequired: 0,
    foundRequired: 0,
    complianceScore: 0,
    suggestions: [],
    projectReferences: [],
    auditedAt: Date.now(),
    errors: [error],
  };
}

/**
 * Get a compliance status label from a score.
 */
export function getComplianceLabel(score: number): 'compliant' | 'partial' | 'non-compliant' {
  if (score >= 100) return 'compliant';
  if (score >= 50) return 'partial';
  return 'non-compliant';
}

/**
 * Get compliance color for UI rendering.
 */
export function getComplianceColor(score: number): string {
  if (score >= 100) return '#22c55e'; // green
  if (score >= 75) return '#84cc16'; // lime
  if (score >= 50) return '#eab308'; // yellow
  if (score >= 25) return '#f97316'; // orange
  return '#ef4444'; // red
}
