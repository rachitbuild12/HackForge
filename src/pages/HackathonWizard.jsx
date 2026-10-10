import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Code2,
  FileText,
  Upload,
  Layers,
  Sliders,
  Eye,
  Rocket,
  Check,
  Globe,
  MapPin,
  Users,
  Cpu,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

// Curated high-res banner presets
const BANNER_PRESETS = [
  {
    id: 'ai-neon',
    name: 'Cyber AI & Agents',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'neural-dark',
    name: 'Autonomous Neural Net',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'cyber-sentinel',
    name: 'Zero-Trust Cyber Sentinel',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'quantum-grid',
    name: 'Quantum Blockchain & Mesh',
    url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'green-tech',
    name: 'Clean Tech & Future Cities',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cbdaf?w=1200&auto=format&fit=crop&q=80'
  }
];

// Sample pre-fills for non-technical organizers
const SAMPLE_PRESETS = {
  aiHackathon: {
    title: 'Autonomous AI Agents World Cup 2026',
    tagline: 'Build collaborative multi-agent swarms with verifiable on-chain autonomy',
    description: 'A 72-hour global builder sprint challenging engineers, designers, and researchers to create autonomous AI agents capable of coordinating, executing complex workflows, and maintaining integrity guardrails.',
    banner: BANNER_PRESETS[0].url,
    startsAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 16),
    format: 'Virtual / Online',
    location: 'Global Online (Discord + HackForge)',
    maxTeamSize: 4,
    prizePool: '$75,000',
    organizer: 'AI Autonomy Foundation',
    allowedTechnologies: ['Python', 'TypeScript', 'React', 'FastAPI', 'LangChain', 'Docker', 'PyTorch', 'Rust'],
    aiPolicy: 'Full AI Allowed',
    customAiPolicy: '',
    repositoryRequirements: [
      'Repository must be public on GitHub',
      'All team members must have commit history',
      'Clean branch and PR workflows recommended',
      'Build Passport generated before code freeze'
    ],
    starterCodePolicy: 'Declared & Whitelisted Only',
    submissionRequirements: [
      'Public GitHub repository with comprehensive README',
      'Live deployed web demo / video walkthrough (under 3 mins)',
      'Verified HackForge Build Passport with originality audit',
      'Architecture diagram & system prompt documentation'
    ],
    problemStatements: [
      {
        id: 'ps-demo-1',
        title: 'Verifiable Multi-Agent Negotiation Protocol',
        category: 'AI & Machine Learning',
        difficulty: 'Advanced',
        skillsRequired: ['Python', 'FastAPI', 'LangChain', 'Multi-Agent Systems'],
        expectedOutcome: 'A working system where at least 3 autonomous agents negotiate resource allocation or tasks deterministically without human intervention.',
        evaluationCriteria: 'Originality (30%), Multi-Agent Coordination (30%), System Stability (20%), UX / Dashboard (20%)',
        recommendedTech: 'FastAPI, LangGraph / AutoGen, WebSocket, React',
        starterRepo: 'github.com/hackforge-templates/agent-scaffold',
        bounty: '$30,000',
        description: 'Design and deploy an asynchronous messaging and verification framework where AI agents can negotiate contracts, exchange structured JSON schemas, and reach cryptographic consensus.'
      },
      {
        id: 'ps-demo-2',
        title: 'Autonomous Code Review & Refactoring Sentinel',
        category: 'Developer Tools',
        difficulty: 'Intermediate',
        skillsRequired: ['TypeScript', 'Node.js', 'LLM Tool Calling', 'Git Hooks'],
        expectedOutcome: 'A GitHub Action or bot that scans PR diffs, provides architectural suggestions, and verifies test coverage automatically.',
        evaluationCriteria: 'Developer Experience (35%), Accuracy of Recommendations (35%), Integration Simplicity (30%)',
        recommendedTech: 'GitHub REST API, TypeScript, OpenAI / Anthropic SDK',
        starterRepo: 'github.com/hackforge-templates/github-action-starter',
        bounty: '$25,000',
        description: 'Build an autonomous GitHub copilot bot that detects security flaws, antipatterns, and performance bottlenecks in real-time PR review queues.'
      },
      {
        id: 'ps-demo-3',
        title: 'Adaptive Human-Agent Collaborative Workspace',
        category: 'Open Innovation',
        difficulty: 'Beginner',
        skillsRequired: ['React', 'Tailwind', 'WebSockets', 'Next.js'],
        expectedOutcome: 'An intuitive web cockpit displaying real-time agent thoughts, action history, and human-in-the-loop approval triggers.',
        evaluationCriteria: 'User Interface Elegance (40%), Real-Time Telemetry (30%), Documentation (30%)',
        recommendedTech: 'Next.js 14, Tailwind CSS, Lucide Icons',
        starterRepo: 'github.com/hackforge-templates/next-viem-starter',
        bounty: '$20,000',
        description: 'Design a sleek visual dashboard where non-technical operators can monitor autonomous agent memory trees, pause execution, and inject guidance.'
      }
    ],
    integrityConfig: {
      githubMandatory: true,
      allowedStarters: [
        { name: 'HackForge Agent Scaffold', repo: 'github.com/hackforge-templates/agent-scaffold', verified: true },
        { name: 'Next.js 14 Modern Web Starter', repo: 'github.com/hackforge-templates/next-viem-starter', verified: true }
      ],
      baselineSnapshotType: 'KICKOFF',
      customSnapshotTime: '',
      flagPreExistingCode: true,
      integrityThreshold: 80,
      aiDisclosureRequired: true
    }
  }
};

export default function HackathonWizard() {
  const navigate = useNavigate();
  const { createHackathon, user, showToast } = useHackForge();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedHackathon, setPublishedHackathon] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    banner: BANNER_PRESETS[0].url,
    startsAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 16),
    format: 'Virtual / Online',
    location: 'Global Online',
    maxTeamSize: 4,
    prizePool: '$50,000',
    organizer: user?.name || 'Hackathon Host',

    // Step 2: Rules
    allowedTechnologies: ['React', 'Python', 'TypeScript', 'Node.js'],
    aiPolicy: 'Full AI Allowed',
    customAiPolicy: '',
    repositoryRequirements: [
      'Repository must be public on GitHub',
      'All team members must push commits regularly',
      'Must generate HackForge Build Passport before deadline'
    ],
    starterCodePolicy: 'Declared & Whitelisted Only',
    submissionRequirements: [
      'Public GitHub repository with README',
      'Working demo link or video recording (max 3 min)',
      'HackForge Build Passport audit certificate'
    ],

    // Step 3: Problem Statements
    problemStatements: [
      {
        id: 'ps-initial-1',
        title: 'Open Innovation Challenge',
        category: 'Open Innovation',
        difficulty: 'Intermediate',
        skillsRequired: ['Full-Stack', 'APIs', 'Design'],
        expectedOutcome: 'A functional, end-to-end prototype addressing real-world problem sets.',
        evaluationCriteria: 'Innovation (30%), Technical Execution (30%), UX (20%), Impact (20%)',
        recommendedTech: 'React, Node.js or Python',
        starterRepo: '',
        bounty: '$25,000',
        description: 'Build an innovative web application or tool that creates measurable value for end users or developers.'
      }
    ],

    // Step 4: Integrity
    integrityConfig: {
      githubMandatory: true,
      allowedStarters: [
        { name: 'HackForge Default Starter', repo: 'github.com/hackforge-templates/next-viem-starter', verified: true }
      ],
      baselineSnapshotType: 'KICKOFF',
      customSnapshotTime: '',
      flagPreExistingCode: true,
      integrityThreshold: 80,
      aiDisclosureRequired: true
    }
  });

  // Local helper states for dynamic inputs
  const [newTechInput, setNewTechInput] = useState('');
  const [newRepoReqInput, setNewRepoReqInput] = useState('');
  const [newSubReqInput, setNewSubReqInput] = useState('');
  const [newStarterName, setNewStarterName] = useState('');
  const [newStarterUrl, setNewStarterUrl] = useState('');
  const [activePsIndex, setActivePsIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Quick fill helper for non-technical organizers
  const handleLoadPreset = () => {
    setFormData(SAMPLE_PRESETS.aiHackathon);
    setValidationErrors({});
    showToast("✨ Pre-filled with 'Autonomous AI Agents World Cup' demo template!", "default");
  };

  // Validation function
  const validateStep = (stepNumber) => {
    const errors = {};

    if (stepNumber === 1 || stepNumber === 5) {
      if (!formData.title.trim()) errors.title = "Hackathon Name is required.";
      if (!formData.description.trim()) errors.description = "A short description is required.";
      if (!formData.startsAt) errors.startsAt = "Start date & time is required.";
      if (!formData.endsAt) errors.endsAt = "End date & time is required.";
      if (formData.startsAt && formData.endsAt && new Date(formData.endsAt) <= new Date(formData.startsAt)) {
        errors.endsAt = "End date must be after the start date.";
      }
      if (!formData.prizePool.trim()) errors.prizePool = "Prize pool is required.";
    }

    if (stepNumber === 2 || stepNumber === 5) {
      if (formData.aiPolicy === 'Custom Policy' && !formData.customAiPolicy?.trim()) {
        errors.customAiPolicy = "Please specify the custom AI policy details.";
      }
      if (formData.submissionRequirements.length === 0) {
        errors.submissionRequirements = "Please specify at least one submission requirement.";
      }
    }

    if (stepNumber === 3 || stepNumber === 5) {
      if (!formData.problemStatements || formData.problemStatements.length === 0) {
        errors.problemStatements = "At least one problem statement or track is required.";
      } else {
        formData.problemStatements.forEach((ps, idx) => {
          if (!ps.title?.trim()) errors[`ps_${idx}_title`] = `Problem Statement #${idx + 1} must have a title.`;
          if (!ps.description?.trim()) errors[`ps_${idx}_desc`] = `Problem Statement #${idx + 1} must have a description.`;
        });
      }
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("Please review the highlighted fields before proceeding.", "default");
      return;
    }
    setValidationErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Helpers
  const addTechTag = (tech) => {
    const trimmed = tech.trim();
    if (trimmed && !formData.allowedTechnologies.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        allowedTechnologies: [...prev.allowedTechnologies, trimmed]
      }));
    }
    setNewTechInput('');
  };

  const removeTechTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      allowedTechnologies: prev.allowedTechnologies.filter(t => t !== tag)
    }));
  };

  // Step 3 Problem Statements Helpers
  const addNewProblemStatement = () => {
    const newPs = {
      id: `ps-${Date.now()}`,
      title: 'New Track Challenge',
      category: 'AI & Machine Learning',
      difficulty: 'Intermediate',
      skillsRequired: ['JavaScript', 'Python'],
      expectedOutcome: 'Functional working prototype with code and demonstration.',
      evaluationCriteria: 'Innovation (30%), Technical Depth (30%), Practical Impact (40%)',
      recommendedTech: 'Modern web stack',
      starterRepo: '',
      bounty: '$15,000',
      description: 'Describe the challenge, user persona, and target problem to be solved.'
    };
    setFormData(prev => ({
      ...prev,
      problemStatements: [...prev.problemStatements, newPs]
    }));
    setActivePsIndex(formData.problemStatements.length);
    showToast("Added new problem statement challenge", "default");
  };

  const removeProblemStatement = (index) => {
    if (formData.problemStatements.length <= 1) {
      showToast("A hackathon needs at least one problem statement.", "default");
      return;
    }
    setFormData(prev => ({
      ...prev,
      problemStatements: prev.problemStatements.filter((_, i) => i !== index)
    }));
    setActivePsIndex(0);
  };

  const updateActivePs = (field, value) => {
    setFormData(prev => {
      const updated = [...prev.problemStatements];
      updated[activePsIndex] = {
        ...updated[activePsIndex],
        [field]: value
      };
      return { ...prev, problemStatements: updated };
    });
  };

  // Step 4 Starter Whitelist Helpers
  const addStarterRepo = (e) => {
    e.preventDefault();
    if (!newStarterName.trim() || !newStarterUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      integrityConfig: {
        ...prev.integrityConfig,
        allowedStarters: [
          ...prev.integrityConfig.allowedStarters,
          { name: newStarterName.trim(), repo: newStarterUrl.trim(), verified: true }
        ]
      }
    }));
    setNewStarterName('');
    setNewStarterUrl('');
    showToast("Added starter boilerplate to Sentinel whitelist.", "default");
  };

  const removeStarterRepo = (idx) => {
    setFormData(prev => ({
      ...prev,
      integrityConfig: {
        ...prev.integrityConfig,
        allowedStarters: prev.integrityConfig.allowedStarters.filter((_, i) => i !== idx)
      }
    }));
  };

  // Final Publish Action
  const handlePublish = () => {
    const allErrors = validateStep(5);
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      showToast("Cannot publish: please resolve the required items.", "default");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const created = createHackathon(formData);
      setIsSubmitting(false);
      setPublishedHackathon(created);
    }, 900);
  };

  // Calculate duration display
  const getDurationText = () => {
    if (!formData.startsAt || !formData.endsAt) return null;
    const start = new Date(formData.startsAt);
    const end = new Date(formData.endsAt);
    const diffHours = Math.round((end - start) / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Invalid timeframe';
    if (diffHours < 24) return `${diffHours} hours`;
    const days = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;
    return `${diffHours} hours (${days} day${days > 1 ? 's' : ''}${remHours > 0 ? ` ${remHours}h` : ''})`;
  };

  const durationStr = getDurationText();

  // If hackathon was successfully published, show interactive celebration modal
  if (publishedHackathon) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '840px', padding: '60px 24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 36px', border: '1px solid var(--accent-emerald)', boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--accent-emerald-dim)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid var(--accent-emerald)' }}>
            <Rocket size={36} />
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>
            HACKATHON DEPLOYED & LIVE
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{publishedHackathon.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 32px' }}>
            Your hackathon is officially published to HackForge OS! Rules, problem tracks, and Sentinel integrity scanners are active and ready for builder squads.
          </p>

          <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxWidth: '540px', margin: '0 auto 32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Instance Identifier:</span>
              <code style={{ color: 'var(--accent-cyan)' }}>{publishedHackathon.id}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Prize Bounty Pool:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>{publishedHackathon.prizePool}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Problem Tracks:</span>
              <span>{publishedHackathon.problemStatements?.length || 1} Tracks Configured</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Integrity Guardrails:</span>
              <span style={{ color: 'var(--accent-violet)' }}>Sentinel Real-Time Active</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/organizer/hackathons/${publishedHackathon.id}`} className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <Shield size={18} />
              <span>Go to Organizer Control Center</span>
            </Link>
            <Link to={`/hackathons/${publishedHackathon.id}`} className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              <Globe size={18} />
              <span>View Public Page</span>
            </Link>
            <Link to="/organizer" className="btn btn-ghost" style={{ padding: '12px 20px' }}>
              <span>Organizer Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '1160px', padding: '32px 24px' }}>
      
      {/* Top Breadcrumb & Presets Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/organizer" style={{ color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={14} /> Organizer Hub
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Create New Hackathon</span>
        </div>

        {/* Non-technical user friendly preset */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleLoadPreset}
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--accent-violet)', color: 'var(--accent-violet)' }}
            title="Pre-fills with a realistic, high-quality autonomous AI hackathon"
          >
            <Sparkles size={14} />
            <span>Fill with AI Hackathon Template</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="badge badge-violet">
            ORGANIZER ONBOARDING STUDIO
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            STEP {currentStep} OF 5
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem' }}>Hackathon Launch Studio</h1>
        <p className="page-subtitle">
          Configure your competition specifications, establish fair-play guardrails, define problem tracks, and activate HackForge Sentinel.
        </p>
      </div>

      {/* 5-Step Visual Stepper Bar */}
      <div className="card" style={{ marginBottom: '32px', padding: '16px 20px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          
          {[
            { num: 1, label: 'Details', icon: FileText, desc: 'Name, Dates & Banner' },
            { num: 2, label: 'Rules & Tech', icon: Shield, desc: 'Policies & Requirements' },
            { num: 3, label: 'Problem Statements', icon: Layers, desc: 'Tracks & Challenges' },
            { num: 4, label: 'Integrity Sentinel', icon: Sliders, desc: 'Anti-Cheat & Git Rules' },
            { num: 5, label: 'Publish & Preview', icon: Eye, desc: 'Review & Go Live' }
          ].map((s, idx, arr) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    const errors = validateStep(currentStep);
                    if (s.num > currentStep && Object.keys(errors).length > 0) {
                      setValidationErrors(errors);
                      showToast("Please complete the required fields on this step first.", "default");
                      return;
                    }
                    setCurrentStep(s.num);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      background: isCompleted ? 'var(--accent-emerald)' : isActive ? 'var(--accent-violet)' : 'var(--bg-surface)',
                      color: isCompleted || isActive ? '#fff' : 'var(--text-muted)',
                      border: isActive ? '2px solid var(--accent-violet-glow)' : '1px solid var(--border-default)',
                      boxShadow: isActive ? '0 0 15px var(--accent-violet-glow)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                  </div>

                  <div className="stepper-text-block">
                    <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {s.desc}
                    </div>
                  </div>
                </button>

                {idx < arr.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      margin: '0 8px',
                      background: currentStep > s.num ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                      transition: 'background var(--transition-normal)'
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Validation Error Banner (if any) */}
      {Object.keys(validationErrors).length > 0 && (
        <div
          style={{
            background: 'var(--accent-rose-dim)',
            border: '1px solid var(--accent-rose)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <AlertCircle size={20} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--accent-rose)', fontSize: '0.9rem', marginBottom: '4px' }}>
              Please correct the following before continuing:
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              {Object.entries(validationErrors).map(([key, err]) => (
                <li key={key} style={{ marginTop: '2px' }}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: HACKATHON DETAILS                                                 */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* General Info Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-violet)" />
              <span>Step 1: Core Hackathon Details</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Give your hackathon an inspiring title, high-impact description, and clear dates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Title & Tagline */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Hackathon Name / Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous AI World Cup 2026, Web3 Open Summit, etc."
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  style={{ borderColor: validationErrors.title ? 'var(--accent-rose)' : undefined }}
                />
                {validationErrors.title && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '4px', display: 'block' }}>
                    {validationErrors.title}
                  </span>
                )}
              </div>

              {/* Tagline */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Short Tagline
                </label>
                <input
                  type="text"
                  placeholder="One-line hook summarizing the theme or challenge"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Detailed Description <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the hackathon vision, who should participate, and what participants will build..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  style={{ borderColor: validationErrors.description ? 'var(--accent-rose)' : undefined }}
                />
                {validationErrors.description && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '4px', display: 'block' }}>
                    {validationErrors.description}
                  </span>
                )}
              </div>

              {/* Dates & Duration Grid */}
              <div className="grid-3" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Start Date & Time (UTC) <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={e => setFormData({ ...formData, startsAt: e.target.value })}
                    className="form-input"
                    style={{ borderColor: validationErrors.startsAt ? 'var(--accent-rose)' : undefined }}
                  />
                  {validationErrors.startsAt && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '4px', display: 'block' }}>
                      {validationErrors.startsAt}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    End Date & Time / Code Freeze <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={e => setFormData({ ...formData, endsAt: e.target.value })}
                    className="form-input"
                    style={{ borderColor: validationErrors.endsAt ? 'var(--accent-rose)' : undefined }}
                  />
                  {validationErrors.endsAt && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '4px', display: 'block' }}>
                      {validationErrors.endsAt}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Total Prize Pool <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $50,000"
                    value={formData.prizePool}
                    onChange={e => setFormData({ ...formData, prizePool: e.target.value })}
                    className="form-input"
                    style={{ borderColor: validationErrors.prizePool ? 'var(--accent-rose)' : undefined }}
                  />
                  {durationStr && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px', display: 'block' }}>
                      ⚡ Sprint duration: {durationStr}
                    </span>
                  )}
                </div>
              </div>

              {/* Format, Location & Team Size */}
              <div className="grid-3" style={{ gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={e => setFormData({ ...formData, format: e.target.value })}
                    className="form-select"
                  >
                    <option value="Virtual / Online">Virtual / Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid (In-Person + Online)">Hybrid (In-Person + Online)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Global Online, San Francisco, etc."
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Maximum Team Size
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, maxTeamSize: num })}
                        style={{
                          flex: 1,
                          padding: '8px 0',
                          borderRadius: 'var(--radius-sm)',
                          border: formData.maxTeamSize === num ? '1px solid var(--accent-emerald)' : '1px solid var(--border-default)',
                          background: formData.maxTeamSize === num ? 'var(--accent-emerald-dim)' : 'var(--bg-surface)',
                          color: formData.maxTeamSize === num ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Banner Selector Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={17} color="var(--accent-cyan)" />
              <span>Hackathon Banner & Branding</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Select a curated high-definition banner theme or paste a custom banner URL.
            </p>

            {/* Presets Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {BANNER_PRESETS.map(preset => {
                const isSelected = formData.banner === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setFormData({ ...formData, banner: preset.url })}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-default)',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isSelected ? '0 0 16px var(--accent-emerald-dim)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ height: '90px', width: '100%', overflow: 'hidden' }}>
                      <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '8px 10px', background: 'var(--bg-surface)', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preset.name}</span>
                      {isSelected && <Check size={14} color="var(--accent-emerald)" strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom URL Input & Preview */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Or paste a custom image URL (Unsplash, Imgur, S3, etc.)..."
                value={formData.banner}
                onChange={e => setFormData({ ...formData, banner: e.target.value })}
                className="form-input"
                style={{ flex: 1 }}
              />
            </div>
            
            {/* Live Banner Preview */}
            {formData.banner && (
              <div style={{ marginTop: '14px', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '140px', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                <img src={formData.banner} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '14px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', color: '#fff' }}>
                  Live Banner Preview
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: RULES & POLICIES                                                  */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Presets for Rules */}
          <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Non-Technical? Choose a Pre-Configured Rule Package</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Apply industry-standard rules for AI, repositories, and submissions in one click.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      aiPolicy: 'Full AI Allowed',
                      starterCodePolicy: 'Declared & Whitelisted Only',
                      allowedTechnologies: ['React', 'Python', 'TypeScript', 'Node.js', 'FastAPI', 'Docker']
                    }));
                    showToast("Applied Standard Modern Fair-Play Rule Package", "default");
                  }}
                >
                  ⚡ Modern Fair-Play
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      aiPolicy: 'Assisted Only',
                      starterCodePolicy: 'From-Scratch Only (No starter boilerplates)',
                      allowedTechnologies: ['Rust', 'C++', 'Go', 'Python', 'TypeScript']
                    }));
                    showToast("Applied Strict Human-Centric Rule Package", "default");
                  }}
                >
                  🛡️ Strict Human-Centric
                </button>
              </div>
            </div>
          </div>

          {/* AI Usage Policy */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--accent-cyan)" />
              <span>AI Usage Policy</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Clearly communicate to participants how generative AI, Copilot, and LLMs may be utilized.
            </p>

            <div className="grid-2" style={{ gap: '12px', marginBottom: '14px' }}>
              {[
                {
                  id: 'Full AI Allowed',
                  title: 'Full AI Permitted (Recommended)',
                  badge: 'badge-emerald',
                  desc: 'All LLMs, Copilot, and agent frameworks allowed. Builders must disclose major prompts and agent scripts in their Build Passport.'
                },
                {
                  id: 'Assisted Only',
                  title: 'Assisted AI Only',
                  badge: 'badge-cyan',
                  desc: 'AI permitted for syntax completion, boilerplate, and troubleshooting. Core algorithmic logic must be human-authored.'
                },
                {
                  id: 'Strict Human Only',
                  title: 'Strict Human-Only Code',
                  badge: 'badge-rose',
                  desc: 'Zero generative AI allowed for source code generation. Sentinel will flag excessive LLM patterns.'
                },
                {
                  id: 'Custom Policy',
                  title: 'Custom AI Policy',
                  badge: 'badge-violet',
                  desc: 'Specify your own specialized guidelines for model weights, APIs, or data privacy requirements.'
                }
              ].map(opt => {
                const isSelected = formData.aiPolicy === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, aiPolicy: opt.id })}
                    style={{
                      background: isSelected ? 'var(--bg-card-active)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 15px var(--accent-cyan-dim)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {opt.title}
                      </span>
                      <span className={`badge ${opt.badge}`} style={{ fontSize: '0.65rem' }}>
                        {isSelected ? 'SELECTED' : 'OPTION'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {formData.aiPolicy === 'Custom Policy' && (
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                  Custom AI Guidelines & Rules <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail exact AI restrictions, permitted models, and disclosure guidelines..."
                  value={formData.customAiPolicy}
                  onChange={e => setFormData({ ...formData, customAiPolicy: e.target.value })}
                  className="form-textarea"
                />
              </div>
            )}
          </div>

          {/* Allowed Technologies */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="var(--accent-emerald)" />
              <span>Allowed Technologies & Frameworks</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
              Tags of languages, SDKs, or stacks recommended or mandated for this hackathon.
            </p>

            {/* Quick add popular tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick add:</span>
              {['Python', 'React', 'TypeScript', 'Rust', 'Solidity', 'FastAPI', 'Next.js', 'PyTorch', 'Flutter', 'Go', 'Docker'].map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => addTechTag(tech)}
                  style={{
                    background: formData.allowedTechnologies.includes(tech) ? 'var(--accent-emerald-dim)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: formData.allowedTechnologies.includes(tech) ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  +{tech}
                </button>
              ))}
            </div>

            {/* Current Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', minHeight: '38px', padding: '10px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {formData.allowedTechnologies.map(tag => (
                <span
                  key={tag}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glow)',
                    color: 'var(--accent-cyan)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTechTag(tag)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: 0 }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.allowedTechnologies.length === 0 && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No tech restrictions (Any open-source technology permitted).
                </span>
              )}
            </div>

            {/* Manual input */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type a technology and press enter (e.g. LangChain, PostgreSQL)..."
                value={newTechInput}
                onChange={e => setNewTechInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechTag(newTechInput);
                  }
                }}
                className="form-input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => addTechTag(newTechInput)}
                className="btn btn-secondary btn-sm"
              >
                Add Tech
              </button>
            </div>
          </div>

          {/* Starter Code & Repo Policies */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-violet)" />
              <span>Starter Code & Repository Requirements</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Configure expectations for git collaboration and boilerplate templates.
            </p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Starter Code Policy
              </label>
              <select
                value={formData.starterCodePolicy}
                onChange={e => setFormData({ ...formData, starterCodePolicy: e.target.value })}
                className="form-select"
              >
                <option value="Declared & Whitelisted Only">Declared & Whitelisted Only (Organizers audit approved repos)</option>
                <option value="From-Scratch Only (No starter boilerplates)">From-Scratch Only (All code written during sprint window)</option>
                <option value="Any Open-Source Starter Permitted with Attribution">Any Open-Source Starter Permitted with Attribution</option>
              </select>
            </div>

            {/* Repository Requirements List */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Repository Standards (Shown to participants)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                {formData.repositoryRequirements.map((req, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="var(--accent-emerald)" />
                      <span>{req}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, repositoryRequirements: formData.repositoryRequirements.filter((_, i) => i !== idx) })}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Add a repository rule (e.g. Commit messages must follow conventional commits)..."
                  value={newRepoReqInput}
                  onChange={e => setNewRepoReqInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newRepoReqInput.trim()) {
                        setFormData({ ...formData, repositoryRequirements: [...formData.repositoryRequirements, newRepoReqInput.trim()] });
                        setNewRepoReqInput('');
                      }
                    }
                  }}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newRepoReqInput.trim()) {
                      setFormData({ ...formData, repositoryRequirements: [...formData.repositoryRequirements, newRepoReqInput.trim()] });
                      setNewRepoReqInput('');
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Add Requirement
                </button>
              </div>
            </div>

            {/* Submission Requirements */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Final Submission Requirements <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                {formData.submissionRequirements.map((sub, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="var(--accent-cyan)" />
                      <span>{sub}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, submissionRequirements: formData.submissionRequirements.filter((_, i) => i !== idx) })}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Add a deliverable requirement (e.g. 2-minute Loom presentation link)..."
                  value={newSubReqInput}
                  onChange={e => setNewSubReqInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSubReqInput.trim()) {
                        setFormData({ ...formData, submissionRequirements: [...formData.submissionRequirements, newSubReqInput.trim()] });
                        setNewSubReqInput('');
                      }
                    }
                  }}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSubReqInput.trim()) {
                      setFormData({ ...formData, submissionRequirements: [...formData.submissionRequirements, newSubReqInput.trim()] });
                      setNewSubReqInput('');
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Add Requirement
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: PROBLEM STATEMENTS (TRACKS & CHALLENGES)                          */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="var(--accent-amber)" />
                  <span>Problem Statements & Track Challenges ({formData.problemStatements.length})</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Create one or more problem statements. Builders will choose which track to tackle.
                </p>
              </div>

              <button
                type="button"
                onClick={addNewProblemStatement}
                className="btn btn-primary btn-sm"
              >
                <PlusCircle size={15} />
                <span>Add Problem Statement</span>
              </button>
            </div>

            {/* Problem Statements Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              {formData.problemStatements.map((ps, idx) => {
                const isActive = activePsIndex === idx;
                return (
                  <button
                    key={ps.id || idx}
                    type="button"
                    onClick={() => setActivePsIndex(idx)}
                    style={{
                      background: isActive ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                      border: isActive ? '1px solid var(--accent-amber)' : '1px solid var(--border-default)',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: isActive ? 'var(--accent-amber)' : 'rgba(255,255,255,0.1)', color: isActive ? '#000' : 'inherit', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ps.title || `Track #${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Problem Statement Editor */}
            {formData.problemStatements[activePsIndex] && (
              <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-amber">TRACK #{activePsIndex + 1}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      {formData.problemStatements[activePsIndex].title}
                    </span>
                  </div>

                  {formData.problemStatements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProblemStatement(activePsIndex)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--accent-rose)' }}
                    >
                      <Trash2 size={14} /> Remove Track
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Title & Category */}
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Title / Track Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Autonomous Micro-Settlement Protocol"
                        value={formData.problemStatements[activePsIndex].title}
                        onChange={e => updateActivePs('title', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Category / Domain
                      </label>
                      <select
                        value={formData.problemStatements[activePsIndex].category}
                        onChange={e => updateActivePs('category', e.target.value)}
                        className="form-select"
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Blockchain & Web3">Blockchain & Web3</option>
                        <option value="Developer Tools">Developer Tools</option>
                        <option value="CyberSecurity & Defense">CyberSecurity & Defense</option>
                        <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                        <option value="FinTech & Commerce">FinTech & Commerce</option>
                        <option value="Open Innovation">Open Innovation</option>
                      </select>
                    </div>
                  </div>

                  {/* Difficulty, Bounty & Starter Repo */}
                  <div className="grid-3" style={{ gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Difficulty Level
                      </label>
                      <select
                        value={formData.problemStatements[activePsIndex].difficulty}
                        onChange={e => updateActivePs('difficulty', e.target.value)}
                        className="form-select"
                      >
                        <option value="Beginner">Beginner (Novice / Student)</option>
                        <option value="Intermediate">Intermediate (Practitioner)</option>
                        <option value="Advanced">Advanced (Senior Architect)</option>
                        <option value="Hardcore">Hardcore (Expert / Specialized)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Track Bounty / Prize
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $15,000"
                        value={formData.problemStatements[activePsIndex].bounty}
                        onChange={e => updateActivePs('bounty', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Optional Starter Repo URL
                      </label>
                      <input
                        type="text"
                        placeholder="github.com/org/starter-template"
                        value={formData.problemStatements[activePsIndex].starterRepo}
                        onChange={e => updateActivePs('starterRepo', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      Problem Statement Description <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain the background, core problem to solve, and why this is high impact..."
                      value={formData.problemStatements[activePsIndex].description}
                      onChange={e => updateActivePs('description', e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  {/* Expected Outcome & Recommended Technology */}
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Expected Deliverable / Outcome
                      </label>
                      <textarea
                        rows={2}
                        placeholder="What should the prototype demonstrate by submission deadline?"
                        value={formData.problemStatements[activePsIndex].expectedOutcome}
                        onChange={e => updateActivePs('expectedOutcome', e.target.value)}
                        className="form-textarea"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                        Recommended Tech Stack
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. FastAPI, LangChain, React, WebSocket, Docker"
                        value={formData.problemStatements[activePsIndex].recommendedTech}
                        onChange={e => updateActivePs('recommendedTech', e.target.value)}
                        className="form-textarea"
                      />
                    </div>
                  </div>

                  {/* Evaluation Criteria & Rubric */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      Evaluation Criteria & Weighting
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Originality (30%), Technical Execution (30%), Practical Impact (20%), UX (20%)"
                      value={formData.problemStatements[activePsIndex].evaluationCriteria}
                      onChange={e => updateActivePs('evaluationCriteria', e.target.value)}
                      className="form-input"
                    />
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: INTEGRITY CONFIGURATION                                          */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Non-technical Sentinel Intro */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))', border: '1px solid var(--accent-violet-glow)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-violet-dim)', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>HackForge Sentinel Anti-Cheat & Originality Engine</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Sentinel eliminates unfair advantages by continuously comparing participant GitHub repositories against baseline snapshots, whitelisted starter boilerplates, and timestamped diff patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Config Controls Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--accent-violet)" />
              <span>Integrity & Verification Settings</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Mandatory GitHub Connection */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Mandatory GitHub Repository Connection
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Requires all teams to link a public GitHub repo with active commits to generate a Build Passport.
                  </div>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.integrityConfig.githubMandatory}
                    onChange={e => setFormData({
                      ...formData,
                      integrityConfig: { ...formData.integrityConfig, githubMandatory: e.target.checked }
                    })}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Pre-Existing Code Flagging */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Flag Pre-Existing Code Authored Before Sprint Window
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Detects repositories cloned or authored prior to the baseline snapshot timestamp.
                  </div>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.integrityConfig.flagPreExistingCode}
                    onChange={e => setFormData({
                      ...formData,
                      integrityConfig: { ...formData.integrityConfig, flagPreExistingCode: e.target.checked }
                    })}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* AI Prompt & Tool Use Disclosure */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Mandatory AI Usage Disclosure
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Teams must submit their AI system prompts and copilot logs in their final Build Passport.
                  </div>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.integrityConfig.aiDisclosureRequired}
                    onChange={e => setFormData({
                      ...formData,
                      integrityConfig: { ...formData.integrityConfig, aiDisclosureRequired: e.target.checked }
                    })}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Baseline Snapshot Timestamp */}
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                  Baseline Snapshot Timestamp
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Sentinel takes a cryptographic baseline of all registered repositories at this exact moment. All commits prior to this point are considered pre-existing code.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="snapshotType"
                      checked={formData.integrityConfig.baselineSnapshotType === 'KICKOFF'}
                      onChange={() => setFormData({
                        ...formData,
                        integrityConfig: { ...formData.integrityConfig, baselineSnapshotType: 'KICKOFF' }
                      })}
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span>Sprint Kickoff Date & Time ({new Date(formData.startsAt).toLocaleString()})</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="snapshotType"
                      checked={formData.integrityConfig.baselineSnapshotType === 'CUSTOM'}
                      onChange={() => setFormData({
                        ...formData,
                        integrityConfig: { ...formData.integrityConfig, baselineSnapshotType: 'CUSTOM' }
                      })}
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span>Custom Snapshot Date</span>
                  </label>
                </div>

                {formData.integrityConfig.baselineSnapshotType === 'CUSTOM' && (
                  <div style={{ marginTop: '12px', maxWidth: '320px' }}>
                    <input
                      type="datetime-local"
                      value={formData.integrityConfig.customSnapshotTime || formData.startsAt}
                      onChange={e => setFormData({
                        ...formData,
                        integrityConfig: { ...formData.integrityConfig, customSnapshotTime: e.target.value }
                      })}
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              {/* Integrity Review Threshold Slider */}
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Minimum Originality Threshold for Auto-Qualification
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Submissions scoring below this threshold are placed in the Organizer Review Quarantine queue.
                    </div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                    {formData.integrityConfig.integrityThreshold}% Original Code
                  </span>
                </div>

                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={formData.integrityConfig.integrityThreshold}
                  onChange={e => setFormData({
                    ...formData,
                    integrityConfig: { ...formData.integrityConfig, integrityThreshold: parseInt(e.target.value, 10) }
                  })}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer', margin: '10px 0' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>60% (Lenient / High Boilerplate)</span>
                  <span>80% (Recommended Standard)</span>
                  <span>95% (Strict Custom Algorithms)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Allowed Starters Whitelist Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={18} color="var(--accent-cyan)" />
              <span>Allowed Starter Repositories Whitelist ({formData.integrityConfig.allowedStarters.length})</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Whitelisted templates are automatically excluded from unoriginal code deductions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              {formData.integrityConfig.allowedStarters.map((starter, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{starter.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{starter.repo}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStarterRepo(i)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--accent-rose)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Starter form */}
            <form onSubmit={addStarterRepo} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Template Name (e.g. Next.js Wagmi Template)"
                value={newStarterName}
                onChange={e => setNewStarterName(e.target.value)}
                className="form-input"
                style={{ flex: 1, minWidth: '200px' }}
              />
              <input
                type="text"
                placeholder="GitHub Repo (e.g. github.com/user/starter)"
                value={newStarterUrl}
                onChange={e => setNewStarterUrl(e.target.value)}
                className="form-input"
                style={{ flex: 1, minWidth: '240px' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <PlusCircle size={14} /> Add Whitelist
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: FINAL PREVIEW & PUBLISH                                           */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Pre-Flight Audit Status */}
          <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glow)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" />
              <span>Pre-Flight Readiness Audit</span>
            </h3>

            <div className="grid-4" style={{ gap: '12px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STEP 1: DETAILS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 700, color: formData.title ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  <Check size={14} /> {formData.title ? 'Configured' : 'Missing Title'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STEP 2: RULES</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  <Check size={14} /> {formData.aiPolicy}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STEP 3: TRACKS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  <Check size={14} /> {formData.problemStatements.length} Active Tracks
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STEP 4: SENTINEL</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  <Check size={14} /> {formData.integrityConfig.integrityThreshold}% Threshold
                </div>
              </div>
            </div>
          </div>

          {/* Full Interactive Public Page Simulation */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            
            {/* Banner Header Preview */}
            <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={formData.banner}
                alt={formData.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-card) 0%, rgba(19, 23, 36, 0.4) 100%)' }} />
              
              <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-emerald">PREVIEW MODE</span>
                    <span className="badge badge-cyan">{formData.format}</span>
                    <span style={{ fontSize: '0.75rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      Hosted by {formData.organizer}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                    {formData.title || "Untitled Hackathon"}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {formData.tagline || formData.description?.slice(0, 120)}
                  </p>
                </div>

                <div style={{ background: 'rgba(14, 17, 26, 0.85)', backdropFilter: 'blur(10px)', padding: '12px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL PRIZE POOL</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {formData.prizePool}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Meta Row */}
            <div style={{ padding: '16px 28px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '28px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Calendar size={15} color="var(--accent-cyan)" />
                <span>Starts: <strong>{new Date(formData.startsAt).toLocaleDateString()}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Clock size={15} color="var(--accent-amber)" />
                <span>Duration: <strong>{durationStr || '72h'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Users size={15} color="var(--accent-violet)" />
                <span>Max Team Size: <strong>{formData.maxTeamSize} Builders</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <MapPin size={15} color="var(--accent-rose)" />
                <span>{formData.location}</span>
              </div>
            </div>

            {/* Body Preview: Description & Rules */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Description */}
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>About This Hackathon</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {formData.description}
                </p>
              </div>

              {/* Rules and Policies Pill Summary */}
              <div className="grid-3" style={{ gap: '14px' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>AI USAGE POLICY</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{formData.aiPolicy}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {formData.aiPolicy === 'Full AI Allowed' ? 'Copilot & LLMs permitted with Build Passport disclosure.' : 'Specific conditions apply.'}
                  </p>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>STARTER CODE</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>{formData.starterCodePolicy.split('(')[0]}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {formData.integrityConfig.allowedStarters.length} verified starter repositories registered.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>SENTINEL INTEGRITY</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-violet)', fontSize: '0.9rem' }}>
                    {formData.integrityConfig.integrityThreshold}% Originality Threshold
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {formData.integrityConfig.githubMandatory ? 'Mandatory GitHub telemetry verification.' : 'Optional GitHub sync.'}
                  </p>
                </div>
              </div>

              {/* Problem Statements Preview */}
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '14px' }}>
                  Problem Statements ({formData.problemStatements.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {formData.problemStatements.map((ps, idx) => (
                    <div
                      key={ps.id || idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span className="badge badge-amber">{ps.category}</span>
                            <span className="badge badge-muted">{ps.difficulty}</span>
                            {ps.bounty && (
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                                {ps.bounty}
                              </span>
                            )}
                          </div>
                          <h5 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{ps.title}</h5>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                        {ps.description}
                      </p>

                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                        <div>
                          <strong>Outcome:</strong> {ps.expectedOutcome}
                        </div>
                        {ps.evaluationCriteria && (
                          <div>
                            <strong>Evaluation:</strong> {ps.evaluationCriteria}
                          </div>
                        )}
                        {ps.starterRepo && (
                          <div style={{ color: 'var(--accent-cyan)' }}>
                            <strong>Starter:</strong> {ps.starterRepo}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Final Call to Action */}
          <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Ready to Launch Your Hackathon?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 24px' }}>
              Publishing will make this hackathon discoverable to builders, activate the Sentinel telemetry sentinel, and initialize jury grading queues.
            </p>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                fontSize: '1.05rem',
                padding: '14px 36px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 0 25px var(--accent-emerald-glow)',
                margin: '0 auto'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Publishing & Bootstrapping Sentinel...</span>
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  <span>Publish Hackathon Now</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="btn btn-secondary"
          style={{ opacity: currentStep === 1 ? 0.4 : 1, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Step {currentStep} of 5
          </span>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              <Rocket size={16} />
              <span>Publish Hackathon</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
