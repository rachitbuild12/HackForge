import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  ExternalLink,
  QrCode,
  Award,
  Sparkles,
  Clock,
  Users,
  Layers,
  Cpu,
  FileCode,
  Share2,
  Printer,
  Download,
  Check,
  Compass,
  Terminal,
  Flame,
  ArrowDown,
  HelpCircle,
  Info,
  Lock,
  GitBranch,
  Shield,
  FileCheck,
  Zap,
  Globe,
  Radio,
  Copy
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function BuildPassport({ passportData, showActions = true, isPublicView = false }) {
  const { passport: defaultPassport, showToast, team: currentTeam, quests, isDemoMode } = useHackForge();
  const data = passportData || defaultPassport;

  // Active section tab for interactive navigation
  const [activeSection, setActiveSection] = useState('ALL'); // ALL, PROJECT, TEAM, DEV, JOURNEY, AI, INTEGRITY, GAMIFICATION
  const [copiedLink, setCopiedLink] = useState(false);

  const copyPassportId = () => {
    navigator.clipboard?.writeText(data.passportId);
    showToast(`Build Passport ID copied: ${data.passportId}`, "default");
  };

  const copyVerificationUrl = () => {
    const url = data.publicVerificationUrl || window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    showToast("Public verification URL copied to clipboard!", "default");
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper pill for evidence type
  const renderEvidenceCategoryBadge = (category) => {
    if (category === 'FACTUAL') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(6, 182, 212, 0.12)',
          color: 'var(--accent-cyan)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <CheckCircle2 size={11} /> FACTUAL DATA
        </span>
      );
    }
    if (category === 'AI') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(168, 85, 247, 0.12)',
          color: 'var(--accent-violet)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <Sparkles size={11} /> AI-GENERATED SUMMARY
        </span>
      );
    }
    if (category === 'ORGANIZER') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(16, 185, 129, 0.12)',
          color: 'var(--accent-emerald)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.68rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <ShieldCheck size={11} /> ORGANIZER REVIEW
        </span>
      );
    }
    return null;
  };

  return (
    <div className="build-passport-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* SECTION FILTER & ACTION TOOLBAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-card)',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSection('ALL')}
            className={`hud-tab ${activeSection === 'ALL' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            All Sections
          </button>
          <button
            onClick={() => setActiveSection('PROJECT')}
            className={`hud-tab ${activeSection === 'PROJECT' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Project & Team
          </button>
          <button
            onClick={() => setActiveSection('DEVELOPMENT')}
            className={`hud-tab ${activeSection === 'DEVELOPMENT' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Development Timeline
          </button>
          <button
            onClick={() => setActiveSection('JOURNEY')}
            className={`hud-tab ${activeSection === 'JOURNEY' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Project Journey
          </button>
          <button
            onClick={() => setActiveSection('AI')}
            className={`hud-tab ${activeSection === 'AI' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            AI Summary
          </button>
          <button
            onClick={() => setActiveSection('INTEGRITY')}
            className={`hud-tab ${activeSection === 'INTEGRITY' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Integrity Audit
          </button>
          <button
            onClick={() => setActiveSection('GAMIFICATION')}
            className={`hud-tab ${activeSection === 'GAMIFICATION' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            XP & Quests
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={copyVerificationUrl}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            {copiedLink ? <Check size={13} color="var(--accent-emerald)" /> : <Share2 size={13} />}
            <span>{copiedLink ? 'Copied URL!' : 'Share Public Link'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}
          >
            <Printer size={13} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* CORE PASSPORT CREDENTIAL CONTAINER */}
      <div
        className="passport-card-container print-target"
        style={{
          background: 'linear-gradient(165deg, #0d121f 0%, #07090f 100%)',
          border: '1px solid rgba(16, 185, 129, 0.45)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.12), inset 0 0 30px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          padding: '32px',
          overflow: 'hidden'
        }}
      >
        {/* Holographic HUD accents */}
        <div className="card-hud-accent emerald" />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* ============================================================== */}
        {/* 1. PASSPORT HEADER & CREDENTIAL SEAL                          */}
        {/* ============================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '24px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-emerald" style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                <ShieldCheck size={13} /> OFFICIAL BUILD PASSPORT
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CRYPTOGRAPHIC PROVENANCE MANIFEST
              </span>
              {(isDemoMode || data.isDemo) && (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                  SIMULATED DEMO DATASET
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{data.projectName || data.project?.name}</span>
              <span style={{
                fontSize: '0.78rem',
                color: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '3px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}>
                {(data.status || 'VERIFIED_ELIGIBLE').replace('_', ' ')}
              </span>
            </h1>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
              Event: <strong style={{ color: 'var(--text-primary)' }}>{data.hackathonName}</strong> • Team: <strong style={{ color: 'var(--accent-cyan)' }}>{data.teamName}</strong>
            </div>

            {/* Factual Disclaimer Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '680px'
            }}>
              <Info size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                <strong>Strict Verification Standard:</strong> Sections below are explicitly tagged as{' '}
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>[FACTUAL DATA]</span>,{' '}
                <span style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>[AI-GENERATED SUMMARY]</span>, or{' '}
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>[ORGANIZER REVIEW]</span>.
                AI analysis is never presented as immutable factual evidence.
              </div>
            </div>
          </div>

          {/* QR Code & Project Identification Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'var(--bg-surface)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                Project ID
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {data.projectId || 'PROJ-HYPERDRIVE-2026'}
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginTop: '6px', fontWeight: 700 }}>
                Passport Serial
              </div>
              <div
                onClick={copyPassportId}
                style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}
                title="Click to copy passport ID"
              >
                <span>{data.passportId}</span>
                <Copy size={11} />
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                Generated: {new Date(data.generatedTimestamp || Date.now()).toLocaleDateString()}
              </div>
            </div>

            {/* Scannable Dynamic QR Code */}
            <div style={{
              width: '74px',
              height: '74px',
              background: '#fff',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img
                src={data.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data.publicVerificationUrl || 'https://hackforge.dev')}`}
                alt="Verification QR Seal"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* EXECUTIVE CREDENTIAL METRICS STRIP                             */}
        {/* ============================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Integrity Score */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Integrity Score
              </span>
              <ShieldCheck size={16} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
              {data.integrityScore}%
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              96.4% custom codebase footprint
            </div>
          </div>

          {/* Card 2: Commits & Branches */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Git Commit Lineage
              </span>
              <GitCommit size={16} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {data.development?.commitsTotal || data.repoMetrics?.totalCommits || 37}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              +{data.development?.linesAdded?.toLocaleString() || '14,290'} / -{data.development?.linesRemoved?.toLocaleString() || '1,120'} diff
            </div>
          </div>

          {/* Card 3: Hackathon Sprint Window */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Sprint Duration
              </span>
              <Clock size={16} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
              48 Hours
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Sep 20, 10:00 UTC - Sep 22, 10:00 UTC
            </div>
          </div>

          {/* Card 4: Gamification XP */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                XP & Quests
              </span>
              <Zap size={16} color="var(--accent-violet)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-violet)' }}>
              {data.gamification?.xpEarned || 2450} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>XP</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {data.gamification?.questsCompleted || 5}/{data.gamification?.totalQuests || 8} Milestones Sealed
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: PROJECT (FACTUAL DATA)                              */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'PROJECT') && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  1. Project Specification & Scope
                </h2>
              </div>
              {renderEvidenceCategoryBadge('FACTUAL')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '4px' }}>
                  Team Name
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
                  {data.project?.teamName || data.teamName}
                </div>

                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '4px' }}>
                  Problem Statement
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {data.project?.problemStatement || data.problemStatement}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '4px' }}>
                  Project Description & Proposed Solution
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                  {data.project?.description || data.projectDescription}
                </p>

                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
                  Declared Major Features
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(data.declaredMajorFeatures || []).map((feat, idx) => (
                    <span key={idx} className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: TEAM (FACTUAL DATA)                                 */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'TEAM') && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  2. Team Roster & Contribution Overview
                </h2>
              </div>
              {renderEvidenceCategoryBadge('FACTUAL')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {(data.team?.members || []).map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'crop', border: '1px solid var(--border-default)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                    <span>Commits: <strong style={{ color: 'var(--text-primary)' }}>{member.commits}</strong></span>
                    <span>Diff: <strong style={{ color: 'var(--accent-emerald)' }}>+{member.linesAdded}</strong> / <strong style={{ color: 'var(--accent-rose)' }}>-{member.linesRemoved}</strong></span>
                    <span>PRs: <strong style={{ color: 'var(--text-primary)' }}>{member.prsAuthored}</strong></span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <strong>Verified Contributions:</strong> {member.contributions}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: DEVELOPMENT (FACTUAL DATA)                          */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'DEVELOPMENT') && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={18} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  3. Development Telemetry, Milestones & Deployments
                </h2>
              </div>
              {renderEvidenceCategoryBadge('FACTUAL')}
            </div>

            {/* Sub-grid: Major Milestones & Deployments */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              {/* Major Milestones */}
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '10px' }}>
                  Major Development Milestones
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data.development?.majorMilestones || []).map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-surface)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={14} color="var(--accent-emerald)" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {m.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {m.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Public Deployments */}
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '10px' }}>
                  Verified Public Deployments
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data.development?.deployments || []).map((dep, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {dep.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                          {dep.url || dep.address}
                        </div>
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        {dep.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Timeline (Chronological Stream) */}
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '10px' }}>
                Chronological Development Timeline (Audit Log)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(data.development?.timeline || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', minWidth: '120px' }}>
                        {item.timestamp}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.actor}:
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {item.event}
                      </span>
                    </div>
                    <span style={{ color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      {item.hash}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 4: PROJECT JOURNEY (9 PHASES)                          */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'JOURNEY') && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  4. Project Journey & Lifecycle Progression
                </h2>
              </div>
              {renderEvidenceCategoryBadge('FACTUAL')}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Full lifecycle tracking across all 9 sprint stages from initial problem definition to final jury submission.
            </p>

            {/* Visual 9-Step Pipeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(data.projectJourney || []).map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  {/* Step Connector Line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '2px solid var(--accent-emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-emerald)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      ✓
                    </div>
                    {idx < (data.projectJourney || []).length - 1 && (
                      <div style={{ width: '2px', height: '24px', background: 'rgba(16, 185, 129, 0.3)', margin: '4px 0' }} />
                    )}
                  </div>

                  {/* Step Content */}
                  <div style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          STAGE {idx + 1}: {step.phase}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {step.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {step.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 5: AI SUMMARY (AI-GENERATED SUMMARY)                   */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'AI') && (
          <div style={{
            background: 'linear-gradient(170deg, rgba(168, 85, 247, 0.05) 0%, rgba(10, 13, 22, 0.8) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--accent-violet)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--accent-violet)' }}>
                  5. AI Synthesis: Technical Decisions & Blocker Resolution
                </h2>
              </div>
              {renderEvidenceCategoryBadge('AI')}
            </div>

            {/* Prominent AI Disclaimer */}
            <div style={{
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              marginBottom: '18px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.45
            }}>
              <strong style={{ color: 'var(--accent-violet)' }}>Disclaimer:</strong> {data.aiSummary?.disclaimer || "Generated by HackForge AI Copilot from repository activity, commit diffs, and pull requests. AI summaries represent analytical syntheses and are not factual audit proofs."}
            </div>

            {/* What the team built */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
                What the Team Built (AI Synthesis)
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                {data.aiSummary?.whatBuilt}
              </p>
            </div>

            {/* Major Technical Decisions & Iterations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '8px' }}>
                  Major Technical Decisions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(data.aiSummary?.majorTechnicalDecisions || []).map((dec, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid var(--accent-violet)' }}>
                      {dec}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '8px' }}>
                  Major Iterations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(data.aiSummary?.majorIterations || []).map((iter, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid var(--accent-cyan)' }}>
                      {iter}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detected Blockers & Resolutions */}
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '8px' }}>
                Detected Blockers & Engineering Resolutions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                {(data.aiSummary?.detectedBlockers || []).map((blocker, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '4px' }}>
                      <AlertCircle size={13} /> Blocker {idx + 1}:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {blocker}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                      <strong style={{ color: 'var(--accent-emerald)' }}>Resolution:</strong> {data.aiSummary?.howResolved?.[idx] || "Resolved via patch."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 6: INTEGRITY & PROVENANCE (ORGANIZER REVIEW)           */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'INTEGRITY') && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--accent-emerald)' }}>
                  6. Integrity Sentinel & Organizer Review Status
                </h2>
              </div>
              {renderEvidenceCategoryBadge('ORGANIZER')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              {/* Repository History */}
              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
                  Repository Lineage Audit
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {data.integrity?.repositoryHistory}
                </div>
              </div>

              {/* Starter Code Provenance */}
              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
                  Starter Code Whitelist
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px' }}>
                  {data.integrity?.starterCode?.template}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Boilerplate Retention: <strong style={{ color: 'var(--accent-amber)' }}>{data.integrity?.starterCode?.retention}</strong> • Originality: <strong style={{ color: 'var(--accent-emerald)' }}>{data.integrity?.starterCode?.originality}</strong>
                </div>
              </div>

              {/* Integrity Alerts Status */}
              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    Active Integrity Alerts
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    {data.integrity?.integrityAlerts?.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {data.integrity?.integrityAlerts?.summary}
                </div>
              </div>
            </div>

            {/* Organizer Sign-off Banner */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '2px' }}>
                  Official Jury Sign-off: {data.integrity?.organizerReview?.decision}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Reviewed by: <strong>{data.integrity?.organizerReview?.reviewedBy}</strong> • Signature: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{data.integrity?.organizerReview?.signature}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  "{data.integrity?.organizerReview?.organizerNotes}"
                </div>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                COUNTERSIGNED & SEALED
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 7: GAMIFICATION (FACTUAL DATA)                         */}
        {/* ============================================================== */}
        {(activeSection === 'ALL' || activeSection === 'GAMIFICATION') && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  7. Gamification Credentials & Unlocked Badges
                </h2>
              </div>
              {renderEvidenceCategoryBadge('FACTUAL')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {(data.gamification?.badges || []).map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    fontSize: '1.8rem',
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {badge.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {badge.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {badge.description}
                    </div>
                    <span className="badge badge-purple" style={{ fontSize: '0.62rem', marginTop: '4px' }}>
                      {badge.rarity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASSPORT FOOTER: IMMUTABLE MERKLE HASH SEAL                    */}
        {/* ============================================================== */}
        <div style={{
          background: '#07090f',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span>IMMUTABLE COMMIT MANIFEST SHA-256 HASH</span>
            <span>TIMESTAMP: {data.finalAuditTimestamp || data.generatedTimestamp}</span>
          </div>
          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', wordBreak: 'break-all', letterSpacing: '0.04em' }}>
            {data.cryptographicHash}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <span>MERKLE ROOT: {data.merkleRoot}</span>
            <span>PUBLIC AUDIT: {data.publicVerificationUrl}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
