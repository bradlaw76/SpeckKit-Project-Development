import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../App';
import { auditAllProjects, type AuditResult, getComplianceLabel } from '../lib/auditor';
import { listUserRepos, type RepoMeta } from '../lib/github-api';
import type { RegistryProject } from '../lib/registry';
import ProjectCard from '../components/ProjectCard';

type ComplianceFilter = 'all' | 'compliant' | 'partial' | 'non-compliant' | 'ungoverned';
type RepoSource = 'governed' | 'all-repos';

export default function Dashboard() {
  const { auth, registryData, registryError } = useAppContext();
  const [results, setResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [auditError, setAuditError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState<ComplianceFilter>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score'>('score');
  const [repoSource, setRepoSource] = useState<RepoSource>('governed');

  // User repos state
  const [userRepos, setUserRepos] = useState<RepoMeta[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const runAudit = useCallback(async () => {
    if (!registryData) return;

    let projectsToAudit: RegistryProject[] = [...registryData.index.projects];

    // If showing all repos, merge in ungoverned user repos
    if (repoSource === 'all-repos' && userRepos.length > 0) {
      const governedRepoNames = new Set(
        registryData.index.projects.map((p) => {
          const m = p.repo.match(/github\.com\/([^/]+\/[^/]+)/);
          return m ? m[1].toLowerCase() : p.repo.toLowerCase();
        })
      );

      const ungovernedProjects: RegistryProject[] = userRepos
        .filter((r) => !governedRepoNames.has(r.full_name.toLowerCase()))
        .map((r) => ({
          id: `user-repo:${r.full_name}`,
          name: r.name,
          repo: `https://github.com/${r.full_name}`,
          manifestUrl: '',
          type: 'ungoverned',
          status: r.description || '',
          speckitReviewable: false,
        }));

      projectsToAudit = [...projectsToAudit, ...ungovernedProjects];
    }

    if (projectsToAudit.length === 0) return;

    setLoading(true);
    setAuditError(null);
    setResults([]);
    setProgress({ done: 0, total: projectsToAudit.length });

    try {
      const auditResults = await auditAllProjects(
        projectsToAudit,
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
  }, [registryData, auth.token, repoSource, userRepos]);

  // Fetch user repos when authenticated
  useEffect(() => {
    if (!auth.token) {
      setUserRepos([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingRepos(true);
      try {
        // Fetch repos with simple pagination (up to 500 repos)
        const all: RepoMeta[] = [];
        const perPage = 100;
        for (let page = 1; page <= 5; page++) {
          const batch = await listUserRepos(auth.token!, page, perPage);
          all.push(...batch);
          if (batch.length < perPage) break;
        }
        if (!cancelled) setUserRepos(all);
      } catch {
        // Non-critical — governed repos still work
      } finally {
        if (!cancelled) setLoadingRepos(false);
      }
    })();
    return () => { cancelled = true; };
  }, [auth.token]);

  // Auto-audit when registry loads or repo source changes
  useEffect(() => {
    if (registryData && !loading) {
      // When switching to all-repos, wait for user repos to load
      if (repoSource === 'all-repos' && loadingRepos) return;
      runAudit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryData, repoSource, loadingRepos]);

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
      // Compliance filter
      if (complianceFilter !== 'all') {
        if (complianceFilter === 'ungoverned') {
          if (!r.project.id.startsWith('user-repo:')) return false;
        } else {
          const label = getComplianceLabel(r.complianceScore);
          if (label !== complianceFilter) return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        // Non-compliant first, then partial, then compliant
        const diff = a.complianceScore - b.complianceScore;
        if (diff !== 0) return diff;
        return a.project.name.localeCompare(b.project.name);
      }
      return a.project.name.localeCompare(b.project.name);
    });

  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.complianceScore, 0) / results.length)
      : 0;

  const complianceStats = {
    compliant: results.filter((r) => getComplianceLabel(r.complianceScore) === 'compliant').length,
    partial: results.filter((r) => getComplianceLabel(r.complianceScore) === 'partial').length,
    nonCompliant: results.filter((r) => getComplianceLabel(r.complianceScore) === 'non-compliant').length,
    ungoverned: results.filter((r) => r.project.id.startsWith('user-repo:')).length,
    governed: results.filter((r) => !r.project.id.startsWith('user-repo:')).length,
  };

  // ------ Render ------

  const isPrivateRepoError = registryError?.includes('PRIVATE_REPO');

  if (registryError) {
    return (
      <div className="page">
        {isPrivateRepoError ? (
          <div className="alert alert-warning">
            <strong>🔒 Private Repository</strong>
            <p style={{ margin: '0.5rem 0 0' }}>
              The SpeckKit registry is in a private repo. Click{' '}
              <strong>Connect GitHub</strong> in the top-right corner and enter a
              Personal Access Token with <code>repo</code> scope to load registry data.
            </p>
          </div>
        ) : (
          <div className="alert alert-error">
            <strong>Failed to load registry:</strong> {registryError}
          </div>
        )}
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
            {repoSource === 'governed'
              ? `${registryData.index.projects.length} governed project${registryData.index.projects.length !== 1 ? 's' : ''}`
              : `${results.length} repos (${complianceStats.governed} governed, ${complianceStats.ungoverned} discovered)`}
            {loadingRepos && ' • Loading repos…'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {auth.token && (
            <select
              className="input"
              value={repoSource}
              onChange={(e) => {
                setRepoSource(e.target.value as RepoSource);
                setResults([]); // reset so audit re-runs
              }}
              style={{ width: 'auto' }}
            >
              <option value="governed">Governed Only</option>
              <option value="all-repos">All My Repos</option>
            </select>
          )}
          <button className="btn btn-primary" onClick={runAudit} disabled={loading}>
            {loading ? `Auditing… (${progress.done}/${progress.total})` : '🔄 Run Audit'}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {results.length > 0 && (
        <div className="grid grid-4" style={{ marginBottom: '1rem' }}>
          <div className="card" onClick={() => setComplianceFilter('all')} role="button" style={{ cursor: 'pointer', outline: complianceFilter === 'all' ? '2px solid var(--color-primary)' : 'none' }}>
            <div className="card-body stat-card">
              <span className="stat-value">{results.length}</span>
              <span className="stat-label">Total • {avgScore}% Avg</span>
            </div>
          </div>
          <div className="card" onClick={() => setComplianceFilter('compliant')} role="button" style={{ cursor: 'pointer', outline: complianceFilter === 'compliant' ? '2px solid var(--color-green)' : 'none' }}>
            <div className="card-body stat-card">
              <span className="stat-value" style={{ color: 'var(--color-green)' }}>{complianceStats.compliant}</span>
              <span className="stat-label">✅ Compliant</span>
            </div>
          </div>
          <div className="card" onClick={() => setComplianceFilter('partial')} role="button" style={{ cursor: 'pointer', outline: complianceFilter === 'partial' ? '2px solid var(--color-yellow)' : 'none' }}>
            <div className="card-body stat-card">
              <span className="stat-value" style={{ color: 'var(--color-yellow)' }}>{complianceStats.partial}</span>
              <span className="stat-label">⚠️ Partial</span>
            </div>
          </div>
          <div className="card" onClick={() => setComplianceFilter('non-compliant')} role="button" style={{ cursor: 'pointer', outline: complianceFilter === 'non-compliant' ? '2px solid var(--color-red)' : 'none' }}>
            <div className="card-body stat-card">
              <span className="stat-value" style={{ color: 'var(--color-red)' }}>{complianceStats.nonCompliant}</span>
              <span className="stat-label">❌ Non-Compliant</span>
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
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value as ComplianceFilter)}
          >
            <option value="all">All Status</option>
            <option value="compliant">✅ Compliant</option>
            <option value="partial">⚠️ Partial</option>
            <option value="non-compliant">❌ Non-Compliant</option>
            {repoSource === 'all-repos' && <option value="ungoverned">📦 Ungoverned</option>}
          </select>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'score')}
          >
            <option value="score">Sort by Compliance</option>
            <option value="name">Sort by Name</option>
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
