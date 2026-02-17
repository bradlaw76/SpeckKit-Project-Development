 import { useState } from 'react';
import { useAppContext } from '../App';
import { getProfileNames, type ProfileDefinition } from '../lib/registry';
import { REGISTRY_OWNER, REGISTRY_REPO } from '../config/constants';

/** Build a GitHub blob URL from a relative path */
function ghBlobUrl(basePath: string, filePath: string): string {
  const base = basePath.replace(/^\//, ''); // strip leading /
  const full = base ? `${base}/${filePath}` : filePath;
  return `https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/blob/main/${full}`;
}

/** Guides data — links to the onboarding docs in the repo */
interface Guide {
  title: string;
  file: string;
  icon: string;
  summary: string;
  steps: string[];
  audience: string;
  category: 'entry-point' | 'code-standards' | 'ui-references';
  badge?: string;
}

const GUIDES: Guide[] = [
  // ── Entry Points ──
  {
    title: 'Setup for Projects (Unified)',
    file: 'SETUP_FOR_PROJECTS.md',
    icon: '🏗️',
    summary:
      'The ONE file an AI agent or developer needs. Covers profile selection, file scaffolding, connection options (submodule / raw URL / local), Copilot instructions, manifest creation, cross-project referencing, and the full agent discovery flow.',
    steps: [
      'Choose your project profile (spec-governed, ux-demo, hybrid, ui-reference, code-standard)',
      'Scaffold required & optional template files for that profile',
      'Pick a connection method (Git submodule, raw URL, or local workspace)',
      'Create .github/copilot-instructions.md and SYSTEM_MANIFEST.json.md',
      'Commit and push — you\'re governed',
    ],
    audience: 'Anyone starting a new governed project — start here.',
    category: 'entry-point',
    badge: 'Recommended',
  },
  {
    title: 'Agent Behavior Defaults',
    file: 'AGENT_BEHAVIOR_DEFAULTS.jsonc',
    icon: '🤖',
    summary:
      'Machine-readable JSONC file that agents read FIRST. Defines which standards auto-apply (code standards = YES) and which require confirmation (UI references = ASK). Also lists the full agent discovery flow.',
    steps: [
      'Agent reads this file before acting on any standard',
      'Checks codeStandards.defaultApply → true → auto-apply',
      'Checks uiReferences.confirmBeforeApplying → true → ask user',
      'Follows the agentFlow sequence to set up a new project',
    ],
    audience: 'AI agents and developers building agent integrations.',
    category: 'entry-point',
  },

  // ── Code Standards ──
  {
    title: 'Quick Start: Code Standards',
    file: 'code-standards/QUICK_START_FOR_PROJECTS.md',
    icon: '🚀',
    summary:
      'Fast-track 2-file setup — copy-paste copilot-instructions.md and SYSTEM_MANIFEST.json.md into any VS Code project to get auto-applied comment headers immediately.',
    steps: [
      'Create .github/copilot-instructions.md with the standards reference',
      'Create or update SYSTEM_MANIFEST.json.md with codeStandards block',
      'Commit and push — agents auto-apply from that point on',
    ],
    audience: 'Developers who want the fastest path to code standards adoption.',
    category: 'code-standards',
  },
  {
    title: 'How to Use Code Standards',
    file: 'code-standards/HOW_TO_USE_CODE_STANDARDS.md',
    icon: '📖',
    summary:
      'Deep-dive guide — agent behavior rules, available standards, referencing options (submodule, raw URL, local), and how to contribute new standards to the catalog.',
    steps: [
      'Reference the standard in your project manifest',
      'Configure Copilot instructions with rules and catalog URLs',
      'Understand agent behavior defaults (auto-apply vs. ask-first)',
      'Learn how to add new standards to the catalog',
    ],
    audience: 'Teams who want full control over integration and want to contribute standards.',
    category: 'code-standards',
  },

  // ── UI References ──
  {
    title: 'Quick Start: UI References',
    file: 'ui-references/QUICK_START_FOR_PROJECTS.md',
    icon: '🎨',
    summary:
      'Fast-track setup for consuming SpeckKit UI reference models (e.g., Dynamics 365 layouts) from your project. Adds the ask-first agent instructions and manifest UI block.',
    steps: [
      'Create .github/copilot-instructions.md with the UI references section',
      'Add uiReferences block to SYSTEM_MANIFEST.json.md',
      'Optionally add .vscode/settings.json for workspace config',
      'Commit and push — agents will ask before loading UI context',
    ],
    audience: 'Developers building platform-specific UIs who want shared layout context.',
    category: 'ui-references',
  },
  {
    title: 'How to Use UI References',
    file: 'ui-references/HOW_TO_USE_UI_REFERENCES.md',
    icon: '📐',
    summary:
      'Deep-dive guide for UI reference integration — covers JSONC layout models, pattern extraction, agent loading behavior, and how to contribute new UI reference files.',
    steps: [
      'Understand what UI references are (structured JSONC layout models)',
      'Learn the ask-first agent behavior for UI context',
      'Extract reusable patterns and visual indicators',
      'Add new UI references for your platform',
    ],
    audience: 'Teams building or maintaining platform UI models.',
    category: 'ui-references',
  },
];

/** The one-liner bootstrap comment to paste into any new repo */
const BOOTSTRAP_SNIPPET = `<!-- SETUP: SpeckKit Registry Integration
Set up this project using the SpeckKit registry at https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO} — read SETUP_FOR_PROJECTS.md
-->`;

/** CLI bootstrap snippets */
const CLI_POWERSHELL = `# PowerShell — clone registry, scaffold copilot-instructions + manifest
git submodule add https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO}.git .speckkit-registry
mkdir -p .github
Copy-Item .speckkit-registry/code-standards/QUICK_START_FOR_PROJECTS.md .github/SPECKKIT_QUICKSTART.md
# Then follow SETUP_FOR_PROJECTS.md Steps 2-4`;

const CLI_BASH = `# Bash / macOS / Linux — same flow
git submodule add https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO}.git .speckkit-registry
mkdir -p .github
cp .speckkit-registry/code-standards/QUICK_START_FOR_PROJECTS.md .github/SPECKKIT_QUICKSTART.md
# Then follow SETUP_FOR_PROJECTS.md Steps 2-4`;

const COPILOT_CHAT_PROMPT = `Set up this project using the SpeckKit registry at https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO} — read SETUP_FOR_PROJECTS.md`;

type BootstrapTab = 'comment' | 'cli-ps' | 'cli-bash' | 'copilot';

const CATEGORY_LABELS: Record<Guide['category'], { label: string; color: string }> = {
  'entry-point': { label: '🏠 Entry Points', color: 'var(--accent)' },
  'code-standards': { label: '📝 Code Standards', color: 'var(--color-blue)' },
  'ui-references': { label: '🎨 UI References', color: 'var(--color-purple)' },
};

export default function Standards() {
  const { registryData, registryError } = useAppContext();
  const [activeTab, setActiveTab] = useState<'guides' | 'profiles' | 'code' | 'ui'>('guides');
  const [bootstrapTab, setBootstrapTab] = useState<BootstrapTab>('copilot');

  if (registryError) {
    return (
      <div className="page">
        <div className="alert alert-error">{registryError}</div>
      </div>
    );
  }

  if (!registryData) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner" />
          <span>Loading registry…</span>
        </div>
      </div>
    );
  }

  const { template, codeStandards, uiReferences } = registryData;
  const profileNames = getProfileNames(template);

  return (
    <div className="page">
      <div className="section-header">
        <h1>Standards &amp; References</h1>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'guides' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('guides')}
        >
          📘 Getting Started
        </button>
        <button
          className={`tab ${activeTab === 'profiles' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          Profiles ({profileNames.length})
        </button>
        <button
          className={`tab ${activeTab === 'code' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code Standards ({codeStandards?.standards?.length ?? 0})
        </button>
        <button
          className={`tab ${activeTab === 'ui' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('ui')}
        >
          UI References ({uiReferences?.references?.length ?? 0})
        </button>
      </div>

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="standards-content">
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            Everything you need to connect a VS Code project to the SpeckKit registry.
            Start with the <strong>Unified Setup Guide</strong>, or jump to a specific quick start.
          </p>

          {/* Bootstrap methods card */}
          <div className="card" style={{ marginBottom: '1.25rem', borderColor: 'var(--color-green)', borderWidth: 2 }}>
            <div className="card-body">
              <h3>💡 Bootstrap a New Project</h3>
              <p className="text-muted" style={{ margin: '0.5rem 0' }}>
                Four ways to connect any repo to SpeckKit. Pick the one that fits your workflow:
              </p>

              {/* Bootstrap method tabs */}
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {([
                  { key: 'copilot' as BootstrapTab, label: '🤖 Copilot Chat' },
                  { key: 'comment' as BootstrapTab, label: '📝 HTML Comment' },
                  { key: 'cli-ps' as BootstrapTab, label: '⚡ PowerShell' },
                  { key: 'cli-bash' as BootstrapTab, label: '🐚 Bash' },
                ]).map((t) => (
                  <button
                    key={t.key}
                    className={`btn btn-sm ${bootstrapTab === t.key ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setBootstrapTab(t.key)}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {bootstrapTab === 'comment' && (
                <>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
                    Paste this HTML comment into any file in a new repo (e.g., <code>README.md</code> or a spec file).
                    When an AI agent opens the project, it discovers SpeckKit and follows <code>SETUP_FOR_PROJECTS.md</code>.
                  </p>
                  <pre style={{
                    background: 'var(--bg-tertiary, #1a1a2e)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    <code>{BOOTSTRAP_SNIPPET}</code>
                  </pre>
                </>
              )}

              {bootstrapTab === 'copilot' && (
                <>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
                    Open <strong>GitHub Copilot Chat</strong> in VS Code (or any AI agent panel) and paste this prompt.
                    The agent will read the setup guide and scaffold everything for you.
                  </p>
                  <pre style={{
                    background: 'var(--bg-tertiary, #1a1a2e)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    <code>{COPILOT_CHAT_PROMPT}</code>
                  </pre>
                  <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>
                    Works with GitHub Copilot, Cursor, Windsurf, or any AI agent that can read URLs.
                    The agent will ask you which project profile to use and scaffold the required files.
                  </p>
                </>
              )}

              {bootstrapTab === 'cli-ps' && (
                <>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
                    Run in <strong>PowerShell</strong> from your project root to add SpeckKit as a Git submodule and copy the quick start guide.
                  </p>
                  <pre style={{
                    background: 'var(--bg-tertiary, #1a1a2e)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    <code>{CLI_POWERSHELL}</code>
                  </pre>
                </>
              )}

              {bootstrapTab === 'cli-bash' && (
                <>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
                    Run in <strong>Bash / macOS / Linux</strong> terminal from your project root.
                  </p>
                  <pre style={{
                    background: 'var(--bg-tertiary, #1a1a2e)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.375rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    <code>{CLI_BASH}</code>
                  </pre>
                </>
              )}

              <p className="text-muted text-sm" style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                All methods lead to the same result — a project wired to the SpeckKit registry with code standards auto-applied and UI references available on request.
              </p>
            </div>
          </div>

          {/* Guide cards grouped by category */}
          {(['entry-point', 'code-standards', 'ui-references'] as const).map((cat) => {
            const catGuides = GUIDES.filter((g) => g.category === cat);
            const { label, color } = CATEGORY_LABELS[cat];
            return (
              <div key={cat} style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', borderBottom: `2px solid ${color}`, paddingBottom: '0.35rem', marginBottom: '0.75rem' }}>
                  {label}
                </h2>
                {catGuides.map((g) => (
                  <div key={g.file} className="card" style={{ marginBottom: '0.75rem' }}>
                    <div className="card-body">
                      <div className="card-title-row">
                        <h3>
                          {g.icon} {g.title}
                        </h3>
                        {g.badge && (
                          <span className="badge badge-green">{g.badge}</span>
                        )}
                      </div>
                      <p className="text-muted" style={{ margin: '0.5rem 0' }}>
                        {g.summary}
                      </p>

                      <h4 style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>Steps</h4>
                      <ol style={{ margin: '0.25rem 0 0.75rem 1.25rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                        {g.steps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>

                      <div className="card-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                        <span className="card-label">Audience</span>
                        <span style={{ fontSize: '0.85rem' }}>{g.audience}</span>
                      </div>

                      <p style={{ marginTop: '0.75rem' }}>
                        <a
                          href={`https://github.com/${REGISTRY_OWNER}/${REGISTRY_REPO}/blob/main/${g.file}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 View full guide →
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* How it works summary */}
          <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--accent)' }}>
            <div className="card-body">
              <h3>⚙️ How It Works</h3>
              <p className="text-muted" style={{ margin: '0.5rem 0' }}>
                SpeckKit standards are consumed by AI agents following a defined discovery flow:
              </p>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Standard Type</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Default</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Agent Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.4rem 0.5rem' }}>Code Standards (comments, headers)</td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <span className="badge badge-green">YES — auto-apply</span>
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>Apply automatically without asking</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.4rem 0.5rem' }}>UI References (Dynamics layouts)</td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>
                      <span className="badge badge-yellow">ASK first</span>
                    </td>
                    <td style={{ padding: '0.4rem 0.5rem' }}>Confirm with user before loading context</td>
                  </tr>
                </tbody>
              </table>

              <h4 style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Agent Discovery Flow</h4>
              <ol style={{ margin: '0.25rem 0 0 1.25rem', fontSize: '0.85rem', lineHeight: '1.7' }}>
                <li>Read <code>AGENT_BEHAVIOR_DEFAULTS.jsonc</code> — understand defaults</li>
                <li>Read <code>system-manifests/PROJECT_TEMPLATE.json</code> — know profiles</li>
                <li>Ask: "What project profile?" (spec-governed / ux-demo / hybrid / ui-reference / code-standard)</li>
                <li>Scaffold required + optional files for chosen profile</li>
                <li>Read code standards catalog — load standards</li>
                <li>Read UI reference catalog — know what's available</li>
                <li>Apply code standards automatically</li>
                <li>Ask: "Do you need UI reference context?"</li>
                <li>Ask: "Does this project reference other SpeckKit projects?"</li>
              </ol>

              <h4 style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Referencing Options</h4>
              <ul style={{ margin: '0.25rem 0 0 1.25rem', fontSize: '0.85rem', lineHeight: '1.6' }}>
                <li><strong>Raw GitHub URL</strong> — Point agents at the raw content URL (simplest)</li>
                <li><strong>Git Submodule</strong> — Add the registry as a submodule for local access</li>
                <li><strong>Local Workspace</strong> — Reference from a sibling folder</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="standards-content">
          {profileNames.map((name) => {
            const p = template.profiles?.[name];
            if (!p) return null;
            return (
              <div key={name} className="card" style={{ marginBottom: '1rem' }}>
                <div className="card-body">
                  <h3>
                    <span className="badge badge-blue">{name}</span>
                  </h3>
                  {(p as ProfileDefinition & { description?: string }).description && (
                    <p className="text-muted" style={{ margin: '0.5rem 0' }}>
                      {(p as ProfileDefinition & { description?: string }).description}
                    </p>
                  )}

                  {p.requiredFiles && p.requiredFiles.length > 0 && (
                    <>
                      <h4 style={{ marginTop: '0.75rem' }}>Required Files</h4>
                      <ul className="file-list">
                        {p.requiredFiles.map((f: string, i: number) => (
                          <li key={i}>
                            <code>{f}</code>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {p.optionalFiles && p.optionalFiles.length > 0 && (
                    <>
                      <h4 style={{ marginTop: '0.75rem' }}>Optional Files</h4>
                      <ul className="file-list">
                        {p.optionalFiles.map((f: string, i: number) => (
                          <li key={i}>
                            <code>{f}</code>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Code Standards Tab */}
      {activeTab === 'code' && (
        <div className="standards-content">
          {codeStandards?.standards?.length ? (
            codeStandards.standards.map(
              (
                std: {
                  id: string;
                  name: string;
                  description?: string;
                  version?: string;
                  path?: string;
                  appliesTo?: string[];
                },
                i: number
              ) => (
                <div key={std.id ?? i} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="card-body">
                    <div className="card-title-row">
                      <h3>{std.name}</h3>
                      {std.version && (
                        <span className="badge badge-green">v{std.version}</span>
                      )}
                    </div>
                    {std.description && (
                      <p className="text-muted">{std.description}</p>
                    )}
                    {std.path && (
                      <p>
                        <a
                          href={ghBlobUrl(
                            (codeStandards?.catalog as Record<string, string>)?.path || 'code-standards',
                            std.path
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 View file →
                        </a>
                      </p>
                    )}
                    {std.appliesTo && std.appliesTo.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span className="card-label">Applies to: </span>
                        {std.appliesTo.map((t: string) => (
                          <span key={t} className="badge badge-purple" style={{ marginRight: '0.25rem' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="empty-state">No code standards registered yet.</div>
          )}
        </div>
      )}

      {/* UI References Tab */}
      {activeTab === 'ui' && (
        <div className="standards-content">
          {uiReferences?.references?.length ? (
            uiReferences.references.map(
              (
                ref: {
                  id: string;
                  name: string;
                  description?: string;
                  platform?: string;
                  area?: string;
                  path?: string;
                },
                i: number
              ) => (
                <div key={ref.id ?? i} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="card-body">
                    <h3>{ref.name}</h3>
                    {ref.description && (
                      <p className="text-muted">{ref.description}</p>
                    )}
                    <div style={{ marginTop: '0.5rem' }}>
                      {ref.platform && (
                        <span className="badge badge-blue" style={{ marginRight: '0.25rem' }}>
                          {ref.platform}
                        </span>
                      )}
                      {ref.area && (
                        <span className="badge badge-purple">{ref.area}</span>
                      )}
                    </div>
                    {ref.path && (
                      <p style={{ marginTop: '0.5rem' }}>
                        <a
                          href={ghBlobUrl(
                            (uiReferences?.catalog as Record<string, string>)?.path || 'ui-references',
                            ref.path
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 View file →
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="empty-state">No UI references registered yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
