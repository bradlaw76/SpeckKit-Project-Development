# Research: Baseline Specification — SpeckKit Bootstrap & Onboarding

**Date**: 2026-02-17  
**Feature**: `002-baseline-spec`  
**Purpose**: Resolve all unknowns from Technical Context before Phase 1 design.

---

## R1: Bootstrap Prompt/Snippet Sync Between Standards.tsx and SETUP_FOR_PROJECTS.md

**Decision**: Prompts are functionally in sync; cosmetic comment differences in CLI methods are acceptable.

**Rationale**: The three prompt-based methods (Copilot Chat, HTML Comment, Existing Project Review) are **byte-identical** between the dashboard constants and the Markdown document. The two CLI methods (PowerShell, Bash) have identical executable commands but differ in comment text — the dashboard uses shorter contextual comments while the document uses longer descriptive comments. Since comments don't affect user behavior, this is acceptable drift.

**Alternatives Considered**:
- **Extract prompts from a shared JSON file** — Rejected: adds build complexity (JSON fetch at render time) for minimal benefit. Static duplication with a sync check is simpler.
- **Align comments exactly** — Considered but not required: the dashboard comments are optimized for limited card width, while the document comments are optimized for readability in a Markdown file.

---

## R2: Guide File Path Validation

**Decision**: All 6 guide file paths in the `GUIDES` array are valid and resolve to existing files.

**Rationale**: Each guide card's `file` property was verified against the filesystem:

| Guide | File Path | Status |
|-------|-----------|--------|
| Setup for Projects (Unified) | `SETUP_FOR_PROJECTS.md` | ✅ Exists |
| Agent Behavior Defaults | `AGENT_BEHAVIOR_DEFAULTS.jsonc` | ✅ Exists |
| Quick Start: Code Standards | `code-standards/QUICK_START_FOR_PROJECTS.md` | ✅ Exists |
| How to Use Code Standards | `code-standards/HOW_TO_USE_CODE_STANDARDS.md` | ✅ Exists |
| Quick Start: UI References | `ui-references/QUICK_START_FOR_PROJECTS.md` | ✅ Exists |
| How to Use UI References | `ui-references/HOW_TO_USE_UI_REFERENCES.md` | ✅ Exists |

**Alternatives Considered**: None — file existence is binary.

---

## R3: Static Data vs. Dynamic Data Architecture

**Decision**: Keep guide metadata and bootstrap snippets as static data in the component source.

**Rationale**: The Getting Started tab content changes infrequently (only when new bootstrap methods or guides are added). Fetching guide metadata from the registry at runtime would add loading latency and a failure mode for no practical benefit. The current `GUIDES` array and snippet constants render instantly.

**Alternatives Considered**:
- **Fetch guide list from a registry JSON catalog** — Rejected: adds network dependency to a tab that should render immediately. Guide count (6) and method count (5) change rarely.
- **Generate `GUIDES` from `SETUP_FOR_PROJECTS.md` at build time** — Rejected: requires a build step, parser for Markdown, and tight coupling to document structure.

---

## R4: BootstrapTab Type Safety

**Decision**: The `BootstrapTab` union type (`'copilot' | 'review' | 'comment' | 'cli-ps' | 'cli-bash'`) is correct and covers all 5 methods.

**Rationale**: Each tab key in the type matches exactly one tab button in the UI and one conditional content block. TypeScript strict mode ensures no unhandled tabs. The default state is `'copilot'` (Copilot Chat), matching FR-002.

**Alternatives Considered**: None — the current approach is idiomatic React + TypeScript.

---

## R5: Content Sync Strategy

**Decision**: Manual sync between dashboard constants and `SETUP_FOR_PROJECTS.md`, verified during code review.

**Rationale**: With only 5 methods and infrequent changes, automated sync detection adds complexity beyond the value. The spec (FR-011) mandates sync, and code review is the enforcement mechanism.

**Alternatives Considered**:
- **Unit test that parses SETUP_FOR_PROJECTS.md and compares** — Viable future enhancement but currently over-engineered for 5 static strings.
- **Single source in JSON, consumed by both** — Would require a build step for the Markdown document, which is intended to be human-readable standalone.
