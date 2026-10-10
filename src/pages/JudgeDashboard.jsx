import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Compass,
  Code2,
  Layers,
  Users,
  GitCommit,
  GitPullRequest,
  Cpu,
  Clock,
  Sparkles,
  Sliders,
  Bookmark,
  Copy,
  ChevronRight,
  Info,
  Check,
  Save,
  RotateCcw,
  Zap,
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function JudgeDashboard() {
  const {
    judgeQueue,
    organizerJudgingCriteria,
    updateJudgeScore,
    updateJudgeNotes,
    saveJudgeDraft,
    submitJudgeReview,
    showToast,
    activeHackathonId
  } = useHackForge();

  const [selectedProjectId, setSelectedProjectId] = useState(judgeQueue[0]?.id || 'proj-1');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PROJECT, SUMMARY, JOURNEY, TEAM, TECH, PASSPORT, INTEGRITY, SCORING
  const [queueFilter, setQueueFilter] = useState('ALL'); // ALL, PENDING, SCORED, FLAGGED
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Fallback criteria if not loaded from context
  const criteria = organizerJudgingCriteria || [
    {
      id: "execution",
      label: "Technical Execution & Architecture",
      weight: 0.25,
      weightPercent: "25%",
      description: "Code architecture, system scalability, robust error handling, security, and verified technical execution."
    },
    {
      id: "innovation",
      label: "Innovation & Originality",
      weight: 0.25,
      weightPercent: "25%",
      description: "Novelty of the solution, creative problem-solving, uniqueness within the track, and advancing state-of-the-art."
    },
    {
      id: "implementation",
      label: "Feature Completeness & Scope",
      weight: 0.20,
      weightPercent: "20%",
      description: "Degree to which proposed major features are implemented, working end-to-end flow, and live prototype fidelity."
    },
    {
      id: "design",
      label: "UI/UX & Developer Ergonomics",
      weight: 0.15,
      weightPercent: "15%",
      description: "Usability, user interface polish, developer experience, clear flows, and clean responsive layout."
    },
    {
      id: "impact",
      label: "Real-World Impact & Viability",
      weight: 0.15,
      weightPercent: "15%",
      description: "Ecosystem utility, practical applicability, value proposition, and roadmap viability beyond the hackathon."
    }
  ];

  const selectedProject = judgeQueue.find(p => p.id === selectedProjectId) || judgeQueue[0];

  // Calculate weighted composite total score
  const calculateTotal = (scores) => {
    if (!scores) return '0.0';
    let total = 0;
    criteria.forEach(c => {
      const val = scores[c.id] !== undefined ? scores[c.id] : (scores.execution || 7.0);
      total += val * c.weight;
    });
    return total.toFixed(1);
  };

  // Filtered queue items
  const filteredQueue = judgeQueue.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.track.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (queueFilter === 'PENDING') return p.status === 'PENDING_REVIEW' || p.status === 'DRAFT_SAVED';
    if (queueFilter === 'SCORED') return p.status === 'SCORED';
    if (queueFilter === 'FLAGGED') return p.status === 'FLAGGED_AUDIT';
    return true;
  });

  const scoredCount = judgeQueue.filter(p => p.status === 'SCORED').length;
  const progressPercent = Math.round((scoredCount / judgeQueue.length) * 100);

  const handleCopyRepo = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(true);
    showToast("Repository URL copied to clipboard", "default");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getScoreBadge = (score) => {
    const num = parseFloat(score);
    if (num >= 9.0) return { label: 'Exceptional', color: 'var(--accent-emerald)' };
    if (num >= 8.0) return { label: 'Strong', color: 'var(--accent-cyan)' };
    if (num >= 6.5) return { label: 'Solid', color: 'var(--accent-amber)' };
    return { label: 'Developing', color: 'var(--accent-rose)' };
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Trophy size={12} /> JURY CHAMBER EVALUATION STATION
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ETHGLOBAL AUTONOMOUS 2026
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Judge Scoring Dashboard</h1>
          <p className="page-subtitle" style={{ maxWidth: '750px' }}>
            Comprehensive project evaluation station. Inspect verified development velocity, milestone evidence, and organizer-cleared integrity without needing to inspect GitHub repositories manually.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div style={{ background: 'var(--bg-surface)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', minWidth: '240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>JURY QUEUE PROGRESS</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              {scoredCount} / {judgeQueue.length} Scored
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '6px', textAlign: 'right' }}>
            {progressPercent}% Complete
          </div>
        </div>
      </div>

      {/* Critical Jury Policy Banner: No Automatic Ranking / Winner Prediction */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(6, 182, 212, 0.05))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)', flexShrink: 0 }}>
          <Lock size={16} />
        </div>
        <div style={{ fontSize: '0.82rem', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
          <strong style={{ color: '#fff' }}>Official HackForge Jury Policy:</strong> Submissions in this queue are organized solely for review workflow convenience. HackForge <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>does NOT generate automated winner predictions</span> or compute competitive rankings. All scoring weights, rubric judgments, and final prize allocations remain strictly the sovereign decision of human judges.
        </div>
      </div>

      {/* Main Two-Column Layout: Left = Submissions Queue, Right = Detailed Evaluation Station */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: SUBMISSIONS QUEUE                          */}
        {/* ======================================================== */}
        <div>
          <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Submission Queue</h3>
              <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
                {filteredQueue.length} Assigned
              </span>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search project or squad..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '7px 10px 7px 32px',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {[
                { id: 'ALL', label: 'All', count: judgeQueue.length },
                { id: 'PENDING', label: 'Pending', count: judgeQueue.filter(p => p.status === 'PENDING_REVIEW' || p.status === 'DRAFT_SAVED').length },
                { id: 'SCORED', label: 'Scored', count: scoredCount },
                { id: 'FLAGGED', label: 'Audit', count: judgeQueue.filter(p => p.status === 'FLAGGED_AUDIT').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setQueueFilter(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: queueFilter === tab.id ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                    color: queueFilter === tab.id ? '#000' : 'var(--text-secondary)',
                    border: '1px solid ' + (queueFilter === tab.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'),
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Queue List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredQueue.map(project => {
              const isSelected = project.id === selectedProjectId;
              const isScored = project.status === 'SCORED';
              const isDraft = project.status === 'DRAFT_SAVED';
              const isFlagged = project.status === 'FLAGGED_AUDIT';
              const compositeScore = calculateTotal(project.scores);

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="card interactive"
                  style={{
                    padding: '14px 16px',
                    border: isSelected ? '1px solid var(--accent-cyan)' : isFlagged ? '1px solid rgba(244,63,94,0.4)' : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? 'linear-gradient(145deg, rgba(6, 182, 212, 0.1), rgba(14, 20, 28, 0.95))'
                      : 'var(--bg-card)',
                    boxShadow: isSelected ? '0 0 20px rgba(6,182,212,0.15)' : 'none',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-cyan)' }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                      {project.name}
                    </h4>
                    <span
                      className={`badge ${
                        isScored ? 'badge-emerald' : isDraft ? 'badge-amber' : isFlagged ? 'badge-rose' : 'badge-muted'
                      }`}
                      style={{ fontSize: '0.62rem' }}
                    >
                      {isScored ? 'SCORED' : isDraft ? 'DRAFT' : isFlagged ? 'AUDIT ALERT' : 'PENDING'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Squad: <strong style={{ color: 'var(--text-secondary)' }}>{project.teamName}</strong> • {project.track}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: project.hasPassport ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {project.hasPassport ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                      {project.hasPassport ? 'Verified Passport' : 'Audit Pending'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isScored ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                      {isScored ? `${compositeScore} / 10.0` : 'Unscored'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: COMPLETE PROJECT EVALUATION STATION        */}
        {/* ======================================================== */}
        {selectedProject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Project Banner */}
            <div className="card" style={{ padding: '24px', position: 'relative' }}>
              <div className="card-hud-accent cyan" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">{selectedProject.track}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Squad: <strong style={{ color: '#fff' }}>{selectedProject.teamName}</strong>
                    </span>
                    <span className={`badge ${selectedProject.hasPassport ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.65rem' }}>
                      {selectedProject.hasPassport ? 'ORGANIZER CLEARED' : 'ORGANIZER AUDIT PENDING'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                    {selectedProject.name}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px', maxWidth: '800px', lineHeight: '1.5' }}>
                    {selectedProject.tagline}
                  </p>
                </div>

                {/* External Action Links (Demo, Repo Copy, Scope, Passport) */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={13} />
                    <span>Live Prototype Demo</span>
                  </a>

                  <button
                    onClick={() => handleCopyRepo(selectedProject.repoUrl)}
                    className="btn btn-secondary btn-sm"
                    title="Click to copy repository URL without leaving judging station"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {copiedId ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                    <span>{copiedId ? 'Repo URL Copied!' : 'Copy Repo URL'}</span>
                  </button>

                  <Link
                    to={`/verify/${selectedProject.buildPassport?.passportId || 'HFP-2026-9842A-77'}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShieldCheck size={13} color="var(--accent-emerald)" />
                    <span>Public Build Passport</span>
                  </Link>

                  <Link
                    to={`/hackathons/${activeHackathonId}/scope`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Compass size={13} color="var(--accent-violet)" />
                    <span>Scope Analysis</span>
                  </Link>
                </div>
              </div>

              {/* Notice that manual GitHub inspection is NOT needed */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <Info size={15} color="var(--accent-cyan)" />
                <span>
                  <strong>Zero GitHub Hopping Required:</strong> All commit velocity, PR deltas, team member contributions, architecture specs, and provenance records have been authenticated and synthesized in the panels below.
                </span>
              </div>

              {/* Navigation Tabs Bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginTop: '18px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '14px',
                  overflowX: 'auto'
                }}
              >
                {[
                  { id: 'ALL', label: 'All Sections' },
                  { id: 'PROJECT', label: '1. Project & Problem' },
                  { id: 'SUMMARY', label: '2. Executive Summary' },
                  { id: 'JOURNEY', label: '3. Build Journey' },
                  { id: 'TEAM', label: '4. Team Contributions' },
                  { id: 'TECH', label: '5. Technical Implementation' },
                  { id: 'PASSPORT', label: '6. Build Passport' },
                  { id: 'INTEGRITY', label: '7. Organizer Integrity' },
                  { id: 'SCORING', label: '⚖️ Scoring Rubric' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeTab === t.id ? 'var(--accent-cyan)' : 'transparent',
                      color: activeTab === t.id ? '#000' : 'var(--text-secondary)',
                      border: '1px solid ' + (activeTab === t.id ? 'var(--accent-cyan)' : 'transparent'),
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Warning Alert if Project is Flagged for Audit */}
            {!selectedProject.hasPassport && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <AlertTriangle size={24} color="var(--accent-rose)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '0.9rem' }}>
                    Pending Organizer Integrity Audit — Score Finalization Paused
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {selectedProject.organizerApprovedIntegrity?.organizerNotes || 'Sentinel detected suspicious commit activity. Organizers are conducting human provenance review. Please hold score locking.'}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 1. PROJECT SECTION                                       */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'PROJECT') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <FileText size={18} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>1. Project & Problem Statement</h3>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      TRACK: {selectedProject.problemStatement?.track || selectedProject.track}
                    </span>
                    {selectedProject.problemStatement?.sponsor && (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        Bounty Sponsor: {selectedProject.problemStatement.sponsor} ({selectedProject.problemStatement.bounty})
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>
                    {selectedProject.problemStatement?.title || selectedProject.problemStatement}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                    {selectedProject.problemStatement?.description || selectedProject.tagline}
                  </p>
                </div>

                <div className="grid-3" style={{ gap: '12px' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TEAM SQUAD</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                      {selectedProject.teamName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {selectedProject.teamContributions?.members?.length || 3} Registered Builders
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LIVE DEMO URL</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {selectedProject.demoUrl} <ExternalLink size={11} />
                      </a>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                      Verified Active Endpoint
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GITHUB REPOSITORY</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {selectedProject.repoUrl.replace('https://github.com/', '')} <ExternalLink size={11} />
                      </a>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {selectedProject.buildPassport?.verifiedCommits || 37} Verified Commits
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. EXECUTIVE SUMMARY                                      */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'SUMMARY') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Sparkles size={18} color="var(--accent-emerald)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>2. Executive Summary: What was built?</h3>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
                    SOLUTION NARRATIVE
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.65' }}>
                    {selectedProject.executiveSummary?.whatBuilt || selectedProject.tagline}
                  </p>
                </div>

                <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '4px' }}>
                    CORE PROBLEM SOLVED & USER VALUE
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {selectedProject.executiveSummary?.coreValue || selectedProject.problemStatement?.description}
                  </p>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 3. BUILD JOURNEY                                         */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'JOURNEY') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="var(--accent-cyan)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>3. Build Journey: Development Timeline</h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Chronological Milestone Progression
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Tracks organic team pacing across the 48-hour development window, highlighting key feature births, deployments, and problem resolutions.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedProject.buildJourney?.map((milestone, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        background: 'var(--bg-surface)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: milestone.type === 'DEPLOYMENT' ? 'rgba(16, 185, 129, 0.15)' : milestone.type === 'PULL_REQUEST' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: milestone.type === 'DEPLOYMENT' ? 'var(--accent-emerald)' : milestone.type === 'PULL_REQUEST' ? 'var(--accent-violet)' : 'var(--accent-cyan)',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}
                      >
                        {milestone.type === 'DEPLOYMENT' ? <Zap size={14} /> : milestone.type === 'PULL_REQUEST' ? <GitPullRequest size={14} /> : <GitCommit size={14} />}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                              {milestone.phase}
                            </span>
                            <span className="badge badge-muted" style={{ fontSize: '0.62rem' }}>
                              {milestone.type}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {milestone.time}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                          {milestone.event}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>Actor: <strong>{milestone.actor}</strong></span>
                          <span>•</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>Hash: {milestone.hash}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 4. TEAM CONTRIBUTION                                     */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'TEAM') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--accent-emerald)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>4. Team Contribution: Who built what?</h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    Verified Authenticated Authorship
                  </span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Collaboration Synthesis:</strong> {selectedProject.teamContributions?.summary || 'Distributed multidisciplinary team covering architecture, client frontend HUD, and backend microservices.'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedProject.teamContributions?.members?.map((member, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-default)' }}
                      />

                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{member.name}</span>
                            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{member.role}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            @{member.github}
                          </span>
                        </div>

                        {/* Contribution Area Tags */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '6px 0 10px 0' }}>
                          {member.areas?.map((area, aIdx) => (
                            <span
                              key={aIdx}
                              style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                color: 'var(--accent-emerald)',
                                fontSize: '0.68rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 600
                              }}
                            >
                              {area}
                            </span>
                          ))}
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '8px' }}>
                          {member.contributions}
                        </p>

                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                          <span>Commits: <strong style={{ color: '#fff' }}>{member.commitsCount}</strong></span>
                          <span>PRs Authored: <strong style={{ color: '#fff' }}>{member.prsCount}</strong></span>
                          <span>Line Changes: <span style={{ color: 'var(--accent-emerald)' }}>+{member.linesAdded.toLocaleString()}</span> / <span style={{ color: 'var(--accent-rose)' }}>-{member.linesRemoved.toLocaleString()}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. TECHNICAL IMPLEMENTATION                              */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'TECH') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Code2 size={18} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>5. Technical Implementation</h3>
                </div>

                {/* Architecture Description */}
                <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
                    SYSTEM ARCHITECTURE BREAKDOWN
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.5', marginBottom: '12px' }}>
                    {selectedProject.technicalImplementation?.architecture}
                  </p>

                  <div className="grid-3" style={{ gap: '10px' }}>
                    {selectedProject.technicalImplementation?.components?.map((comp, cIdx) => (
                      <div key={cIdx} style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>{comp.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: '1.35' }}>{comp.role}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>{comp.tech}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Chips */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                    TECHNOLOGY STACK
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedProject.technicalImplementation?.technologies?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          background: 'rgba(6, 182, 212, 0.08)',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          color: '#fff',
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Major Features Verified Table */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                    MAJOR FEATURES & REPOSITORY EVIDENCE
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedProject.technicalImplementation?.majorFeatures?.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'var(--bg-surface)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{feat.name}</span>
                            <span className={`badge ${feat.status === 'VERIFIED' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.62rem' }}>
                              {feat.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {feat.description}
                          </div>
                        </div>

                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          Evidence: {feat.evidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 6. BUILD PASSPORT                                        */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'PASSPORT') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="var(--accent-emerald)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>6. Build Passport: Verified Activity</h3>
                  </div>
                  <span className={`badge ${selectedProject.hasPassport ? 'badge-emerald' : 'badge-rose'}`}>
                    {selectedProject.buildPassport?.status || (selectedProject.hasPassport ? 'VERIFIED_ELIGIBLE' : 'FLAGGED_AUDIT')}
                  </span>
                </div>

                <div className="grid-4" style={{ gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PASSPORT SERIAL ID</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                      {selectedProject.buildPassport?.passportId || 'HFP-2026-9842A-77'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>VERIFIED COMMITS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                      {selectedProject.buildPassport?.verifiedCommits || 37}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>MERGED PULL REQUESTS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                      {selectedProject.buildPassport?.verifiedPRs || 2}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>VERIFIED DEPLOYMENTS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '2px' }}>
                      {selectedProject.buildPassport?.verifiedDeployments || 3}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <div>SHA-256 State Hash: <span style={{ color: 'var(--text-secondary)' }}>{selectedProject.buildPassport?.sha256}</span></div>
                  <div style={{ marginTop: '4px' }}>Merkle Tree Root: <span style={{ color: 'var(--text-secondary)' }}>{selectedProject.buildPassport?.merkleRoot}</span></div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 7. INTEGRITY: ONLY ORGANIZER-APPROVED INFORMATION         */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'INTEGRITY') && (
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <ShieldCheck size={18} color="var(--accent-violet)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>7. Integrity: Organizer-Approved Status</h3>
                </div>

                <div
                  style={{
                    background: selectedProject.organizerApprovedIntegrity?.approved
                      ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(14, 20, 28, 0.9))'
                      : 'linear-gradient(145deg, rgba(244, 63, 94, 0.08), rgba(14, 20, 28, 0.9))',
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedProject.organizerApprovedIntegrity?.approved
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(244, 63, 94, 0.4)',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <span
                      className={`badge ${selectedProject.organizerApprovedIntegrity?.approved ? 'badge-emerald' : 'badge-rose'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {selectedProject.organizerApprovedIntegrity?.reviewStatus || 'ORGANIZER REVIEW'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Reviewed By: <strong>{selectedProject.organizerApprovedIntegrity?.reviewedBy}</strong>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>
                    Audit Verdict:
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                    {selectedProject.organizerApprovedIntegrity?.auditVerdict}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <strong>Organizer Notes to Jury:</strong> {selectedProject.organizerApprovedIntegrity?.organizerNotes}
                  </div>
                </div>

                {/* Starter Code Compliance */}
                <div style={{ background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STARTER BOILERPLATE STATUS</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                      {selectedProject.organizerApprovedIntegrity?.starterCode?.name}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem' }}>
                    <span>Original Code: <strong style={{ color: 'var(--accent-emerald)' }}>{selectedProject.organizerApprovedIntegrity?.starterCode?.customCode}</strong></span>
                    <span>Boilerplate Retained: <strong style={{ color: 'var(--text-secondary)' }}>{selectedProject.organizerApprovedIntegrity?.starterCode?.retention}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STRUCTURED JUDGING CRITERIA (CONFIGURED BY ORGANIZER)    */}
            {/* ======================================================== */}
            {(activeTab === 'ALL' || activeTab === 'SCORING') && (
              <div
                className="card"
                style={{
                  padding: '24px',
                  border: '1px solid var(--accent-cyan)',
                  background: 'linear-gradient(145deg, #111823, #0d121a)',
                  boxShadow: '0 0 30px rgba(6,182,212,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Sliders size={20} color="var(--accent-cyan)" />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Structured Judging Criteria</h3>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Configured by HackForge Hackathon Organizer • Weighted 100% Evaluation Matrix
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      COMPOSITE WEIGHTED SCORE
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {calculateTotal(selectedProject.scores)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 10.0</span>
                    </div>
                  </div>
                </div>

                {/* Criteria Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginBottom: '24px' }}>
                  {criteria.map((criterion, idx) => {
                    const currentScore = selectedProject.scores?.[criterion.id] !== undefined
                      ? selectedProject.scores[criterion.id]
                      : 7.0;
                    const ratingBadge = getScoreBadge(currentScore);
                    const weightedPoints = (currentScore * criterion.weight).toFixed(2);

                    return (
                      <div
                        key={criterion.id}
                        style={{
                          background: 'var(--bg-surface)',
                          padding: '16px 18px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
                                {idx + 1}. {criterion.label}
                              </span>
                              <span
                                style={{
                                  background: 'rgba(6, 182, 212, 0.1)',
                                  border: '1px solid rgba(6, 182, 212, 0.3)',
                                  color: 'var(--accent-cyan)',
                                  fontSize: '0.68rem',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontWeight: 700
                                }}
                              >
                                Weight: {criterion.weightPercent}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '650px' }}>
                              {criterion.description}
                            </p>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.72rem', color: ratingBadge.color, fontWeight: 600 }}>
                                {ratingBadge.label}
                              </span>
                              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                                {parseFloat(currentScore).toFixed(1)}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                              Contribution: +{weightedPoints} pts
                            </div>
                          </div>
                        </div>

                        {/* Slider Bar */}
                        <div style={{ marginTop: '10px' }}>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={currentScore}
                            onChange={e => updateJudgeScore(selectedProject.id, criterion.id, e.target.value)}
                            style={{
                              width: '100%',
                              accentColor: 'var(--accent-cyan)',
                              cursor: 'pointer'
                            }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            <span>1.0 (Needs Work)</span>
                            <span>5.0 (Average)</span>
                            <span>7.5 (Solid)</span>
                            <span>10.0 (Flawless)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Judge Private Qualitative Notes */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bookmark size={14} color="var(--accent-cyan)" />
                      <span>Judge Private Qualitative Notes & Feedback</span>
                    </label>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Auto-saved to your jury station
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={selectedProject.notes || ''}
                    onChange={e => updateJudgeNotes(selectedProject.id, e.target.value)}
                    placeholder="Enter confidential evaluation remarks, technical highlights, questions for team demo Q&A, and deliberation notes..."
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      lineHeight: '1.5',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Action Buttons: Save Draft vs Official Lock */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '18px',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className={`badge ${
                        selectedProject.status === 'SCORED' ? 'badge-emerald' : selectedProject.status === 'DRAFT_SAVED' ? 'badge-amber' : 'badge-muted'
                      }`}
                    >
                      Status: {selectedProject.status === 'SCORED' ? 'SCORED & LOCKED' : selectedProject.status === 'DRAFT_SAVED' ? 'DRAFT SAVED' : 'PENDING EVALUATION'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Weighted Composite: <strong style={{ color: 'var(--accent-cyan)' }}>{calculateTotal(selectedProject.scores)} / 10.0</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => saveJudgeDraft(selectedProject.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Save size={14} />
                      <span>Save Draft</span>
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => submitJudgeReview(selectedProject.id)}
                      disabled={!selectedProject.hasPassport}
                      title={!selectedProject.hasPassport ? "Cannot submit official score while integrity audit is pending" : "Lock official scores to jury ledger"}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 0 16px rgba(16,185,129,0.3)',
                        opacity: !selectedProject.hasPassport ? 0.6 : 1,
                        cursor: !selectedProject.hasPassport ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>{selectedProject.status === 'SCORED' ? 'Update & Re-Lock Official Score' : 'Submit Official Score to Jury Ledger'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
