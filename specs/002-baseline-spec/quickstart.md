# Quickstart: Baseline Specification — SpeckKit Bootstrap & Onboarding

**Date**: 2026-02-17  
**Feature**: `002-baseline-spec`  
**Purpose**: Guide implementers on how to modify, extend, or verify the bootstrap and onboarding system.

---

## Overview

The SpeckKit Bootstrap & Onboarding feature spans two surfaces:

1. **Dashboard UI** — The "Getting Started" tab in `dashboard/src/pages/Standards.tsx` (~400 lines of the 651-line file), which renders a tabbed bootstrap card, categorized guide cards, and a "How It Works" section.
2. **Canonical Document** — `SETUP_FOR_PROJECTS.md` at the repo root (~540 lines), which contains all five bootstrap methods, profile definitions, stub templates, and the 9-step agent discovery flow.

Both surfaces present the same content. FR-011 requires they stay in sync.

---

## Prerequisites

- Node.js 18+ and npm
- Repository cloned: `bradlaw76/SpeckKit-Project-Development`
- Working branch: `002-baseline-spec` (or a subsequent feature branch)

## Dev Environment

```bash
cd dashboard
npm install
npm run dev
# Open http://localhost:5174/SpeckKit-Project-Development/
# Navigate to Standards & References → Getting Started tab
```

---

## Common Tasks

### 1. Add a New Onboarding Guide

**Files to modify**: `Standards.tsx`

1. Add the guide's source file to the registry (e.g., `new-folder/MY_GUIDE.md`).
2. Add a new entry to the `GUIDES` array in `Standards.tsx`:

```typescript
{
  title: 'My New Guide',
  file: 'new-folder/MY_GUIDE.md',
  icon: '📋',
  summary: 'One-paragraph description of what this guide covers.',
  steps: [
    'Step 1 — what to do first',
    'Step 2 — what to do next',
  ],
  audience: 'Who should use this guide.',
  category: 'code-standards',  // or 'entry-point' | 'ui-references'
  // badge: 'New',  // optional
}
```

3. The guide card will appear automatically in the correct category section.

**Verification**: Load the Getting Started tab and confirm the card renders in the right group with the correct link.

---

### 2. Add a New Bootstrap Method

**Files to modify**: `Standards.tsx`, `SETUP_FOR_PROJECTS.md`

1. Add a new value to the `BootstrapTab` union type:

```typescript
type BootstrapTab = 'copilot' | 'review' | 'comment' | 'cli-ps' | 'cli-bash' | 'new-method';
```

2. Create a new snippet constant:

```typescript
const NEW_METHOD_SNIPPET = `...your prompt or script here...`;
```

3. Add a tab button in the JSX (search for the existing tab buttons, ~line 320):

```tsx
<button onClick={() => setActiveTab('new-method')} ...>
  🔧 New Method
</button>
```

4. Add a conditional content block (search for existing `{activeTab === ...}` blocks):

```tsx
{activeTab === 'new-method' && (
  <div>
    <p>Description of this method.</p>
    <pre><code>{NEW_METHOD_SNIPPET}</code></pre>
  </div>
)}
```

5. Add the corresponding method to `SETUP_FOR_PROJECTS.md` in the bootstrap methods section.

**Verification**:
- Dashboard: New tab appears, content renders, other tabs still work.
- Sync: Compare the snippet constant with the Markdown method — executable content must match (FR-011).

---

### 3. Update an Existing Bootstrap Prompt

**Files to modify**: `Standards.tsx`, `SETUP_FOR_PROJECTS.md`

1. Update the relevant constant in `Standards.tsx` (e.g., `COPILOT_CHAT_PROMPT`).
2. Update the corresponding method block in `SETUP_FOR_PROJECTS.md`.
3. Verify sync: The executable commands/URLs must be byte-identical between the two sources. Comment-only differences are acceptable.

---

### 4. Verify Prompt/Snippet Sync (FR-011)

Manual verification:

1. Open `Standards.tsx` and locate the 5 snippet constants (lines 125–145).
2. Open `SETUP_FOR_PROJECTS.md` and locate the 5 bootstrap method blocks.
3. Compare the executable content (commands, URLs, instructions) — they must match.
4. Cosmetic differences in comments are acceptable (see research.md R1).

---

### 5. Verify Guide File Paths

1. For each entry in the `GUIDES` array, check that the `file` property resolves to an existing file in the repository root.
2. All 6 current paths are validated in research.md R2.

---

## Architecture Notes

- **No API layer**: All content is static. No fetch calls, no backend, no database.
- **No shared data source**: Prompts exist in both `Standards.tsx` (for the dashboard) and `SETUP_FOR_PROJECTS.md` (for agents/developers). This is intentional duplication (see research.md R3, R5).
- **TypeScript enforcement**: The `BootstrapTab` union type and `Guide` interface catch type errors at compile time. Adding a new tab key without a matching content block will produce a TypeScript error in strict mode.
- **Category grouping**: Guide cards are grouped by `category` using `Array.filter()` in the JSX. The category order (Entry Points → Code Standards → UI References) is hardcoded in the render logic.

---

## Spec Traceability

| Task | Related FRs | Files |
|------|-------------|-------|
| Add guide | FR-005, FR-006 | `Standards.tsx` |
| Add bootstrap method | FR-001, FR-003, FR-011 | `Standards.tsx`, `SETUP_FOR_PROJECTS.md` |
| Update prompt | FR-003, FR-011 | `Standards.tsx`, `SETUP_FOR_PROJECTS.md` |
| Verify sync | FR-011 | Both files |
| Set default tab | FR-002 | `Standards.tsx` (useState init) |
