import React from 'react';
import { Zap, ShieldCheck, Trophy, Award, ExternalLink, Calendar, Code2, Sparkles, LogOut } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { useHackForge } from '../context/HackForgeContext';
import XPProgress from '../components/XPProgress';
import BadgeCard from '../components/BadgeCard';
import BuildPassport from '../components/BuildPassport';

export default function Profile() {
  const { user, passport, signOut } = useHackForge();

  const pastProjects = [
    {
      id: "p1",
      name: "HyperDrive Protocol",
      hackathon: "ETHGlobal Autonomous 2026",
      placement: "Active Contender",
      repo: "github.com/hyperdrive-protocol/settlement-engine",
      passportId: passport.passportId,
      integrityScore: 97.4,
      status: "CURRENT"
    },
    {
      id: "p2",
      name: "ZK-Aegis Guardrails",
      hackathon: "Nexus AI Agentic Hackathon 2026",
      placement: "🥇 1st Place Track Winner",
      repo: "github.com/alexchen-dev/zk-aegis",
      passportId: "HFP-2026-1104K-92",
      integrityScore: 98.8,
      status: "VERIFIED"
    },
    {
      id: "p3",
      name: "SolQuantum Micro-Router",
      hackathon: "DeFi Genesis Global 2025",
      placement: "🥉 3rd Place Overall",
      repo: "github.com/alexchen-dev/solquantum",
      passportId: "HFP-2025-4921X-01",
      integrityScore: 95.2,
      status: "VERIFIED"
    }
  ];

  return (
    <div className="page-wrapper">
      
      {/* Profile Banner & Info */}
      <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(160deg, #101524 0%, #0c0f18 100%)', border: '1px solid var(--border-default)', padding: '32px' }}>
        <div className="card-hud-accent cyan" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-emerald)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
              />
              <span style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-emerald)', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-mono)' }}>
                LVL {user.level}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.8rem' }}>{user.name}</h1>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  {user.levelTitle}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <a
                  href={`https://github.com/${user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}
                >
                  <GithubIcon size={14} /> @{user.github}
                </a>
                <span>•</span>
                <span>Role: <strong style={{ color: 'var(--text-primary)' }}>{user.role.toUpperCase().replace('_', ' ')}</strong></span>
              </div>
            </div>
          </div>

          {/* Actions & Quick Stats Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={signOut}
              className="btn btn-ghost btn-sm"
              style={{
                color: 'var(--accent-rose)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem'
              }}
              title="Sign out of your HackForge account"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>

            <div style={{ display: 'flex', gap: '16px', background: 'var(--bg-surface)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HACKATHONS WON</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{user.stats?.hackathonsWon || 0}</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>QUESTS FINISHED</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{user.stats?.questsCompleted || 0}</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PASSPORTS</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>{user.stats?.passportsIssued || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6, marginBottom: '20px' }}>
          {user.bio}
        </p>

        {/* Skills */}
        <div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            Verified Technical Stack & Skills
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user.skills.map((skill, i) => (
              <span key={i} className="badge badge-muted" style={{ padding: '6px 12px', fontSize: '0.78rem', textTransform: 'none' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* XP Matrix */}
      <div style={{ marginBottom: '32px' }}>
        <XPProgress
          xp={user.xp}
          level={user.level}
          nextLevelXp={user.nextLevelXp}
          levelTitle={user.levelTitle}
        />
      </div>

      {/* Unlocked Badges Trophy Case */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="var(--accent-amber)" />
              <span>Unlocked Achievement Badges ({user.badges?.length})</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Earned through verified commit speeds, high-originality Build Passports, and podium placements.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {user.badges?.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* Verified Build Passports Portfolio */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--accent-emerald)" />
              <span>Verifiable Build Passports Portfolio</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Every submitted project is immutably sealed with cryptographic commit lineage proofs.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pastProjects.map(proj => (
            <div
              key={proj.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                padding: '16px 20px',
                background: 'var(--bg-surface)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>{proj.name}</h3>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    <ShieldCheck size={11} /> {proj.passportId}
                  </span>
                  {proj.placement.includes('Winner') && (
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                      {proj.placement}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Hackathon: <strong style={{ color: 'var(--text-secondary)' }}>{proj.hackathon}</strong> • Originality: <strong style={{ color: 'var(--accent-emerald)' }}>{proj.integrityScore}%</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={`https://${proj.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <GithubIcon size={13} /> Code Repository
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
