import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, Zap, Trophy, ArrowRight, CheckCircle2, Mail, Lock, User, RefreshCw, AlertCircle } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { useHackForge } from '../context/HackForgeContext';

export default function Auth() {
  const navigate = useNavigate();
  const {
    user,
    switchRole,
    showToast,
    supabaseUser,
    isSupabaseConfigured,
    supabaseSignIn,
    supabaseSignUp,
    supabaseSignInWithGitHub
  } = useHackForge();

  // Auth Mode: 'supabase' (Email/Password & Supabase OAuth) | 'demo' (Fast-track testing personas)
  const [authMode, setAuthMode] = useState('supabase');
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Handle Supabase Email & Password Submit
  const handleSupabaseAuth = async (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setAuthError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      if (isSignUp) {
        await supabaseSignUp(emailInput, passwordInput, {
          full_name: nameInput || emailInput.split('@')[0]
        });
        showToast('Registration successful! Please check your email or proceed to login.', 'default');
      } else {
        await supabaseSignIn(emailInput, passwordInput);
        navigate('/hackathons/eth-global-2026/team');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle GitHub OAuth (via Supabase or Direct Backend)
  const handleGitHubAuth = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabaseSignInWithGitHub();
      } catch (err) {
        console.warn('Supabase GitHub OAuth failed, falling back to direct server OAuth:', err);
        window.location.href = '/api/auth/github';
      }
    } else {
      window.location.href = '/api/auth/github';
    }
  };

  // Fast-track demo persona logins
  const handleDemoLogin = (roleToSet, redirectPath = '/dashboard') => {
    switchRole(roleToSet);
    showToast(`Authenticated as ${roleToSet.replace('_', ' ').toUpperCase()}! Welcome to HackForge OS.`, 'default');
    navigate(redirectPath);
  };

  return (
    <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="card-hud-accent cyan" />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', margin: '0 auto 16px auto', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            <Terminal size={28} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Access HackForge OS</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Developer identity, team collaboration & telemetry engine
          </p>
        </div>

        {/* Auth Mode Toggle */}
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
            onClick={() => setAuthMode('supabase')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: authMode === 'supabase' ? 'var(--bg-card)' : 'transparent',
              color: authMode === 'supabase' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Supabase Account
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('demo')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: authMode === 'demo' ? 'var(--bg-card)' : 'transparent',
              color: authMode === 'demo' ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Instant Demo Roles
          </button>
        </div>

        {/* Error notification */}
        {authError && (
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
            <span>{authError}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 1: SUPABASE AUTHENTICATION                                */}
        {/* ============================================================== */}
        {authMode === 'supabase' ? (
          <div>
            <form onSubmit={handleSupabaseAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {isSignUp && (
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'block' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Alex Chen"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 12px 10px 36px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'block' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px 10px 36px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px 10px 36px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '4px' }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={15} className="spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isSignUp ? 'Create Supabase Account' : 'Sign In with Supabase'}</span>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '2px' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError('');
                  }}
                  style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>OR CONNECT WITH GITHUB</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={handleGitHubAuth}
            >
              <GithubIcon size={18} />
              <span>Sign In with GitHub</span>
            </button>
          </div>
        ) : (
          /* ============================================================== */
          /* MODE 2: INSTANT ROLE DEMO PERSONAS                             */
          /* ============================================================== */
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleDemoLogin('team_leader', '/dashboard')}
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚀</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Team Leader (Alex Chen)</span>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Sprint Ready</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleDemoLogin('organizer', '/organizer')}
                style={{ justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🛡️</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Hackathon Organizer</span>
                </div>
                <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>Control Center</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleDemoLogin('judge', '/judge')}
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
        )}

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4, margin: '20px 0 0 0' }}>
          Identity is verified with Supabase Auth and audited through HackForge Build Passport.
        </p>
      </div>
    </div>
  );
}
