<!--
=============================================================================
DOCUMENT:     SpeckKit Registry Lock — Binding Governance Contract
FILE:         system-manifests/REGISTRY_LOCK.md
VERSION:      1.0
AUTHOR:       bradlaw76
LAST UPDATED: 2026-02-16

-----------------------------------------------------------------------------
OVERVIEW
-----------------------------------------------------------------------------
Binding governance contract for the SpeckKit Manifest Registry. Defines
mandatory rules, compliance requirements, approval and audit policies,
and enforcement/violation handling for all registered projects.

-----------------------------------------------------------------------------
REGISTRY ROLE
-----------------------------------------------------------------------------
- Once active, registry rules override project preference.
- All registered projects are bound by these rules.
- Referenced by README.md and MANIFEST_RULES.md.

-----------------------------------------------------------------------------
CHANGELOG
-----------------------------------------------------------------------------
v1.0  2026-02-16  Initial version — binding governance contract
=============================================================================
-->

# SpeckKit Registry Lock — Binding Governance Contract

**Status:** ACTIVE & ENFORCING
**Effective Date:** February 16, 2026
**Authority:** SpeckKit Project Development
**Next Review:** Q2 2026

---

## Purpose

This document is a **binding governance contract** for all projects registered in the SpeckKit Manifest Registry. Once active, these rules override project-level preferences.

---

## 1. Mandatory Registry Rules

1. Every governed project **MUST** contain `SYSTEM_MANIFEST.json.md` at its repository root.
2. Every governed project **MUST** be listed in `/system-manifests/MANIFEST_INDEX.json.md`.
3. Project IDs **MUST** be lowercase-hyphen format (e.g., `appointment-scheduling`).
4. Project IDs are **immutable** — once assigned, they cannot be renamed or reassigned.
5. Versions **MUST** follow semantic versioning (`MAJOR.MINOR.PATCH`).

---

## 2. Compliance Requirements

### ACTIVE Projects

Projects with status `ACTIVE` must maintain:

- 100% manifest compliance (all required fields populated)
- 100% test pass rate (if `TEST_ACCEPTANCE.md` is declared)
- Valid registry backlink in `SYSTEM_MANIFEST.json.md`
- All required files present per their declared profile (see `PROJECT_TEMPLATE.json`)

### DEVELOPMENT Projects

Projects with status `DEVELOPMENT` must maintain:

- Valid `SYSTEM_MANIFEST.json.md` with registry backlink
- Listing in `MANIFEST_INDEX.json.md`
- Compliance is advisory, not enforced

### INACTIVE / DEPRECATED / ARCHIVED Projects

- Must retain their registry entry (append-only)
- Cannot be removed, only status-changed
- Archived projects are read-only

---

## 3. Approval Policies

### Adding a New Project

1. Create `SYSTEM_MANIFEST.json.md` in the project repo
2. Add entry to `MANIFEST_INDEX.json.md`
3. Commit with message: `[REGISTRY] Add project: <project-id>`
4. Run `/speckit.registry.review` to validate

### Changing Project Status

1. Update `status` in both the project manifest and the registry entry
2. Commit with message: `[REGISTRY] Update status: <project-id> → <new-status>`
3. Status transitions must follow the lifecycle flow:
   ```
   DEVELOPMENT → ACTIVE → INACTIVE / DEPRECATED → ARCHIVED
   ```
4. Backward transitions (e.g., ARCHIVED → ACTIVE) require explicit justification

### Modifying Registry Structure

1. Changes to registry schema, catalogs, or governance rules require a commit message prefixed with `[REGISTRY]`
2. Changes to the root and authoritative `MANIFEST_INDEX.json.md` must be kept in sync

---

## 4. Audit Trail

- The registry is **append-only** — history must be preserved
- All changes must be committed with descriptive messages
- Project removals are prohibited; use status `ARCHIVED` instead
- Git history serves as the permanent audit log

---

## 5. Enforcement & Violation Handling

### Violations

A project is in violation if:

- It lacks `SYSTEM_MANIFEST.json.md`
- Its manifest is missing the registry backlink
- It is not listed in `MANIFEST_INDEX.json.md`
- An ACTIVE project fails compliance checks

### Consequences

- **Review blocked** — SpeckKit will not review non-compliant projects
- **Portfolio invisible** — unlisted projects do not exist for governance purposes
- **Status downgrade** — ACTIVE projects that fail compliance may be downgraded to DEVELOPMENT

### Resolution

1. Fix the compliance issue
2. Commit the fix with message: `[REGISTRY] Fix compliance: <project-id>`
3. Re-run `/speckit.registry.review` to confirm

---

## 6. Shared Resources Governance

### Code Standards

- Defined in `/code-standards/CODE_STANDARDS_CATALOG.json.md`
- Agent behavior: **auto-apply by default**
- Consumer projects opt in via `SETUP_FOR_PROJECTS.md`

### UI References

- Defined in `/ui-references/UI_REFERENCE_CATALOG.json.md`
- Agent behavior: **ask before loading**
- Consumer projects opt in via `SETUP_FOR_PROJECTS.md`

### Agent Behavior Defaults

- Defined in `AGENT_BEHAVIOR_DEFAULTS.jsonc`
- Agents consuming this registry must read this file first
- Defaults are binding unless a consumer project explicitly overrides

---

## Authority Statement

This governance contract is **binding** on all SpeckKit-managed projects. Compliance is mandatory for ACTIVE projects and advisory for DEVELOPMENT projects.

**Registry Owner:** bradlaw76
**Enforcement:** Automated via SpeckKit review commands
**Appeals:** Via commit message with `[REGISTRY] Appeal: <project-id> — <reason>`
