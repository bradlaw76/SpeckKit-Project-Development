import { useState } from 'react';

type SetupStep = {
  id: string;
  title: string;
  description: string;
  command?: string;
  completed: boolean;
  optional?: boolean;
};

export default function SpeckKitSetup() {
  const [repoType, setRepoType] = useState<'new' | 'existing' | null>(null);
  const [newRepoSteps, setNewRepoSteps] = useState<SetupStep[]>([
    {
      id: 'create-repo',
      title: 'Create GitHub Repository',
      description: 'Create a new repository on GitHub or initialize locally',
      command: 'gh repo create <repo-name> --public --clone',
      completed: false
    },
    {
      id: 'check-spec-kit',
      title: 'Check for Existing Spec-Kit Installation',
      description: 'Verify if spec-kit is already installed in your project',
      command: 'npm list @github/spec-kit || echo "Not installed"',
      completed: false
    },
    {
      id: 'install-spec-kit',
      title: 'Install Spec-Kit Package',
      description: 'Install spec-kit as a dev dependency (skip if already installed)',
      command: 'npm install --save-dev @github/spec-kit',
      completed: false,
      optional: true
    },
    {
      id: 'config-env',
      title: 'Configure Environment',
      description: 'Set up .env file with necessary tokens and configuration if needed',
      command: 'touch .env',
      completed: false,
      optional: true
    },
    {
      id: 'setup-github-token',
      title: 'GitHub Token Setup',
      description: 'Create and add GitHub Personal Access Token (PAT) with repo scope',
      completed: false,
      optional: true
    },
    {
      id: 'init-spec',
      title: 'Generate Your First Spec',
      description: 'Use the spec-kit CLI to create your first specification document',
      command: 'npx spec-kit create',
      completed: false
    },
    {
      id: 'customize',
      title: 'Customize Templates',
      description: 'Modify spec-kit templates in the .spec-kit/ directory for your project needs',
      completed: false,
      optional: true
    }
  ]);

  const [existingRepoSteps, setExistingRepoSteps] = useState<SetupStep[]>([
    {
      id: 'backup',
      title: 'Backup Existing Files',
      description: 'Create a backup branch before making changes',
      command: 'git checkout -b backup-before-speck-kit',
      completed: false
    },
    {
      id: 'check-spec-kit',
      title: 'Check for Existing Spec-Kit Installation',
      description: 'Verify if spec-kit is already installed in your project',
      command: 'npm list @github/spec-kit || echo "Not installed"',
      completed: false
    },
    {
      id: 'install-spec-kit',
      title: 'Install Spec-Kit Package',
      description: 'Install spec-kit as a dev dependency (skip if already installed)',
      command: 'npm install --save-dev @github/spec-kit',
      completed: false,
      optional: true
    },
    {
      id: 'config-env',
      title: 'Configure Environment',
      description: 'Set up .env file with necessary tokens and configuration if needed',
      command: 'touch .env',
      completed: false,
      optional: true
    },
    {
      id: 'setup-github-token',
      title: 'GitHub Token Setup',
      description: 'Create and add GitHub Personal Access Token (PAT) with repo scope',
      completed: false,
      optional: true
    },
    {
      id: 'merge-configs',
      title: 'Merge Configurations',
      description: 'Integrate spec-kit configs with existing project configs',
      completed: false,
      optional: true
    },
    {
      id: 'init-spec',
      title: 'Generate Your First Spec',
      description: 'Use the spec-kit CLI to create your first specification document',
      command: 'npx spec-kit create',
      completed: false
    },
    {
      id: 'resolve-conflicts',
      title: 'Resolve Conflicts',
      description: 'Address any conflicts with existing documentation or templates',
      completed: false,
      optional: true
    }
  ]);

  const toggleStep = (stepId: string) => {
    if (repoType === 'new') {
      setNewRepoSteps(steps =>
        steps.map(step =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      );
    } else if (repoType === 'existing') {
      setExistingRepoSteps(steps =>
        steps.map(step =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      );
    }
  };

  const currentSteps = repoType === 'new' ? newRepoSteps : existingRepoSteps;
  const completedCount = currentSteps.filter(s => s.completed).length;
  const totalCount = currentSteps.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          SpeckKit Installation Wizard
        </h1>
        <p style={{ color: '#666' }}>
          Interactive guide to set up{' '}
          <a
            href="https://github.com/github/spec-kit"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0969da', textDecoration: 'none' }}
          >
            GitHub SpeckKit
          </a>{' '}
          in your project
        </p>
      </div>

      {!repoType ? (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
            What type of repository are you working with?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <button
              onClick={() => setRepoType('new')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                border: '2px solid #d0d7de',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0969da';
                e.currentTarget.style.background = '#f6f8fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d0d7de';
                e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                New Repository
              </h3>
              <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>
                Starting a brand new project with SpeckKit
              </p>
            </button>
            <button
              onClick={() => setRepoType('existing')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem',
                border: '2px solid #d0d7de',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1a7f37';
                e.currentTarget.style.background = '#f6f8fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d0d7de';
                e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔀</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Existing Repository
              </h3>
              <p style={{ color: '#666', textAlign: 'center', margin: 0 }}>
                Adding SpeckKit to an existing project
              </p>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                {repoType === 'new' ? '📁 New Repository' : '🔀 Existing Repository'} Setup
              </h2>
              <button
                onClick={() => setRepoType(null)}
                style={{
                  fontSize: '0.875rem',
                  color: '#0969da',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Change repository type
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                <span>Progress</span>
                <span>
                  {completedCount} of {totalCount} completed
                </span>
              </div>
              <div style={{
                width: '100%',
                background: '#e5e7eb',
                borderRadius: '9999px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    background: '#0969da',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.3s',
                    width: `${progress}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentSteps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '1.5rem',
                  opacity: step.completed ? 0.7 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => toggleStep(step.id)}
                    style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      border: step.completed ? 'none' : '2px solid #d0d7de',
                      borderRadius: '50%',
                      background: step.completed ? '#1a7f37' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      marginTop: '0.25rem'
                    }}
                  >
                    {step.completed && '✓'}
                  </button>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>
                        Step {index + 1}
                      </span>
                      {step.optional && (
                        <span style={{
                          fontSize: '0.75rem',
                          background: '#f6f8fa',
                          color: '#666',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #d0d7de'
                        }}>
                          Optional
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#666', marginBottom: step.command ? '1rem' : 0 }}>
                      {step.description}
                    </p>
                    {step.command && (
                      <div style={{
                        background: '#24292f',
                        color: '#f6f8fa',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        overflowX: 'auto',
                        position: 'relative'
                      }}>
                        <code>{step.command}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(step.command || '');
                          }}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: '#444c56',
                            border: 'none',
                            color: '#f6f8fa',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                          title="Copy to clipboard"
                        >
                          📋 Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            background: '#ddf4ff',
            border: '1px solid #54aeff',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📚 Additional Resources</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a
                  href="https://github.com/github/spec-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0969da' }}
                >
                  Official SpeckKit Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/github/spec-kit#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0969da' }}
                >
                  SpeckKit Documentation
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
