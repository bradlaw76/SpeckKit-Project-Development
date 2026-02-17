import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../App';
import { auditAllProjects, type AuditResult } from '../lib/auditor';
import ProjectCard from '../components/ProjectCard';

export default function Dashboard() {
  const { auth, registryData, registryError } = useAppContext();
  const [results, setResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [auditError, setAuditError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'score'>('name');

  const runAudit = useCallback(async () => {
    if (!registryData) return;

    const projects = registryData.index.projects;
    if (projects.length === 0) return;

    setLoading(true);
    setAuditError(null);
    setResults([]);
    setProgress({ done: 0, total: projects.length });

    try {
      const auditResults = await auditAllProjects(
        projects,
        registryData.template,
        auth.token ?? null,
        (done, total) => setProgress({ done, total })
      );
      setResults(auditResults);
    } catch (err) {
      setAuditError(String(err));
    } finally {
      setLoading(false);
    }
  }, [registryData, auth.token]);

  // Auto-audit when registry loads
  useEffect(() => {
    if (registryData && results.length === 0 && !loading) {
      runAudit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryData]);

  // Derived
  const profiles = [...new Set(results.map((r) => r.profile))].sort();
  const filtered = results
    .filter((r) => {
      if (filter) {
        const q = filter.toLowerCase();
        const name = r.project.name.toLowerCase();
        const repo = r.project.repo.toLowerCase();
        if (!name.includes(q) && !repo.includes(q)) return false;
      }
      if (profileFilter !== 'all' && r.profile !== profileFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.complianceScore - a.complianceScore;
      return a.project.name.localeCompare(b.project.name);
    });

  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.complianceScore, 0) / results.length)
      : 0;

  // ------ Render ------

  if (registryError) {
    return (
      <div className="page">
        <div className="alert alert-error">
          <strong>Failed to load registry:</strong> {registryError}
        </div>
      </div>
    );
  }

  if (!registryData) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner" />
          <span>Loading registry data…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1>Project Dashboard</h1>
          <p className="text-muted">
            {registryData.index.projects.length} project
            {registryData.index.projects.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button className="btn btn-primary" onClick={runAudit} disabled={loading}>
          {loading ? `Auditing… (${progress.done}/${progress.total})` : '🔄 Run Audit'}
        </button>
      </div>

      {/* Summary cards */}
      {results.length > 0 && (
        <div className="grid grid-3">
          <div className="card">
            <div className="card-body stat-card">
              <span className="stat-value">{results.length}</span>
              <span className="stat-label">Projects Audited</span>
            </div>
          </div>
          <div className="card">
            <div className="card-body stat-card">
              <span className="stat-value">{avgScore}%</span>
              <span className="stat-label">Avg Compliance</span>
            </div>
          </div>
          <div className="card">
            <div className="card-body stat-card">
              <span className="stat-value">
                {results.filter((r) => r.complianceScore >= 80).length}
              </span>
              <span className="stat-label">Fully Compliant</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar during audit */}
      {loading && (
        <div className="progress" style={{ marginBottom: '1rem' }}>
          <div
            className="progress-bar"
            style={{
              width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
            }}
          />
        </div>
      )}

      {auditError && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          {auditError}
        </div>
      )}

      {/* Filters */}
      {results.length > 0 && (
        <div className="filter-bar">
          <input
            type="text"
            className="input"
            placeholder="Search projects…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="input"
            value={profileFilter}
            onChange={(e) => setProfileFilter(e.target.value)}
          >
            <option value="all">All Profiles</option>
            {profiles.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'score')}
          >
            <option value="name">Sort by Name</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>
      )}

      {/* Project Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-2">
          {filtered.map((r) => (
            <ProjectCard key={r.project.id} result={r} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="empty-state">No projects match your filters.</div>
      ) : !loading ? (
        <div className="empty-state">
          <p>No audit results yet. Click <strong>Run Audit</strong> to scan all registered projects.</p>
          {!auth.token && (
            <p className="text-muted">
              Connect your GitHub account to access private repos.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
