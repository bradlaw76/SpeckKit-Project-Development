/**
 * SpeckKit Dashboard — Audit Patterns Configuration
 *
 * Defines the wildcard patterns used to discover and classify files
 * in governed repositories. Each pattern maps to a category and
 * indicates which SpeckKit profiles require it.
 *
 * This is the single source of truth for file discovery rules.
 * Add new patterns here as SpeckKit evolves.
 */

export type FileCategory =
  | 'speckkit-required'
  | 'speckkit-optional'
  | 'governance'
  | 'documentation'
  | 'configuration'
  | 'testing'
  | 'community'
  | 'code'
  | 'asset';

export interface AuditPattern {
  /** Glob-style pattern (supports *, **, ?) */
  pattern: string;
  /** Human-readable label */
  label: string;
  /** Classification category */
  category: FileCategory;
  /** Which profiles require this file (empty = informational only) */
  requiredBy: string[];
  /** Which profiles list this as optional */
  optionalFor: string[];
  /** Priority for display ordering (lower = more important) */
  priority: number;
  /** Suggestion text when file is missing and required */
  suggestion?: string;
}

// ---------------------------------------------------------------------------
// SpeckKit-specific file patterns
// ---------------------------------------------------------------------------

export const AUDIT_PATTERNS: AuditPattern[] = [
  // === SpeckKit Required Files ===
  {
    pattern: 'SYSTEM_MANIFEST.json.md',
    label: 'System Manifest',
    category: 'speckkit-required',
    requiredBy: ['spec-governed', 'ux-demo', 'hybrid', 'ui-reference', 'code-standard'],
    optionalFor: [],
    priority: 1,
    suggestion: 'Every SpeckKit-governed project must have a SYSTEM_MANIFEST.json.md at repo root.',
  },
  {
    pattern: '.github/copilot-instructions.md',
    label: 'Copilot Instructions',
    category: 'speckkit-required',
    requiredBy: ['spec-governed', 'ux-demo', 'hybrid', 'ui-reference', 'code-standard'],
    optionalFor: [],
    priority: 2,
    suggestion: 'Create .github/copilot-instructions.md to enable AI agent integration with SpeckKit standards.',
  },
  {
    pattern: 'SPEC.md',
    label: 'Specification',
    category: 'speckkit-required',
    requiredBy: ['spec-governed', 'hybrid'],
    optionalFor: ['ux-demo', 'ui-reference', 'code-standard'],
    priority: 3,
    suggestion: 'This profile requires a SPEC.md file defining the project specification.',
  },
  {
    pattern: 'BINDING_CERTIFICATION.md',
    label: 'Binding Certification',
    category: 'speckkit-required',
    requiredBy: ['spec-governed', 'hybrid'],
    optionalFor: [],
    priority: 4,
    suggestion: 'This profile requires BINDING_CERTIFICATION.md for spec compliance tracking.',
  },
  {
    pattern: 'UX_INVARIANTS.md',
    label: 'UX Invariants',
    category: 'speckkit-required',
    requiredBy: ['ux-demo', 'hybrid'],
    optionalFor: ['ui-reference'],
    priority: 5,
    suggestion: 'This profile requires UX_INVARIANTS.md documenting UX behaviors that must never break.',
  },
  {
    pattern: 'TEST_ACCEPTANCE.md',
    label: 'Test Acceptance',
    category: 'speckkit-required',
    requiredBy: ['ux-demo', 'hybrid'],
    optionalFor: [],
    priority: 6,
    suggestion: 'This profile requires TEST_ACCEPTANCE.md with acceptance test criteria.',
  },

  // === Spec-Kit CLI (.specify/) Structure ===
  {
    pattern: '.specify/memory/constitution.md',
    label: 'Specify Constitution',
    category: 'speckkit-required',
    requiredBy: ['spec-governed', 'hybrid'],
    optionalFor: ['ux-demo'],
    priority: 7,
    suggestion: 'Run `specify init . --ai <assistant>` to scaffold the .specify/ directory with a constitution.',
  },
  {
    pattern: '.specify/specs/**',
    label: 'Specify Specs',
    category: 'speckkit-optional',
    requiredBy: ['spec-governed'],
    optionalFor: ['hybrid'],
    priority: 8,
    suggestion: 'Create feature specs under .specify/specs/ using `specify init` or manually. Required for spec-governed projects.',
  },
  {
    pattern: '.specify/templates/**',
    label: 'Specify Templates',
    category: 'speckkit-optional',
    requiredBy: [],
    optionalFor: ['spec-governed', 'hybrid'],
    priority: 9,
    suggestion: 'Add spec templates under .specify/templates/ to standardize feature specifications.',
  },
  {
    pattern: '.github/agents/**',
    label: 'GitHub Agents',
    category: 'speckkit-optional',
    requiredBy: [],
    optionalFor: ['spec-governed', 'hybrid'],
    priority: 8,
    suggestion: 'Add .github/agents/ for AI agent configuration. Created automatically by `specify init`.',
  },
  {
    pattern: '.github/prompts/**',
    label: 'GitHub Prompts',
    category: 'speckkit-optional',
    requiredBy: [],
    optionalFor: ['spec-governed', 'hybrid'],
    priority: 8,
    suggestion: 'Add .github/prompts/ for reusable AI prompts. Created automatically by `specify init`.',
  },

  // === Governance / Documentation ===
  {
    pattern: 'README.md',
    label: 'README',
    category: 'documentation',
    requiredBy: [],
    optionalFor: [],
    priority: 10,
    suggestion: 'Every repository should have a README.md.',
  },
  {
    pattern: '**/CONSTITUTION*.md',
    label: 'Constitution',
    category: 'governance',
    requiredBy: [],
    optionalFor: [],
    priority: 11,
  },
  {
    pattern: '**/REGISTRY_LOCK*',
    label: 'Registry Lock',
    category: 'governance',
    requiredBy: [],
    optionalFor: [],
    priority: 12,
  },
  {
    pattern: '**/MANIFEST_RULES*',
    label: 'Manifest Rules',
    category: 'governance',
    requiredBy: [],
    optionalFor: [],
    priority: 13,
  },

  // === Spec Files (wildcard discovery) ===
  {
    pattern: '**/spec/**',
    label: 'Spec Directory',
    category: 'documentation',
    requiredBy: [],
    optionalFor: [],
    priority: 20,
  },
  {
    pattern: '**/specs/**',
    label: 'Specs Directory',
    category: 'documentation',
    requiredBy: [],
    optionalFor: [],
    priority: 20,
  },

  // === Changelog / Versioning ===
  {
    pattern: '**/CHANGELOG*',
    label: 'Changelog',
    category: 'documentation',
    requiredBy: [],
    optionalFor: [],
    priority: 30,
  },
  {
    pattern: '**/changelog*',
    label: 'Changelog',
    category: 'documentation',
    requiredBy: [],
    optionalFor: [],
    priority: 30,
  },

  // === Testing ===
  {
    pattern: '**/*test*',
    label: 'Test Files',
    category: 'testing',
    requiredBy: [],
    optionalFor: [],
    priority: 40,
  },
  {
    pattern: '**/*.spec.*',
    label: 'Test Spec Files',
    category: 'testing',
    requiredBy: [],
    optionalFor: [],
    priority: 40,
  },

  // === Community Files ===
  {
    pattern: 'LICENSE*',
    label: 'License',
    category: 'community',
    requiredBy: [],
    optionalFor: [],
    priority: 50,
  },
  {
    pattern: 'CONTRIBUTING*',
    label: 'Contributing Guide',
    category: 'community',
    requiredBy: [],
    optionalFor: [],
    priority: 51,
  },
  {
    pattern: 'CODE_OF_CONDUCT*',
    label: 'Code of Conduct',
    category: 'community',
    requiredBy: [],
    optionalFor: [],
    priority: 52,
  },

  // === Broad Discovery Wildcards ===
  {
    pattern: '**/*.md',
    label: 'Markdown Files',
    category: 'documentation',
    requiredBy: [],
    optionalFor: [],
    priority: 100,
  },
  {
    pattern: '**/*.jsonc',
    label: 'JSONC Files',
    category: 'configuration',
    requiredBy: [],
    optionalFor: [],
    priority: 101,
  },
  {
    pattern: '**/*.json',
    label: 'JSON Files',
    category: 'configuration',
    requiredBy: [],
    optionalFor: [],
    priority: 102,
  },
  {
    pattern: '**/*.json.md',
    label: 'JSON-MD Files',
    category: 'configuration',
    requiredBy: [],
    optionalFor: [],
    priority: 103,
  },
];

/**
 * Get patterns that are required for a specific profile.
 */
export function getRequiredPatterns(profile: string): AuditPattern[] {
  return AUDIT_PATTERNS.filter(p => p.requiredBy.includes(profile));
}

/**
 * Get patterns that are optional for a specific profile.
 */
export function getOptionalPatterns(profile: string): AuditPattern[] {
  return AUDIT_PATTERNS.filter(p => p.optionalFor.includes(profile));
}
