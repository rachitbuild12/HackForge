import React from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { Info, Users, Zap, Activity, Cpu, ShieldCheck, ShieldAlert, Settings, ArrowLeft, Clock, Compass, Trophy } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function Sidebar({ mode = 'hackathon' }) {
  const { id } = useParams();
  const location = useLocation();
  const { activeHackathon } = useHackForge();
  const hackathonId = id || activeHackathon?.id || 'eth-global-2026';

  if (mode === 'organizer') {
    return (
      <aside className="workspace-sidebar">
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <NavLink to="/organizer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <ArrowLeft size={13} /> Back to Hub
          </NavLink>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            ORGANIZER COMMAND
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '2px' }}>
            {activeHackathon?.title || 'Control Center'}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <NavLink
            to={`/organizer/hackathons/${hackathonId}`}
            end
            className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <Settings size={16} />
            <span>Control Center</span>
          </NavLink>

          <NavLink
            to={`/organizer/hackathons/${hackathonId}/integrity`}
            className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
            style={{ width: '100%', color: location.pathname.includes('/integrity') ? '#fff' : undefined, background: location.pathname.includes('/integrity') ? 'var(--accent-rose-dim)' : undefined, border: location.pathname.includes('/integrity') ? '1px solid rgba(244,63,94,0.4)' : undefined }}
          >
            <ShieldAlert size={16} color="var(--accent-rose)" />
            <span>Integrity Sentinel</span>
          </NavLink>

          <NavLink
            to={`/organizer/hackathons/${hackathonId}/scope`}
            className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <Compass size={16} />
            <span>Scope Analysis</span>
          </NavLink>

          <NavLink
            to={`/hackathons/${hackathonId}`}
            className="hud-tab"
            style={{ width: '100%', marginTop: 'auto' }}
          >
            <Info size={16} />
            <span>Public View</span>
          </NavLink>
        </nav>
      </aside>
    );
  }

  // Hackathon Participant / Builder Sidebar
  return (
    <aside className="workspace-sidebar">
      {/* Sprint Info Card */}
      <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
            <span className="pulse-dot" /> LIVE SPRINT
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            48H FORGE
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {activeHackathon?.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
          <Clock size={12} />
          <span>{activeHackathon?.timeLeft}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', padding: '6px 12px' }}>
          Workspace Links
        </div>

        <NavLink
          to={`/hackathons/${hackathonId}`}
          end
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Info size={16} />
          <span>Overview & Rules</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/team`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Users size={16} />
          <span>Team Workspace</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/quests`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Zap size={16} />
          <span>Quest / Task Board</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/leaderboard`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Trophy size={16} />
          <span>Leaderboard & XP</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/activity`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Activity size={16} />
          <span>Dev Telemetry</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/ai`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Cpu size={16} />
          <span>AI Team Copilot</span>
          <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: 'auto' }}>TinyFish</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/scope`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
        >
          <Compass size={16} />
          <span>Project Scope</span>
        </NavLink>

        <NavLink
          to={`/hackathons/${hackathonId}/passport`}
          className={({ isActive }) => `hud-tab ${isActive ? 'active' : ''}`}
          style={({ isActive }) => ({
            background: isActive ? 'var(--accent-emerald)' : 'rgba(16, 185, 129, 0.08)',
            color: isActive ? '#000' : 'var(--accent-emerald)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            marginTop: '8px'
          })}
        >
          <ShieldCheck size={16} />
          <span>Build Passport</span>
        </NavLink>
      </nav>

      {/* Quick Team Status Footer */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Repo Link:</span>
          <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>Synced</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Passport Audit:</span>
          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>97.4% Clean</span>
        </div>
      </div>
    </aside>
  );
}
