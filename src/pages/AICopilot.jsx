import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  GitCommit,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode,
  Send,
  Terminal,
  Activity,
  BookmarkPlus,
  Globe,
  Info,
  HelpCircle
} from 'lucide-react';
import TinyFishResearchPanel from '../components/TinyFishResearchPanel';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import {
  extractStructuredContext,
  generateTeamSummary,
  generateProgressSummary,
  detectBlockers,
  recommendNextAction,
  computeTeamHealth,
  suggestQuests,
  generateStandup,
  answerCopilotPrompt
} from '../utils/aiCopilotEngine';

export default function AICopilot() {
  const {
    team,
    quests,
    addQuest,
    activities,
    pullRequests,
    issues,
    activeHackathon,
    showToast
  } = useHackForge();

  // Active perspective tab ('intelligence' | 'research')
  const [copilotView, setCopilotView] = useState('intelligence');

  // Active time window for Progress Summary ('1h' | '3h' | 'all')
  const [timeWindow, setTimeWindow] = useState('3h');

  // Standup mode ('hourly' | 'daily')
  const [standupMode, setStandupMode] = useState('hourly');

  // UI state: Collapsible Structured Context Inspector
  const [showContextPayload, setShowContextPayload] = useState(false);

  // UI state: Re-running analysis indicator
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedStandup, setCopiedStandup] = useState(false);

  // Chat/Query console state
  const [inputQuery, setInputQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      id: 'init-1',
      sender: 'copilot',
      text: `Hello ${team?.name || 'HackForge'} builders! I'm your HackForge AI Team Copilot. I'm actively analyzing your 12 structured project streams: problem statement, team roles, quest board, GitHub commits, PRs, and issues.\n\nEvery insight is grounded in real activity. I will never hallucinate telemetry.`,
      timestamp: 'Just now',
      evidence: []
    }
  ]);

  // Extract structured context
  const context = useMemo(() => {
    return extractStructuredContext({
      team,
      quests,
      activities,
      pullRequests,
      issues,
      activeHackathon
    });
  }, [team, quests, activities, pullRequests, issues, activeHackathon]);

  // Run AI analysis
  const teamSummary = useMemo(() => generateTeamSummary(context), [context]);
  const progressSummary = useMemo(() => generateProgressSummary(context, timeWindow), [context, timeWindow]);
  const blockers = useMemo(() => detectBlockers(context), [context]);
  const nextAction = useMemo(() => recommendNextAction(context), [context]);
  const teamHealth = useMemo(() => computeTeamHealth(context), [context]);
  const suggestedQuests = useMemo(() => suggestQuests(context), [context]);
  const standup = useMemo(() => generateStandup(context, standupMode), [context, standupMode]);

  // Trigger re-audit simulation
  const handleTriggerAudit = () => {
    setIsAuditing(true);
    showToast("Re-evaluating 12 project telemetry streams...", "default");
    setTimeout(() => {
      setIsAuditing(false);
      showToast("AI Copilot intelligence model refreshed!", "default");
    }, 800);
  };

  // Copy standup to clipboard
  const handleCopyStandup = () => {
    navigator.clipboard.writeText(standup.markdown);
    setCopiedStandup(true);
    showToast("Standup copied to clipboard in markdown format!", "default");
    setTimeout(() => setCopiedStandup(false), 2500);
  };

  // Accept suggested quest
  const handleAdoptQuest = (quest) => {
    if (addQuest) {
      addQuest(quest);
    }
  };

  // Send query in Q&A console
  const handleSendQuery = (customText) => {
    const query = customText || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setChatLog(prev => [...prev, userMsg]);
    setInputQuery('');

    // Dispatch to grounded answer generator
    setTimeout(() => {
      const response = answerCopilotPrompt(query, context, {
        teamSummary,
        blockers,
        nextAction,
        teamHealth,
        standup
      });

      setChatLog(prev => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: response.answer,
          timestamp: 'Just now',
          evidence: response.evidence || []
        }
      ]);
    }, 400);
  };

  const presetQueries = [
    "Run Pre-Submission Architecture Audit",
    "How do I use TinyFish Web Research?",
    "What happened during the last hour?",
    "What blockers or workstream gaps are detected?",
    "Sprint Pacing Assessment"
  ];

  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-content" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* ================================================================ */}
        {/* HEADER: COPILOT MISSION CONTROL & TELEMETRY INGESTION INDICATOR  */}
        {/* ================================================================ */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="copilot-pulse-dot" />
                <span>HACKFORGE AI COPILOT v2.4</span>
              </span>
              <span className="badge badge-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                RULE-BASED TELEMETRY REASONING
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CONTEXT: {team.name?.toUpperCase()}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', marginBottom: '4px' }}>AI Team Copilot</h1>
            <p className="page-subtitle">
              Deterministic sprint intelligence engine with causal activity tracing, explainable blocker detection, and zero hallucinations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowContextPayload(!showContextPayload)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
              title="Inspect the exact structured JSON context passed to the Copilot"
            >
              <FileCode size={14} />
              <span>{showContextPayload ? 'Hide Structured Context' : 'Inspect Structured Context'}</span>
              {showContextPayload ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              onClick={handleTriggerAudit}
              disabled={isAuditing}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <RefreshCw size={14} className={isAuditing ? 'spin' : ''} />
              <span>{isAuditing ? 'Auditing Telemetry...' : 'Run Deep Audit'}</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PERSPECTIVE NAVIGATION TABS: INTELLIGENCE vs TINYFISH RESEARCH    */}
        {/* ================================================================ */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setCopilotView('intelligence')}
            className={`btn btn-sm ${copilotView === 'intelligence' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Sparkles size={14} />
            <span>Sprint Intelligence & Standups</span>
          </button>

          <button
            type="button"
            onClick={() => setCopilotView('research')}
            className={`btn btn-sm ${copilotView === 'research' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              borderColor: copilotView === 'research' ? 'var(--accent-cyan)' : 'var(--border-default)'
            }}
          >
            <Globe size={14} color="var(--accent-cyan)" />
            <span>TinyFish Live Web Research</span>
            <span className="badge badge-cyan" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>LIVE AGENT</span>
          </button>
        </div>

        {copilotView === 'research' ? (
          <TinyFishResearchPanel
            defaultGoal={
              context.problemStatement?.title
                ? `Explore technical documentation and architectures relevant to ${context.problemStatement.title}. Identify endpoints, SDK parameters, and implementation considerations for ${team.name}.`
                : ''
            }
          />
        ) : (
          <>
        {/* COLLAPSIBLE: STRUCTURED PROJECT CONTEXT INSPECTOR DRAWER         */}
        {/* Demonstrates that the AI receives all 12 required structured inputs */}
        {/* ================================================================ */}
        {showContextPayload && (
          <div
            className="card"
            style={{
              marginBottom: '24px',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="var(--accent-cyan)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ACTIVE STRUCTURED CONTEXT PAYLOAD (12 DATA FEEDS)
                </strong>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>STRICTLY GROUNDED</span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              The HackForge Copilot engine continuously ingests these 12 structured schemas to prevent generic answers or hallucinations:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>1. PROBLEM STATEMENT</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{context.problemStatement.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Track: {context.problemStatement.track} ({context.problemStatement.bounty})</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>2. TEAM & ROLES</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{context.teamMembers.length} Members Assigned</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{context.assignedRoles.join(', ')}</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>3. QUESTS & MILESTONES</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{context.completedQuests.length} Completed / {context.currentQuests.length} In Progress</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vault XP: {team.xpEarned ?? team.xp ?? 0} XP</div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>4. GITHUB RECENT TELEMETRY</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{context.recentCommits.length} Commits · {context.pullRequests.length} PRs · {context.issues.length} Issues</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Repo: {team.githubRepo ? team.githubRepo.replace('https://github.com/', '') : 'Not connected'}</div>
              </div>
            </div>

            <pre
              style={{
                background: '#040711',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)',
                maxHeight: '160px',
                overflowY: 'auto'
              }}
            >
              {JSON.stringify({
                problemStatement: { id: context.problemStatement.id, title: context.problemStatement.title },
                teamRoles: context.assignedRoles,
                completedQuests: context.completedQuests.map(q => q.title),
                recentCommits: context.recentCommits.map(c => ({
                  hash: c.metadata?.hash || c.metadata?.commit_hash || c.hash || null,
                  actor: c.actor?.name || c.author || 'Unknown',
                  message: c.metadata?.message || c.title || c.message || 'Commit'
                })),
                pullRequests: context.pullRequests.map(p => ({ number: p.number, title: p.title, status: p.status })),
                issues: context.issues.map(i => ({ number: i.number, title: i.title, severity: i.severity }))
              }, null, 2)}
            </pre>
          </div>
        )}

        {/* ================================================================ */}
        {/* SECTION 1: TEAM SUMMARY (PROMINENT HERO WITH EVIDENCE)           */}
        {/* Example: "Your backend and ML components are progressing well,   */}
        {/* but frontend integration has not started."                       */}
        {/* ================================================================ */}
        <div className="copilot-hero" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  <Sparkles size={11} /> 1. TEAM SUMMARY
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  SYNTHESIZED FROM LIVE WORKSTREAMS
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 700 }}>
                "{teamSummary.text}"
              </h2>
            </div>

            {/* Workstream Mini Status Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${teamSummary.workstreamHealth?.backend === 'ACTIVE' || teamSummary.workstreamHealth?.backend === 'GROWING' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>BACKEND</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: teamSummary.workstreamHealth?.backend === 'ACTIVE' || teamSummary.workstreamHealth?.backend === 'GROWING' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  {teamSummary.workstreamHealth?.backend || 'N/A'}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${teamSummary.workstreamHealth?.ml === 'ACTIVE' || teamSummary.workstreamHealth?.ml === 'GROWING' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>AI / ML</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: teamSummary.workstreamHealth?.ml === 'ACTIVE' || teamSummary.workstreamHealth?.ml === 'GROWING' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  {teamSummary.workstreamHealth?.ml || 'N/A'}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${teamSummary.workstreamHealth?.frontend === 'ACTIVE' || teamSummary.workstreamHealth?.frontend === 'GROWING' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}` }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>FRONTEND</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: teamSummary.workstreamHealth?.frontend === 'ACTIVE' || teamSummary.workstreamHealth?.frontend === 'GROWING' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  {teamSummary.workstreamHealth?.frontend || 'N/A'}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: `1px solid ${teamSummary.workstreamHealth?.docs === 'ACTIVE' || teamSummary.workstreamHealth?.docs === 'GROWING' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(148, 163, 184, 0.3)'}` }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>DOCS</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: teamSummary.workstreamHealth?.docs === 'ACTIVE' || teamSummary.workstreamHealth?.docs === 'GROWING' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  {teamSummary.workstreamHealth?.docs || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Causal Evidence Box */}
          <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px' }}>
              🔍 VERIFIED CAUSAL ACTIVITY EVIDENCE (ANTI-HALLUCINATION TRACE)
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {teamSummary.evidence.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No supporting commit records available in telemetry.
                </div>
              ) : (
                teamSummary.evidence.map((ev, idx) => (
                  <div key={idx} className="copilot-evidence-chip cyan">
                    <GitCommit size={12} />
                    <span>{ev.actor}{ev.hash ? ` (${ev.hash.slice(0, 7)})` : ''}: {ev.label}</span>
                  </div>
                ))
              )}
              {teamSummary.stats?.frontendCommits === 0 && (teamSummary.stats?.backendCommits > 0 || teamSummary.stats?.mlCommits > 0) && (
                <div className="copilot-evidence-chip amber">
                  <AlertTriangle size={12} />
                  <span>0 frontend commits recorded in telemetry</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 4: HIGHEST-VALUE NEXT ACTION (PROMINENT CALLOUT)         */}
        {/* ================================================================ */}
        <div
          className="card"
          style={{
            marginBottom: '24px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(20, 20, 30, 0.6) 100%)',
            position: 'relative'
          }}
        >
          <div className="card-hud-accent amber" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                  <Zap size={11} /> 4. HIGHEST-VALUE NEXT ACTION
                </span>
                <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
                  PRIORITY: {nextAction.priority}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  +{nextAction.xpReward} XP BOUNTY
                </span>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {nextAction.title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-violet" style={{ fontSize: '0.75rem' }}>
                Assigned: {nextAction.targetRole} ({nextAction.targetAssignee})
              </span>
              <button
                onClick={() => {
                  const questObj = suggestedQuests[0];
                  if (questObj) handleAdoptQuest(questObj);
                }}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                <BookmarkPlus size={14} />
                <span>Adopt Quest (+300 XP)</span>
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
            {nextAction.whyNow}
          </p>

          {/* Action Step Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            {nextAction.executionChecklist.map((step) => (
              <div
                key={step.step}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {step.step}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  {step.text}
                </div>
              </div>
            ))}
          </div>

          {/* Causal Attribution */}
          <div className="copilot-evidence-box">
            <strong style={{ color: 'var(--accent-cyan)' }}>Causal Basis: </strong>
            {nextAction.causedBy.detail}
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 5: TEAM HEALTH (RADAR GAUGES)                            */}
        {/* ================================================================ */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  <Activity size={11} /> 5. TEAM HEALTH & RISK RADAR
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>Autonomous Sprint Diagnostic</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Overall Risk Level:</span>
              <span
                className="badge"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--accent-amber)',
                  color: 'var(--accent-amber)',
                  fontWeight: 700
                }}
              >
                {teamHealth.risk.level} RISK
              </span>
            </div>
          </div>

          <div className="grid-4" style={{ marginBottom: '16px' }}>
            {/* 1. Collaboration */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COLLABORATION STATUS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {teamHealth.collaboration.score}/100
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                {teamHealth.collaboration.status}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {teamHealth.collaboration.detail}
              </p>
            </div>

            {/* 2. Development */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DEVELOPMENT STATUS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {teamHealth.development.score}/100
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '6px' }}>
                {teamHealth.development.status}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {teamHealth.development.detail}
              </p>
            </div>

            {/* 3. Integration */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTEGRATION STATUS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {teamHealth.integration.score}/100
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '6px' }}>
                {teamHealth.integration.status}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {teamHealth.integration.detail}
              </p>
            </div>

            {/* 4. Risk Level */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RISK ASSESSMENT</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: teamHealth.risk.color, fontFamily: 'var(--font-mono)', margin: '4px 0' }}>
                {teamHealth.risk.level}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: teamHealth.risk.color, marginBottom: '6px' }}>
                AUDIT: {teamHealth.risk.integrityAuditScore !== null ? `${teamHealth.risk.integrityAuditScore}% ORIGINAL` : 'NO REPO LINKED'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {teamHealth.risk.justification}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 2: PROGRESS SUMMARY (1H, 3H, ENTIRE HACKATHON TOGGLE)    */}
        {/* ================================================================ */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                  <TrendingUp size={11} /> 2. PROGRESS SUMMARY
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>Sprint Telemetry Timeline & Delta</h3>
            </div>

            {/* Time Window Tabs */}
            <div className="hud-tabs">
              <button
                type="button"
                onClick={() => setTimeWindow('1h')}
                className={`hud-tab ${timeWindow === '1h' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                Last 1 Hour
              </button>
              <button
                type="button"
                onClick={() => setTimeWindow('3h')}
                className={`hud-tab ${timeWindow === '3h' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                Last 3 Hours
              </button>
              <button
                type="button"
                onClick={() => setTimeWindow('all')}
                className={`hud-tab ${timeWindow === 'all' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              >
                Entire Hackathon
              </button>
            </div>
          </div>

          {/* Delta Counters */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '14px', background: 'var(--bg-surface)', padding: '12px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>COMMITS: </span>
              <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>+{progressSummary.delta.commits}</strong>
            </div>
            <span>•</span>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CODE DELTA: </span>
              <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>+{progressSummary.delta.additions}</strong>
              <span style={{ color: 'var(--text-muted)' }}> / </span>
              <strong style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>-{progressSummary.delta.deletions}</strong>
            </div>
            <span>•</span>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ACTIVE BUILDERS: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{progressSummary.delta.activeAuthors.join(', ') || 'None in window'}</strong>
            </div>
            <span>•</span>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>MERGED PRS: </span>
              <strong style={{ color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>{progressSummary.delta.prsMerged}</strong>
            </div>
          </div>

          {/* Narrative Summary */}
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '18px' }}>
            {progressSummary.text}
          </p>

          {/* Chronological Event Stream in that Window */}
          {progressSummary.hasInsufficientData ? (
            <div style={{ textAlign: 'center', padding: '30px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <HelpCircle size={24} color="var(--accent-amber)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {progressSummary.text}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {progressSummary.events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {ev.time}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {ev.actor}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {ev.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {ev.diff && (
                      <span className="badge badge-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                        {ev.diff}
                      </span>
                    )}
                    {ev.hash && (
                      <span className="badge badge-cyan" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                        {ev.hash}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* SECTION 3: BLOCKER DETECTION (CATEGORIZED WITH REMEDIATIONS)     */}
        {/* API Mismatches, Missing Dependencies, Unfinished Tasks, etc.    */}
        {/* ================================================================ */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                  <AlertCircle size={11} /> 3. BLOCKER DETECTION
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  IDENTIFIED RISKS & UNFINISHED WORKSTREAMS
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>Active Blockers & Friction Points ({blockers.length})</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blockers.map((blk) => {
              const isCrit = blk.severity === 'CRITICAL';
              const isWarn = blk.severity === 'WARNING';
              const badgeClass = isCrit ? 'badge-rose' : isWarn ? 'badge-amber' : 'badge-cyan';

              return (
                <div
                  key={blk.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: `1px solid ${isCrit ? 'rgba(244, 63, 94, 0.3)' : isWarn ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${badgeClass}`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {blk.severity}
                      </span>
                      <span className="badge badge-muted" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                        {blk.category.replace('_', ' ')}
                      </span>
                      <h4 style={{ fontSize: '0.98rem', color: 'var(--text-primary)', margin: 0 }}>
                        {blk.title}
                      </h4>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {blk.description}
                  </p>

                  {/* Causal Attribution Evidence */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>🔍 Caused by: </strong>
                    {blk.causedBy?.detail || 'Telemetry discrepancy'}
                  </div>

                  {/* Remediation Guide */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
                    <CheckCircle2 size={13} />
                    <span><strong>Remediation: </strong>{blk.remediation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 6: AUTOMATIC QUEST SUGGESTIONS                           */}
        {/* Example: NEW QUEST: "Connect ML inference API to frontend"       */}
        {/* Reward: +300 XP (With 1-click accept button)                     */}
        {/* ================================================================ */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.68rem' }}>
                  <Sparkles size={11} /> 6. AUTOMATIC QUEST SUGGESTIONS
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  GAP ANALYSIS MILESTONES
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>Dynamic Quests Generated from Telemetry Gaps</h3>
            </div>
          </div>

          <div className="grid-2">
            {suggestedQuests.map((quest) => (
              <div
                key={quest.id}
                className="card"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                    {quest.phase}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    +{quest.xpReward} XP
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                  NEW QUEST: "{quest.title}"
                </h4>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {quest.description}
                </p>

                {/* Checklist Requirements */}
                <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    VERIFICATION REQUIREMENTS:
                  </div>
                  {quest.checklist.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '2px', border: '1px solid var(--accent-cyan)' }} />
                      <span>{c.task}</span>
                    </div>
                  ))}
                </div>

                {/* Caused By Attribution */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '14px', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ color: 'var(--accent-cyan)' }}>Caused by: </strong>
                  {quest.causedBy.detail}
                </div>

                <button
                  type="button"
                  onClick={() => handleAdoptQuest(quest)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <BookmarkPlus size={14} />
                  <span>Accept Quest (+{quest.xpReward} XP)</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 7: DAILY / HOURLY STANDUP (COPYABLE MARKDOWN)            */}
        {/* Completed, In Progress, Blocked, Next                           */}
        {/* ================================================================ */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  <Clock size={11} /> 7. DAILY / HOURLY STANDUP
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  AUTO-GENERATED FROM COMMIT & ISSUE AUDIT
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem' }}>Automated Standup Ledger</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="hud-tabs">
                <button
                  type="button"
                  onClick={() => setStandupMode('hourly')}
                  className={`hud-tab ${standupMode === 'hourly' ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                >
                  Hourly Sync (3h)
                </button>
                <button
                  type="button"
                  onClick={() => setStandupMode('daily')}
                  className={`hud-tab ${standupMode === 'daily' ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                >
                  Daily Standup
                </button>
              </div>

              <button
                onClick={handleCopyStandup}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
                title="Copy markdown formatted standup for Slack / Discord"
              >
                {copiedStandup ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                <span>{copiedStandup ? 'Copied Markdown!' : 'Copy to Slack/Discord'}</span>
              </button>
            </div>
          </div>

          {standup.hasInsufficientData ? (
            <div
              style={{
                background: 'var(--bg-surface)',
                padding: '32px 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-default)',
                textAlign: 'center'
              }}
            >
              <Info size={32} color="var(--accent-cyan)" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Insufficient Telemetry for Automated Standup
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.5 }}>
                No commits, pull requests, or quest completions have been recorded in this time window. Connect a repository or log activity to automatically generate standup items.
              </p>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: '16px' }}>
              {/* Completed */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    COMPLETED ({standup.completed.length})
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {standup.completed.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No completed commits or quests recorded in this window.</div>
                  ) : (
                    standup.completed.map((c, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{c.author}: </strong>
                        <span>{c.item} </span>
                        <span className="badge badge-muted" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                          {c.causedBy}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <TrendingUp size={16} color="var(--accent-cyan)" />
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    IN PROGRESS ({standup.inProgress.length})
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {standup.inProgress.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active milestones currently claimed.</div>
                  ) : (
                    standup.inProgress.map((ip, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{ip.author}: </strong>
                        <span>{ip.item} </span>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                          branch: {ip.branch}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Blocked */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <AlertCircle size={16} color="var(--accent-rose)" />
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    BLOCKED ({standup.blocked.length})
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {standup.blocked.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Zero critical blockers detected.</div>
                  ) : (
                    standup.blocked.map((b, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        <span className="badge badge-rose" style={{ fontSize: '0.65rem', marginRight: '6px' }}>{b.impact}</span>
                        <span>{b.item} </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>— {b.causedBy}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Next */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <ArrowRight size={16} color="var(--accent-amber)" />
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    NEXT OBJECTIVES ({standup.next.length})
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {standup.next.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No pending unstarted milestones.</div>
                  ) : (
                    standup.next.map((n, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        <span className="badge badge-amber" style={{ fontSize: '0.65rem', marginRight: '6px' }}>{n.targetRole}</span>
                        <span>{n.item} </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>({n.eta})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* INTERACTIVE CONTEXT-GROUNDED QUERY CONSOLE                       */}
        {/* ================================================================ */}
        <div
          className="card"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem' }}>Grounded Copilot Query Console</h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              QUERIES EVALUATED WITH STRICT TELEMETRY CAUSALITY
            </span>
          </div>

          {/* Preset Query Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {presetQueries.map((p, idx) => (
              <button
                key={idx}
                className="badge badge-muted"
                onClick={() => handleSendQuery(p)}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <Sparkles size={11} color="var(--accent-cyan)" />
                <span>{p}</span>
              </button>
            ))}
          </div>

          {/* Stream Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '360px', overflowY: 'auto', marginBottom: '16px', paddingRight: '6px' }}>
            {chatLog.map(msg => {
              const isCopilot = msg.sender === 'copilot';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCopilot ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>{isCopilot ? '🤖 HackForge Copilot' : '🧑‍💻 Builder'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    style={{
                      maxWidth: '90%',
                      background: isCopilot ? 'var(--bg-card)' : 'var(--accent-cyan)',
                      color: isCopilot ? 'var(--text-primary)' : '#000',
                      border: isCopilot ? '1px solid var(--border-subtle)' : 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      fontSize: '0.84rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {msg.text}

                    {/* Evidence Chips */}
                    {isCopilot && msg.evidence && msg.evidence.length > 0 && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {msg.evidence.map((ev, i) => (
                          <span key={i} className="copilot-evidence-chip cyan">
                            <GitCommit size={10} />
                            <span>{ev.label || ev.title || ev.hash}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              placeholder="Ask Copilot about blockers, pacing, workstream status, or jury readiness..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
          </>
        )}

      </main>
    </div>
  );
}
