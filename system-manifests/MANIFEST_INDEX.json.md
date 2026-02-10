{
  "registry": {
    "name": "SpeckKit System Manifest Registry",
    "owner": "bradlaw76",
    "repo": "https://github.com/bradlaw76/SpeckKit-Project-Development",
    "path": "/system-manifests",
    "version": "1.0",
    "purpose": "Authoritative index of all system manifests governed and reviewed using SpeckKit",
    "lastUpdated": "2026-02-10"
  },

  "projects": [
    {
      "projectId": "appointment-scheduling",
      "name": "Appointment Scheduling Demo (Power Pages)",
      "repository": "https://github.com/bradlaw76/<PROJECT_REPO_NAME>",
      "manifestUrl": "https://raw.githubusercontent.com/bradlaw76/<PROJECT_REPO_NAME>/main/SYSTEM_MANIFEST.json.md",
      "profile": "hybrid",
      "status": "ACTIVE",
      "type": "demo-hybrid",
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
      "type": "spec-governed",
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
