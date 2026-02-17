import { useNavigate } from 'react-router-dom';
import type { AuditResult } from '../lib/auditor';
import ComplianceBadge from './ComplianceBadge';

interface Props {
  result: AuditResult;
  isHidden?: boolean;
  onToggleHide?: (repoId: string) => void;
}

export default function ProjectCard({ result, isHidden, onToggleHide }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`card card-interactive${isHidden ? ' card-hidden' : ''}`}
      onClick={() => navigate(`/project/${encodeURIComponent(result.project.id)}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/project/${encodeURIComponent(result.project.id)}`);
        }
      }}
    >
      <div className="card-header">
        <div className="card-title-row">
          <h3 className="card-title">{result.project.name}</h3>
          <ComplianceBadge score={result.complianceScore} size="sm" />
        </div>
        <span className="card-subtitle" title={result.project.repo}>
          {shortRepo(result.project.repo)}
        </span>
      </div>

      <div className="card-body">
        {/* Profile */}
        <div className="card-row">
          <span className="card-label">Profile</span>
          <span className="badge badge-blue">{result.profile}</span>
        </div>

        {/* Visibility */}
        <div className="card-row">
          <span className="card-label">Visibility</span>
          <span className={`badge ${result.isPrivate ? 'badge-purple' : 'badge-green'}`}>
            {result.isPrivate ? '🔒 Private' : '🌐 Public'}
          </span>
        </div>

        {/* Required file counts */}
        <div className="card-row">
          <span className="card-label">Required Files</span>
          <span>
            {result.foundRequired} / {result.totalRequired}
          </span>
        </div>

        {/* Total repo files */}
        <div className="card-row">
          <span className="card-label">Total Files</span>
          <span>{result.totalFiles}</span>
        </div>

        {/* Missing required */}
        {result.missingRequired.length > 0 && (
          <div className="card-row">
            <span className="card-label">Missing Required</span>
            <span className="badge badge-red">{result.missingRequired.length}</span>
          </div>
        )}

        {/* Compliance bar */}
        <div className="progress" title={`${result.complianceScore}% compliance`}>
          <div
            className="progress-bar"
            style={{
              width: `${result.complianceScore}%`,
              backgroundColor: getBarColor(result.complianceScore),
            }}
          />
        </div>
      </div>

      {/* Footer: suggestions + hide toggle */}
      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {result.suggestions.length > 0 ? (
          <span className="text-muted text-sm">
            💡 {result.suggestions.length} suggestion{result.suggestions.length > 1 ? 's' : ''}
          </span>
        ) : (
          <span />
        )}
        {onToggleHide && (
          <button
            className={`btn btn-sm ${isHidden ? 'btn-secondary' : 'btn-ghost'}`}
            title={isHidden ? 'Unhide this repo' : 'Hide this repo'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleHide(result.project.id);
            }}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
          >
            {isHidden ? '👁️ Unhide' : '🙈 Hide'}
          </button>
        )}
      </div>
    </div>
  );
}

function shortRepo(url: string): string {
  const match = url.match(/github\.com\/(.+)/);
  if (match) return match[1].replace(/\.git$/, '');
  return url;
}

function getBarColor(score: number): string {
  if (score >= 80) return 'var(--color-green)';
  if (score >= 60) return 'var(--color-yellow)';
  if (score >= 40) return 'var(--color-orange)';
  return 'var(--color-red)';
}
