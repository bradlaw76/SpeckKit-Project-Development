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
