import React, { useState } from 'react';
import { GitCommit, GitMerge, Zap, ShieldCheck, Filter } from 'lucide-react';

export default function ActivityTimeline({ activities }) {
  const [filter, setFilter] = useState('all');

  const filteredActivities = activities.filter(act => {
    if (filter === 'commits') return act.type === 'commit';
    if (filter === 'pr') return act.type === 'pr_merge';
    if (filter === 'quests') return act.type === 'quest_complete';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'commit': return <GitCommit size={15} color="var(--accent-cyan)" />;
      case 'pr_merge': return <GitMerge size={15} color="var(--accent-violet)" />;
      case 'quest_complete': return <Zap size={15} color="var(--accent-emerald)" fill="var(--accent-emerald)" />;
      default: return <ShieldCheck size={15} color="var(--accent-amber)" />;
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>Live Build Telemetry</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Real-time GitHub commit bursts and cryptographic milestone timestamps
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'commits', 'pr', 'quests'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
        {/* Continuous line */}
        <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-subtle)', zIndex: 0 }} />

        {filteredActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No activity logged for this filter.
          </div>
        ) : (
          filteredActivities.map((act) => (
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
              {/* Icon avatar circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {getIcon(act.type)}
              </div>

              {/* Event card body */}
              <div
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {act.authorAvatar && (
                      <img src={act.authorAvatar} alt={act.author} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                    )}
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {act.author}
                    </span>
                    {act.branch && (
                      <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                        {act.branch}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                      {act.hash}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {act.timestamp}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {act.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                    {act.diff}
                  </span>
                  {act.verified && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--accent-emerald)' }}>
                      <ShieldCheck size={12} /> Verified Hack Commit
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
