/**
 * SpeckKit Dashboard — Constants
 *
 * Central configuration for the dashboard app.
 */

export const REGISTRY_OWNER = 'bradlaw76';
export const REGISTRY_REPO = 'SpeckKit-Project-Development';
export const REGISTRY_BRANCH = 'main';

export const GITHUB_API_BASE = 'https://api.github.com';
export const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/${REGISTRY_BRANCH}`;

/** GitHub OAuth App client ID — replace with your registered OAuth App's client ID */
export const GITHUB_CLIENT_ID = '';

/** Registry data file paths (relative to repo root) */
export const REGISTRY_FILES = {
  manifestIndex: 'system-manifests/MANIFEST_INDEX.json.md',
  projectTemplate: 'system-manifests/PROJECT_TEMPLATE.json',
  codeStandardsCatalog: 'code-standards/CODE_STANDARDS_CATALOG.json.md',
  uiReferenceCatalog: 'ui-references/UI_REFERENCE_CATALOG.json.md',
  agentBehavior: 'AGENT_BEHAVIOR_DEFAULTS.jsonc',
  setupGuide: 'SETUP_FOR_PROJECTS.md',
} as const;

/** Storage keys */
export const STORAGE_KEYS = {
  pat: 'speckkit_pat',
  deviceFlowToken: 'speckkit_device_token',
  authMethod: 'speckkit_auth_method',
  auditCache: 'speckkit_audit_cache',
} as const;

/** Cache TTL in milliseconds (5 minutes) */
export const CACHE_TTL_MS = 5 * 60 * 1000;
