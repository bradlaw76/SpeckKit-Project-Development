# Tasks: SpeckKit Compliance Dashboard

**Input**: Design documents from `/specs/001-compliance-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and base configuration

- [ ] T001 Initialize Vite + React + TypeScript project in `dashboard/`
- [ ] T002 [P] Configure `dashboard/tsconfig.json` with strict mode and path aliases
- [ ] T003 [P] Configure `dashboard/vite.config.ts` with base path `/SpeckKit-Project-Development/` for GitHub Pages
- [ ] T004 [P] Create `dashboard/src/config/constants.ts` with registry owner, repo, branch, file paths, cache TTL, storage keys
- [ ] T005 Create `dashboard/src/main.tsx` entry point with HashRouter and App mount

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that ALL user stories depend on — GitHub API client, registry loader, and base app shell

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create `dashboard/src/lib/github-api.ts` with `apiRequest` helper, types (`TreeEntry`, `RepoMeta`, `FileContent`, `CreateFileResult`), and `getRepoTree` function
- [ ] T007 Create `dashboard/src/lib/registry.ts` with `fetchRawFile`, JSON-from-Markdown parser, `loadRegistryData`, and type definitions (`RegistryProject`, `RegistryIndex`, `ProjectTemplate`)
- [ ] T008 [P] Create `dashboard/src/config/audit-patterns.ts` with `AuditPattern` interface, `FileCategory` type, pattern definitions for SpeckKit files, and `getRequiredPatterns`/`getOptionalPatterns` helpers
- [ ] T009 Create `dashboard/src/App.tsx` with `AppContext` (auth state, registry data, registry error), `AuthProvider`, HashRouter routes (`/`, `/project/:id`, `/standards`, `/settings`)
- [ ] T010 [P] Create `dashboard/src/App.css` with dark-theme variables, grid layouts (grid-2, grid-3, grid-4), card styles, badge styles, progress bar, filter bar, and responsive breakpoints
- [ ] T011 [P] Create `dashboard/src/components/Navbar.tsx` with links to Dashboard, Standards, and Settings; display authenticated user avatar and name
- [ ] T012 [P] Create `dashboard/src/components/ComplianceBadge.tsx` with score-to-label mapping and color-coded badges

**Checkpoint**: Foundation ready — app shell loads, registry fetches, GitHub API works

---

## Phase 3: User Story 1 — View Governed Project Compliance (Priority: P1) MVP

**Goal**: Display a dashboard of all governed projects with compliance scores, audit results, and summary cards

**Independent Test**: Load the dashboard with a valid token, verify governed projects appear with correct compliance scores and badges

### Implementation for User Story 1

- [ ] T013 Create `dashboard/src/lib/auditor.ts` with `parseRepoUrl`, glob matcher, `auditProject` (crawl tree, pattern match, compute score), `auditAllProjects` (batch 3 concurrent), session cache, `getComplianceLabel`, `getComplianceColor` in `dashboard/src/lib/auditor.ts`
- [ ] T014 [P] [US1] Create `dashboard/src/components/ProjectCard.tsx` with compliance badge, profile label, visibility indicator, required file count, total file count, and progress bar in `dashboard/src/components/ProjectCard.tsx`
- [ ] T015 [US1] Create `dashboard/src/pages/Dashboard.tsx` with governed project loading, Run Audit button, summary cards (total/compliant/partial/non-compliant), audit progress bar, and project grid in `dashboard/src/pages/Dashboard.tsx`
- [ ] T016 [US1] Wire auto-audit on registry load and display audit error messages in `dashboard/src/pages/Dashboard.tsx`

**Checkpoint**: Dashboard shows governed projects with compliance scores — MVP functional

---

## Phase 4: User Story 2 — Authenticate and Access Private Repos (Priority: P1)

**Goal**: Enable PAT-based authentication to access private repos and the private registry

**Independent Test**: Enter a PAT in Settings, verify registry loads and private repo data appears

### Implementation for User Story 2

- [ ] T017 [US2] Create `dashboard/src/pages/Settings.tsx` with PAT input, save/clear token, token validation status, and connection instructions in `dashboard/src/pages/Settings.tsx`
- [ ] T018 [US2] Add auth-aware fetch to `dashboard/src/lib/registry.ts` — pass token to `fetchRawFile`, detect `PRIVATE_REPO` errors, surface auth prompt in `dashboard/src/lib/registry.ts`
- [ ] T019 [US2] Add `authChecked` gate in `dashboard/src/App.tsx` to prevent premature registry fetches before token is loaded from storage in `dashboard/src/App.tsx`
- [ ] T020 [US2] Display "Connect GitHub" warning banner on Dashboard when registry returns `PRIVATE_REPO` error in `dashboard/src/pages/Dashboard.tsx`

**Checkpoint**: Authentication works — private registry loads with valid PAT

---

## Phase 5: User Story 3 — Discover All Accessible Repos (Priority: P2)

**Goal**: Show all repos the user has access to, distinguishing governed from ungoverned

**Independent Test**: Toggle to "All My Repos", verify all user repos appear with governed/ungoverned distinction

### Implementation for User Story 3

- [ ] T021 [US3] Add `listUserRepos` function with pagination (up to 500 repos, 100 per page) to `dashboard/src/lib/github-api.ts`
- [ ] T022 [US3] Add repo source toggle (Governed Only / All My Repos), user repo fetching effect, and ungoverned project merging logic to `dashboard/src/pages/Dashboard.tsx`
- [ ] T023 [US3] Add auto-default to "All My Repos" when authenticated and auto-switch effect when token arrives in `dashboard/src/pages/Dashboard.tsx`
- [ ] T024 [P] [US3] Disable "All My Repos" toggle with tooltip when not authenticated; show inline warning hint in `dashboard/src/pages/Dashboard.tsx`

**Checkpoint**: All My Repos shows governed + ungoverned repos with clear distinction

---

## Phase 6: User Story 4 — Filter and Sort Projects (Priority: P2)

**Goal**: Enable filtering by compliance status, profile, search term, and sorting by score or name

**Independent Test**: Run an audit, apply various filter combinations, verify the displayed list updates correctly

### Implementation for User Story 4

- [ ] T025 [US4] Add text search filter, profile dropdown, compliance status dropdown, and sort dropdown to `dashboard/src/pages/Dashboard.tsx`
- [ ] T026 [US4] Add clickable summary cards that set the compliance filter (Total, Compliant, Partial, Non-Compliant) in `dashboard/src/pages/Dashboard.tsx`
- [ ] T027 [US4] Implement sort logic — by compliance score (non-compliant first) or by name (alphabetical) in `dashboard/src/pages/Dashboard.tsx`
- [ ] T028 [P] [US4] Add "Ungoverned" filter option that only appears when repo source is "All My Repos" in `dashboard/src/pages/Dashboard.tsx`

**Checkpoint**: Filters and sorting work correctly with governed and ungoverned repos

---

## Phase 7: User Story 5 — Scaffold Missing Files (Priority: P3)

**Goal**: Allow users to create missing required files directly from the project detail page

**Independent Test**: Navigate to a non-compliant project, click "Create" on a missing file, verify it's pushed to the repo, re-audit to confirm score improves

### Implementation for User Story 5

- [ ] T029 [US5] Create `dashboard/src/lib/scaffold.ts` with file templates (SYSTEM_MANIFEST.json.md, copilot-instructions.md, SPEC.md, BINDING_CERTIFICATION.md, UX_INVARIANTS.md, TEST_ACCEPTANCE.md, README.md, CHANGELOG.md, LICENSE), `hasTemplate`, `scaffoldFile`, `scaffoldAll` functions in `dashboard/src/lib/scaffold.ts`
- [ ] T030 [US5] Add `createFile` and `updateFile` functions to `dashboard/src/lib/github-api.ts`
- [ ] T031 [US5] Create `dashboard/src/pages/ProjectDetail.tsx` with audit result display, matched files list, missing files list with "Create" buttons, project references, and suggestions in `dashboard/src/pages/ProjectDetail.tsx`
- [ ] T032 [US5] Add "Create All" button, scaffold status tracking, summary banner with created/failed counts, and "Re-audit" button to `dashboard/src/pages/ProjectDetail.tsx`
- [ ] T033 [US5] Add `repoLinkUrl` helper to normalize GitHub repo links (prevent doubled URLs) in `dashboard/src/pages/ProjectDetail.tsx`

**Checkpoint**: Scaffolding works — missing files can be created and re-audit confirms improved compliance

---

## Phase 8: User Story 6 — Browse Standards and References (Priority: P3)

**Goal**: Display code standards and UI references from the registry catalogs with correct links

**Independent Test**: Navigate to Standards page, verify catalog items listed with working links to GitHub repo files

### Implementation for User Story 6

- [ ] T034 [US6] Create `dashboard/src/pages/Standards.tsx` with code standards listing (name, category, tags, version) and UI references listing (name, platform, area, tags) in `dashboard/src/pages/Standards.tsx`
- [ ] T035 [US6] Add `ghBlobUrl` helper using `REGISTRY_OWNER`/`REGISTRY_REPO` constants and correct catalog base paths (`code-standards/`, `ui-references/`) in `dashboard/src/pages/Standards.tsx`

**Checkpoint**: Standards page shows all catalog entries with correct GitHub links

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: UX improvements and hardening that affect multiple user stories

- [ ] T036 [P] Add error boundaries and user-friendly error messages for API failures, malformed data, and auth issues across all pages
- [ ] T037 [P] Add loading spinners and progress indicators for audit, scaffolding, and repo fetching operations
- [ ] T038 Review and clean up TypeScript types — ensure no `any` types without justification per constitution
- [ ] T039 [P] Add responsive styles for mobile/tablet viewport in `dashboard/src/App.css`
- [ ] T040 Run `npx tsc --noEmit` validation pass across entire dashboard codebase

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — first auditable dashboard
- **US2 (Phase 4)**: Depends on Foundational — can run parallel with US1 but auth needed for full US1 with private repos
- **US3 (Phase 5)**: Depends on US2 (requires auth for repo listing)
- **US4 (Phase 6)**: Depends on US1 (needs audit results to filter)
- **US5 (Phase 7)**: Depends on US1 (needs audit results to identify missing files)
- **US6 (Phase 8)**: Depends on Foundational only (registry data)
- **Polish (Phase 9)**: Depends on all desired user stories

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No story dependencies
- **US2 (P1)**: Can start after Foundational — Independent of US1
- **US3 (P2)**: Requires US2 (authentication)
- **US4 (P2)**: Requires US1 (audit results to filter)
- **US5 (P3)**: Requires US1 (audit results to scaffold)
- **US6 (P3)**: Can start after Foundational — Independent

### Parallel Opportunities

- T002, T003, T004 can run in parallel (Setup phase)
- T008, T010, T011, T012 can run in parallel (Foundational phase)
- US1 and US2 can proceed in parallel after Foundational
- US4 and US5 can proceed in parallel after US1
- US6 can proceed in parallel with any story after Foundational

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 — View Governed Compliance
4. Complete Phase 4: US2 — Authentication
5. **STOP and VALIDATE**: Dashboard shows governed projects with compliance scores via PAT
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → App shell loads
2. US1 → Governed project compliance visible (MVP!)
3. US2 → Private repos accessible with PAT
4. US3 → All repos discoverable
5. US4 → Filtering and sorting
6. US5 → Scaffolding missing files
7. US6 → Standards browsing
8. Polish → Error handling, responsiveness

---

## Notes

- Total tasks: 40
- Tasks per story: US1=4, US2=4, US3=4, US4=4, US5=5, US6=2, Setup=5, Foundational=7, Polish=5
- Parallel opportunities: 15 tasks marked [P]
- MVP scope: Phase 1 + 2 + 3 + 4 (20 tasks)
- All tasks follow checklist format: checkbox, ID, labels, file paths
