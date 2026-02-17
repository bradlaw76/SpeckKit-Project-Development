import { useNavigate } from 'react-router-dom';
import type { AuditResult } from '../lib/auditor';
import ComplianceBadge from './ComplianceBadge';

interface Props {
  result: AuditResult;
}

export default function ProjectCard({ result }: Props) {
  const navigate = useNavigate();

  const matchedCount = Object.values(result.matchedFiles).reduce(
    (sum, files) => sum + files.length,
    0
  );

  return (
    <div
      className="card card-interactive"
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
        <span className="text-muted text-sm">{result.project.repo}</span>
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

        {/* File counts */}
        <div className="card-row">
          <span className="card-label">Files Matched</span>
          <span>
            {matchedCount} / {result.totalFiles}
          </span>
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

      {/* Suggestions preview */}
      {result.suggestions.length > 0 && (
        <div className="card-footer">
          <span className="text-muted text-sm">
            💡 {result.suggestions.length} suggestion{result.suggestions.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

function repoName(fullName: string): string {
  const parts = fullName.split('/');
  return parts[parts.length - 1] || fullName;
}

function getBarColor(score: number): string {
  if (score >= 80) return 'var(--color-green)';
  if (score >= 60) return 'var(--color-yellow)';
  if (score >= 40) return 'var(--color-orange)';
  return 'var(--color-red)';
}
