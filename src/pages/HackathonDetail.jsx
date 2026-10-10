import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trophy, Clock, Users, ShieldCheck, CheckCircle2, GitBranch, ArrowRight, ExternalLink, Bookmark, Check, Sparkles } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';

export default function HackathonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hackathons, team, setTeam, showToast, registerForHackathon } = useHackForge();
  const hackathon = hackathons.find(h => h.id === id) || hackathons[0];
  const [selectedPs, setSelectedPs] = useState(team.problemStatementId || 'ps-1');

  const handleJoinHackathon = () => {
    registerForHackathon(hackathon.id);
    navigate(`/hackathons/${hackathon.id}/team`);
  };

  const handleSelectProblemStatement = (ps) => {
    setSelectedPs(ps.id);
    setTeam(prev => ({
      ...prev,
      problemStatementId: ps.id,
      problemStatementTitle: ps.title
    }));
    showToast(`Team locked onto problem statement: ${ps.title}`, 'default');
  };

  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-content">
        
        {/* Banner Card */}
        <div className="card" style={{ marginBottom: '28px', padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '180px', position: 'relative' }}>
            <img src={hackathon.banner} alt={hackathon.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,26,0.98) 0%, rgba(14,17,26,0.4) 100%)' }} />
            
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-emerald">
                    <span className="pulse-dot" /> {hackathon.status}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    Organized by <strong>{hackathon.organizer}</strong>
                  </span>
                </div>
                <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>{hackathon.title}</h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    TOTAL BOUNTY POOL
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    {hackathon.prizePool}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleJoinHackathon}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 24px',
                    fontWeight: 700,
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Sparkles size={15} />
                  <span>Participate / Join Sprint</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ background: 'var(--bg-surface)', padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)' }}>
                <Clock size={14} /> {hackathon.timeLeft}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Users size={14} /> {hackathon.participantsCount} Builders ({hackathon.teamsCount} Squads)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
                <ShieldCheck size={14} /> Build Passport Required
              </span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              Format: {hackathon.format}
            </div>
          </div>
        </div>

        {/* Problem Statements Selection */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Problem Statements & Bounties</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Select your squad's primary problem statement to unlock tailored quests and mentor guidance.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {hackathon.problemStatements?.map(ps => {
              const isSelected = selectedPs === ps.id;
              return (
                <div
                  key={ps.id}
                  className="card"
                  style={{
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'linear-gradient(145deg, #101624, #0d121c)' : 'var(--bg-card)',
                    boxShadow: isSelected ? '0 0 20px rgba(6,182,212,0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-cyan">{ps.track}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sponsor: <strong>{ps.sponsor}</strong></span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem' }}>{ps.title}</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>BOUNTY</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{ps.bounty}</div>
                      </div>

                      <button
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleSelectProblemStatement(ps)}
                      >
                        {isSelected ? (
                          <>
                            <Check size={14} /> Chosen Track
                          </>
                        ) : (
                          'Select Problem Statement'
                        )}
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ps.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Allowed Boilerplates / Starters */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Whitelisted Starter Boilerplates</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              HackForge Integrity Sentinel verifies code against these approved templates. Starting from unapproved codebases triggers audit flags.
            </p>
          </div>

          <div className="grid-3">
            {hackathon.allowedStarters?.map((starter, i) => (
              <div key={i} className="card" style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    <ShieldCheck size={11} /> Whitelisted
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ★ {starter.stars}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                  {starter.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                  {starter.repo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules & Code of Integrity */}
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--accent-emerald)" />
            <span>HackForge Integrity & Competition Rules</span>
          </h3>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {hackathon.rules?.map((rule, idx) => (
              <li key={idx} style={{ lineHeight: 1.5 }}>{rule}</li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
}
