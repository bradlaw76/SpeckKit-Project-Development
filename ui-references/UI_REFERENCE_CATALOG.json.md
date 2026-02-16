{
  "catalog": {
    "name": "SpeckKit UI Reference Catalog",
    "owner": "bradlaw76",
    "repo": "https://github.com/bradlaw76/SpeckKit-Project-Development",
    "path": "/ui-references",
    "version": "1.0",
    "purpose": "Reusable UI description models for Dynamics 365 and other platforms — consumable by any SpeckKit-governed VS Code project as a skill or context reference",
    "lastUpdated": "2026-02-16"
  },

  "references": [
    {
      "id": "dynamics365-contact-center-cases-grid",
      "name": "Dynamics 365 – Contact Center Cases Grid",
      "platform": "Dynamics 365",
      "area": "Customer Service / Contact Center",
      "file": "dynamics365-contact-center-cases-grid.jsonc",
      "sourceImage": "dynamics365-contact-center-cases-grid.png",
      "description": "Three-column layout: case stream navigation, Dataverse grid (My Active Cases), and Copilot AI assistant panel",
      "tags": ["dynamics-365", "contact-center", "case-management", "copilot", "grid-view", "customer-service"],
      "patterns": [
        "threeColumnLayout",
        "dataverseGrid",
        "copilotPanel",
        "caseStreamNav",
        "priorityBadges"
      ],
      "created": "2026-02-16",
      "status": "ACTIVE"
    }
  ],

  "usage": {
    "howToReference": "See HOW_TO_USE_UI_REFERENCES.md for full integration guide",
    "quickReference": {
      "directUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/dynamics365-contact-center-cases-grid.jsonc",
      "catalogUrl": "https://raw.githubusercontent.com/bradlaw76/SpeckKit-Project-Development/main/ui-references/UI_REFERENCE_CATALOG.json.md",
      "relativeImport": "../SpeckKit-Project-Development/ui-references/dynamics365-contact-center-cases-grid.jsonc"
    }
  }
}
