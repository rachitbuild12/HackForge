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
              HACKFORGE OS 2.4 LIVE
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Over $380,000 In Active Bounties
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.03em' }}>
            The Gamified Operating System for <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hackathons</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '720px', margin: '0 auto 32px auto' }}>
            Empower builders with milestone quests and XP. Give organizers transparent build telemetry and automated integrity sentinel alerts. Verify every submission with tamper-evident <strong>Build Passports</strong>.
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
              <span>Run 5-Min Hackathon Demo</span>
            </Link>

            <Link to="/hackathons/eth-global-2026/quests" className="btn btn-secondary btn-lg">
              <Zap size={18} fill="currentColor" />
              <span>Launch Live Workspace</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/organizer" className="btn btn-secondary btn-lg">
              <ShieldCheck size={18} />
              <span>Organizer Control Center</span>
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
                hackforge://session/eth-global-2026/team-hyperdrive
              </span>
            </div>
            <span className="badge badge-emerald">
              <span className="pulse-dot" /> BUILD TELEMETRY ACTIVE
            </span>
          </div>

          {/* HUD Preview Grid */}
          <div className="grid-3" style={{ gap: '16px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                LIVE SPRINT VELOCITY
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                37 Commits
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                All commits verified against hackathon window
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                ORIGINALITY INTEGRITY AUDIT
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                97.4% Clean
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Zero pre-built anomalies or unverified bursts
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                BUILD PASSPORT READY
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>
                HFP-2026-9842A
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Cryptographic multi-signature jury proof
              </div>
            </div>
          </div>
        </div>

        {/* 4 PILLARS OF HACKFORGE */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>ARCHITECTURE</span>
            <h2>Why Hackathons Need an Operating System</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
              Generic tools like Discord, Devpost, and Trello fail to capture the intense sprint dynamics and build authenticity.
            </p>
          </div>

          <div className="grid-4">
            {/* Pillar 1 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-emerald-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '14px' }}>
                <Zap size={22} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Gamified Quests & XP</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Break hackathons into sprint milestones: architecture RFCs, MVP deployment, stress tests, and pitch decks with real-time level ups.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-cyan-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '14px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Build Passports</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Tamper-evident certificates containing cryptographic commit manifests, boilerplate diff audits, and verified deployment proofs.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-rose-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)', marginBottom: '14px' }}>
                <ShieldAlert size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Integrity Sentinel</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Real-time anomaly detection identifying pre-built repositories, suspicious 20k line copy-paste bursts, and unwhitelisted boilerplates.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="card">
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-violet-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-violet)', marginBottom: '14px' }}>
                <Cpu size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>AI Team Copilot</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Proactive coaching analyzing remaining sprint time, nudging teams to finish their demo video and verify contracts before submission.
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
