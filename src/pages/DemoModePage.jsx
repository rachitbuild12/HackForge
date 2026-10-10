import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Shield,
  ShieldAlert,
  Users,
  Cpu,
  Zap,
  Target,
  Compass,
  GitBranch,
  GitCommit,
  CheckCircle,
  Lock,
  Award,
  AlertTriangle,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import {
  DEMO_HACKATHON_ID,
  demoHackathon,
  demoTeams,
  demoAiInsights,
  demoIntegrityAlert,
  demoBuildPassport,
  DEMO_STEPS
} from '../data/demoModeData';

export default function DemoModePage() {
  const {
    isDemoMode,
    demoStep,
    startDemoMode,
    jumpToDemoStep,
    exitDemoMode,
    setIsAutoPlaying,
    switchRole
  } = useHackForge();

  const navigate = useNavigate();

  const handleLaunchFullTour = (autoPlay = true) => {
    startDemoMode(1);
    setIsAutoPlaying(autoPlay);
    const firstStep = DEMO_STEPS[0];
    switchRole(firstStep.role);
    navigate(firstStep.route);
  };

  const handleJumpToStep = (stepNumber) => {
    startDemoMode(stepNumber);
    const targetStep = DEMO_STEPS.find(s => s.step === stepNumber) || DEMO_STEPS[0];
    switchRole(targetStep.role);
    navigate(targetStep.route);
  };

  const integrationBlocker = demoAiInsights.find(i => i.type === 'INTEGRATION_BLOCKER');

  return (
    <div className="page-wrapper" style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '80px' }}>
      
      {/* Top Hero Banner */}
      <div
        className="card"
        style={{
          padding: '36px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.08), rgba(139, 92, 246, 0.08))',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="card-hud-accent cyan" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} /> ETHGLOBAL AUTONOMOUS 2026
              </span>
              <span className="badge badge-cyan">5-MINUTE GUIDED SCENARIO</span>
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--accent-amber)',
                  fontSize: '0.65rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                SIMULATED DATASET
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: '1.15' }}>
              Special Hackathon Demo Mode
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '12px', lineHeight: '1.6' }}>
              Demonstrate the entire HackForge OS lifecycle in under 5 minutes. Walk through 12 curated stages: from organizer configuration and multi-disciplinary squad onboarding, through GitHub telemetry streaming, AI blocker diagnosis, quest completion, human-in-the-loop integrity review, and final cryptographic Build Passport sealing.
            </p>

            {/* Launch Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleLaunchFullTour(true)}
                className="btn btn-primary btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 0 24px rgba(6,182,212,0.4)',
                  fontSize: '0.95rem',
                  padding: '12px 24px'
                }}
              >
                <Play size={18} fill="currentColor" />
                <span>Launch 5-Minute Auto Tour</span>
              </button>

              <button
                onClick={() => handleLaunchFullTour(false)}
                className="btn btn-secondary btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  padding: '12px 20px'
                }}
              >
                <Compass size={16} />
                <span>Manual Step-by-Step Tour</span>
              </button>

              {isDemoMode && (
                <button
                  onClick={exitDemoMode}
                  className="btn btn-ghost btn-lg"
                  style={{ color: 'var(--accent-rose)' }}
                >
                  <RotateCcw size={16} />
                  <span>Exit Demo Mode</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Telemetry Summary Card */}
          <div
            style={{
              background: 'rgba(11, 15, 23, 0.85)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              minWidth: '280px',
              flex: '1 1 280px',
              maxWidth: '360px'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              SEEDED DEMO SNAPSHOT
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Event:</span>
                <strong style={{ color: '#fff' }}>HackForge Grand Challenge</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Registered Teams:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>3 Teams (4 Members Each)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>GitHub Activity:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>Simulated Commit Streams</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>AI Blocker:</span>
                <strong style={{ color: 'var(--accent-rose)' }}>1 CORS / WebSocket Issue</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Integrity Alert:</span>
                <strong style={{ color: 'var(--accent-amber)' }}>1 Whitelisted Template Review</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Build Passport:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>Cryptographically Sealed</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div
          style={{
            marginTop: '24px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}
        >
          <Info size={16} color="var(--accent-cyan)" />
          <span>
            <strong>Transparency Guarantee:</strong> All activity within Demo Mode uses clearly labeled seeded data. HackForge never misrepresents simulated events as live GitHub OAuth telemetry.
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 12-STEP GUIDED DEMO FLOW ROADMAP                         */}
      {/* ======================================================== */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>The 12-Step Guided Demo Flow</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Click any stage to instantly jump to that perspective with pre-configured project data.
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '14px' }}>
          {DEMO_STEPS.map((s) => {
            const isCurrent = isDemoMode && demoStep === s.step;

            return (
              <div
                key={s.step}
                onClick={() => handleJumpToStep(s.step)}
                className="card interactive"
                style={{
                  padding: '16px 18px',
                  cursor: 'pointer',
                  border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  background: isCurrent ? 'linear-gradient(145deg, rgba(6,182,212,0.15), rgba(14,20,28,0.95))' : 'var(--bg-card)',
                  boxShadow: isCurrent ? '0 0 24px rgba(6,182,212,0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)'
                    }}
                  >
                    STEP {s.step.toString().padStart(2, '0')}
                  </span>
                  <span className="badge badge-muted" style={{ fontSize: '0.62rem' }}>
                    {s.role.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  {s.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
                  {s.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    Jump to Step <ArrowRight size={12} />
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {s.route}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SEEDED DATASET INSPECTION (TEAMS, BLOCKER, SENTINEL, PASSPORT) */}
      {/* ======================================================== */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
          Seeded Demo Telemetry Dataset
        </h2>

        {/* 3 Teams Display (4 members each) */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--accent-cyan)" />
                <span>3 Seeded Squads (4 Members per Squad)</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Realistic multi-disciplinary team configurations with member roles, disciplines, commit counts, and XP.
              </p>
            </div>
            <span className="badge badge-cyan">12 Total Registered Builders</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {demoTeams.map(t => (
              <div
                key={t.id}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{t.name}</span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>{t.track}</span>
                      <span className="badge badge-amber" style={{ fontSize: '0.62rem' }}>LVL {t.level} • {t.xp} XP</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      Track: <strong>{t.problemTitle}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div>GitHub: <strong style={{ color: 'var(--accent-cyan)' }}>{t.repoName}</strong> [SIMULATED]</div>
                    <div style={{ color: 'var(--accent-emerald)', marginTop: '2px' }}>{t.commitsCount} Commits • {t.linesChanged}</div>
                  </div>
                </div>

                {/* 4 Members Grid */}
                <div className="grid-4" style={{ gap: '10px' }}>
                  {t.members.map(m => (
                    <div
                      key={m.id}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <img
                        src={m.avatar}
                        alt={m.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.role}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {m.commits} commits
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Blocker & Integrity Alert 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          
          {/* REQUIRED ITEM: ONE INTEGRATION BLOCKER */}
          <div className="card" style={{ padding: '20px', border: '1px solid rgba(244,63,94,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Cpu size={18} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Seeded Integration Blocker (AI Copilot)
              </h3>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.25)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>HIGH INTEGRATION BLOCKER</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Detected: 2h ago</span>
              </div>
              <h4 style={{ fontSize: '0.92rem', color: '#fff', marginBottom: '4px' }}>
                {integrationBlocker?.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                {integrationBlocker?.description}
              </p>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <strong>AI Recommended Resolution:</strong> {integrationBlocker?.suggestedResolution}
            </div>
          </div>

          {/* REQUIRED ITEM: ONE INTEGRITY REVIEW ALERT */}
          <div className="card" style={{ padding: '20px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldAlert size={18} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                Seeded Integrity Review Alert (Sentinel)
              </h3>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>ORGANIZER REVIEW REQUIRED</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>96.4% Custom Code</span>
              </div>
              <h4 style={{ fontSize: '0.92rem', color: '#fff', marginBottom: '4px' }}>
                {demoIntegrityAlert.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                {demoIntegrityAlert.summary}
              </p>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <strong>Sentinel Finding:</strong> Whitelisted starter 'next-viem-starter' verified with 3.6% retention. Ready for organizer countersignature.
            </div>
          </div>

        </div>

        {/* Completed Build Passport Highlight Card */}
        <div className="card" style={{ padding: '24px', border: '1px solid rgba(16,185,129,0.3)', background: 'linear-gradient(145deg, #101620, #0c1117)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={22} color="var(--accent-emerald)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Completed Build Passport: Nexus Sentinel</h3>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Serial: {demoBuildPassport.passportId} • Cryptographic Merkle Root Sealed</div>
              </div>
            </div>

            <Link
              to={`/hackathons/${DEMO_HACKATHON_ID}/passport`}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View Full Passport</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid-4" style={{ gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>INTEGRITY SCORE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>97.4%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Whitelisted Lineage</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>VERIFIED COMMITS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>37 Commits</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Across 4 Members</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TESTNET DEPLOYMENT</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>Sepolia</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>0x892a01...73710</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TEAM VAULT XP</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-amber)' }}>2,450 XP</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>5 Quests Completed</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
