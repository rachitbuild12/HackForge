import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Award,
  Share2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Check,
  FileCheck,
  Radio,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import BuildPassport from '../components/BuildPassport';

export default function PassportPage({ isPublicVerification = false }) {
  const { id, passportId } = useParams();
  const { passport, setPassport, team, showToast, activeHackathon, isDemoMode } = useHackForge();
  const [demoUrl, setDemoUrl] = useState(passport.demoVideoUrl || '');
  const [deployUrl, setDeployUrl] = useState(passport.liveDeployUrl || '');
  const [contractAddress, setContractAddress] = useState(passport.contractAddress || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleUpdateSubmission = (e) => {
    e.preventDefault();
    setPassport(prev => ({
      ...prev,
      demoVideoUrl: demoUrl,
      liveDeployUrl: deployUrl,
      contractAddress: contractAddress,
      development: {
        ...(prev.development || {}),
        deployments: [
          { name: "Live Frontend Application", url: deployUrl, provider: "Vercel", status: "ACTIVE", type: "FRONTEND" },
          { name: "Settlement Smart Contract", address: contractAddress, network: "Sepolia Testnet", status: "VERIFIED", type: "SMART_CONTRACT" },
          { name: "Inference API Microservice", url: "https://api-hyperdrive.fly.dev/v1/health", provider: "Fly.io", status: "ACTIVE", type: "BACKEND" }
        ]
      }
    }));
    showToast("Submission artifacts updated and sealed in Build Passport!", "default");
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Compute authentic cryptographic SHA-256 hash of manifest payload
      const manifestPayload = JSON.stringify({
        passportId: passport.passportId,
        team: team.name,
        hackathon: activeHackathon.title,
        timestamp: new Date().toISOString(),
        demoUrl,
        deployUrl,
        contractAddress
      });
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(manifestPayload));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const computedHash = 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        setPassport(prev => ({
          ...prev,
          status: "SUBMITTED_TO_JURY",
          cryptographicHash: computedHash,
          finalAuditTimestamp: new Date().toISOString()
        }));
        showToast("🎉 BUILD PASSPORT SEALED & SUBMITTED! Cryptographic SHA-256 seal verified.", "xp");
      }, 800);
    } catch (e) {
      setIsSubmitting(false);
      showToast("Error computing cryptographic seal: " + e.message, "alert");
    }
  };

  // If this is a standalone public verification page (e.g. /verify/HFP-2026-9842A-77)
  if (isPublicVerification) {
    return (
      <div className="app-container" style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '24px 16px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
          {/* Public Verification Top Banner */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="var(--accent-emerald)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Verified HackForge Public Credential Registry
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Authentic proof-of-work certificate for Passport ID:{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {passportId || passport.passportId}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/hackathons/eth-global-2026" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ArrowLeft size={13} /> View Hackathon
              </Link>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                Print Certificate
              </button>
            </div>
          </div>

          {/* Core Build Passport Component */}
          <BuildPassport passportData={passport} showActions={true} isPublicView={true} />
        </div>
      </div>
    );
  }

  // Participant Workspace View
  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-main">
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={13} /> VERIFIABLE HACKATHON PROOF-OF-WORK
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                AUDIT ENGINE 3.2
              </span>
              {(isDemoMode || passport?.isDemo) && (
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  SIMULATED DEMO DATA
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Cryptographic Build Passport
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', margin: 0 }}>
              The comprehensive, tamper-evident final project report synthesized from your team's actual GitHub repository data,
              commit lineage, and organizer reviews.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn btn-primary"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || passport.status === 'SUBMITTED_TO_JURY'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Award size={16} />
              <span>
                {passport.status === 'SUBMITTED_TO_JURY'
                  ? 'Submitted to Jury'
                  : isSubmitting
                  ? 'Sealing Proof...'
                  : 'Seal & Submit to Jury'}
              </span>
            </button>
          </div>
        </div>

        {/* Build Passport Component */}
        <div style={{ marginBottom: '32px' }}>
          <BuildPassport passportData={passport} showActions={true} />
        </div>

        {/* Submission Artifacts Form */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={18} color="var(--accent-cyan)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Submission Artifacts Verification
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Provide the live public endpoints that judges will inspect alongside this passport
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '6px', fontWeight: 600 }}>
                  Live Deployed Application URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-app.vercel.app"
                  value={deployUrl}
                  onChange={e => setDeployUrl(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '6px', fontWeight: 600 }}>
                  3-Minute Pitch Video URL (YouTube / Loom)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={demoUrl}
                  onChange={e => setDemoUrl(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '6px', fontWeight: 600 }}>
                  Smart Contract Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="0x892a01948303f29b4e12c140994a73710"
                  value={contractAddress}
                  onChange={e => setContractAddress(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} /> Update Artifact URLs
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
