# How to Use SpeckKit UI References in VS Code Projects

**Purpose:** This guide explains how to consume the **SpeckKit UI Reference Catalog** from any VS Code project — as a shared context source, a skill for AI agents, or a reusable spec component.

**Catalog Location:** `/ui-references/UI_REFERENCE_CATALOG.json.md`
**Registry:** `SpeckKit-Project-Development`
**Effective Date:** February 16, 2026

---

## What Are UI References?

UI References are **JSONC-based UI description models** stored in the SpeckKit registry. Each reference captures:

- The **full layout structure** of a UI screen
- **Component descriptions** (headers, grids, navigation, AI panels)
- **Visual indicators** (colors, badges, status mappings)
- **Functional context** (user roles, tasks, purpose)
- **Reusable patterns** that can be extracted individually

They are **not code** — they are structured, machine-readable descriptions of real application UIs that AI agents and developers can use as context.

---

## Why Use UI References?

| Benefit | Description |
|---------|-------------|
| **Shared Context** | Any project can reference the same UI model without re-describing it |
| **AI Skill** | Copilot, SpeckKit, or any AI agent can load the reference to understand UI patterns |
| **Consistency** | Multiple projects building for the same platform share a single source of truth |
| **Reusability** | Extract specific patterns (e.g., grid layouts, Copilot panels) without re-capturing |
| **Versioned** | References are versioned in Git — changes are tracked and auditable |

---

## Quick Start (3 Steps)

### Step 1 — Identify the Reference You Need

Browse the catalog:

```
ui-references/UI_REFERENCE_CATALOG.json.md
```

Each entry has:
- `id` — Unique identifier (e.g., `dynamics365-contact-center-cases-grid`)
- `file` — The JSONC file containing the full UI model
- `tags` — Searchable keywords
- `patterns` — Extractable component patterns

### Step 2 — Reference It in Your Project

Add a `uiReferences` block to your project's `SYSTEM_MANIFEST.json.md`:

```jsonc
{
  "uiReferences": {
    "source": "SpeckKit-Project-Development",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md",
    "references": [
      {
        "id": "dynamics365-contact-center-cases-grid",
        "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365-contact-center-cases-grid.jsonc",
        "usage": "Context for Dynamics 365 case management UI patterns",
        "patternsUsed": ["threeColumnLayout", "dataverseGrid", "copilotPanel"]
      }
    ]
  }
}
```

### Step 3 — Use It

Your project (and any AI agent working in it) can now resolve the reference and load the UI model as context.

---

## Usage Modes

### Mode 1: Full Context (Load Entire Reference)

Load the complete JSONC file to give an AI agent or developer full understanding of the UI.

**When to use:**
- Building a new feature against this exact UI
- Writing tests that validate UI behavior
- Creating documentation that describes the interface

**How:**
```
Reference: dynamics365-contact-center-cases-grid
Load: ui-references/dynamics365-contact-center-cases-grid.jsonc
```

### Mode 2: Pattern Extraction (Load Specific Components)

Extract only the patterns you need from the `reusablePatterns` section.

**When to use:**
- You only need the grid layout pattern
- You want to replicate the Copilot panel in a different context
- You're building a component library

**Available patterns:**

| Pattern | Description |
|---------|-------------|
| `threeColumnLayout` | Navigation + Content + AI sidebar |
| `dataverseGrid` | Standard Dynamics 365 entity list grid |
| `copilotPanel` | AI assistant with prompts and input |
| `caseStreamNav` | Vertical scrollable case list |
| `priorityBadges` | Color-coded priority indicators |

**How to reference a specific pattern:**
```jsonc
{
  "uiReferences": {
    "references": [
      {
        "id": "dynamics365-contact-center-cases-grid",
        "patternsUsed": ["copilotPanel", "priorityBadges"]
      }
    ]
  }
}
```

### Mode 3: AI Skill (Copilot / Agent Context)

Use the UI reference as a **skill** — a structured knowledge source that an AI agent loads to inform its behavior.

**When to use:**
- Teaching an AI agent about Dynamics 365 UI patterns
- Giving Copilot context about a target platform
- Enabling AI to generate code that matches existing UI conventions

**In a `.github/copilot-instructions.md` or agent system prompt:**

```markdown
## UI Context Skill

This project targets the Dynamics 365 Contact Center workspace.
For UI layout, component structure, and visual pattern reference, load:

- Catalog: /ui-references/UI_REFERENCE_CATALOG.json.md
- Reference: /ui-references/dynamics365-contact-center-cases-grid.jsonc

Use the `reusablePatterns` section to understand component conventions.
Use the `visualIndicators` section for color/badge mappings.
Use the `layout` section for responsive behavior rules.
```

**In a VS Code workspace settings file (`.vscode/settings.json`):**

```jsonc
{
  "speckkit.uiReferences": {
    "enabled": true,
    "catalogPath": "../SpeckKit-Project-Development/ui-references/UI_REFERENCE_CATALOG.json.md",
    "autoLoad": ["dynamics365-contact-center-cases-grid"]
  }
}
```

---

## Referencing from Another VS Code Project

### Option A: Git Submodule (Recommended for Teams)

```bash
git submodule add https://github.com/bradlaw76/SpeckKit-Project-Development.git .speckkit-registry
```

Then reference locally:
```
.speckkit-registry/ui-references/dynamics365-contact-center-cases-grid.jsonc
```

### Option B: Raw GitHub URL (Quick Access)

```
https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365-contact-center-cases-grid.jsonc
```

### Option C: Local Workspace Reference (Multi-Root Workspace)

If both repos are in the same parent folder:
```
../SpeckKit-Project-Development/ui-references/dynamics365-contact-center-cases-grid.jsonc
```

### Option D: Copy to Project (Snapshot)

Copy the JSONC file into your project's `spec/` or `references/` folder. Note: this creates a snapshot — it won't auto-update.

---

## Adding a New UI Reference

### Step 1 — Capture the UI

Take a screenshot of the target UI screen.

### Step 2 — Create the JSONC Description

Use the existing reference as a template. Include these sections:

```jsonc
{
  "$schema": { /* SpeckKit UI Reference metadata */ },
  "app": { /* Platform, area, theme */ },
  "globalHeader": { /* Top navigation */ },
  "contextBar": { /* Breadcrumbs, tabs */ },
  "leftPane": { /* Navigation sidebar */ },
  "mainContent": { /* Primary content area */ },
  "rightPane": { /* Side panels (e.g., Copilot) */ },
  "layout": { /* Column structure, responsive rules */ },
  "functionalPurpose": { /* User role, tasks */ },
  "reusablePatterns": { /* Extractable component patterns */ }
}
```

### Step 3 — Save to the Catalog

1. Save the JSONC file to `ui-references/<id>.jsonc`
2. Save the source image to `ui-references/<id>.png`
3. Add an entry to `UI_REFERENCE_CATALOG.json.md`

### Step 4 — Commit

```bash
git add ui-references/
git commit -m "[UI-REF] Add reference: <id>"
```

---

## File Naming Convention

| File | Pattern |
|------|---------|
| JSONC Model | `<platform>-<area>-<view>.jsonc` |
| Source Image | `<platform>-<area>-<view>.png` |
| Catalog | `UI_REFERENCE_CATALOG.json.md` |

Examples:
- `dynamics365-contact-center-cases-grid.jsonc`
- `dynamics365-contact-center-cases-grid.png`
- `powerpages-appointment-booking-form.jsonc`

---

## Integration with SpeckKit Reviews

When a project declares `uiReferences` in its manifest, SpeckKit can:

1. **Resolve** the reference from the catalog
2. **Load** the UI model as review context
3. **Compare** implemented UI against the reference patterns
4. **Flag** deviations from declared patterns

This enables **UI-aware spec reviews** without manual screenshots in every project.

---

## FAQ

**Q: Are UI references binding specs?**
A: No. They are descriptive context models. Binding rules belong in `SPEC.md` or `UX_INVARIANTS.md` within each project.

**Q: Can I use references from a private registry?**
A: Yes — use Git submodules or local workspace paths. Raw URLs require the repo to be public.

**Q: What if the real UI changes?**
A: Update the JSONC file and source image in the registry. Projects referencing it will pick up changes on next pull (unless using snapshots).

**Q: Can I create references for non-Dynamics platforms?**
A: Absolutely. The JSONC format is platform-agnostic. Use it for Power Pages, Power Apps, custom web apps, or any UI.

---

## Summary

| What | Where |
|------|-------|
| UI Reference Catalog | `ui-references/UI_REFERENCE_CATALOG.json.md` |
| Individual References | `ui-references/<id>.jsonc` |
| Source Images | `ui-references/<id>.png` |
| This Guide | `ui-references/HOW_TO_USE_UI_REFERENCES.md` |
| Registry Root | `system-manifests/MANIFEST_INDEX.json.md` |

**The catalog is the single source of truth for all UI references in the SpeckKit ecosystem.**
