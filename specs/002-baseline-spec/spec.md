# Feature Specification: Baseline Specification — SpeckKit Bootstrap & Onboarding

**Feature Branch**: `002-baseline-spec`  
**Created**: 2026-02-17  
**Status**: Draft  
**Input**: User description: "Create baseline specification" — formalizing the SpeckKit bootstrap, onboarding guides, and existing-project review workflow as a governed feature specification.

## Context

The SpeckKit Compliance Dashboard includes a **Getting Started** tab on the Standards page that surfaces onboarding guides, bootstrap methods, and a "How It Works" section to help users and AI agents connect any project to the SpeckKit registry. Additionally, the `SETUP_FOR_PROJECTS.md` document serves as the single entry point for all bootstrap workflows. These capabilities were built iteratively but have **no formal specification** — this spec closes that gap.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Bootstrap Methods (Priority: P1)

As a developer or AI agent, I want to see all available methods for connecting a project to SpeckKit so I can pick the one that fits my workflow and get started immediately.

**Why this priority**: Without bootstrap discovery, no new project can connect to SpeckKit. This is the fundamental onboarding action.

**Independent Test**: Can be fully tested by navigating to the Standards page → Getting Started tab and verifying that all five bootstrap methods are displayed with selectable tabs and copy-ready prompts/snippets.

**Acceptance Scenarios**:

1. **Given** the dashboard Standards page is loaded, **When** the user selects the "Getting Started" tab, **Then** a bootstrap card is displayed with the title "Bootstrap or Review a Project" and five selectable method tabs.
2. **Given** the Getting Started tab is active, **When** the user clicks the "Copilot Chat" tab, **Then** the Copilot Chat prompt is displayed in a code block that can be copied.
3. **Given** the Getting Started tab is active, **When** the user clicks the "Existing Project" tab, **Then** the review prompt is displayed with an explanation of the 5-step agent review flow.
4. **Given** the Getting Started tab is active, **When** the user clicks any of the five method tabs (Copilot Chat, Existing Project, HTML Comment, PowerShell, Bash), **Then** the corresponding snippet and instructions are shown and the previously active method content is hidden.
5. **Given** the dashboard loads for the first time, **When** the Getting Started tab renders, **Then** "Copilot Chat" is the default selected bootstrap method.

---

### User Story 2 - Browse Onboarding Guides (Priority: P1)

As a developer, I want to browse categorized onboarding guides (entry points, code standards, UI references) so I can understand what SpeckKit offers and find the right documentation for my needs.

**Why this priority**: Guide discovery is essential for self-service onboarding — users need to understand the registry before connecting.

**Independent Test**: Can be tested by loading the Getting Started tab and verifying that all six guide cards appear, grouped into three categories, each with a title, summary, steps, audience, and a working link to the source file.

**Acceptance Scenarios**:

1. **Given** the Getting Started tab is active, **When** guide cards render below the bootstrap card, **Then** six guides are displayed across three category groups: Entry Points (2), Code Standards (2), and UI References (2).
2. **Given** a guide card is displayed, **When** the user views it, **Then** the card shows the guide's title, icon, summary, numbered steps, and intended audience.
3. **Given** a guide card with a "Recommended" badge, **When** the user sees the Entry Points section, **Then** the "Unified Setup Guide" card has a green "Recommended" badge visible.
4. **Given** a guide card is displayed, **When** the user clicks the "View full guide" link, **Then** the correct file in the GitHub registry repo opens in a new browser tab.

---

### User Story 3 - Understand Agent Discovery Flow (Priority: P2)

As a developer or AI agent integrator, I want to see a summary of how agents discover and apply SpeckKit standards so I can understand the automated behavior and configure my project correctly.

**Why this priority**: Understanding the agent flow is important for correctly configuring projects, but users can still bootstrap without this knowledge.

**Independent Test**: Can be tested by scrolling to the "How It Works" section within the Getting Started tab and verifying the agent behavior table, 9-step discovery flow, and referencing options are displayed.

**Acceptance Scenarios**:

1. **Given** the Getting Started tab is scrolled to the bottom, **When** the "How It Works" card renders, **Then** an agent behavior table is displayed showing which resources are auto-applied vs. ask-first.
2. **Given** the How It Works card is visible, **When** the user views the discovery flow section, **Then** a numbered 9-step list describes the exact agent sequence (Read, Ask, Scaffold, Apply).
3. **Given** the How It Works card is visible, **When** the user views the referencing options, **Then** three referencing methods are listed (Git Submodule, Local Workspace, Raw GitHub URLs) with brief descriptions.

---

### User Story 4 - Review an Existing Project (Priority: P2)

As a developer with an existing SpeckKit-integrated project, I want to use a dedicated review prompt so an AI agent can audit my project's current integration, identify gaps, and bring it up to date.

**Why this priority**: Existing projects that drift from standards need a clear re-entry point. Without this, only new projects benefit from the bootstrap flow.

**Independent Test**: Can be tested by selecting the "Existing Project" tab in the bootstrap card, copying the review prompt, pasting it into Copilot Chat in a project that has some SpeckKit files, and verifying the agent reads SETUP_FOR_PROJECTS.md and compares the project's files against its profile.

**Acceptance Scenarios**:

1. **Given** the bootstrap card is displayed, **When** the user clicks the "Existing Project" tab, **Then** a review-specific prompt is shown that instructs the agent to compare the project's current files against the registry.
2. **Given** the Existing Project tab is active, **When** the user reads the description, **Then** it explains that the agent will: identify the project profile, compare files, report gaps, and scaffold/update missing files.
3. **Given** a user copies the review prompt and pastes it into Copilot Chat for a project with an outdated `SYSTEM_MANIFEST.json.md`, **When** the agent executes, **Then** the agent reads `SETUP_FOR_PROJECTS.md`, identifies the profile, and reports which files are missing or outdated.

---

### User Story 5 - SETUP_FOR_PROJECTS.md as Canonical Bootstrap Reference (Priority: P1)

As an AI agent pointed at the SpeckKit registry, I want a single, comprehensive setup document (`SETUP_FOR_PROJECTS.md`) that contains all bootstrap methods, profile definitions, step-by-step instructions, and templates so I can set up any project without reading multiple files.

**Why this priority**: This is the foundational document that all bootstrap methods reference. Without it, no method works.

**Independent Test**: Can be tested by having an AI agent open a blank project, giving it the Copilot Chat prompt, and verifying it successfully reads `SETUP_FOR_PROJECTS.md`, asks for a profile, and scaffolds the correct files.

**Acceptance Scenarios**:

1. **Given** `SETUP_FOR_PROJECTS.md` exists in the registry, **When** an agent reads it, **Then** the document contains five bootstrap methods, a profile decision tree, required/optional file tables for all five profiles, stub templates, step-by-step connection instructions, and a quick links table.
2. **Given** an agent reads `SETUP_FOR_PROJECTS.md`, **When** it follows the 9-step agent discovery flow, **Then** it can determine the project profile, scaffold required files, apply code standards, and ask about UI references — all from information in this single document.
3. **Given** a user follows Method 5 (Review an Existing Project), **When** the agent compares the project against the profile requirements, **Then** it accurately identifies missing, outdated, or non-compliant files.

---

### Edge Cases

- What happens when the Getting Started tab loads but the registry data hasn't finished loading? → The page shows a loading spinner until registry data is available.
- What happens when a bootstrap prompt URL contains a private registry? → The agent will encounter a 404 and should prompt the user for a Personal Access Token.
- What happens when a user copies a snippet that references a moved or renamed file? → The snippet uses stable URLs pointing to `SETUP_FOR_PROJECTS.md` which is the canonical entry point and should not be renamed.
- What happens when a new bootstrap method is added? → The `BootstrapTab` type, tab array, and `SETUP_FOR_PROJECTS.md` must all be updated together to stay in sync.
- What happens when a guide file is removed from the registry? → The guide card's "View full guide" link will return a 404. The GUIDES array should be updated to match registry contents.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Getting Started tab MUST display a bootstrap card with five selectable method tabs: Copilot Chat, Existing Project, HTML Comment, PowerShell, and Bash.
- **FR-002**: The Copilot Chat tab MUST be the default selected tab when the Getting Started tab first renders.
- **FR-003**: Each bootstrap method tab MUST display a copy-ready code snippet or prompt with a description of how and when to use it.
- **FR-004**: The Existing Project tab MUST display a review prompt that instructs the agent to read `SETUP_FOR_PROJECTS.md`, identify the project profile, compare files, and scaffold/update anything missing or outdated.
- **FR-005**: The Getting Started tab MUST display six onboarding guide cards grouped into three categories: Entry Points, Code Standards, and UI References.
- **FR-006**: Each guide card MUST show a title, icon, summary, numbered steps, intended audience, and a link to the source file in the GitHub registry.
- **FR-007**: The "Unified Setup Guide" card MUST display a "Recommended" badge to indicate it is the primary entry point.
- **FR-008**: The Getting Started tab MUST display a "How It Works" section with an agent behavior table, the 9-step agent discovery flow, and three referencing options.
- **FR-009**: `SETUP_FOR_PROJECTS.md` MUST serve as the single canonical entry point for all bootstrap and review workflows, containing all five methods, profile definitions, stub templates, and step-by-step instructions.
- **FR-010**: `SETUP_FOR_PROJECTS.md` MUST include a "Review an Existing Project" method (Method 5) with a prompt that instructs the agent to compare the project's files against the profile requirements.
- **FR-011**: All bootstrap prompts and snippets in the dashboard MUST match the corresponding content in `SETUP_FOR_PROJECTS.md` to avoid drift between the two sources.
- **FR-012**: The Getting Started tab footer MUST display a summary statement that all methods lead to the same outcome.

### Key Entities

- **Bootstrap Method**: A way to connect a project to SpeckKit. Key attributes: method key (e.g., `copilot`, `review`, `comment`, `cli-ps`, `cli-bash`), display label, icon, snippet/prompt text, description.
- **Onboarding Guide**: A documentation resource for understanding SpeckKit integration. Key attributes: title, file path, icon, summary, steps, audience, category (entry-point / code-standards / ui-references), optional badge.
- **Agent Discovery Flow**: The 9-step sequence an AI agent follows when pointed at the SpeckKit registry. Key attributes: step number, action verb (Read/Ask/Scaffold/Apply), target resource.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify and select the appropriate bootstrap method immediately upon viewing the Getting Started tab — all five methods are labeled and selectable in a single card.
- **SC-002**: All five bootstrap methods are visible and selectable without scrolling past the bootstrap card.
- **SC-003**: 100% of guide cards link to valid files in the GitHub registry.
- **SC-004**: The bootstrap card content and `SETUP_FOR_PROJECTS.md` methods are in sync — no prompt or snippet differs between the two sources.
- **SC-005**: An AI agent given the Copilot Chat prompt can successfully read `SETUP_FOR_PROJECTS.md`, determine the project profile, and scaffold the required files.
- **SC-006**: An AI agent given the Existing Project review prompt can identify at least 1 missing or outdated file in a non-compliant project.

## Assumptions

- The SpeckKit registry repo URL (`bradlaw76/SpeckKit-Project-Development`) is stable and will not change.
- `SETUP_FOR_PROJECTS.md` is maintained as the single entry point; no parallel setup guides will be created.
- The five project profiles (spec-governed, ux-demo, hybrid, ui-reference, code-standard) are the complete set; new profiles would require both document and dashboard updates.
- Bootstrap methods target AI agents that can read GitHub URLs (Copilot, Cursor, Windsurf); agents without URL-reading capability fall back to the CLI or HTML comment methods.
- The dashboard's Getting Started tab is the primary UI surface for bootstrap discovery; `SETUP_FOR_PROJECTS.md` is the primary document surface.
