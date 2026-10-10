import React, { useState } from 'react';
import {
  Trophy,
  ShieldCheck,
  Zap,
  GitCommit,
  CheckCircle2,
  Users,
  Award,
  Globe,
  Star,
  Info,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  XP_DISCLAIMER,
  INDIVIDUAL_LEADERBOARD,
  TEAM_LEADERBOARD,
  HACKATHON_LEADERBOARD
} from '../utils/gamificationEngine';

export default function Leaderboard({ teams = [], showTabs = true, defaultTab = 'TEAM' }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'INDIVIDUAL' | 'TEAM' | 'HACKATHON'

  return (
    <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
      
      {/* Header with Title and Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">
              <Trophy size={12} /> HACKFORGE VELOCITY LEADERBOARD
            </span>
            <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
              <span className="pulse-dot" /> LIVE TELEMETRY
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
            {activeTab === 'INDIVIDUAL' && 'Individual Builder Rankings'}
            {activeTab === 'TEAM' && 'Squad Sprint Leaderboard'}
            {activeTab === 'HACKATHON' && 'Global Hackathon & Guild Standings'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Verifiable milestone XP earned through substantive commits, PR reviews, and deployments.
          </p>
        </div>

        {/* Tab Switcher */}
        {showTabs && (
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <button
              onClick={() => setActiveTab('INDIVIDUAL')}
              className={`hud-tab ${activeTab === 'INDIVIDUAL' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Users size={13} />
              <span>Individual</span>
            </button>
            <button
              onClick={() => setActiveTab('TEAM')}
              className={`hud-tab ${activeTab === 'TEAM' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Layers size={13} />
              <span>Team</span>
            </button>
            <button
              onClick={() => setActiveTab('HACKATHON')}
              className={`hud-tab ${activeTab === 'HACKATHON' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Globe size={13} />
              <span>Hackathon</span>
            </button>
          </div>
        )}
      </div>

      {/* MANDATORY LABEL BANNER */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Info size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
          <strong>Notice:</strong> {XP_DISCLAIMER} XP is awarded strictly for verified quest completion, architectural PRs, and deployments—not commit spam.
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. INDIVIDUAL LEADERBOARD                                      */}
      {/* ============================================================== */}
      {activeTab === 'INDIVIDUAL' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Rank</th>
                <th style={{ padding: '10px 12px' }}>Builder</th>
                <th style={{ padding: '10px 12px' }}>Role & Level</th>
                <th style={{ padding: '10px 12px' }}>Sprint XP</th>
                <th style={{ padding: '10px 12px' }}>Total XP</th>
                <th style={{ padding: '10px 12px' }}>Quests</th>
                <th style={{ padding: '10px 12px' }}>Badges</th>
              </tr>
            </thead>
            <tbody>
              {INDIVIDUAL_LEADERBOARD.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: user.isCurrentUser ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {user.rank === 1 ? '🥇 #1' : user.rank === 2 ? '🥈 #2' : user.rank === 3 ? '🥉 #3' : `#${user.rank}`}
                  </td>

                  {/* Builder Profile */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-default)' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>YOU</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.teamName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Level */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      LVL {user.level} • {user.levelTitle}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {user.role}
                    </div>
                  </td>

                  {/* Sprint XP */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} fill="currentColor" />
                      +{user.sprintXp.toLocaleString()}
                    </span>
                  </td>

                  {/* Total XP */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {user.totalXp.toLocaleString()} XP
                  </td>

                  {/* Quests */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {user.questsCompleted} Completed
                  </td>

                  {/* Badges */}
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={11} /> {user.badgesCount} Badges
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. TEAM LEADERBOARD                                            */}
      {/* ============================================================== */}
      {activeTab === 'TEAM' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Rank</th>
                <th style={{ padding: '10px 12px' }}>Squad & Project</th>
                <th style={{ padding: '10px 12px' }}>Team XP</th>
                <th style={{ padding: '10px 12px' }}>Quests</th>
                <th style={{ padding: '10px 12px' }}>Commits</th>
                <th style={{ padding: '10px 12px' }}>Roster</th>
                <th style={{ padding: '10px 12px' }}>Build Passport</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_LEADERBOARD.map((t) => (
                <tr
                  key={t.rank}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: t.isUserTeam ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {t.rank === 1 ? '🥇 #1' : t.rank === 2 ? '🥈 #2' : t.rank === 3 ? '🥉 #3' : `#${t.rank}`}
                  </td>

                  {/* Squad */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.team}</span>
                      {t.isUserTeam && (
                        <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>YOUR SQUAD</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.project}</div>
                  </td>

                  {/* Team XP */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} fill="currentColor" />
                      {t.xp.toLocaleString()} XP
                    </span>
                  </td>

                  {/* Quests */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {t.quests}/{t.totalQuests} Done
                  </td>

                  {/* Commits */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitCommit size={13} /> {t.commits}
                    </span>
                  </td>

                  {/* Roster */}
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                    {t.membersCount} Builders
                  </td>

                  {/* Passport */}
                  <td style={{ padding: '12px' }}>
                    {t.passportVerified ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
                        In Audit
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. HACKATHON LEADERBOARD                                       */}
      {/* ============================================================== */}
      {activeTab === 'HACKATHON' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Rank</th>
                <th style={{ padding: '10px 12px' }}>Hackathon Event</th>
                <th style={{ padding: '10px 12px' }}>Active Guilds</th>
                <th style={{ padding: '10px 12px' }}>Total XP Pool</th>
                <th style={{ padding: '10px 12px' }}>Avg Team XP</th>
                <th style={{ padding: '10px 12px' }}>Leading Squad</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {HACKATHON_LEADERBOARD.map((h) => (
                <tr
                  key={h.hackathonId}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: h.status === 'LIVE' ? 'rgba(6, 182, 212, 0.06)' : 'transparent',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {h.rank === 1 ? '🥇 #1' : h.rank === 2 ? '🥈 #2' : `#${h.rank}`}
                  </td>

                  {/* Hackathon Event */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{h.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Organizer: {h.organizer}</div>
                  </td>

                  {/* Guilds */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                    {h.teamsCount} Teams
                  </td>

                  {/* Total XP Pool */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {h.totalXpPool}
                  </td>

                  {/* Avg Team XP */}
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {h.avgTeamXp.toLocaleString()} XP
                  </td>

                  {/* Leading Squad */}
                  <td style={{ padding: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    👑 {h.topGuild}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${h.status === 'LIVE' ? 'badge-emerald' : h.status === 'COMPLETED' ? 'badge-muted' : 'badge-purple'}`} style={{ fontSize: '0.68rem' }}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
