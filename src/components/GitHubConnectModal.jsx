import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  GitBranch,
  Search,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  X,
  Key,
  Layers,
  ArrowRight,
  Code2,
  Trash2,
  Globe,
  Radio,
  Star,
  Check,
  User,
  LogOut
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

  // Mode: 'account' (OAuth / Token - Primary) | 'app' (GitHub App - Advanced)
  const [activeTab, setActiveTab] = useState('account');
  const [repositories, setRepositories] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'public' | 'private'
  const [actionError, setActionError] = useState('');
  const [directTokenInput, setDirectTokenInput] = useState('');
  const [isSubmittingToken, setIsSubmittingToken] = useState(false);
  const [connectingRepoName, setConnectingRepoName] = useState(null);

  // Load repositories whenever modal opens or githubUser state updates
  useEffect(() => {
    if (isOpen) {
      setActionError('');
      // Check auth status
      checkGitHubAuthStatus().then(user => {
        if (user) {
          loadUserRepos();
        }
      });
      checkGitHubAppStatus();
    }
  }, [isOpen, checkGitHubAuthStatus, checkGitHubAppStatus]);

  // Load repos for authenticated GitHub user
  const loadUserRepos = async () => {
    setLoadingRepos(true);
    setActionError('');
    try {
      const repos = await fetchGitHubRepos();
      setRepositories(repos || []);
    } catch (err) {
      console.warn('Failed to load user repos:', err);
      setActionError(err.message || 'Failed to fetch repositories from GitHub.');
    } finally {
      setLoadingRepos(false);
    }
  };

  // Load repos for GitHub App installation
  const loadAppRepos = async (installationId) => {
    setLoadingRepos(true);
    setActionError('');
    try {
      const repos = await fetchGitHubAppRepos(installationId);
      setRepositories(repos || []);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch GitHub App repositories.');
    } finally {
      setLoadingRepos(false);
    }
  };

  // 1. Direct OAuth Sign In
  const handleOAuthLogin = () => {
    window.location.href = '/api/auth/github';
  };

  // 2. Direct Token Sign In (Zero setup required)
  const handleDirectTokenSubmit = async (e) => {
    e.preventDefault();
    if (!directTokenInput.trim()) return;

    setIsSubmittingToken(true);
    setActionError('');

    try {
      const res = await fetch('/api/auth/github/direct-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: directTokenInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to authenticate token');
      }

      showToast(`Authenticated as @${data.user.login}!`, 'default');
      setDirectTokenInput('');
      await checkGitHubAuthStatus();
      await loadUserRepos();
    } catch (err) {
      setActionError(err.message || 'Failed to authenticate with GitHub token');
    } finally {
      setIsSubmittingToken(false);
    }
  };

  // 3. Connect a specific repository to current project
  const handleConnectRepo = async (repo) => {
    setConnectingRepoName(repo.full_name);
    setActionError('');
    try {
      if (activeTab === 'app' && githubAppStatus?.activeInstallationId) {
        await associateGitHubAppRepo(
          repo.owner.login,
          repo.name,
          githubAppStatus.activeInstallationId,
          projectId
        );
      } else {
        await associateGitHubRepo(repo.owner.login, repo.name, projectId);
      }
      showToast(`Connected ${repo.full_name} to project!`, 'default');
    } catch (err) {
      setActionError(err.message || 'Failed to connect repository');
    } finally {
      setConnectingRepoName(null);
    }
  };

  // 4. Disconnect repository
  const handleDisconnectRepo = async () => {
    try {
      await disconnectGitHub();
      if (githubAppStatus?.activeInstallationId) {
        await disconnectGitHubApp(projectId);
      }
      showToast('Repository disconnected.', 'default');
    } catch (err) {
      setActionError(err.message || 'Failed to disconnect repository');
    }
  };

  // Filter repositories
  const filteredRepos = repositories.filter(repo => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.owner?.login && repo.owner.login.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterType === 'public') return matchesSearch && !repo.private;
    if (filterType === 'private') return matchesSearch && repo.private;
    return matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 14, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '24px',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-hud-accent cyan" />

        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GithubIcon size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                GitHub Integration
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Authenticate your GitHub account and connect repositories to HackForge
              </p>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            style={{ padding: '6px', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Notification */}
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

        {/* Tab Navigation */}
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
            onClick={() => {
              setActiveTab('account');
              if (githubUser) loadUserRepos();
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'account' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'account' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <User size={15} />
            <span>GitHub User & Repositories</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('app');
              if (githubAppStatus?.activeInstallationId) {
                loadAppRepos(githubAppStatus.activeInstallationId);
              }
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'app' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'app' ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldCheck size={15} />
            <span>GitHub App (Granular Bot)</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: GITHUB USER AUTHENTICATION & REPOSITORY SELECTION       */}
        {/* ============================================================== */}
        {activeTab === 'account' && (
          <div>
            {/* Active Connected Repository Banner */}
            {githubConnectedRepo && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-emerald)'
                      }}
                    >
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          CONNECTED TO HACKFORGE
                        </span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Active</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <a
                          href={githubConnectedRepo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>{githubConnectedRepo.full_name}</span>
                          <ExternalLink size={13} color="var(--accent-cyan)" />
                        </a>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ({githubConnectedRepo.default_branch || 'main'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={loadUserRepos}
                      disabled={loadingRepos}
                    >
                      <RefreshCw size={13} className={loadingRepos ? 'spin' : ''} />
                      <span>Refresh</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={handleDisconnectRepo}
                      style={{ color: 'var(--accent-rose)' }}
                    >
                      <Trash2 size={13} />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* If NOT Authenticated: Show Login Options */}
            {!githubUser ? (
              <div>
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto'
                    }}
                  >
                    <GithubIcon size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                    Authenticate with GitHub
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                    Sign in to your GitHub account to access your repositories and stream real commit activity into HackForge.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOAuthLogin}
                    style={{
                      padding: '12px 28px',
                      fontSize: '0.92rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    <GithubIcon size={18} />
                    <span>Sign In with GitHub</span>
                  </button>
                </div>

                {/* Instant Personal Access Token Option */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Key size={16} color="var(--accent-cyan)" />
                    <strong style={{ fontSize: '0.88rem' }}>Instant Connect with Personal Access Token</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                    No OAuth app required. Generate a classic or fine-grained token on{' '}
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo,read:user,user:email"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
                    >
                      github.com/settings/tokens
                    </a>{' '}
                    with <code>repo</code> & <code>read:user</code> scopes.
                  </p>

                  <form onSubmit={handleDirectTokenSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="password"
                      placeholder="ghp_... (paste GitHub token here)"
                      value={directTokenInput}
                      onChange={e => setDirectTokenInput(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingToken || !directTokenInput.trim()}
                      className="btn btn-secondary"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {isSubmittingToken ? (
                        <>
                          <RefreshCw size={14} className="spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify & Connect</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* User IS Authenticated: Show User Profile Card & Repositories */
              <div>
                {/* User Identity Banner */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={githubUser.avatar_url}
                      alt={githubUser.login}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {githubUser.name || githubUser.login}
                        </span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                          @{githubUser.login}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <CheckCircle2 size={12} />
                        <span>Authenticated Developer</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={loadUserRepos}
                      disabled={loadingRepos}
                      title="Reload your repositories from GitHub"
                    >
                      <RefreshCw size={13} className={loadingRepos ? 'spin' : ''} />
                      <span>Refresh Repos</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={async () => {
                        await disconnectGitHub();
                        showToast('Logged out of GitHub.', 'default');
                      }}
                      style={{ color: 'var(--text-muted)' }}
                      title="Log out of GitHub"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

                {/* Repository Selection Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={16} color="var(--accent-cyan)" />
                      <span>Select Repository to Connect</span>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>{repositories.length}</span>
                    </h3>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setFilterType('all')}
                        className={`badge ${filterType === 'all' ? 'badge-cyan' : ''}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterType('public')}
                        className={`badge ${filterType === 'public' ? 'badge-cyan' : ''}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        Public
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterType('private')}
                        className={`badge ${filterType === 'private' ? 'badge-cyan' : ''}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        Private
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div style={{ position: 'relative', marginBottom: '14px' }}>
                    <Search
                      size={15}
                      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="text"
                      placeholder="Search repositories by name..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '9px 12px 9px 36px',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem'
                      }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Repository List */}
                  {loadingRepos ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px auto', color: 'var(--accent-cyan)' }} />
                      <p style={{ fontSize: '0.85rem' }}>Fetching repositories from GitHub...</p>
                    </div>
                  ) : filteredRepos.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '36px 16px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed var(--border-subtle)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <Layers size={28} style={{ opacity: 0.5, marginBottom: '8px' }} />
                      <p style={{ fontSize: '0.85rem', margin: '0 0 6px 0' }}>
                        {searchTerm ? 'No repositories match your search' : 'No repositories found on this account'}
                      </p>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={loadUserRepos}
                        style={{ marginTop: '8px' }}
                      >
                        <RefreshCw size={12} />
                        <span>Refresh List</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        maxHeight: '340px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        paddingRight: '4px'
                      }}
                    >
                      {filteredRepos.map(repo => {
                        const isCurrentlyConnected =
                          githubConnectedRepo &&
                          (githubConnectedRepo.id === repo.id || githubConnectedRepo.full_name === repo.full_name);
                        const isConnecting = connectingRepoName === repo.full_name;

                        return (
                          <div
                            key={repo.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              background: isCurrentlyConnected ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                              border: isCurrentlyConnected
                                ? '1px solid rgba(16, 185, 129, 0.4)'
                                : '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                {repo.private ? (
                                  <Lock size={13} color="var(--accent-amber)" />
                                ) : (
                                  <Globe size={13} color="var(--text-muted)" />
                                )}
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '0.88rem',
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {repo.name}
                                </span>
                                {repo.private ? (
                                  <span className="badge badge-amber" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                                    Private
                                  </span>
                                ) : (
                                  <span className="badge" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                                    Public
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {repo.language && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-cyan)'
                                      }}
                                    />
                                    {repo.language}
                                  </span>
                                )}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <GitBranch size={11} /> {repo.default_branch || 'main'}
                                </span>
                                {repo.stars !== undefined && repo.stars > 0 && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Star size={11} color="var(--accent-amber)" /> {repo.stars}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              {isCurrentlyConnected ? (
                                <span
                                  className="badge badge-emerald"
                                  style={{
                                    fontSize: '0.75rem',
                                    padding: '6px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <CheckCircle2 size={13} />
                                  <span>Connected</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => handleConnectRepo(repo)}
                                  disabled={isConnecting}
                                  style={{
                                    fontSize: '0.78rem',
                                    padding: '6px 14px',
                                    borderColor: 'rgba(6, 182, 212, 0.4)',
                                    color: 'var(--accent-cyan)'
                                  }}
                                >
                                  {isConnecting ? (
                                    <>
                                      <RefreshCw size={12} className="spin" />
                                      <span>Connecting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Connect Repo</span>
                                      <ArrowRight size={13} />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GITHUB APP (GRANULAR BOT / LEAST-PRIVILEGE ACCESS)      */}
        {/* ============================================================== */}
        {activeTab === 'app' && (
          <div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <strong style={{ fontSize: '0.88rem' }}>GitHub App Granular Installation</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Install HackForge's official GitHub App to grant read-only access to only specific repositories without exposing full account scopes.
              </p>
            </div>

            {githubAppStatus?.configured ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    window.location.href = '/api/github/app/install';
                  }}
                  style={{ padding: '12px 24px', fontSize: '0.9rem' }}
                >
                  <ShieldCheck size={16} />
                  <span>Launch GitHub App Installation</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-amber)' }}>
                  <AlertCircle size={16} />
                  <strong style={{ fontSize: '0.85rem' }}>GitHub App Not Configured Yet in .env</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  To enable GitHub App installation, set <code>GITHUB_APP_ID</code> and <code>GITHUB_APP_SLUG</code> in <code>.env</code>.
                  Alternatively, use the <strong>GitHub User & Repositories</strong> tab for instant connection!
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('account')}
                >
                  <span>Switch to User & Repositories Tab →</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
