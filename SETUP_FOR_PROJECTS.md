<!--
=============================================================================
DOCUMENT:     SpeckKit Setup Guide for Consumer Projects
FILE:         SETUP_FOR_PROJECTS.md
VERSION:      1.1
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-16

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
The ONE unified entry point for connecting any VS Code project to the
SpeckKit registry. Contains the decision tree, profile-based scaffolding,
exact copy-paste content for .github/copilot-instructions.md and
SYSTEM_MANIFEST.json.md, cross-project referencing, and the agent
discovery flow.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Single entry point — agents and developers start HERE.
- Includes profile selection and template file scaffolding (Step 0).
- Replaces the need to read multiple quick-start guides.
- Referenced by AGENT_BEHAVIOR_DEFAULTS.jsonc, README.md, and all catalogs.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.1  2026-02-16  Added Step 0 (profile scaffolding) and cross-project
                  referencing section
v1.0  2026-02-16  Initial version — unified setup guide
=============================================================================
-->

# SpeckKit Registry — Setup Guide for Consumer Projects

**This is the ONE file an AI agent or developer needs to set up any VS Code project to use SpeckKit standards and references.**

**Registry:** `https://github.com/bradlaw76/SpeckKit-Project-Development`
**Entry Point:** This file (`SETUP_FOR_PROJECTS.md`)
**Agent Defaults:** `AGENT_BEHAVIOR_DEFAULTS.jsonc`
**Last Updated:** 2026-02-16

---

<!-- BELOW IS THE INSTRUCTION THAT ARE USED IN A NEW REPO TO UTLIZE THIS STANDARD BUILR PROCESS
Set up this project using the SpeckKit registry at https://github.com/bradlaw76/SpeckKit-Project-Development — read SETUP_FOR_PROJECTS.md
-->

---

## What This Registry Provides

| Resource | Description | Agent Default |
|----------|-------------|---------------|
| **Code Standards** | Structured comment headers for component files | **YES — auto-apply** |
| **UI References** | Platform UI description models (e.g., Dynamics 365) | **ASK first** |

---

## Step 0 — Choose Your Project Profile

Before creating any files, determine which **project profile** fits. Each profile defines a set of required and optional template files. The profiles are defined in `system-manifests/PROJECT_TEMPLATE.json`.

### Profile Decision Tree

```
What kind of project is this?
├── Full spec + binding certification?       → spec-governed
├── UX prototype / demo only?                → ux-demo
├── Spec + UX + acceptance testing?          → hybrid
├── Only consuming UI references?            → ui-reference
└── Only consuming code standards?           → code-standard
```

### Required & Optional Files by Profile

| Profile | Required Files | Optional Files |
|---------|---------------|----------------|
| **spec-governed** | `SYSTEM_MANIFEST.json.md`, `SPEC.md`, `BINDING_CERTIFICATION.md` | `UX_INVARIANTS.md`, `TEST_ACCEPTANCE.md` |
| **ux-demo** | `SYSTEM_MANIFEST.json.md`, `UX_INVARIANTS.md`, `TEST_ACCEPTANCE.md` | `SPEC.md` |
| **hybrid** | `SYSTEM_MANIFEST.json.md`, `SPEC.md`, `UX_INVARIANTS.md`, `TEST_ACCEPTANCE.md`, `BINDING_CERTIFICATION.md` | — |
| **ui-reference** | `SYSTEM_MANIFEST.json.md` | `SPEC.md`, `UX_INVARIANTS.md` |
| **code-standard** | `SYSTEM_MANIFEST.json.md` | `SPEC.md` |

### What the Agent Should Do

1. **Ask:** "What type of project is this — spec-governed, ux-demo, hybrid, ui-reference, or code-standard?"
2. **Scaffold** all required files for the chosen profile (even as empty stubs with TODO markers).
3. **Mention** optional files: "You may also want `UX_INVARIANTS.md` — should I create a stub?"
4. **Set** the `type` field in `SYSTEM_MANIFEST.json.md` to match the chosen profile.

### Stub Templates

When scaffolding, create each required file with a minimal starter. Example for `SPEC.md`:

```markdown
# [Project Name] — Specification

**Status:** DRAFT
**Version:** 0.1.0
**Created:** YYYY-MM-DD

---

## Purpose

<!-- TODO: Describe what this project does and its core objectives. -->

## Scope

<!-- TODO: Define what is in-scope and out-of-scope. -->

## Requirements

<!-- TODO: List functional and non-functional requirements. -->
```

Example for `BINDING_CERTIFICATION.md`:

```markdown
# [Project Name] — Binding Certification

**Status:** NOT CERTIFIED
**Spec Version:** 0.1.0
**Certification Date:** —

---

## Certification Checklist

- [ ] Spec reviewed and approved
- [ ] All requirements implemented
- [ ] Test acceptance criteria met
- [ ] No known deviations from spec
```

Example for `UX_INVARIANTS.md`:

```markdown
# [Project Name] — UX Invariants

**Status:** DRAFT
**Version:** 0.1.0

---

## Invariants

<!-- TODO: List UX behaviors that must NEVER break. Example: -->
<!-- - The search box must always be visible above the data grid. -->
<!-- - Modal dialogs must trap keyboard focus. -->
```

Example for `TEST_ACCEPTANCE.md`:

```markdown
# [Project Name] — Test Acceptance Criteria

**Status:** DRAFT
**Version:** 0.1.0

---

## Acceptance Tests

<!-- TODO: List test cases that must pass for each release. Example: -->
<!-- ✔ Load data without errors -->
<!-- ✔ Search returns filtered results -->
<!-- ✔ Create record persists successfully -->
```

> **Tip:** After scaffolding, proceed to Steps 1–4 to wire up the SpeckKit registry connection.

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
- **Profile-appropriate template files** scaffolded from Step 0
- **Code standards** auto-applied to every new component
- **UI references** available on request
- **One source of truth** linked back to the SpeckKit registry

---

## Cross-Project Referencing

When two or more SpeckKit-governed projects need to reference each other — e.g., a shared component library used by multiple apps — use the patterns below.

### How It Works

Every governed project has a `SYSTEM_MANIFEST.json.md` with a `registry.projectId`. Projects reference each other by project ID and manifest URL.

### Adding a Cross-Project Reference

Add a `projectReferences` section to your `SYSTEM_MANIFEST.json.md`:

```jsonc
{
  "system": {
    "name": "My App",
    "version": "1.0.0",
    "status": "ACTIVE",
    "type": "hybrid"
  },
  // ... other sections ...

  "projectReferences": {
    "description": "Other SpeckKit-governed projects this project depends on or relates to",
    "references": [
      {
        "projectId": "appointment-scheduling",
        "relationship": "depends-on",
        "manifestUrl": "https://github.com/bradlaw76/appointment-scheduling/blob/main/SYSTEM_MANIFEST.json.md",
        "reason": "Shares Dataverse entity schemas and Web API patterns"
      },
      {
        "projectId": "generic-code-snippet-manager",
        "relationship": "shares-patterns",
        "manifestUrl": "https://github.com/bradlaw76/Generic/blob/main/SYSTEM_MANIFEST.json.md",
        "reason": "Uses the same grid layout patterns and Copilot panel conventions"
      }
    ]
  }
}
```

### Relationship Types

| Relationship | Meaning |
|-------------|---------|
| `depends-on` | This project consumes APIs, schemas, or components from the referenced project |
| `shares-patterns` | Both projects share UI patterns, code conventions, or entity models |
| `extends` | This project extends or builds on the referenced project |
| `sibling` | Related projects under the same product umbrella |

### Agent Behavior for Cross-References

When an agent encounters `projectReferences`:

1. **Read** the referenced project's `SYSTEM_MANIFEST.json.md` to understand its scope and standards.
2. **Inherit** shared code standards — if both projects use SpeckKit code standards, the agent should apply them consistently.
3. **Ask** before loading UI references from a referenced project: "Project X uses a Dynamics 365 grid layout — should I load that context?"
4. **Never** modify a referenced project without explicit user approval.

### Discovering All Governed Projects

The SpeckKit registry's `MANIFEST_INDEX.json.md` lists all governed projects:

```
https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/system-manifests/MANIFEST_INDEX.json.md
```

An agent can read this index to:
- Find a project by ID
- Discover what standards/references each project uses
- Suggest cross-references when projects share platforms or patterns

---

## What the Agent Should Do When Pointed at This Repo

```
1. Read  → AGENT_BEHAVIOR_DEFAULTS.jsonc     (understand defaults)
2. Read  → system-manifests/PROJECT_TEMPLATE.json  (know profiles)
3. Ask   → "What project profile? (spec-governed / ux-demo / hybrid / ui-reference / code-standard)"
4. Scaffold → Required + optional files for chosen profile
5. Read  → code-standards/CODE_STANDARDS_CATALOG.json.md  (load standards)
6. Read  → ui-references/UI_REFERENCE_CATALOG.json.md     (know what's available)
7. Apply → Code standards automatically
8. Ask   → "Do you need UI reference context?" (only if UI work)
9. Ask   → "Does this project reference other SpeckKit projects?"
```

---

## Quick Links

| Resource | URL |
|----------|-----|
| This Guide | `SETUP_FOR_PROJECTS.md` |
| Agent Defaults | `AGENT_BEHAVIOR_DEFAULTS.jsonc` |
| Project Profiles | `system-manifests/PROJECT_TEMPLATE.json` |
| Code Standards Catalog | `code-standards/CODE_STANDARDS_CATALOG.json.md` |
| Component Header Template | `code-standards/comments/component-header-block.md` |
| UI Reference Catalog | `ui-references/UI_REFERENCE_CATALOG.json.md` |
| Code Standards Deep Dive | `code-standards/HOW_TO_USE_CODE_STANDARDS.md` |
| UI References Deep Dive | `ui-references/HOW_TO_USE_UI_REFERENCES.md` |
