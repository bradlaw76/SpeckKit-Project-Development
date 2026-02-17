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

export default function Standards() {
  const { registryData, registryError } = useAppContext();
  const [activeTab, setActiveTab] = useState<'profiles' | 'code' | 'ui'>('profiles');

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
