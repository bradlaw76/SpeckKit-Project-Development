<!--
=============================================================================
DOCUMENT:     SpeckKit Code Standards Catalog
FILE:         code-standards/CODE_STANDARDS_CATALOG.json.md
VERSION:      1.0
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-16

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
Machine-readable index of all reusable code documentation standards in the
SpeckKit registry. Currently includes the component-header-block template.
Agents auto-apply these standards by default.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Catalog index — agents read this to discover available code standards.
- Defines agent behavior (defaultApply: true) for code standards.
- Lists each standard with its path, raw URL, and metadata.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.0  2026-02-16  Initial version — component-header-block standard
=============================================================================
-->

{
  "catalog": {
    "name": "SpeckKit Code Standards Catalog",
    "owner": "bradlaw76",
    "repo": "https://github.com/bradlaw76/SpeckKit-Project-Development",
    "path": "/code-standards",
    "version": "1.0",
    "purpose": "Reusable code documentation standards and templates — consumable by any SpeckKit-governed VS Code project as an agent skill or team convention",
    "lastUpdated": "2026-02-16"
  },

  "agentBehavior": {
    "description": "Default behavior rules for AI agents consuming code standards",
    "defaultApply": true,
    "agentPrompt": "Apply code standards (comment headers, documentation blocks) automatically unless the user explicitly opts out.",
    "confirmBeforeApplying": false,
    "note": "For UI reference agent behavior, see /AGENT_BEHAVIOR_DEFAULTS.jsonc"
  },

  "folderConvention": {
    "pattern": "code-standards/<category>/<standard-file>",
    "example": "code-standards/comments/component-header-block.md",
    "categories": [
      {
        "id": "comments",
        "name": "Comment Standards",
        "description": "Structured comment blocks for component files, modules, and APIs"
      }
    ]
  },

  "standards": [
    {
      "id": "component-header-block",
      "name": "Component Header Comment Block",
      "category": "comments",
      "path": "comments/component-header-block.md",
      "description": "Self-documenting HTML comment header for any component file — covers identity, architecture, features, prerequisites, security, testing, and changelog",
      "applicableTo": ["Power Pages", "React", "jQuery", "Web API", "HTML", "JavaScript", "CSS", "Liquid"],
      "defaultApply": true,
      "tags": ["comments", "documentation", "component", "header", "power-pages", "web-api", "crud"],
      "created": "2026-02-16",
      "status": "ACTIVE"
    },
    {
      "id": "component-header-block-powershell",
      "name": "Component Header Comment Block — PowerShell Variant",
      "category": "comments",
      "path": "comments/component-header-block-powershell.md",
      "description": "PowerShell-native (<# #>) header block for .ps1 and .psm1 files — same SpeckKit sections as the HTML variant, adapted for scripting context. MUST be used instead of component-header-block for any PowerShell file.",
      "applicableTo": ["PowerShell", ".ps1", ".psm1", ".psd1"],
      "defaultApply": true,
      "tags": ["comments", "documentation", "header", "powershell", "script", "bootstrap", "build"],
      "created": "2026-07-19",
      "status": "ACTIVE"
    }
  ],

  "usage": {
    "howToReference": "See HOW_TO_USE_CODE_STANDARDS.md for full integration guide",
    "quickStart": "See QUICK_START_FOR_PROJECTS.md for step-by-step consumer setup",
    "setupGuide": "See /SETUP_FOR_PROJECTS.md for the unified single-file setup (recommended)",
    "quickReference": {
      "directUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md",
      "powershellVariantUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block-powershell.md",
      "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md"
    }
  }
}
