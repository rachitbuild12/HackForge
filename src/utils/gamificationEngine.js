// ============================================================================
// HACKFORGE GAMIFICATION ENGINE
//
// Core Rules:
// 1. Do NOT reward spam commits.
// 2. XP is strictly associated with meaningful events:
//    - Quest completion
//    - Approved milestone
//    - Meaningful PR
//    - Successful deployment
//    - Documentation completion
//    - Mentor interaction
//    - Team collaboration events
// 3. XP must NOT equal judging score.
//    "XP represents participation and progress, not competition judging."
// ============================================================================

export const XP_DISCLAIMER = "XP represents participation and progress, not competition judging.";

/**
 * Meaningful Events and their associated XP rewards
 */
export const MEANINGFUL_XP_EVENTS = {
  QUEST_COMPLETION: {
    id: "QUEST_COMPLETION",
    label: "Quest Completion",
    xp: 250,
    category: "MILESTONE",
    description: "Successfully fulfilled all verifiable requirements for a sprint quest."
  },
  APPROVED_MILESTONE: {
    id: "APPROVED_MILESTONE",
    label: "Approved Milestone",
    xp: 200,
    category: "MILESTONE",
    description: "Milestone validated by organizer review or cryptographic checkpoint."
  },
  MEANINGFUL_PR: {
    id: "MEANINGFUL_PR",
    label: "Meaningful Pull Request",
    xp: 150,
    category: "CODE",
    description: "Merged pull request with peer review and substantive code diff (minimum 20+ lines, non-trivial)."
  },
  SUCCESSFUL_DEPLOYMENT: {
    id: "SUCCESSFUL_DEPLOYMENT",
    label: "Successful Deployment",
    xp: 200,
    category: "SHIPPING",
    description: "Verified live deployment or smart contract published to public testnet."
  },
  DOCUMENTATION_COMPLETION: {
    id: "DOCUMENTATION_COMPLETION",
    label: "Documentation Completion",
    xp: 100,
    category: "ARCHITECTURE",
    description: "Published ARCHITECTURE.md, comprehensive API specs, or README."
  },
  MENTOR_INTERACTION: {
    id: "MENTOR_INTERACTION",
    label: "Mentor Interaction",
    xp: 75,
    category: "COLLABORATION",
    description: "Attended verified mentor feedback session or architecture advisory."
  },
  TEAM_COLLABORATION_EVENT: {
    id: "TEAM_COLLABORATION_EVENT",
    label: "Team Collaboration Event",
    xp: 100,
    category: "COLLABORATION",
    description: "Cross-member code review, branch merge, or co-authored delivery."
  }
};

/**
 * Level Curve & Titles
 */
export const LEVEL_TIERS = [
  { level: 1, minXp: 0, maxXp: 499, title: "Code Initiate" },
  { level: 2, minXp: 500, maxXp: 1199, title: "Vanguard Scaffolder" },
  { level: 3, minXp: 1200, maxXp: 2199, title: "Systems Codecrafter" },
  { level: 4, minXp: 2200, maxXp: 3499, title: "Protocol Engineer" },
  { level: 5, minXp: 3500, maxXp: 4999, title: "Principal Sentinel" },
  { level: 6, minXp: 5000, maxXp: 6999, title: "Quantum Architect" },
  { level: 7, minXp: 7000, maxXp: 9999, title: "Grandmaster Shipper" }
];

export function calculateLevel(xp = 0) {
  const tier = LEVEL_TIERS.find(t => xp >= t.minXp && xp <= t.maxXp) || LEVEL_TIERS[LEVEL_TIERS.length - 1];
  const levelSpan = tier.maxXp - tier.minXp + 1;
  const currentProgress = xp - tier.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / levelSpan) * 100)));

  return {
    level: tier.level,
    levelTitle: tier.title,
    nextLevelXp: tier.maxXp + 1,
    currentLevelBase: tier.minXp,
    progressPercent,
    xpToNext: Math.max(0, (tier.maxXp + 1) - xp)
  };
}

/**
 * Evaluates whether a git commit is meaningful or spam
 * NO SPAM COMMITS RULE:
 * Repetitive 1-line changes, whitespace commits, or automated bursts get 0 XP.
 */
export function evaluateCommitForGamification(commit) {
  const message = (commit.message || commit.metadata?.message || "").toLowerCase();
  const additions = commit.additions || commit.metadata?.additions || 0;
  const deletions = commit.deletions || commit.metadata?.deletions || 0;
  const changedFiles = commit.changed_files || commit.metadata?.changed_files || 1;

  // Spam filters
  const isTrivialMessage = message === "update" || message === "test" || message === "." || message.length < 3;
  const isZeroDiff = additions === 0 && deletions === 0;
  const isWhitespaceOnly = additions <= 2 && deletions <= 2 && changedFiles === 1;

  if (isTrivialMessage || isZeroDiff || isWhitespaceOnly) {
    return {
      isMeaningful: false,
      xpAwarded: 0,
      reason: "Trivial or zero-diff commit detected. Spam commits are not awarded XP."
    };
  }

  return {
    isMeaningful: true,
    xpAwarded: 0, // Raw commits don't directly award flat XP; quests, PRs, and milestones do!
    reason: "Valid commit recorded towards milestone progress."
  };
}

/**
 * 9 Standard Required Badges
 */
export const HACKFORGE_BADGES = [
  {
    id: "badge-first-commit",
    name: "FIRST COMMIT",
    category: "Genesis",
    icon: "GitCommit",
    symbol: "🌱",
    rarity: "COMMON",
    color: "#10b981",
    description: "Pushed first authenticated, non-trivial commit to the repository.",
    criteria: "1 authenticated git commit verified on remote branch",
    unlocked: true,
    unlockedAt: "Sep 20, 2026, 10:14 UTC"
  },
  {
    id: "badge-first-deployment",
    name: "FIRST DEPLOYMENT",
    category: "Shipping",
    icon: "Rocket",
    symbol: "🚀",
    rarity: "RARE",
    color: "#06b6d4",
    description: "Shipped first verified live application deployment or testnet contract.",
    criteria: "Live deployment URL or contract address verified via HTTP 200 or RPC",
    unlocked: true,
    unlockedAt: "Sep 20, 2026, 20:15 UTC"
  },
  {
    id: "badge-bug-slayer",
    name: "BUG SLAYER",
    category: "Resilience",
    icon: "ShieldAlert",
    symbol: "⚔️",
    rarity: "UNCOMMON",
    color: "#f59e0b",
    description: "Resolved critical blocker issue, CORS barrier, or passing integration test suite.",
    criteria: "Closed GitHub blocker issue with matching PR fix",
    unlocked: true,
    unlockedAt: "Sep 21, 2026, 02:10 UTC"
  },
  {
    id: "badge-ai-builder",
    name: "AI BUILDER",
    category: "Innovation",
    icon: "Cpu",
    symbol: "🧠",
    rarity: "EPIC",
    color: "#8b5cf6",
    description: "Integrated AI/ML inference service, PyTorch model, or autonomous LangChain agent.",
    criteria: "Substantive ml/ directory with verified inference endpoint",
    unlocked: true,
    unlockedAt: "Sep 21, 2026, 08:40 UTC"
  },
  {
    id: "badge-team-player",
    name: "TEAM PLAYER",
    category: "Collaboration",
    icon: "Users",
    symbol: "🤝",
    rarity: "UNCOMMON",
    color: "#ec4899",
    description: "Participated in peer code review, PR approvals, and cross-discipline collaboration.",
    criteria: "Reviewed at least 1 teammate PR or authored multi-contributor branch",
    unlocked: true,
    unlockedAt: "Sep 21, 2026, 13:15 UTC"
  },
  {
    id: "badge-early-shipper",
    name: "EARLY SHIPPER",
    category: "Velocity",
    icon: "Zap",
    symbol: "⚡",
    rarity: "RARE",
    color: "#eab308",
    description: "Deployed a working end-to-end prototype within the first 12 hours of the hackathon.",
    criteria: "Verified functional build within 12h of sprint opening",
    unlocked: true,
    unlockedAt: "Sep 20, 2026, 20:15 UTC"
  },
  {
    id: "badge-integration-hero",
    name: "INTEGRATION HERO",
    category: "Architecture",
    icon: "Layers",
    symbol: "🔗",
    rarity: "RARE",
    color: "#3b82f6",
    description: "Successfully connected frontend client HUD with backend microservice & smart contracts.",
    criteria: "Full-stack event loop verified from UI trigger to on-chain state update",
    unlocked: true,
    unlockedAt: "Sep 21, 2026, 14:00 UTC"
  },
  {
    id: "badge-night-builder",
    name: "NIGHT BUILDER",
    category: "Dedication",
    icon: "Moon",
    symbol: "🌙",
    rarity: "EPIC",
    color: "#6366f1",
    description: "Committed non-trivial architecture enhancements between midnight and 5:00 AM UTC.",
    criteria: "Substantive commit timestamped in night window with test pass",
    unlocked: true,
    unlockedAt: "Sep 21, 2026, 03:45 UTC"
  },
  {
    id: "badge-milestone-master",
    name: "MILESTONE MASTER",
    category: "Mastery",
    icon: "Award",
    symbol: "👑",
    rarity: "LEGENDARY",
    color: "#10b981",
    description: "Completed 5 or more hackathon sprint quests with 100% evidence verification.",
    criteria: "Claimed 5+ verifiable quests on the Quest Board",
    unlocked: true,
    unlockedAt: "Sep 21, 2026, 21:45 UTC"
  }
];

/**
 * Individual Leaderboard Data
 */
export const INDIVIDUAL_LEADERBOARD = [
  {
    rank: 1,
    id: "usr_9021",
    name: "Alex 'Kaelen' Chen",
    teamName: "HyperDrive Protocol",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Team Leader",
    sprintXp: 1200,
    totalXp: 5350,
    level: 6,
    levelTitle: "Quantum Architect",
    questsCompleted: 5,
    badgesCount: 9,
    isCurrentUser: true
  },
  {
    rank: 2,
    id: "usr_2011",
    name: "Elena 'Valkyrie' Rostova",
    teamName: "ZeroState Labs",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "ZK Cryptographer",
    sprintXp: 1150,
    totalXp: 4800,
    level: 5,
    levelTitle: "Principal Sentinel",
    questsCompleted: 6,
    badgesCount: 8,
    isCurrentUser: false
  },
  {
    rank: 3,
    id: "usr_3042",
    name: "Devon Marcus",
    teamName: "NeuralSync",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "AI/ML Lead",
    sprintXp: 980,
    totalXp: 4100,
    level: 5,
    levelTitle: "Principal Sentinel",
    questsCompleted: 5,
    badgesCount: 7,
    isCurrentUser: false
  },
  {
    rank: 4,
    id: "usr_1042",
    name: "Sophia Zhang",
    teamName: "HyperDrive Protocol",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Frontend",
    sprintXp: 750,
    totalXp: 3450,
    level: 4,
    levelTitle: "Protocol Engineer",
    questsCompleted: 4,
    badgesCount: 6,
    isCurrentUser: false
  },
  {
    rank: 5,
    id: "usr_4019",
    name: "Mikhail Petrov",
    teamName: "Orbital DeFi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Backend",
    sprintXp: 680,
    totalXp: 3100,
    level: 4,
    levelTitle: "Protocol Engineer",
    questsCompleted: 4,
    badgesCount: 6,
    isCurrentUser: false
  },
  {
    rank: 6,
    id: "usr_3821",
    name: "Marcus Vance",
    teamName: "HyperDrive Protocol",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "AI/ML",
    sprintXp: 500,
    totalXp: 2800,
    level: 4,
    levelTitle: "Protocol Engineer",
    questsCompleted: 4,
    badgesCount: 5,
    isCurrentUser: false
  },
  {
    rank: 7,
    id: "usr_5128",
    name: "Aria Thorne",
    teamName: "QuantumSol",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Research",
    sprintXp: 460,
    totalXp: 2350,
    level: 4,
    levelTitle: "Protocol Engineer",
    questsCompleted: 4,
    badgesCount: 5,
    isCurrentUser: false
  }
];

/**
 * Team Leaderboard Data
 */
export const TEAM_LEADERBOARD = [
  {
    rank: 1,
    teamId: "team-zerostate",
    team: "ZeroState Labs",
    project: "AegisZK Guardrails",
    xp: 3400,
    quests: 6,
    totalQuests: 8,
    commits: 52,
    membersCount: 4,
    passportVerified: true,
    isUserTeam: false
  },
  {
    rank: 2,
    teamId: "team-neuralsync",
    team: "NeuralSync",
    project: "AgentMesh OS",
    xp: 2950,
    quests: 5,
    totalQuests: 8,
    commits: 44,
    membersCount: 3,
    passportVerified: true,
    isUserTeam: false
  },
  {
    rank: 3,
    teamId: "team-hyperdrive",
    team: "HyperDrive Protocol",
    project: "HyperDrive Protocol",
    xp: 2450,
    quests: 5,
    totalQuests: 8,
    commits: 37,
    membersCount: 3,
    passportVerified: true,
    isUserTeam: true
  },
  {
    rank: 4,
    teamId: "team-orbital",
    team: "Orbital DeFi",
    project: "CrossRelay Intent Mesh",
    xp: 2200,
    quests: 4,
    totalQuests: 8,
    commits: 31,
    membersCount: 4,
    passportVerified: true,
    isUserTeam: false
  },
  {
    rank: 5,
    teamId: "team-quantumsol",
    team: "QuantumSol",
    project: "SolQuantum State Engine",
    xp: 1900,
    quests: 4,
    totalQuests: 8,
    commits: 26,
    membersCount: 3,
    passportVerified: false,
    isUserTeam: false
  },
  {
    rank: 6,
    teamId: "team-aerochain",
    team: "AeroChain",
    project: "AeroBridge Cross-Rollup",
    xp: 1650,
    quests: 3,
    totalQuests: 8,
    commits: 19,
    membersCount: 2,
    passportVerified: false,
    isUserTeam: false
  }
];

/**
 * Cross-Hackathon Leaderboard Data
 */
export const HACKATHON_LEADERBOARD = [
  {
    rank: 1,
    hackathonId: "eth-global-2026",
    title: "ETHGlobal Autonomous 2026",
    organizer: "ETHGlobal Foundation",
    teamsCount: 196,
    totalXpPool: "482,500 XP",
    avgTeamXp: 2460,
    status: "LIVE",
    prizePool: "$150,000",
    topGuild: "ZeroState Labs"
  },
  {
    rank: 2,
    hackathonId: "zk-odyssey-2026",
    title: "Zero-Knowledge Odyssey 2026",
    organizer: "ZCash & Aztec Guild",
    teamsCount: 120,
    totalXpPool: "318,000 XP",
    avgTeamXp: 2650,
    status: "COMPLETED",
    prizePool: "$100,000",
    topGuild: "AegisZK"
  },
  {
    rank: 3,
    hackathonId: "fintech-genesis-2026",
    title: "FinTech Genesis: Global Settlement",
    organizer: "FinTech Consortium",
    teamsCount: 65,
    totalXpPool: "135,200 XP",
    avgTeamXp: 2080,
    status: "UPCOMING",
    prizePool: "$60,000",
    topGuild: "AuraPay"
  },
  {
    rank: 4,
    hackathonId: "cybershield-2026",
    title: "CyberShield Security Summit",
    organizer: "OpenZeppelin Guild",
    teamsCount: 85,
    totalXpPool: "156,400 XP",
    avgTeamXp: 1840,
    status: "UPCOMING",
    prizePool: "$75,000",
    topGuild: "Anomaly Sentinel"
  }
];

/**
 * Reward Infrastructure (Prepared for future marketplace integration)
 * Categorized into: Goodies, Coupons, Sponsor Rewards, Community Benefits
 */
export const REWARD_INFRASTRUCTURE = [
  {
    id: "reward-goodie-hoodie",
    category: "GOODIES",
    categoryLabel: "Swag & Physical Goodies",
    title: "HackForge Cyberpunk Builder Hoodie",
    brand: "HackForge Gear",
    xpRequired: 3000,
    tier: "DIAMOND",
    icon: "Shirt",
    description: "Heavyweight embroidered hacker hoodie with NFC-authenticated Build Passport chip embedded in cuff.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-goodie-keycap",
    category: "GOODIES",
    categoryLabel: "Swag & Physical Goodies",
    title: "CNC Anodized Titanium Keycap",
    brand: "Artisan Forge",
    xpRequired: 1800,
    tier: "GOLD",
    icon: "HardDrive",
    description: "Custom Cherry MX profile artisan keycap laser-engraved with your top hackathon rank.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-coupon-aws",
    category: "COUPONS",
    categoryLabel: "Cloud & Dev Coupons",
    title: "$500 AWS Cloud Credits Voucher",
    brand: "Amazon Web Services",
    xpRequired: 2000,
    tier: "GOLD",
    icon: "Cloud",
    description: "Activate EC2, Lambda, S3, and Bedrock infrastructure for post-hackathon product scaling.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-coupon-openai",
    category: "COUPONS",
    categoryLabel: "Cloud & Dev Coupons",
    title: "$100 OpenAI / Anthropic API Credits",
    brand: "OpenAI",
    xpRequired: 1500,
    tier: "SILVER",
    icon: "Sparkles",
    description: "Direct API tokens for GPT-4o, Claude 3.5 Sonnet, and embedding inference pipelines.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-sponsor-grant",
    category: "SPONSOR_REWARDS",
    categoryLabel: "Sponsor Grants & Bounties",
    title: "Aztec Noir ZK Micro-Grant ($5,000 Eligibility)",
    brand: "Aztec Protocol",
    xpRequired: 2500,
    tier: "DIAMOND",
    icon: "Gem",
    description: "Guaranteed fast-track grant review for verified teams utilizing Noir cryptographic circuits.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-sponsor-base",
    category: "SPONSOR_REWARDS",
    categoryLabel: "Sponsor Grants & Bounties",
    title: "Base Gas Grant & Deployment Package",
    brand: "Base Ecosystem",
    xpRequired: 1600,
    tier: "SILVER",
    icon: "Coins",
    description: "Free paymaster gas sponsorship for up to 10,000 smart contract user interactions on Base mainnet.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-community-vip",
    category: "COMMUNITY_BENEFITS",
    categoryLabel: "Community & Career Benefits",
    title: "VIP Demo Day Investor Fast-Track",
    brand: "HackForge Ventures",
    xpRequired: 3500,
    tier: "LEGENDARY",
    icon: "Crown",
    description: "Featured pitch slot in front of 40+ leading crypto and AI venture capital partners.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  },
  {
    id: "reward-community-vanguard",
    category: "COMMUNITY_BENEFITS",
    categoryLabel: "Community & Career Benefits",
    title: "HackForge Discord 'Vanguard Architect' Role",
    brand: "HackForge Community",
    xpRequired: 1000,
    tier: "BRONZE",
    icon: "Award",
    description: "Exclusive role granting access to private developer alpha chats, early bounties, and organizers.",
    availability: "Stage 2 Integration Ready",
    status: "COMING_SOON"
  }
];
