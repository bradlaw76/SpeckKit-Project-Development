# Instructions Tab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an Instructions nav tab with two sub-tabs — Reference (static Spec Kit + Squad docs) and Checklist (interactive localStorage-backed phase tracker).

**Architecture:** New `Instructions.tsx` page with local `useState` for active sub-tab and `localStorage` for checklist state. Wired into existing React Router routes and nav in `App.tsx`. No new dependencies — uses existing `.tab-bar`/`.tab`/`.tab-active` CSS classes.

**Tech Stack:** React 19, TypeScript 5.x strict, React Router, existing App.css tab styles

---

### Task 1: Add the Instructions route and nav link to App.tsx

**Files:**
- Modify: `dashboard/src/App.tsx:1-10` (imports)
- Modify: `dashboard/src/App.tsx:120-131` (nav links)
- Modify: `dashboard/src/App.tsx:155-165` (routes)

**Step 1: Write a failing test**

There are no unit tests for routing in this project — skip to step 3 and verify manually in the browser after implementation.

**Step 2: Add the import at the top of App.tsx**

After the `SpeckKitSetup` import line, add:
```typescript
import Instructions from './pages/Instructions';
```

**Step 3: Add the nav link**

In the `<div className="nav-links">` block, between the Standards and Setup NavLinks, add:
```tsx
<NavLink
  to="/instructions"
  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
>
  Instructions
</NavLink>
```

**Step 4: Add the route**

In the `<Routes>` block, after the `/standards` route, add:
```tsx
<Route path="/instructions" element={<Instructions />} />
```

**Step 5: Commit**
```bash
git add dashboard/src/App.tsx
git commit -m "feat: add /instructions route and nav link"
```

---

### Task 2: Create Instructions.tsx — shell with sub-tab bar

**Files:**
- Create: `dashboard/src/pages/Instructions.tsx`

**Step 1: Create the file with sub-tab state and empty panels**

```typescript
import { useState } from 'react';

type InstructionsTab = 'reference' | 'checklist';

export default function Instructions() {
  const [activeTab, setActiveTab] = useState<InstructionsTab>('reference');

  return (
    <div className="page-content">
      <h1 className="page-title">Instructions</h1>
      <p className="page-subtitle">Spec Kit + Squad combined workflow reference and checklist.</p>

      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'reference' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('reference')}
        >
          Reference
        </button>
        <button
          className={`tab ${activeTab === 'checklist' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          Checklist
        </button>
      </div>

      {activeTab === 'reference' && <ReferenceTab />}
      {activeTab === 'checklist' && <ChecklistTab />}
    </div>
  );
}

function ReferenceTab() {
  return <div>Reference content coming soon.</div>;
}

function ChecklistTab() {
  return <div>Checklist content coming soon.</div>;
}
```

**Step 2: Start the dev server and verify the tab renders**
```bash
cd dashboard && npm run dev
```
Navigate to `/instructions` — you should see the page title, two sub-tabs, and placeholder text. Clicking between tabs should switch the placeholder text.

**Step 3: Commit**
```bash
git add dashboard/src/pages/Instructions.tsx
git commit -m "feat: add Instructions page shell with sub-tab bar"
```

---

### Task 3: Build the Reference tab content

**Files:**
- Modify: `dashboard/src/pages/Instructions.tsx` — replace `ReferenceTab` function

**Step 1: Replace ReferenceTab with full content**

```typescript
function ReferenceTab() {
  return (
    <div className="instructions-reference">

      {/* Overview */}
      <section className="instructions-section">
        <h2>Overview</h2>
        <p>
          <strong>Spec Kit</strong> owns <em>what to build</em> (specification → plan → tasks).{' '}
          <strong>Squad</strong> owns <em>who builds it</em> (agent routing → parallel execution → persistent decisions).
          Together they form a complete pipeline: specifications drive agent work, agents record decisions,
          decisions refine future specs.
        </p>

        <h3>Setup</h3>
        <p>Run both initializers at project start:</p>
        <pre className="code-block">{`specify init    # creates .specify/ with templates and command hooks
squad init      # creates .squad/ with team roster, routing, ceremonies`}</pre>
        <p>Then seed Squad's decisions from the constitution:</p>
        <pre className="code-block">{`# After /speckit.constitution:
echo "## From Constitution\\n$(cat .specify/features/<name>/constitution.md)" >> .squad/decisions.md`}</pre>
      </section>

      {/* Pipeline */}
      <section className="instructions-section">
        <h2>Pipeline</h2>
        <pre className="code-block">{`/speckit.constitution → /speckit.specify → /speckit.clarify
       ↓
/speckit.plan → /speckit.tasks → ROUTE → Squad agents (parallel)
       ↓
/speckit.taskstoissues → Ralph watch mode
       ↓
/speckit.checklist → Squad retrospective (on failure)`}</pre>

        <h3>Phase 1: Specify</h3>
        <table className="table">
          <thead>
            <tr><th>Command</th><th>Output</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td><code>/speckit.constitution</code></td><td>Governing principles</td><td>Sync key decisions → <code>.squad/decisions.md</code></td></tr>
            <tr><td><code>/speckit.specify</code></td><td><code>spec.md</code></td><td>Source of truth — agents must not modify</td></tr>
            <tr><td><code>/speckit.clarify</code></td><td>Updated <code>spec.md</code></td><td>Resolve ambiguity before planning</td></tr>
            <tr><td><code>/speckit.plan</code></td><td><code>plan.md</code></td><td>Triggers Squad's Design Review ceremony</td></tr>
            <tr><td><code>/speckit.tasks</code></td><td><code>tasks.md</code></td><td>Input to agent routing</td></tr>
          </tbody>
        </table>

        <h3>Phase 2: Route</h3>
        <ol>
          <li>Read <code>tasks.md</code> — identify task categories (frontend, backend, testing, docs, security)</li>
          <li>Match categories to Squad agents via <code>.squad/routing.md</code></li>
          <li>Identify dependency-free tasks — safe for parallel execution</li>
          <li>Run <code>/speckit.taskstoissues</code> to create GitHub Issues for Ralph</li>
        </ol>

        <h3>Phase 3: Execute</h3>
        <ul>
          <li>Squad's <strong>Design Review ceremony</strong> fires automatically before work involving 2+ agents on shared systems</li>
          <li>Spawn agents in parallel for dependency-free task groups</li>
          <li>Each agent reads <code>.squad/decisions.md</code> before starting; writes new decisions to <code>.squad/decisions/inbox/</code></li>
          <li>Scribe merges inbox decisions after each session</li>
          <li><strong>Ralph watch mode</strong> (<code>squad watch</code>) polls GitHub Issues and auto-dispatches agents</li>
        </ul>

        <h3>Phase 4: Validate</h3>
        <ul>
          <li><code>/speckit.checklist</code> — verify implementation against spec acceptance criteria</li>
          <li><code>/speckit.analyze</code> — cross-artifact consistency check</li>
          <li>Squad <strong>Retrospective ceremony</strong> triggers automatically on build/test failure</li>
          <li>Agent learnings persist in <code>.squad/agents/&lt;name&gt;/history.md</code></li>
        </ul>
      </section>

      {/* When to use each tool */}
      <section className="instructions-section">
        <h2>When to Use Each Tool</h2>
        <table className="table">
          <thead>
            <tr><th>Scenario</th><th>Use</th></tr>
          </thead>
          <tbody>
            <tr><td>Solo feature, single agent</td><td>Spec Kit only — Squad adds overhead</td></tr>
            <tr><td>Team of specialists, parallel work</td><td>Both — full pipeline</td></tr>
            <tr><td>Existing spec, just need execution</td><td>Squad only — skip to routing phase</td></tr>
            <tr><td>Greenfield project with multiple components</td><td>Both — from constitution forward</td></tr>
          </tbody>
        </table>
      </section>

      {/* Integration rules + Common mistakes */}
      <section className="instructions-section">
        <h2>Integration Rules</h2>
        <ul>
          <li><strong>Spec Kit owns specs.</strong> Agents must not modify <code>spec.md</code> or <code>plan.md</code>. Changes flow through <code>/speckit.clarify</code> or <code>/speckit.plan</code> first.</li>
          <li><strong>Squad owns execution state.</strong> Don't manually update <code>.squad/decisions.md</code> mid-session — let Scribe merge.</li>
          <li><strong>Don't duplicate governance.</strong> Sync constitution summary to <code>decisions.md</code> once at setup.</li>
          <li><strong>taskstoissues before Ralph.</strong> Run <code>/speckit.taskstoissues</code> before <code>squad watch</code> — Ralph needs GitHub Issues as input.</li>
          <li><strong>Parallel = dependency-free only.</strong> Use the dependency graph in <code>tasks.md</code> to identify safe tasks.</li>
        </ul>

        <h2>Common Mistakes</h2>
        <table className="table">
          <thead>
            <tr><th>Mistake</th><th>Fix</th></tr>
          </thead>
          <tbody>
            <tr><td>Running <code>squad watch</code> before <code>tasks.md</code> exists</td><td>Always complete Spec Kit's tasks phase first</td></tr>
            <tr><td>Agents modifying <code>spec.md</code> directly</td><td>Route changes through <code>/speckit.clarify</code></td></tr>
            <tr><td>Separate constitution and squad decisions</td><td>Seed <code>decisions.md</code> from constitution at init</td></tr>
            <tr><td>Parallelizing dependent tasks</td><td>Read the dependency graph in <code>tasks.md</code> first</td></tr>
            <tr><td>Skipping Design Review for multi-agent work</td><td>Let Squad's <code>ceremonies.md</code> trigger automatically</td></tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
```

**Step 2: Verify in the browser**

Navigate to `/instructions` → Reference tab. You should see all four sections with tables and code blocks rendering correctly.

**Step 3: Commit**
```bash
git add dashboard/src/pages/Instructions.tsx
git commit -m "feat: add Reference tab content to Instructions page"
```

---

### Task 4: Build the Checklist tab — state model

**Files:**
- Modify: `dashboard/src/pages/Instructions.tsx` — add checklist state logic above `ChecklistTab`

**Step 1: Define the checklist data and localStorage helpers**

Add this above the `ChecklistTab` function:

```typescript
// ---------------------------------------------------------------------------
// Checklist data
// ---------------------------------------------------------------------------

interface ChecklistItem {
  id: string;
  label: string;
  code?: string; // optional inline command
}

interface ChecklistPhase {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const PHASES: ChecklistPhase[] = [
  {
    id: 'specify',
    title: 'Phase 1: Specify',
    items: [
      { id: 'specify-init', label: 'Run specify init', code: 'specify init' },
      { id: 'squad-init', label: 'Run squad init', code: 'squad init' },
      { id: 'seed-decisions', label: 'Seed .squad/decisions.md from constitution principles' },
      { id: 'speckit-specify', label: 'Run /speckit.specify', code: '/speckit.specify' },
      { id: 'speckit-clarify', label: 'Run /speckit.clarify', code: '/speckit.clarify' },
      { id: 'speckit-plan', label: 'Run /speckit.plan', code: '/speckit.plan' },
      { id: 'speckit-tasks', label: 'Run /speckit.tasks', code: '/speckit.tasks' },
    ],
  },
  {
    id: 'route',
    title: 'Phase 2: Route',
    items: [
      { id: 'map-tasks', label: 'Map task categories to agents in .squad/routing.md' },
      { id: 'identify-parallel', label: 'Identify dependency-free tasks for parallel execution' },
      { id: 'taskstoissues', label: 'Run /speckit.taskstoissues', code: '/speckit.taskstoissues' },
    ],
  },
  {
    id: 'execute',
    title: 'Phase 3: Execute',
    items: [
      { id: 'design-review', label: 'Design Review ceremony completed (if 2+ agents on shared systems)' },
      { id: 'spawn-agents', label: 'Agents spawned for parallel task groups' },
      { id: 'decisions-inbox', label: 'Decisions written to .squad/decisions/inbox/' },
      { id: 'squad-watch', label: 'squad watch activated (Ralph polling)', code: 'squad watch' },
    ],
  },
  {
    id: 'validate',
    title: 'Phase 4: Validate',
    items: [
      { id: 'checklist', label: 'Run /speckit.checklist', code: '/speckit.checklist' },
      { id: 'analyze', label: 'Run /speckit.analyze', code: '/speckit.analyze' },
      { id: 'history', label: 'Agent learnings confirmed in .squad/agents/<name>/history.md' },
    ],
  },
];

const STORAGE_KEY = 'speckkit-instructions-checklist';

function loadCheckedItems(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCheckedItems(items: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
```

**Step 2: Commit**
```bash
git add dashboard/src/pages/Instructions.tsx
git commit -m "feat: add checklist data model and localStorage helpers"
```

---

### Task 5: Build the Checklist tab — UI

**Files:**
- Modify: `dashboard/src/pages/Instructions.tsx` — replace `ChecklistTab` function

**Step 1: Replace ChecklistTab with interactive implementation**

```typescript
function ChecklistTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadCheckedItems);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(PHASES.map((p) => [p.id, true]))
  );

  function toggle(itemId: string) {
    const next = { ...checked, [itemId]: !checked[itemId] };
    setChecked(next);
    saveCheckedItems(next);
  }

  function togglePhase(phaseId: string) {
    setExpanded((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }

  function reset() {
    setChecked({});
    saveCheckedItems({});
  }

  const totalItems = PHASES.flatMap((p) => p.items).length;
  const doneItems = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="instructions-checklist">
      <div className="checklist-header">
        <div className="checklist-progress">
          <span>{doneItems} / {totalItems} steps complete ({pct}%)</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button className="btn btn-sm" onClick={reset}>Reset</button>
      </div>

      {PHASES.map((phase) => {
        const phaseItems = phase.items;
        const phaseDone = phaseItems.filter((i) => checked[i.id]).length;
        const isComplete = phaseDone === phaseItems.length;
        const isOpen = expanded[phase.id];

        return (
          <div key={phase.id} className={`checklist-phase ${isComplete ? 'phase-complete' : ''}`}>
            <button className="phase-header" onClick={() => togglePhase(phase.id)}>
              <span className="phase-title">
                {isComplete ? '✅' : '⬜'} {phase.title}
              </span>
              <span className="phase-meta">{phaseDone}/{phaseItems.length} {isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <ul className="phase-items">
                {phaseItems.map((item) => (
                  <li key={item.id} className={`phase-item ${checked[item.id] ? 'item-checked' : ''}`}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!checked[item.id]}
                        onChange={() => toggle(item.id)}
                      />
                      <span>{item.label}</span>
                      {item.code && <code className="item-code">{item.code}</code>}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Verify in the browser**

Navigate to `/instructions` → Checklist tab. Check a few boxes — they should persist after a page refresh. The progress bar should update. Reset should clear all boxes.

**Step 3: Commit**
```bash
git add dashboard/src/pages/Instructions.tsx
git commit -m "feat: add interactive Checklist tab with localStorage persistence"
```

---

### Task 6: Add CSS for Instructions page

**Files:**
- Modify: `dashboard/src/App.css` — append new rules at the end

**Step 1: Append styles to App.css**

```css
/* --- Instructions Page --- */
.instructions-reference {
  max-width: 860px;
}

.instructions-section {
  margin-bottom: 2.5rem;
}

.instructions-section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
}

.instructions-section h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 1.25rem 0 0.5rem;
}

.code-block {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  font-family: monospace;
  white-space: pre-wrap;
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

/* Checklist */
.instructions-checklist {
  max-width: 680px;
}

.checklist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checklist-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.progress-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.2s ease;
}

.checklist-phase {
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.checklist-phase.phase-complete {
  border-color: var(--accent);
  opacity: 0.85;
}

.phase-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  text-align: left;
}

.phase-header:hover {
  background: var(--bg-tertiary);
}

.phase-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.phase-meta {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.phase-items {
  list-style: none;
  padding: 0.5rem 1rem 0.75rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--border);
  background: var(--bg-primary);
}

.phase-item label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
}

.phase-item.item-checked label {
  color: var(--text-secondary);
  text-decoration: line-through;
}

.item-code {
  font-size: 0.75rem;
  background: var(--bg-tertiary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  color: var(--accent);
  font-family: monospace;
}
```

**Step 2: Verify visually**

Check Reference and Checklist tabs both look clean — tables, code blocks, phase cards, progress bar.

**Step 3: Commit**
```bash
git add dashboard/src/App.css
git commit -m "feat: add Instructions page CSS"
```

---

## Done

All tasks complete. The Instructions tab is fully functional:
- Route `/instructions` wired in React Router
- Reference tab: static pipeline docs with tables and code blocks
- Checklist tab: interactive phase tracker with localStorage persistence and progress bar
