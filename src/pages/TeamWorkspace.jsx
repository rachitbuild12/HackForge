import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  GitBranch,
  ExternalLink,
  UserPlus,
  MessageSquare,
  Shield,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  PlusCircle,
  LogIn,
  Crown,
  Layout,
  Server,
  Cpu,
  Palette,
  BookOpen,
  Video,
  Edit2,
  Layers,
  Sparkles,
  Award,
  Rocket,
  RefreshCw,
  Compass
} from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import GitHubConnectModal from '../components/GitHubConnectModal';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';

export default function TeamWorkspace() {
  const { id } = useParams();
  const {
    team,
    user,
    TEAM_ROLES,
    createTeam,
    joinTeam,
    assignMemberRole,
    selectProblemStatement,
    inviteMemberByEmail,
    activeHackathon,
    hackathons,
    showToast,
    githubUser,
    githubConnectedRepo,
    isGithubLoading,
    syncGitHubTelemetry,
    disconnectGitHub,
    integrityAlerts,
    resolveIntegrityAlert
  } = useHackForge();

  // Find the current hackathon
  const hackathon = hackathons.find(h => h.id === id) || activeHackathon;
  const problemStatements = hackathon?.problemStatements || [];

  // Check if organizer dispatched a provenance inquiry for this squad
  const teamInquiry = integrityAlerts?.find(a => (a.teamId === team.id || a.teamName === team.name) && a.status === 'EXPLANATION_REQUESTED');

  // Modals
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [joinTeamModalOpen, setJoinTeamModalOpen] = useState(false);
  const [psModalOpen, setPsModalOpen] = useState(false);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);

  // Form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinRoleInput, setJoinRoleInput] = useState('Backend');
  const [mentorTopic, setMentorTopic] = useState('');

  // Create Team form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSlogan, setNewTeamSlogan] = useState('');
  const [newTeamAvatar, setNewTeamAvatar] = useState('⚡');
  const [newTeamRepo, setNewTeamRepo] = useState('');
  const [newTeamPsId, setNewTeamPsId] = useState(problemStatements[0]?.id || 'ps-1');

  // Helper for role icon & color
  const getRoleMeta = (roleName) => {
    switch (roleName) {
      case 'Team Leader':
        return { badge: 'badge-violet', icon: Crown, color: 'var(--accent-violet)' };
      case 'Frontend':
        return { badge: 'badge-cyan', icon: Layout, color: 'var(--accent-cyan)' };
      case 'Backend':
        return { badge: 'badge-emerald', icon: Server, color: 'var(--accent-emerald)' };
      case 'AI/ML':
        return { badge: 'badge-amber', icon: Cpu, color: 'var(--accent-amber)' };
      case 'Hardware':
        return { badge: 'badge-rose', icon: Zap, color: 'var(--accent-rose)' };
      case 'UI/UX':
        return { badge: 'badge-violet', icon: Palette, color: 'var(--accent-violet)' };
      case 'Research':
        return { badge: 'badge-cyan', icon: BookOpen, color: 'var(--accent-cyan)' };
      case 'Presentation':
        return { badge: 'badge-emerald', icon: Video, color: 'var(--accent-emerald)' };
      default:
        return { badge: 'badge-muted', icon: Users, color: 'var(--text-secondary)' };
    }
  };

  // Copy code helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(team.inviteCode || 'FORGE-7X9Q');
    setCopiedCode(true);
    showToast("Invite code copied to clipboard!", "default");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/hackathons/${id || 'eth-global-2026'}/team?invite=${team.inviteCode || 'FORGE-7X9Q'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast("Direct invite URL copied to clipboard!", "default");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMemberByEmail(inviteEmail, inviteRole);
    setInviteEmail('');
    setInviteModalOpen(false);
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const selectedPsObj = problemStatements.find(ps => ps.id === newTeamPsId);
    createTeam({
      name: newTeamName.trim(),
      slogan: newTeamSlogan.trim(),
      avatar: newTeamAvatar,
      githubRepo: newTeamRepo.trim(),
      problemStatementId: newTeamPsId,
      problemStatementTitle: selectedPsObj?.title || "Custom Challenge"
    });
    setCreateTeamModalOpen(false);
  };

  const handleJoinTeamSubmit = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const success = joinTeam(joinCodeInput.trim(), joinRoleInput);
    if (success) {
      setJoinTeamModalOpen(false);
      setJoinCodeInput('');
    }
  };

  const handleRequestMentor = (e) => {
    e.preventDefault();
    if (!mentorTopic) return;
    showToast(`Mentor summon dispatched for: "${mentorTopic}". A technical mentor is connecting to your workspace.`, 'role');
    setMentorTopic('');
    setMentorModalOpen(false);
  };

  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-content">
        
        {/* Workspace Top Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan">SQUAD OPERATIONS</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              INVITE CODE: <strong style={{ color: 'var(--accent-emerald)' }}>{team.inviteCode || 'FORGE-7X9Q'}</strong>
            </span>
          </div>

          {/* Quick Squad Management Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCreateTeamModalOpen(true)}
            >
              <PlusCircle size={14} />
              <span>Create Squad</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setJoinTeamModalOpen(true)}
            >
              <LogIn size={14} />
              <span>Join via Code</span>
            </button>
          </div>
        </div>

        {/* Workspace Header */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2.2rem' }}>{team.avatar || '⚡'}</span>
              <span>{team.name}</span>
            </h1>
            <p className="page-subtitle" style={{ maxWidth: '650px' }}>
              {team.slogan || "Autonomous high-velocity agent settlement layer with verifiable ZK receipts"}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => setMentorModalOpen(true)}>
              <MessageSquare size={15} />
              <span>Summon Mentor</span>
            </button>
            <button className="btn btn-primary" onClick={() => setInviteModalOpen(true)}>
              <UserPlus size={15} />
              <span>Invite Teammates</span>
            </button>
          </div>
        </div>

        {/* Organizer Provenance Inquiry Banner (Transparency Protocol) */}
        {teamInquiry && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.09) 0%, rgba(20, 24, 38, 0.95) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '800px' }}>
              <MessageSquare size={22} color="var(--accent-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                    ORGANIZER INQUIRY PENDING
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    TRANSPARENCY & PROVENANCE CLARIFICATION
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  {teamInquiry.organizerNotes || `Organizers have requested a brief note clarifying: "${teamInquiry.reason}"`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                resolveIntegrityAlert(teamInquiry.id, 'EXPLAINED', 'Team clarified that pre-existing files are standard public utilities and verified library dependencies.');
                showToast("Explanation submitted to organizers. Thank you for your transparency!", "default");
              }}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: 'var(--accent-amber)', fontSize: '0.78rem' }}
            >
              <CheckCircle2 size={13} />
              <span>Submit Architecture Explanation</span>
            </button>
          </div>
        )}

        {/* Selected Problem Statement & GitHub Card */}
        <div className="grid-2" style={{ marginBottom: '24px' }}>
          
          {/* Problem Statement Card */}
          <div className="card">
            <div className="card-hud-accent cyan" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                SELECTED PROBLEM STATEMENT
              </div>
              <button
                onClick={() => setPsModalOpen(true)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '3px 8px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}
              >
                <Edit2 size={12} />
                <span>Change Track</span>
              </button>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              {team.problemStatementTitle || "Autonomous Agent Micro-Settlement Protocol"}
            </h3>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Compete for track bounties and align your build architecture with the official evaluation rubric.
            </p>

            <button
              onClick={() => setPsModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: 'var(--accent-cyan)' }}
            >
              <Layers size={13} />
              <span>View Track Rubric & Statements</span>
            </button>
          </div>

          {/* GitHub Repository Health & Live Integration */}
          <div className="card">
            <div className="card-hud-accent cyan" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                LINKED GITHUB REPOSITORY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {githubUser && (
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    @{githubUser.login}
                  </span>
                )}
                {githubConnectedRepo || team.githubRepo ? (
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    <ShieldCheck size={11} /> Live Sync Active
                  </span>
                ) : (
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                    <Shield size={11} /> Not Connected
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GithubIcon size={18} />
                {githubConnectedRepo || team.githubRepo ? (
                  <a
                    href={githubConnectedRepo?.html_url || team.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{(githubConnectedRepo?.full_name || team.githubRepo || '').replace('https://github.com/', '')}</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    No GitHub repository linked yet
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {(githubConnectedRepo || team.githubRepo) && (
                  <button
                    type="button"
                    onClick={() => syncGitHubTelemetry(team.id)}
                    disabled={isGithubLoading}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                    title="Pull latest commits & PRs from GitHub"
                  >
                    <RefreshCw size={12} className={isGithubLoading ? 'spin' : ''} />
                    <span>Sync</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setGithubModalOpen(true)}
                  className={`btn ${githubConnectedRepo || team.githubRepo ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <span>{githubConnectedRepo || team.githubRepo ? 'Switch Repo' : 'Connect GitHub'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
              <span>Branch: <strong style={{ color: 'var(--text-primary)' }}>{team.branch || (githubConnectedRepo ? 'main' : 'None')}</strong></span>
              <span>•</span>
              <span>Commits: <strong style={{ color: team.commitsCount > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>{team.commitsCount || 0}</strong></span>
              <span>•</span>
              <span>Diff: <strong style={{ color: 'var(--text-primary)' }}>{team.linesChanged || '+0 / -0'}</strong></span>
              <span>•</span>
              <span>Last Commit: <strong style={{ color: team.lastCommitTime && team.lastCommitTime !== 'No commits yet' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>{team.lastCommitTime || 'None'}</strong></span>
            </div>
          </div>
        </div>

        {/* Project Scope Intelligence Widget */}
        <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={18} color="var(--accent-violet)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Project Scope Analysis</h3>
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>70% Alignment</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Declared Major Features vs Real-time GitHub Activity
                </div>
              </div>
            </div>

            <Link
              to={`/hackathons/${id || 'eth-global-2026'}/scope`}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <span>Explore Full Scope Intelligence</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Quick Feature Status Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Authentication</div>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>✓ Evidence found</span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>AI Prediction</div>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>✓ Evidence found</span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Real-time Alerts</div>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>⚠ Limited evidence</span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Mobile Application</div>
              <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>✕ No evidence yet</span>
            </div>
          </div>
        </div>

        {/* Team Roster Management */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Active Squad Roster ({team.members?.length || 1}/8 Builders)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Assign team roles across development, AI, design, and presentation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setInviteModalOpen(true)} className="btn btn-secondary btn-sm">
                <UserPlus size={13} />
                <span>Invite New Member</span>
              </button>
              <span className="badge badge-muted">Max 8 Members</span>
            </div>
          </div>

          {/* Members List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {team.members?.map(member => {
              const meta = getRoleMeta(member.role);
              const RoleIcon = meta.icon;
              const isCurrentUser = member.id === user.id;

              return (
                <div
                  key={member.id}
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  {/* Left: Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={member.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-default)' }}
                      />
                      {member.role === 'Team Leader' && (
                        <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent-violet)', borderRadius: '50%', padding: '2px', color: '#fff' }}>
                          <Crown size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {member.name}
                        </span>
                        {isCurrentUser && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: '4px', color: 'var(--accent-cyan)' }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {member.status || "Active now"}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Interactive Role Assignment Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${meta.badge}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '4px 10px' }}>
                      <RoleIcon size={13} />
                      <span>{member.role}</span>
                    </span>

                    {/* Role dropdown */}
                    <select
                      value={member.role}
                      onChange={e => assignMemberRole(member.id, e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.78rem', padding: '4px 8px', height: '32px', width: 'auto', background: 'var(--bg-card)' }}
                      title="Reassign team role"
                    >
                      {TEAM_ROLES.map(roleOpt => (
                        <option key={roleOpt} value={roleOpt}>
                          {roleOpt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Right: Commits & XP Stats */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>COMMITS</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{member.commits || 0}</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>XP EARNED</div>
                      <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>+{member.xp || 0} XP</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Squad Invite Card */}
        <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.05))', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Squad Recruitment Invite Code</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Teammates can enter this code in their HackForge portal to instantly join your squad and claim team bounties.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-glow)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', letterSpacing: '0.08em' }}>
                {team.inviteCode || 'FORGE-7X9Q'}
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="btn btn-secondary btn-sm"
              >
                {copiedCode ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-primary btn-sm"
              >
                {copiedLink ? <Check size={14} /> : <ExternalLink size={14} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL 1: SELECT PROBLEM STATEMENT                              */}
        {/* ============================================================== */}
        {psModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '28px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>Select Problem Statement</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Choose the track and problem statement your squad is committing to solve.
                  </p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setPsModalOpen(false)}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {problemStatements.map(ps => {
                  const isSelected = team.problemStatementId === ps.id;
                  return (
                    <div
                      key={ps.id}
                      onClick={() => {
                        selectProblemStatement(ps.id, ps.title);
                        setPsModalOpen(false);
                      }}
                      style={{
                        background: isSelected ? 'var(--bg-card-active)' : 'var(--bg-surface)',
                        border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-default)',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <span className="badge badge-amber" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                            {ps.category || ps.track || "Open Track"}
                          </span>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                            {ps.title}
                          </h4>
                        </div>
                        {ps.bounty && (
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                            {ps.bounty}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                        {ps.description}
                      </p>

                      {ps.evaluationCriteria && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <strong>Criteria:</strong> {ps.evaluationCriteria}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setPsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: CREATE SQUAD                                          */}
        {/* ============================================================== */}
        {createTeamModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Create New Squad</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setCreateTeamModalOpen(false)}>×</button>
              </div>

              <form onSubmit={handleCreateTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    Squad Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neural Mesh Engineers"
                    value={newTeamName}
                    onChange={e => setNewTeamName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    Slogan / Mission
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Building verifiable zero-knowledge agent protocols"
                    value={newTeamSlogan}
                    onChange={e => setNewTeamSlogan(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      Squad Avatar Emoji
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['⚡', '🚀', '🧠', '🛡️', '🌌', '🤖'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewTeamAvatar(emoji)}
                          style={{
                            width: '36px',
                            height: '36px',
                            fontSize: '1.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: newTeamAvatar === emoji ? '2px solid var(--accent-emerald)' : '1px solid var(--border-default)',
                            background: newTeamAvatar === emoji ? 'var(--accent-emerald-dim)' : 'var(--bg-surface)',
                            cursor: 'pointer'
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      Initial Problem Track
                    </label>
                    <select
                      value={newTeamPsId}
                      onChange={e => setNewTeamPsId(e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.78rem' }}
                    >
                      {problemStatements.map(ps => (
                        <option key={ps.id} value={ps.id}>{ps.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/my-org/my-project"
                    value={newTeamRepo}
                    onChange={e => setNewTeamRepo(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCreateTeamModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Rocket size={14} /> Create Squad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: JOIN SQUAD VIA CODE                                   */}
        {/* ============================================================== */}
        {joinTeamModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Join Squad via Invite Code</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setJoinTeamModalOpen(false)}>×</button>
              </div>

              <form onSubmit={handleJoinTeamSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    6-Character Squad Invite Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FORGE-7X9Q"
                    value={joinCodeInput}
                    onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    Select Your Starting Role
                  </label>
                  <select
                    value={joinRoleInput}
                    onChange={e => setJoinRoleInput(e.target.value)}
                    className="form-select"
                  >
                    {TEAM_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setJoinTeamModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <LogIn size={14} /> Join Squad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 4: INVITE TEAMMATES                                      */}
        {/* ============================================================== */}
        {inviteModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '28px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Invite Teammates</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setInviteModalOpen(false)}>×</button>
              </div>

              {/* Invite Code Box */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>SQUAD CODE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    {team.inviteCode || 'FORGE-7X9Q'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="btn btn-secondary btn-sm"
                  >
                    {copiedCode ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Email Invite Form */}
              <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    Send Direct Invitation by Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="builder@domain.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                    Proposed Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="form-select"
                  >
                    {TEAM_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInviteModalOpen(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 5: SUMMON MENTOR                                         */}
        {/* ============================================================== */}
        {mentorModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '28px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Summon Technical Mentor</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setMentorModalOpen(false)}>×</button>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                HackForge mentors are on-call for live 1-on-1 sprint debugging sessions.
              </p>

              <form onSubmit={handleRequestMentor}>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your technical challenge (e.g. AI inference timeout, smart contract reentrancy)..."
                  value={mentorTopic}
                  onChange={e => setMentorTopic(e.target.value)}
                  className="form-textarea"
                  style={{ marginBottom: '16px' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMentorModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Summon Mentor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 6: GITHUB OAUTH & REPO ASSOCIATION                       */}
        {/* ============================================================== */}
        <GitHubConnectModal
          isOpen={githubModalOpen}
          onClose={() => setGithubModalOpen(false)}
          projectId={team.id}
        />

      </main>
    </div>
  );
}
