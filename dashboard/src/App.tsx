import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { getStoredAuth, validateToken, type AuthState } from './lib/auth';
import type { RegistryData } from './lib/registry';
import { loadRegistryData } from './lib/registry';
import AuthPanel from './components/AuthPanel';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Standards from './pages/Standards';
import './App.css';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AppContextValue {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
  registryData: RegistryData | null;
  registryError: string | null;
  refreshRegistry: () => Promise<void>;
}

export const AppContext = createContext<AppContextValue>({
  auth: { method: 'none', token: null, user: null, scopes: [] },
  setAuth: () => {},
  registryData: null,
  registryError: null,
  refreshRegistry: async () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [auth, setAuth] = useState<AuthState>({
    method: 'none',
    token: null,
    user: null,
    scopes: [],
  });
  const [registryData, setRegistryData] = useState<RegistryData | null>(null);
  const [registryError, setRegistryError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Restore saved auth on mount
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored.token) {
      validateToken(stored.token).then((result) => {
        if (result.valid) {
          setAuth({
            method: stored.method,
            token: stored.token,
            user: result.user,
            scopes: result.scopes,
          });
        }
      });
    }
  }, []);

  // Load registry data on mount and when auth changes
  const refreshRegistry = async () => {
    try {
      setRegistryError(null);
      const data = await loadRegistryData(auth.token, true);
      setRegistryData(data);
    } catch (err) {
      setRegistryError(String(err));
    }
  };

  useEffect(() => {
    loadRegistryData(auth.token)
      .then(setRegistryData)
      .catch((err) => setRegistryError(String(err)));
  }, [auth.token]);

  return (
    <AppContext.Provider value={{ auth, setAuth, registryData, registryError, refreshRegistry }}>
      <div className="app">
        {/* Navigation */}
        <nav className="nav">
          <NavLink to="/" className="nav-logo">
            ⚙️ SpeckKit
          </NavLink>

          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/standards"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Standards
            </NavLink>
          </div>

          <div className="nav-auth">
            {auth.user ? (
              <div className="nav-auth-user">
                <img
                  src={auth.user.avatar_url}
                  alt={auth.user.login}
                  className="nav-auth-avatar"
                />
                <span>{auth.user.login}</span>
                <button className="btn btn-sm" onClick={() => setShowAuth(true)}>
                  Settings
                </button>
              </div>
            ) : (
              <button className="btn btn-sm btn-primary" onClick={() => setShowAuth(true)}>
                Connect GitHub
              </button>
            )}
          </div>
        </nav>

        {/* Auth Modal */}
        {showAuth && <AuthPanel onClose={() => setShowAuth(false)} />}

        {/* Main Content */}
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:projectId" element={<ProjectDetail />} />
            <Route path="/standards" element={<Standards />} />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  );
}
