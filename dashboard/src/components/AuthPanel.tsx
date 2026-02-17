import { useState } from 'react';
import { useAppContext } from '../App';
import {
  savePatToken,
  clearAuth,
  validateToken,
  startDeviceFlow,
  pollDeviceFlow,
} from '../lib/auth';
import { GITHUB_CLIENT_ID } from '../config/constants';

interface Props {
  onClose: () => void;
}

export default function AuthPanel({ onClose }: Props) {
  const { auth, setAuth } = useAppContext();
  const [patInput, setPATInput] = useState('');
  const [patError, setPATError] = useState('');
  const [deviceCodes, setDeviceCodes] = useState<{
    user_code: string;
    verification_uri: string;
    device_code: string;
    interval: number;
    expires_in: number;
  } | null>(null);
  const [devicePolling, setDevicePolling] = useState(false);
  const [deviceError, setDeviceError] = useState('');
  const [loading, setLoading] = useState(false);

  // ----- PAT Auth -----
  const handlePATSubmit = async () => {
    if (!patInput.trim()) return;
    setLoading(true);
    setPATError('');
    try {
      const result = await validateToken(patInput.trim());
      if (!result.valid) {
        setPATError('Invalid token — check that it has "repo" scope.');
        return;
      }
      savePatToken(patInput.trim());
      setAuth({
        method: 'pat',
        token: patInput.trim(),
        user: result.user,
        scopes: result.scopes,
      });
      onClose();
    } catch (err) {
      setPATError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // ----- Device Flow Auth -----
  const handleDeviceFlowStart = async () => {
    if (!GITHUB_CLIENT_ID) {
      setDeviceError(
        'No GitHub OAuth App configured. Set GITHUB_CLIENT_ID in config/constants.ts.'
      );
      return;
    }
    setDeviceError('');
    try {
      const codes = await startDeviceFlow();
      setDeviceCodes(codes);
    } catch (err) {
      setDeviceError(String(err));
    }
  };

  const handleDeviceFlowPoll = async () => {
    if (!deviceCodes) return;
    setDevicePolling(true);
    setDeviceError('');
    try {
      const token = await pollDeviceFlow(
        deviceCodes.device_code,
        deviceCodes.interval
      );
      const result = await validateToken(token);
      if (result.valid) {
        setAuth({
          method: 'device-flow',
          token,
          user: result.user,
          scopes: result.scopes,
        });
        onClose();
      }
    } catch (err) {
      setDeviceError(String(err));
    } finally {
      setDevicePolling(false);
    }
  };

  // ----- Disconnect -----
  const handleDisconnect = () => {
    clearAuth();
    setAuth({ method: 'none', token: null, user: null, scopes: [] });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>GitHub Authentication</h2>
          <button className="btn btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>

        {auth.user && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            Connected as <strong>{auth.user.login}</strong> via{' '}
            {auth.method === 'pat' ? 'Personal Access Token' : 'Device Flow'}
            <br />
            <small>Scopes: {auth.scopes.join(', ') || 'none'}</small>
          </div>
        )}

        {/* PAT Section */}
        <div className="auth-section">
          <h3>Personal Access Token</h3>
          <p className="text-muted">
            Create a{' '}
            <a
              href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=SpeckKit+Dashboard"
              target="_blank"
              rel="noreferrer"
            >
              fine-grained or classic token
            </a>{' '}
            with <code>repo</code> and <code>workflow</code> scopes.
          </p>
          <div className="input-group">
            <input
              type="password"
              className="input"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={patInput}
              onChange={(e) => setPATInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePATSubmit()}
            />
            <button
              className="btn btn-primary"
              onClick={handlePATSubmit}
              disabled={loading || !patInput.trim()}
            >
              {loading ? 'Validating…' : 'Connect'}
            </button>
          </div>
          {patError && <div className="alert alert-error">{patError}</div>}
        </div>

        {/* Device Flow Section */}
        <div className="auth-section">
          <h3>Device Flow (OAuth)</h3>
          {!deviceCodes ? (
            <>
              <p className="text-muted">
                Authenticate via browser without entering a token.
              </p>
              <button className="btn btn-primary" onClick={handleDeviceFlowStart}>
                Start Device Flow
              </button>
            </>
          ) : (
            <>
              <div className="alert alert-info">
                <p>
                  1. Go to{' '}
                  <a href={deviceCodes.verification_uri} target="_blank" rel="noreferrer">
                    {deviceCodes.verification_uri}
                  </a>
                </p>
                <p>
                  2. Enter code: <code className="device-code">{deviceCodes.user_code}</code>
                </p>
                <p>3. Authorize the app, then click "Check" below.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleDeviceFlowPoll}
                disabled={devicePolling}
              >
                {devicePolling ? 'Checking…' : 'Check Authorization'}
              </button>
            </>
          )}
          {deviceError && <div className="alert alert-error">{deviceError}</div>}
        </div>

        {/* Disconnect */}
        {auth.user && (
          <div className="auth-section">
            <button className="btn btn-danger" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
