import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HackathonCard({ hackathon }) {
  const isLive = hackathon.status === 'LIVE';

  return (
    <div className="card interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      {isLive && <div className="card-hud-accent" />}
      
      <div>
        {/* Banner image with overlay */}
        <div style={{ position: 'relative', height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '16px' }}>
          <img
            src={hackathon.banner}
            alt={hackathon.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,26,0.95) 0%, rgba(14,17,26,0.2) 100%)' }} />

          {/* Status pill top left */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <span className={`badge ${isLive ? 'badge-emerald' : 'badge-amber'}`}>
              <span className={`pulse-dot ${isLive ? '' : 'warning'}`} />
              {hackathon.status}
            </span>
          </div>

          {/* Prize pool top right */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              <Trophy size={13} />
              <span>{hackathon.prizePool}</span>
            </div>
          </div>

          {/* Time left pill bottom left */}
          <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px' }}>
            <Clock size={12} />
            <span>{hackathon.timeLeft}</span>
          </div>
        </div>

        {/* Content */}
        <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>
          <Link to={`/hackathons/${hackathon.id}`} style={{ color: 'var(--text-primary)' }}>
            {hackathon.title}
          </Link>
        </h3>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
          {hackathon.tagline}
        </p>

        {/* Tracks chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(hackathon.tracks || hackathon.problemStatements?.map(ps => ({ name: ps.track || ps.title })) || []).slice(0, 3).map((track, i) => (
            <span key={i} className="badge badge-muted" style={{ textTransform: 'none' }}>
              {track.name || track.title || 'General'}
            </span>
          ))}
          {((hackathon.tracks || hackathon.problemStatements || []).length > 3) && (
            <span className="badge badge-muted">+{(hackathon.tracks || hackathon.problemStatements).length - 3}</span>
          )}
        </div>
      </div>

      {/* Footer info & CTA */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={13} /> {hackathon.teamsCount} teams
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
            <ShieldCheck size={13} /> Passport Ready
          </span>
        </div>

        <Link to={`/hackathons/${hackathon.id}`} className="btn btn-primary btn-sm">
          <span>Participate & Join</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
