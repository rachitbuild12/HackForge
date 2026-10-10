import React, { useEffect } from 'react';
import { Trophy, Zap, Award, Sparkles, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BadgeUnlockModal({ data, onClose }) {
  if (!data) return null;

  const {
    type = 'quest', // 'quest' | 'badge' | 'level'
    title = 'Milestone Conquered!',
    subtitle = 'Development milestone verified & logged to team ledger',
    xpReward = 250,
    badgeTitle = 'API Architect',
    badgeTier = 'Gold',
    badgeIcon = 'Zap',
    level = null,
    levelTitle = null
  } = data;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 8, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={onClose}
    >
      {/* Celebration Modal Container */}
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px 28px',
          background: 'linear-gradient(160deg, #161c2c 0%, #0e111a 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 0 60px rgba(16, 185, 129, 0.25), 0 20px 50px rgba(0,0,0,0.8)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'background var(--transition-fast)'
          }}
        >
          <X size={16} />
        </button>

        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '100px',
            background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Animated Icon Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              margin: '0 auto',
              boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)',
              animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {type === 'level' ? (
              <Trophy size={42} strokeWidth={2.5} />
            ) : type === 'badge' ? (
              <Award size={42} strokeWidth={2.5} />
            ) : (
              <Zap size={44} fill="currentColor" />
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              background: 'var(--bg-base)',
              borderRadius: '50%',
              padding: '4px',
              border: '2px solid var(--accent-emerald)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={14} />
          </div>
        </div>

        {/* Subtitle Badge */}
        <div style={{ marginBottom: '8px' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
            {type === 'level' ? 'LEVEL UP REACHED' : 'MILESTONE VERIFIED'}
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px', fontWeight: 800 }}>
          {title}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: 1.5 }}>
          {subtitle}
        </p>

        {/* Reward Stat Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              XP REWARD
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--accent-emerald)',
                fontFamily: 'var(--font-mono)',
                marginTop: '2px'
              }}
            >
              +{xpReward} XP
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              TELEMETRY AUDIT
            </div>
            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px'
              }}
            >
              <ShieldCheck size={16} /> Verified
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            color: '#000',
            border: 'none',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}
        >
          <span>Claim Bounty & Continue Sprint</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
