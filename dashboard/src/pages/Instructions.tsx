import { useState } from 'react';

type InstructionsTab = 'reference' | 'checklist';

export default function Instructions() {
  const [activeTab, setActiveTab] = useState<InstructionsTab>('reference');

  return (
    <div className="page">
      <h1>Instructions</h1>
      <p>Spec Kit + Squad combined workflow reference and checklist.</p>

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

      {/* Integration rules */}
      <section className="instructions-section">
        <h2>Integration Rules</h2>
        <ul>
          <li><strong>Spec Kit owns specs.</strong> Agents must not modify <code>spec.md</code> or <code>plan.md</code>. Changes flow through <code>/speckit.clarify</code> or <code>/speckit.plan</code> first.</li>
          <li><strong>Squad owns execution state.</strong> Don't manually update <code>.squad/decisions.md</code> mid-session — let Scribe merge.</li>
          <li><strong>Don't duplicate governance.</strong> Sync constitution summary to <code>decisions.md</code> once at setup.</li>
          <li><strong>taskstoissues before Ralph.</strong> Run <code>/speckit.taskstoissues</code> before <code>squad watch</code> — Ralph needs GitHub Issues as input.</li>
          <li><strong>Parallel = dependency-free only.</strong> Use the dependency graph in <code>tasks.md</code> to identify safe tasks.</li>
        </ul>
      </section>

      {/* Common mistakes */}
      <section className="instructions-section">
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

function ChecklistTab() {
  return <div>Checklist content coming soon.</div>;
}
