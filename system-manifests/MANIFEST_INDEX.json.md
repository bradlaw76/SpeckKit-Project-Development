<!--
=============================================================================
DOCUMENT:     SpeckKit System Manifest Registry Index (Authoritative)
FILE:         system-manifests/MANIFEST_INDEX.json.md
VERSION:      1.2
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-17

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
The authoritative registry index for all SpeckKit-governed projects. Lists
project manifests, catalog cross-references, agent behavior defaults, and
the unified setup guide entry point.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- AUTHORITATIVE source — this is the single source of truth.
- Root-level MANIFEST_INDEX.json.md is a convenience copy of this file.
- Agents resolve project lookups and catalog paths from this index.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.2  2026-02-17  Added generic-activity-timeline (spec-governed, ACTIVE)
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
    "lastUpdated": "2026-02-17"
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
      "projectId": "appointment-scheduling",
      "name": "Appointment Scheduling Demo (Power Pages)",
      "repository": "https://github.com/bradlaw76/PowerPagesAppointment-Scheduling",
      "manifestUrl": "https://raw.githubusercontent.com/bradlaw76/PowerPagesAppointment-Scheduling/main/SYSTEM_MANIFEST.json.md",
      "profile": "hybrid",
      "status": "ACTIVE",
      "speckitReviewable": true,
      "spec": {
        "type": "directory",
        "path": "spec/",
        "entryPoint": "01-intent.md",
        "reviewMode": "aggregate"
      }
    },
    {
      "projectId": "generic-code-snippet-manager",
      "name": "Generic Code Snippet Manager",
      "repository": "https://github.com/bradlaw76/Generic.CodeSnippetManager",
      "manifestUrl": "https://raw.githubusercontent.com/bradlaw76/Generic.CodeSnippetManager/main/SYSTEM_MANIFEST.json.md",
      "profile": "spec-governed",
      "status": "DEVELOPMENT",
      "speckitReviewable": true,
      "spec": {
        "type": "directory",
        "path": "spec/",
        "entryPoint": "01-intent.md",
        "reviewMode": "aggregate"
      }
    },
    {
      "projectId": "generic-activity-timeline",
      "name": "Generic Activity Timeline (Dynamics 365)",
      "repository": "https://github.com/bradlaw76/Generic.ActivityTimeline",
      "manifestUrl": "https://raw.githubusercontent.com/bradlaw76/Generic.ActivityTimeline/main/SYSTEM_MANIFEST.json.md",
      "profile": "spec-governed",
      "status": "ACTIVE",
      "speckitReviewable": true,
      "spec": {
        "type": "directory",
        "path": "specs/001-timeline-v3-sentiment/",
        "entryPoint": "spec.md",
        "reviewMode": "aggregate"
      }
    }
  ]
}
