<!--
=============================================================================
DOCUMENT:     SpeckKit System Manifest Registry Index (Root Copy)
FILE:         MANIFEST_INDEX.json.md
VERSION:      1.1
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-16

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
Root-level convenience copy of the authoritative manifest registry index.
Lists all governed projects, catalog references, agent behavior defaults,
and the unified setup guide.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Convenience copy of system-manifests/MANIFEST_INDEX.json.md.
- Kept in sync with the authoritative copy under /system-manifests/.
- Machine-readable JSON wrapped in Markdown for GitHub rendering.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.1  2026-02-16  Added codeStandardsCatalog, agentBehavior, setupGuide
v1.0  2026-02-10  Initial version — registry and UI reference catalog only
=============================================================================
-->

{
  "registry": {
    "name": "SpeckKit System Manifest Registry",
    "owner": "bradlaw76",
    "repo": "https://github.com/bradlaw76/SpeckKit-Project-Development",
    "path": "/system-manifests",
    "version": "1.0",
    "purpose": "Authoritative index of all system manifests governed and reviewed using SpeckKit",
    "lastUpdated": "2026-02-16"
  },

  "uiReferenceCatalog": {
    "path": "/ui-references",
    "catalogFile": "UI_REFERENCE_CATALOG.json.md",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md",
    "guideFile": "HOW_TO_USE_UI_REFERENCES.md",
    "purpose": "Reusable UI description models consumable by any SpeckKit-governed project",
    "status": "ACTIVE"
  },

  "codeStandardsCatalog": {
    "path": "/code-standards",
    "catalogFile": "CODE_STANDARDS_CATALOG.json.md",
    "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md",
    "guideFile": "HOW_TO_USE_CODE_STANDARDS.md",
    "purpose": "Reusable code documentation standards and templates — auto-applied by agents",
    "defaultApply": true,
    "status": "ACTIVE"
  },

  "agentBehavior": {
    "path": "/AGENT_BEHAVIOR_DEFAULTS.jsonc",
    "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/AGENT_BEHAVIOR_DEFAULTS.jsonc",
    "purpose": "Defines auto-apply vs. ask-first defaults for all registry resources"
  },

  "setupGuide": {
    "path": "/SETUP_FOR_PROJECTS.md",
    "url": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/SETUP_FOR_PROJECTS.md",
    "purpose": "Unified setup guide for consumer projects — single entry point"
  },

  "projects": [
    {
      "id": "appointment-scheduling",
      "name": "Appointment Scheduling",
      "repo": "https://github.com/bradlaw76/appointment-scheduling",
      "manifestUrl": "https://github.com/bradlaw76/appointment-scheduling/blob/main/SYSTEM_MANIFEST.json.md",
      "status": "DEVELOPMENT",
      "type": "hybrid",
      "speckitReviewable": true
    },
    {
      "id": "generic-code-snippet-manager",
      "name": "Generic Code Snippet Manager",
      "repo": "https://github.com/bradlaw76/Generic.CodeSnippetManager",
      "manifestUrl": "https://github.com/bradlaw76/Generic.CodeSnippetManager/blob/main/SYSTEM_MANIFEST.json.md",
      "status": "DEVELOPMENT",
      "type": "spec-governed",
      "speckitReviewable": true
    }
  ]
}
