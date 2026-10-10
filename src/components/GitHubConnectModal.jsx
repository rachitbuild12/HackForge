import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  GitBranch,
  Search,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  X,
  Copy,
  Check,
  Key,
  Info,
  Layers,
  ArrowRight,
  Code2,
  Trash2,
  Globe,
  Radio
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useHackForge } from '../context/HackForgeContext';

export default function GitHubConnectModal({ isOpen, onClose, projectId = 'team-hyperdrive' }) {
  const {
    githubUser,
    githubConnectedRepo,
    isGithubLoading,
    githubError,
    githubAppStatus,
    checkGitHubAppStatus,
    checkGitHubAuthStatus,
    fetchGitHubAppRepos,
    associateGitHubAppRepo,
    disconnectGitHubApp,
    fetchGitHubRepos,
    associateGitHubRepo,
    disconnectGitHub,
    showToast
  } = useHackForge();

  // Mode: 'app' (GitHub App - Primary & Least Privilege) | 'token' (Direct Token Fallback)
  const [connectMethod, setConnectMethod] = useState('app');
  const [step, setStep] = useState('connect'); // 'connect' | 'select_repo' | 'success' | 'error'
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [actionError, setActionError] = useState('');
  const [directTokenInput, setDirectTokenInput] = useState('');
  const [isSubmittingToken, setIsSubmittingToken] = useState(false);

  // Check connection status when opened
  useEffect(() => {
    if (isOpen) {
      setActionError('');
      checkGitHubAppStatus().then(status => {
        if (status?.activeInstallationId) {
          setStep('select_repo');
          loadAppRepos(status.activeInstallationId);
        } else {
          // If already connected to a repo, show success/manage view
          if (githubConnectedRepo) {
            setStep('success');
          } else {
            setStep('connect');
          }
        }
      });
    }
  }, [isOpen, githubConnectedRepo]);

  const loadAppRepos = async (installationId) => {
    setLoadingRepos(true);
    setActionError('');
    try {
      const repos = await fetchGitHubAppRepos(installationId);
      setRepositories(repos || []);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch repositories authorized by GitHub App');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleInstallGitHubApp = () => {
    // Navigate to server GitHub App installation endpoint (CSRF state protected)
    window.location.href = '/api/github/app/install';
  };

  const handleOAuthFallback = () => {
    window.location.href = '/api/auth/github';
  };

  const handleAssociateAppRepo = async (repo) => {
    setSelectedRepo(repo);
    setActionError('');
    try {
      await associateGitHubAppRepo(
        repo.owner.login,
        repo.name,
        githubAppStatus?.activeInstallationId,
        projectId
      );
      setStep('success');
      showToast(`Associated ${repo.full_name} via GitHub App!`, 'default');
    } catch (err) {
      setActionError(err.message || 'Failed to associate repository');
    }
  };

  const handleDirectTokenSubmit = async (e) => {
    e.preventDefault();
    if (!directTokenInput.trim()) return;

    setIsSubmittingToken(true);
    setActionError('');

    try {
      const res = await fetch('/api/auth/github/direct-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: directTokenInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to authenticate token');
      }

      showToast(`Authenticated as @${data.user.login}!`, 'default');
      setDirectTokenInput('');
      await checkGitHubAuthStatus();
      
      const repos = await fetchGitHubRepos();
      setRepositories(repos || []);
      setStep('select_repo');
    } catch (err) {
      setActionError(err.message || 'Failed to validate direct token');
    } finally {
      setIsSubmittingToken(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectGitHubApp(projectId);
      await disconnectGitHub();
      setStep('connect');
      setRepositories([]);
      setSelectedRepo(null);
      showToast('GitHub repository disconnected and telemetry cleared.', 'default');
    } catch (err) {
      setActionError(err.message || 'Failed to disconnect');
    }
  };

  if (!isOpen) return null;

  const filteredRepos = repositories.filter(r =>
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '24px',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{ position: 'absolute', top: '18px', right: '18px', padding: '6px' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)'
            }}
          >
            <GithubIcon size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>GitHub Integration</h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                GITHUB APP (LEAST-PRIVILEGE)
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Verify development velocity, commits, PRs, and tamper-evident code provenance.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {(actionError || githubError) && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--accent-rose)',
              fontSize: '0.82rem'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{actionError || githubError}</span>
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* STEP 1: CONNECT & AUTHORIZATION                                 */}
        {/* --------------------------------------------------------------- */}
        {step === 'connect' && (
          <div>
            {/* Method Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-surface)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                type="button"
                onClick={() => setConnectMethod('app')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: connectMethod === 'app' ? 'var(--bg-card)' : 'transparent',
                  color: connectMethod === 'app' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={14} color={connectMethod === 'app' ? 'var(--accent-emerald)' : 'currentColor'} />
                <span>GitHub App (Recommended)</span>
              </button>
              <button
                type="button"
                onClick={() => setConnectMethod('token')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: connectMethod === 'token' ? 'var(--bg-card)' : 'transparent',
                  color: connectMethod === 'token' ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Key size={14} />
                <span>Personal Access Token</span>
              </button>
            </div>

            {connectMethod === 'app' ? (
              <div>
                {/* Security Value Proposition */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <ShieldCheck size={18} color="var(--accent-emerald)" />
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Granular Least-Privilege Repository Access
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                    Unlike traditional OAuth tokens that grant access to your entire GitHub account, HackForge uses a
                    GitHub App. You choose <strong>only the specific repository</strong> you are hacking on.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.74rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={13} color="var(--accent-emerald)" /> Metadata: Read-only
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={13} color="var(--accent-emerald)" /> Contents & Commits: Read-only
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={13} color="var(--accent-emerald)" /> Pull Requests: Read-only
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={13} color="var(--accent-emerald)" /> Issues: Read-only
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleInstallGitHubApp}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '0.9rem'
                  }}
                >
                  <GithubIcon size={18} />
                  <span>Install GitHub App & Select Repository</span>
                  <ExternalLink size={14} />
                </button>

                {/* OAuth App fallback link */}
                <div style={{ marginTop: '14px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleOAuthFallback}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Or connect via OAuth App authorization
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  Paste a GitHub Personal Access Token (PAT) with <code>repo</code> scope for local development:
                </p>
                <form onSubmit={handleDirectTokenSubmit}>
                  <input
                    type="password"
                    value={directTokenInput}
                    onChange={e => setDirectTokenInput(e.target.value)}
                    placeholder="ghp_... or github_pat_..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: '14px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingToken || !directTokenInput.trim()}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                  >
                    {isSubmittingToken ? 'Validating Token...' : 'Authenticate Token'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* STEP 2: SELECT AUTHORIZED REPOSITORY                            */}
        {/* --------------------------------------------------------------- */}
        {step === 'select_repo' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Select Project Repository</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Repositories authorized under your GitHub App installation:
                </span>
              </div>
              <button
                type="button"
                onClick={() => loadAppRepos(githubAppStatus?.activeInstallationId)}
                disabled={loadingRepos}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw size={12} className={loadingRepos ? 'spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search
                size={14}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search repository name..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            {/* Repositories List */}
            {loadingRepos ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <RefreshCw size={24} className="spin" style={{ marginBottom: '8px', color: 'var(--accent-cyan)' }} />
                <div style={{ fontSize: '0.82rem' }}>Loading authorized repositories...</div>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div
                style={{
                  padding: '30px 20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-default)'
                }}
              >
                <ShieldAlert size={28} color="var(--accent-amber)" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>No Repositories Authorized</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 14px auto' }}>
                  If you selected "Only select repositories" during app installation, ensure you added your hackathon repo.
                </p>
                <button
                  type="button"
                  onClick={handleInstallGitHubApp}
                  className="btn btn-secondary btn-sm"
                >
                  Configure Repository Access on GitHub
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto' }}>
                {filteredRepos.map(repo => (
                  <div
                    key={repo.id}
                    onClick={() => handleAssociateAppRepo(repo)}
                    style={{
                      background: 'var(--bg-surface)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <GitBranch size={14} color="var(--accent-cyan)" />
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          {repo.full_name}
                        </strong>
                        {repo.private && (
                          <span className="badge badge-muted" style={{ fontSize: '0.62rem' }}>
                            PRIVATE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Default branch: <code>{repo.default_branch}</code> {repo.language ? `• ${repo.language}` : ''}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* STEP 3: CONNECTED & VERIFIED STATUS                             */}
        {/* --------------------------------------------------------------- */}
        {step === 'success' && githubConnectedRepo && (
          <div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <CheckCircle2 size={20} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>
                  Repository Verified & Synchronized
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
                Telemetric commit records, PRs, and issues are now streaming into HackForge for tamper-evident Build Passport verification.
              </p>

              {/* Connected Repo Card */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitBranch size={15} color="var(--accent-emerald)" />
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {githubConnectedRepo.full_name || `${githubConnectedRepo.owner}/${githubConnectedRepo.name}`}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Branch: {githubConnectedRepo.default_branch || 'main'} • Synced at: {new Date(githubConnectedRepo.synced_at || Date.now()).toLocaleTimeString()}
                  </div>
                </div>

                <a
                  href={githubConnectedRepo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Open on GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Management Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep('select_repo')}
                className="btn btn-secondary btn-sm"
              >
                Switch Repository
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                className="btn btn-secondary btn-sm"
                style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: 'var(--accent-rose)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={13} />
                <span>Disconnect Repository</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
