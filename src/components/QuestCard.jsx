import React, { useState } from 'react';
import { CheckCircle2, Circle, Lock, Zap, ArrowRight, Link as LinkIcon, Globe, Sparkles } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function QuestCard({ quest }) {
  const { claimQuestXp, toggleQuestTask, updateQuestRequirementEvidence } = useHackForge();
  const [evidenceInputs, setEvidenceInputs] = useState(() => {
    const init = {};
    if (quest.evidenceFields) {
      quest.evidenceFields.forEach(ef => {
        init[ef.key] = ef.value || '';
      });
    }
    return init;
  });

  const getTierBadge = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'legendary': return 'badge-violet';
      case 'gold': return 'badge-amber';
      case 'silver': return 'badge-cyan';
      default: return 'badge-emerald';
    }
  };

  const getStatusBadge = () => {
    switch (quest.status) {
      case 'COMPLETED':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> COMPLETED</span>;
      case 'CLAIMABLE':
        return <span className="badge badge-emerald" style={{ animation: 'pulse-glow 2s infinite' }}><Zap size={12} /> READY TO CLAIM</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-cyan"><Circle size={12} /> IN PROGRESS</span>;
      case 'AVAILABLE':
        return <span className="badge badge-amber"><Sparkles size={12} /> AVAILABLE</span>;
      case 'LOCKED':
      default:
        return <span className="badge badge-muted"><Lock size={12} /> LOCKED</span>;
    }
  };

  const isCompleted = quest.status === 'COMPLETED';
  const isClaimable = quest.status === 'CLAIMABLE';
  const isLocked = quest.status === 'LOCKED';
  const isAvailable = quest.status === 'AVAILABLE';

  const handleEvidenceChange = (key, value) => {
    setEvidenceInputs(prev => ({ ...prev, [key]: value }));
    updateQuestRequirementEvidence(quest.id, key, value);
  };

  return (
    <div
      className="card"
      style={{
        background: isClaimable
          ? 'linear-gradient(145deg, #131d24, #0f161f)'
          : isCompleted
          ? 'rgba(19, 23, 36, 0.45)'
          : isLocked
          ? 'rgba(14, 17, 26, 0.4)'
          : 'var(--bg-card)',
        borderColor: isClaimable
          ? 'rgba(16, 185, 129, 0.5)'
          : isCompleted
          ? 'rgba(16, 185, 129, 0.2)'
          : isAvailable
          ? 'rgba(245, 158, 11, 0.3)'
          : 'var(--border-subtle)',
        boxShadow: isClaimable
          ? '0 0 25px rgba(16, 185, 129, 0.15)'
          : isAvailable
          ? '0 0 20px rgba(245, 158, 11, 0.08)'
          : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        opacity: isLocked ? 0.65 : 1
      }}
    >
      {isClaimable && <div className="card-hud-accent" />}
      {isAvailable && <div className="card-hud-accent amber" />}

      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${getTierBadge(quest.tier)}`}>
              {quest.tier}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {quest.phase}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isClaimable ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <Zap size={14} fill="currentColor" />
            <span>+{quest.xpReward} XP</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '1.05rem', color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {quest.title}
          </h3>
          <div>{getStatusBadge()}</div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {quest.description}
        </p>
      </div>

      {/* Evidence Fields (for milestone requirements like API endpoint & deployment URL) */}
      {quest.evidenceFields && !isLocked && !isCompleted && (
        <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase' }}>
            Required Artifact Proofs
          </div>
          {quest.evidenceFields.map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={evidenceInputs[field.key] || ''}
                  onChange={e => handleEvidenceChange(field.key, e.target.value)}
                  className="form-input"
                  style={{ fontSize: '0.78rem', padding: '6px 10px', height: '34px', background: 'var(--bg-surface)' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task checklist */}
      {quest.checklist && (
        <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            <span>Verification Criteria</span>
            <span>{quest.checklist.filter(c => c.done).length}/{quest.checklist.length}</span>
          </div>
          {quest.checklist.map((item, idx) => (
            <div
              key={idx}
              onClick={() => !isLocked && !isCompleted && toggleQuestTask(quest.id, idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: item.done ? 'var(--text-secondary)' : 'var(--text-muted)',
                textDecoration: item.done ? 'line-through' : 'none',
                cursor: isLocked || isCompleted ? 'default' : 'pointer',
                userSelect: 'none'
              }}
            >
              {item.done ? (
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
              ) : (
                <Circle size={16} color="var(--text-dim)" />
              )}
              <span>{item.task}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        {/* Progress percent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, marginRight: '16px' }}>
          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${quest.progress}%`,
                height: '100%',
                background: isCompleted ? 'var(--accent-emerald)' : 'linear-gradient(90deg, #06b6d4, #10b981)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {quest.progress}%
          </span>
        </div>

        {/* Claim / Status button */}
        {isClaimable ? (
          <button
            className="btn btn-primary"
            onClick={() => claimQuestXp(quest.id)}
            style={{ animation: 'pulse-glow 2s infinite', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#000', fontWeight: 700 }}
          >
            <Zap size={14} fill="currentColor" />
            <span>Claim +{quest.xpReward} XP</span>
          </button>
        ) : isCompleted ? (
          <button className="btn btn-ghost btn-sm" disabled style={{ opacity: 0.8, color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={14} /> Claimed
          </button>
        ) : isLocked ? (
          <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5 }}>
            <Lock size={14} /> Locked
          </button>
        ) : isAvailable ? (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toggleQuestTask(quest.id, 0)}
            style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
          >
            <span>Start Milestone</span>
            <ArrowRight size={13} />
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" disabled>
            In Progress
          </button>
        )}
      </div>
    </div>
  );
}
