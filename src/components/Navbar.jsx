import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Shield, Trophy, LayoutDashboard, Compass, Cpu, Bell, User, ChevronDown, Check, Terminal, ExternalLink, Sparkles, Play, Users, LogOut, LogIn } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import XPProgress from './XPProgress';

export default function Navbar() {
  const { user, switchRole, activeHackathonId, signOut, supabaseUser } = useHackForge();
  const location = useLocation();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const roles = [
    { id: 'participant', label: 'Participant / Student', badge: 'badge-emerald', icon: '⚡' },
    { id: 'team_leader', label: 'Team Leader', badge: 'badge-cyan', icon: '🚀' },
    { id: 'organizer', label: 'Hackathon Organizer', badge: 'badge-violet', icon: '🛡️' },
    { id: 'judge', label: 'Judge / Evaluator', badge: 'badge-amber', icon: '⚖️' },
    { id: 'mentor', label: 'Technical Mentor', badge: 'badge-rose', icon: '🧠' }
  ];

  const currentRoleObj = roles.find(r => r.id === user.role) || roles[0];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        
        {/* Left: Brand & Navigation */}
        <div className="navbar-left">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 0 16px rgba(16,185,129,0.4)', flexShrink: 0 }}>
              <Terminal size={18} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: '#fff' }}>
                HACK<span style={{ color: 'var(--accent-emerald)' }}>FORGE</span>
              </span>
              <span className="navbar-version-badge" style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px', marginLeft: '6px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                OS v2.4
              </span>
            </div>
          </Link>

          {/* Primary Nav Links */}
          <nav className="navbar-nav">
            <Link
              to="/dashboard"
              className={`btn btn-sm ${isActive('/dashboard') ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ color: isActive('/dashboard') ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/hackathons"
              className={`btn btn-sm ${isActive('/hackathons') && !location.pathname.includes('/organizer') ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ color: isActive('/hackathons') && !location.pathname.includes('/organizer') ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}
            >
              <Compass size={14} />
              <span>Hackathons</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.6rem', padding: '1px 5px', marginLeft: '2px' }}>PARTICIPATE</span>
            </Link>

            {/* Hackathon Workspace Shortcut */}
            <Link
              to={`/hackathons/${activeHackathonId}/quests`}
              className={`btn btn-sm ${location.pathname.includes(`/hackathons/${activeHackathonId}/`) ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ color: location.pathname.includes(`/hackathons/${activeHackathonId}/`) ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
            >
              <Zap size={14} fill="currentColor" />
              <span>Active Sprint</span>
            </Link>

            {/* Squad / Team Workspace for Team Leaders & Participants */}
            {(user.role === 'team_leader' || user.role === 'participant') && (
              <Link
                to={`/hackathons/${activeHackathonId}/team`}
                className={`btn btn-sm ${location.pathname.includes('/team') ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ color: location.pathname.includes('/team') ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
              >
                <Users size={14} />
                <span>My Squad</span>
              </Link>
            )}

            {/* Organizer Portal - Only visible for Organizer role */}
            {user.role === 'organizer' && (
              <Link
                to="/organizer"
                className={`btn btn-sm ${isActive('/organizer') ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ color: isActive('/organizer') ? 'var(--accent-violet)' : 'var(--text-secondary)' }}
              >
                <Shield size={14} />
                <span>Organizer</span>
              </Link>
            )}

            {/* Judge Portal - Only visible for Judge role */}
            {user.role === 'judge' && (
              <Link
                to="/judge"
                className={`btn btn-sm ${isActive('/judge') ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ color: isActive('/judge') ? 'var(--accent-amber)' : 'var(--text-secondary)' }}
              >
                <Trophy size={14} />
                <span>Judge</span>
              </Link>
            )}

            {/* Special Hackathon Demo Mode */}
            <Link
              to="/demo"
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.25))',
                border: '1px solid rgba(6, 182, 212, 0.5)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 14px rgba(6, 182, 212, 0.25)',
                marginLeft: '4px'
              }}
              title="Launch 5-Minute Guided Demo Flow"
            >
              <Sparkles size={13} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700 }}>Run Demo</span>
              <span
                style={{
                  background: 'var(--accent-emerald)',
                  color: '#000',
                  fontSize: '0.6rem',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontWeight: 800
                }}
              >
                5 MIN
              </span>
            </Link>
          </nav>
        </div>

        {/* Right: Role Switcher, XP Pill, Notifications, Profile */}
        <div className="navbar-right">
          
          {/* Role Switcher Pill Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="navbar-role-btn"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'border-color var(--transition-fast)'
              }}
              title="Switch role perspective"
            >
              <span>{currentRoleObj.icon}</span>
              <span className="navbar-role-label">Role: <strong style={{ color: 'var(--accent-cyan)' }}>{currentRoleObj.label.split('/')[0].trim()}</strong></span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {roleDropdownOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setRoleDropdownOpen(false)} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '6px 8px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Switch User Perspective
                  </div>
                  {roles.map(r => (
                    <div
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setRoleDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        background: user.role === r.id ? 'var(--bg-surface)' : 'transparent',
                        color: user.role === r.id ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                      </div>
                      {user.role === r.id && <Check size={14} color="var(--accent-emerald)" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* XP Progress Compact Pill */}
          <div className="navbar-xp-pill">
            <XPProgress
              xp={user.xp}
              level={user.level}
              nextLevelXp={user.nextLevelXp}
              levelTitle={user.levelTitle}
              showCompact={true}
            />
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="btn btn-ghost btn-sm"
              style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', position: 'relative' }}
              title="Recent alerts"
            >
              <Bell size={16} />
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', background: 'var(--accent-emerald)', borderRadius: '50%' }} />
            </button>

            {notifDropdownOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setNotifDropdownOpen(false)} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '12px',
                    zIndex: 100
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Telemetry Stream</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Live</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>⚡ XP Bounty Claimed</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Team earned +600 XP for Core Settlement logic!</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>🛡️ Build Passport Sync</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Latest commit 8f4a21e verified clean originality.</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile & Account Menu */}
          {user && user.id !== 'guest' && (user.email || supabaseUser) ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  color: 'inherit'
                }}
                title="Account menu & Sign Out"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="navbar-profile-name" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={12} color="var(--text-muted)" />
              </button>

              {userMenuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setUserMenuOpen(false)} />
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '240px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '8px',
                      zIndex: 100
                    }}
                  >
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email || `@${user.github}`}
                      </div>
                      <div style={{ marginTop: '6px' }}>
                        <span className={`badge ${currentRoleObj.badge}`} style={{ fontSize: '0.65rem' }}>
                          {currentRoleObj.label}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none'
                      }}
                      className="nav-menu-item"
                    >
                      <User size={14} color="var(--accent-cyan)" />
                      <span>Developer Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        color: 'var(--accent-rose)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginTop: '4px'
                      }}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
