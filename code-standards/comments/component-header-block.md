# Component Header Comment Block — Template

**Standard:** SpeckKit Code Standards
**ID:** `component-header-block`
**Version:** 1.0
**Created:** 2026-02-16

---

## Purpose

This is the **standard comment header block** for any component file in a SpeckKit-governed project. It provides a structured, self-documenting header that captures everything an agent or developer needs to understand a component without reading the code.

---

## When to Use

Apply this header to **every component file** — JavaScript, HTML, CSS, Liquid, React, jQuery, or any file that implements a discrete piece of functionality.

**Default behavior:** When an agent is building or modifying a component, it **SHOULD apply this header automatically** unless the user explicitly opts out.

---

## Template

Copy the block below and fill in the bracketed values:

```html
<!--
=============================================================================
COMPONENT:    [Component Name]
FILE:         [repo-path/to/file]
VERSION:      X.X.X
AUTHOR:       [Owner / Team]
LAST UPDATED: YYYY-MM-DD
ENVIRONMENT:  Power Pages | React | jQuery | Web API
PORTAL URL:   https://your-portal-url.powerappsportals.us

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
[1–2 sentence description of what this component does and why it exists.
Example: Full CRUD case management interface for portal users with search,
filtering, sorting, and modal-based editing.]

-----------------------------------------------------------------------------
ARCHITECTURE
-----------------------------------------------------------------------------
- Data Source:      Dataverse via Power Pages Web API
- Entity/Table:     [logical name e.g., incident]
- Auth Model:       Table Permissions + Web Role
- Rendering:        Client-side (jQuery / React hybrid)
- API Pattern:      /_api/[entity]
- OData:            Prefer: odata.include-annotations=*

-----------------------------------------------------------------------------
FEATURES
-----------------------------------------------------------------------------
- Search:           [Fields searched]
- Filtering:        [Dropdowns / status / etc.]
- Sorting:          [Column click / asc-desc]
- Pagination:       [Client-side / server-side]
- Create:           [Modal / inline]
- Update:           [Modal / inline]
- Delete:           [Soft / hard delete]
- Validation:       [Client-side / server-side]
- UX Notes:         [Scoped styles, modals, etc.]

-----------------------------------------------------------------------------
PREREQUISITES
-----------------------------------------------------------------------------
1. Site Setting:   Webapi/[entity]/enabled = true
2. Site Setting:   Webapi/[entity]/fields  =
                   field1,field2,field3,...
3. Table Permission:
   - Entity:       [Entity Name]
   - Privileges:   Read | Write | Create | Delete
4. Web Role:
   - Assigned to table permission
5. Dependencies:
   - jQuery loaded
   - React loaded (if applicable)
   - Bootstrap (if applicable)

-----------------------------------------------------------------------------
SECURITY MODEL
-----------------------------------------------------------------------------
- CSRF Token:      shell.getTokenDeferred()
- Auth Scope:      Portal authenticated users only
- Data Exposure:   Limited to permitted fields
- Role Dependency: [List role names]

-----------------------------------------------------------------------------
STYLE ISOLATION
-----------------------------------------------------------------------------
- Root Scope ID:   #[root-container-id]
- All CSS prefixed to prevent portal chrome conflicts
- No global overrides

-----------------------------------------------------------------------------
KNOWN LIMITATIONS
-----------------------------------------------------------------------------
- [Example: Client-side pagination may degrade performance >1000 records]
- [Example: Requires full page refresh after role changes]

-----------------------------------------------------------------------------
TEST CASES
-----------------------------------------------------------------------------
✔ Load data without errors  
✔ Search returns correct filtered results  
✔ Status filter applies correctly  
✔ Create record persists to Dataverse  
✔ Edit record updates correct fields  
✔ Delete confirms and removes record  
✔ Pagination changes page correctly  

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
vX.X.X  YYYY-MM-DD  [Short, precise description of change]
vX.X.X  YYYY-MM-DD  [Short, precise description of change]
vX.X.X  YYYY-MM-DD  Initial version

-----------------------------------------------------------------------------
NON-NEGOTIABLES (Architecture Contract)
-----------------------------------------------------------------------------
- Do NOT remove scoped root container.
- Do NOT bypass CSRF token retrieval.
- Do NOT rename entity logical names without updating Site Settings.
- Changes must be additive unless version increment approved.
=============================================================================
-->
```

---

## Sections Reference

| Section | Required | Purpose |
|---------|----------|---------|
| COMPONENT / FILE / VERSION | Yes | Identity and versioning |
| AUTHOR / LAST UPDATED | Yes | Ownership and freshness |
| ENVIRONMENT | Yes | Runtime context |
| OVERVIEW | Yes | What and why (1–2 sentences) |
| ARCHITECTURE | Yes | Data source, auth, rendering approach |
| FEATURES | Yes | Capability checklist |
| PREREQUISITES | Yes | Site settings, permissions, dependencies |
| SECURITY MODEL | Yes | CSRF, auth scope, data exposure |
| STYLE ISOLATION | Conditional | Required if component has scoped CSS |
| KNOWN LIMITATIONS | Recommended | Document known issues proactively |
| TEST CASES | Recommended | Verification checklist |
| CHANGELOG | Yes | Version history |
| NON-NEGOTIABLES | Yes | Hard rules that must never be violated |

---

## Adapting for Non–Power Pages Projects

The template is designed for Power Pages / Dataverse components but adapts easily:

| Power Pages Section | General Equivalent |
|--------------------|--------------------|
| Portal URL | App URL / Base URL |
| Site Setting | Environment Variable / Config |
| Table Permission | RBAC / Auth Policy |
| Web Role | User Role / Group |
| CSRF Token | Auth Token / API Key |
| /_api/[entity] | /api/[endpoint] |
| OData | REST / GraphQL |
| Liquid | Template Engine |

**For React/Node projects**, replace Power Pages–specific lines but keep all sections.

---

## Agent Behavior Note

> **This standard defaults to YES.** When an agent is creating or modifying a component file, it should apply this comment header automatically. The agent should only skip it if the user explicitly says not to include comments.
>
> This is different from UI references (like Dynamics 365 layouts), which default to ASK — the agent should confirm before loading UI reference context.
