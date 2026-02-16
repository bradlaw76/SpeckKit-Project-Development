<!--
=============================================================================
DOCUMENT:     Quick Start — SpeckKit UI References
FILE:         ui-references/QUICK_START_FOR_PROJECTS.md
VERSION:      1.0
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-16

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
Fast-track setup guide for referencing SpeckKit UI models from a consumer
VS Code project. Provides exact copy-paste content for setup files.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Quick bootstrap for UI references only (not code standards).
- For unified setup covering both, use SETUP_FOR_PROJECTS.md at repo root.
- Provides the minimal copilot-instructions.md and manifest content.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.0  2026-02-16  Initial version
=============================================================================
-->

# Quick Start: Reference SpeckKit UI References from Your Project

**For projects like `bradlaw76/Generic` or any VS Code repo that wants to consume UI references.**

This is the **one file you need** to get started. Follow the steps below.

---

## What You'll Set Up

```
YourProject/
├── .github/
│   └── copilot-instructions.md     ← AI agent skill (Copilot context)
├── .vscode/
│   └── settings.json               ← Optional: workspace config
├── SYSTEM_MANIFEST.json.md         ← Required: project manifest with uiReferences
└── ... your code ...
```

---

## Step 1 — Create `.github/copilot-instructions.md`

This file tells GitHub Copilot (and other AI agents) how to use UI references as context.

Create the `.github/` folder and file in your project root:

```bash
mkdir .github
```

Then create `.github/copilot-instructions.md` with this content:

```markdown
# Copilot Instructions

## Project Context

This project is governed by the SpeckKit registry.

## UI Reference Skills

This project uses UI references from the SpeckKit UI Reference Catalog
for understanding target platform layouts, components, and patterns.

### Available References

| Reference ID | Platform | Description |
|-------------|----------|-------------|
| dynamics365-contact-center-cases-grid | Dynamics 365 | Contact Center Cases Grid with Copilot panel |

### How to Use

When working on UI-related tasks, load the relevant reference for context:

- **Catalog:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md
- **Dynamics 365 Cases Grid:** https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc

Use the `reusablePatterns` section for component conventions.
Use the `visualIndicators` section for color/badge mappings.
Use the `layout` section for responsive behavior rules.

### Registry

- Registry: https://github.com/bradlaw76/SpeckKit-Project-Development
- Catalog: /ui-references/UI_REFERENCE_CATALOG.json.md
- Guide: /ui-references/HOW_TO_USE_UI_REFERENCES.md
```

---

## Step 2 — Create or Update `SYSTEM_MANIFEST.json.md`

If your project doesn't have a manifest yet, create one at the repo root.

**Minimum manifest with UI references:**

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
    "scope": ["spec", "ux", "ui-references"]
  },
  "uiReferences": {
    "source": "SpeckKit-Project-Development",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md",
    "references": [
      {
        "id": "dynamics365-contact-center-cases-grid",
        "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365/ui/contact-center-cases-grid.jsonc",
        "usage": "Context for Dynamics 365 case management UI patterns",
        "patternsUsed": ["threeColumnLayout", "dataverseGrid", "copilotPanel"]
      }
    ]
  }
}
```

---

## Step 3 — Commit and Push

```bash
git add .github/copilot-instructions.md SYSTEM_MANIFEST.json.md
git commit -m "[SPECKKIT] Add UI reference integration and Copilot instructions"
git push
```

---

## That's It

Your project now:

1. **Declares** which UI references it uses (in the manifest)
2. **Teaches** Copilot about those references (via copilot-instructions.md)
3. **Links back** to the SpeckKit registry for governance

---

## Finding References

All available UI references are organized by **platform** and **area**:

```
ui-references/
├── dynamics365/          ← Platform
│   └── ui/               ← Area
│       └── contact-center-cases-grid.jsonc
├── powerpages/           ← Future platform
│   └── ui/
├── powerapps/            ← Future platform
│   └── ui/
```

Browse the catalog for the full list:
- **Catalog:** `ui-references/UI_REFERENCE_CATALOG.json.md`
- **Full Guide:** `ui-references/HOW_TO_USE_UI_REFERENCES.md`

---

## Common Questions

**Q: My repo doesn't have a `.github/` folder — is that okay?**
A: Yes — just create it. It's a standard GitHub convention folder. Run `mkdir .github` and add the file.

**Q: Do I need to install anything?**
A: No. UI references are just JSONC files hosted on GitHub. AI agents read them via URL or local path.

**Q: Can I reference multiple UI references?**
A: Yes — add multiple entries to the `references` array in your manifest.

**Q: What if I add my own platform references later?**
A: Add them to the `ui-references/<platform>/<area>/` folder in SpeckKit-Project-Development and update the catalog.
