# Feature Specification: SpeckKit Compliance Dashboard

**Feature Branch**: `001-compliance-dashboard`  
**Created**: 2026-02-17  
**Status**: Draft  
**Input**: User description: "SpeckKit compliance dashboard — a web app that audits GitHub repos against SpeckKit governance profiles, shows compliance status, supports scaffolding missing files, and provides filtering and sorting across all accessible repos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Governed Project Compliance (Priority: P1)

As a project owner, I want to see a dashboard of all governed projects registered in the SpeckKit manifest, with their compliance scores and audit results, so I can quickly identify which repos need attention.

**Why this priority**: This is the core value proposition — without visibility into compliance status, there is no governance.

**Independent Test**: Can be fully tested by loading the registry manifest and auditing the governed projects, then verifying the dashboard renders project cards with correct compliance scores and badges.

**Acceptance Scenarios**:

1. **Given** a user with a valid GitHub token and governed projects in the registry, **When** the dashboard loads, **Then** all governed projects appear as cards with compliance scores, profile badges, and file counts.
2. **Given** a governed project with missing required files, **When** the audit completes, **Then** the project card displays a non-compliant badge and a red compliance bar.
3. **Given** a governed project with all required files present, **When** the audit completes, **Then** the project card displays a compliant badge and a green compliance bar.

---

### User Story 2 - Authenticate and Access Private Repos (Priority: P1)

As a user, I want to connect my GitHub account via a Personal Access Token so I can audit private repositories and see all repos I have access to.

**Why this priority**: The registry repo itself is private, so authentication is required for core functionality.

**Independent Test**: Can be tested by entering a PAT in Settings, verifying the registry loads, and confirming private repo data is fetched.

**Acceptance Scenarios**:

1. **Given** the registry is in a private repo and no token is set, **When** the dashboard loads, **Then** a clear message instructs the user to connect GitHub with a PAT.
2. **Given** a valid PAT is entered in Settings, **When** the dashboard reloads, **Then** registry data is fetched and projects are displayed.
3. **Given** an invalid PAT, **When** a fetch is attempted, **Then** an error message is shown without crashing the app.

---

### User Story 3 - Discover All Accessible Repos (Priority: P2)

As a user, I want to see all repos my token has access to (not just governed ones) so I can identify which repos are ungoverned and could benefit from SpeckKit adoption.

**Why this priority**: Discovering ungoverned repos drives wider governance adoption.

**Independent Test**: Can be tested by toggling to "All My Repos", verifying all user repos appear (paginated), and ungoverned repos are labeled distinctly.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they select "All My Repos", **Then** all accessible repos (up to 500) are listed, with governed and ungoverned repos distinguished.
2. **Given** ungoverned repos are displayed, **When** filtering by "Ungoverned", **Then** only repos not in the manifest are shown.
3. **Given** the user is not authenticated, **When** they attempt to select "All My Repos", **Then** the toggle is disabled with a hint to connect GitHub first.

---

### User Story 4 - Filter and Sort Projects (Priority: P2)

As a user, I want to filter projects by compliance status, profile, and search term, and sort by compliance score or name, so I can focus on the repos that need the most attention.

**Why this priority**: With many repos, filtering and sorting are essential for usability.

**Independent Test**: Can be tested by running an audit, then applying various filter combinations and verifying the displayed list updates correctly.

**Acceptance Scenarios**:

1. **Given** audit results are displayed, **When** the user clicks the "Non-Compliant" summary card, **Then** only non-compliant projects are shown.
2. **Given** audit results are displayed, **When** the user selects "Sort by Compliance", **Then** projects are ordered from lowest to highest compliance score.
3. **Given** audit results are displayed, **When** the user types a search term, **Then** only projects whose name or repo URL match the term are shown.

---

### User Story 5 - Scaffold Missing Files (Priority: P3)

As a project owner, I want to create missing required files directly from the project detail page so I can quickly bring a repo into compliance without leaving the dashboard.

**Why this priority**: Scaffolding accelerates compliance adoption, but requires audit visibility (P1) to be valuable.

**Independent Test**: Can be tested by navigating to a non-compliant project, clicking "Create" on a missing file, verifying the file is pushed to the repo, and re-auditing to confirm the score improves.

**Acceptance Scenarios**:

1. **Given** a project is missing required files, **When** the user views the project detail, **Then** each missing file shows a "Create" button (for files with templates).
2. **Given** the user clicks "Create" on a missing file, **When** the file is successfully pushed to the repo, **Then** a success indicator and link to the created file are shown.
3. **Given** the user clicks "Create All", **When** all templated files are pushed, **Then** a summary banner shows how many files were created and a "Re-audit" button appears.

---

### User Story 6 - Browse Standards and References (Priority: P3)

As a user, I want to browse the code standards catalog and UI reference catalog from the dashboard so I can understand what governance standards apply.

**Why this priority**: Reference browsing supports understanding but is not core to compliance tracking.

**Independent Test**: Can be tested by navigating to the Standards page and verifying catalog items are listed with correct links to the registry repo.

**Acceptance Scenarios**:

1. **Given** the registry is loaded, **When** the user navigates to the Standards page, **Then** code standards and UI references are listed with names, categories, and links.
2. **Given** a standard is listed, **When** the user clicks its link, **Then** the correct file in the GitHub repo opens in a new tab.

---

### Edge Cases

- What happens when a repo has more than 100,000 files (tree truncation)? → The audit warns the user that results may be incomplete.
- What happens when the GitHub API rate limit is exceeded? → An error message is displayed and cached results are preserved.
- What happens when the registry manifest has malformed JSON? → A parsing error is shown without crashing the dashboard.
- What happens when a user has more than 500 repos? → Currently limited to 500; a future enhancement could paginate further.
- What happens when a governed repo is deleted or made inaccessible? → The audit reports an error for that specific project without blocking others.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load the SpeckKit registry manifest from the GitHub API contents endpoint and parse JSON embedded in Markdown files.
- **FR-002**: System MUST support authentication via Personal Access Token stored in the browser.
- **FR-003**: System MUST audit each governed project by crawling its full repo tree and pattern-matching files against SpeckKit profile requirements.
- **FR-004**: System MUST compute a compliance score as (found required files / total required files) × 100 for each project.
- **FR-005**: System MUST display project cards with compliance badges (compliant/partial/non-compliant), profile labels, visibility indicators, required file counts, and total file counts.
- **FR-006**: System MUST support toggling between "Governed Only" and "All My Repos" views, with the latter fetching all user-accessible repos via paginated API calls.
- **FR-007**: System MUST allow filtering by compliance status (compliant, partial, non-compliant, ungoverned), profile, and free-text search.
- **FR-008**: System MUST allow sorting by compliance score (non-compliant first) or alphabetically by name.
- **FR-009**: System MUST provide a project detail page showing matched files, missing files, suggestions, and project references.
- **FR-010**: System MUST support scaffolding missing files by pushing template content to the governed repo via the GitHub API.
- **FR-011**: System MUST support a "Create All" action to scaffold all missing templated files at once, with a summary banner showing results.
- **FR-012**: System MUST support a "Re-audit" action to force a fresh audit after scaffolding.
- **FR-013**: System MUST display a Standards page listing code standards and UI references from the registry catalogs, with correct links to files in the GitHub repo.
- **FR-014**: System MUST cache registry data and audit results with a configurable TTL to minimize API calls.
- **FR-015**: System MUST gracefully handle errors (API failures, auth issues, malformed data) with user-friendly messages without crashing.

### Key Entities

- **RegistryProject**: A project registered in the SpeckKit manifest. Key attributes: id, name, repo URL, profile type, status, speckitReviewable flag, spec directory.
- **AuditResult**: The result of auditing a single project. Key attributes: project reference, profile, compliance score, matched files (by category), missing required files, missing optional files, suggestions, errors.
- **ProjectTemplate**: The governance template defining profiles and their required/optional files. Key attributes: profile definitions, required file patterns, optional file patterns.
- **CodeStandard**: An entry in the code standards catalog. Key attributes: id, name, category, path, tags, applicability.
- **UIReference**: An entry in the UI reference catalog. Key attributes: id, name, platform, area, path, tags, reusable patterns.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view compliance status of all governed projects within 10 seconds of page load.
- **SC-002**: Users can identify non-compliant projects and their missing files in under 30 seconds.
- **SC-003**: Users can scaffold all missing files for a project in a single action (< 1 minute end-to-end).
- **SC-004**: 100% of governed projects in the registry are accurately audited with correct compliance scores.
- **SC-005**: Users can discover all accessible repos (up to 500) and distinguish governed from ungoverned repos.
- **SC-006**: Dashboard gracefully handles authentication failures, API errors, and malformed data without crashing.
