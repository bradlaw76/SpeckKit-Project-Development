# Data Model: Baseline Specification — SpeckKit Bootstrap & Onboarding

**Date**: 2026-02-17  
**Feature**: `002-baseline-spec`  
**Source**: Extracted from `dashboard/src/pages/Standards.tsx` (lines 14–146)

---

## Entities

### 1. Guide

Represents a single onboarding guide card displayed in the Getting Started tab.

**Source**: `Standards.tsx` — `interface Guide` (line 14)

```typescript
interface Guide {
  title: string;                                              // Display title on the card
  file: string;                                               // Relative path to the source file in the registry
  icon: string;                                               // Emoji icon displayed on the card
  summary: string;                                            // Multi-line description shown below the title
  steps: string[];                                            // Numbered steps displayed as an ordered list
  audience: string;                                           // "Who is this for?" label on the card
  category: 'entry-point' | 'code-standards' | 'ui-references';  // Groups guides into visual sections
  badge?: string;                                             // Optional badge (e.g., "Recommended") shown on card
}
```

**Validation Rules**:
- `title` — non-empty string, unique across all guides
- `file` — must resolve to an existing file in the registry (verified in research.md R2)
- `steps` — at least 1 step
- `category` — must be one of the three allowed values (enforced by TypeScript union)
- `badge` — if present, displayed as a colored tag; currently only `'Recommended'` is used

**Instances** (current, 6 total):

| Title | File | Category | Badge |
|-------|------|----------|-------|
| Setup for Projects (Unified) | `SETUP_FOR_PROJECTS.md` | entry-point | Recommended |
| Agent Behavior Defaults | `AGENT_BEHAVIOR_DEFAULTS.jsonc` | entry-point | — |
| Quick Start: Code Standards | `code-standards/QUICK_START_FOR_PROJECTS.md` | code-standards | — |
| How to Use Code Standards | `code-standards/HOW_TO_USE_CODE_STANDARDS.md` | code-standards | — |
| Quick Start: UI References | `ui-references/QUICK_START_FOR_PROJECTS.md` | ui-references | — |
| How to Use UI References | `ui-references/HOW_TO_USE_UI_REFERENCES.md` | ui-references | — |

---

### 2. BootstrapTab

Represents a selectable bootstrap method tab in the bootstrap card.

**Source**: `Standards.tsx` — `type BootstrapTab` (line 146)

```typescript
type BootstrapTab = 'copilot' | 'review' | 'comment' | 'cli-ps' | 'cli-bash';
```

**Tab → Content Mapping**:

| Key | Display Label | Content Constant | Description |
|-----|--------------|------------------|-------------|
| `copilot` | Copilot Chat | `COPILOT_CHAT_PROMPT` | One-line prompt for AI agent bootstrap |
| `review` | Existing Project | `COPILOT_REVIEW_PROMPT` | Multi-sentence review/audit prompt |
| `comment` | HTML Comment | `BOOTSTRAP_SNIPPET` | HTML comment block to paste into any repo |
| `cli-ps` | PowerShell | `CLI_POWERSHELL` | PowerShell submodule + scaffold script |
| `cli-bash` | Bash | `CLI_BASH` | Bash submodule + scaffold script |

**Default Value**: `'copilot'` (set as initial `useState` value — satisfies FR-002)

**State Transitions**: Tab selection is stateless — clicking any tab replaces the active content. No multi-step flow or state machine applies.

---

### 3. Bootstrap Snippet Constants

Immutable string constants containing the bootstrap prompts/snippets displayed in each tab.

**Source**: `Standards.tsx` — lines 125–145

| Constant | Type | Line | Sync Target in SETUP_FOR_PROJECTS.md |
|----------|------|------|--------------------------------------|
| `BOOTSTRAP_SNIPPET` | template literal | 125 | Method 3 (HTML Comment) |
| `CLI_POWERSHELL` | template literal | 130 | Method 1 (PowerShell) |
| `CLI_BASH` | template literal | 136 | Method 2 (Bash) |
| `COPILOT_CHAT_PROMPT` | template literal | 142 | Method 4 (Copilot Chat) |
| `COPILOT_REVIEW_PROMPT` | template literal | 144 | Method 5 (Review Existing Project) |

All constants interpolate `REGISTRY_OWNER` and `REGISTRY_REPO` from the shared config for the GitHub URL.

**Sync Requirement (FR-011)**: The executable content (commands, URLs, instructions) of these constants must match the corresponding method block in `SETUP_FOR_PROJECTS.md`. Cosmetic comment differences are acceptable per research.md R1.

---

### 4. Agent Discovery Flow

A conceptual entity documented in the "How It Works" section of the Getting Started tab and in `SETUP_FOR_PROJECTS.md`. Not a TypeScript type — it is rendered as static HTML content.

**Structure** (9 steps):

| Step | Action | Target Resource |
|------|--------|-----------------|
| 1 | Read | `AGENT_BEHAVIOR_DEFAULTS.jsonc` |
| 2 | Read | `SETUP_FOR_PROJECTS.md` |
| 3 | Ask | User for project profile |
| 4 | Read | Profile-specific required/optional file tables |
| 5 | Scaffold | `.github/copilot-instructions.md` |
| 6 | Scaffold | `SYSTEM_MANIFEST.json.md` |
| 7 | Apply | Code standards (auto-apply) |
| 8 | Ask | User about UI references (confirm-before-apply) |
| 9 | Scaffold | Any remaining optional files for the chosen profile |

**Referencing Options** (displayed alongside the flow):

| Method | Description |
|--------|-------------|
| Git Submodule | Clone registry as `.speckkit-registry/` submodule |
| Local Workspace | Reference registry files from a local directory |
| Raw GitHub URLs | Use `https://raw.githubusercontent.com/...` URLs |

---

## Relationships

```
Guide (6 instances)
  └── categorized by → Guide.category (3 groups)
  └── links to → registry file (Guide.file)

BootstrapTab (5 values)
  └── maps to → Bootstrap Snippet Constant (1:1)
  └── corresponds to → SETUP_FOR_PROJECTS.md method (1:1, FR-011)

Agent Discovery Flow (1 instance)
  └── documented in → "How It Works" section (Standards.tsx)
  └── documented in → SETUP_FOR_PROJECTS.md (canonical source)
```

---

## Notes

- **No database entities**: All data is static TypeScript constants. There are no CRUD operations, migrations, or persistence layers.
- **No API contracts needed**: This feature is entirely client-side rendering of static data. The only external "API" is GitHub raw file URLs, which are standard HTTP GET requests with no custom contracts.
- **Adding a new guide**: Add an entry to the `GUIDES` array in `Standards.tsx`. The category determines which section it appears in. The file path must resolve to an existing registry file.
- **Adding a new bootstrap method**: Add a new value to the `BootstrapTab` union type, create a new snippet constant, add a tab button and content block in the JSX, and add the corresponding method to `SETUP_FOR_PROJECTS.md`.
