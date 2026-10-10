import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Filter,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Info,
  Search,
  RefreshCw,
  GitBranch,
  Layers,
  FileCheck,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Play
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import IntegrityAlert from '../components/IntegrityAlert';
import { analyzeRepositoryProvenance, WHITELISTED_STARTERS } from '../utils/integrityProvenanceEngine';

export default function IntegrityMonitoring() {
  const { id } = useParams();
  const {
    integrityAlerts,
    addIntegrityAlert,
    activeHackathon,
    team,
    showToast
  } = useHackForge();

  // Filter state
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live provenance test scanner modal state
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanTeamName, setScanTeamName] = useState('AuraPay Protocol');
  const [scanRepoUrl, setScanRepoUrl] = useState('https://github.com/aurapay/payment-channel-engine');
  const [scanDeclaredFeatures, setScanDeclaredFeatures] = useState('payment engine, multi-token routing, ZK state proofs');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Compute provenance statistics
  const stats = useMemo(() => {
    const total = integrityAlerts.length;
    const highPriority = integrityAlerts.filter(a => a.classification === 'HIGH_PRIORITY_REVIEW').length;
    const reviewRecommended = integrityAlerts.filter(a => a.classification === 'REVIEW_RECOMMENDED').length;
    const lowConcern = integrityAlerts.filter(a => a.classification === 'LOW_CONCERN').length;
    const awaitingExplanation = integrityAlerts.filter(a => a.status === 'EXPLANATION_REQUESTED').length;
    const resolved = integrityAlerts.filter(a => ['EXPLAINED', 'ALLOWED', 'ESCALATED'].includes(a.status)).length;

    return {
      total,
      highPriority,
      reviewRecommended,
      lowConcern,
      awaitingExplanation,
      resolved
    };
  }, [integrityAlerts]);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return integrityAlerts.filter(alert => {
      // Classification / status filter
      if (activeFilter === 'HIGH_PRIORITY' && alert.classification !== 'HIGH_PRIORITY_REVIEW') return false;
      if (activeFilter === 'REVIEW_RECOMMENDED' && alert.classification !== 'REVIEW_RECOMMENDED') return false;
      if (activeFilter === 'LOW_CONCERN' && alert.classification !== 'LOW_CONCERN') return false;
      if (activeFilter === 'AWAITING_EXPLANATION' && alert.status !== 'EXPLANATION_REQUESTED') return false;
      if (activeFilter === 'RESOLVED' && !['EXPLAINED', 'ALLOWED', 'ESCALATED'].includes(alert.status)) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTeam = (alert.teamName || '').toLowerCase().includes(q);
        const matchesReason = (alert.reason || '').toLowerCase().includes(q);
        const matchesAction = (alert.recommendedAction || '').toLowerCase().includes(q);
        return matchesTeam || matchesReason || matchesAction;
      }

      return true;
    });
  }, [integrityAlerts, activeFilter, searchQuery]);

  // Execute interactive provenance audit
  const handleExecuteScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const featuresArray = scanDeclaredFeatures.split(',').map(s => s.trim()).filter(Boolean);
      
      const sampleCommits = [
        { hash: "9a12c8e", message: "Initial payment gateway contracts and routing engine", timestamp: "2026-09-18T14:10:00Z", additions: 4280 },
        { hash: "f3b7d10", message: "Add payment channel settlement logic", timestamp: "2026-09-19T11:20:00Z", additions: 1820 }
      ];

      const sampleFiles = [
        { path: "src/engine/payment_channel.ts", additions: 840, firstObserved: "2026-09-18" },
        { path: "src/engine/escrow_settler.ts", additions: 620, firstObserved: "2026-09-18" },
        { path: "src/engine/multi_token_router.ts", additions: 710, firstObserved: "2026-09-18" },
        { path: "contracts/PaymentVault.sol", additions: 590, firstObserved: "2026-09-18" },
        { path: "package.json", additions: 45, firstObserved: "2026-09-18" }
      ];

      const result = analyzeRepositoryProvenance({
        hackathonStartsAt: activeHackathon?.startsAt || "2026-09-20T10:00:00Z",
        repoCreatedAt: "2026-09-18T14:10:00Z",
        repoHistory: sampleCommits,
        fileHistory: sampleFiles,
        problemStatement: activeHackathon?.title || "Autonomous Agent-to-Agent Micro-Settlement Protocol",
        projectDescription: "High-speed payment routing and escrow settlement engine",
        declaredMajorFeatures: featuresArray,
        allowedStarters: WHITELISTED_STARTERS
      });

      setScanResult(result);
      setIsScanning(false);
      showToast(`Provenance analysis complete: ${result.concernLevel}`, "default");
    }, 700);
  };

  // Add scan result to active review queue
  const handleAdoptScanResult = () => {
    if (!scanResult) return;
    const newAlert = {
      id: `alert-provenance-${Date.now()}`,
      teamName: scanTeamName,
      teamId: `team-${Date.now()}`,
      repoUrl: scanRepoUrl,
      classification: scanResult.classification,
      concernLevel: scanResult.concernLevel,
      severity: scanResult.classification === 'HIGH_PRIORITY_REVIEW' ? 'CRITICAL' : scanResult.classification === 'REVIEW_RECOMMENDED' ? 'MEDIUM' : 'LOW',
      reason: scanResult.reason,
      evidence: {
        filesCount: scanResult.evidence.preHackathonFilesCount || scanResult.relevantFiles.length,
        firstObservedDate: scanResult.evidence.firstObservedDate,
        hackathonStartDate: scanResult.evidence.hackathonStartDate,
        hoursPredating: scanResult.evidence.hoursBeforeStart,
        totalLines: 4280,
        summary: scanResult.evidence.summary
      },
      relevantFiles: scanResult.relevantFiles,
      relevantCommits: scanResult.relevantCommits,
      declaredFeatures: scanDeclaredFeatures.split(',').map(s => s.trim()),
      confidence: scanResult.confidence,
      recommendedAction: scanResult.recommendedAction,
      flaggedAt: "Just now",
      status: "INVESTIGATING",
      organizerNotes: ""
    };

    if (addIntegrityAlert) {
      addIntegrityAlert(newAlert);
    }
    setScanModalOpen(false);
    setScanResult(null);
  };

  return (
    <div className="workspace-layout">
      <Sidebar mode="organizer" />

      <main className="workspace-content" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* ================================================================ */}
        {/* HEADER: ORGANIZER PROVENANCE COMMAND CENTER                      */}
        {/* ================================================================ */}
        <div className="page-header" style={{ marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={12} />
                <span>BUILD PROVENANCE & INTEGRITY ANALYSIS</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ORGANIZER AUDIT CONSOLE
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', marginBottom: '4px' }}>Build Provenance & Integrity Review</h1>
            <p className="page-subtitle">
              Automated anomaly pattern detection with human organizer review. Transparency, not automatic punishment.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setScanModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Play size={13} color="var(--accent-cyan)" />
              <span>Run Provenance Audit</span>
            </button>

            <button
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.78rem' }}
              onClick={() => showToast("Dispatched provenance background rescan for 196 participant squads.", "default")}
            >
              <RefreshCw size={13} />
              <span>Global Forensic Rescan</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CORE PRODUCT PRINCIPLE BANNER (MANDATORY REQUIREMENT)            */}
        {/* "The system must NEVER claim: 'This project is definitely        */}
        {/* cheating.' It should only identify suspicious patterns and send  */}
        {/* them to organizers for human review."                            */}
        {/* ================================================================ */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}
        >
          <Info size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Core Philosophy: Transparency, Not Automatic Punishment
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              HackForge Sentinel <strong>never claims a project is definitely cheating</strong>, nor does it compute a generic "cheating score." It transparently highlights anomalous patterns (pre-existing code, bulk drops, starter code exemptions) and provides actionable evidence for organizers to investigate. <strong>Teams are never automatically disqualified.</strong>
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PROVENANCE METRICS RADAR BAR                                     */}
        {/* ================================================================ */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {/* High Priority Review */}
          <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              HIGH PRIORITY REVIEW
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {stats.highPriority}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Massive drops / early monolithic features
            </div>
          </div>

          {/* Review Recommended */}
          <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              REVIEW RECOMMENDED
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {stats.reviewRecommended}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Pre-hackathon code or scope mismatch
            </div>
          </div>

          {/* Low Concern / Verified */}
          <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              LOW CONCERN
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {stats.lowConcern}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Compliant sprint commit progression
            </div>
          </div>

          {/* Inquiries Dispatched */}
          <div className="card" style={{ background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AWAITING EXPLANATION
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              {stats.awaitingExplanation}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Inquiries dispatched to team workspaces
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* APPROVED STARTER CODE POLICY REFERENCE                           */}
        {/* ================================================================ */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCheck size={18} color="var(--accent-emerald)" />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Starter Code Policy: Whitelisted Boilerplates Automatically Exempt
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Next.js Wagmi Web3 Starter, Foundry Smart Contracts, and FastAPI Agent Scaffold are whitelisted. Known template files are never flagged.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>3 Whitelisted Templates</span>
            <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>Post-Start Delta Tracked</span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* FILTER BAR & SEARCH INPUT                                        */}
        {/* ================================================================ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Classification Filter Tabs */}
          <div className="hud-tabs">
            {[
              { id: 'ALL', label: `All Reports (${stats.total})` },
              { id: 'HIGH_PRIORITY', label: `High Priority (${stats.highPriority})` },
              { id: 'REVIEW_RECOMMENDED', label: `Review Recommended (${stats.reviewRecommended})` },
              { id: 'LOW_CONCERN', label: `Low Concern (${stats.lowConcern})` },
              { id: 'AWAITING_EXPLANATION', label: `Awaiting Reply (${stats.awaitingExplanation})` },
              { id: 'RESOLVED', label: `Resolved (${stats.resolved})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`hud-tab ${activeFilter === tab.id ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '6px 14px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search team or feature..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.8rem', height: '36px' }}
            />
          </div>
        </div>

        {/* ================================================================ */}
        {/* PROVENANCE ALERT STREAM (HUMAN ORGANIZER REVIEW QUEUE)           */}
        {/* ================================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredAlerts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--bg-surface)' }}>
              <ShieldCheck size={40} color="var(--accent-emerald)" style={{ margin: '0 auto 12px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No Provenance Incidents Found</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}>
                No teams match the current filter. All participant repositories analyzed are operating within expected originality parameters.
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <IntegrityAlert key={alert.id} alert={alert} />
            ))
          )}
        </div>

        {/* ================================================================ */}
        {/* INTERACTIVE PROVENANCE AUDIT SCANNER MODAL                       */}
        {/* ================================================================ */}
        {scanModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card" style={{ maxWidth: '640px', width: '100%', padding: '28px', background: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Run Provenance & Integrity Audit</h3>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setScanModalOpen(false)}>×</button>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                Input repository parameters to execute the 5 provenance analysis modules (Pre-hackathon activity, Feature scope correlation, Timeline bursts, Starter code exemption, and Integrity concern classification).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    value={scanTeamName}
                    onChange={e => setScanTeamName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Repository URL</label>
                  <input
                    type="text"
                    value={scanRepoUrl}
                    onChange={e => setScanRepoUrl(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Declared Major Features (comma separated)</label>
                  <input
                    type="text"
                    value={scanDeclaredFeatures}
                    onChange={e => setScanDeclaredFeatures(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Scan Results Preview */}
              {scanResult && (
                <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className={`badge ${scanResult.classification === 'HIGH_PRIORITY_REVIEW' ? 'badge-rose' : scanResult.classification === 'REVIEW_RECOMMENDED' ? 'badge-amber' : 'badge-emerald'}`}>
                      {scanResult.concernLevel}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence: {scanResult.confidence}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
                    Reason: {scanResult.reason}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Evidence: {scanResult.evidence.summary}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                    Recommended Action: {scanResult.recommendedAction}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setScanModalOpen(false)}>
                  Close
                </button>

                {!scanResult ? (
                  <button type="button" onClick={handleExecuteScan} disabled={isScanning} className="btn btn-primary btn-sm">
                    {isScanning ? <RefreshCw size={13} className="spin" /> : <Play size={13} />}
                    <span>{isScanning ? 'Executing 5 Modules...' : 'Analyze Provenance'}</span>
                  </button>
                ) : (
                  <button type="button" onClick={handleAdoptScanResult} className="btn btn-primary btn-sm">
                    <CheckCircle2 size={13} />
                    <span>Add to Review Queue</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
