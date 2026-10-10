import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Zap, ShieldCheck, Trophy, ArrowRight, GitBranch, Cpu, CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import HackathonCard from '../components/HackathonCard';

export default function Landing() {
  const { hackathons, user } = useHackForge();

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 1, paddingTop: '40px' }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 60px auto' }}>
          
          {/* Top release tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', padding: '6px 14px', borderRadius: 'var(--radius-full)', marginBottom: '24px' }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              HACKFORGE SPRINT ENGINE
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Deterministic Telemetry, Quests & Verifiable Build Passports
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.03em' }}>
            The Gamified Operating System for <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hackathons</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '780px', margin: '0 auto 32px auto' }}>
            Built for <strong>builders</strong>, <strong>organizers</strong>, and <strong>judges</strong>.
            Transform problem tracks into milestone quests, stream real GitHub telemetry, resolve blockers with the TinyFish research Copilot, and seal tamper-evident <strong>Build Passports</strong> with cryptographic lineage.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/demo"
              className="btn btn-primary btn-lg"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                boxShadow: '0 0 24px rgba(6, 182, 212, 0.4)',
                border: 'none',
                color: '#000',
                fontWeight: 800
              }}
            >
              <Sparkles size={18} />
              <span>Run 5-Min Guided Demo</span>
            </Link>

            <Link to="/hackathons/eth-global-2026/team" className="btn btn-secondary btn-lg">
              <Zap size={18} fill="currentColor" />
              <span>Enter Team Workspace</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/organizer" className="btn btn-secondary btn-lg">
              <ShieldCheck size={18} />
              <span>Organizer Center</span>
            </Link>

            <Link to="/judge" className="btn btn-ghost btn-lg">
              <Trophy size={18} />
              <span>Judge Queue</span>
            </Link>
          </div>
        </div>

        {/* INTERACTIVE HUD PREVIEW MOCKUP */}
        <div className="card" style={{ maxWidth: '1100px', margin: '0 auto 80px auto', background: 'linear-gradient(180deg, #0e121d 0%, #080a10 100%)', border: '1px solid var(--border-glow)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(16,185,129,0.1)' }}>
          <div className="card-hud-accent" />
          
          {/* Window HUD Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                hackforge://session/eth-global-2026/nexus-sentinel
              </span>
            </div>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              SIMULATED DEMO PREVIEW
            </span>
          </div>

          {/* HUD Preview Grid */}
          <div className="grid-3" style={{ gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                SPRINT CADENCE TELEMETRY
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                37 Commits
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Distributed organically across 4 squad members
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                ORIGINALITY INTEGRITY AUDIT
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                96.4% Custom
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                3.6% whitelisted starter boilerplate verified
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                BUILD PASSPORT READY
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>
                HFP-2026-NEXUS-01
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                SHA-256 verifiable manifest & commit audit seal
              </div>
            </div>
          </div>
        </div>

        {/* 4 PILLARS OF HACKFORGE */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>ARCHITECTURE</span>
            <h2>How the HackForge Operating System Connects</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '680px', margin: '6px auto 0 auto' }}>
              Four deterministic pillars that replace scattered chat channels and subjective pitch-only grading with real development lineage.
            </p>
          </div>

          <div className="grid-4">
            {/* Pillar 1 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-emerald-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '14px' }}>
                <Zap size={22} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Milestone Quests & XP</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Deconstructs sponsor tracks into sprint phases: setup, core API, stress tests, and pitch decks, awarding verifiable XP on evidence submission.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-cyan-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '14px' }}>
                <GitBranch size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>GitHub Telemetry</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Real OAuth repository sync capturing live commits, normalized activity timelines, and commit cadence auditing during the hackathon window.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-violet-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)', marginBottom: '14px' }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>TinyFish Research Copilot</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Autonomous web agent streaming live documentation, SDK specs, and competitive architecture straight into sprint quests to unblock builders.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-rose-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)', marginBottom: '14px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Verifiable Build Passports</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Tamper-evident final certificates with SHA-256 state hashes, boilerplate diff audits, deployment links, and human-in-the-loop organizer review.
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVE HACKATHONS DIRECTORY PREVIEW */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>DISCOVERY</span>
              <h2>Featured Live & Upcoming Hackathons</h2>
            </div>
            <Link to="/hackathons" className="btn btn-secondary btn-sm">
              <span>View All ({hackathons.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-2">
            {hackathons.slice(0, 2).map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
