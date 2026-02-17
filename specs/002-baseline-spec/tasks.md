# Tasks: Baseline Specification — SpeckKit Bootstrap & Onboarding

**Input**: Design documents from `/specs/002-baseline-spec/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent verification of each story. Since this is a **retroactive baseline**, tasks are verification-focused: read existing code, confirm each FR is satisfied, and implement fixes only where gaps are found.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files or independent read-only checks)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Include exact file paths in descriptions

## Path Conventions

- **Dashboard source**: `dashboard/src/pages/Standards.tsx`
- **Canonical document**: `SETUP_FOR_PROJECTS.md` (repo root)
- **Spec artifacts**: `specs/002-baseline-spec/`

---

## Phase 1: Setup

**Purpose**: Verify project structure and file existence

- [ ] T001 Verify Standards.tsx exists at dashboard/src/pages/Standards.tsx and contains the Getting Started tab section (~400 lines of bootstrap card, guide cards, How It Works)
- [ ] T002 Verify SETUP_FOR_PROJECTS.md exists at repo root with all major sections (bootstrap methods, profiles, templates, agent flow)

---

## Phase 2: Foundational (Type Safety & Data Integrity)

**Purpose**: Confirm shared entities and types are correct before verifying user stories

**⚠️ CRITICAL**: These validations underpin all user story verifications

- [ ] T003 [P] Verify Guide interface has all required fields (title, file, icon, summary, steps, audience, category, badge?) in dashboard/src/pages/Standards.tsx
- [ ] T004 [P] Verify BootstrapTab union type covers all 5 methods ('copilot' | 'review' | 'comment' | 'cli-ps' | 'cli-bash') in dashboard/src/pages/Standards.tsx
- [ ] T005 [P] Verify GUIDES array contains exactly 6 entries with valid file paths in dashboard/src/pages/Standards.tsx
- [ ] T006 [P] Verify all 5 bootstrap snippet constants (COPILOT_CHAT_PROMPT, COPILOT_REVIEW_PROMPT, BOOTSTRAP_SNIPPET, CLI_POWERSHELL, CLI_BASH) are defined in dashboard/src/pages/Standards.tsx

**Checkpoint**: Foundation verified — user story verification can begin

---

## Phase 3: User Story 1 — Discover Bootstrap Methods (Priority: P1) 🎯 MVP

**Goal**: Confirm the bootstrap card renders 5 selectable method tabs with copy-ready prompts

**Independent Test**: Navigate to Standards page → Getting Started tab → verify 5 tabs displayed, Copilot Chat is default, each tab shows its snippet

**Mapped FRs**: FR-001, FR-002, FR-003, FR-012

### Verification for User Story 1

- [ ] T007 [US1] Verify bootstrap card renders with title "Bootstrap or Review a Project" and 5 selectable tab buttons (FR-001) in dashboard/src/pages/Standards.tsx
- [ ] T008 [P] [US1] Verify Copilot Chat is the default selected tab via useState initial value (FR-002) in dashboard/src/pages/Standards.tsx
- [ ] T009 [P] [US1] Verify each of the 5 tabs displays a copy-ready code snippet or prompt with a description (FR-003) in dashboard/src/pages/Standards.tsx
- [ ] T010 [US1] Verify tab switching shows the correct content and hides the previously active method content (FR-001) in dashboard/src/pages/Standards.tsx
- [ ] T011 [US1] Verify footer displays a summary statement that all methods lead to the same outcome (FR-012) in dashboard/src/pages/Standards.tsx

**Checkpoint**: User Story 1 verified — bootstrap card is fully functional with all 5 methods

---

## Phase 4: User Story 2 — Browse Onboarding Guides (Priority: P1)

**Goal**: Confirm 6 guide cards are displayed in 3 category groups with complete metadata and working links

**Independent Test**: Load Getting Started tab → verify 6 cards appear in Entry Points (2), Code Standards (2), UI References (2) groups with title, icon, summary, steps, audience, and valid "View full guide" link

**Mapped FRs**: FR-005, FR-006, FR-007

### Verification for User Story 2

- [ ] T012 [US2] Verify 6 guide cards are displayed across 3 category groups: Entry Points (2), Code Standards (2), UI References (2) (FR-005) in dashboard/src/pages/Standards.tsx
- [ ] T013 [P] [US2] Verify each guide card renders title, icon, summary, numbered steps, intended audience, and a "View full guide" link (FR-006) in dashboard/src/pages/Standards.tsx
- [ ] T014 [P] [US2] Verify "Unified Setup Guide" card displays a "Recommended" badge (FR-007) in dashboard/src/pages/Standards.tsx
- [ ] T015 [US2] Verify all 6 guide "View full guide" links resolve to existing files in the GitHub registry (FR-006)

**Checkpoint**: User Story 2 verified — guide discovery is complete with valid links

---

## Phase 5: User Story 5 — SETUP_FOR_PROJECTS.md as Canonical Reference (Priority: P1)

**Goal**: Confirm SETUP_FOR_PROJECTS.md is a complete, self-contained bootstrap document and that dashboard prompts are in sync

**Independent Test**: Have an AI agent open a blank project, give it the Copilot Chat prompt, verify it reads SETUP_FOR_PROJECTS.md, asks for a profile, and scaffolds the correct files

**Mapped FRs**: FR-009, FR-010, FR-011

### Verification for User Story 5

- [ ] T016 [US5] Verify SETUP_FOR_PROJECTS.md contains all 5 bootstrap methods with complete instructions (FR-009) in SETUP_FOR_PROJECTS.md
- [ ] T017 [P] [US5] Verify SETUP_FOR_PROJECTS.md contains profile decision tree and required/optional file tables for all 5 profiles (FR-009) in SETUP_FOR_PROJECTS.md
- [ ] T018 [P] [US5] Verify SETUP_FOR_PROJECTS.md contains stub templates and step-by-step connection instructions (FR-009) in SETUP_FOR_PROJECTS.md
- [ ] T019 [US5] Verify Method 5 (Review Existing Project) includes a prompt instructing the agent to compare files against profile requirements (FR-010) in SETUP_FOR_PROJECTS.md
- [ ] T020 [US5] Verify prompt/snippet sync: compare all 5 dashboard constants in Standards.tsx against their corresponding methods in SETUP_FOR_PROJECTS.md — executable content must match (FR-011)

**Checkpoint**: User Story 5 verified — canonical document is complete and in sync with dashboard

---

## Phase 6: User Story 3 — Understand Agent Discovery Flow (Priority: P2)

**Goal**: Confirm the "How It Works" section displays the agent behavior table, 9-step flow, and referencing options

**Independent Test**: Scroll to How It Works section in Getting Started tab → verify behavior table, 9-step list, and 3 referencing methods are displayed

**Mapped FRs**: FR-008

### Verification for User Story 3

- [ ] T021 [P] [US3] Verify agent behavior table shows which resources are auto-applied vs. ask-first (FR-008) in dashboard/src/pages/Standards.tsx
- [ ] T022 [P] [US3] Verify numbered 9-step agent discovery flow list (Read, Ask, Scaffold, Apply sequence) is displayed (FR-008) in dashboard/src/pages/Standards.tsx
- [ ] T023 [P] [US3] Verify 3 referencing options (Git Submodule, Local Workspace, Raw GitHub URLs) are listed with descriptions (FR-008) in dashboard/src/pages/Standards.tsx

**Checkpoint**: User Story 3 verified — How It Works section is complete

---

## Phase 7: User Story 4 — Review an Existing Project (Priority: P2)

**Goal**: Confirm the Existing Project tab displays a dedicated review prompt with agent workflow instructions

**Independent Test**: Click "Existing Project" tab → verify review prompt instructs agent to read SETUP_FOR_PROJECTS.md, identify profile, compare files, scaffold/update missing items

**Mapped FRs**: FR-004

### Verification for User Story 4

- [ ] T024 [US4] Verify Existing Project tab displays a review-specific prompt distinct from the bootstrap prompt (FR-004) in dashboard/src/pages/Standards.tsx
- [ ] T025 [US4] Verify review prompt instructs the agent to: (1) read SETUP_FOR_PROJECTS.md, (2) identify the project profile, (3) compare files against profile requirements, (4) scaffold/update anything missing or outdated (FR-004) in dashboard/src/pages/Standards.tsx

**Checkpoint**: User Story 4 verified — existing project review flow is complete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validate acceptance scenarios, edge cases, and overall spec compliance

- [ ] T026 [P] Validate all 15 acceptance scenarios from spec.md against the live dashboard at http://localhost:5174/SpeckKit-Project-Development/
- [ ] T027 [P] Verify all 5 edge cases from spec.md are handled or documented in code comments
- [ ] T028 Run quickstart.md validation: execute all 5 common tasks (add guide, add method, update prompt, verify sync, verify paths) as described in specs/002-baseline-spec/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — no cross-story dependencies
- **US2 (Phase 4)**: Depends on Foundational — no cross-story dependencies
- **US5 (Phase 5)**: Depends on Foundational — sync check (T020) references US1 constants
- **US3 (Phase 6)**: Depends on Foundational — no cross-story dependencies
- **US4 (Phase 7)**: Depends on Foundational — no cross-story dependencies
- **Polish (Phase 8)**: Depends on all user story phases completing

### User Story Dependencies

- **US1 (P1)**: Independent — bootstrap card verification
- **US2 (P1)**: Independent — guide cards verification
- **US5 (P1)**: Loosely coupled to US1 — T020 (sync check) reads US1's snippet constants, but does not modify them
- **US3 (P2)**: Independent — How It Works section verification
- **US4 (P2)**: Independent — Existing Project tab content verification

### Within Each User Story

- Verification tasks read existing code — no model→service→endpoint ordering applies
- Tasks marked [P] can run in parallel (read-only checks on different code sections)
- If a verification task finds a gap, implement the fix before proceeding to the next task

### Parallel Opportunities

- T003, T004, T005, T006 — all foundational checks run in parallel (different code sections)
- T008, T009 — US1 default-tab and snippet checks run in parallel
- T013, T014 — US2 card fields and badge checks run in parallel
- T017, T018 — US5 profile tables and templates checks run in parallel
- T021, T022, T023 — all US3 tasks run in parallel (different sub-sections of How It Works)
- US1, US2, US3, US4, US5 — all story phases can run in parallel after Foundational completes

---

## Parallel Example: Foundational Phase

```text
# Launch all type/data integrity checks together:
T003: Verify Guide interface fields in Standards.tsx
T004: Verify BootstrapTab union type in Standards.tsx
T005: Verify GUIDES array entries in Standards.tsx
T006: Verify bootstrap snippet constants in Standards.tsx
```

## Parallel Example: User Story 5

```text
# Launch independent SETUP_FOR_PROJECTS.md section checks:
T017: Verify profile decision tree and file tables
T018: Verify stub templates and instructions
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup verification
2. Complete Phase 2: Foundational type safety checks
3. Complete Phase 3: US1 — Bootstrap Methods ← **core MVP**
4. Complete Phase 4: US2 — Onboarding Guides
5. Complete Phase 5: US5 — Canonical Reference + Sync
6. **STOP and VALIDATE**: All 3 P1 stories verified independently
7. Proceed to P2 stories if needed

### Incremental Delivery

1. Setup + Foundational → Types and data integrity confirmed
2. US1 verified → Bootstrap card confirmed functional (MVP!)
3. US2 verified → Guide discovery confirmed functional
4. US5 verified → Canonical document confirmed complete, sync confirmed
5. US3 verified → How It Works confirmed complete
6. US4 verified → Existing Project review confirmed complete
7. Polish → All acceptance scenarios and edge cases validated

### Parallel Strategy

Since all tasks are read-only verification (unless gaps are found):

1. Complete Setup + Foundational sequentially
2. Once Foundational passes, launch ALL 5 user stories in parallel
3. Converge at Polish phase

---

## Notes

- **Retroactive baseline**: All tasks verify existing code rather than building new code. Implementation work only occurs if a verification task discovers a gap.
- [P] tasks = read-only checks on different code sections, safe to parallelize
- [Story] label maps each task to its user story for FR traceability
- Each user story can be verified independently — no cross-story blocking dependencies
- Commit any fixes after each task or logical group
- Stop at any checkpoint to confirm that story's FRs are satisfied
- Total: 28 tasks across 8 phases covering all 12 FRs and 5 user stories
