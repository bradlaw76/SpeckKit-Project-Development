import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { auditProject, type AuditResult, type MissingFile, getComplianceColor } from '../lib/auditor';
import { hasTemplate, scaffoldFile, scaffoldAll, type ScaffoldResult } from '../lib/scaffold';
import ComplianceBadge from '../components/ComplianceBadge';
import type { FileCategory } from '../config/audit-patterns';

const CATEGORY_LABELS: Record<FileCategory, string> = {
  'speckkit-required': 'SpeckKit Required',
  'speckkit-optional': 'SpeckKit Optional',
  governance: 'Governance',
  documentation: 'Documentation',
  configuration: 'Configuration',
  testing: 'Testing',
  community: 'Community',
  code: 'Code',
  asset: 'Assets',
};

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { auth, registryData, auditResults } = useAppContext();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [scaffolding, setScaffolding] = useState<Record<string, 'pending' | 'success' | 'error'>>({}); 
  const [scaffoldErrors, setScaffoldErrors] = useState<Record<string, string>>({});
  const [scaffoldUrls, setScaffoldUrls] = useState<Record<string, string>>({});
  const [reauditing, setReauditing] = useState(false);

  const decodedId = decodeURIComponent(projectId ?? '');

  // Look up project: first from governed registry, then from cached audit results (ungoverned repos)
  const project = registryData?.index.projects.find((p) => p.id === decodedId)
    ?? auditResults.find((r) => r.project.id === decodedId)?.project
    ?? null;

  useEffect(() => {
    if (!project || !registryData) return;

    setLoading(true);
    auditProject(project, registryData.template, auth.token ?? null)
      .then(setResult)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [project, registryData, auth.token]);

  // ── Scaffold helpers (must be before early returns — React hooks rules) ──
  const repoOwner = result?.repoOwner ?? '';
  const repoName = result?.repoName ?? '';

  /** Clear cache and re-run the audit to verify scaffolded files */
  const handleReaudit = useCallback(async () => {
    if (!project || !registryData) return;
    setReauditing(true);
    try {
      const fresh = await auditProject(project, registryData.template, auth.token ?? null, true);
      setResult(fresh);
      // Reset scaffold state since we have fresh data
      setScaffolding({});
      setScaffoldErrors({});
      setScaffoldUrls({});
    } catch (err) {
      setError(String(err));
    } finally {
      setReauditing(false);
    }
  }, [project, registryData, auth.token]);

  const handleScaffoldOne = useCallback(async (pattern: string) => {
    if (!project || !auth.token) return;
    setScaffolding(prev => ({ ...prev, [pattern]: 'pending' }));
    const res = await scaffoldFile(project, repoOwner, repoName, pattern, auth.token);
    setScaffolding(prev => ({ ...prev, [pattern]: res.success ? 'success' : 'error' }));
    if (res.error) setScaffoldErrors(prev => ({ ...prev, [pattern]: res.error! }));
    if (res.htmlUrl) setScaffoldUrls(prev => ({ ...prev, [pattern]: res.htmlUrl! }));
  }, [project, auth.token, repoOwner, repoName]);

  const handleScaffoldAll = useCallback(async (items: MissingFile[]) => {
    if (!project || !auth.token) return;
    const paths = items.map(m => m.pattern.pattern).filter(p => hasTemplate(p) && !scaffolding[p]);
    if (paths.length === 0) return;
    setScaffolding(prev => {
      const next = { ...prev };
      paths.forEach(p => { next[p] = 'pending'; });
      return next;
    });
    const results = await scaffoldAll(project, repoOwner, repoName, paths, auth.token);
    const newStates: Record<string, 'success' | 'error'> = {};
    const newErrors: Record<string, string> = {};
    const newUrls: Record<string, string> = {};
    results.forEach(r => {
      newStates[r.path] = r.success ? 'success' : 'error';
      if (r.error) newErrors[r.path] = r.error;
      if (r.htmlUrl) newUrls[r.path] = r.htmlUrl;
    });
    setScaffolding(prev => ({ ...prev, ...newStates }));
    setScaffoldErrors(prev => ({ ...prev, ...newErrors }));
    setScaffoldUrls(prev => ({ ...prev, ...newUrls }));
  }, [project, auth.token, repoOwner, repoName, scaffolding]);

  // ── Early returns ─────────────────────────────────────────────────
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

  if (!project) {
    return (
      <div className="page">
        <div className="alert alert-error">
          Project not found: <code>{projectId}</code>
        </div>
        <button className="btn" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner" />
          <span>Auditing {project.name}…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
        <button className="btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    );
  }

  if (!result) return null;

  const scaffoldableRequired = result.missingRequired.filter(m => hasTemplate(m.pattern.pattern));
  const createdFiles = Object.entries(scaffoldUrls);
  const hasAnyScaffoldResults = Object.keys(scaffolding).some(k => scaffolding[k] === 'success' || scaffolding[k] === 'error');

  // Build correct GitHub link for the repo
  function repoLinkUrl(repo: string): string {
    if (/github\.com\//i.test(repo)) return repo;
    const shortMatch = repo.match(/^([^/]+)\/([^/]+)$/);
    if (shortMatch) return `https://github.com/${shortMatch[1]}/${shortMatch[2]}`;
    return `https://github.com/${repo}`;
  }

  return (
    <div className="page">
      {/* Back + Header */}
      <button className="btn btn-sm" onClick={() => navigate('/')}>
        ← Dashboard
      </button>

      {/* Scaffold Summary Banner */}
      {hasAnyScaffoldResults && (
        <div className="card" style={{ marginTop: '0.75rem', marginBottom: '1rem', border: '1px solid #2ea043' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>🛠️ Scaffold Results</h3>
                <p className="text-muted" style={{ margin: '0.25rem 0 0' }}>
                  Files created via SpeckKit Dashboard • Committed as <code>[SpeckKit] scaffold</code>
                </p>
              </div>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: '#1f6feb', borderColor: '#1f6feb' }}
                onClick={handleReaudit}
                disabled={reauditing}
              >
                {reauditing ? '🔄 Re-auditing…' : '🔄 Re-audit Now'}
              </button>
            </div>
            {createdFiles.length > 0 && (
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                {createdFiles.map(([path, url]) => (
                  <li key={path} style={{ marginBottom: '0.25rem' }}>
                    <span className="badge badge-green" style={{ marginRight: '0.5rem' }}>✓</span>
                    <code>{path}</code>
                    {' — '}
                    <a href={url} target="_blank" rel="noreferrer">View on GitHub ↗</a>
                  </li>
                ))}
              </ul>
            )}
            {Object.entries(scaffoldErrors).length > 0 && (
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                {Object.entries(scaffoldErrors).map(([path, err]) => (
                  <li key={path} style={{ marginBottom: '0.25rem', color: '#f85149' }}>
                    <span className="badge badge-red" style={{ marginRight: '0.5rem' }}>✗</span>
                    <code>{path}</code>
                    {' — '}{err}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="section-header" style={{ marginTop: '0.75rem' }}>
        <div>
          <h1>{project.name}</h1>
          <p className="text-muted">
            <a href={repoLinkUrl(project.repo)} target="_blank" rel="noreferrer">
              {project.repo}
            </a>
          </p>
        </div>
        <ComplianceBadge score={result.complianceScore} size="lg" />
      </div>

      {/* Summary Row */}
      <div className="grid grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-body stat-card">
            <span className="stat-value">{result.profile}</span>
            <span className="stat-label">Profile</span>
          </div>
        </div>
        <div className="card">
          <div className="card-body stat-card">
            <span className="stat-value">{result.totalFiles}</span>
            <span className="stat-label">Total Files</span>
          </div>
        </div>
        <div className="card">
          <div className="card-body stat-card">
            <span className="stat-value">{result.allMatches.length}</span>
            <span className="stat-label">Matched Patterns</span>
          </div>
        </div>
      </div>

      {/* Compliance Progress */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <h3>Compliance Score</h3>
          <div className="progress" style={{ height: '1.25rem', marginTop: '0.75rem' }}>
            <div
              className="progress-bar"
              style={{
                width: `${result.complianceScore}%`,
                backgroundColor: getComplianceColor(result.complianceScore),
              }}
            >
              {result.complianceScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Missing Required */}
      {result.missingRequired.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>
                ❌ Missing Required Files ({result.missingRequired.length})
              </h3>
              {auth.token && scaffoldableRequired.length > 0 && (
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: '#2ea043', borderColor: '#2ea043' }}
                  onClick={() => handleScaffoldAll(result.missingRequired)}
                  disabled={scaffoldableRequired.every(m => !!scaffolding[m.pattern.pattern])}
                >
                  🚀 Create All ({scaffoldableRequired.filter(m => !scaffolding[m.pattern.pattern]).length})
                </button>
              )}
            </div>
            <table className="table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Category</th>
                  <th>Suggestion</th>
                  {auth.token && <th style={{ width: '120px' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {result.missingRequired.map((m, i) => {
                  const pat = m.pattern.pattern;
                  const state = scaffolding[pat];
                  return (
                    <tr key={i}>
                      <td>
                        <code>{pat}</code>
                      </td>
                      <td>
                        <span className="badge badge-red">
                          {CATEGORY_LABELS[m.pattern.category]}
                        </span>
                      </td>
                      <td>{m.suggestion}</td>
                      {auth.token && (
                        <td>
                          {state === 'success' ? (
                            <a
                              href={scaffoldUrls[pat]}
                              target="_blank"
                              rel="noreferrer"
                              className="badge badge-green"
                              style={{ textDecoration: 'none' }}
                            >
                              ✓ Created
                            </a>
                          ) : state === 'pending' ? (
                            <span className="text-muted">Creating…</span>
                          ) : state === 'error' ? (
                            <span className="badge badge-red" title={scaffoldErrors[pat]}>
                              ✗ Failed
                            </span>
                          ) : hasTemplate(pat) ? (
                            <button
                              className="btn btn-sm"
                              onClick={() => handleScaffoldOne(pat)}
                            >
                              + Create
                            </button>
                          ) : (
                            <span className="text-muted text-sm">No template</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Missing Optional */}
      {result.missingOptional.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3>
              ⚠️ Missing Optional Files ({result.missingOptional.length})
            </h3>
            <table className="table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Category</th>
                  <th>Suggestion</th>
                  {auth.token && <th style={{ width: '120px' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {result.missingOptional.map((m, i) => {
                  const pat = m.pattern.pattern;
                  const state = scaffolding[pat];
                  return (
                    <tr key={i}>
                      <td>
                        <code>{pat}</code>
                      </td>
                      <td>
                        <span className="badge badge-yellow">
                          {CATEGORY_LABELS[m.pattern.category]}
                        </span>
                      </td>
                      <td>{m.suggestion}</td>
                      {auth.token && (
                        <td>
                          {state === 'success' ? (
                            <a
                              href={scaffoldUrls[pat]}
                              target="_blank"
                              rel="noreferrer"
                              className="badge badge-green"
                              style={{ textDecoration: 'none' }}
                            >
                              ✓ Created
                            </a>
                          ) : state === 'pending' ? (
                            <span className="text-muted">Creating…</span>
                          ) : state === 'error' ? (
                            <span className="badge badge-red" title={scaffoldErrors[pat]}>
                              ✗ Failed
                            </span>
                          ) : hasTemplate(pat) ? (
                            <button
                              className="btn btn-sm"
                              onClick={() => handleScaffoldOne(pat)}
                            >
                              + Create
                            </button>
                          ) : (
                            <span className="text-muted text-sm">No template</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Matched Files by Category */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <h3>✅ Matched Files</h3>
          {(Object.entries(result.matchedFiles) as [FileCategory, typeof result.allMatches][])
            .filter(([, files]) => files.length > 0)
            .map(([cat, files]) => (
              <div key={cat} className="category-group">
                <button
                  className="category-toggle"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === cat ? null : cat)
                  }
                >
                  <span>
                    {expandedCategory === cat ? '▼' : '▶'}{' '}
                    {CATEGORY_LABELS[cat]}{' '}
                    <span className="badge badge-blue">{files.length}</span>
                  </span>
                </button>
                {expandedCategory === cat && (
                  <ul className="file-list">
                    {files.map((f, i) => (
                      <li key={i}>
                        <code>{f.path}</code>
                        <span className="text-muted text-sm">
                          {' '}
                          — matched <em>{f.pattern.label}</em>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Cross-Project References */}
      {result.projectReferences.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3>🔗 Cross-Project References</h3>
            <table className="table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Relationship</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {result.projectReferences.map((ref, i) => (
                  <tr key={i}>
                    <td>
                      <a href={ref.manifestUrl} target="_blank" rel="noreferrer">
                        {ref.projectId}
                      </a>
                    </td>
                    <td>
                      <span className="badge badge-purple">{ref.relationship}</span>
                    </td>
                    <td>{ref.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h3>💡 Suggestions</h3>
            <ul className="suggestion-list">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          <strong>Audit warnings:</strong>
          <ul>
            {result.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
