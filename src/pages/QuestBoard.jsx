import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Zap, ShieldCheck, Trophy, Sparkles, CheckCircle2, Filter, Activity, Cpu, Rocket, Code2, Lock, Info, Award } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import QuestCard from '../components/QuestCard';
import XPProgress from '../components/XPProgress';

export default function QuestBoard() {
  const { id } = useParams();
  const { quests, user, team, evaluateActivityForMilestones } = useHackForge();
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const phases = [
    'ALL',
    'Phase 1: Genesis',
    'Phase 2: Core MVP',
    'Phase 3: Deployment & Polish',
    'Phase 4: Finale & Passport'
  ];

  const statuses = [
    { id: 'ALL', label: 'All Quests' },
    { id: 'CLAIMABLE', label: 'Claimable' },
    { id: 'AVAILABLE', label: 'Available' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'LOCKED', label: 'Locked' }
  ];

  const filteredQuests = quests.filter(q => {
    const matchesPhase = selectedPhase === 'ALL' || q.phase === selectedPhase;
    const matchesStatus = selectedStatus === 'ALL' || q.status === selectedStatus;
    return matchesPhase && matchesStatus;
  });

  const completedCount = quests.filter(q => q.status === 'COMPLETED').length;
  const claimableCount = quests.filter(q => q.status === 'CLAIMABLE').length;
  const inProgressCount = quests.filter(q => q.status === 'IN_PROGRESS').length;

  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-content">
        
        {/* Header */}
        <div className="page-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald">
                <Zap size={12} fill="currentColor" /> HACKFORGE QUEST ENGINE
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {completedCount}/{quests.length} MILESTONES COMPLETED
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem' }}>Sprint Quest & Milestone Board</h1>
            <p className="page-subtitle">
              Important development milestones represented as verifiable quests. Earn XP for architectural breakthroughs and deployments, not commit spam.
            </p>
          </div>

          {/* Team Vault Total */}
          <div className="card" style={{ padding: '10px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-emerald-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
              <Trophy size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                TEAM VAULT BOUNTY
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {(team?.xpEarned || team?.xp || 2450).toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Principle Banner */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={16} color="#60a5fa" />
            <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
              <strong>Notice:</strong> XP represents participation and progress, not competition judging. Do NOT reward spam commits.
            </div>
          </div>
          <Link to={`/hackathons/${id || 'eth-global-2026'}/leaderboard`} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Trophy size={13} color="var(--accent-amber)" /> View Leaderboards & Badges
          </Link>
        </div>

        {/* Developer XP Matrix */}
        <div style={{ marginBottom: '24px' }}>
          <XPProgress
            xp={user.xp}
            level={user.level}
            nextLevelXp={user.nextLevelXp}
            levelTitle={user.levelTitle}
          />
        </div>

        {/* Meaningful Activity Engine Telemetry Banner */}
        <div
          className="card"
          style={{
            marginBottom: '24px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(16, 185, 129, 0.08))',
            border: '1px solid rgba(6, 182, 212, 0.25)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  Activity-Driven Milestone Verification
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  HackForge evaluates meaningful telemetry events (builds, deployments, inference pipelines) rather than raw commit quantity.
                </div>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SIMULATE TELEMETRY:</span>
              <button
                type="button"
                onClick={() => evaluateActivityForMilestones("API_DEPLOYED")}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                title="Simulates backend endpoint deployed to production"
              >
                <Code2 size={13} color="var(--accent-cyan)" />
                <span>Deploy API</span>
              </button>
              <button
                type="button"
                onClick={() => evaluateActivityForMilestones("AI_MODEL_INTEGRATED")}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                title="Simulates autonomous AI model pipeline integration"
              >
                <Cpu size={13} color="var(--accent-amber)" />
                <span>AI Model</span>
              </button>
              <button
                type="button"
                onClick={() => evaluateActivityForMilestones("MVP_DEPLOYED")}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                title="Simulates live MVP prototype deployed on web"
              >
                <Rocket size={13} color="var(--accent-emerald)" />
                <span>Deploy MVP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status & Phase Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Status Tabs */}
          <div className="hud-tabs" style={{ flexWrap: 'wrap' }}>
            {statuses.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`hud-tab ${selectedStatus === st.id ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                <span>{st.label}</span>
                {st.id === 'CLAIMABLE' && claimableCount > 0 && (
                  <span style={{ background: 'var(--accent-emerald)', color: '#000', borderRadius: '50%', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 800 }}>
                    {claimableCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Phase Filter Dropdown / Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase:</span>
            <select
              value={selectedPhase}
              onChange={e => setSelectedPhase(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.78rem', padding: '5px 10px', height: '34px', width: 'auto' }}
            >
              {phases.map(ph => (
                <option key={ph} value={ph}>{ph}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Quests Grid */}
        <div className="grid-2" style={{ gap: '16px' }}>
          {filteredQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>No quests match the selected filters.</p>
          </div>
        )}

      </main>
    </div>
  );
}
