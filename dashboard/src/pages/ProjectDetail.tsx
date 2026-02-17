import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { auditProject, type AuditResult, getComplianceColor } from '../lib/auditor';
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
  const { auth, registryData } = useAppContext();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const project = registryData?.index.projects.find(
    (p) => p.id === decodeURIComponent(projectId ?? '')
  );

  useEffect(() => {
    if (!project || !registryData) return;

    setLoading(true);
    auditProject(project, registryData.template, auth.token ?? null)
      .then(setResult)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [project, registryData, auth.token]);

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

  return (
    <div className="page">
      {/* Back + Header */}
      <button className="btn btn-sm" onClick={() => navigate('/')}>
        ← Dashboard
      </button>

      <div className="section-header" style={{ marginTop: '0.75rem' }}>
        <div>
          <h1>{project.name}</h1>
          <p className="text-muted">
            <a href={`https://github.com/${project.repo}`} target="_blank" rel="noreferrer">
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
            <h3>
              ❌ Missing Required Files ({result.missingRequired.length})
            </h3>
            <table className="table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Category</th>
                  <th>Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {result.missingRequired.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <code>{m.pattern.pattern}</code>
                    </td>
                    <td>
                      <span className="badge badge-red">
                        {CATEGORY_LABELS[m.pattern.category]}
                      </span>
                    </td>
                    <td>{m.suggestion}</td>
                  </tr>
                ))}
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
                </tr>
              </thead>
              <tbody>
                {result.missingOptional.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <code>{m.pattern.pattern}</code>
                    </td>
                    <td>
                      <span className="badge badge-yellow">
                        {CATEGORY_LABELS[m.pattern.category]}
                      </span>
                    </td>
                    <td>{m.suggestion}</td>
                  </tr>
                ))}
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
