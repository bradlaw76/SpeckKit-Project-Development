# Implementation Plan: Baseline Specification — SpeckKit Bootstrap & Onboarding

**Branch**: `002-baseline-spec` | **Date**: 2026-02-17 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-baseline-spec/spec.md`

## Summary

Formalize and validate the already-implemented SpeckKit bootstrap and onboarding system. This feature encompasses two surfaces: (1) the Getting Started tab in the dashboard's Standards page (`Standards.tsx`), which provides a tabbed bootstrap methods card, categorized onboarding guide cards, and a "How It Works" section; and (2) the `SETUP_FOR_PROJECTS.md` canonical setup document, which contains all five bootstrap methods, profile definitions, stub templates, and the 9-step agent discovery flow. Since this is a **retroactive baseline**, the implementation plan focuses on verifying, documenting, and hardening the existing code rather than building from scratch.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: React 19, Vite 6, React Router (HashRouter)
**Storage**: N/A — all onboarding content is static data embedded in source code and Markdown files. No persistent storage beyond what the parent dashboard provides.
**Testing**: Manual browser testing (visual verification of tabs, links, snippets). Vite/Vitest available for unit tests.
**Target Platform**: Modern web browsers (Chrome, Edge, Firefox, Safari). Static site deployed to GitHub Pages.
**Project Type**: Single-page web application (frontend only) + Markdown documentation
**Performance Goals**: Getting Started tab renders in <1s; all five bootstrap method tabs switch instantly (<100ms).
**Constraints**: Bootstrap prompt/snippet content must stay in sync between `Standards.tsx` and `SETUP_FOR_PROJECTS.md`. Guide file paths must match actual registry contents. No server-side rendering.
**Scale/Scope**: 5 bootstrap methods, 6 onboarding guides across 3 categories, 1 canonical setup document (~540 lines), Standards.tsx (~651 lines).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Registry-First | ✅ Pass | All guide file paths and bootstrap URLs resolve against the authoritative registry. `SETUP_FOR_PROJECTS.md` lives in the registry root. |
| II. Profile-Driven Compliance | ✅ Pass | Bootstrap methods reference profiles; `SETUP_FOR_PROJECTS.md` includes the profile decision tree and required/optional file tables. |
| III. Graceful Degradation | ✅ Pass | Getting Started tab renders without registry data (static content). Guide links degrade to 404 if files are moved/removed — documented as edge case. |
| IV. Spec-Driven Development | ✅ Pass | This spec retroactively formalizes the feature. Future changes will follow spec-first. |
| V. Simplicity & Incrementalism | ✅ Pass | Static data arrays and tabbed UI — no premature abstraction. Single file for all Getting Started content. |

**Security & Authentication**: N/A — the Getting Started tab contains no sensitive data and requires no authentication. Bootstrap prompts reference public URLs.

**Development Workflow**: ✅ — TypeScript strict mode, conventional commits, feature branch naming.

## Project Structure

### Documentation (this feature)

```text
specs/002-baseline-spec/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output (API contracts if applicable)
```

### Source Code (repository root)

```text
dashboard/src/pages/
└── Standards.tsx         # Getting Started tab, bootstrap card, guide cards, How It Works

SETUP_FOR_PROJECTS.md     # Canonical bootstrap document (5 methods, profiles, templates, agent flow)
```

**Structure Decision**: This feature is contained entirely within the existing `Standards.tsx` page component (the Getting Started tab section, ~400 lines of the 651-line file) and the `SETUP_FOR_PROJECTS.md` document at the repo root. No new files or directories are needed in the source tree.

## Key Design Decisions

1. **Static data over API fetch** — Guide metadata (`GUIDES` array) and bootstrap snippets are hardcoded in `Standards.tsx` rather than fetched from the registry. This ensures the Getting Started tab renders instantly and works even when the registry is unreachable.
2. **Tabbed bootstrap card** — Five methods presented as tabs (not accordion or separate pages) to keep all methods discoverable without scrolling. Default tab is Copilot Chat.
3. **Category-grouped guide cards** — Guides grouped by category (`entry-point`, `code-standards`, `ui-references`) with color-coded section headers, rather than a flat list. Enables visual scanning.
4. **`SETUP_FOR_PROJECTS.md` as single source of truth** — All bootstrap methods, profiles, templates, and agent instructions consolidated in one document. Agents read ONE file, not multiple quick starts.
5. **Prompt/snippet duplication** — Bootstrap prompts exist in both `Standards.tsx` (for the dashboard UI) and `SETUP_FOR_PROJECTS.md` (for agents/developers reading the doc). The spec requires these to stay in sync (FR-011).

## Complexity Tracking

No constitution violations to justify — all principles are satisfied.

## Phase 1 Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Data Model | `data-model.md` | ✅ Complete — 4 entities documented (Guide, BootstrapTab, Bootstrap Snippet Constants, Agent Discovery Flow) |
| Quickstart | `quickstart.md` | ✅ Complete — 5 common tasks with code examples and verification steps |
| Research | `research.md` | ✅ Complete — 5 research items (R1–R5), all resolved |
| API Contracts | N/A | Not applicable — feature is entirely client-side with static data, no API layer |
| Agent Context | `.github/agents/copilot-instructions.md` | ✅ Updated via `update-agent-context.ps1` |

## Constitution Re-Check (Post-Design)

*Re-evaluation after Phase 1 design decisions are finalized.*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Registry-First | ✅ Pass | Data model confirms all 6 guide `file` paths resolve to registry files. Bootstrap URLs use `REGISTRY_OWNER`/`REGISTRY_REPO` constants. |
| II. Profile-Driven Compliance | ✅ Pass | Agent Discovery Flow (entity 4) embeds profile selection at step 3. `SETUP_FOR_PROJECTS.md` contains profile decision tree. |
| III. Graceful Degradation | ✅ Pass | Static data architecture (research R3) means no network dependency for tab rendering. |
| IV. Spec-Driven Development | ✅ Pass | All 12 FRs have traceability in quickstart.md. Future changes follow spec-first. |
| V. Simplicity & Incrementalism | ✅ Pass | No new abstractions introduced. Static arrays + union types. Manual sync over build-time automation (research R5). |

**Gate**: ✅ PASS — No violations. Design aligns with all 5 constitution principles.

## Implementation Phases

### Phase 2: Verification & Hardening (Future — requires `/speckit.tasks`)

Since this is a **retroactive baseline**, the implementation work is verification-focused:

1. **Verify FR coverage** — Confirm each of the 12 FRs is satisfied by existing code
2. **Verify sync (FR-011)** — Validate prompt/snippet content matches between `Standards.tsx` and `SETUP_FOR_PROJECTS.md`
3. **Verify guide paths** — Confirm all 6 `GUIDES[].file` entries resolve to existing files
4. **Add type safety** — Ensure `BootstrapTab` union and `Guide` interface cover all cases
5. **Document edge cases** — Verify the 5 edge cases from the spec are handled or documented

### Phase 3: Optional Enhancements (Future)

- Unit test for prompt sync (comparing constants against parsed Markdown)
- Accessibility audit of tab navigation (keyboard focus, ARIA labels)
- Guide card link health check (verify GitHub URLs return 200)

## Readiness

- **Next step**: Run `/speckit.tasks` to generate `tasks.md` from this plan
- **Estimated task count**: 12–15 tasks (one per FR + sync verifications)
- **Risk**: LOW — feature is already implemented and validated
