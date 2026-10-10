import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Users,
  Activity,
  GitCommit,
  GitBranch,
  Cpu,
  Zap,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Compass,
  Layers,
  FileCode,
  Terminal,
  FileText,
  Code2,
  Trash2,
  ArrowRight,
  Send,
  Sparkles,
  Flame,
  Globe,
  Radio,
  Check,
  X,
  Play
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';

// Rich Mock Teams across the hackathon cohort
const INITIAL_COHORT_TEAMS = [
  {
    id: "team-nexus",
    name: "Nexus Sentinel",
    avatar: "⚡",
    track: "Autonomous Agents",
    problemStatement: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
    solution: "A high-velocity off-chain state channel network backed by zero-knowledge receipts and an on-chain vault.",
    declaredFeatures: ["Authentication", "AI Prediction", "Real-time Alerts", "Mobile Application", "Escrow Settlement"],
    techStack: ["Next.js 14", "FastAPI", "Python", "TypeScript", "LangChain", "Docker", "Solidity"],
    members: [
      { name: "Alex Chen", role: "Team Leader", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { name: "Sophia Zhang", role: "Frontend", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
      { name: "Marcus Vance", role: "AI/ML", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Elena Rostova", role: "Smart Contracts", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "Final Submission & Passport",
    lastActivity: "4 mins ago",
    lastActivityTime: 4, // minutes ago
    commits: 37,
    diff: "+14,290 / -1,120",
    branches: 9,
    xp: 2450,
    progress: 88,
    status: "ACTIVE", // ACTIVE | INACTIVE | SUBMITTED | COMPLETED
    integrityStatus: "VERIFIED_ELIGIBLE",
    integrityScore: 97.4,
    hasGithub: true,
    hasSubmission: true,
    isFlagged: false,
    alertType: null,
    githubRepo: "https://github.com/hackforge-demo/nexus-sentinel",
    demoUrl: "https://nexus-sentinel.vercel.app",
    contractAddress: "0x892a01948303f29b4e12c140994a73710",
    passportId: "HFP-DEMO-2026-NEXUS",
    aiBlocker: "Resolved FastAPI CORS policy restriction on port 5173",
    aiRecommendation: "Shift 60% of focus to 3-minute pitch video polishing"
  },
  {
    id: "team-zerostate",
    name: "ZeroState Labs",
    avatar: "🛡️",
    track: "Zero-Knowledge Proofs",
    problemStatement: "Verifiable Zero-Knowledge LLM Guardrails",
    solution: "Cryptographic proof of LLM safety constraints without leaking private prompt data.",
    declaredFeatures: ["ZK Prover", "SNARK Verifier", "Prompt Masking", "Auditing Daemon"],
    techStack: ["Circom", "Noir", "Next.js", "Rust", "Foundry"],
    members: [
      { name: "Elena Rostova", role: "Team Leader", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" },
      { name: "Tariq Mansour", role: "Cryptography", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "Lukas Weber", role: "Systems", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "Deploy MVP to Testnet",
    lastActivity: "12 mins ago",
    lastActivityTime: 12,
    commits: 52,
    diff: "+18,400 / -820",
    branches: 12,
    xp: 3400,
    progress: 95,
    status: "COMPLETED",
    integrityStatus: "VERIFIED_ELIGIBLE",
    integrityScore: 94.0,
    hasGithub: true,
    hasSubmission: true,
    isFlagged: false,
    alertType: null,
    githubRepo: "https://github.com/zerostate/aegis-zk",
    demoUrl: "https://aegis-zk.vercel.app",
    contractAddress: "0x117a...b89",
    passportId: "HFP-2026-ZK771-02",
    aiBlocker: "Browser proving time optimization with WebAssembly",
    aiRecommendation: "Finalize jury presentation deck"
  },
  {
    id: "team-speedy",
    name: "SpeedyScript",
    avatar: "⚡",
    track: "Autonomous Agents",
    problemStatement: "Sub-millisecond Autonomous Flashloan Routing Engine",
    solution: "C++ matching engine with EVM flashloan atomic arbitrage contracts.",
    declaredFeatures: ["Matching Engine", "Flashloan Router", "Cross-DEX Arbitrage"],
    techStack: ["C++", "Solidity", "Python"],
    members: [
      { name: "Victor S.", role: "Team Leader", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
      { name: "Yuki Tanaka", role: "Smart Contracts", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "First Successful Build",
    lastActivity: "25 mins ago",
    lastActivityTime: 25,
    commits: 3,
    diff: "+24,800 / -0",
    branches: 1,
    xp: 800,
    progress: 35,
    status: "ACTIVE",
    integrityStatus: "HIGH_PRIORITY_REVIEW",
    integrityScore: 42.0,
    hasGithub: true,
    hasSubmission: false,
    isFlagged: true,
    alertType: "INTEGRITY_REVIEW",
    alertReason: "Monolithic commit dropped 24,800 lines of production C++ trading engine 18 minutes after registration.",
    githubRepo: "https://github.com/speedyscript/arb-engine",
    demoUrl: "",
    contractAddress: "",
    passportId: null,
    aiBlocker: "Code appeared in bulk without corresponding iterative development branches",
    aiRecommendation: "Request urgent code walkthrough with team leader"
  },
  {
    id: "team-solaris",
    name: "Solaris Mesh",
    avatar: "🌌",
    track: "DeFi Velocity",
    problemStatement: "Decentralized Liquidity Rebalancing Daemon",
    solution: "Automated intent solver with cross-rollup state verification.",
    declaredFeatures: ["Intent Solver", "State Verifier", "Client Dashboard"],
    techStack: ["Rust", "React", "Docker"],
    members: [
      { name: "Maya Lin", role: "Team Leader", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { name: "Arjun K.", role: "Backend", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "Complete Project Architecture",
    lastActivity: "14 hours ago",
    lastActivityTime: 840,
    commits: 4,
    diff: "+1,200 / -40",
    branches: 2,
    xp: 450,
    progress: 20,
    status: "INACTIVE",
    integrityStatus: "REVIEW_RECOMMENDED",
    integrityScore: 82.0,
    hasGithub: true,
    hasSubmission: false,
    isFlagged: true,
    alertType: "TEAM_INACTIVE",
    alertReason: "Zero commits or telemetry events logged in 14 hours. High risk of sprint abandonment.",
    githubRepo: "https://github.com/solaris-mesh/intent-solver",
    demoUrl: "",
    contractAddress: "",
    passportId: null,
    aiBlocker: "Workstream completely stalled after initial architecture drafting",
    aiRecommendation: "Dispatch mentor check-in via HackForge Discord"
  },
  {
    id: "team-drift",
    name: "CryptoDrift",
    avatar: "🏎️",
    track: "Autonomous Agents",
    problemStatement: "Autonomous Car Telemetry & On-Chain Insurance Claims",
    solution: "IoT vehicular hardware agent with automated claims payout.",
    declaredFeatures: ["IoT Connector", "Claim Smart Contract", "Mobile HUD"],
    techStack: ["Node.js", "Solidity", "React Native"],
    members: [
      { name: "Kunal V.", role: "Hardware", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Sarah Connor", role: "Smart Contracts", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "Initialize Repository",
    lastActivity: "1 hour ago",
    lastActivityTime: 60,
    commits: 0,
    diff: "0 / 0",
    branches: 0,
    xp: 150,
    progress: 10,
    status: "ACTIVE",
    integrityStatus: "MISSING_GITHUB",
    integrityScore: 50.0,
    hasGithub: false,
    hasSubmission: false,
    isFlagged: true,
    alertType: "MISSING_GITHUB",
    alertReason: "Team has not connected a verified GitHub repository or granted webhook permissions.",
    githubRepo: "",
    demoUrl: "",
    contractAddress: "",
    passportId: null,
    aiBlocker: "No telemetry connection established with GitHub OAuth gateway",
    aiRecommendation: "Prompt team leader to authorize repository"
  },
  {
    id: "team-aero",
    name: "AeroChain",
    avatar: "✈️",
    track: "DeFi Velocity",
    problemStatement: "Cross-Rollup Flight Delay Insurance",
    solution: "Sub-second oracle settlement triggered by aviation flight status feeds.",
    declaredFeatures: ["Oracle Feed", "Delay Escrow", "Claim Portal"],
    techStack: ["Next.js", "Solidity", "Chainlink"],
    members: [
      { name: "Liam O'Connor", role: "Team Leader", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { name: "Chloe Bennett", role: "Frontend", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "Deploy MVP",
    lastActivity: "45 mins ago",
    lastActivityTime: 45,
    commits: 19,
    diff: "+6,400 / -380",
    branches: 4,
    xp: 1650,
    progress: 60,
    status: "ACTIVE",
    integrityStatus: "SUBMISSION_INCOMPLETE",
    integrityScore: 88.0,
    hasGithub: true,
    hasSubmission: false,
    isFlagged: true,
    alertType: "SUBMISSION_INCOMPLETE",
    alertReason: "Code freeze in 4h 15m. Missing live deployed URL and pitch demo video.",
    githubRepo: "https://github.com/aerochain/aviation-oracle",
    demoUrl: "",
    contractAddress: "0x44a1...99e",
    passportId: null,
    aiBlocker: "Deployment pipeline failed due to missing environment secrets on Vercel",
    aiRecommendation: "Configure production secrets and record video demo"
  },
  {
    id: "team-orbital",
    name: "Orbital DeFi",
    avatar: "🪐",
    track: "DeFi Velocity",
    problemStatement: "Cross-Rollup Liquidity Rebalancing Daemon",
    solution: "Decentralized solver network for sub-second cross-rollup swaps.",
    declaredFeatures: ["Solver Network", "Atomic Swaps", "Visual HUD"],
    techStack: ["Next.js", "Rust", "Solidity"],
    members: [
      { name: "Mikhail P.", role: "Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Sara Lee", role: "Frontend", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "First API Integration",
    lastActivity: "8 mins ago",
    lastActivityTime: 8,
    commits: 31,
    diff: "+9,800 / -640",
    branches: 7,
    xp: 2200,
    progress: 75,
    status: "ACTIVE",
    integrityStatus: "VERIFIED_ELIGIBLE",
    integrityScore: 91.2,
    hasGithub: true,
    hasSubmission: true,
    isFlagged: false,
    alertType: null,
    githubRepo: "https://github.com/orbital-defi/cross-relay",
    demoUrl: "https://crossrelay.xyz",
    contractAddress: "0x77c2...104",
    passportId: "HFP-2026-ORB-41",
    aiBlocker: "Gas cost spike on Arbitrum Nitro sequencer testnet",
    aiRecommendation: "Batch swap payloads into state channel proofs"
  },
  {
    id: "team-neuralsync",
    name: "NeuralSync",
    avatar: "🧠",
    track: "Autonomous Agents",
    problemStatement: "Distributed Multi-Agent Consensus Protocol",
    solution: "P2P agent communication layer with cryptographically verifiable action logs.",
    declaredFeatures: ["Agent Mesh", "Action Signer", "Telemetry Dashboard"],
    techStack: ["Python", "FastAPI", "Next.js", "Docker"],
    members: [
      { name: "Devon Marcus", role: "AI Lead", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "Nina Patel", role: "Frontend", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" }
    ],
    currentQuest: "Deploy MVP",
    lastActivity: "18 mins ago",
    lastActivityTime: 18,
    commits: 44,
    diff: "+12,100 / -450",
    branches: 8,
    xp: 2950,
    progress: 88,
    status: "ACTIVE",
    integrityStatus: "VERIFIED_ELIGIBLE",
    integrityScore: 95.8,
    hasGithub: true,
    hasSubmission: true,
    isFlagged: false,
    alertType: null,
    githubRepo: "https://github.com/neuralsync/agentmesh",
    demoUrl: "https://agentmesh.dev",
    contractAddress: "",
    passportId: "HFP-2026-NS-99",
    aiBlocker: "None. All critical workstreams progressing smoothly",
    aiRecommendation: "Perform dry run of the 3-minute pitch video"
  }
];

export default function OrganizerControlCenter() {
  const { id } = useParams();
  const { hackathons, activeHackathon, showToast } = useHackForge();
  const hackathon = hackathons.find(h => h.id === id) || activeHackathon;

  // Primary mode: 'COMMAND_ROOM' vs 'CONFIGURATION'
  const [primaryMode, setPrimaryMode] = useState('COMMAND_ROOM'); // 'COMMAND_ROOM' | 'CONFIG'

  // Command Room States
  const [cohortTeams, setCohortTeams] = useState(INITIAL_COHORT_TEAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlertFilter, setActiveAlertFilter] = useState('ALL'); // 'ALL' | 'TEAM_INACTIVE' | 'INTEGRITY_REVIEW' | 'PROJECT_DEADLINE' | 'MISSING_GITHUB' | 'SUBMISSION_INCOMPLETE'
  const [selectedTeam, setSelectedTeam] = useState(null); // for 7-level drilldown modal
  const [drilldownLevel, setDrilldownLevel] = useState('OVERVIEW'); // 'OVERVIEW' | 'PROJECT' | 'GITHUB' | 'AI' | 'QUESTS' | 'INTEGRITY' | 'PASSPORT'

  // Configuration Form states
  const [rulesList, setRulesList] = useState(hackathon.rules || []);
  const [newRule, setNewRule] = useState('');
  const [startersList, setStartersList] = useState(hackathon.allowedStarters || []);
  const [newStarterName, setNewStarterName] = useState('');
  const [newStarterRepo, setNewStarterRepo] = useState('');

  // 1. Compute Core Required Metrics
  const metrics = useMemo(() => {
    const totalTeams = 196; // cohort scale
    const activeTeams = 172;
    const inactiveTeams = 24;
    const submissions = 88;
    const integrityReviews = 4;
    const completedProjects = 34;

    return {
      totalTeams,
      activeTeams,
      inactiveTeams,
      submissions,
      integrityReviews,
      completedProjects
    };
  }, []);

  // Filtered Teams based on Search and Alert Pills
  const filteredTeams = useMemo(() => {
    return cohortTeams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.track.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.problemStatement.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeAlertFilter === 'ALL') return true;
      if (activeAlertFilter === 'TEAM_INACTIVE') return team.alertType === 'TEAM_INACTIVE' || team.status === 'INACTIVE';
      if (activeAlertFilter === 'INTEGRITY_REVIEW') return team.alertType === 'INTEGRITY_REVIEW';
      if (activeAlertFilter === 'PROJECT_DEADLINE') return !team.hasSubmission;
      if (activeAlertFilter === 'MISSING_GITHUB') return !team.hasGithub || team.alertType === 'MISSING_GITHUB';
      if (activeAlertFilter === 'SUBMISSION_INCOMPLETE') return team.alertType === 'SUBMISSION_INCOMPLETE' || (!team.demoUrl && team.status !== 'INACTIVE');

      return true;
    });
  }, [cohortTeams, searchQuery, activeAlertFilter]);

  // Handle drilldown open
  const handleOpenDrilldown = (team, level = 'OVERVIEW') => {
    setSelectedTeam(team);
    setDrilldownLevel(level);
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.trim()) return;
    setRulesList(prev => [...prev, newRule]);
    setNewRule('');
    showToast("Competition rule updated and broadcast to all squads!", "default");
  };

  const handleAddStarter = (e) => {
    e.preventDefault();
    if (!newStarterName || !newStarterRepo) return;
    setStartersList(prev => [...prev, { name: newStarterName, repo: newStarterRepo, verified: true }]);
    setNewStarterName('');
    setNewStarterRepo('');
    showToast("Starter boilerplate whitelisted for Sentinel scanning.", "default");
  };

  return (
    <div className="workspace-layout">
      <Sidebar mode="organizer" />

      <main className="workspace-main">
        {/* Top Header & Tactical Status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Radio size={13} className="spin-anim" /> HACKFORGE COMMAND CENTER
              </span>
              <span className="badge badge-emerald">
                LIVE SPRINT • 4H 15M TO CODE FREEZE
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              {hackathon.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '820px', margin: 0 }}>
              Mission Control: Live cohort telemetry, active team pipelines, integrity alerts, and forensic drilldown.
            </p>
          </div>

          {/* Primary View Switcher */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <button
              onClick={() => setPrimaryMode('COMMAND_ROOM')}
              className={`hud-tab ${primaryMode === 'COMMAND_ROOM' ? 'active' : ''}`}
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Radio size={15} />
              <span>Command Room</span>
            </button>
            <button
              onClick={() => setPrimaryMode('CONFIG')}
              className={`hud-tab ${primaryMode === 'CONFIG' ? 'active' : ''}`}
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <FileText size={15} />
              <span>Rules & Starters</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODE 1: COMMAND ROOM (LIVE TELEMETRY & TEAMS)                  */}
        {/* ============================================================== */}
        {primaryMode === 'COMMAND_ROOM' && (
          <>
            {/* 1. THE 6 REQUIRED ORGANIZER METRICS STRIP */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              {/* Total Teams */}
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
                <div className="stat-card-header">
                  <span className="stat-card-title">TOTAL TEAMS</span>
                  <Users size={16} color="var(--accent-cyan)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.totalTeams}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Registered across 4 problem tracks
                </div>
              </div>

              {/* Active Teams */}
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
                <div className="stat-card-header">
                  <span className="stat-card-title">ACTIVE TEAMS</span>
                  <Activity size={16} color="var(--accent-emerald)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.activeTeams}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Committed in last 6 hours
                </div>
              </div>

              {/* Inactive Teams */}
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
                <div className="stat-card-header">
                  <span className="stat-card-title">INACTIVE TEAMS</span>
                  <Clock size={16} color="var(--accent-amber)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.inactiveTeams}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  No commits for &gt;12h
                </div>
              </div>

              {/* Submissions */}
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
                <div className="stat-card-header">
                  <span className="stat-card-title">SUBMISSIONS</span>
                  <Send size={16} color="var(--accent-violet)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.submissions}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  45% cohort submitted
                </div>
              </div>

              {/* Integrity Reviews */}
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
                <div className="stat-card-header">
                  <span className="stat-card-title">INTEGRITY REVIEWS</span>
                  <ShieldAlert size={16} color="var(--accent-rose)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.integrityReviews}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Flagged for jury evaluation
                </div>
              </div>

              {/* Completed Projects */}
              <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
                <div className="stat-card-header">
                  <span className="stat-card-title">COMPLETED PROJECTS</span>
                  <Award size={16} color="var(--accent-emerald)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {metrics.completedProjects}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Sealed Build Passports ready
                </div>
              </div>
            </div>

            {/* 2. THE 5 REQUIRED ORGANIZER ALERTS PANEL */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="var(--accent-amber)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                    Active Organizer Incident Alerts & Interventions
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Click an alert to filter cohort teams
                </span>
              </div>

              {/* 5 Alert Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
                {/* Alert 1: TEAM INACTIVE */}
                <div
                  onClick={() => setActiveAlertFilter(activeAlertFilter === 'TEAM_INACTIVE' ? 'ALL' : 'TEAM_INACTIVE')}
                  style={{
                    background: activeAlertFilter === 'TEAM_INACTIVE' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                      ⚠ TEAM INACTIVE
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>24 SQUADS</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Squads with zero commits in &gt;12h at risk of abandonment.
                  </div>
                </div>

                {/* Alert 2: INTEGRITY REVIEW */}
                <div
                  onClick={() => setActiveAlertFilter(activeAlertFilter === 'INTEGRITY_REVIEW' ? 'ALL' : 'INTEGRITY_REVIEW')}
                  style={{
                    background: activeAlertFilter === 'INTEGRITY_REVIEW' ? 'rgba(244, 63, 94, 0.18)' : 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                      ⚠ INTEGRITY REVIEW
                    </span>
                    <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>4 FLAGGED</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Massive code dumps or pre-hackathon timestamps flagged.
                  </div>
                </div>

                {/* Alert 3: PROJECT DEADLINE */}
                <div
                  onClick={() => setActiveAlertFilter(activeAlertFilter === 'PROJECT_DEADLINE' ? 'ALL' : 'PROJECT_DEADLINE')}
                  style={{
                    background: activeAlertFilter === 'PROJECT_DEADLINE' ? 'rgba(168, 85, 247, 0.18)' : 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-violet)' }}>
                      ⚠ PROJECT DEADLINE
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>4H 15M LEFT</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    108 squads have not yet sealed their Build Passport.
                  </div>
                </div>

                {/* Alert 4: MISSING GITHUB */}
                <div
                  onClick={() => setActiveAlertFilter(activeAlertFilter === 'MISSING_GITHUB' ? 'ALL' : 'MISSING_GITHUB')}
                  style={{
                    background: activeAlertFilter === 'MISSING_GITHUB' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(6, 182, 212, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      ⚠ MISSING GITHUB
                    </span>
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>8 SQUADS</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Teams with no GitHub webhook or unlinked repository.
                  </div>
                </div>

                {/* Alert 5: SUBMISSION INCOMPLETE */}
                <div
                  onClick={() => setActiveAlertFilter(activeAlertFilter === 'SUBMISSION_INCOMPLETE' ? 'ALL' : 'SUBMISSION_INCOMPLETE')}
                  style={{
                    background: activeAlertFilter === 'SUBMISSION_INCOMPLETE' ? 'rgba(234, 179, 8, 0.18)' : 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                      ⚠ INCOMPLETE SUBMISSION
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>32 SQUADS</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Active builders missing pitch video or public deploy URL.
                  </div>
                </div>
              </div>
            </div>

            {/* 3. USEFUL ORGANIZER CHARTS (Answers Real Questions) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              {/* Chart 1: Sprint Funnel Velocity */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
                    Sprint Progression Funnel
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    Are teams on track?
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Stage 1: Genesis Scaffolds</span>
                      <strong style={{ color: 'var(--text-primary)' }}>196 / 196 (100%)</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--accent-cyan)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Stage 2: Core MVP & Health Check</span>
                      <strong style={{ color: 'var(--text-primary)' }}>142 / 196 (72%)</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '72%', height: '100%', background: 'var(--accent-emerald)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Stage 3: Integration & Testing</span>
                      <strong style={{ color: 'var(--text-primary)' }}>98 / 196 (50%)</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '50%', height: '100%', background: 'var(--accent-violet)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Stage 4: Verified Deployments</span>
                      <strong style={{ color: 'var(--text-primary)' }}>64 / 196 (33%)</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '33%', height: '100%', background: 'var(--accent-amber)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Stage 5: Sealed Build Passports</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>34 / 196 (17%)</strong>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '17%', height: '100%', background: 'var(--accent-emerald)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 2: Bottleneck Radar */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>
                    Blocker & Bottleneck Distribution
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                    Where are teams stuck?
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>CORS & API Microservice Connection</span>
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>42% OF ISSUES</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>Sepolia Testnet Gas & Contract Verifier</span>
                    <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>28% OF ISSUES</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>LangChain Agent Timeout & Latency</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>18% OF ISSUES</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>Pitch Video Encoding & Loom Auth</span>
                    <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>12% OF ISSUES</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. LIVE TEAM ACTIVITY TABLE */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--accent-cyan)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                      Live Team Activity Stream
                    </h2>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Real-time monitoring across all squad members, quests, git diffs, and forensic integrity
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search squad, track, or project..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '32px', fontSize: '0.8rem', width: '240px' }}
                    />
                  </div>

                  {activeAlertFilter !== 'ALL' && (
                    <button
                      onClick={() => setActiveAlertFilter('ALL')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Clear Filter ({activeAlertFilter})
                    </button>
                  )}
                </div>
              </div>

              {/* Table of Live Teams */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>Team & Track</th>
                      <th style={{ padding: '12px 14px' }}>Members</th>
                      <th style={{ padding: '12px 14px' }}>Current Quest</th>
                      <th style={{ padding: '12px 14px' }}>Last Activity</th>
                      <th style={{ padding: '12px 14px' }}>GitHub Activity</th>
                      <th style={{ padding: '12px 14px' }}>XP</th>
                      <th style={{ padding: '12px 14px' }}>Progress</th>
                      <th style={{ padding: '12px 14px' }}>Integrity Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeams.map((team) => (
                      <tr
                        key={team.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          background: team.isFlagged ? 'rgba(244, 63, 94, 0.04)' : 'transparent',
                          transition: 'background var(--transition-fast)'
                        }}
                      >
                        {/* Team Name */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>{team.avatar}</span>
                            <div>
                              <div
                                onClick={() => handleOpenDrilldown(team)}
                                style={{ fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer' }}
                                className="interactive-hover-cyan"
                              >
                                {team.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {team.track}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Members with avatars */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {team.members.map((m, idx) => (
                              <img
                                key={idx}
                                src={m.avatar}
                                alt={m.name}
                                title={`${m.name} (${m.role})`}
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  border: '2px solid var(--bg-card)',
                                  marginLeft: idx > 0 ? '-8px' : '0',
                                  objectFit: 'cover'
                                }}
                              />
                            ))}
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                              ({team.members.length})
                            </span>
                          </div>
                        </td>

                        {/* Current Quest */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                            {team.currentQuest}
                          </div>
                        </td>

                        {/* Last Activity */}
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: team.lastActivityTime > 720 ? 'var(--accent-amber)' : 'var(--text-secondary)'
                          }}>
                            {team.lastActivity}
                          </span>
                        </td>

                        {/* GitHub Activity */}
                        <td style={{ padding: '14px' }}>
                          {team.hasGithub ? (
                            <div>
                              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                                <GitCommit size={11} style={{ display: 'inline', marginRight: '4px' }} />
                                {team.commits} commits ({team.branches} branches)
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {team.diff}
                              </div>
                            </div>
                          ) : (
                            <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                              NO GITHUB
                            </span>
                          )}
                        </td>

                        {/* XP */}
                        <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                          <Zap size={12} fill="currentColor" style={{ display: 'inline', marginRight: '2px' }} />
                          {team.xp.toLocaleString()} XP
                        </td>

                        {/* Progress */}
                        <td style={{ padding: '14px' }}>
                          <div style={{ width: '90px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                              <span>{team.progress}%</span>
                            </div>
                            <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${team.progress}%`,
                                height: '100%',
                                background: team.progress > 80 ? 'var(--accent-emerald)' : team.progress > 40 ? 'var(--accent-cyan)' : 'var(--accent-amber)'
                              }} />
                            </div>
                          </div>
                        </td>

                        {/* Integrity Status */}
                        <td style={{ padding: '14px' }}>
                          {team.integrityStatus === 'VERIFIED_ELIGIBLE' && (
                            <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                              <ShieldCheck size={11} /> Clean {team.integrityScore}%
                            </span>
                          )}
                          {team.integrityStatus === 'HIGH_PRIORITY_REVIEW' && (
                            <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                              <ShieldAlert size={11} /> Flagged
                            </span>
                          )}
                          {team.integrityStatus === 'REVIEW_RECOMMENDED' && (
                            <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                              <AlertTriangle size={11} /> Review
                            </span>
                          )}
                          {team.integrityStatus === 'MISSING_GITHUB' && (
                            <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                              <XCircle size={11} /> Missing Repo
                            </span>
                          )}
                          {team.integrityStatus === 'SUBMISSION_INCOMPLETE' && (
                            <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                              <Clock size={11} /> Missing Artifacts
                            </span>
                          )}
                        </td>

                        {/* Action: Open Drilldown */}
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenDrilldown(team)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} /> Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 5. SEVEN-LEVEL DRILLDOWN MODAL / INSPECTION STATION            */}
            {/* TEAM OVERVIEW -> PROJECT -> GITHUB -> AI -> QUESTS -> INTEGRITY -> PASSPORT */}
            {/* ============================================================== */}
            {selectedTeam && (
              <div className="modal-backdrop">
                <div className="modal-content" style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto' }}>
                  
                  {/* Modal Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '2rem' }}>{selectedTeam.avatar}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                            {selectedTeam.name}
                          </h2>
                          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                            {selectedTeam.track}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Squad ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedTeam.id}</span> • {selectedTeam.xp} XP • {selectedTeam.progress}% Completed
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '1rem', padding: '4px 8px' }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* 7-Level Step Indicator Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'var(--bg-surface)',
                    padding: '6px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '20px',
                    overflowX: 'auto'
                  }}>
                    {[
                      { id: 'OVERVIEW', label: '1. Team' },
                      { id: 'PROJECT', label: '2. Project' },
                      { id: 'GITHUB', label: '3. GitHub' },
                      { id: 'AI', label: '4. AI Insights' },
                      { id: 'QUESTS', label: '5. Quests' },
                      { id: 'INTEGRITY', label: '6. Integrity' },
                      { id: 'PASSPORT', label: '7. Passport' }
                    ].map((step) => (
                      <button
                        key={step.id}
                        onClick={() => setDrilldownLevel(step.id)}
                        className={`hud-tab ${drilldownLevel === step.id ? 'active' : ''}`}
                        style={{ fontSize: '0.75rem', padding: '5px 10px', flex: '1', textAlign: 'center', justifyContent: 'center' }}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>

                  {/* LEVEL 1: TEAM OVERVIEW */}
                  {drilldownLevel === 'OVERVIEW' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                        Squad Builders & Role Distribution
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                        {selectedTeam.members.map((m, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={m.avatar} alt={m.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{m.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>{m.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <strong>Current Status:</strong> {selectedTeam.status} • Last Active: {selectedTeam.lastActivity}
                      </div>
                    </div>
                  )}

                  {/* LEVEL 2: PROJECT SPECIFICATION */}
                  {drilldownLevel === 'PROJECT' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                        Declared Problem & Proposed Architecture
                      </h3>
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Problem Statement</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '4px 0 12px 0' }}>{selectedTeam.problemStatement}</p>
                        
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Proposed Solution</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 12px 0' }}>{selectedTeam.solution}</p>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>Declared Features</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {selectedTeam.declaredFeatures.map((f, i) => (
                            <span key={i} className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 3: GITHUB ACTIVITY */}
                  {drilldownLevel === 'GITHUB' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                        GitHub Telemetry & Commit Lineage
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOTAL COMMITS</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{selectedTeam.commits}</div>
                        </div>
                        <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BRANCHES MERGED</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{selectedTeam.branches}</div>
                        </div>
                        <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LINES CHANGED</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTeam.diff}</div>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                        <div>Remote: <a href={selectedTeam.githubRepo} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>{selectedTeam.githubRepo || 'No repo attached'}</a></div>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 4: AI INSIGHTS */}
                  {drilldownLevel === 'AI' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} /> AI Team Copilot Synthesis
                      </h3>
                      <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-violet)', marginBottom: '4px' }}>BLOCKER AUDIT</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{selectedTeam.aiBlocker}</div>
                      </div>
                      <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>NEXT HIGHEST-VALUE ACTION</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{selectedTeam.aiRecommendation}</div>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 5: QUESTS */}
                  {drilldownLevel === 'QUESTS' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                        Quest Board & Milestone Checkmarks
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Completed: <strong>{selectedTeam.progress}%</strong> of verified milestone criteria.
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['Initialize Repository', 'Complete Project Architecture', 'First Working API', 'First AI Model', 'Deploy MVP to Testnet', 'Final Submission'].map((q, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: idx < 4 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                              {idx < 4 ? '✓ ' : '⏳ '} {q}
                            </span>
                            <span className={idx < 4 ? 'badge badge-emerald' : 'badge badge-muted'} style={{ fontSize: '0.65rem' }}>
                              {idx < 4 ? 'CLAIMED' : 'PENDING'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LEVEL 6: INTEGRITY */}
                  {drilldownLevel === 'INTEGRITY' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-emerald)' }}>
                        Integrity Sentinel Forensic Audit
                      </h3>
                      <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Forensic Cleanliness Score</span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedTeam.integrityScore > 80 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                            {selectedTeam.integrityScore}%
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                          Status: <strong>{selectedTeam.integrityStatus}</strong>
                        </p>
                      </div>
                      {selectedTeam.isFlagged && (
                        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.8rem' }}>
                          <strong>Flagged Note:</strong> {selectedTeam.alertReason}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEVEL 7: BUILD PASSPORT */}
                  {drilldownLevel === 'PASSPORT' && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                        Cryptographic Build Passport Credential
                      </h3>
                      {selectedTeam.passportId ? (
                        <div style={{ background: '#0a0d16', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                              SERIAL: {selectedTeam.passportId}
                            </span>
                            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>COUNTERSIGNED</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Verified Live App: <a href={selectedTeam.demoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>{selectedTeam.demoUrl}</a>
                          </div>
                          <Link to="/verify/HFP-2026-9842A-77" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', marginTop: '6px' }}>
                            Open Public Proof-of-Work Certificate
                          </Link>
                        </div>
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Build Passport not yet sealed by team.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Modal Footer Next / Back Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <button
                      onClick={() => {
                        const levels = ['OVERVIEW', 'PROJECT', 'GITHUB', 'AI', 'QUESTS', 'INTEGRITY', 'PASSPORT'];
                        const currIdx = levels.indexOf(drilldownLevel);
                        if (currIdx > 0) setDrilldownLevel(levels[currIdx - 1]);
                      }}
                      disabled={drilldownLevel === 'OVERVIEW'}
                      className="btn btn-secondary btn-sm"
                    >
                      ← Previous Level
                    </button>

                    <button
                      onClick={() => {
                        const levels = ['OVERVIEW', 'PROJECT', 'GITHUB', 'AI', 'QUESTS', 'INTEGRITY', 'PASSPORT'];
                        const currIdx = levels.indexOf(drilldownLevel);
                        if (currIdx < levels.length - 1) setDrilldownLevel(levels[currIdx + 1]);
                      }}
                      disabled={drilldownLevel === 'PASSPORT'}
                      className="btn btn-primary btn-sm"
                    >
                      Next Level →
                    </button>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* MODE 2: RULES & BOILERPLATE CONFIGURATION                      */}
        {/* ============================================================== */}
        {primaryMode === 'CONFIG' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Rules Management Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>
                Competition Rules & Guardrails
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {rulesList.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                    <span>{r}</span>
                    <button
                      onClick={() => setRulesList(prev => prev.filter((_, idx) => idx !== i))}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--accent-rose)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddRule} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Define a new hackathon rule (e.g. Code written before sprint start is disqualified)..."
                  value={newRule}
                  onChange={e => setNewRule(e.target.value)}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Add Rule</button>
              </form>
            </div>

            {/* Allowed Starters Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>
                Whitelisted Starter Boilerplates
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {startersList.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
                    <div>
                      <strong>{s.name}</strong> • <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{s.repo}</span>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>WHITELISTED</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddStarter} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Starter Name (e.g. next-viem-starter)"
                  value={newStarterName}
                  onChange={e => setNewStarterName(e.target.value)}
                  className="input-field"
                  style={{ width: '220px' }}
                />
                <input
                  type="text"
                  placeholder="GitHub Repo (e.g. github.com/hackforge-templates/next-viem-starter)"
                  value={newStarterRepo}
                  onChange={e => setNewStarterRepo(e.target.value)}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Whitelist Repo</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
