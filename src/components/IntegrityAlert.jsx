import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  GitCommit,
  MessageSquare,
  ArrowUpRight,
  ShieldAlert,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function IntegrityAlert({ alert }) {
  const { resolveIntegrityAlert, showToast } = useHackForge();

  const [expandedFiles, setExpandedFiles] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState(
    alert.recommendedAction 
      ? `Hi ${alert.teamName} team,\n\nDuring our automated repository provenance audit, we noticed the following pattern:\n"${alert.reason}"\n\nCould you please share a brief note clarifying the origin and role of these files? Thank you!`
      : `Hi ${alert.teamName} team, please provide clarification on repository history.`
  );

  // Classification Pill Styling
  const getClassificationMeta = (classification) => {
    switch (classification) {
      case 'HIGH_PRIORITY_REVIEW':
        return {
          pill: 'badge-rose',
          label: 'HIGH PRIORITY REVIEW',
          icon: <AlertTriangle size={13} />,
          border: 'rgba(244, 63, 94, 0.4)',
          bg: 'linear-gradient(145deg, rgba(244, 63, 94, 0.08) 0%, rgba(19, 23, 36, 0.95) 100%)',
          color: 'var(--accent-rose)'
        };
      case 'REVIEW_RECOMMENDED':
        return {
          pill: 'badge-amber',
          label: 'REVIEW RECOMMENDED',
          icon: <AlertCircle size={13} />,
          border: 'rgba(245, 158, 11, 0.4)',
          bg: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(19, 23, 36, 0.95) 100%)',
          color: 'var(--accent-amber)'
        };
      case 'LOW_CONCERN':
      default:
        return {
          pill: 'badge-emerald',
          label: 'LOW CONCERN',
          icon: <ShieldCheck size={13} />,
          border: 'rgba(16, 185, 129, 0.35)',
          bg: 'linear-gradient(145deg, rgba(16, 185, 129, 0.06) 0%, rgba(19, 23, 36, 0.95) 100%)',
          color: 'var(--accent-emerald)'
        };
    }
  };

  const meta = getClassificationMeta(alert.classification);

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    resolveIntegrityAlert(alert.id, 'EXPLANATION_REQUESTED', inquiryText);
    setInquiryModalOpen(false);
  };

  const isResolved = ['EXPLAINED', 'ALLOWED', 'ESCALATED'].includes(alert.status);

  return (
    <div
      className="card"
      style={{
        background: meta.bg,
        borderColor: meta.border,
        padding: '22px',
        position: 'relative',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Top Meta Header: Concern Level, Team, Timestamp, Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className={`badge ${meta.pill}`} style={{ fontWeight: 800, letterSpacing: '0.04em', fontSize: '0.72rem' }}>
            {meta.icon}
            <span>{meta.label}</span>
          </span>

          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {alert.teamName}
          </span>

          {alert.repoUrl && (
            <a
              href={alert.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>{alert.repoUrl.replace('https://github.com/', '')}</span>
              <ExternalLink size={11} />
            </a>
          )}

          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Flagged {alert.flaggedAt || 'Recently'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {alert.confidence && (
            <span className="badge badge-muted" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
              Confidence: {alert.confidence}
            </span>
          )}

          <span
            className="badge"
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              background: alert.status === 'EXPLAINED' ? 'rgba(16, 185, 129, 0.15)' : alert.status === 'ALLOWED' ? 'rgba(6, 182, 212, 0.15)' : alert.status === 'EXPLANATION_REQUESTED' ? 'rgba(245, 158, 11, 0.15)' : alert.status === 'ESCALATED' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: alert.status === 'EXPLAINED' ? 'var(--accent-emerald)' : alert.status === 'ALLOWED' ? 'var(--accent-cyan)' : alert.status === 'EXPLANATION_REQUESTED' ? 'var(--accent-amber)' : alert.status === 'ESCALATED' ? 'var(--accent-rose)' : 'var(--border-subtle)',
              color: alert.status === 'EXPLAINED' ? 'var(--accent-emerald)' : alert.status === 'ALLOWED' ? 'var(--accent-cyan)' : alert.status === 'EXPLANATION_REQUESTED' ? 'var(--accent-amber)' : alert.status === 'ESCALATED' ? 'var(--accent-rose)' : 'var(--text-secondary)'
            }}
          >
            STATUS: {alert.status?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* REASON: Transparent Non-Accusatory Assessment */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
          REASON
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', lineHeight: 1.45 }}>
          {alert.reason}
        </div>
      </div>

      {/* EVIDENCE: Concrete Dates, File Counts, Hackathon Start */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}
      >
        <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          EVIDENCE
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Files Identified: </span>
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {alert.evidence?.filesCount || alert.relevantFiles?.length || 0} files
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>First Observed: </span>
            <strong style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {alert.evidence?.firstObservedDate ? new Date(alert.evidence.firstObservedDate).toLocaleDateString() : '2026-09-18'}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hackathon Started: </span>
            <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {alert.evidence?.hackathonStartDate ? new Date(alert.evidence.hackathonStartDate).toLocaleDateString() : '2026-09-20'}
            </strong>
          </div>

          {alert.evidence?.totalLines && (
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Code Volume: </span>
              <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {alert.evidence.totalLines.toLocaleString()} lines
              </strong>
            </div>
          )}
        </div>

        {alert.evidence?.summary && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            {alert.evidence.summary}
          </p>
        )}
      </div>

      {/* RELEVANT FILES & COMMITS ACCORDION */}
      {alert.relevantFiles && alert.relevantFiles.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setExpandedFiles(!expandedFiles)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileCode size={13} />
            <span>{expandedFiles ? 'Hide Relevant Files & Commits' : `View ${alert.relevantFiles.length} Relevant Files & Commits`}</span>
            {expandedFiles ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {expandedFiles && (
            <div style={{ marginTop: '10px', background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', maxHeight: '220px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {alert.relevantFiles.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 8px',
                      background: f.isStarterAllowed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0, 0, 0, 0.25)',
                      borderRadius: '3px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: f.isStarterAllowed ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
                        {f.path}
                      </span>
                      {f.featureTag && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px', color: 'var(--text-muted)' }}>
                          {f.featureTag}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {f.isStarterAllowed ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
                          <FileCheck size={10} /> ALLOWED STARTER
                        </span>
                      ) : (
                        <span style={{ color: 'var(--accent-amber)', fontSize: '0.7rem' }}>
                          First observed: {f.firstObserved || 'pre-hackathon'}
                        </span>
                      )}
                      <span style={{ color: 'var(--text-muted)' }}>
                        +{f.additions || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECOMMENDED ACTION */}
      <div
        style={{
          background: 'rgba(6, 182, 212, 0.05)',
          borderLeft: '3px solid var(--accent-cyan)',
          padding: '10px 14px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          marginBottom: '16px',
          fontSize: '0.82rem',
          lineHeight: 1.45
        }}
      >
        <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '2px' }}>
          RECOMMENDED ORGANIZER ACTION
        </span>
        <strong style={{ color: 'var(--text-primary)' }}>{alert.recommendedAction}</strong>
      </div>

      {/* ORGANIZER INQUIRY / NOTES RECORD */}
      {alert.organizerNotes && (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Organizer Record: </strong>
          {alert.organizerNotes}
        </div>
      )}

      {/* ORGANIZER ACTION BAR (NO AUTOMATIC DISQUALIFICATION) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Transparency Protocol · Human Organizer Verification Only
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Action 1: Mark Explained */}
          <button
            type="button"
            onClick={() => resolveIntegrityAlert(alert.id, 'EXPLAINED', 'Team provided verified explanation of pre-configured utility modules.')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
            title="Mark as explained by participant team"
          >
            <CheckCircle2 size={13} color="var(--accent-emerald)" />
            <span>Mark Explained</span>
          </button>

          {/* Action 2: Mark Allowed */}
          <button
            type="button"
            onClick={() => resolveIntegrityAlert(alert.id, 'ALLOWED', 'Confirmed as approved starter boilerplate or open-source dependency.')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
            title="Mark as approved starter template or library"
          >
            <ShieldCheck size={13} color="var(--accent-cyan)" />
            <span>Mark Allowed</span>
          </button>

          {/* Action 3: Request Explanation */}
          <button
            type="button"
            onClick={() => setInquiryModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--accent-amber)' }}
            title="Dispatch polite inquiry to the team workspace"
          >
            <MessageSquare size={13} />
            <span>Request Explanation</span>
          </button>

          {/* Action 4: Escalate for Review */}
          <button
            type="button"
            onClick={() => resolveIntegrityAlert(alert.id, 'ESCALATED', 'Escalated to Head Organizer & Jury Lead panel for formal review before judging.')}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}
            title="Escalate to human jury lead for manual review"
          >
            <ShieldAlert size={13} />
            <span>Escalate for Review</span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* INQUIRY DISPATCH MODAL                                           */}
      {/* ================================================================ */}
      {inquiryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '24px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.15rem' }}>Request Explanation from {alert.teamName}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setInquiryModalOpen(false)}>×</button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              This inquiry will appear in the team's project workspace. The purpose is transparent communication, allowing the team to clarify their architecture without disruption.
            </p>

            <form onSubmit={handleSendInquiry}>
              <textarea
                rows={5}
                required
                value={inquiryText}
                onChange={e => setInquiryText(e.target.value)}
                className="form-textarea"
                style={{ width: '100%', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInquiryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={13} />
                  <span>Dispatch Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
