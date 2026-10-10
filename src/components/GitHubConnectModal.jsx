import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
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
  Code2
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useHackForge } from '../context/HackForgeContext';

export default function GitHubConnectModal({ isOpen, onClose, projectId = 'team-hyperdrive' }) {
  const {
    githubUser,
    githubConnectedRepo,
    isGithubLoading,
    githubError,
    checkGitHubAuthStatus,
    fetchGitHubRepos,
    associateGitHubRepo,
    disconnectGitHub,
    showToast
  } = useHackForge();

  const [step, setStep] = useState('connect'); // 'connect' | 'select_repo' | 'success'
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [directTokenInput, setDirectTokenInput] = useState('');
  const [showDirectToken, setShowDirectToken] = useState(false);
  const [isSubmittingToken, setIsSubmittingToken] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);
  const [actionError, setActionError] = useState('');

  // Check connection status when opened
  useEffect(() => {
    if (isOpen) {
      checkGitHubAuthStatus().then(user => {
        if (user) {
          setStep('select_repo');
          loadRepos();
        } else {
          setStep('connect');
        }
      });
    }
  }, [isOpen]);

  const loadRepos = async () => {
    setLoadingRepos(true);
    setActionError('');
    try {
      const repos = await fetchGitHubRepos();
      setRepositories(repos || []);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch repositories');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleOAuthConnect = () => {
    // Navigate to server OAuth initiation endpoint
    window.location.href = '/api/auth/github';
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

      showToast(`Authenticated as ${data.user.login}!`, 'default');
      setDirectTokenInput('');
      setShowDirectToken(false);
      await checkGitHubAuthStatus();
      setStep('select_repo');
      loadRepos();
    } catch (err) {
      setActionError(err.message || 'Failed to validate token');
    } finally {
      setIsSubmittingToken(false);
    }
  };

  const handleAssociate = async (repo) => {
    setSelectedRepo(repo);
    setActionError('');
    try {
      await associateGitHubRepo(repo.owner.login, repo.name, projectId);
      setStep('success');
      showToast(`Associated ${repo.full_name} with sprint!`, 'default');
    } catch (err) {
      setActionError(err.message || 'Failed to associate repository');
    }
  };

  const handleCopyCallbackUrl = () => {
    const callbackUrl = `${window.location.origin}/api/auth/github/callback`;
    navigator.clipboard.writeText(callbackUrl);
    setCopiedCallback(true);
    showToast('OAuth Callback URL copied!', 'default');
    setTimeout(() => setCopiedCallback(false), 2500);
  };

  if (!isOpen) return null;

  const filteredRepos = repositories.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 8, 12, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#24292e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <GithubIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>GitHub Integration Layer</h3>
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                  <ShieldCheck size={11} /> Secure OAuth
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Connect your real GitHub repository for automated commit auditing and Build Passport verification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div
            style={{
              background: 'var(--accent-rose-dim)',
              border: '1px solid var(--accent-rose)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={16} color="var(--accent-rose)" style={{ flexShrink: 0 }} />
            <span>{actionError}</span>
          </div>
        )}

        {/* STEP 1: CONNECT GITHUB */}
        {step === 'connect' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div style={{ maxWidth: '440px', margin: '0 auto 20px' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Authorize GitHub Access</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  HackForge OS requires read access to your repositories to track commits, pull requests, and calculate originality scores. Access tokens are stored securely server-side and never exposed to the client.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleOAuthConnect}
                  className="btn btn-primary"
                  style={{
                    background: '#24292e',
                    border: '1px solid var(--border-glow)',
                    color: '#fff',
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <GithubIcon size={18} />
                  <span>Connect with GitHub OAuth</span>
                  <ExternalLink size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowDirectToken(!showDirectToken)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}
                >
                  <Key size={13} />
                  <span>{showDirectToken ? 'Hide Direct Token Option' : 'Or Use Personal Access Token (Direct)'}</span>
                </button>
              </div>
            </div>

            {/* Direct Token Form (for instant testing without registering OAuth app) */}
            {showDirectToken && (
              <form onSubmit={handleDirectTokenSubmit} style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  <Key size={14} />
                  <span>Server-Side Personal Access Token</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Paste a GitHub PAT (with <code>repo</code> scope) for instant server-side authentication. The token is sent to the backend server and held only in secure memory.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={directTokenInput}
                    onChange={e => setDirectTokenInput(e.target.value)}
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingToken}
                    className="btn btn-primary btn-sm"
                  >
                    {isSubmittingToken ? 'Validating...' : 'Authenticate'}
                  </button>
                </div>
              </form>
            )}

            {/* OAuth Credentials Setup Guide */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} color="var(--accent-cyan)" />
                <span>How to configure GitHub OAuth credentials in .env</span>
              </div>
              <ol style={{ paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Create an OAuth App at <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>github.com/settings/developers</a>.</li>
                <li>Set Authorization callback URL to: <code style={{ color: 'var(--accent-emerald)', background: 'var(--bg-surface)', padding: '2px 4px', borderRadius: '3px' }}>http://localhost:5173/api/auth/github/callback</code>
                  <button type="button" onClick={handleCopyCallbackUrl} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', marginLeft: '6px' }}>
                    {copiedCallback ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  </button>
                </li>
                <li>Copy <strong>Client ID</strong> and generate a <strong>Client Secret</strong>, then paste them into <code>.env</code>.</li>
              </ol>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT REPOSITORY */}
        {step === 'select_repo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
            {/* Authenticated user badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {githubUser?.avatar_url && (
                  <img src={githubUser.avatar_url} alt={githubUser.login} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Connected as <strong style={{ color: 'var(--accent-cyan)' }}>@{githubUser?.login}</strong></span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await disconnectGitHub();
                  setStep('connect');
                }}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}
              >
                Disconnect
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search your real GitHub repositories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px', fontSize: '0.82rem' }}
              />
            </div>

            {/* Repositories Scrollable List */}
            <div style={{ overflowY: 'auto', flex: 1, maxHeight: '340px', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {loadingRepos ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  <RefreshCw size={20} className="spin" style={{ margin: '0 auto 8px' }} />
                  <div>Querying GitHub REST API for your repositories...</div>
                </div>
              ) : filteredRepos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No repositories found matching "{searchTerm}".
                </div>
              ) : (
                filteredRepos.map(repo => {
                  const isCurrent = githubConnectedRepo?.name === repo.name;
                  return (
                    <div
                      key={repo.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: isCurrent ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {repo.name}
                          </span>
                          <span className={`badge ${repo.private ? 'badge-amber' : 'badge-muted'}`} style={{ fontSize: '0.62rem' }}>
                            {repo.private ? 'PRIVATE' : 'PUBLIC'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            branch: {repo.default_branch}
                          </span>
                        </div>
                        {repo.description && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {repo.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAssociate(repo)}
                        disabled={isGithubLoading}
                        className="btn btn-secondary btn-sm"
                        style={{
                          flexShrink: 0,
                          fontSize: '0.75rem',
                          background: isCurrent ? 'var(--accent-emerald-dim)' : undefined,
                          borderColor: isCurrent ? 'var(--accent-emerald)' : undefined,
                          color: isCurrent ? 'var(--accent-emerald)' : undefined
                        }}
                      >
                        {isGithubLoading && selectedRepo?.id === repo.id ? (
                          <>
                            <RefreshCw size={12} className="spin" />
                            <span>Scanning...</span>
                          </>
                        ) : isCurrent ? (
                          <>
                            <Check size={12} />
                            <span>Associated</span>
                          </>
                        ) : (
                          <>
                            <span>Select Repo</span>
                            <ArrowRight size={12} />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && githubConnectedRepo && (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-emerald-dim)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid var(--accent-emerald)'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Repository Successfully Linked!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 20px' }}>
              Live telemetry is now active for <strong style={{ color: 'var(--accent-cyan)' }}>{githubConnectedRepo.full_name}</strong>. Real commits, PRs, and branches are flowing into your sprint timeline.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'left', maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Owner:</span>
                <strong>{githubConnectedRepo.owner}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Default Branch:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{githubConnectedRepo.default_branch}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Commits Captured:</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{githubConnectedRepo.commits_count}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Repository Created:</span>
                <span>{new Date(githubConnectedRepo.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                <span>Done & View Timeline</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
