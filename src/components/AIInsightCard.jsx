import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIInsightCard({ insight, hackathonId = 'eth-global-2026' }) {
  const getStyle = (type) => {
    switch (type) {
      case 'INTEGRITY_CHECK':
        return {
          badge: 'badge-emerald',
          icon: <ShieldCheck size={16} color="var(--accent-emerald)" />,
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case 'SPRINT_PACING':
        return {
          badge: 'badge-amber',
          icon: <Clock size={16} color="var(--accent-amber)" />,
          border: 'rgba(245, 158, 11, 0.3)'
        };
      default:
        return {
          badge: 'badge-cyan',
          icon: <Lightbulb size={16} color="var(--accent-cyan)" />,
          border: 'rgba(6, 182, 212, 0.3)'
        };
    }
  };

  const style = getStyle(insight.type);

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(145deg, #111522, #0c0f18)',
        border: `1px solid ${style.border}`,
        position: 'relative'
      }}
    >
      <div className="card-hud-accent cyan" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {style.icon}
          <span className={`badge ${style.badge}`} style={{ fontSize: '0.68rem' }}>
            {insight.type.replace('_', ' ')}
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} /> HACKFORGE COPILOT
        </span>
      </div>

      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
        {insight.title}
      </h4>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
        {insight.content}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link to={`/hackathons/${hackathonId}/ai`} className="btn btn-secondary btn-sm">
          <span>{insight.actionText || 'Ask Copilot'}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
