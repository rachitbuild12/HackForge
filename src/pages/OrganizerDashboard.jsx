import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, GitCommit, ShieldAlert, Award, ArrowRight, PlusCircle, ExternalLink } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import IntegrityAlert from '../components/IntegrityAlert';

export default function OrganizerDashboard() {
  const { organizerMetrics, hackathons, integrityAlerts } = useHackForge();

  const activeAlerts = integrityAlerts.filter(a => a.status === 'INVESTIGATING');

  return (
    <div className="page-wrapper">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-violet">
              <Shield size={12} /> ORGANIZER CONTROL PLATFORM
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              MULTI-TENANT TELEMETRY
            </span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Hackathon Organizer Hub</h1>
          <p className="page-subtitle">
            Configure hackathon rules, monitor team velocities in real-time, and audit competition integrity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/organizer/create" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: '#000', fontWeight: 700, border: 'none', boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
            <PlusCircle size={16} strokeWidth={2.5} />
            <span>Create Hackathon</span>
          </Link>
          <Link to="/organizer/hackathons/eth-global-2026/integrity" className="btn btn-danger">
            <ShieldAlert size={16} />
            <span>Integrity Sentinel ({activeAlerts.length})</span>
          </Link>
          <Link to="/organizer/hackathons/eth-global-2026" className="btn btn-primary" style={{ boxShadow: '0 0 16px rgba(16,185,129,0.3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
            <span>Command Center</span>
          </Link>
        </div>
      </div>

      {/* Organizer Telemetry KPI Grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REGISTERED SQUADS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {organizerMetrics.totalTeams}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {organizerMetrics.activeBuilds} squads currently pushing commits
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TOTAL COMMIT STREAM</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {organizerMetrics.totalCommits.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {organizerMetrics.linesWrittenTotal} lines verified
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BUILD PASSPORTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-violet)', marginTop: '4px' }}>
            {organizerMetrics.passportsGenerated} / {organizerMetrics.totalTeams}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {organizerMetrics.submissionsPending} pending completion
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INTEGRITY RISKS FLAGGED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: activeAlerts.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginTop: '4px' }}>
            {activeAlerts.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Avg Competition Integrity: {organizerMetrics.averageIntegrityScore}%
          </div>
        </div>
      </div>

      {/* Managed Hackathons Table */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Active & Scheduled Hackathons</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Select an instance to configure rules, manage problem statements, and view jury queues.
            </p>
          </div>
          <Link to="/organizer/create" className="btn btn-secondary btn-sm">
            <PlusCircle size={14} />
            <span>Host New Hackathon</span>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {hackathons.map(h => (
            <div
              key={h.id}
              style={{
                background: 'var(--bg-surface)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={h.banner} alt={h.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{h.title}</span>
                    <span className={`badge ${h.status === 'LIVE' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.62rem' }}>
                      {h.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bounty: <strong style={{ color: 'var(--accent-emerald)' }}>{h.prizePool}</strong> • {h.participantsCount} Builders • {h.teamsCount} Squads
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/organizer/hackathons/${h.id}/integrity`} className="btn btn-secondary btn-sm">
                  <ShieldAlert size={13} color="var(--accent-rose)" />
                  <span>Integrity Sentinel</span>
                </Link>
                <Link to={`/organizer/hackathons/${h.id}`} className="btn btn-primary btn-sm">
                  <span>Command Center</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Integrity Alerts Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="var(--accent-rose)" />
              <span>Urgent Integrity Sentinel Alerts</span>
            </h3>
          </div>
          <Link to="/organizer/hackathons/eth-global-2026/integrity" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
            Full Sentinel Feed <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {integrityAlerts.slice(0, 2).map(alert => (
            <IntegrityAlert key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

    </div>
  );
}
