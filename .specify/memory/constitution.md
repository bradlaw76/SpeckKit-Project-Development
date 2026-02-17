<!-- Sync Impact Report
  Version change: 0.0.0 → 1.0.0
  Added principles: Registry-First, Profile-Driven Compliance, Graceful Degradation, Spec-Driven Development, Simplicity & Incrementalism
  Added sections: Security & Authentication, Development Workflow
  Templates requiring updates: ✅ constitution.md updated
  Follow-up TODOs: none
-->

# SpeckKit Project Development Constitution

## Core Principles

### I. Registry-First

The SpeckKit System Manifest Registry is the single source of truth for all governance data. Every project audit, compliance check, and standard reference MUST resolve against the authoritative registry. Duplicate or local copies of governance data are convenience only — the registry always wins. All registry data files MUST use structured JSON embedded in Markdown (`.json.md`) for human readability with machine parseability.

### II. Profile-Driven Compliance

Every governed project MUST declare a SpeckKit profile (e.g., `spec-governed`, `hybrid`, `ux-demo`). The profile defines which files are required, optional, and informational. Compliance scores MUST be computed as the ratio of found-required-files to total-required-files for the project's profile. Ungoverned projects (not in the registry) MUST be clearly distinguished from governed ones — they are discoverable but not scored against profile requirements.

### III. Graceful Degradation

The dashboard MUST never crash due to API failures, malformed data, or authentication issues. Errors MUST be surfaced as user-friendly messages while preserving all available functionality. Private repos MUST prompt for authentication rather than failing silently. Cached data MUST be preserved and served when fresh data is unavailable.

### IV. Spec-Driven Development

Features MUST be specified before implementation. Specifications define WHAT and WHY, never HOW. Each user story MUST be independently testable and deliver standalone value. Plans, tasks, and implementation follow from the spec — not the other way around.

### V. Simplicity & Incrementalism

Start with the simplest solution that delivers value. Avoid premature abstraction — add complexity only when justified by concrete needs. Ship working increments frequently. Every commit MUST leave the project in a deployable state.

## Security & Authentication

- Personal Access Tokens MUST be stored only in browser storage (never committed to source).
- Tokens MUST be transmitted only via HTTPS and Authorization headers.
- The dashboard MUST function in a degraded mode without authentication (showing public data only).
- The `.github/` directory SHOULD be reviewed for credential leakage before commits.

## Development Workflow

- All changes MUST be committed with descriptive conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`).
- TypeScript strict mode MUST be enforced — no `any` types without justification.
- The dashboard MUST pass `tsc --noEmit` before every push.
- Feature branches MUST follow the `NNN-feature-name` naming convention.
- Specs, plans, and tasks MUST live in `specs/<branch-name>/` directories.

## Governance

This constitution supersedes all ad-hoc practices. Amendments require:
1. A documented rationale for the change.
2. Version increment following semantic versioning (MAJOR for principle removal/redefinition, MINOR for additions, PATCH for clarifications).
3. Updated `LAST_AMENDED_DATE`.

All code reviews and audits MUST verify compliance with these principles. Complexity MUST be justified by concrete user needs, not speculative requirements.

**Version**: 1.0.0 | **Ratified**: 2026-02-17 | **Last Amended**: 2026-02-17
