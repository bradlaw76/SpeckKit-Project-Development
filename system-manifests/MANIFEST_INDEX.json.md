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
    }
  ]
}
