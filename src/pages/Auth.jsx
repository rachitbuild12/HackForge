import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, Zap, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { useHackForge } from '../context/HackForgeContext';

export default function Auth() {
  const navigate = useNavigate();
  const { user, switchRole, showToast } = useHackForge();
  const [email, setEmail] = useState('kaelen@hackforge.dev');
  const [selectedRole, setSelectedRole] = useState(user.role || 'team_leader');

  const handleLogin = (roleToSet, redirectPath = '/dashboard') => {
    switchRole(roleToSet || selectedRole);
    showToast(`Authenticated as ${roleToSet || selectedRole}! Welcome to HackForge OS.`, 'default');
    navigate(redirectPath);
  };

  return (
    <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="card-hud-accent cyan" />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', margin: '0 auto 16px auto', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            <Terminal size={28} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>Access HackForge OS</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Developer-native hackathon identity & telemetry engine
          </p>
        </div>

        {/* Fast-Track Demo Personas */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            Instant Role Demo Logins
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => handleLogin('team_leader', '/dashboard')}
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🚀</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Team Leader (Alex Chen)</span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Sprint Ready</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => handleLogin('organizer', '/organizer')}
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🛡️</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Hackathon Organizer</span>
              </div>
              <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>Control Center</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => handleLogin('judge', '/judge')}
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚖️</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Judge / Jury Member</span>
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Scoring Deck</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>OR CONNECT DIRECTLY</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {/* GitHub Mock Connect */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: '16px', padding: '12px' }}
          onClick={() => handleLogin('participant', '/dashboard')}
        >
          <GithubIcon size={18} />
          <span>Connect GitHub Developer Account</span>
        </button>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
          By authenticating, you agree to the HackForge Integrity Protocol and automated commit originality verification.
        </p>
      </div>
    </div>
  );
}
