import { getComplianceColor, getComplianceLabel } from '../lib/auditor';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ComplianceBadge({ score, size = 'md' }: Props) {
  const label = getComplianceLabel(score);
  const color = getComplianceColor(score);

  const sizeClasses: Record<string, string> = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  return (
    <span
      className={`badge ${sizeClasses[size]}`}
      style={{ backgroundColor: color, color: '#fff' }}
      title={`${score}% compliance — ${label}`}
    >
      {score}% {label}
    </span>
  );
}
