import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ShieldCheck, GitBranch, ArrowRight, Trophy, Flame, CheckCircle2, Cpu } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import XPProgress from '../components/XPProgress';
import QuestCard from '../components/QuestCard';
import TeamCard from '../components/TeamCard';
import AIInsightCard from '../components/AIInsightCard';
import ActivityTimeline from '../components/ActivityTimeline';

export default function Dashboard() {
  const { user, team, quests, activities, activeHackathon, passport, aiInsights, isDemoMode, githubConnectedRepo } = useHackForge();

  const claimableQuests = quests.filter(q => q.status === 'CLAIMABLE');
  const activeQuests = quests.filter(q => q.status === 'IN_PROGRESS');

  return (
    <div className="page-wrapper">
      
      {/* Top Banner: Active Sprint HUD */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">
              <span className="pulse-dot" /> ACTIVE FORGE SPRINT
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              WINDOW: 48 HOURS
            </span>
            {isDemoMode && (
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                SIMULATED DEMO DATA
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2rem' }}>Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="page-subtitle">
            Sprint Mission Control • {activeHackathon.title} • {activeHackathon.timeLeft}
          </p>
        </div>

        {/* Quick action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/hackathons/${activeHackathon.id}/passport`} className="btn btn-secondary">
            <ShieldCheck size={16} />
            <span>Audit Passport</span>
          </Link>
          <Link to={`/hackathons/${activeHackathon.id}/quests`} className="btn btn-primary">
            <Zap size={16} fill="currentColor" />
            <span>Quest Board</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Top: XP Matrix & Sprint Telemetry Stats */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        
        {/* XP Matrix Bar */}
        <div style={{ gridColumn: 'span 2' }}>
          <XPProgress
            xp={user.xp}
            level={user.level}
            nextLevelXp={user.nextLevelXp}
            levelTitle={user.levelTitle}
          />
        </div>

        {/* Build Passport Readiness Card */}
        <div className="card" style={{ background: 'linear-gradient(145deg, #101524, #0b0e18)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-hud-accent" />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                BUILD PASSPORT READINESS
              </span>
              {isDemoMode ? (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  96.4% Clean (Simulated)
                </span>
              ) : team?.integrityScore != null ? (
                <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                  {team.integrityScore}% Clean
                </span>
              ) : githubConnectedRepo ? (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  Awaiting Telemetry
                </span>
              ) : (
                <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                  Not Connected
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {team.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isDemoMode ? (
                "Seeded demo telemetry loaded. Review alert pending organizer countersignature."
              ) : team?.integrityScore != null ? (
                `Verified repository audit across ${team.commitsCount || 0} commits.`
              ) : githubConnectedRepo ? (
                `Repo linked (@${githubConnectedRepo.full_name}). Push commits during sprint to compute provenance score.`
              ) : (
                "Connect GitHub repository to track sprint cadence and generate verifiable Build Passport."
              )}
            </div>
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {passport.passportId}
            </span>
            <Link to={`/hackathons/${activeHackathon.id}/passport`} style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Inspect <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Center Layout: Team Status + Priority Quests */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        
        {/* Left: Active Team Workspace preview */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Active Squad Workspace</h3>
            <Link to={`/hackathons/${activeHackathon.id}/team`} style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open Workspace <ArrowRight size={12} />
            </Link>
          </div>
          <TeamCard team={team} hackathonId={activeHackathon.id} />
        </div>

        {/* Right: Urgent & Claimable Quests */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Sprint Objectives</span>
              {claimableQuests.length > 0 && (
                <span className="badge badge-emerald">
                  {claimableQuests.length} Claimable!
                </span>
              )}
            </h3>
            <Link to={`/hackathons/${activeHackathon.id}/quests`} style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All ({quests.length}) <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {claimableQuests.length > 0 ? (
              claimableQuests.map(q => (
                <QuestCard key={q.id} quest={q} />
              ))
            ) : activeQuests.length > 0 ? (
              <QuestCard quest={activeQuests[0]} />
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                <CheckCircle2 size={32} color="var(--accent-emerald)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: 600 }}>All immediate sprint quests claimed!</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate your Build Passport to conclude the sprint.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Copilot & Live Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        <div>
          <ActivityTimeline activities={activities} />
        </div>
        <div>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem' }}>AI Copilot Live Insights</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {aiInsights.map(insight => (
              <AIInsightCard key={insight.id} insight={insight} hackathonId={activeHackathon.id} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
