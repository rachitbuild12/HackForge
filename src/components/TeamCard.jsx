import React from 'react';
import { GitBranch, GitCommit, Trophy, Users, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamCard({ team, hackathonId = 'eth-global-2026' }) {
  return (
    <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="card-hud-accent cyan" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-cyan-dim)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            {team.avatar || '⚡'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>{team.name}</h3>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                Rank #{team.leaderboardRank}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {team.problemStatementTitle || 'General Track'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          <Zap size={15} fill="currentColor" />
          <span>{team.xpEarned?.toLocaleString()} XP</span>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
        {team.slogan}
      </p>

      {/* Team Roster Avatars & Role Pills */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          Team Roster ({team.members?.length} Builders)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {team.members?.map((member, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={member.avatar} alt={member.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{member.name}</span>
              </div>
              <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Repository Health */}
      <div style={{ background: 'var(--bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <GitBranch size={14} color="var(--accent-emerald)" />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{team.branch || 'main'}</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>{team.commitsCount} commits</span>
        </div>
        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
          <ShieldCheck size={11} /> {team.integrityScore}% Integrity
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/hackathons/${hackathonId}/team`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
          <Users size={13} /> Manage Roster
        </Link>
        <Link to={`/hackathons/${hackathonId}/quests`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          <Zap size={13} fill="currentColor" /> Team Quests
        </Link>
      </div>
    </div>
  );
}
