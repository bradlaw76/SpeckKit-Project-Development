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
    "description": "Default behavior rules for AI agents consuming these standards",
    "standards": {
      "code-standards": {
        "defaultApply": true,
        "agentPrompt": "Apply code standards (comment headers, documentation blocks) automatically unless the user explicitly opts out.",
        "confirmBeforeApplying": false
      },
      "ui-references": {
        "defaultApply": false,
        "agentPrompt": "Ask the user before loading UI reference context. UI references are opt-in per task.",
        "confirmBeforeApplying": true
      }
    }
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
    }
  ],

  "usage": {
    "howToReference": "See HOW_TO_USE_CODE_STANDARDS.md for full integration guide",
    "quickStart": "See QUICK_START_FOR_PROJECTS.md for step-by-step consumer setup",
    "quickReference": {
      "directUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/comments/component-header-block.md",
      "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/code-standards/CODE_STANDARDS_CATALOG.json.md"
    }
  }
}
