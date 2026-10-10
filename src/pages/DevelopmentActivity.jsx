import React from 'react';
import { useParams } from 'react-router-dom';
import { Activity, GitBranch, GitCommit, Flame, ShieldCheck, ArrowUpRight } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import RealtimeTimeline from '../components/RealtimeTimeline';
import ContributionCard from '../components/ContributionCard';
import Leaderboard from '../components/Leaderboard';

export default function DevelopmentActivity() {
  const { id } = useParams();
  const { activities, team, leaderboard, githubConnectedRepo, githubUser, isDemoMode } = useHackForge();

  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-content">
        
        {/* Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {isDemoMode ? (
                <span className="badge badge-cyan">
                  SIMULATED DEMO TELEMETRY
                </span>
              ) : githubConnectedRepo ? (
                <span className="badge badge-emerald">
                  <span className="pulse-dot" /> STREAMING LIVE TELEMETRY
                </span>
              ) : (
                <span className="badge badge-rose">
                  REPOSITORY NOT CONNECTED
                </span>
              )}

              {githubConnectedRepo ? (
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  <GithubIcon size={12} /> {githubConnectedRepo.full_name}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {isDemoMode ? "DEMO REPO: @hackforge-demo/nexus-sentinel" : "AWAITING GITHUB CONNECTION"}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.8rem' }}>Development Activity & Velocity</h1>
            <p className="page-subtitle">
              Continuous commit auditing, burst detection, and normalized ProjectActivity lineage for {team.name}.
            </p>
          </div>

          {/* Top Quick Status */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="card" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TOTAL COMMITS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {team?.commitsCount ?? (activities?.length || 0)}
              </div>
            </div>
            <div className="card" style={{ padding: '8px 16px', background: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTEGRITY SCORE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {isDemoMode ? '96.4%' : team?.integrityScore != null ? `${team.integrityScore}%` : githubConnectedRepo ? 'Auditing...' : 'Not Connected'}
              </div>
            </div>
          </div>
        </div>

        {/* Velocity & Heatmap Card */}
        <div style={{ marginBottom: '28px' }}>
          <ContributionCard team={team} />
        </div>

        {/* Timeline & Leaderboard split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'flex-start' }}>
          <div>
            <RealtimeTimeline projectId={team.id} />
          </div>
          <div>
            <Leaderboard teams={leaderboard} />
          </div>
        </div>

      </main>
    </div>
  );
}
