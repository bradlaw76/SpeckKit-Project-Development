# SpeckKit Registry — Setup Guide for Consumer Projects

**This is the ONE file an AI agent or developer needs to set up any VS Code project to use SpeckKit standards and references.**

**Registry:** `https://github.com/bradlaw76/SpeckKit-Project-Development`
**Entry Point:** This file (`SETUP_FOR_PROJECTS.md`)
**Agent Defaults:** `AGENT_BEHAVIOR_DEFAULTS.jsonc`
**Last Updated:** 2026-02-16

---

<!--
Set up this project using the SpeckKit registry at https://github.com/bradlaw76/SpeckKit-Project-Development — read SETUP_FOR_PROJECTS.md
-->

---

## What This Registry Provides

| Resource | Description | Agent Default |
|----------|-------------|---------------|
| **Code Standards** | Structured comment headers for component files | **YES — auto-apply** |
| **UI References** | Platform UI description models (e.g., Dynamics 365) | **ASK first** |

---

## Step 1 — Choose How to Connect

The agent should evaluate the consumer project's situation and pick the best option:

### Decision Tree

```
Is the consumer project a Git repo?
├── YES → Does the team need persistent local access?
│   ├── YES → Use Git Submodule (Option A)
│   └── NO  → Is the consumer repo on the same machine as the registry?
│       ├── YES → Use Local Workspace Reference (Option B)
│       └── NO  → Use Raw GitHub URLs (Option C)
└── NO → Use Raw GitHub URLs (Option C)
```

### Option A: Git Submodule (Best for teams and persistent access)

```bash
cd <your-project-root>
git submodule add https://github.com/bradlaw76/SpeckKit-Project-Development.git .speckkit-registry
git commit -m "[SPECKKIT] Add registry submodule"
```

Then reference files locally:
```
.speckkit-registry/code-standards/comments/component-header-block.md
.speckkit-registry/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc
```

**Pros:** Always available locally, version-pinned, works offline.
**Cons:** Adds submodule to repo, needs `git submodule update --init` on clone.

### Option B: Local Workspace Reference (Both repos on same machine)

If both repos are cloned to the same parent folder:
```
../SpeckKit-Project-Development/code-standards/comments/component-header-block.md
../SpeckKit-Project-Development/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc
```

**Pros:** No setup, instant access, always latest.
**Cons:** Only works on machines where both repos exist.

### Option C: Raw GitHub URLs (Quick, no local clone needed)

Reference files directly via GitHub:
```
https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md
https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc
```

**Pros:** Zero setup, works from anywhere.
**Cons:** Requires internet, repo must be public (or use auth token).

---

## Step 2 — Create `.github/copilot-instructions.md`

This tells GitHub Copilot and other AI agents what to do. Create the folder and file:

```bash
mkdir .github
```

Then create `.github/copilot-instructions.md` with:

````markdown
# Copilot Instructions

## SpeckKit Integration

This project is governed by the SpeckKit registry.

**Registry:** https://github.com/bradlaw76/SpeckKit-Project-Development
**Agent Defaults:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/AGENT_BEHAVIOR_DEFAULTS.jsonc

---

## Code Standards (Auto-Apply — DEFAULT YES)

When creating or modifying component files, ALWAYS apply the component header
comment block. Do NOT skip unless the user explicitly says to omit comments.

**Template:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md
**Catalog:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md

### Rules
1. Apply the component header comment block to every new component file.
2. Update CHANGELOG, LAST UPDATED, and VERSION when modifying existing components.
3. Fill in all bracketed values based on project context.
4. Only skip if user explicitly says "no comments" or "skip header."

---

## UI References (Ask First — DEFAULT ASK)

UI references are available for platform-specific context. Confirm with the
user before loading.

**Catalog:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md

### Available References

| ID | Platform | Path |
|----|----------|------|
| dynamics365-contact-center-cases-grid | Dynamics 365 | ui-references/dynamics365/ui/contact-center-cases-grid.jsonc |

### Rules
1. Ask: "Should I load UI reference context for [platform]?"
2. Only load if user confirms or the task clearly involves that platform's UI.
3. Use `reusablePatterns` for component conventions.
4. Use `visualIndicators` for color/badge mappings.

---

## Agent Behavior Summary

| Resource | Default | Action |
|----------|---------|--------|
| Code Standards (comment headers) | **YES** | Apply automatically |
| UI References (platform layouts) | **ASK** | Confirm with user |
````

---

## Step 3 — Create `SYSTEM_MANIFEST.json.md`

Create at repo root (or update if it already exists):

```jsonc
{
  "system": {
    "name": "Your Project Name",
    "version": "0.1.0",
    "status": "DEVELOPMENT",
    "type": "hybrid"
  },
  "purpose": {
    "summary": "What this project does"
  },
  "registry": {
    "indexUrl": "https://github.com/bradlaw76/SpeckKit-Project-Development/blob/main/system-manifests/MANIFEST_INDEX.json.md",
    "projectId": "your-project-id"
  },
  "review": {
    "speckitEnabled": true,
    "scope": ["spec", "code-standards"]
  },
  "codeStandards": {
    "source": "SpeckKit-Project-Development",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md",
    "standards": [
      {
        "id": "component-header-block",
        "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md",
        "defaultApply": true
      }
    ]
  },
  "uiReferences": {
    "source": "SpeckKit-Project-Development",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md",
    "references": []
  }
}
```

> **Note:** Leave `uiReferences.references` empty if you don't need UI context yet. Add entries later when relevant.

---

## Step 4 — Commit and Push

```bash
git add .github/copilot-instructions.md SYSTEM_MANIFEST.json.md
git commit -m "[SPECKKIT] Add registry integration"
git push
```

---

## Done

Your project now has:
- **Code standards** auto-applied to every new component
- **UI references** available on request
- **One source of truth** linked back to the SpeckKit registry

---

## What the Agent Should Do When Pointed at This Repo

```
1. Read  → AGENT_BEHAVIOR_DEFAULTS.jsonc     (understand defaults)
2. Read  → code-standards/CODE_STANDARDS_CATALOG.json.md  (load standards)
3. Read  → ui-references/UI_REFERENCE_CATALOG.json.md     (know what's available)
4. Apply → Code standards automatically
5. Ask   → "Do you need UI reference context?" (only if UI work)
6. Ask   → "What platform? What patterns?"
```

---

## Quick Links

| Resource | URL |
|----------|-----|
| This Guide | `SETUP_FOR_PROJECTS.md` |
| Agent Defaults | `AGENT_BEHAVIOR_DEFAULTS.jsonc` |
| Code Standards Catalog | `code-standards/CODE_STANDARDS_CATALOG.json.md` |
| Component Header Template | `code-standards/comments/component-header-block.md` |
| UI Reference Catalog | `ui-references/UI_REFERENCE_CATALOG.json.md` |
| Code Standards Deep Dive | `code-standards/HOW_TO_USE_CODE_STANDARDS.md` |
| UI References Deep Dive | `ui-references/HOW_TO_USE_UI_REFERENCES.md` |
