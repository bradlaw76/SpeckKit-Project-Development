/**
 * SpeckKit Dashboard — Scaffold Module
 *
 * Generates starter file content for missing SpeckKit files and pushes
 * them to governed repos via the GitHub Contents API.
 *
 * Each template includes TODO markers so the project owner knows what to
 * fill in.
 */

import { createFile } from './github-api';
import { REGISTRY_OWNER, REGISTRY_REPO } from '../config/constants';
import type { RegistryProject } from './registry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScaffoldResult {
  path: string;
  success: boolean;
  htmlUrl?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Template Map
// ---------------------------------------------------------------------------

/**
 * Returns starter content for a given file pattern.
 * `projectName` is injected into titles and headings.
 */
function getTemplate(pattern: string, project: RegistryProject): string | null {
  const name = project.name || project.id;
  const profile = project.type || 'hybrid';
  const registryUrl = `https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO}`;

  switch (pattern) {
    // ── SYSTEM_MANIFEST.json.md ──────────────────────────────────────
    case 'SYSTEM_MANIFEST.json.md':
      return `<!-- SYSTEM_MANIFEST.json.md — Auto-scaffolded by SpeckKit Dashboard -->
\`\`\`jsonc
{
  "system": {
    "name": "${name}",
    "version": "0.1.0",
    "status": "DEVELOPMENT",
    "type": "${profile}"
  },
  "purpose": {
    "summary": "TODO: Describe what this project does."
  },
  "registry": {
    "indexUrl": "${registryUrl}/blob/main/system-manifests/MANIFEST_INDEX.json.md",
    "projectId": "${project.id}"
  },
  "review": {
    "speckitEnabled": true,
    "scope": ["spec", "code-standards"]
  },
  "codeStandards": {
    "source": "${REGISTRY_REPO}",
    "catalogUrl": "https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/code-standards/CODE_STANDARDS_CATALOG.json.md",
    "standards": [
      {
        "id": "component-header-block",
        "url": "https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/code-standards/comments/component-header-block.md",
        "defaultApply": true
      }
    ]
  },
  "uiReferences": {
    "source": "${REGISTRY_REPO}",
    "catalogUrl": "https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/ui-references/UI_REFERENCE_CATALOG.json.md",
    "references": []
  }
}
\`\`\`
`;

    // ── .github/copilot-instructions.md ──────────────────────────────
    case '.github/copilot-instructions.md':
      return `# Copilot Instructions

## SpeckKit Integration

This project is governed by the SpeckKit registry.

**Registry:** ${registryUrl}
**Agent Defaults:** https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/AGENT_BEHAVIOR_DEFAULTS.jsonc

---

## Code Standards (Auto-Apply — DEFAULT YES)

When creating or modifying component files, ALWAYS apply the component header
comment block. Do NOT skip unless the user explicitly says to omit comments.

**Template:** https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/code-standards/comments/component-header-block.md
**Catalog:** https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/code-standards/CODE_STANDARDS_CATALOG.json.md

### Rules
1. Apply the component header comment block to every new component file.
2. Update CHANGELOG, LAST UPDATED, and VERSION when modifying existing components.
3. Fill in all bracketed values based on project context.
4. Only skip if user explicitly says "no comments" or "skip header."

---

## UI References (Ask First — DEFAULT ASK)

UI references are available for platform-specific context. Confirm with the
user before loading.

**Catalog:** https://raw.githubusercontent.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/main/ui-references/UI_REFERENCE_CATALOG.json.md

### Rules
1. Ask: "Should I load UI reference context for [platform]?"
2. Only load if user confirms or the task clearly involves that platform's UI.
3. Use \`reusablePatterns\` for component conventions.
4. Use \`visualIndicators\` for color/badge mappings.

---

## Agent Behavior Summary

| Resource | Default | Action |
|----------|---------|--------|
| Code Standards (comment headers) | **YES** | Apply automatically |
| UI References (platform layouts) | **ASK** | Confirm with user |
`;

    // ── SPEC.md ──────────────────────────────────────────────────────
    case 'SPEC.md':
      return `# ${name} — Specification

**Status:** DRAFT
**Version:** 0.1.0
**Created:** ${new Date().toISOString().split('T')[0]}

---

## Purpose

<!-- TODO: Describe what this project does and its core objectives. -->

## Scope

<!-- TODO: Define what is in-scope and out-of-scope. -->

## Requirements

<!-- TODO: List functional and non-functional requirements. -->
`;

    // ── BINDING_CERTIFICATION.md ─────────────────────────────────────
    case 'BINDING_CERTIFICATION.md':
      return `# ${name} — Binding Certification

**Status:** NOT CERTIFIED
**Spec Version:** 0.1.0
**Certification Date:** —

---

## Certification Checklist

- [ ] Spec reviewed and approved
- [ ] All requirements implemented
- [ ] Test acceptance criteria met
- [ ] No known deviations from spec
`;

    // ── UX_INVARIANTS.md ─────────────────────────────────────────────
    case 'UX_INVARIANTS.md':
      return `# ${name} — UX Invariants

**Status:** DRAFT
**Version:** 0.1.0

---

## Invariants

<!-- TODO: List UX behaviors that must NEVER break. Example: -->
<!-- - The search box must always be visible above the data grid. -->
<!-- - Modal dialogs must trap keyboard focus. -->
`;

    // ── TEST_ACCEPTANCE.md ───────────────────────────────────────────
    case 'TEST_ACCEPTANCE.md':
      return `# ${name} — Test Acceptance Criteria

**Status:** DRAFT
**Version:** 0.1.0

---

## Acceptance Tests

<!-- TODO: List test cases that must pass for each release. Example: -->
<!-- ✔ Load data without errors -->
<!-- ✔ Search returns filtered results -->
<!-- ✔ Create record persists successfully -->
`;

    // ── README.md ────────────────────────────────────────────────────
    case 'README.md':
      return `# ${name}

> TODO: Describe this project.

## Getting Started

<!-- TODO: Add setup instructions. -->

## License

<!-- TODO: Add license information. -->
`;

    // ── CHANGELOG.md ─────────────────────────────────────────────────
    case 'CHANGELOG.md':
      return `# Changelog

All notable changes to **${name}** will be documented in this file.

## [Unreleased]

### Added
- Initial project scaffolding via SpeckKit Dashboard.
`;

    // ── LICENSE ───────────────────────────────────────────────────────
    case 'LICENSE':
      return `MIT License

Copyright (c) ${new Date().getFullYear()} ${name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns true if we have a template for the given pattern.
 */
export function hasTemplate(pattern: string): boolean {
  // Use a dummy project — we only care whether the switch has a case for it.
  return getTemplate(pattern, { id: '', name: '', repo: '', type: '', manifestUrl: '', status: '', speckitReviewable: false }) !== null;
}

/**
 * Scaffold a single missing file into the target repo.
 * Creates the file with starter content via the GitHub Contents API.
 */
export async function scaffoldFile(
  project: RegistryProject,
  owner: string,
  repo: string,
  filePath: string,
  token: string,
  branch: string = 'main',
): Promise<ScaffoldResult> {
  const content = getTemplate(filePath, project);
  if (!content) {
    return { path: filePath, success: false, error: 'No template available for this file.' };
  }

  try {
    const result = await createFile(
      owner,
      repo,
      filePath,
      content,
      `[SpeckKit] scaffold ${filePath}`,
      branch,
      token,
    );
    return {
      path: filePath,
      success: true,
      htmlUrl: result.content.html_url,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { path: filePath, success: false, error: msg };
  }
}

/**
 * Scaffold multiple missing files in one go.
 * Returns results for each file (some may succeed while others fail).
 */
export async function scaffoldAll(
  project: RegistryProject,
  owner: string,
  repo: string,
  filePaths: string[],
  token: string,
  branch: string = 'main',
): Promise<ScaffoldResult[]> {
  // Sequential to avoid GitHub API rate-limit issues on rapid PUTs
  const results: ScaffoldResult[] = [];
  for (const fp of filePaths) {
    results.push(await scaffoldFile(project, owner, repo, fp, token, branch));
  }
  return results;
}
