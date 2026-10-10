// =========================================================
// HACKFORGE DEMO MODE ENGINE (SEEDED 5-MINUTE SCENARIO)
// IMPORTANT: All data in this file is clearly labeled as
// simulated/seeded demo telemetry. Not real GitHub API events.
// =========================================================

export const DEMO_HACKATHON_ID = "hackforge-grand-challenge";

export const demoHackathon = {
  id: DEMO_HACKATHON_ID,
  title: "HackForge Grand Challenge",
  tagline: "Flagship 48-Hour Autonomous Systems & Verifiable Architecture Sprint",
  banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  status: "LIVE",
  startsAt: "2026-10-06T10:00:00Z",
  endsAt: "2026-10-08T10:00:00Z",
  timeLeft: "28h 14m remaining",
  prizePool: "$100,000",
  participantsCount: 12,
  teamsCount: 3,
  format: "Hybrid (San Francisco + Virtual)",
  location: "San Francisco / Virtual",
  maxTeamSize: 4,
  organizer: "HackForge Foundation (Elena Vance)",
  isDemoMode: true,
  tracks: [
    { name: "Autonomous Agents", bounty: "$40,000", description: "AI Agent-to-Agent Micro-Settlement Protocols" },
    { name: "Verifiable AI & ZK", bounty: "$35,000", description: "Cryptographic LLM alignment & ZK proofs" },
    { name: "Cross-Rollup Infrastructure", bounty: "$25,000", description: "Sub-second decentralized intent solvers" }
  ],
  rules: [
    "All code must be authored during the 48-hour hackathon window.",
    "Starter boilerplates must be declared before kickoff.",
    "Cryptographic Build Passport is mandatory for jury evaluation eligibility.",
    "Zero-Spam commit policy: repetitive micro-commits award 0 XP.",
    "Maximum team size: 4 builders."
  ],
  allowedStarters: [
    { name: "Next.js 14 + Wagmi + Viem Web3 Starter", repo: "github.com/hackforge-templates/next-viem-starter", stars: 1204, verified: true },
    { name: "Foundry Smart Contract Template", repo: "github.com/hackforge-templates/foundry-forge", stars: 2430, verified: true },
    { name: "FastAPI + LangChain Agent Scaffold", repo: "github.com/hackforge-templates/agent-scaffold", stars: 940, verified: true }
  ],
  problemStatements: [
    {
      id: "ps-demo-1",
      title: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
      track: "Autonomous Agents",
      sponsor: "Starknet & Base",
      bounty: "$40,000",
      description: "Develop high-throughput, low-latency micro-payment channels between AI agents negotiating real-time inference tasks without human intervention."
    },
    {
      id: "ps-demo-2",
      title: "Verifiable Zero-Knowledge LLM Guardrails",
      track: "Verifiable AI & ZK",
      sponsor: "Aztec & Aleo",
      bounty: "$35,000",
      description: "Prove that an AI model executed constitutional alignment constraints without disclosing proprietary model weights or private user prompts."
    },
    {
      id: "ps-demo-3",
      title: "Cross-Rollup Liquidity Rebalancing Daemon",
      track: "Cross-Rollup Infrastructure",
      sponsor: "Arbitrum Foundation",
      bounty: "$25,000",
      description: "Build an intent-based solver daemon that synchronizes decentralized liquidity pools across Optimism, Arbitrum, and Base with sub-second execution."
    }
  ]
};

// 3 SEEDED TEAMS (EACH WITH 4 REGISTERED MEMBERS)
export const demoTeams = [
  {
    id: "team-nexus",
    name: "Nexus Sentinel",
    avatar: "⚡",
    inviteCode: "NEXUS-FORGE-2026",
    slogan: "High-velocity off-chain state channel network with zero-knowledge instant settlement receipts",
    hackathonId: DEMO_HACKATHON_ID,
    problemStatementId: "ps-demo-1",
    problemTitle: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
    track: "Autonomous Agents",
    tagline: "High-velocity off-chain state channel network with zero-knowledge instant settlement receipts",
    githubRepo: "https://github.com/hackforge-demo/nexus-sentinel",
    repoOwner: "hackforge-demo",
    repoName: "nexus-sentinel",
    branch: "main",
    repoStatus: "Connected & Verified [SIMULATED DEMO]",
    commitsCount: 37,
    linesChanged: "+14,290 / -1,120",
    lastCommitTime: "4m ago by Alex Chen",
    xp: 2450,
    xpEarned: 2450,
    level: 4,
    questsCompleted: 5,
    totalQuests: 8,
    progress: 68,
    integrityScore: 97.4,
    integrityStatus: "REVIEW REQUIRED",
    hasPassport: true,
    members: [
      {
        id: "m-1",
        name: "Alex 'Kaelen' Chen",
        role: "Team Leader & Systems Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        github: "alexchen-dev",
        commits: 16,
        linesAdded: 5820,
        linesRemoved: 390,
        prsAuthored: 2,
        discipline: "Smart Contracts & Architecture",
        contributions: "Settlement.sol, PaymentVault.sol, state channel consensus protocol"
      },
      {
        id: "m-2",
        name: "Sophia Zhang",
        role: "Frontend Engineer & UI/UX",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        github: "sophiazhang-ux",
        commits: 11,
        linesAdded: 4890,
        linesRemoved: 520,
        prsAuthored: 1,
        discipline: "Client HUD & Web3 Connectors",
        contributions: "Real-time Agent HUD visualizer, Wagmi wallet connectors, telemetry client"
      },
      {
        id: "m-3",
        name: "Marcus Vance",
        role: "AI/ML Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        github: "marcusvance-ai",
        commits: 6,
        linesAdded: 2480,
        linesRemoved: 130,
        prsAuthored: 1,
        discipline: "FastAPI Daemon & LangChain",
        contributions: "FastAPI inference microservice, quantized PyTorch model, agent chains"
      },
      {
        id: "m-4",
        name: "Elena Rostova",
        role: "Smart Contract Engineer",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        github: "elenarostova-eth",
        commits: 4,
        linesAdded: 1100,
        linesRemoved: 80,
        prsAuthored: 1,
        discipline: "Foundry Tests & Sepolia Deployment",
        contributions: "Foundry invariant test suite, Sepolia testnet deployment scripts"
      }
    ]
  },
  {
    id: "team-zerostate",
    name: "ZeroState Labs",
    avatar: "🛡️",
    inviteCode: "ZERO-STATE-2026",
    slogan: "Cryptographic proof of LLM safety constraints without leaking private prompt data",
    hackathonId: DEMO_HACKATHON_ID,
    problemStatementId: "ps-demo-2",
    problemTitle: "Verifiable Zero-Knowledge LLM Guardrails",
    track: "Verifiable AI & ZK",
    tagline: "Cryptographic proof of LLM safety constraints without leaking private prompt data",
    githubRepo: "https://github.com/hackforge-demo/aegis-zk",
    repoOwner: "hackforge-demo",
    repoName: "aegis-zk",
    branch: "main",
    repoStatus: "Connected & Verified [SIMULATED DEMO]",
    commitsCount: 31,
    linesChanged: "+11,430 / -840",
    lastCommitTime: "18m ago by Daria Novak",
    xp: 1950,
    xpEarned: 1950,
    level: 3,
    questsCompleted: 4,
    totalQuests: 8,
    progress: 54,
    integrityScore: 99.1,
    integrityStatus: "CLEAN",
    hasPassport: true,
    members: [
      {
        id: "m-5",
        name: "Kenji Sato",
        role: "Team Leader & Systems Architect",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        github: "kenjisato-dev",
        commits: 12,
        linesAdded: 4120,
        linesRemoved: 290,
        prsAuthored: 2,
        discipline: "WASM Prover & SnarkVerifier.sol",
        contributions: "WebAssembly proving engine and EVM verifier"
      },
      {
        id: "m-6",
        name: "Daria Novak",
        role: "Zero-Knowledge Cryptographer",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        github: "darianovak-zk",
        commits: 11,
        linesAdded: 4980,
        linesRemoved: 310,
        prsAuthored: 2,
        discipline: "Halo2 Circuits & Constraints",
        contributions: "Halo2 arithmetic constraints and safety gates"
      },
      {
        id: "m-7",
        name: "Liam O'Connor",
        role: "Frontend Engineer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        github: "liam-oconnor-web",
        commits: 5,
        linesAdded: 1650,
        linesRemoved: 140,
        prsAuthored: 1,
        discipline: "Client Audit Studio",
        contributions: "Drag-and-drop prompt auditing interface"
      },
      {
        id: "m-8",
        name: "Priya Sharma",
        role: "Research & Documentation",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        github: "priyasharma-res",
        commits: 3,
        linesAdded: 680,
        linesRemoved: 100,
        prsAuthored: 1,
        discipline: "Security Specifications",
        contributions: "Benchmarking writeups and mathematical proof analysis"
      }
    ]
  },
  {
    id: "team-orbital",
    name: "Orbital Velocity",
    avatar: "🚀",
    inviteCode: "ORBITAL-77X",
    slogan: "Sub-second decentralized solver network for atomic cross-rollup rebalancing",
    hackathonId: DEMO_HACKATHON_ID,
    problemStatementId: "ps-demo-3",
    problemTitle: "Cross-Rollup Liquidity Rebalancing Daemon",
    track: "Cross-Rollup Infrastructure",
    tagline: "Sub-second decentralized solver network for atomic cross-rollup rebalancing",
    githubRepo: "https://github.com/hackforge-demo/cross-relay",
    repoOwner: "hackforge-demo",
    repoName: "cross-relay",
    branch: "main",
    repoStatus: "Connected & Verified [SIMULATED DEMO]",
    commitsCount: 24,
    linesChanged: "+8,870 / -530",
    lastCommitTime: "42m ago by Julian Vance",
    xp: 1600,
    xpEarned: 1600,
    level: 3,
    questsCompleted: 3,
    totalQuests: 8,
    progress: 42,
    integrityScore: 92.5,
    integrityStatus: "STARTER REPO",
    hasPassport: false,
    members: [
      {
        id: "m-9",
        name: "Julian Vance",
        role: "Team Leader & Smart Contracts",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        github: "julianvance-eth",
        commits: 10,
        linesAdded: 3980,
        linesRemoved: 220,
        prsAuthored: 1,
        discipline: "Intent Escrow & EIP-712",
        contributions: "CrossRelayIntent.sol and Dutch auction contracts"
      },
      {
        id: "m-10",
        name: "Mei Lin",
        role: "Distributed Systems & Go",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        github: "meilin-dev",
        commits: 8,
        linesAdded: 2890,
        linesRemoved: 180,
        prsAuthored: 1,
        discipline: "Go Solver Daemon",
        contributions: "Mempool listener and solver matching service"
      },
      {
        id: "m-11",
        name: "Carlos Mendez",
        role: "Smart Contract Engineer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        github: "carlosmendez-web3",
        commits: 4,
        linesAdded: 1200,
        linesRemoved: 90,
        prsAuthored: 1,
        discipline: "Arbitrum & Base Deployments",
        contributions: "Dual-chain testnet deployment and test scripts"
      },
      {
        id: "m-12",
        name: "Tara Campbell",
        role: "UI/UX & Documentation",
        avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
        github: "taracampbell-ui",
        commits: 2,
        linesAdded: 800,
        linesRemoved: 40,
        prsAuthored: 0,
        discipline: "Liquidity Visualizer Dashboard",
        contributions: "React frontend for live orderbook depth monitoring"
      }
    ]
  }
];

// SIMULATED GITHUB ACTIVITY (CLEARLY MARKED AS SIMULATED DEMO TELEMETRY)
export const demoActivities = [
  {
    id: "act-demo-1",
    project_id: "team-nexus",
    type: "COMMIT",
    actor: {
      name: "Alex 'Kaelen' Chen",
      username: "alexchen-dev",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-10-06T10:14:00Z",
    metadata: {
      commit_hash: "a10b42f",
      branch: "main",
      message: "feat(genesis): scaffold off-chain state channel interfaces and next-viem-starter",
      diff: "+1,240 / -18 lines [SIMULATED DEMO]"
    },
    github_event_id: "evt-demo-1"
  },
  {
    id: "act-demo-2",
    project_id: "team-nexus",
    type: "COMMIT",
    actor: {
      name: "Marcus Vance",
      username: "marcusvance-ai",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-10-06T16:45:00Z",
    metadata: {
      commit_hash: "3d9c70b",
      branch: "feat/fastapi-ml",
      message: "feat(ml): initialize FastAPI microservice with LangChain decision chain",
      diff: "+850 / -40 lines [SIMULATED DEMO]"
    },
    github_event_id: "evt-demo-2"
  },
  {
    id: "act-demo-3",
    project_id: "team-nexus",
    type: "COMMIT",
    actor: {
      name: "Sophia Zhang",
      username: "sophiazhang-ux",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-10-06T20:20:00Z",
    metadata: {
      commit_hash: "5e41aa2",
      branch: "feat/hud-visualizer",
      message: "feat(client): implement Agent HUD telemetry visualizer and Wagmi connector",
      diff: "+1,120 / -95 lines [SIMULATED DEMO]"
    },
    github_event_id: "evt-demo-3"
  },
  {
    id: "act-demo-4",
    project_id: "team-nexus",
    type: "MILESTONE",
    actor: {
      name: "HackForge Sentinel",
      username: "hackforge-bot",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-10-06T20:30:00Z",
    metadata: {
      title: "Deploy your first working API",
      message: "Verified backend endpoint /api/v1/health with public deployment URL",
      diff: "+250 XP to Team Vault [SIMULATED DEMO]"
    },
    github_event_id: "evt-demo-q1"
  },
  {
    id: "act-demo-5",
    project_id: "team-nexus",
    type: "PULL_REQUEST",
    actor: {
      name: "Sophia Zhang",
      username: "sophiazhang-ux",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-10-07T13:15:00Z",
    metadata: {
      pr_number: 14,
      title: "Merge Agent HUD visualizer & real-time WebSocket telemetry stream into main",
      action: "MERGED",
      diff: "+712 / -88 lines [SIMULATED DEMO]"
    },
    github_event_id: "evt-demo-pr14"
  },
  {
    id: "act-demo-6",
    project_id: "team-nexus",
    type: "DEPLOYMENT",
    actor: {
      name: "Elena Rostova",
      username: "elenarostova-eth",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-10-07T18:30:00Z",
    metadata: {
      contract_name: "Settlement.sol",
      network: "Sepolia Testnet",
      tx_hash: "0x892a01948303f29b4e12c140994a73710",
      diff: "Contract Verified on Etherscan [SIMULATED DEMO]"
    },
    github_event_id: "evt-demo-deploy"
  }
];

// REQUIRED AI INSIGHT: ONE INTEGRATION BLOCKER
export const demoAiInsights = [
  {
    id: "ai-demo-blocker-1",
    type: "INTEGRATION_BLOCKER",
    severity: "HIGH_BLOCKER",
    title: "CORS Policy Restriction & WebSocket Stream Mismatch",
    description: "The Next.js HUD client (localhost:5173) is encountering Access-Control-Allow-Origin blockage when connecting to the FastAPI Python microservice (/api/v1/inference). Telemetry stream packets are being dropped.",
    affectedWorkstreams: ["Sophia Zhang (Frontend HUD)", "Marcus Vance (AI/ML Engine)"],
    suggestedResolution: "Add CORSMiddleware with whitelist in server.js and allow credentials on /api/v1/inference.",
    impact: "Halts live visualizer demonstration until resolved.",
    detectedAt: "2026-10-07T02:10:00Z",
    isDemo: true
  },
  {
    id: "ai-demo-recom-1",
    type: "SPRINT_PACING",
    severity: "RECOMMENDATION",
    title: "Pacing Optimal: Contract Deployment on Track",
    description: "Team commit velocity is steady with 37 commits distributed evenly across all 4 team members. Next recommended milestone: Invariant fuzz testing.",
    isDemo: true
  }
];

// REQUIRED INTEGRITY ALERT: ONE INTEGRITY REVIEW ALERT
export const demoIntegrityAlert = {
  id: "alert-demo-1",
  teamId: "team-nexus",
  teamName: "Nexus Sentinel",
  classification: "REVIEW_RECOMMENDED",
  concernLevel: "ORGANIZER_REVIEW_REQUIRED",
  severity: "MEDIUM_AUDIT",
  type: "STARTER_TEMPLATE_AUDIT",
  title: "Whitelisted Starter Code Retention & Commit Provenance",
  summary: "Sentinel verified that 3.6% boilerplate lines originated from the whitelisted 'next-viem-starter' template. 96.4% of repository codebase is verified original custom code written within the 48-hour hackathon window. Human organizer countersignature is required before grand prize jury eligibility.",
  reason: "Automated scan identified whitelisted starter code retention (3.6%) from declared next-viem-starter template. Codebase is 96.4% custom original. Ready for organizer sign-off.",
  recommendedAction: "Confirm starter boilerplate whitelist match and countersign clearance for jury evaluation.",
  status: "PENDING_REVIEW",
  codebaseOriginality: "96.4%",
  boilerplateRetention: "3.6%",
  starterTemplate: "next-viem-starter (github.com/hackforge-templates/next-viem-starter)",
  organizerStatus: "PENDING_ORGANIZER_REVIEW",
  flaggedAt: "2026-10-07T09:15:00Z",
  commitHash: "a10b42f",
  notes: "Whitelisted template declared prior to kickoff. Progressive commit cadence confirmed across all 4 squad members.",
  filesInQuestion: [
    { path: "contracts/Settlement.sol", lines: 180, origin: "Original Custom" },
    { path: "src/components/AgentHUD.jsx", lines: 140, origin: "Original Custom" },
    { path: "ml/inference.py", lines: 95, origin: "Original Custom" },
    { path: "package.json", lines: 42, origin: "Whitelisted Starter" }
  ],
  isDemo: true
};

// COMPLETED BUILD PASSPORT FOR NEXUS SENTINEL
export const demoBuildPassport = {
  passportId: "HFP-DEMO-2026-NEXUS",
  projectId: "PROJ-NEXUS-2026",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://hackforge.dev/verify/HFP-DEMO-2026-NEXUS",
  publicVerificationUrl: "https://hackforge.dev/verify/HFP-DEMO-2026-NEXUS",
  projectName: "Nexus Sentinel Engine",
  teamName: "Nexus Sentinel",
  hackathonName: "HackForge Grand Challenge",
  problemStatement: "Autonomous Agent-to-Agent Micro-Settlement Friction: AI agents executing high-frequency autonomous workflows are bottlenecked by L1 gas fees and non-verifiable latency.",
  projectDescription: "A high-velocity off-chain state channel network backed by zero-knowledge receipts and an on-chain smart contract vault for trustless instant settlement.",
  cryptographicHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  merkleRoot: "0x8fa109b83726ec4911d041e88bc1947e2b10a301e19488a01",
  genesisTimestamp: "2026-10-06T10:14:00Z",
  generatedTimestamp: "2026-10-08T09:45:00Z",
  status: "VERIFIED_ELIGIBLE",
  integrityScore: 97.4,
  isDemo: true,
  project: {
    name: "Nexus Sentinel Engine",
    teamName: "Nexus Sentinel",
    problemStatement: "Autonomous Agent-to-Agent Micro-Settlement Friction",
    description: "High-throughput off-chain state channels with instant ZK dispute receipts",
    category: "Autonomous Agents",
    track: "Autonomous Agents",
    repoUrl: "https://github.com/hackforge-demo/nexus-sentinel"
  },
  team: {
    name: "Nexus Sentinel",
    totalMembers: 4,
    members: demoTeams[0].members
  },
  development: {
    hackathonDuration: "48 Hours (Oct 06, 2026 - Oct 08, 2026)",
    commitsTotal: 37,
    linesAdded: 14290,
    linesRemoved: 1120,
    pullRequests: [
      { number: 14, title: "Agent HUD visualizer & real-time telemetry stream", author: "Sophia Zhang", status: "MERGED", additions: 712, deletions: 88 }
    ],
    deployments: [
      { name: "Live Frontend Application", url: "https://nexus-sentinel.vercel.app", provider: "Vercel", status: "ACTIVE", type: "FRONTEND" },
      { name: "Settlement Smart Contract", address: "0x892a01948303f29b4e12c140994a73710", network: "Sepolia Testnet", status: "VERIFIED", type: "SMART_CONTRACT" }
    ]
  },
  integrity: {
    starterCode: {
      template: "next-viem-starter",
      allowed: true,
      retention: "3.6%",
      originality: "96.4% custom original codebase",
      verdict: "Whitelisted and Verified"
    },
    organizerReview: {
      status: "VERIFIED_ELIGIBLE",
      decision: "Approved & Countersigned",
      reviewedBy: "Elena Vance (HackForge Foundation Lead)",
      signature: "0x88f2...ee91",
      countersignedAt: "2026-10-07T14:45:00Z"
    }
  },
  gamification: {
    xpEarned: 2450,
    questsCompleted: 5,
    totalQuests: 8,
    leaderboardRank: 1
  }
};

// THE 12-STEP GUIDED DEMO FLOW DEFINITION
export const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Organizer creates hackathon",
    shortName: "Organizer Configures Sprint",
    role: "organizer",
    route: "/organizer/create",
    headline: "Step 1: Organizer Deploys HackForge Grand Challenge",
    description: "The hackathon organizer configures sprint rules, allowed starter repositories, problem statements, and integrity audit thresholds through the 5-step wizard.",
    bannerText: "DEMO STEP 1 OF 12 • ORGANIZER PERSPECTIVE",
    icon: "Shield"
  },
  {
    step: 2,
    title: "2. Team joins",
    shortName: "Squad Forms via Invite Code",
    role: "team_leader",
    route: `/hackathons/${DEMO_HACKATHON_ID}/team`,
    headline: "Step 2: Squad 'Nexus Sentinel' Forms with 4 Members",
    description: "Participants join using team invite code 'NEXUS-FORGE-2026'. Roles are assigned: Systems Architect, Frontend UI/UX, AI/ML Engineer, and Smart Contract Dev.",
    bannerText: "DEMO STEP 2 OF 12 • TEAM LEADER PERSPECTIVE",
    icon: "Users"
  },
  {
    step: 3,
    title: "3. Problem selected",
    shortName: "Problem Statement Locked",
    role: "team_leader",
    route: `/hackathons/${DEMO_HACKATHON_ID}`,
    headline: "Step 3: Team Locks Problem Statement",
    description: "The team selects 'Autonomous Agent-to-Agent Micro-Settlement Protocol' ($40,000 bounty) from the sponsored tracks, committing their sprint target.",
    bannerText: "DEMO STEP 3 OF 12 • TRACK SELECTION",
    icon: "Target"
  },
  {
    step: 4,
    title: "4. Team creates project",
    shortName: "Project Scope Declared",
    role: "team_leader",
    route: `/hackathons/${DEMO_HACKATHON_ID}/scope`,
    headline: "Step 4: Team Submits Structured Project Scope",
    description: "Before code development begins, the squad declares their core features (ZK State Channels, AI Negotiation, Real-Time HUD) to establish a baseline for Project Scope Intelligence.",
    bannerText: "DEMO STEP 4 OF 12 • SCOPE INTELLIGENCE",
    icon: "Compass"
  },
  {
    step: 5,
    title: "5. GitHub connected",
    shortName: "GitHub Repository Linked",
    role: "team_leader",
    route: `/hackathons/${DEMO_HACKATHON_ID}/team`,
    headline: "Step 5: GitHub Repository Linked with OAuth [Simulated Telemetry]",
    description: "The team connects repository 'hackforge-demo/nexus-sentinel'. HackForge initiates automated commit telemetry and integrity tracking. Clearly labeled as simulated demo telemetry.",
    bannerText: "DEMO STEP 5 OF 12 • GITHUB INTEGRATION",
    icon: "GitBranch"
  },
  {
    step: 6,
    title: "6. Activity appears",
    shortName: "Normalized Activity Timeline",
    role: "participant",
    route: `/hackathons/${DEMO_HACKATHON_ID}/activity`,
    headline: "Step 6: Real-Time Development Timeline Streams Commits",
    description: "Normalized activities appear instantly: commits from Alex Chen, FastAPI microservice from Marcus Vance, HUD visualizer from Sophia Zhang, and PR merges.",
    bannerText: "DEMO STEP 6 OF 12 • TELEMETRY STREAM",
    icon: "GitCommit"
  },
  {
    step: 7,
    title: "7. AI identifies blocker",
    shortName: "AI Copilot Detects Blocker",
    role: "participant",
    route: `/hackathons/${DEMO_HACKATHON_ID}/ai`,
    headline: "Step 7: HackForge AI Copilot Flags Integration Blocker",
    description: "AI Copilot diagnoses a CORS Policy restriction and WebSocket buffer mismatch between the Next.js HUD and FastAPI service, recommending a specific middleware resolution.",
    bannerText: "DEMO STEP 7 OF 12 • AI COPILOT REASONING",
    icon: "Cpu"
  },
  {
    step: 8,
    title: "8. Team completes quest",
    shortName: "Milestone Quest Completed",
    role: "participant",
    route: `/hackathons/${DEMO_HACKATHON_ID}/quests`,
    headline: "Step 8: Quest Completed: 'Deploy your first working API' (+250 XP)",
    description: "With health endpoint verified, the team claims the quest milestone. +250 XP is added to the Team Vault, leveling up the squad to LVL 4 with badge unlocks.",
    bannerText: "DEMO STEP 8 OF 12 • GAMIFICATION & QUESTS",
    icon: "Zap"
  },
  {
    step: 9,
    title: "9. Integrity system generates review alert",
    shortName: "Sentinel Generates Review Alert",
    role: "organizer",
    route: `/organizer/hackathons/${DEMO_HACKATHON_ID}/integrity`,
    headline: "Step 9: Sentinel Flags ⚠ INTEGRITY REVIEW Alert",
    description: "HackForge Sentinel detects 3.6% starter boilerplate lines from next-viem-starter. Rather than penalizing the team, it alerts organizers for human review: 'Transparency, not automatic punishment.'",
    bannerText: "DEMO STEP 9 OF 12 • PROVENANCE SENTINEL",
    icon: "ShieldAlert"
  },
  {
    step: 10,
    title: "10. Organizer reviews alert",
    shortName: "Organizer Reviews & Clears Alert",
    role: "organizer",
    route: `/organizer/hackathons/${DEMO_HACKATHON_ID}/integrity`,
    headline: "Step 10: Organizer Inspects Code Lineage & Countersigns",
    description: "The organizer reviews commit history, confirms the pre-registered starter template, verifies 96.4% original code, and clicks 'Countersign & Clear for Jury'.",
    bannerText: "DEMO STEP 10 OF 12 • HUMAN ORGANIZER CLEARANCE",
    icon: "CheckCircle"
  },
  {
    step: 11,
    title: "11. Team submits",
    shortName: "Final Submission Sealed",
    role: "team_leader",
    route: `/hackathons/${DEMO_HACKATHON_ID}/team`,
    headline: "Step 11: Team Submits Final Portfolio & Testnet Proof",
    description: "With Sepolia testnet contract deployed and live Vercel app verified, team leader locks the final project portfolio for jury deliberation.",
    bannerText: "DEMO STEP 11 OF 12 • PROJECT SUBMISSION",
    icon: "Lock"
  },
  {
    step: 12,
    title: "12. Build Passport generated",
    shortName: "Build Passport Cryptographically Sealed",
    role: "judge",
    route: `/hackathons/${DEMO_HACKATHON_ID}/passport`,
    headline: "Step 12: Cryptographic Build Passport Sealed with Public QR Verification",
    description: "HackForge generates the immutable Build Passport with SHA-256 state hash, Merkle root, verified commit audit, and public verification link (/verify/HFP-DEMO-2026-NEXUS).",
    bannerText: "DEMO STEP 12 OF 12 • BUILD PASSPORT SEALED",
    icon: "Award"
  }
];
