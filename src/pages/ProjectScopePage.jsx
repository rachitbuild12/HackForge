import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Layers,
  FileCode,
  GitCommit,
  GitPullRequest,
  RefreshCw,
  Edit3,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Check,
  Code2,
  Server,
  Smartphone,
  Cpu,
  Flame,
  Terminal
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import { analyzeProjectScope, DEFAULT_REPOSITORY_TREE } from '../utils/projectScopeEngine';

export default function ProjectScopePage() {
  const { id } = useParams();
  const {
    team,
    activeHackathon,
    activities,
    pullRequests,
    updateProjectDescription,
    showToast
  } = useHackForge();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL, IMPLEMENTED, INCOMPLETE, NO_EVIDENCE, UNEXPECTED
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states for Structured Project Description edit modal
  const defaultDesc = team.structuredProjectDescription || {
    problem: "Autonomous Agent-to-Agent Micro-Settlement Friction: AI agents executing high-frequency autonomous workflows are bottlenecked by L1 gas fees and non-verifiable latency.",
    proposedSolution: "A high-velocity off-chain state channel network backed by zero-knowledge receipts and an on-chain smart contract vault for trustless instant settlement.",
    majorFeatures: [
      "Authentication",
      "AI Prediction",
      "Real-time Alerts",
      "Mobile Application",
      "Escrow Settlement Engine"
    ],
    techStack: ["Next.js 14", "FastAPI", "Python", "TypeScript", "LangChain", "Docker", "Solidity"],
    expectedArchitecture: "Three-tier architecture comprising a Next.js Client HUD, FastAPI inference microservice, and Solidity state channel smart contract",
    milestones: [
      "Milestone 1: Repository initialization and starter scaffold setup",
      "Milestone 2: Agent authentication and JWT signature verifiers",
      "Milestone 3: AI prediction and LangChain decision engine",
      "Milestone 4: Real-time telemetry alerts and live notifications",
      "Milestone 5: Cross-platform mobile telemetry app (deferred)"
    ]
  };

  const [formProblem, setFormProblem] = useState(defaultDesc.problem || '');
  const [formSolution, setFormSolution] = useState(defaultDesc.proposedSolution || '');
  const [formFeatures, setFormFeatures] = useState((defaultDesc.majorFeatures || []).join(', '));
  const [formTechStack, setFormTechStack] = useState((defaultDesc.techStack || []).join(', '));
  const [formArchitecture, setFormArchitecture] = useState(defaultDesc.expectedArchitecture || '');
  const [formMilestones, setFormMilestones] = useState((defaultDesc.milestones || []).join('\n'));

  // Run AI Scope Analysis
  const scopeAnalysis = useMemo(() => {
    return analyzeProjectScope({
      projectDescription: {
        ...(team.structuredProjectDescription || defaultDesc),
        teamName: team.name
      },
      commits: team.commits || [],
      pullRequests: pullRequests || [],
      repositoryTree: DEFAULT_REPOSITORY_TREE,
      activities: activities || []
    });
  }, [team.structuredProjectDescription, defaultDesc, team.name, team.commits, pullRequests, activities]);

  // Handle re-analyze animation
  const handleReanalyze = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Project Scope Intelligence refreshed with latest GitHub telemetry!", "default");
    }, 600);
  };

  // Handle Save Description
  const handleSaveDescription = (e) => {
    e.preventDefault();
    const updatedFeatures = formFeatures.split(',').map(s => s.trim()).filter(Boolean);
    const updatedTech = formTechStack.split(',').map(s => s.trim()).filter(Boolean);
    const updatedMilestones = formMilestones.split('\n').map(s => s.trim()).filter(Boolean);

    updateProjectDescription({
      problem: formProblem,
      proposedSolution: formSolution,
      majorFeatures: updatedFeatures.length > 0 ? updatedFeatures : defaultDesc.majorFeatures,
      techStack: updatedTech.length > 0 ? updatedTech : defaultDesc.techStack,
      expectedArchitecture: formArchitecture,
      milestones: updatedMilestones
    });

    setEditModalOpen(false);
  };

  // Filter features based on tab
  const filteredFeatures = useMemo(() => {
    if (activeTab === 'IMPLEMENTED') {
      return scopeAnalysis.features.filter(f => f.status === 'IMPLEMENTED');
    }
    if (activeTab === 'INCOMPLETE') {
      return scopeAnalysis.features.filter(f => f.status === 'INCOMPLETE');
    }
    if (activeTab === 'NO_EVIDENCE') {
      return scopeAnalysis.features.filter(f => f.status === 'NO_EVIDENCE');
    }
    return scopeAnalysis.features;
  }, [scopeAnalysis, activeTab]);

  return (
    <div className="workspace-layout">
      <Sidebar />

      <main className="workspace-main">
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Compass size={13} /> PROJECT SCOPE INTELLIGENCE
              </span>
              <span className="badge badge-emerald">
                {scopeAnalysis.alignmentScore}% Scope Alignment
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Project Scope Analysis
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', margin: 0 }}>
              AI comparison of the submitted structured project description against actual GitHub repository activity, 
              changed files, commit lineage, and pull requests.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setEditModalOpen(true)}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Edit3 size={15} /> Edit Description
            </button>
            <button
              onClick={handleReanalyze}
              disabled={isRefreshing}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
              {isRefreshing ? 'Analyzing Scope...' : 'Re-run Analysis'}
            </button>
          </div>
        </div>

        {/* Essential Product Principle Notice Banner */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          <Info size={20} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#60a5fa', marginBottom: '4px' }}>
              This is NOT plagiarism detection.
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The purpose of <strong>Project Scope Analysis</strong> is to help teams and organizers understand whether 
              the implemented product matches the submitted project description. It highlights verified accomplishments, 
              flags incomplete deliverables, and detects unexpected functionality before final judging.
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {/* Card 1: Scope Alignment Score */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Scope Alignment Score</span>
              <Sparkles size={16} color="var(--accent-emerald)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {scopeAnalysis.alignmentScore}%
              </span>
              <span className={`badge ${scopeAnalysis.alignmentBadge}`} style={{ fontSize: '0.72rem' }}>
                {scopeAnalysis.alignmentLabel}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Based on 5 declared major features
            </div>
          </div>

          {/* Card 2: Features Implemented */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Evidence Found</span>
              <CheckCircle2 size={16} color="var(--accent-emerald)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {scopeAnalysis.featuresSummary.implemented}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                / {scopeAnalysis.featuresSummary.total} features
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Codebase grounded with active commits
            </div>
          </div>

          {/* Card 3: Incomplete / Limited Evidence */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Limited Evidence</span>
              <AlertTriangle size={16} color="var(--accent-amber)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                {scopeAnalysis.featuresSummary.incomplete}
              </span>
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                In Progress
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Partial UI without backend daemons
            </div>
          </div>

          {/* Card 4: No Evidence Yet */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">No Evidence Yet</span>
              <XCircle size={16} color="var(--accent-rose)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                {scopeAnalysis.featuresSummary.noEvidence}
              </span>
              <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
                Undeveloped
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Zero commits or directory files found
            </div>
          </div>
        </div>

        {/* Structured Project Description Overview Drawer */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', pb: '14px', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} color="var(--accent-violet)" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Submitted Project Description
                </h2>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Baseline submitted prior to sprint start
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditModalOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Edit3 size={13} /> Update Scope
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px', fontWeight: 700 }}>
                1. Problem
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {defaultDesc.problem}
              </p>

              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px', fontWeight: 700 }}>
                2. Proposed Solution
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                {defaultDesc.proposedSolution}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px', fontWeight: 700 }}>
                3. Declared Technology Stack
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {(defaultDesc.techStack || []).map((tech, idx) => (
                  <span key={idx} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                    {tech}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px', fontWeight: 700 }}>
                4. Expected Architecture
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 16px 0' }}>
                {defaultDesc.expectedArchitecture}
              </p>

              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px', fontWeight: 700 }}>
                5. Planned Milestones
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(defaultDesc.milestones || []).slice(0, 3).map((m, idx) => (
                  <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-violet)' }}>•</span> {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Status Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Feature Status
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Evidence verification across repository tree, commit messages, and PRs
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`hud-tab ${activeTab === 'ALL' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                All ({scopeAnalysis.features.length})
              </button>
              <button
                onClick={() => setActiveTab('IMPLEMENTED')}
                className={`hud-tab ${activeTab === 'IMPLEMENTED' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                Implemented ({scopeAnalysis.featuresSummary.implemented})
              </button>
              <button
                onClick={() => setActiveTab('INCOMPLETE')}
                className={`hud-tab ${activeTab === 'INCOMPLETE' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                Incomplete ({scopeAnalysis.featuresSummary.incomplete})
              </button>
              <button
                onClick={() => setActiveTab('NO_EVIDENCE')}
                className={`hud-tab ${activeTab === 'NO_EVIDENCE' ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              >
                No Evidence ({scopeAnalysis.featuresSummary.noEvidence})
              </button>
            </div>
          </div>

          {/* Feature List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredFeatures.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  borderLeft: feature.status === 'IMPLEMENTED'
                    ? '4px solid var(--accent-emerald)'
                    : feature.status === 'INCOMPLETE'
                    ? '4px solid var(--accent-amber)'
                    : '4px solid var(--accent-rose)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {feature.name}
                      </h3>
                      <span className={`badge ${feature.statusBadge}`} style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        {feature.statusLabel}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                      {feature.summary}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Grounding Score
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: feature.status === 'IMPLEMENTED' ? 'var(--accent-emerald)' : feature.status === 'INCOMPLETE' ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}>
                      {feature.evidenceScore}%
                    </div>
                  </div>
                </div>

                {/* Evidence Details */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '12px'
                }}>
                  {/* Matching Files */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', minWidth: '95px' }}>
                      <FileCode size={13} /> Repository:
                    </span>
                    {feature.matchingFiles.length > 0 ? (
                      feature.matchingFiles.map((file, fIdx) => (
                        <span
                          key={fIdx}
                          style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: 'var(--accent-cyan)'
                          }}
                        >
                          {file}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontStyle: 'italic' }}>
                        No associated files detected in repository tree
                      </span>
                    )}
                  </div>

                  {/* Matching Commits */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', minWidth: '95px' }}>
                      <GitCommit size={13} /> Commits:
                    </span>
                    {feature.matchingCommits.length > 0 ? (
                      feature.matchingCommits.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <span style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>{c.hash}</span>: "{c.message}"
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No related commit messages found
                      </span>
                    )}
                  </div>

                  {/* Recommendation Note */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Recommendation:</span>
                    <span>{feature.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Unexpected Functionality Section */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color="var(--accent-amber)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--accent-amber)' }}>
                Major Unexpected Functionality
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Modules or files identified in repository activity that were NOT declared in the submitted scope
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            These modules may represent unplanned organic pivots, exploratory scripts, or code imported from past projects.
            Judges and organizers are prompted to verify their intent and scope.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
            {scopeAnalysis.unexpectedFunctionality.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                    {item.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <FileCode size={13} color="var(--accent-amber)" />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {item.relevantFiles.join(', ')}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                  <strong>Organizer Note:</strong> {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack & Expected Architecture Verification */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Tech Stack Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Terminal size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Technology Stack Verification
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  Detected in Repository ({scopeAnalysis.techStackAlignment.detected.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {scopeAnalysis.techStackAlignment.detected.map((t, idx) => (
                    <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
              {scopeAnalysis.techStackAlignment.missing.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    Declared But Unverified ({scopeAnalysis.techStackAlignment.missing.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {scopeAnalysis.techStackAlignment.missing.map((t, idx) => (
                      <span key={idx} className="badge badge-rose" style={{ fontSize: '0.75rem' }}>
                        ✕ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Architecture Verification Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Server size={18} color="var(--accent-violet)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Expected Architecture Audit
              </h3>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <strong>Declared:</strong> {scopeAnalysis.architectureCheck.declared}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scopeAnalysis.architectureCheck.observedLayers.map((layer, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={14} color="var(--accent-emerald)" />
                  <span>{layer}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              Status: {scopeAnalysis.architectureCheck.status}
            </div>
          </div>
        </div>

        {/* Modal: Edit / Submit Structured Project Description */}
        {editModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  Structured Project Description
                </h2>
                <button onClick={() => setEditModalOpen(false)} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Update your team's baseline scope. The AI compares these declared items against your GitHub repository activity.
              </p>

              <form onSubmit={handleSaveDescription} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    1. Problem
                  </label>
                  <textarea
                    rows={2}
                    value={formProblem}
                    onChange={(e) => setFormProblem(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', resize: 'vertical' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    2. Proposed Solution
                  </label>
                  <textarea
                    rows={2}
                    value={formSolution}
                    onChange={(e) => setFormSolution(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', resize: 'vertical' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    3. Major Features (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                    placeholder="Authentication, AI Prediction, Real-time Alerts, Mobile Application"
                    required
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Each feature is individually verified for evidence in commits and files.
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    4. Technology Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formTechStack}
                    onChange={(e) => setFormTechStack(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                    placeholder="Next.js 14, FastAPI, Python, TypeScript, Docker"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    5. Expected Architecture
                  </label>
                  <input
                    type="text"
                    value={formArchitecture}
                    onChange={(e) => setFormArchitecture(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                    placeholder="Distributed client, Python AI microservice, and smart contract"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    6. Optional Milestones (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formMilestones}
                    onChange={(e) => setFormMilestones(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', resize: 'vertical' }}
                    placeholder="Milestone 1: Setup&#10;Milestone 2: Inference model"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save & Re-evaluate Scope
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
