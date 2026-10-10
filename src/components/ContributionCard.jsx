import React from 'react';
import { GitCommit, Code2, Flame, BarChart2 } from 'lucide-react';

export default function ContributionCard({ team }) {
  // Simulated hourly sprint commit density over 24 hours
  const hourlyData = [
    { hour: '00:00', commits: 4 }, { hour: '02:00', commits: 8 }, { hour: '04:00', commits: 12 },
    { hour: '06:00', commits: 3 }, { hour: '08:00', commits: 1 }, { hour: '10:00', commits: 7 },
    { hour: '12:00', commits: 15 }, { hour: '14:00', commits: 18 }, { hour: '16:00', commits: 9 },
    { hour: '18:00', commits: 14 }, { hour: '20:00', commits: 22 }, { hour: '22:00', commits: 16 }
  ];

  const maxCommits = Math.max(...hourlyData.map(d => d.commits));

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="var(--accent-amber)" />
            <span>Sprint Velocity & Heatmap</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Telemetry synced from GitHub webhook • 37 total verified commits
          </p>
        </div>
        <span className="badge badge-emerald">
          High Velocity
        </span>
      </div>

      {/* Hourly Commit Burst Bars */}
      <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <span>HOURLY COMMIT BURST VELOCITY</span>
          <span style={{ color: 'var(--accent-cyan)' }}>Peak: 22 commits/hr</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', gap: '6px' }}>
          {hourlyData.map((d, i) => {
            const heightPct = Math.round((d.commits / maxCommits) * 100);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  title={`${d.commits} commits at ${d.hour}`}
                  style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    minHeight: '4px',
                    borderRadius: '3px 3px 0 0',
                    background: d.commits > 15
                      ? 'var(--accent-emerald)'
                      : d.commits > 8
                      ? 'var(--accent-cyan)'
                      : 'rgba(255,255,255,0.15)',
                    boxShadow: d.commits > 15 ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
                    transition: 'height 0.3s ease'
                  }}
                />
                <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', display: i % 2 === 0 ? 'block' : 'none' }}>
                  {d.hour.slice(0, 2)}h
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Breakdown */}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          Codebase Footprint Distribution
        </div>
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ width: '45%', background: 'var(--accent-emerald)' }} title="Smart Contracts 45%" />
          <div style={{ width: '35%', background: 'var(--accent-cyan)' }} title="Frontend HUD 35%" />
          <div style={{ width: '20%', background: 'var(--accent-violet)' }} title="Agentic Logic 20%" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-emerald)' }} />
            Solidity/Cairo (45%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-cyan)' }} />
            React/TS (35%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-violet)' }} />
            Python/FastAPI (20%)
          </span>
        </div>
      </div>
    </div>
  );
}
