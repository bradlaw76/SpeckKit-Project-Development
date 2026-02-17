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
const GUIDES = [
  {
    title: 'Quick Start for Projects',
    file: 'code-standards/QUICK_START_FOR_PROJECTS.md',
    icon: '🚀',
    summary:
      'Fast-track setup — copy-paste two files into any VS Code project to start getting auto-applied code standard headers immediately.',
    steps: [
      'Create .github/copilot-instructions.md with the standards reference',
      'Create or update SYSTEM_MANIFEST.json.md with codeStandards block',
      'Commit and push — agents auto-apply from that point on',
    ],
    audience: 'Developers who want the fastest path to adoption.',
  },
  {
    title: 'How to Use Code Standards',
    file: 'code-standards/HOW_TO_USE_CODE_STANDARDS.md',
    icon: '📖',
    summary:
      'Deep-dive integration guide explaining agent behavior, referencing options (submodule, raw URL, local workspace), and how to contribute new standards.',
    steps: [
      'Reference the standard in your project manifest',
      'Configure Copilot instructions with rules and catalog URLs',
      'Understand agent behavior defaults (auto-apply vs. ask-first)',
      'Learn how to add new standards to the catalog',
    ],
    audience: 'Teams who want full control over integration and want to contribute standards.',
  },
];

export default function Standards() {
  const { registryData, registryError } = useAppContext();
  const [activeTab, setActiveTab] = useState<'guides' | 'profiles' | 'code' | 'ui'>('guides');

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
            These guides walk you through adopting SpeckKit code standards in your own VS Code projects.
            Pick the <strong>Quick Start</strong> for a 2-file, copy-paste setup, or the <strong>Full Guide</strong> for
            deep integration and contributing new standards.
          </p>

          {GUIDES.map((g) => (
            <div key={g.file} className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-body">
                <div className="card-title-row">
                  <h3>
                    {g.icon} {g.title}
                  </h3>
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

          {/* How it works summary */}
          <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--accent)' }}>
            <div className="card-body">
              <h3>⚙️ How It Works</h3>
              <p className="text-muted" style={{ margin: '0.5rem 0' }}>
                SpeckKit code standards are <strong>auto-applied</strong> by AI agents. Here's the workflow:
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
