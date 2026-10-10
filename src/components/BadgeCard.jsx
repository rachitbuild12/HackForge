import React from 'react';
import { Zap, ShieldCheck, Moon, Cpu, Award, Trophy, Star } from 'lucide-react';

const iconMap = {
  Zap,
  ShieldCheck,
  Moon,
  Cpu,
  Award,
  Trophy,
  Star
};

export default function BadgeCard({ badge, locked = false }) {
  const IconComponent = iconMap[badge.icon] || Award;

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'legendary':
        return {
          border: 'rgba(139, 92, 246, 0.4)',
          glow: 'rgba(139, 92, 246, 0.25)',
          badgeClass: 'badge-violet',
          iconColor: '#c084fc',
          accent: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))'
        };
      case 'gold':
        return {
          border: 'rgba(245, 158, 11, 0.4)',
          glow: 'rgba(245, 158, 11, 0.2)',
          badgeClass: 'badge-amber',
          iconColor: '#fbbf24',
          accent: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(16,185,129,0.1))'
        };
      case 'silver':
        return {
          border: 'rgba(148, 163, 184, 0.3)',
          glow: 'rgba(148, 163, 184, 0.1)',
          badgeClass: 'badge-muted',
          iconColor: '#cbd5e1',
          accent: 'linear-gradient(135deg, rgba(148,163,184,0.15), rgba(255,255,255,0.02))'
        };
      default:
        return {
          border: 'rgba(16, 185, 129, 0.3)',
          glow: 'rgba(16, 185, 129, 0.15)',
          badgeClass: 'badge-emerald',
          iconColor: '#34d399',
          accent: 'linear-gradient(135deg, rgba(16,185,129,0.15), transparent)'
        };
    }
  };

  const styling = getTierColor(badge.tier);

  return (
    <div
      className="card"
      style={{
        background: locked ? 'var(--bg-surface)' : styling.accent,
        borderColor: locked ? 'var(--border-subtle)' : styling.border,
        opacity: locked ? 0.6 : 1,
        boxShadow: locked ? 'none' : `0 4px 20px ${styling.glow}`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '130px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: locked ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.3)',
            border: `1px solid ${locked ? 'var(--border-subtle)' : styling.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: locked ? 'var(--text-muted)' : styling.iconColor
          }}
        >
          <IconComponent size={22} />
        </div>
        <span className={`badge ${locked ? 'badge-muted' : styling.badgeClass}`}>
          {badge.tier}
        </span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: locked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
          {badge.title}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
          {badge.description}
        </div>
      </div>

      {badge.unlockedAt && (
        <div style={{ marginTop: '10px', fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          Unlocked: {badge.unlockedAt}
        </div>
      )}
    </div>
  );
}
