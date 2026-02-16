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
