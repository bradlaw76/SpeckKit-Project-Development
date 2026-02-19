import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../App';
import { auditAllProjects, type AuditResult, getComplianceLabel } from '../lib/auditor';
import { listUserRepos, type RepoMeta } from '../lib/github-api';
import type { RegistryProject } from '../lib/registry';
import ProjectCard from '../components/ProjectCard';

type ComplianceFilter = 'all' | 'compliant' | 'partial' | 'non-compliant' | 'ungoverned';
type RepoSource = 'governed' | 'all-repos';

const HIDDEN_REPOS_KEY = 'speckkit_hidden_repos';

function loadHiddenRepos(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_REPOS_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function saveHiddenRepos(hidden: Set<string>) {
  localStorage.setItem(HIDDEN_REPOS_KEY, JSON.stringify([...hidden]));
}

export default function Dashboard() {
  const { auth, registryData, registryError, setAuditResults } = useAppContext();
  const [results, setResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [currentProject, setCurrentProject] = useState<string>('');
  const [auditError, setAuditError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState<ComplianceFilter>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score'>('score');
  const [repoSource, setRepoSource] = useState<RepoSource>(auth.token ? 'all-repos' : 'governed');

  // Hidden repos state
  const [hiddenRepos, setHiddenRepos] = useState<Set<string>>(loadHiddenRepos);
  const [showHidden, setShowHidden] = useState(false);

  const toggleHide = useCallback((repoId: string) => {
    setHiddenRepos((prev) => {
      const next = new Set(prev);
      if (next.has(repoId)) {
        next.delete(repoId);
      } else {
        next.add(repoId);
      }
      saveHiddenRepos(next);
      return next;
    });
  }, []);

  // User repos state
  const [userRepos, setUserRepos] = useState<RepoMeta[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  // Auto-switch to 'all-repos' when user connects a token
  useEffect(() => {
    if (auth.token && repoSource === 'governed') {
      setRepoSource('all-repos');
      setResults([]); // reset so audit re-runs
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]);

  const runAudit = useCallback(async () => {
    console.log('🔄 Run Audit button clicked');
    if (!registryData) {
      console.warn('❌ Cannot run audit: No registry data loaded');
      return;
    }

    console.log('✅ Starting audit with registry data:', {
      projectCount: registryData.index.projects.length,
      repoSource,
      hasToken: !!auth.token
    });

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

    if (projectsToAudit.length === 0) {
      console.warn('❌ No projects to audit');
      return;
    }

    console.log(`📊 Auditing ${projectsToAudit.length} projects...`);
    console.log('🔄 Setting loading to TRUE');
    setLoading(true);
    setAuditError(null);
    setResults([]);
    setProgress({ done: 0, total: projectsToAudit.length });
    setCurrentProject('');

    try {
      const freshResults = await auditAllProjects(
        projectsToAudit,
        registryData.template,
        auth.token ?? null,
        (done, total, current) => {
          console.log(`⏳ Progress: ${done}/${total} - Auditing: ${current}`);
          setProgress({ done, total });
          setCurrentProject(current);
        }
      );
      console.log(`✅ Audit complete! Found ${freshResults.length} results`);
      setResults(freshResults);
      setAuditResults(freshResults);
    } catch (err) {
      console.error('❌ Audit failed:', err);
      setAuditError(String(err));
    } finally {
      console.log('🏁 Audit finished, loading state cleared');
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
      // When switching to all-repos, require auth and wait for repos to load
      if (repoSource === 'all-repos' && (!auth.token || loadingRepos)) return;
      runAudit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registryData, repoSource, loadingRepos, auth.token]);

  // Derived
  const hiddenCount = results.filter((r) => hiddenRepos.has(r.project.id)).length;
  const visibleResults = showHidden ? results : results.filter((r) => !hiddenRepos.has(r.project.id));
  const profiles = [...new Set(visibleResults.map((r) => r.profile))].sort();
  const filtered = visibleResults
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
    visibleResults.length > 0
      ? Math.round(visibleResults.reduce((s, r) => s + r.complianceScore, 0) / visibleResults.length)
      : 0;

  const complianceStats = {
    compliant: visibleResults.filter((r) => getComplianceLabel(r.complianceScore) === 'compliant').length,
    partial: visibleResults.filter((r) => getComplianceLabel(r.complianceScore) === 'partial').length,
    nonCompliant: visibleResults.filter((r) => getComplianceLabel(r.complianceScore) === 'non-compliant').length,
    ungoverned: visibleResults.filter((r) => r.project.id.startsWith('user-repo:')).length,
    governed: visibleResults.filter((r) => !r.project.id.startsWith('user-repo:')).length,
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

  console.log('🎨 Rendering Dashboard - loading state:', loading, 'progress:', progress);

  return (
    <div className="page">
      {/* Header */}
      <div
        className="section-header"
        style={{
          background: 'linear-gradient(135deg, #1a2a3a 0%, #0d1f2d 100%)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left side: Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={`${import.meta.env.BASE_URL}beacer.gif`}
              alt="SpeckKit mascot"
              style={{
                height: '52px',
                width: 'auto',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                padding: '4px',
              }}
            />
            <div>
              <h1 style={{ margin: 0, color: '#38bdf8', letterSpacing: '-0.5px', fontSize: '1.75rem' }}>Project Dashboard</h1>
              <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {repoSource === 'governed'
                  ? `${registryData.index.projects.length} governed project${registryData.index.projects.length !== 1 ? 's' : ''}`
                  : `${visibleResults.length} repos (${complianceStats.governed} governed, ${complianceStats.ungoverned} discovered)`}
                {hiddenCount > 0 && ` • ${hiddenCount} hidden`}
                {loadingRepos && ' • Loading repos…'}
              </p>
            </div>
          </div>

          {/* Right side: Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              className="input"
              value={repoSource}
              onChange={(e) => {
                setRepoSource(e.target.value as RepoSource);
                setResults([]); // reset so audit re-runs
              }}
              style={{ minWidth: '150px' }}
              disabled={!auth.token}
              title={!auth.token ? 'Connect GitHub to view all your repos' : undefined}
            >
              <option value="governed">Governed Only</option>
              <option value="all-repos">All My Repos</option>
            </select>
            <button 
              className="btn btn-primary" 
              onClick={runAudit} 
              disabled={loading}
              style={{ whiteSpace: 'nowrap' }}
            >
              {loading ? `Auditing... (${progress.done}/${progress.total})` : '🔄 Run Audit'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar - Separate section below header */}
      {loading && (
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '2px solid #38bdf8',
          borderRadius: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <div style={{ 
              color: '#e2e8f0',
              fontSize: '0.875rem',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {currentProject ? `Auditing: ${currentProject}` : 'Starting audit...'}
            </div>
            <div style={{ 
              color: '#38bdf8', 
              fontSize: '0.875rem',
              fontWeight: '600',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {progress.done} / {progress.total}
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)',
              transition: 'width 0.3s ease-out'
            }} />
          </div>
        </div>
      )}

      {repoSource === 'all-repos' && !auth.token && (
        <div className="alert alert-warning" style={{ marginBottom: '0.75rem' }}>
          <strong>Connect GitHub</strong> to load all your repositories. Enter a Personal Access Token with <code>repo</code> scope using the <strong>Settings</strong> button.
        </div>
      )}

      {/* Summary cards */}
      {visibleResults.length > 0 && (
        <div className="grid grid-4" style={{ marginBottom: '1rem' }}>
          <div className="card" onClick={() => setComplianceFilter('all')} role="button" style={{ cursor: 'pointer', outline: complianceFilter === 'all' ? '2px solid var(--color-primary)' : 'none' }}>
            <div className="card-body stat-card">
              <span className="stat-value">{visibleResults.length}</span>
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
      {visibleResults.length > 0 && (
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
          {hiddenCount > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
              />
              Show Hidden ({hiddenCount})
            </label>
          )}
        </div>
      )}

      {/* Project Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-2">
          {filtered.map((r) => (
            <ProjectCard
              key={r.project.id}
              result={r}
              isHidden={hiddenRepos.has(r.project.id)}
              onToggleHide={toggleHide}
            />
          ))}
        </div>
      ) : visibleResults.length > 0 ? (
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
