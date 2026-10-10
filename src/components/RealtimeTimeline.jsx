import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  GitPullRequest,
  GitBranch,
  AlertCircle,
  Zap,
  Rocket,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Clock,
  Radio
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function RealtimeTimeline({ projectId = 'team-hyperdrive' }) {
  const {
    projectActivities,
    activities,
    githubConnectedRepo,
    isGithubLoading,
    syncGitHubTelemetry,
    showToast
  } = useHackForge();

  const rawActivities = (projectActivities && projectActivities.length > 0) ? projectActivities : (activities || []);

  const [filterType, setFilterType] = useState('ALL');
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Auto-sync polling every 30 seconds if autoSync is true and a repo is connected
  useEffect(() => {
    if (!autoSync || !githubConnectedRepo) return;

    const interval = setInterval(() => {
      syncGitHubTelemetry(projectId).then(() => {
        setLastSyncTime(new Date());
      }).catch(err => {
        console.warn('Auto-sync notice:', err.message);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSync, githubConnectedRepo, projectId]);

  const handleManualSync = async () => {
    try {
      await syncGitHubTelemetry(projectId);
      setLastSyncTime(new Date());
      showToast("Live GitHub telemetry refreshed!", "default");
    } catch (err) {
      showToast(err.message || "Failed to sync telemetry", "alert");
    }
  };

  const formatEventTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  const formatEventDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const filteredActivities = rawActivities.filter(act => {
    if (filterType === 'ALL') return true;
    return act.type === filterType;
  });

  const getTypeMeta = (type) => {
    switch (type) {
      case 'COMMIT':
        return { label: 'COMMIT', badge: 'badge-cyan', icon: GitCommit, color: 'var(--accent-cyan)' };
      case 'PULL_REQUEST':
        return { label: 'PULL REQUEST', badge: 'badge-violet', icon: GitPullRequest, color: 'var(--accent-violet)' };
      case 'ISSUE':
        return { label: 'ISSUE', badge: 'badge-amber', icon: AlertCircle, color: 'var(--accent-amber)' };
      case 'BRANCH':
        return { label: 'BRANCH', badge: 'badge-muted', icon: GitBranch, color: 'var(--text-secondary)' };
      case 'DEPLOYMENT':
        return { label: 'DEPLOYMENT', badge: 'badge-emerald', icon: Rocket, color: 'var(--accent-emerald)' };
      case 'MILESTONE':
      default:
        return { label: 'MILESTONE', badge: 'badge-emerald', icon: Zap, color: 'var(--accent-emerald)' };
    }
  };

  return (
    <div className="card">
      {/* Top Header & Live Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">
              <span className="pulse-dot" /> REAL-TIME TELEMETRY
            </span>
            {githubConnectedRepo && (
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {githubConnectedRepo.full_name}
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.2rem' }}>Development Activity Stream</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Normalized ProjectActivity lineage captured directly from GitHub Webhook & API stream.
          </p>
        </div>

        {/* Sync Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            className={`btn btn-sm ${autoSync ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ fontSize: '0.75rem', color: autoSync ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
            title="Toggle 30s auto-refresh polling"
          >
            <Radio size={13} className={autoSync ? 'spin' : ''} />
            <span>{autoSync ? 'Live Auto-Sync ON' : 'Auto-Sync Paused'}</span>
          </button>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isGithubLoading}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={13} className={isGithubLoading ? 'spin' : ''} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="hud-tabs" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: `All Events (${rawActivities.length})` },
          { id: 'COMMIT', label: 'Commits' },
          { id: 'PULL_REQUEST', label: 'Pull Requests' },
          { id: 'ISSUE', label: 'Issues' },
          { id: 'BRANCH', label: 'Branches' },
          { id: 'MILESTONE', label: 'Milestones' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`hud-tab ${filterType === tab.id ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Development Timeline Feed */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Continuous timeline vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            background: 'var(--border-subtle)',
            zIndex: 0
          }}
        />

        {filteredActivities.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No activities found for this filter.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const meta = getTypeMeta(act.type);
            const Icon = meta.icon;
            const timeStr = formatEventTime(act.timestamp);
            const dateStr = formatEventDate(act.timestamp);

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {/* Event Type Icon Indicator */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface)',
                    border: `1px solid ${meta.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: meta.color,
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Icon size={18} />
                </div>

                {/* Timeline Card */}
                <div
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  {/* Top: Timestamp, Author, Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Formatted Timestamp */}
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {timeStr}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {dateStr}
                      </span>

                      {/* Author */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                        {act.actor?.avatar_url && (
                          <img
                            src={act.actor.avatar_url}
                            alt={act.actor.name}
                            style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        )}
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          {act.actor?.name || 'Developer'}
                        </span>
                        {act.actor?.username && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                            @{act.actor.username}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className={`badge ${meta.badge}`} style={{ fontSize: '0.65rem' }}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Main Event Message */}
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px', lineHeight: 1.4 }}>
                    {act.metadata?.message || act.metadata?.title || 'Project Activity Update'}
                  </div>

                  {/* Metadata Row: Hash, Branch, Diffs, URL */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {act.metadata?.hash && (
                        <span style={{ color: 'var(--accent-cyan)' }}>
                          sha: {act.metadata.hash}
                        </span>
                      )}

                      {act.metadata?.branch && (
                        <span className="badge badge-muted" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                          <GitBranch size={10} /> {act.metadata.branch}
                        </span>
                      )}

                      {act.metadata?.additions !== undefined && (
                        <span style={{ color: 'var(--accent-emerald)' }}>
                          +{act.metadata.additions} / -{act.metadata.deletions || 0} lines
                        </span>
                      )}
                    </div>

                    {act.metadata?.url && (
                      <a
                        href={act.metadata.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>View on GitHub</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
