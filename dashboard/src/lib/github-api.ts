/**
 * SpeckKit Dashboard — GitHub API Client
 *
 * Wraps the GitHub REST API for:
 * - Reading repo file trees (single API call for full inventory)
 * - Reading individual file contents
 * - Creating/updating files in other repos
 * - Creating branches and pull requests
 * - Getting repo metadata (public/private)
 */

import { GITHUB_API_BASE } from '../config/constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TreeEntry {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface RepoTree {
  sha: string;
  tree: TreeEntry[];
  truncated: boolean;
}

export interface RepoMeta {
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  html_url: string;
  description: string | null;
  owner: { login: string; avatar_url: string };
}

export interface FileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  content: string; // base64
  encoding: string;
  html_url: string;
}

export interface CreateFileResult {
  content: { path: string; sha: string; html_url: string };
  commit: { sha: string; message: string; html_url: string };
}

export interface PullRequest {
  number: number;
  html_url: string;
  title: string;
  state: string;
}

// ---------------------------------------------------------------------------
// API Client
// ---------------------------------------------------------------------------

function headers(token: string | null): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    h.Authorization = `Bearer ${token}`;
  }
  return h;
}

async function apiRequest<T>(
  endpoint: string,
  token: string | null,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers(token),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status}: ${res.statusText} — ${body}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Read Operations
// ---------------------------------------------------------------------------

/**
 * Get the full file tree of a repo in a single API call.
 * Returns every file path — used for compliance auditing.
 */
export async function getRepoTree(
  owner: string,
  repo: string,
  branch: string = 'main',
  token: string | null = null
): Promise<RepoTree> {
  return apiRequest<RepoTree>(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    token
  );
}

/**
 * Get repo metadata — used for public/private detection (PR recommendation logic).
 */
export async function getRepoMeta(
  owner: string,
  repo: string,
  token: string | null = null
): Promise<RepoMeta> {
  return apiRequest<RepoMeta>(`/repos/${owner}/${repo}`, token);
}

/**
 * Get a single file's content (base64 encoded).
 */
export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main',
  token: string | null = null
): Promise<FileContent> {
  return apiRequest<FileContent>(
    `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    token
  );
}

/**
 * Get decoded text content of a file.
 */
export async function getFileText(
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main',
  token: string | null = null
): Promise<string> {
  const file = await getFileContent(owner, repo, path, branch, token);
  return atob(file.content.replace(/\n/g, ''));
}

/**
 * List the authenticated user's repositories.
 */
export async function listUserRepos(
  token: string,
  page: number = 1,
  perPage: number = 30
): Promise<RepoMeta[]> {
  return apiRequest<RepoMeta[]>(
    `/user/repos?sort=updated&direction=desc&per_page=${perPage}&page=${page}`,
    token
  );
}

// ---------------------------------------------------------------------------
// Write Operations
// ---------------------------------------------------------------------------

/**
 * Create a new file in a repo (fails if file already exists — use updateFile for that).
 */
export async function createFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string = 'main',
  token: string
): Promise<CreateFileResult> {
  return apiRequest<CreateFileResult>(
    `/repos/${owner}/${repo}/contents/${path}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch,
      }),
    }
  );
}

/**
 * Update an existing file in a repo (requires the current file SHA).
 */
export async function updateFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha: string,
  branch: string = 'main',
  token: string
): Promise<CreateFileResult> {
  return apiRequest<CreateFileResult>(
    `/repos/${owner}/${repo}/contents/${path}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(content))),
        branch,
        sha,
      }),
    }
  );
}

/**
 * Create a new branch from an existing branch's HEAD.
 */
export async function createBranch(
  owner: string,
  repo: string,
  baseBranch: string,
  newBranch: string,
  token: string
): Promise<void> {
  // Get the SHA of the base branch
  const ref = await apiRequest<{ object: { sha: string } }>(
    `/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
    token
  );

  // Create new branch ref
  await apiRequest(
    `/repos/${owner}/${repo}/git/refs`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: ref.object.sha,
      }),
    }
  );
}

/**
 * Create a pull request.
 */
export async function createPullRequest(
  owner: string,
  repo: string,
  title: string,
  head: string,
  base: string,
  body: string,
  token: string
): Promise<PullRequest> {
  return apiRequest<PullRequest>(
    `/repos/${owner}/${repo}/pulls`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({ title, head, base, body }),
    }
  );
}

/**
 * Trigger a workflow_dispatch event on a repo.
 */
export async function triggerWorkflow(
  owner: string,
  repo: string,
  workflowId: string,
  ref: string,
  inputs: Record<string, string>,
  token: string
): Promise<void> {
  await apiRequest(
    `/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({ ref, inputs }),
    }
  );
}
