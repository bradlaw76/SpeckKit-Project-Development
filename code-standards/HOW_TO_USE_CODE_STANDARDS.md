# How to Use SpeckKit Code Standards in VS Code Projects

**Purpose:** This guide explains how to consume the **SpeckKit Code Standards Catalog** from any VS Code project — so AI agents automatically apply documentation standards and developers follow consistent patterns.

**Catalog Location:** `/code-standards/CODE_STANDARDS_CATALOG.json.md`
**Registry:** `SpeckKit-Project-Development`
**Effective Date:** February 16, 2026

---

## What Are Code Standards?

Code Standards are **reusable documentation templates and conventions** stored in the SpeckKit registry. They define how code should be documented — structured comment blocks, file headers, changelog formats, and architecture annotations.

They are **not linting rules or formatters** — they are human-and-AI-readable templates that ensure every component is self-documenting.

---

## Agent Default Behavior

**Code standards default to YES.** When an AI agent is creating or modifying a component file, it should apply the relevant code standard automatically.

| Standard Type | Default | Agent Behavior |
|--------------|---------|----------------|
| **Code Standards** (comments, headers) | **YES — auto-apply** | Apply without asking. Skip only if user opts out. |
| **UI References** (Dynamics layouts) | **ASK first** | Confirm with user before loading as context. |

This distinction exists because:
- Comment headers are **always useful** — they document what exists
- UI references are **contextual** — they're only relevant when working on that platform's UI

---

## Available Standards

### Component Header Comment Block

**ID:** `component-header-block`
**Path:** `code-standards/comments/component-header-block.md`
**Default Apply:** YES

A comprehensive HTML comment block for any component file. Covers:

| Section | What It Documents |
|---------|-------------------|
| Identity | Component name, file path, version, author |
| Architecture | Data source, entity, auth model, rendering |
| Features | Search, filtering, sorting, pagination, CRUD |
| Prerequisites | Site settings, table permissions, dependencies |
| Security | CSRF, auth scope, data exposure, roles |
| Style Isolation | Scoped CSS, root container ID |
| Limitations | Known issues and constraints |
| Test Cases | Verification checklist |
| Changelog | Version history |
| Non-Negotiables | Hard rules that must never be violated |

---

## Quick Start (3 Steps)

### Step 1 — Reference the Standard in Your Manifest

Add a `codeStandards` block to your project's `SYSTEM_MANIFEST.json.md`:

```jsonc
{
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
  }
}
```

### Step 2 — Add to Copilot Instructions

In your `.github/copilot-instructions.md`:

```markdown
## Code Standards (Auto-Apply)

This project follows SpeckKit code standards. When creating or modifying
component files, ALWAYS apply the component header comment block.

- Standard: https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md
- Catalog: https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md

### Rules
- Apply the comment header to every new component file automatically.
- Update the CHANGELOG section when modifying an existing component.
- Update LAST UPDATED and VERSION when making changes.
- Do NOT skip the header unless the user explicitly says to omit comments.
```

### Step 3 — Use It

Every new component file your agent creates will include the header block. Existing files should have the header added when they're next modified.

---

## How an Agent Should Use This

When an agent points at this repo (SpeckKit-Project-Development), it should:

1. **Read the catalog** at `/code-standards/CODE_STANDARDS_CATALOG.json.md`
2. **Check `agentBehavior`** to understand defaults
3. **For code standards** (`defaultApply: true`): Apply automatically
4. **For UI references** (`confirmBeforeApplying: true`): Ask the user first
5. **Load the template** from the standard's `path`
6. **Fill in the bracketed values** based on the current project context

### Example Agent Flow

```
Agent: "I'm creating a new component for case management."

1. Check: Does the project reference code-standards? → YES
2. Check: Is component-header-block defaultApply? → YES  
3. Action: Apply the header block automatically
4. Fill: [Component Name] = "Case Management Grid"
5. Fill: [repo-path/to/file] = "src/components/case-grid.js"
6. Fill: [ENVIRONMENT] based on project context
7. Proceed with implementation
```

---

## Referencing from Another VS Code Project

### Option A: Git Submodule

```bash
git submodule add https://github.com/bradlaw76/SpeckKit-Project-Development.git .speckkit-registry
```

Then reference:
```
.speckkit-registry/code-standards/comments/component-header-block.md
```

### Option B: Raw GitHub URL

```
https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md
```

### Option C: Local Workspace

```
../SpeckKit-Project-Development/code-standards/comments/component-header-block.md
```

---

## Adding New Standards

### Step 1 — Create the Standard File

Save to `code-standards/<category>/<standard-name>.md`

### Step 2 — Add to Catalog

Add an entry to `CODE_STANDARDS_CATALOG.json.md`:

```jsonc
{
  "id": "your-standard-id",
  "name": "Your Standard Name",
  "category": "comments",
  "path": "comments/your-standard.md",
  "description": "What it does",
  "defaultApply": true,
  "tags": ["relevant", "tags"],
  "created": "YYYY-MM-DD",
  "status": "ACTIVE"
}
```

### Step 3 — Commit

```bash
git add code-standards/
git commit -m "[CODE-STD] Add standard: <category>/<name>"
```

---

## Folder Structure

```
code-standards/
├── CODE_STANDARDS_CATALOG.json.md    ← Master index
├── HOW_TO_USE_CODE_STANDARDS.md      ← This guide
├── QUICK_START_FOR_PROJECTS.md       ← Consumer bootstrap
└── comments/                         ← Category: comment standards
    └── component-header-block.md     ← The template
```

Future categories:
- `naming/` — Naming conventions
- `api-docs/` — API documentation templates
- `changelog/` — Changelog format standards
- `testing/` — Test documentation patterns

---

## Summary

| What | Where |
|------|-------|
| Code Standards Catalog | `code-standards/CODE_STANDARDS_CATALOG.json.md` |
| Component Header Block | `code-standards/comments/component-header-block.md` |
| This Guide | `code-standards/HOW_TO_USE_CODE_STANDARDS.md` |
| Quick Start | `code-standards/QUICK_START_FOR_PROJECTS.md` |
| Agent Behavior Rules | `agentBehavior` in the catalog JSON |

**Code standards are auto-applied. If in doubt, include the header.**
