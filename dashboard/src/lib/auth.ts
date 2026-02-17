/**
 * SpeckKit Dashboard — Auth Module
 *
 * Two authentication paths:
 * 1. Personal Access Token (PAT) — user pastes a GitHub token for private repo access
 * 2. Device Flow OAuth — browser-based auth, no backend needed
 *
 * Tokens stored in localStorage (PAT, persistent) or sessionStorage (Device Flow, per-session).
 */

import { GITHUB_API_BASE, GITHUB_CLIENT_ID, STORAGE_KEYS } from '../config/constants';

export type AuthMethod = 'pat' | 'device-flow' | 'none';

export interface AuthState {
  method: AuthMethod;
  token: string | null;
  user: GitHubUser | null;
  scopes: string[];
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  html_url: string;
}

export interface DeviceFlowCodes {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

// ---------------------------------------------------------------------------
// Token Management
// ---------------------------------------------------------------------------

export function getStoredAuth(): AuthState {
  // Check PAT first (persistent)
  const pat = localStorage.getItem(STORAGE_KEYS.pat);
  if (pat) {
    return { method: 'pat', token: pat, user: null, scopes: [] };
  }

  // Check Device Flow token (session only)
  const deviceToken = sessionStorage.getItem(STORAGE_KEYS.deviceFlowToken);
  if (deviceToken) {
    return { method: 'device-flow', token: deviceToken, user: null, scopes: [] };
  }

  return { method: 'none', token: null, user: null, scopes: [] };
}

export function savePatToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.pat, token);
  localStorage.setItem(STORAGE_KEYS.authMethod, 'pat');
}

export function saveDeviceFlowToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEYS.deviceFlowToken, token);
  sessionStorage.setItem(STORAGE_KEYS.authMethod, 'device-flow');
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.pat);
  localStorage.removeItem(STORAGE_KEYS.authMethod);
  sessionStorage.removeItem(STORAGE_KEYS.deviceFlowToken);
  sessionStorage.removeItem(STORAGE_KEYS.authMethod);
}

// ---------------------------------------------------------------------------
// Token Validation
// ---------------------------------------------------------------------------

export async function validateToken(token: string): Promise<{
  valid: boolean;
  user: GitHubUser | null;
  scopes: string[];
  error?: string;
}> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      return { valid: false, user: null, scopes: [], error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const scopes = (res.headers.get('x-oauth-scopes') || '').split(',').map(s => s.trim()).filter(Boolean);
    const user: GitHubUser = await res.json();

    const hasRepoScope = scopes.includes('repo') || scopes.includes('public_repo');
    if (!hasRepoScope && scopes.length > 0) {
      return {
        valid: true,
        user,
        scopes,
        error: 'Token lacks "repo" scope — private repos will not be accessible.',
      };
    }

    return { valid: true, user, scopes };
  } catch (err) {
    return { valid: false, user: null, scopes: [], error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Device Flow OAuth
// ---------------------------------------------------------------------------

export async function startDeviceFlow(): Promise<DeviceFlowCodes> {
  if (!GITHUB_CLIENT_ID) {
    throw new Error(
      'GITHUB_CLIENT_ID is not set. Register a GitHub OAuth App and set the client_id in src/config/constants.ts'
    );
  }

  const res = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      scope: 'repo',
    }),
  });

  if (!res.ok) {
    throw new Error(`Device Flow init failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function pollDeviceFlow(
  deviceCode: string,
  interval: number,
  onPoll?: () => void
): Promise<string> {
  const pollInterval = Math.max(interval, 5) * 1000; // GitHub minimum 5s

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      onPoll?.();
      try {
        const res = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            device_code: deviceCode,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          }),
        });

        const data = await res.json();

        if (data.access_token) {
          clearInterval(timer);
          resolve(data.access_token);
        } else if (data.error === 'expired_token') {
          clearInterval(timer);
          reject(new Error('Device code expired. Please try again.'));
        } else if (data.error === 'access_denied') {
          clearInterval(timer);
          reject(new Error('Authorization denied by user.'));
        }
        // 'authorization_pending' or 'slow_down' — keep polling
        if (data.error === 'slow_down') {
          // Back off — GitHub asks us to slow down
          clearInterval(timer);
          setTimeout(() => {
            pollDeviceFlow(deviceCode, interval + 5, onPoll).then(resolve).catch(reject);
          }, 5000);
        }
      } catch (err) {
        clearInterval(timer);
        reject(err);
      }
    }, pollInterval);
  });
}
