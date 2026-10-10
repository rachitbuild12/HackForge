import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  Info,
  Layers,
  Globe,
  Gift,
  Tag,
  Lock,
  ExternalLink,
  Flame,
  ArrowRight,
  Filter,
  Check,
  Cpu,
  Moon,
  Rocket,
  GitCommit,
  ShieldAlert
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import Sidebar from '../components/Sidebar';
import Leaderboard from '../components/Leaderboard';
import XPProgress from '../components/XPProgress';
import {
  XP_DISCLAIMER,
  MEANINGFUL_XP_EVENTS,
  HACKFORGE_BADGES,
  REWARD_INFRASTRUCTURE,
  calculateLevel
} from '../utils/gamificationEngine';

export default function GamificationHub() {
  const { id } = useParams();
  const { user, team, quests } = useHackForge();

  const [activeTab, setActiveTab] = useState('LEADERBOARD'); // 'LEADERBOARD' | 'BADGES' | 'EVENTS' | 'REWARDS'
  const [badgeFilter, setBadgeFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'
  const [rewardCategory, setRewardCategory] = useState('ALL'); // 'ALL' | 'GOODIES' | 'COUPONS' | 'SPONSOR_REWARDS' | 'COMMUNITY_BENEFITS'

  const userLevelData = calculateLevel(user.xp);

  const filteredBadges = HACKFORGE_BADGES.filter(b => {
    if (badgeFilter === 'UNLOCKED') return b.unlocked;
    if (badgeFilter === 'LOCKED') return !b.unlocked;
    return true;
  });

  const filteredRewards = REWARD_INFRASTRUCTURE.filter(r => {
    if (rewardCategory === 'ALL') return true;
    return r.category === rewardCategory;
  });

  return (
    <div className="workspace-layout">
      <Sidebar mode="hackathon" />

      <main className="workspace-main">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Trophy size={13} /> GAMIFICATION & REWARD ENGINE
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                VERIFIABLE MERIT PROTOCOL
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Gamification & Sprint Velocity
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', margin: 0 }}>
              Recognizing verified architectural progress, deployments, and collaboration.
              XP is awarded exclusively for substantive milestones—never spam commits.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to={`/hackathons/${id || 'eth-global-2026'}/quests`}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Zap size={15} color="var(--accent-amber)" /> View Sprint Quests
            </Link>
          </div>
        </div>

        {/* MANDATORY LABEL BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Info size={22} color="#60a5fa" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#93c5fd', marginBottom: '2px', letterSpacing: '0.01em' }}>
              CRITICAL PRINCIPLE: XP IS NOT A JUDGING SCORE
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              "{XP_DISCLAIMER}" Official hackathon placement and prize decisions are determined independently
              by the jury through the Cryptographic Build Passport and live code inspection.
            </div>
          </div>
        </div>

        {/* TOP METRIC CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Card 1: Individual XP & Level */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Individual Builder XP</span>
              <Zap size={16} color="var(--accent-emerald)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {user.xp?.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>XP</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                LVL {userLevelData.level}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              {userLevelData.levelTitle} • {userLevelData.xpToNext} XP to next level
            </div>
          </div>

          {/* Card 2: Team Vault XP */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Team Vault XP</span>
              <Layers size={16} color="var(--accent-cyan)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {team.xpEarned?.toLocaleString() || '2,450'} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>XP</span>
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Rank #3
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Pooled sprint bounty across 3 squad builders
            </div>
          </div>

          {/* Card 3: Badges Unlocked */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Badges Unlocked</span>
              <Award size={16} color="var(--accent-violet)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>
                9 / 9
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                100% Unlocked
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Includes Legendary "Milestone Master"
            </div>
          </div>

          {/* Card 4: Quests Completed */}
          <div className="stat-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
            <div className="stat-card-header">
              <span className="stat-card-title">Quests Sealed</span>
              <CheckCircle2 size={16} color="var(--accent-amber)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                5 / 8
              </span>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                62.5% Complete
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              All 5 backed by commit hash proof
            </div>
          </div>
        </div>

        {/* Level Progress Bar Component */}
        <div style={{ marginBottom: '28px' }}>
          <XPProgress
            xp={user.xp}
            level={userLevelData.level}
            nextLevelXp={userLevelData.nextLevelXp}
            levelTitle={userLevelData.levelTitle}
          />
        </div>

        {/* HUB NAVIGATION TABS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-card)',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`hud-tab ${activeTab === 'LEADERBOARD' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Trophy size={15} />
            <span>Leaderboards (Individual, Team, Hackathon)</span>
          </button>
          <button
            onClick={() => setActiveTab('BADGES')}
            className={`hud-tab ${activeTab === 'BADGES' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Award size={15} />
            <span>Unlocked Badges ({HACKFORGE_BADGES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('EVENTS')}
            className={`hud-tab ${activeTab === 'EVENTS' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Zap size={15} />
            <span>Meaningful Event XP Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('REWARDS')}
            className={`hud-tab ${activeTab === 'REWARDS' ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Gift size={15} />
            <span>Reward Perks Tier Vault</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: LEADERBOARDS (INDIVIDUAL, TEAM, HACKATHON)              */}
        {/* ============================================================== */}
        {activeTab === 'LEADERBOARD' && (
          <div style={{ marginBottom: '32px' }}>
            <Leaderboard defaultTab="TEAM" showTabs={true} />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: BADGES & ACHIEVEMENTS                                   */}
        {/* ============================================================== */}
        {activeTab === 'BADGES' && (
          <div style={{ marginBottom: '32px' }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                  Hackathon Achievement Badges
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Earned exclusively through verified milestones and architectural contributions
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setBadgeFilter('ALL')}
                  className={`hud-tab ${badgeFilter === 'ALL' ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  All ({HACKFORGE_BADGES.length})
                </button>
                <button
                  onClick={() => setBadgeFilter('UNLOCKED')}
                  className={`hud-tab ${badgeFilter === 'UNLOCKED' ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  Unlocked ({HACKFORGE_BADGES.filter(b => b.unlocked).length})
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '2rem',
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${badge.color || 'var(--accent-emerald)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {badge.symbol}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                          {badge.name}
                        </h3>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          background: `${badge.color}22`,
                          color: badge.color,
                          border: `1px solid ${badge.color}44`,
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {badge.rarity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: {badge.category}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: 1.4 }}>
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '8px'
                  }}>
                    <span><strong>Criteria:</strong> {badge.criteria}</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Unlocked ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MEANINGFUL EVENT XP RULES                               */}
        {/* ============================================================== */}
        {activeTab === 'EVENTS' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="var(--accent-emerald)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    Anti-Spam Verification Rules & Meaningful Event Catalog
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    How HackForge awards velocity XP while preventing low-effort commit farming
                  </div>
                </div>
              </div>

              {/* Anti-spam rule box */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <ShieldAlert size={20} color="#f87171" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fca5a5', marginBottom: '3px' }}>
                    Zero-Spam Policy Enforced
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Commits that contain repetitive whitespace changes, trivial messages ("update", "test", "."),
                    or automated git bot bursts award <strong>0 XP</strong>. XP is earned through substantive, verifiable events.
                  </div>
                </div>
              </div>

              {/* Event XP Catalog Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {Object.values(MEANINGFUL_XP_EVENTS).map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {evt.label}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: 'var(--accent-emerald)',
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          +{evt.xp} XP
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {evt.description}
                      </p>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Category: {evt.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: REWARD PERKS INFRASTRUCTURE PREVIEW                    */}
        {/* ============================================================== */}
        {activeTab === 'REWARDS' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Gift size={20} color="var(--accent-violet)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                      Reward Perks & Sponsorship Vault
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Future reward redemption tier infrastructure for physical swag, cloud vouchers, sponsor grants, and community perks.
                  </p>
                </div>

                {/* Category Filter */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setRewardCategory('ALL')}
                    className={`hud-tab ${rewardCategory === 'ALL' ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    All Perks
                  </button>
                  <button
                    onClick={() => setRewardCategory('GOODIES')}
                    className={`hud-tab ${rewardCategory === 'GOODIES' ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Goodies
                  </button>
                  <button
                    onClick={() => setRewardCategory('COUPONS')}
                    className={`hud-tab ${rewardCategory === 'COUPONS' ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Coupons
                  </button>
                  <button
                    onClick={() => setRewardCategory('SPONSOR_REWARDS')}
                    className={`hud-tab ${rewardCategory === 'SPONSOR_REWARDS' ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Sponsor Rewards
                  </button>
                  <button
                    onClick={() => setRewardCategory('COMMUNITY_BENEFITS')}
                    className={`hud-tab ${rewardCategory === 'COMMUNITY_BENEFITS' ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Community Benefits
                  </button>
                </div>
              </div>

              {/* Status Note */}
              <div style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                marginBottom: '20px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}>
                <strong style={{ color: 'var(--accent-violet)' }}>Reward Vault Protocol:</strong> Rewards below represent prepared redemption tiers.
                Perk fulfillment will be activated in Stage 2 without resetting your earned XP balance.
              </div>

              {/* Rewards Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
                {filteredRewards.map((reward) => (
                  <div
                    key={reward.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            {reward.categoryLabel}
                          </span>
                          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
                            {reward.title}
                          </h3>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                          {reward.tier}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                        By {reward.brand}
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 14px 0' }}>
                        {reward.description}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        {reward.xpRequired.toLocaleString()} XP Required
                      </div>
                      <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
                        {reward.availability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
