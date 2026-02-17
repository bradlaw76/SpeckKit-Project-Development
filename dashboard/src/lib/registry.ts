/**
 * SpeckKit Dashboard — Registry Data Parser
 *
 * Fetches and parses the registry's structured data files:
 * - MANIFEST_INDEX.json.md → JSON embedded in Markdown
 * - PROJECT_TEMPLATE.json → plain JSON
 * - CODE_STANDARDS_CATALOG.json.md → JSON embedded in Markdown
 * - UI_REFERENCE_CATALOG.json.md → JSON embedded in Markdown
 * - AGENT_BEHAVIOR_DEFAULTS.jsonc → JSONC (comments stripped)
 */

import {
  REGISTRY_FILES,
  CACHE_TTL_MS,
  GITHUB_API_BASE,
  REGISTRY_OWNER,
  REGISTRY_REPO,
  REGISTRY_BRANCH,
} from '../config/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistryProject {
  /** Unique project identifier — maps from `projectId` in the manifest */
  id: string;
  name: string;
  /** GitHub repo URL or owner/repo — maps from `repository` in the manifest */
  repo: string;
  manifestUrl: string;
  rawManifestUrl?: string;
  /** Profile name (e.g. hybrid, spec-governed) — maps from `profile` in the manifest */
  type: string;
  status: string;
  speckitReviewable: boolean;
  specDirectory?: string;
  spec?: {
    type: string;
    path: string;
    entryPoint?: string;
    reviewMode?: string;
  };
}

export interface RegistryIndex {
  registry: {
    name: string;
    owner: string;
    repo: string;
    path: string;
    version: string;
    purpose: string;
    lastUpdated: string;
  };
  uiReferenceCatalog?: Record<string, unknown>;
  codeStandardsCatalog?: Record<string, unknown>;
  agentBehavior?: Record<string, unknown>;
  setupGuide?: Record<string, unknown>;
  projects: RegistryProject[];
}

export interface ProfileDefinition {
  requiredFiles: string[];
  optionalFiles?: string[];
  codeStandards?: { catalogUrl: string; defaultApply: boolean };
  uiReferences?: { catalogUrl: string; required: boolean };
  defaultReviewScope: string[];
}

export interface ProjectTemplate {
  templateVersion: string;
  profiles: Record<string, ProfileDefinition>;
  projectReferences?: {
    description: string;
    referenceSchema: Record<string, string>;
    relationships: Array<{ id: string; description: string }>;
  };
  defaults: { status: string; profile: string };
  namingRules: { projectId: string };
  setupGuide?: string;
}

export interface CodeStandard {
  id: string;
  name: string;
  category: string;
  path: string;
  rawUrl: string;
  version: string;
  status: string;
  defaultApply: boolean;
  tags: string[];
  applicableTo: string[];
}

export interface CodeStandardsCatalog {
  catalog: Record<string, unknown>;
  agentBehavior: Record<string, unknown>;
  standards: CodeStandard[];
}

export interface UIReference {
  id: string;
  name: string;
  platform: string;
  area: string;
  path: string;
  rawUrl: string;
  sourceImage?: string;
  tags: string[];
  status: string;
  version: string;
  reusablePatterns: string[];
}

export interface UIReferenceCatalog {
  catalog: Record<string, unknown>;
  folderConvention: Record<string, unknown>;
  references: UIReference[];
}

export interface RegistryData {
  index: RegistryIndex;
  template: ProjectTemplate;
  codeStandards: CodeStandardsCatalog;
  uiReferences: UIReferenceCatalog;
  agentBehavior: Record<string, unknown>;
  fetchedAt: number;
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Extract JSON from a .json.md file.
 * These files contain JSON wrapped in a Markdown document — possibly with
 * HTML comment headers or fenced code blocks. We find the first `{` and
 * match to the last `}`.
 */
function extractJsonFromMarkdown(text: string): unknown {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('No JSON object found in Markdown content');
  }
  const jsonStr = text.substring(firstBrace, lastBrace + 1);
  return JSON.parse(jsonStr);
}

/**
 * Strip // comments from JSONC and parse as JSON.
 */
function parseJsonc(text: string): unknown {
  const stripped = text.replace(/^\s*\/\/.*$/gm, '');
  return JSON.parse(stripped);
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

let cachedData: RegistryData | null = null;

function isCacheValid(): boolean {
  return cachedData !== null && Date.now() - cachedData.fetchedAt < CACHE_TTL_MS;
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

async function fetchRawFile(path: string, token?: string | null): Promise<string> {
  // Use the GitHub API contents endpoint — works for both public and private repos with auth
  const url = `${GITHUB_API_BASE}/repos/${REGISTRY_OWNER}/${REGISTRY_REPO}/contents/${path}?ref=${REGISTRY_BRANCH}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.raw+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404 && !token) {
      throw new Error(
        'PRIVATE_REPO: The registry repo is private. Connect your GitHub account to access it.'
      );
    }
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

/**
 * Fetch and parse all registry data files.
 * Uses cache if data was fetched within the TTL.
 */
export async function loadRegistryData(token?: string | null, force = false): Promise<RegistryData> {
  if (!force && isCacheValid() && cachedData) {
    return cachedData;
  }

  const [indexText, templateText, codeStdText, uiRefText, agentText] = await Promise.all([
    fetchRawFile(REGISTRY_FILES.manifestIndex, token),
    fetchRawFile(REGISTRY_FILES.projectTemplate, token),
    fetchRawFile(REGISTRY_FILES.codeStandardsCatalog, token),
    fetchRawFile(REGISTRY_FILES.uiReferenceCatalog, token),
    fetchRawFile(REGISTRY_FILES.agentBehavior, token),
  ]);

  const indexRaw = extractJsonFromMarkdown(indexText) as Record<string, unknown>;
  const template = JSON.parse(templateText) as ProjectTemplate;
  const codeStdRaw = extractJsonFromMarkdown(codeStdText) as Record<string, unknown>;
  const uiRefRaw = extractJsonFromMarkdown(uiRefText) as Record<string, unknown>;
  const agentBehavior = parseJsonc(agentText) as Record<string, unknown>;

  // Normalize the index — map field names from manifest format to internal format
  const rawProjects = (indexRaw.projects as Array<Record<string, unknown>>) || [];
  const projects: RegistryProject[] = rawProjects.map((p) => ({
    id: (p.projectId ?? p.id ?? '') as string,
    name: (p.name ?? '') as string,
    repo: (p.repository ?? p.repo ?? '') as string,
    manifestUrl: (p.manifestUrl ?? '') as string,
    rawManifestUrl: (p.rawManifestUrl ?? undefined) as string | undefined,
    type: (p.profile ?? p.type ?? 'unknown') as string,
    status: (p.status ?? '') as string,
    speckitReviewable: Boolean(p.speckitReviewable),
    specDirectory: (p.specDirectory ?? (p.spec as Record<string, unknown>)?.path ?? undefined) as string | undefined,
    spec: p.spec as RegistryProject['spec'],
  }));

  const index: RegistryIndex = {
    registry: indexRaw.registry as RegistryIndex['registry'],
    uiReferenceCatalog: indexRaw.uiReferenceCatalog as Record<string, unknown>,
    codeStandardsCatalog: indexRaw.codeStandardsCatalog as Record<string, unknown>,
    agentBehavior: indexRaw.agentBehavior as Record<string, unknown>,
    setupGuide: indexRaw.setupGuide as Record<string, unknown>,
    projects,
  };

  const codeStandards: CodeStandardsCatalog = {
    catalog: codeStdRaw.catalog as Record<string, unknown>,
    agentBehavior: codeStdRaw.agentBehavior as Record<string, unknown>,
    standards: (codeStdRaw.standards as CodeStandard[]) || [],
  };

  const uiReferences: UIReferenceCatalog = {
    catalog: uiRefRaw.catalog as Record<string, unknown>,
    folderConvention: uiRefRaw.folderConvention as Record<string, unknown>,
    references: (uiRefRaw.references as UIReference[]) || [],
  };

  cachedData = {
    index,
    template,
    codeStandards,
    uiReferences,
    agentBehavior,
    fetchedAt: Date.now(),
  };

  return cachedData;
}

/**
 * Get profile definition by name.
 */
export function getProfile(template: ProjectTemplate, profileName: string): ProfileDefinition | null {
  return template.profiles[profileName] || null;
}

/**
 * Get all available profile names.
 */
export function getProfileNames(template: ProjectTemplate): string[] {
  return Object.keys(template.profiles);
}
