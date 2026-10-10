// =========================================================
// HACKFORGE MOCK DATA ENGINE
// Purpose-built realistic hackathon data & telemetry
// =========================================================

export const initialUser = {
  id: "usr_9021",
  name: "Alex 'Kaelen' Chen",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "team_leader", // participant | team_leader | organizer | judge | mentor
  bio: "Full-stack AI systems builder & smart contract engineer. Passionate about autonomous agents and verifiable computation.",
  github: "alexchen-dev",
  email: "alex@hackforge.dev",
  xp: 5350,
  level: 6,
  levelTitle: "Quantum Architect",
  nextLevelXp: 6500,
  skills: ["TypeScript", "React", "Rust", "Solidity", "PyTorch", "Tailwind", "FastAPI", "Docker"],
  stats: {
    hackathonsWon: 3,
    hackathonsParticipated: 8,
    questsCompleted: 42,
    passportsIssued: 5,
    integrityScore: "99.2%"
  },
  badges: [
    { id: "b1", title: "Genesis Committer", category: "Speed", icon: "Zap", tier: "Gold", description: "Pushed verified code within first 30 mins of hackathon", unlockedAt: "2026-03-12" },
    { id: "b2", title: "Clean Build 100", category: "Integrity", icon: "ShieldCheck", tier: "Legendary", description: "Achieved >95% Build Passport originality audit", unlockedAt: "2026-02-18" },
    { id: "b3", title: "Midnight Oil", category: "Grind", icon: "Moon", tier: "Silver", description: "Logged 10+ commits between 01:00 and 05:00 UTC", unlockedAt: "2026-01-20" },
    { id: "b4", title: "AI Whisperer", category: "Innovation", icon: "Cpu", tier: "Gold", description: "Integrated autonomous LLM agent with verified tool-use", unlockedAt: "2026-02-28" },
    { id: "b5", title: "Passport Pioneer", category: "Special", icon: "Award", tier: "Legendary", description: "Hold 5+ verified cryptographic Build Passports", unlockedAt: "2026-03-01" },
    { id: "b6", title: "Grand Finalist", category: "Placement", icon: "Trophy", tier: "Gold", description: "Top 3 Podium placement at an ETHGlobal hackathon", unlockedAt: "2025-11-14" },
  ]
};

export const hackathons = [
  {
    id: "eth-global-2026",
    title: "ETHGlobal Autonomous 2026",
    tagline: "Build autonomous on-chain agents and verifiable AI protocols",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    status: "LIVE", // UPCOMING, LIVE, JUDGING, COMPLETED
    startsAt: "2026-09-20T10:00:00Z",
    endsAt: "2026-09-23T18:00:00Z",
    timeLeft: "31h 14m remaining",
    prizePool: "$150,000",
    participantsCount: 842,
    teamsCount: 196,
    format: "Virtual / Global",
    organizer: "ETHGlobal Foundation",
    tracks: [
      { name: "Autonomous Agents", prize: "$50,000", description: "Self-governing agent meshes on L2s" },
      { name: "Zero-Knowledge Proofs", prize: "$40,000", description: "Private verifiable state machines" },
      { name: "DeFi Velocity", prize: "$35,000", description: "Algorithmic liquidity and micro-routing" },
      { name: "Public Goods", prize: "$25,000", description: "Developer tooling and integrity audits" }
    ],
    rules: [
      "All code submitted must be written during the 72-hour window.",
      "Starter boilerplates must be declared and whitelisted on HackForge before kick-off.",
      "Every team must generate a verified Build Passport to be eligible for judging.",
      "Commit bursts (>5k lines unreviewed) will trigger automated integrity audits.",
      "Teams max 4 members. Cross-collaboration and mentor office hours are encouraged."
    ],
    allowedStarters: [
      { name: "Next.js 14 + Wagmi + Viem Web3 Starter", repo: "github.com/hackforge-templates/next-viem-starter", stars: 1204, verified: true },
      { name: "Foundry Smart Contract Template", repo: "github.com/hackforge-templates/foundry-forge", stars: 2430, verified: true },
      { name: "FastAPI + LangChain Agent Scaffold", repo: "github.com/hackforge-templates/agent-scaffold", stars: 940, verified: true }
    ],
    problemStatements: [
      {
        id: "ps-1",
        title: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
        track: "Autonomous Agents",
        sponsor: "Starknet & Base",
        bounty: "$25,000",
        description: "Develop high-throughput, low-latency micro-payment channels between AI agents negotiating real-time inference tasks without human intervention."
      },
      {
        id: "ps-2",
        title: "Verifiable Zero-Knowledge LLM Guardrails",
        track: "Zero-Knowledge Proofs",
        sponsor: "Aztec & Aleo",
        bounty: "$20,000",
        description: "Prove that an AI model executed specific constitutional alignment constraints without disclosing the private model weights or prompt payload."
      },
      {
        id: "ps-3",
        title: "Cross-Rollup Liquidity Rebalancing Daemon",
        track: "DeFi Velocity",
        sponsor: "Arbitrum Foundation",
        bounty: "$15,000",
        description: "Create an intent-based solver network that automatically balances DEX pools across Optimism, Arbitrum, and Base with sub-second execution."
      }
    ]
  },
  {
    id: "nexus-ai-forge",
    title: "Nexus AI Agentic Hackathon",
    tagline: "Next-gen multi-agent collaborative workflows & developer tools",
    banner: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    status: "LIVE",
    startsAt: "2026-09-18T00:00:00Z",
    endsAt: "2026-09-22T23:59:59Z",
    timeLeft: "14h 22m remaining",
    prizePool: "$80,000",
    participantsCount: 620,
    teamsCount: 140,
    format: "Hybrid (San Francisco + Online)",
    organizer: "Nexus Labs",
    tracks: [
      { name: "Developer Copilots", prize: "$30,000", description: "Autonomous bug diagnosis and auto-fixing" },
      { name: "Autonomous Enterprise Agents", prize: "$30,000", description: "Real-world API automation" },
      { name: "Multimodal Perception", prize: "$20,000", description: "Vision-language agents" }
    ],
    rules: [
      "Open-source license required (MIT/Apache 2.0).",
      "Must showcase live demonstration video.",
      "HackForge Build Passport must confirm <15% external unreferenced code."
    ],
    allowedStarters: [
      { name: "Vite React + Tailwind + OpenAI SDK", repo: "github.com/nexus-labs/react-agent-starter", stars: 850, verified: true }
    ],
    problemStatements: [
      {
        id: "ps-n1",
        title: "Deterministic Agent Memory Consolidation",
        track: "Developer Copilots",
        sponsor: "Nexus Labs",
        bounty: "$15,000",
        description: "Build an open-source vector-less graph memory system that enables LLM agents to maintain infinite task context without hallucination."
      }
    ]
  },
  {
    id: "cyber-sentinel-2026",
    title: "Zero-Trust Cyber Sentinel",
    tagline: "Defend critical decentralized infrastructure against zero-day exploits",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    status: "UPCOMING",
    startsAt: "2026-10-05T09:00:00Z",
    endsAt: "2026-10-08T18:00:00Z",
    timeLeft: "Starts in 14 days",
    prizePool: "$100,000",
    participantsCount: 412,
    teamsCount: 88,
    format: "Virtual",
    organizer: "Open Defense Alliance",
    tracks: [
      { name: "Smart Contract Fuzzing", prize: "$40,000", description: "Automated bytecode formal verification" },
      { name: "Decentralized IAM", prize: "$35,000", description: "Hardware-enclave zero trust authentication" },
      { name: "Anomaly Sentinel", prize: "$25,000", description: "Real-time RPC transaction intrusion detection" }
    ],
    rules: [
      "All exploits must be tested on sandboxed local testnets.",
      "Responsible disclosure protocols apply."
    ],
    allowedStarters: [],
    problemStatements: []
  },
  {
    id: "fintech-genesis-2026",
    title: "FinTech Genesis: Global Settlement",
    tagline: "Next generation borderless payments, RWA tokens, and clearing",
    banner: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    status: "UPCOMING",
    startsAt: "2026-10-18T12:00:00Z",
    endsAt: "2026-10-21T18:00:00Z",
    timeLeft: "Starts in 27 days",
    prizePool: "$60,000",
    participantsCount: 310,
    teamsCount: 65,
    format: "Virtual",
    organizer: "FinTech Consortium",
    tracks: [
      { name: "RWA Tokenization", prize: "$25,000", description: "Real-world assets on public ledgers" },
      { name: "Instant Forex", prize: "$20,000", description: "Sub-second sovereign currency swaps" }
    ],
    rules: ["Compliance simulation sandbox required."],
    allowedStarters: [],
    problemStatements: []
  }
];

export const TEAM_ROLES = [
  "Team Leader",
  "Frontend",
  "Backend",
  "AI/ML",
  "Hardware",
  "UI/UX",
  "Research",
  "Presentation"
];

export const currentTeam = {
  id: "team-hyperdrive",
  hackathonId: "eth-global-2026",
  name: "HyperDrive Protocol",
  avatar: "⚡",
  slogan: "Autonomous high-velocity agent settlement layer with instant ZK receipts",
  inviteCode: "FORGE-7X9Q",
  problemStatementId: "ps-1",
  problemStatementTitle: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
  githubRepo: "https://github.com/hyperdrive-protocol/settlement-engine",
  repoStatus: "Connected & Synced",
  branch: "main",
  commitsCount: 37,
  linesChanged: "+14,290 / -1,120",
  lastCommitTime: "12 mins ago",
  integrityScore: 97.4,
  xpEarned: 2450,
  leaderboardRank: 3,
  members: [
    {
      id: "usr_9021",
      name: "Alex 'Kaelen' Chen",
      role: "Team Leader",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      commits: 18,
      xp: 1200,
      status: "Active now"
    },
    {
      id: "usr_1042",
      name: "Sophia Zhang",
      role: "Frontend",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      commits: 11,
      xp: 750,
      status: "Active 25m ago"
    },
    {
      id: "usr_3821",
      name: "Marcus Vance",
      role: "AI/ML",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      commits: 8,
      xp: 500,
      status: "Active 1h ago"
    }
  ],
  techStack: ["Next.js 14", "FastAPI", "Python", "TypeScript", "LangChain", "Docker"],
  structuredProjectDescription: {
    problem: "Autonomous Agent-to-Agent Micro-Settlement Friction: AI agents executing high-frequency autonomous workflows are bottlenecked by L1 gas fees and non-verifiable latency.",
    proposedSolution: "A high-velocity off-chain state channel network backed by zero-knowledge receipts and an on-chain smart contract vault for trustless instant settlement.",
    majorFeatures: [
      "Authentication",
      "AI Prediction",
      "Real-time Alerts",
      "Mobile Application",
      "Escrow Settlement Engine"
    ],
    techStack: ["Next.js 14", "FastAPI", "Python", "TypeScript", "LangChain", "Docker", "Solidity"],
    expectedArchitecture: "Three-tier architecture comprising a Next.js Client HUD, FastAPI inference microservice, and Solidity state channel smart contract",
    milestones: [
      "Milestone 1: Repository initialization and starter scaffold setup",
      "Milestone 2: Agent authentication and JWT signature verifiers",
      "Milestone 3: AI prediction and LangChain decision engine",
      "Milestone 4: Real-time telemetry alerts and live notifications",
      "Milestone 5: Cross-platform mobile telemetry app (deferred)"
    ],
    submittedAt: "2026-09-20T10:05:00Z"
  }
};

export const initialQuests = [
  {
    id: "q-1",
    phase: "Phase 1: Genesis",
    title: "Initialize Repository",
    description: "Initialize the project repository on GitHub, verify starter boilerplate compliance, and invite team collaborators.",
    tier: "Bronze",
    xpReward: 150,
    status: "COMPLETED", // LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
    claimed: true,
    progress: 100,
    checklist: [
      { task: "Initialize Git repository with main branch", done: true },
      { task: "Verify starter boilerplate and licensing", done: true },
      { task: "Create initial README.md with project overview", done: true }
    ]
  },
  {
    id: "q-2",
    phase: "Phase 1: Genesis",
    title: "Complete Project Architecture",
    description: "Document core system architecture, data schemas, and API contracts before diving into feature engineering.",
    tier: "Silver",
    xpReward: 200,
    status: "COMPLETED",
    claimed: true,
    progress: 100,
    checklist: [
      { task: "Create ARCHITECTURE.md with system diagram", done: true },
      { task: "Define data schemas and state machine", done: true },
      { task: "Specify external API integrations and dependencies", done: true }
    ]
  },
  {
    id: "q-3",
    phase: "Phase 2: Core MVP",
    title: "First Successful Build",
    description: "Establish automated continuous integration, compile project binaries without errors, and verify the test harness.",
    tier: "Silver",
    xpReward: 200,
    status: "COMPLETED",
    claimed: true,
    progress: 100,
    checklist: [
      { task: "Configure build scripts and package dependencies", done: true },
      { task: "Execute build pipeline with 0 compilation errors", done: true },
      { task: "Verify baseline unit test suite executes cleanly", done: true }
    ]
  },
  {
    id: "q-4",
    phase: "Phase 2: Core MVP",
    title: "Deploy your first working API",
    description: "Launch your core backend microservice with live HTTP/WebSocket endpoints and a verified public deployment URL.",
    tier: "Gold",
    xpReward: 250,
    status: "AVAILABLE",
    claimed: false,
    progress: 60,
    evidenceFields: [
      { key: "endpoint", label: "Backend Endpoint", placeholder: "e.g. /api/v1/health or /api/settle", value: "https://api.hyperdrive.hackforge.dev/v1/health" },
      { key: "deploymentUrl", label: "Deployment URL", placeholder: "e.g. https://hyperdrive-api.fly.dev", value: "" }
    ],
    checklist: [
      { task: "Backend endpoint exists and returns 200 OK", done: true },
      { task: "Public deployment URL provided and responsive", done: false }
    ]
  },
  {
    id: "q-5",
    phase: "Phase 2: Core MVP",
    title: "First AI Model",
    description: "Incorporate autonomous machine learning or LLM agent pipelines with verifiable tool-calling and guardrails.",
    tier: "Gold",
    xpReward: 300,
    status: "AVAILABLE",
    claimed: false,
    progress: 33,
    checklist: [
      { task: "Integrate model weights or LLM agent pipeline", done: true },
      { task: "Establish structured tool-calling & output validation", done: false },
      { task: "Log benchmark inference latency and cost bounds", done: false }
    ]
  },
  {
    id: "q-6",
    phase: "Phase 3: Deployment & Polish",
    title: "First API Integration",
    description: "Connect frontend client components to live backend endpoints with deterministic error handling and state synchronization.",
    tier: "Silver",
    xpReward: 250,
    status: "IN_PROGRESS",
    claimed: false,
    progress: 66,
    checklist: [
      { task: "Connect frontend HUD to live backend APIs", done: true },
      { task: "Implement optimistic state updates & loading guards", done: true },
      { task: "Handle edge-case network retries & session recovery", done: false }
    ]
  },
  {
    id: "q-7",
    phase: "Phase 3: Deployment & Polish",
    title: "Deploy MVP",
    description: "Publish a fully operational, publicly accessible prototype where judges and mentors can experience the user workflow.",
    tier: "Gold",
    xpReward: 400,
    status: "IN_PROGRESS",
    claimed: false,
    progress: 50,
    checklist: [
      { task: "Deploy production build to Vercel, Fly.io, or AWS", done: true },
      { task: "Verify end-to-end interactive user flow without console errors", done: false },
      { task: "Ensure mobile responsive design and fast load performance", done: false }
    ]
  },
  {
    id: "q-8",
    phase: "Phase 4: Finale & Passport",
    title: "Complete Documentation",
    description: "Provide comprehensive developer documentation, setup instructions, architecture breakdown, and API references.",
    tier: "Silver",
    xpReward: 200,
    status: "AVAILABLE",
    claimed: false,
    progress: 0,
    checklist: [
      { task: "Publish complete README with architecture breakdown", done: false },
      { task: "Document local setup & deployment instructions", done: false },
      { task: "Publish API reference & interactive sandbox link", done: false }
    ]
  },
  {
    id: "q-9",
    phase: "Phase 4: Finale & Passport",
    title: "Final Submission",
    description: "Lock final code freeze, record a 3-minute video presentation, and mint the tamper-evident Build Passport.",
    tier: "Legendary",
    xpReward: 500,
    status: "LOCKED",
    claimed: false,
    progress: 0,
    checklist: [
      { task: "Record 3-minute video walkthrough or Loom demo", done: false },
      { task: "Pass HackForge Integrity Sentinel originality audit", done: false },
      { task: "Mint cryptographic Build Passport certificate", done: false },
      { task: "Submit entry into official HackForge Jury Queue", done: false }
    ]
  }
];

export const initialActivities = [
  {
    id: "act-commit-1112",
    project_id: "team-hyperdrive",
    type: "COMMIT",
    actor: {
      name: "Kritika",
      username: "kritika-dev",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-09-23T23:12:00Z",
    metadata: {
      message: "Updated documentation",
      hash: "8f4a21e",
      branch: "main",
      url: "https://github.com/hyperdrive-protocol/settlement-engine/commit/8f4a21e",
      additions: 120,
      deletions: 12,
      changed_files: 3
    },
    github_event_id: "gh-commit-8f4a21e"
  },
  {
    id: "act-commit-1058",
    project_id: "team-hyperdrive",
    type: "COMMIT",
    actor: {
      name: "Arjun",
      username: "arjun-ml",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-09-23T22:58:00Z",
    metadata: {
      message: "Created ML inference service",
      hash: "3d9c70b",
      branch: "ai-inference",
      url: "https://github.com/hyperdrive-protocol/settlement-engine/commit/3d9c70b",
      additions: 430,
      deletions: 25,
      changed_files: 5
    },
    github_event_id: "gh-commit-3d9c70b"
  },
  {
    id: "act-commit-1042",
    project_id: "team-hyperdrive",
    type: "COMMIT",
    actor: {
      name: "Rachit",
      username: "rachit-security",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-09-23T22:42:00Z",
    metadata: {
      message: "Added API authentication",
      hash: "a12e99f",
      branch: "main",
      url: "https://github.com/hyperdrive-protocol/settlement-engine/commit/a12e99f",
      additions: 185,
      deletions: 14,
      changed_files: 4
    },
    github_event_id: "gh-commit-a12e99f"
  },
  {
    id: "act-pr-14",
    project_id: "team-hyperdrive",
    type: "PULL_REQUEST",
    actor: {
      name: "Kritika",
      username: "kritika-dev",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-09-23T21:30:00Z",
    metadata: {
      number: 14,
      title: "Agent HUD visualizer & real-time telemetry stream",
      branch: "hud-visuals",
      base: "main",
      url: "https://github.com/hyperdrive-protocol/settlement-engine/pull/14",
      is_merged: true,
      additions: 712,
      deletions: 88
    },
    github_event_id: "gh-pr-14"
  },
  {
    id: "act-milestone-api",
    project_id: "team-hyperdrive",
    type: "MILESTONE",
    actor: {
      name: "HackForge Sentinel",
      username: "hackforge-bot",
      avatar_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
    },
    timestamp: "2026-09-23T20:15:00Z",
    metadata: {
      title: "Deploy your first working API",
      message: "Verified backend endpoint /api/v1/health with public deployment URL",
      diff: "+250 XP to Team Vault"
    },
    github_event_id: "evt-milestone-q4"
  }
];

export const currentBuildPassport = {
  passportId: "HFP-2026-9842A-77",
  projectId: "PROJ-HYPERDRIVE-2026",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://hackforge.dev/verify/HFP-2026-9842A-77",
  publicVerificationUrl: "https://hackforge.dev/verify/HFP-2026-9842A-77",
  projectName: "HyperDrive Protocol",
  teamName: "HyperDrive Protocol",
  hackathonName: "ETHGlobal Autonomous 2026",
  problemStatement: "Autonomous Agent-to-Agent Micro-Settlement Friction: AI agents executing high-frequency autonomous workflows are bottlenecked by L1 gas fees and non-verifiable latency.",
  projectDescription: "A high-velocity off-chain state channel network backed by zero-knowledge receipts and an on-chain smart contract vault for trustless instant settlement.",
  declaredMajorFeatures: [
    "Authentication",
    "AI Prediction",
    "Real-time Alerts",
    "Mobile Application",
    "Escrow Settlement Engine"
  ],
  cryptographicHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  merkleRoot: "0x8fa109b83726ec4911d041e88bc1947e2b10a301e19488a01",
  genesisTimestamp: "2026-09-20T10:14:22Z",
  generatedTimestamp: "2026-09-22T09:45:00Z",
  status: "VERIFIED_ELIGIBLE",
  integrityScore: 97.4,

  // PROJECT DATA
  project: {
    name: "HyperDrive Protocol",
    teamName: "HyperDrive Protocol",
    problemStatement: "Autonomous Agent-to-Agent Micro-Settlement Friction: AI agents executing high-frequency autonomous workflows are bottlenecked by L1 gas fees and non-verifiable latency.",
    description: "A high-velocity off-chain state channel network backed by zero-knowledge receipts and an on-chain smart contract vault for trustless instant settlement.",
    category: "Autonomous AI Agents & DeFi",
    track: "Autonomous Agents",
    repoUrl: "https://github.com/hyperdrive-protocol/settlement-engine"
  },

  // TEAM SECTION
  team: {
    name: "HyperDrive Protocol",
    members: [
      {
        id: "usr_9021",
        name: "Alex 'Kaelen' Chen",
        role: "Team Leader & Systems Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        commits: 18,
        linesAdded: 6420,
        linesRemoved: 410,
        prsAuthored: 2,
        contributions: "Smart contracts (Settlement.sol, PaymentVault.sol), state channel consensus, and repository orchestration."
      },
      {
        id: "usr_1042",
        name: "Sophia Zhang",
        role: "Frontend Engineer & UI/UX",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        commits: 11,
        linesAdded: 4890,
        linesRemoved: 520,
        prsAuthored: 1,
        contributions: "Agent HUD visualizer (src/components/AgentHUD.jsx), real-time telemetry streaming, and Web3 wallet connectors."
      },
      {
        id: "usr_3821",
        name: "Marcus Vance",
        role: "AI/ML Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        commits: 8,
        linesAdded: 2980,
        linesRemoved: 190,
        prsAuthored: 1,
        contributions: "FastAPI Python inference microservice, PyTorch model deployment, and LangChain decision engine (ml/inference.py)."
      }
    ],
    totalMembers: 3
  },

  // DEVELOPMENT SECTION
  development: {
    hackathonDuration: "48 Hours (Sep 20, 2026, 10:00 UTC - Sep 22, 2026, 10:00 UTC)",
    timeline: [
      { timestamp: "Sep 20, 10:14 UTC", actor: "Alex Chen", event: "Genesis: Cloned and verified next-viem-starter template", hash: "a10b42f", type: "COMMIT" },
      { timestamp: "Sep 20, 13:30 UTC", actor: "Alex Chen", event: "Defined state channel settlement protocols and contract interfaces", hash: "c29e108", type: "COMMIT" },
      { timestamp: "Sep 20, 16:45 UTC", actor: "Marcus Vance", event: "Scaffolded FastAPI microservice and LangChain agent chain", hash: "3d9c70b", type: "COMMIT" },
      { timestamp: "Sep 20, 20:20 UTC", actor: "Sophia Zhang", event: "Linked Agent HUD visualizer with Web3 wallet connectors", hash: "5e41aa2", type: "COMMIT" },
      { timestamp: "Sep 21, 02:10 UTC", actor: "Alex Chen", event: "Resolved FastAPI CORS mismatch with frontend proxy", hash: "7f1190a", type: "COMMIT" },
      { timestamp: "Sep 21, 08:40 UTC", actor: "Marcus Vance", event: "Integrated PyTorch inference model with sub-50ms latency", hash: "99a0b12", type: "COMMIT" },
      { timestamp: "Sep 21, 13:15 UTC", actor: "Sophia Zhang", event: "Merged PR #14: Agent HUD visualizer & real-time telemetry stream", hash: "8f4a21e", type: "PULL_REQUEST" },
      { timestamp: "Sep 21, 18:30 UTC", actor: "Alex Chen", event: "Deployed Settlement.sol contract to Sepolia testnet", hash: "0x892a01...", type: "DEPLOYMENT" },
      { timestamp: "Sep 21, 21:45 UTC", actor: "Alex Chen", event: "Cryptographic proof sealing and final submission to jury", hash: "7f83b165...", type: "SUBMISSION" }
    ],
    majorMilestones: [
      { id: "m1", title: "Genesis Scaffold & Starter Whitelist", status: "VERIFIED", date: "Sep 20, 10:14 UTC", hash: "a10b42f" },
      { id: "m2", title: "First Working API & Health Endpoint", status: "VERIFIED", date: "Sep 20, 20:15 UTC", hash: "3d9c70b" },
      { id: "m3", title: "AI Decision Microservice Live", status: "VERIFIED", date: "Sep 21, 08:40 UTC", hash: "99a0b12" },
      { id: "m4", title: "Smart Contract Testnet Deployment", status: "VERIFIED", date: "Sep 21, 18:30 UTC", hash: "0x892a0194" },
      { id: "m5", title: "Live Vercel Production Build", status: "VERIFIED", date: "Sep 21, 20:00 UTC", hash: "vercel-prod" }
    ],
    commitsTotal: 37,
    linesAdded: 14290,
    linesRemoved: 1120,
    pullRequests: [
      { number: 14, title: "Agent HUD visualizer & real-time telemetry stream", author: "Sophia Zhang", status: "MERGED", additions: 712, deletions: 88 },
      { number: 15, title: "Integrate FastAPI inference with LangChain agent", author: "Marcus Vance", status: "MERGED", additions: 430, deletions: 25 }
    ],
    issues: [
      { number: 8, title: "CORS policy blocking localhost:5173 on /api/v1/inference", author: "Sophia Zhang", status: "RESOLVED", resolution: "Added CORSMiddleware with whitelist in server.js" },
      { number: 9, title: "Missing TypeScript interfaces for AgentDecision payload", author: "Sophia Zhang", status: "RESOLVED", resolution: "Synced schemas in types/agent.ts" }
    ],
    deployments: [
      { name: "Live Frontend Application", url: "https://hyperdrive-settle.vercel.app", provider: "Vercel", status: "ACTIVE", type: "FRONTEND" },
      { name: "Settlement Smart Contract", address: "0x892a01948303f29b4e12c140994a73710", network: "Sepolia Testnet", status: "VERIFIED", type: "SMART_CONTRACT" },
      { name: "Inference API Microservice", url: "https://api-hyperdrive.fly.dev/v1/health", provider: "Fly.io", status: "ACTIVE", type: "BACKEND" }
    ]
  },

  // PROJECT JOURNEY (9 PHASES)
  projectJourney: [
    { phase: "Problem", title: "Autonomous Agent Settlement Friction", description: "Identified high L1 gas fees and unpredictable confirmation times as core blockers for micro-transacting AI agents.", status: "COMPLETED", date: "Sep 20, 10:00 UTC" },
    { phase: "Idea", title: "Off-Chain ZK State Channels", description: "Formulated peer-to-peer balance channels with batch zero-knowledge proofs settled onto an on-chain vault.", status: "COMPLETED", date: "Sep 20, 11:30 UTC" },
    { phase: "Architecture", title: "Three-Tier Decoupled System", description: "Architected Next.js 14 client HUD, Python FastAPI inference engine, and Solidity EVM state channels.", status: "COMPLETED", date: "Sep 20, 13:45 UTC" },
    { phase: "Prototype", title: "Minimal Channel Opening Prototype", description: "Constructed dual-signature state channel mock and initial cryptographic hashing script in Hardhat.", status: "COMPLETED", date: "Sep 20, 17:00 UTC" },
    { phase: "Development", title: "Full-Stack Implementation", description: "Authored 37 commits across contracts/Settlement.sol, ml/inference.py, and src/components/AgentHUD.jsx.", status: "COMPLETED", date: "Sep 21, 04:00 UTC" },
    { phase: "Integration", title: "Client & Microservice Bridging", description: "Connected frontend WebSockets to agent decision endpoints and resolved cross-origin communication bottlenecks.", status: "COMPLETED", date: "Sep 21, 11:00 UTC" },
    { phase: "Testing", title: "Simulated Agent Settlement Stress Tests", description: "Executed 10,000 simulated agent micro-transactions with 0 state divergence and sub-50ms latency.", status: "COMPLETED", date: "Sep 21, 15:30 UTC" },
    { phase: "Deployment", title: "Sepolia Testnet & Vercel Production", description: "Sealed smart contracts at address 0x892a01948303f29b4e12c140994a73710 and deployed live web application.", status: "COMPLETED", date: "Sep 21, 18:30 UTC" },
    { phase: "Final Submission", title: "Cryptographic Build Passport Sealed", description: "Generated immutable passport SHA-256 hash and submitted complete portfolio to ETHGlobal jury.", status: "COMPLETED", date: "Sep 21, 21:45 UTC" }
  ],

  // AI SUMMARY (Clearly segregated AI-generated analytical synthesis)
  aiSummary: {
    disclaimer: "Generated by HackForge AI Copilot from repository activity, commit diffs, and pull requests. AI summaries represent analytical syntheses and are not factual audit proofs.",
    whatBuilt: "HyperDrive Protocol is an autonomous micro-settlement engine that allows high-frequency AI agents to execute sub-second value transfers without incurring on-chain L1 gas fees. It couples a Next.js 14 telemetry HUD with a FastAPI Python inference microservice and an EVM state channel smart contract that verifies zero-knowledge transaction receipts.",
    majorTechnicalDecisions: [
      "State Channel Architecture: Selected off-chain ZK state channels over on-chain settlement loops to eliminate per-transaction gas fees.",
      "Decoupled Microservice: Isolated AI model inference into an asynchronous Python FastAPI service using LangChain, avoiding client-side runtime bloat.",
      "Cryptographic Receipt Verifier: Utilized SHA-256 state Merkle roots on Solidity Settlement vault for trustless dispute resolution."
    ],
    majorIterations: [
      "Shifted telemetry pipeline from REST polling to a streaming event architecture in src/components/AgentHUD.jsx (PR #14).",
      "Refactored authentication logic from manual session tokens into unified JWT middleware in server/middleware/jwt.js."
    ],
    detectedBlockers: [
      "CORS Policy Restriction: Frontend encountered Access-Control-Allow-Origin blockage on /api/v1/inference during local orchestration.",
      "TypeScript Payload Mismatch: Python ML agent responses lacked typed schemas in the Next.js client, causing initial telemetry render failures."
    ],
    howResolved: [
      "Configured FastAPI CORSMiddleware to whitelist local dev origins and production Vercel domains.",
      "Standardized AgentDecision JSON schemas and generated matching TypeScript interfaces in types/agent.ts."
    ]
  },

  // INTEGRITY & PROVENANCE (Organizer Review & Audit)
  integrity: {
    repositoryHistory: "Organic incremental progression. Repository initialized 14 minutes after hackathon kickoff. Zero pre-hackathon code injections detected. 37 commits distributed evenly across sprint duration.",
    starterCode: {
      template: "next-viem-starter (github.com/hackforge-templates/next-viem-starter)",
      allowed: true,
      retention: "3.6%",
      originality: "96.4% custom original codebase",
      verdict: "Whitelisted and Verified"
    },
    integrityAlerts: {
      activeAlertsCount: 0,
      status: "CLEAN_AUDIT",
      summary: "0 active anomalies. Provenance audit verified clean (Sentinel Confidence: 98%). All commits originated from registered team members."
    },
    organizerReview: {
      status: "VERIFIED_ELIGIBLE",
      decision: "Approved & Countersigned",
      reviewedBy: "ETHGlobal Lead Integrity Jury",
      signature: "0x77c1...aa8",
      organizerNotes: "Starter template whitelisted automatically by Sentinel. Organic commit lineage confirmed across all 3 team members. Cleared for Grand Prize evaluation.",
      countersignedAt: "2026-09-21T14:45:00Z"
    }
  },

  // GAMIFICATION
  gamification: {
    xpEarned: 2450,
    questsCompleted: 5,
    totalQuests: 8,
    leaderboardRank: 3,
    badges: [
      { id: "b1", title: "Genesis Forge", description: "Repo initialized within 30m of start", icon: "⚡", rarity: "Common" },
      { id: "b2", title: "Architecture Master", description: "Complete system architecture & schemas documented", icon: "🏛️", rarity: "Rare" },
      { id: "b3", title: "AI Integrator", description: "Successfully linked LangChain agent to HUD", icon: "🧠", rarity: "Epic" },
      { id: "b4", title: "Clean Lineage", description: "100% organic commit distribution without bursts", icon: "🛡️", rarity: "Legendary" },
      { id: "b5", title: "Testnet Pioneer", description: "Deployed verified smart contract to testnet", icon: "💎", rarity: "Rare" }
    ]
  },

  breakdown: {
    originalCodePercent: 96.4,
    boilerplateRetentionPercent: 3.6,
    commitContinuityScore: 98.0,
    teamContributionBalance: 92.5
  },
  repoMetrics: {
    totalCommits: 37,
    branchesMerged: 9,
    linesAdded: 14290,
    linesRemoved: 1120,
    starterRepoOrigin: "github.com/hackforge-templates/next-viem-starter (verified clone)"
  },
  liveDeployUrl: "https://hyperdrive-settle.vercel.app",
  contractAddress: "0x892a01948303f29b4e12c140994a73710",
  demoVideoUrl: "https://youtube.com/watch?v=demo-hyperdrive",
  verifiers: [
    { name: "HackForge Integrity Sentinel v3.2", status: "PASS", signature: "0x3a9f...41e" },
    { name: "GitHub Audit Webhook", status: "PASS", signature: "0x992b...d10" },
    { name: "ETHGlobal Organizer Key", status: "COUNTERSIGNED", signature: "0x77c1...aa8" }
  ]
};

export const organizerMetrics = {
  totalTeams: 196,
  activeBuilds: 172,
  totalCommits: 4892,
  linesWrittenTotal: "1.42M",
  flaggedIntegrityAlerts: 4,
  averageIntegrityScore: 91.8,
  passportsGenerated: 24,
  submissionsPending: 172
};

export const mockIntegrityAlerts = [
  {
    id: "alert-provenance-201",
    teamName: "AuraPay Protocol",
    teamId: "team-aurapay",
    repoUrl: "https://github.com/aurapay/payment-channel-engine",
    classification: "REVIEW_RECOMMENDED",
    concernLevel: "Review Recommended",
    severity: "MEDIUM",
    reason: "A substantial portion of the declared \"payment engine\" appears to have repository history predating the hackathon start.",
    evidence: {
      filesCount: 14,
      firstObservedDate: "2026-09-18T14:20:00Z",
      hackathonStartDate: "2026-09-20T10:00:00Z",
      hoursPredating: 44,
      totalLines: 4280,
      summary: "14 files. First observed: 2026-09-18. Hackathon started: 2026-09-20."
    },
    relevantFiles: [
      { path: "src/engine/payment_channel.ts", additions: 840, firstObserved: "2026-09-18", isStarterAllowed: false, featureTag: "payment engine" },
      { path: "src/engine/escrow_settler.ts", additions: 620, firstObserved: "2026-09-18", isStarterAllowed: false, featureTag: "payment engine" },
      { path: "src/engine/multi_token_router.ts", additions: 710, firstObserved: "2026-09-18", isStarterAllowed: false, featureTag: "payment engine" },
      { path: "contracts/PaymentVault.sol", additions: 590, firstObserved: "2026-09-18", isStarterAllowed: false, featureTag: "payment engine" },
      { path: "package.json", additions: 45, firstObserved: "2026-09-18", isStarterAllowed: true, starterName: "next-viem-starter" },
      { path: "next.config.js", additions: 22, firstObserved: "2026-09-18", isStarterAllowed: true, starterName: "next-viem-starter" }
    ],
    relevantCommits: [
      { hash: "8f12a9c", message: "Initial payment gateway contracts and routing engine", author: "Kunal V.", timestamp: "2026-09-18T14:20:00Z", additions: 4280, predatesHackathon: true }
    ],
    declaredFeatures: ["payment engine", "multi-token routing", "ZK state proofs"],
    confidence: "88% (High Confidence)",
    recommendedAction: "Ask team to explain the origin and role of these files.",
    flaggedAt: "1 hour ago",
    status: "INVESTIGATING",
    organizerNotes: ""
  },
  {
    id: "alert-provenance-202",
    teamName: "SpeedyScript",
    teamId: "team-speedy",
    repoUrl: "https://github.com/speedyscript/arb-engine",
    classification: "HIGH_PRIORITY_REVIEW",
    concernLevel: "High Priority Review",
    severity: "CRITICAL",
    reason: "A large monolithic algorithmic trading feature appeared immediately after team creation with sudden bulk code addition of 24,800 lines.",
    evidence: {
      filesCount: 38,
      firstObservedDate: "2026-09-20T10:18:00Z",
      hackathonStartDate: "2026-09-20T10:00:00Z",
      hoursPredating: 0,
      totalLines: 24800,
      summary: "38 files. Single snapshot commit authored 18 minutes after registration containing complete production trading engine with zero iterative branch activity."
    },
    relevantFiles: [
      { path: "core/orderbook/matching_engine.cpp", additions: 9400, firstObserved: "2026-09-20", isStarterAllowed: false, featureTag: "matching engine" },
      { path: "core/evm/flashloan_arbitrage.sol", additions: 7200, firstObserved: "2026-09-20", isStarterAllowed: false, featureTag: "arbitrage contracts" },
      { path: "python/strategies/cross_dex_arb.py", additions: 5100, firstObserved: "2026-09-20", isStarterAllowed: false, featureTag: "arb strategy" }
    ],
    relevantCommits: [
      { hash: "7b4c910", message: "Full initial build and core engines", author: "Victor S.", timestamp: "2026-09-20T10:18:00Z", additions: 24800, predatesHackathon: false }
    ],
    declaredFeatures: ["algorithmic arbitrage engine", "sub-millisecond orderbook", "flashloan routing"],
    confidence: "94% (High Confidence)",
    recommendedAction: "Request code walkthrough and verify implementation history with team leader.",
    flaggedAt: "25 mins ago",
    status: "INVESTIGATING",
    organizerNotes: ""
  },
  {
    id: "alert-provenance-203",
    teamName: "DeepCrypto Labs",
    teamId: "team-deepcrypto",
    repoUrl: "https://github.com/deepcrypto/zk-identity",
    classification: "REVIEW_RECOMMENDED",
    concernLevel: "Review Recommended",
    severity: "HIGH",
    reason: "Git origin history contains root commits timestamped 118 days prior to hackathon launch.",
    evidence: {
      filesCount: 19,
      firstObservedDate: "2026-05-24T09:15:00Z",
      hackathonStartDate: "2026-09-20T10:00:00Z",
      hoursPredating: 2832,
      totalLines: 6150,
      summary: "19 files. Root commit was authored 118 days prior to sprint. Multiple branch merges indicate ongoing development prior to hackathon."
    },
    relevantFiles: [
      { path: "circuits/membership_proof.circom", additions: 1850, firstObserved: "2026-05-24", isStarterAllowed: false, featureTag: "ZK membership" },
      { path: "contracts/IdentityRegistry.sol", additions: 1200, firstObserved: "2026-05-24", isStarterAllowed: false, featureTag: "Identity Registry" }
    ],
    relevantCommits: [
      { hash: "1a08ef4", message: "Initial cryptographic identity circuits", author: "Mikhail P.", timestamp: "2026-05-24T09:15:00Z", additions: 6150, predatesHackathon: true }
    ],
    declaredFeatures: ["ZK identity circuits", "on-chain identity registry"],
    confidence: "92% (High Confidence)",
    recommendedAction: "Ask team to clarify if repository is an unreferenced past project or public research template.",
    flaggedAt: "2 hours ago",
    status: "EXPLANATION_REQUESTED",
    organizerNotes: "Inquiry dispatched via HackForge messenger on 2026-09-21: Requested clarification on commit 1a08ef4."
  },
  {
    id: "alert-provenance-204",
    teamName: "HyperDrive Protocol",
    teamId: "team-hyperdrive",
    repoUrl: "https://github.com/hyperdrive-protocol/settlement-engine",
    classification: "LOW_CONCERN",
    concernLevel: "Low Concern",
    severity: "LOW",
    reason: "Normal incremental development verified. Starter boilerplate files ('next-viem-starter') declared and whitelisted; all custom code authored strictly within sprint window.",
    evidence: {
      filesCount: 0,
      firstObservedDate: "2026-09-20T10:14:00Z",
      hackathonStartDate: "2026-09-20T10:00:00Z",
      hoursPredating: 0,
      totalLines: 14290,
      summary: "0 pre-existing files. Repository created 14 minutes after start. 37 commits organic progression across sprint with 3.6% starter retention exempt."
    },
    relevantFiles: [
      { path: "package.json", additions: 64, firstObserved: "2026-09-20", isStarterAllowed: true, starterName: "next-viem-starter" },
      { path: "tsconfig.json", additions: 28, firstObserved: "2026-09-20", isStarterAllowed: true, starterName: "next-viem-starter" }
    ],
    relevantCommits: [
      { hash: "a12e99f", message: "Added API authentication", author: "Rachit", timestamp: "2026-09-23T22:42:00Z", additions: 185, predatesHackathon: false }
    ],
    declaredFeatures: ["micro-settlement engine", "ZK receipt generation", "Agent HUD visualizer"],
    confidence: "98% (High Confidence)",
    recommendedAction: "No action required. Provenance audit verified compliant.",
    flaggedAt: "3 hours ago",
    status: "ALLOWED",
    organizerNotes: "Starter template whitelisted automatically by Sentinel."
  }
];


export const organizerJudgingCriteria = [
  {
    id: "execution",
    label: "Technical Execution & Architecture",
    weight: 0.25,
    weightPercent: "25%",
    description: "Code architecture, system scalability, robust error handling, security, and verified technical execution."
  },
  {
    id: "innovation",
    label: "Innovation & Originality",
    weight: 0.25,
    weightPercent: "25%",
    description: "Novelty of the solution, creative problem-solving, uniqueness within the track, and advancing state-of-the-art."
  },
  {
    id: "implementation",
    label: "Feature Completeness & Scope",
    weight: 0.20,
    weightPercent: "20%",
    description: "Degree to which proposed major features are implemented, working end-to-end flow, and live prototype fidelity."
  },
  {
    id: "design",
    label: "UI/UX & Developer Ergonomics",
    weight: 0.15,
    weightPercent: "15%",
    description: "Usability, user interface polish, developer experience, clear flows, and clean responsive layout."
  },
  {
    id: "impact",
    label: "Real-World Impact & Viability",
    weight: 0.15,
    weightPercent: "15%",
    description: "Ecosystem utility, practical applicability, value proposition, and roadmap viability beyond the hackathon."
  }
];

export const mockJudgeQueue = [
  {
    id: "proj-1",
    name: "HyperDrive Protocol",
    teamName: "HyperDrive Protocol",
    track: "Autonomous Agents",
    problemStatement: {
      title: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
      track: "Autonomous Agents",
      sponsor: "Starknet & Base",
      bounty: "$25,000",
      description: "Develop high-throughput, low-latency micro-payment channels between AI agents negotiating real-time inference tasks without human intervention."
    },
    tagline: "Autonomous high-velocity agent settlement layer with instant ZK receipts",
    repoUrl: "https://github.com/hyperdrive-protocol/settlement-engine",
    demoUrl: "https://hyperdrive-settle.vercel.app",
    status: "PENDING_REVIEW",
    scores: {
      execution: 9.0,
      innovation: 9.5,
      implementation: 9.0,
      design: 8.5,
      impact: 9.0
    },
    notes: "Outstanding verifiable commit lineage. The off-chain ZK state channels resolve sub-second agent payments with zero gas overhead.",
    executiveSummary: {
      whatBuilt: "HyperDrive Protocol is an autonomous micro-settlement engine that allows high-frequency AI agents to execute sub-second value transfers without incurring on-chain L1 gas fees. It couples a Next.js 14 telemetry HUD with an asynchronous Python FastAPI inference engine and an EVM state channel smart contract that verifies zero-knowledge transaction receipts.",
      coreValue: "Solves the fundamental agentic commerce dilemma: AI agents running millions of micro-tasks cannot afford $0.15 - $2.00 in gas fees per decision. HyperDrive batches 10,000+ interactions off-chain and settles with cryptographic finality."
    },
    buildJourney: [
      { time: "Day 1, 10:14 UTC", phase: "Genesis & Setup", actor: "Alex Chen", event: "Cloned & whitelisted next-viem-starter template; initialized Foundry repo", type: "COMMIT", hash: "a10b42f" },
      { time: "Day 1, 13:30 UTC", phase: "Architecture", actor: "Alex Chen", event: "Defined state channel settlement interfaces and PaymentVault contract", type: "COMMIT", hash: "c29e108" },
      { time: "Day 1, 16:45 UTC", phase: "Backend & ML", actor: "Marcus Vance", event: "Scaffolded FastAPI microservice and LangChain autonomous decision chain", type: "COMMIT", hash: "3d9c70b" },
      { time: "Day 1, 20:20 UTC", phase: "Frontend HUD", actor: "Sophia Zhang", event: "Linked Agent HUD visualizer with Web3 wallet connectors & state streaming", type: "COMMIT", hash: "5e41aa2" },
      { time: "Day 2, 02:10 UTC", phase: "Bug Resolution", actor: "Alex Chen", event: "Resolved FastAPI CORS mismatch with frontend proxy in server middleware", type: "COMMIT", hash: "7f1190a" },
      { time: "Day 2, 08:40 UTC", phase: "AI Optimization", actor: "Marcus Vance", event: "Integrated PyTorch inference model with sub-50ms latency", type: "COMMIT", hash: "99a0b12" },
      { time: "Day 2, 13:15 UTC", phase: "Integration", actor: "Sophia Zhang", event: "Merged PR #14: Agent HUD visualizer & real-time WebSocket telemetry stream", type: "PULL_REQUEST", hash: "8f4a21e" },
      { time: "Day 2, 18:30 UTC", phase: "Deployment", actor: "Alex Chen", event: "Deployed Settlement.sol contract to Sepolia testnet at 0x892a01...", type: "DEPLOYMENT", hash: "0x892a0194" },
      { time: "Day 2, 21:45 UTC", phase: "Submission", actor: "Alex Chen", event: "Cryptographic proof sealing and final submission to jury with verified Build Passport", type: "SUBMISSION", hash: "7f83b165" }
    ],
    teamContributions: {
      summary: "Balanced 3-person collaboration across systems architecture, frontend telemetry HUD, and machine learning inference.",
      members: [
        {
          name: "Alex 'Kaelen' Chen",
          role: "Team Leader & Systems Architect",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          github: "alexchen-dev",
          commitsCount: 18,
          prsCount: 2,
          linesAdded: 6420,
          linesRemoved: 410,
          areas: ["Smart Contracts", "State Channel Consensus", "Repo Orchestration"],
          contributions: "Authored Settlement.sol and PaymentVault.sol, designed off-chain ZK state channel consensus protocol, and handled Sepolia contract deployment."
        },
        {
          name: "Sophia Zhang",
          role: "Frontend Engineer & UI/UX",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          github: "sophiazhang-ux",
          commitsCount: 11,
          prsCount: 1,
          linesAdded: 4890,
          linesRemoved: 520,
          areas: ["Agent HUD Visualizer", "WebSocket Streaming", "Web3 Connectors"],
          contributions: "Built the real-time Agent HUD visualizer (src/components/AgentHUD.jsx), streaming telemetry client, and integrated Wagmi/Viem wallet connections."
        },
        {
          name: "Marcus Vance",
          role: "AI/ML Engineer",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          github: "marcusvance-ai",
          commitsCount: 8,
          prsCount: 1,
          linesAdded: 2980,
          linesRemoved: 190,
          areas: ["FastAPI Microservice", "PyTorch Model", "LangChain Agent"],
          contributions: "Created the asynchronous FastAPI inference microservice, deployed the quantized PyTorch model, and configured LangChain autonomous agent decision chains."
        }
      ]
    },
    technicalImplementation: {
      architecture: "Three-tier decoupled architecture separating high-speed client telemetry, asynchronous AI inference microservice, and verifiable EVM smart contract settlements.",
      components: [
        { name: "Client Visualizer (HUD)", role: "Real-time state monitoring and transaction authorization", tech: "Next.js 14, React, TailwindCSS, Wagmi/Viem" },
        { name: "Inference Daemon", role: "Sub-50ms autonomous price negotiation and task routing", tech: "Python FastAPI, PyTorch, LangChain, WebSockets" },
        { name: "Settlement Vault", role: "Dispute resolution and Merkle batch settlement", tech: "Solidity 0.8.24, Foundry, Sepolia Testnet" }
      ],
      technologies: ["Solidity 0.8.24", "Foundry", "Next.js 14", "FastAPI", "PyTorch", "LangChain", "Wagmi / Viem", "TailwindCSS"],
      majorFeatures: [
        { name: "Off-Chain ZK State Channels", status: "VERIFIED", evidence: "contracts/Settlement.sol lines 45-180", description: "Bilateral payment channels supporting instant balance transfers" },
        { name: "Autonomous Agent Negotiation", status: "VERIFIED", evidence: "ml/inference.py lines 20-95", description: "LangChain autonomous agent deciding transaction acceptance in <50ms" },
        { name: "Real-Time Telemetry HUD", status: "VERIFIED", evidence: "src/components/AgentHUD.jsx lines 1-140", description: "Live WebSocket feed showing pending vs settled agent balances" },
        { name: "Sepolia Testnet Deployment", status: "VERIFIED", evidence: "Tx: 0x892a01948303f29b4e12c140994a73710", description: "Verified contract on Sepolia with passing test suite" }
      ]
    },
    buildPassport: {
      passportId: "HFP-2026-9842A-77",
      merkleRoot: "0x8fa109b83726ec4911d041e88bc1947e2b10a301e19488a01",
      sha256: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      verifiedCommits: 37,
      verifiedPRs: 2,
      verifiedDeployments: 3,
      issuedAt: "Sep 22, 2026, 09:45 UTC",
      verificationUrl: "/verify/HFP-2026-9842A-77",
      status: "VERIFIED_ELIGIBLE"
    },
    organizerApprovedIntegrity: {
      approved: true,
      reviewStatus: "APPROVED & COUNTERSIGNED BY LEAD ORGANIZER",
      reviewedBy: "Elena Vance (ETHGlobal Lead Integrity Jury)",
      reviewedAt: "Sep 21, 2026, 14:45 UTC",
      starterCode: {
        name: "next-viem-starter",
        whitelisted: true,
        retention: "3.6%",
        customCode: "96.4%"
      },
      auditVerdict: "Clean Provenance Verified. Whitelisted template recorded prior to kickoff. Organic, progressive commit cadence across all 3 team members with zero pre-existing code anomalies.",
      organizerNotes: "Starter template whitelisted automatically by Sentinel. Organic commit lineage confirmed across all 3 team members. Cleared for Grand Prize evaluation."
    }
  },
  {
    id: "proj-2",
    name: "AegisZK Guardrails",
    teamName: "ZeroState Labs",
    track: "Zero-Knowledge Proofs",
    problemStatement: {
      title: "Verifiable Zero-Knowledge LLM Guardrails",
      track: "Zero-Knowledge Proofs",
      sponsor: "Aztec & Aleo",
      bounty: "$20,000",
      description: "Prove that an AI model executed specific constitutional alignment constraints without disclosing the private model weights or prompt payload."
    },
    tagline: "Cryptographic proof of LLM safety constraints without leaking private prompt data",
    repoUrl: "https://github.com/zerostate/aegis-zk",
    demoUrl: "https://aegis-zk.vercel.app",
    status: "SCORED",
    scores: {
      execution: 9.5,
      innovation: 9.5,
      implementation: 9.0,
      design: 8.5,
      impact: 9.0
    },
    notes: "Remarkable cryptographic depth. Client-side SNARK proving executes in under 1.8 seconds on browser WASM.",
    executiveSummary: {
      whatBuilt: "AegisZK compiles LLM safety policies into Halo2 zero-knowledge circuits. It allows AI model providers to cryptographically certify that a response passed toxic content, PII, and bias filters without revealing proprietary model weights or confidential user prompt queries.",
      coreValue: "Enables zero-knowledge compliance for enterprise AI deployments in regulated industries (healthcare, finance, defense) where disclosing prompt contents or internal weights is legally prohibited."
    },
    buildJourney: [
      { time: "Day 1, 11:00 UTC", phase: "Genesis & Circuit Design", actor: "Daria Novak", event: "Initialized Halo2 proving repository & Aztec Noir DSL workspace", type: "COMMIT", hash: "b21e890" },
      { time: "Day 1, 15:20 UTC", phase: "Circuit Implementation", actor: "Daria Novak", event: "Implemented circuit constraints for token entropy and sentiment boundaries", type: "COMMIT", hash: "44fa12c" },
      { time: "Day 1, 19:40 UTC", phase: "WASM Prover", actor: "Kenji Sato", event: "Compiled Halo2 proving keys to WebAssembly for client-side evaluation", type: "COMMIT", hash: "99ea781" },
      { time: "Day 2, 03:15 UTC", phase: "Verifier Contract", actor: "Kenji Sato", event: "Deployed on-chain SnarkVerifier.sol contract to Base Sepolia", type: "DEPLOYMENT", hash: "0x33b190" },
      { time: "Day 2, 09:30 UTC", phase: "Frontend Prover Studio", actor: "Kenji Sato", event: "Built live browser verifier with drag-and-drop prompt auditing", type: "COMMIT", hash: "cc9011a" },
      { time: "Day 2, 17:00 UTC", phase: "Final Benchmark", actor: "Daria Novak", event: "Benchmarked proof generation: 1,740ms on M2 MacBook Air; submitted Build Passport", type: "SUBMISSION", hash: "1198ae4" }
    ],
    teamContributions: {
      summary: "2-person cryptography and systems engineering squad specializing in Halo2 and WebAssembly runtime optimization.",
      members: [
        {
          name: "Daria Novak",
          role: "Zero-Knowledge Cryptographer",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
          github: "darianovak-zk",
          commitsCount: 28,
          prsCount: 3,
          linesAdded: 8210,
          linesRemoved: 340,
          areas: ["Halo2 Circuits", "Constraint Systems", "Aztec Noir DSL"],
          contributions: "Designed the constitutional safety arithmetic circuits, polynomial commitment constraints, and proving parameters."
        },
        {
          name: "Kenji Sato",
          role: "Full-Stack WebAssembly Engineer",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
          github: "kenjisato-dev",
          commitsCount: 24,
          prsCount: 2,
          linesAdded: 5340,
          linesRemoved: 410,
          areas: ["WASM Runtime", "SnarkVerifier.sol", "Client Studio"],
          contributions: "Optimized Rust-to-WASM compilation pipeline, authored on-chain EVM verifier contract, and built the browser demonstration studio."
        }
      ]
    },
    technicalImplementation: {
      architecture: "Client-side WASM prover generates Halo2 SNARK proofs from LLM logits; EVM contract or remote auditor verifies proof in O(1) time without reading tokens.",
      components: [
        { name: "Safety Circuit", role: "Constrains model output distributions without revealing prompt", tech: "Rust, Halo2, Aztec Noir" },
        { name: "Browser WASM Engine", role: "In-browser proof synthesis under 2 seconds", tech: "WebAssembly, Web Workers" },
        { name: "EVM Verifier", role: "On-chain zero-knowledge proof verification", tech: "Solidity 0.8.24, Base Sepolia" }
      ],
      technologies: ["Rust", "Halo2", "WebAssembly", "Solidity", "Aztec Noir", "React", "TypeScript", "Vite"],
      majorFeatures: [
        { name: "Sub-2s In-Browser Prover", status: "VERIFIED", evidence: "circuits/src/lib.rs benchmark suite", description: "Proves compliance entirely on client hardware with 0 server leakage" },
        { name: "On-Chain SNARK Verifier", status: "VERIFIED", evidence: "contracts/SnarkVerifier.sol verified on Base Sepolia", description: "Instant O(1) proof validation on EVM for <120k gas" },
        { name: "Toxic Logit Constraint Matrix", status: "VERIFIED", evidence: "circuits/src/constraints.rs lines 1-120", description: "Mathematical proof that probability mass on blacklisted tokens was zero" }
      ]
    },
    buildPassport: {
      passportId: "HFP-2026-4419B-12",
      merkleRoot: "0x77c9012a99182301928410283019284019283019",
      sha256: "sha256:9912019483019284102938401928301948201948",
      verifiedCommits: 52,
      verifiedPRs: 5,
      verifiedDeployments: 2,
      issuedAt: "Sep 22, 2026, 08:30 UTC",
      verificationUrl: "/verify/HFP-2026-4419B-12",
      status: "VERIFIED_ELIGIBLE"
    },
    organizerApprovedIntegrity: {
      approved: true,
      reviewStatus: "APPROVED & COUNTERSIGNED BY LEAD ORGANIZER",
      reviewedBy: "Marcus Holloway (ETHGlobal Chief Technical Steward)",
      reviewedAt: "Sep 21, 2026, 16:20 UTC",
      starterCode: {
        name: "none (scratch build)",
        whitelisted: true,
        retention: "0%",
        customCode: "100% custom original codebase"
      },
      auditVerdict: "Flawless Lineage. 100% original cryptographic codebase created within the hackathon timeframe. All circuit tests compile cleanly.",
      organizerNotes: "Exceptionally thorough commit record. Code reviewed by technical integrity team. Ready for final evaluation."
    }
  },
  {
    id: "proj-3",
    name: "CrossRelay Intent Mesh",
    teamName: "Orbital DeFi",
    track: "DeFi Velocity",
    problemStatement: {
      title: "Cross-Rollup Liquidity Rebalancing Daemon",
      track: "DeFi Velocity",
      sponsor: "Arbitrum Foundation",
      bounty: "$15,000",
      description: "Create an intent-based solver network that automatically balances DEX pools across Optimism, Arbitrum, and Base with sub-second execution."
    },
    tagline: "Decentralized solver network for sub-second cross-rollup swaps",
    repoUrl: "https://github.com/orbital-defi/cross-relay",
    demoUrl: "https://crossrelay.xyz",
    status: "PENDING_REVIEW",
    scores: {
      execution: 8.5,
      innovation: 8.0,
      implementation: 8.5,
      design: 8.0,
      impact: 8.5
    },
    notes: "Strong solver mechanics and great liquidity routing visualization.",
    executiveSummary: {
      whatBuilt: "CrossRelay is a decentralized intent protocol that allows automated market makers (AMMs) across Arbitrum, Optimism, and Base to synchronize inventory without relying on slow canonical bridges. Off-chain solvers compete in a Dutch auction to fulfill rebalancing orders using flash-swaps.",
      coreValue: "Reduces cross-chain DEX slippage by up to 78% by substituting multi-minute bridge waits with 400ms atomic filler commitments."
    },
    buildJourney: [
      { time: "Day 1, 12:00 UTC", phase: "Genesis & Smart Contracts", actor: "Julian Vance", event: "Deployed CrossRelayIntent.sol interfaces and intent struct hashing", type: "COMMIT", hash: "e102931" },
      { time: "Day 1, 18:00 UTC", phase: "Solver Daemon", actor: "Mei Lin", event: "Built Golang solver daemon listening to mempool intents across rollups", type: "COMMIT", hash: "f990123" },
      { time: "Day 2, 06:00 UTC", phase: "Cross-Chain Simulation", actor: "Julian Vance", event: "Simulated 500 concurrent rebalancing trades on Arbitrum Sepolia", type: "COMMIT", hash: "0192841" },
      { time: "Day 2, 14:00 UTC", phase: "Web3 Frontend", actor: "Mei Lin", event: "Shipped React dashboard displaying live cross-rollup liquidity imbalances", type: "DEPLOYMENT", hash: "a001928" },
      { time: "Day 2, 20:00 UTC", phase: "Submission", actor: "Julian Vance", event: "Sealed Build Passport and registered submission with jury", type: "SUBMISSION", hash: "9918293" }
    ],
    teamContributions: {
      summary: "2-person DeFi protocol and high-frequency backend engineering team.",
      members: [
        {
          name: "Julian Vance",
          role: "Smart Contract Engineer",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          github: "julianvance-eth",
          commitsCount: 19,
          prsCount: 2,
          linesAdded: 4890,
          linesRemoved: 310,
          areas: ["Solidity Contracts", "Dutch Auction Engine", "Sepolia Deployments"],
          contributions: "Authored CrossRelayIntent.sol and IntentEscrow.sol, implemented EIP-712 structured data signing, and handled contract verification."
        },
        {
          name: "Mei Lin",
          role: "Distributed Systems & Frontend",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
          github: "meilin-dev",
          commitsCount: 12,
          prsCount: 1,
          linesAdded: 3980,
          linesRemoved: 220,
          areas: ["Golang Solver Daemon", "Mempool Listener", "React Visualizer"],
          contributions: "Wrote the Go solver service for order matching and designed the live liquidity balance dashboard."
        }
      ]
    },
    technicalImplementation: {
      architecture: "Traders post signed EIP-712 intents; distributed Golang solvers watch RPC endpoints and execute atomic cross-rollup rebalances via local liquidity pools.",
      components: [
        { name: "Intent Contracts", role: "Custody and escrow release upon proof of delivery", tech: "Solidity 0.8.24, Arbitrum Sepolia" },
        { name: "Solver Network", role: "High-throughput matching engine and order routing", tech: "Go (Golang), Geth RPC" },
        { name: "Liquidity HUD", role: "Real-time visualization of cross-rollup order depth", tech: "React, Tailwind, ethers.js" }
      ],
      technologies: ["Solidity 0.8.24", "Go (Golang)", "Arbitrum", "Optimism", "Base", "React", "EIP-712", "Foundry"],
      majorFeatures: [
        { name: "Sub-Second Intent Resolution", status: "VERIFIED", evidence: "solver/daemon.go lines 40-112", description: "Solvers fill liquidity deficits within 400ms without bridge delays" },
        { name: "EIP-712 Atomic Settlement", status: "VERIFIED", evidence: "contracts/CrossRelayIntent.sol", description: "Cryptographically safe gasless intent signing" },
        { name: "Multi-Rollup RPC Listener", status: "VERIFIED", evidence: "live testnet on Arbitrum & Base Sepolia", description: "Synchronized dual-chain state validation" }
      ]
    },
    buildPassport: {
      passportId: "HFP-2026-9018C-88",
      merkleRoot: "0x1102938401928301928301928301928301928301",
      sha256: "sha256:3391029384019283019283019283019283019283",
      verifiedCommits: 31,
      verifiedPRs: 3,
      verifiedDeployments: 2,
      issuedAt: "Sep 22, 2026, 09:10 UTC",
      verificationUrl: "/verify/HFP-2026-9018C-88",
      status: "VERIFIED_ELIGIBLE"
    },
    organizerApprovedIntegrity: {
      approved: true,
      reviewStatus: "APPROVED & COUNTERSIGNED BY LEAD ORGANIZER",
      reviewedBy: "Elena Vance (ETHGlobal Lead Integrity Jury)",
      reviewedAt: "Sep 21, 2026, 15:30 UTC",
      starterCode: {
        name: "foundry-forge",
        whitelisted: true,
        retention: "4.2%",
        customCode: "95.8%"
      },
      auditVerdict: "Approved. Whitelisted Foundry template. Organic commit progression verified with dual contributors active throughout.",
      organizerNotes: "All contracts originated during competition window. Verified clean."
    }
  },
  {
    id: "proj-4",
    name: "SpeedyScript Arbitrage",
    teamName: "SpeedyScript",
    track: "Autonomous Agents",
    problemStatement: {
      title: "Autonomous Agent-to-Agent Micro-Settlement Protocol",
      track: "Autonomous Agents",
      sponsor: "Starknet & Base",
      bounty: "$25,000",
      description: "Develop high-throughput, low-latency micro-payment channels between AI agents negotiating real-time inference tasks without human intervention."
    },
    tagline: "High speed algorithmic arbitrage engine with pre-compiled bots",
    repoUrl: "https://github.com/speedyscript/arb-engine",
    demoUrl: "https://speedyscript.internal",
    status: "FLAGGED_AUDIT",
    scores: {
      execution: 5.0,
      innovation: 4.5,
      implementation: 4.0,
      design: 4.0,
      impact: 4.0
    },
    notes: "Audit flag under organizer review. Bulk commit detected at start of hackathon.",
    executiveSummary: {
      whatBuilt: "SpeedyScript is an automated arbitrage bot targeting decentralized exchange pools using automated slippage detection and flash loans.",
      coreValue: "High-frequency trade execution across automated market makers."
    },
    buildJourney: [
      { time: "Day 1, 10:05 UTC", phase: "Single Bulk Push", actor: "Anonymous", event: "Pushed 24,000 lines of existing code in a single initial commit", type: "COMMIT", hash: "99aa812" },
      { time: "Day 2, 18:00 UTC", phase: "Minor Readme Update", actor: "Anonymous", event: "Updated documentation and submitted repository", type: "SUBMISSION", hash: "1100223" }
    ],
    teamContributions: {
      summary: "Single committer with unverified git identity; 99% of code committed in single bulk push.",
      members: [
        {
          name: "Anonymous Builder",
          role: "Solo Developer",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          github: "speedyscript-dev",
          commitsCount: 2,
          prsCount: 0,
          linesAdded: 24100,
          linesRemoved: 10,
          areas: ["Unverified Arbitrage Engine"],
          contributions: "Pushed single 24,000 line archive file at start of hackathon without progressive commit activity."
        }
      ]
    },
    technicalImplementation: {
      architecture: "Monolithic Python script with hardcoded trading parameters and external binary dependencies.",
      components: [
        { name: "Arbitrage Daemon", role: "Unverified trading scripts", tech: "Python 3.10" }
      ],
      technologies: ["Python", "Web3.py"],
      majorFeatures: [
        { name: "Arbitrage Execution", status: "LIMITED", evidence: "No verifiable testnet transactions", description: "Claims high velocity arbitrage but lacking verification evidence" }
      ]
    },
    buildPassport: {
      passportId: "HFP-UNVERIFIED-004",
      merkleRoot: "0x0000000000000000000000000000000000000000",
      sha256: "sha256:unverified_bulk_injection_anomaly",
      verifiedCommits: 2,
      verifiedPRs: 0,
      verifiedDeployments: 0,
      issuedAt: "Unverified",
      verificationUrl: "/verify",
      status: "FLAGGED_AUDIT"
    },
    organizerApprovedIntegrity: {
      approved: false,
      reviewStatus: "PENDING ORGANIZER AUDIT (NOT YET CLEARED)",
      reviewedBy: "Under Formal Investigation by Organizer Sentinel Committee",
      reviewedAt: "Pending",
      starterCode: {
        name: "unauthorized_bulk_injection",
        whitelisted: false,
        retention: "Unknown",
        customCode: "Unverified"
      },
      auditVerdict: "ORGANIZER REVIEW REQUIRED. Sentinel identified 24,000 lines deposited in a single commit 5 minutes into the hackathon without prior whitelisting. Flagged for human organizer investigation.",
      organizerNotes: "Attention Judges: This project has NOT been cleared by hackathon organizers. Please pause score finalization until the integrity review is completed."
    }
  }
];

export const mockLeaderboard = [
  { rank: 1, team: "ZeroState Labs", xp: 3400, quests: 6, passportVerified: true, commits: 52, project: "AegisZK Guardrails" },
  { rank: 2, team: "NeuralSync", xp: 2950, quests: 5, passportVerified: true, commits: 44, project: "AgentMesh OS" },
  { rank: 3, team: "HyperDrive Protocol", xp: 2450, quests: 5, passportVerified: true, commits: 37, project: "HyperDrive Protocol", isUserTeam: true },
  { rank: 4, team: "Orbital DeFi", xp: 2200, quests: 4, passportVerified: true, commits: 31, project: "CrossRelay" },
  { rank: 5, team: "QuantumSol", xp: 1900, quests: 4, passportVerified: false, commits: 26, project: "SolQuantum" },
  { rank: 6, team: "AeroChain", xp: 1650, quests: 3, passportVerified: false, commits: 19, project: "AeroBridge" }
];

export const mockAiInsights = [
  {
    id: "ai-1",
    type: "SPRINT_PACING",
    severity: "RECOMMENDATION",
    title: "Sprint Pacing Alert: 31 Hours Remaining",
    content: "Your core micro-settlement contracts are functional with 37 commits. HackForge analysis recommends shifting 60% of team focus to Frontend polish and the 3-minute demo pitch to maximize judging scores.",
    actionText: "Open Demo Checklist"
  },
  {
    id: "ai-2",
    type: "INTEGRITY_CHECK",
    severity: "SUCCESS",
    title: "Build Passport Integrity Score: 97.4%",
    content: "No mass unverified commit bursts detected. Starter boilerplate divergence is well within the 85-98% optimal originality band. Your project is fully eligible for Grand Prizes.",
    actionText: "Preview Passport"
  },
  {
    id: "ai-3",
    type: "TECH_SUGGESTION",
    severity: "SUGGESTION",
    title: "Sponsor Bounty Matching: Aztec ZK Track",
    content: "Your settlement protocol can earn an additional $20,000 bounty by wrapping the transaction receipts inside a Noir ZK-proof. HackForge detected compatibility with your current Foundry setup.",
    actionText: "View Boilerplate Hook"
  }
];

export const mockPullRequests = [
  {
    id: "pr-15",
    number: 15,
    title: "Integrate FastAPI inference with LangChain agent",
    author: "Arjun",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    branch: "ai-inference",
    baseBranch: "main",
    status: "OPEN",
    createdAt: "2026-09-23T23:05:00Z",
    updatedAt: "2026-09-23T23:15:00Z",
    additions: 430,
    deletions: 25,
    changedFiles: 5,
    reviewers: ["Alex 'Kaelen' Chen", "Sophia Zhang"],
    labels: ["ai-ml", "backend", "needs-review"]
  },
  {
    id: "pr-14",
    number: 14,
    title: "Agent HUD visualizer & real-time telemetry stream",
    author: "Kritika",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    branch: "hud-visuals",
    baseBranch: "main",
    status: "MERGED",
    createdAt: "2026-09-23T20:45:00Z",
    updatedAt: "2026-09-23T21:30:00Z",
    additions: 712,
    deletions: 88,
    changedFiles: 6,
    reviewers: ["Alex 'Kaelen' Chen"],
    labels: ["frontend", "telemetry"]
  }
];

export const mockIssues = [
  {
    id: "issue-8",
    number: 8,
    title: "CORS policy blocking localhost:5173 on /api/v1/inference",
    author: "Sophia Zhang",
    status: "OPEN",
    severity: "BLOCKER",
    createdAt: "2026-09-23T23:00:00Z",
    labels: ["bug", "api-mismatch", "blocker"],
    description: "Frontend cannot invoke Arjun's ML inference service due to missing Access-Control-Allow-Origin header in FastAPI CORS middleware."
  },
  {
    id: "issue-9",
    number: 9,
    title: "Missing TypeScript interfaces for AgentDecision payload",
    author: "Sophia Zhang",
    status: "OPEN",
    severity: "WARNING",
    createdAt: "2026-09-23T22:50:00Z",
    labels: ["frontend", "types"],
    description: "The JSON structure returned by the Python ML service does not have corresponding types in the frontend client."
  }
];
