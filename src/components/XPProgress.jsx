import React from 'react';
import { Zap, Shield, Sparkles } from 'lucide-react';

export default function XPProgress({ xp, level, nextLevelXp, levelTitle, showCompact = false }) {
  const currentLevelBase = (level - 1) * 1000;
  const levelSpan = nextLevelXp - currentLevelBase;
  const currentProgressInLevel = Math.max(0, xp - currentLevelBase);
  const percentage = Math.min(100, Math.round((currentProgressInLevel / levelSpan) * 100));

  if (showCompact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <Zap size={13} fill="currentColor" />
          <span>{xp.toLocaleString()} XP</span>
        </div>
        <div style={{ width: '40px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))' }} />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
          LVL {level}
        </span>
      </div>
    );
  }

  return (
    <div className="card" style={{ background: 'linear-gradient(145deg, #101422, #0c0e18)', border: '1px solid var(--border-default)' }}>
      <div className="card-hud-accent cyan" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--accent-emerald-dim)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Developer Velocity Matrix
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>LVL {level}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>{levelTitle}</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
            {xp.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>XP</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {nextLevelXp - xp} XP to Level {level + 1}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))',
            boxShadow: '0 0 10px rgba(16,185,129,0.5)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        <span>Tier Baseline: {currentLevelBase} XP</span>
        <span style={{ color: 'var(--accent-cyan)' }}>{percentage}% Milestone</span>
        <span>Target: {nextLevelXp} XP</span>
      </div>
    </div>
  );
}
