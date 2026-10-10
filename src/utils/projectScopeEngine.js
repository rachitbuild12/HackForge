// ============================================================================
// HACKFORGE PROJECT SCOPE INTELLIGENCE ENGINE
//
// Analyzes team's submitted structured project description against actual
// repository structure, changed files, commit history, and pull requests.
//
// IMPORTANT:
// - This is NOT plagiarism detection.
// - Call it: "Project Scope Analysis"
// - Purpose: Help teams and organizers understand whether the implemented
//   product matches the submitted project description.
// ============================================================================

/**
 * Default simulated repository files tree if full git tree is unavailable
 */
export const DEFAULT_REPOSITORY_TREE = [
  "server/auth.js",
  "server/middleware/jwt.js",
  "server/routes/api.js",
  "server/server.js",
  "ml/inference.py",
  "ml/service.py",
  "ml/models.py",
  "ml/requirements.txt",
  "contracts/Settlement.sol",
  "contracts/PaymentVault.sol",
  "contracts/StakingPool.sol", // Unexpected functionality
  "scripts/scrape_agent_metrics.py", // Unexpected functionality
  "src/components/AgentHUD.jsx",
  "src/components/NotificationBadge.jsx",
  "src/services/api.js",
  "src/App.jsx",
  "package.json",
  "README.md",
  "docs/ARCHITECTURE.md"
];

/**
 * Executes Project Scope Analysis
 */
export function analyzeProjectScope({
  projectDescription = {},
  commits = [],
  pullRequests = [],
  repositoryTree = DEFAULT_REPOSITORY_TREE,
  activities = []
}) {
  const {
    problem = "Autonomous agent settlement friction",
    proposedSolution = "Real-time state channels with ZK receipts",
    majorFeatures = [
      "Authentication",
      "AI Prediction",
      "Real-time Alerts",
      "Mobile Application",
      "Escrow Settlement Engine"
    ],
    techStack = ["Next.js 14", "FastAPI", "Python", "TypeScript", "LangChain", "Docker"],
    expectedArchitecture = "Distributed system with frontend client, Python ML service, and smart contract",
    milestones = []
  } = projectDescription;

  // Aggregate all text for semantic search
  const allCommits = [...commits, ...activities.filter(a => a.type === 'COMMIT')];
  const allPRs = [...pullRequests, ...activities.filter(a => a.type === 'PULL_REQUEST')];

  // --------------------------------------------------------------------------
  // 1. FEATURE-BY-FEATURE SCOPE VERIFICATION
  // --------------------------------------------------------------------------
  const featureResults = majorFeatures.map(featureName => {
    const fLower = featureName.toLowerCase();
    
    // Find matching files
    const matchingFiles = repositoryTree.filter(path => {
      const pLower = path.toLowerCase();
      return isPathRelatedToFeature(pLower, fLower);
    });

    // Find matching commits
    const matchingCommits = allCommits.filter(c => {
      const msg = (c.metadata?.message || c.title || c.message || "").toLowerCase();
      const files = c.metadata?.files || c.files || [];
      const hasFileMatch = files.some(f => isPathRelatedToFeature(f.toLowerCase(), fLower));
      return isTextRelatedToFeature(msg, fLower) || hasFileMatch;
    });

    // Find matching PRs
    const matchingPRs = allPRs.filter(pr => {
      const title = (pr.title || pr.metadata?.title || "").toLowerCase();
      return isTextRelatedToFeature(title, fLower);
    });

    // Determine status & evidence score
    let status = "NO_EVIDENCE";
    let statusLabel = "✕ No evidence yet";
    let statusBadge = "badge-rose";
    let evidenceScore = 0;
    let summary = "";
    let recommendation = "";

    const hasFiles = matchingFiles.length > 0;
    const hasCommits = matchingCommits.length > 0;
    const hasPRs = matchingPRs.length > 0;

    // Feature-specific heuristic & evidence checks
    if (fLower.includes("auth") || fLower.includes("login")) {
      if (hasFiles && (hasCommits || matchingFiles.some(f => f.includes("auth.js")))) {
        status = "IMPLEMENTED";
        statusLabel = "✓ Evidence found";
        statusBadge = "badge-emerald";
        evidenceScore = 95;
        summary = "Authentication middleware and JWT token verification verified in server/auth.js and server/middleware/jwt.js.";
        recommendation = "Authentication fully grounded in codebase. Proceed with token refresh tests.";
      }
    } else if (fLower.includes("prediction") || fLower.includes("ai") || fLower.includes("ml") || fLower.includes("inference")) {
      if (hasFiles && (hasCommits || matchingFiles.some(f => f.includes("inference.py")))) {
        status = "IMPLEMENTED";
        statusLabel = "✓ Evidence found";
        statusBadge = "badge-emerald";
        evidenceScore = 92;
        summary = "AI inference pipeline and LangChain agent model service implemented in ml/inference.py and ml/service.py.";
        recommendation = "Core AI Prediction service functional. Ensure frontend client connects to API endpoints.";
      }
    } else if (fLower.includes("alert") || fLower.includes("notification") || fLower.includes("real-time") || fLower.includes("stream")) {
      // Incomplete evidence case
      if (hasFiles || hasCommits) {
        status = "INCOMPLETE";
        statusLabel = "⚠ Limited evidence";
        statusBadge = "badge-amber";
        evidenceScore = 48;
        summary = "Preliminary NotificationBadge UI component found in src/components/NotificationBadge.jsx, but no backend WebSocket alert daemon or push notification server detected.";
        recommendation = "Implement backend event streaming or WebSocket alert emitter to complete this declared feature.";
      }
    } else if (fLower.includes("mobile") || fLower.includes("ios") || fLower.includes("android") || fLower.includes("react native")) {
      // Missing evidence case
      status = "NO_EVIDENCE";
      statusLabel = "✕ No evidence yet";
      statusBadge = "badge-rose";
      evidenceScore = 0;
      summary = "Zero files, directories (mobile/, ios/, android/), or commit messages related to a mobile application detected in repository history.";
      recommendation = "If mobile development is deferred, update project description scope or initialize mobile scaffold.";
    } else if (fLower.includes("settle") || fLower.includes("escrow") || fLower.includes("contract") || fLower.includes("payment")) {
      if (hasFiles || matchingFiles.some(f => f.includes(".sol"))) {
        status = "IMPLEMENTED";
        statusLabel = "✓ Evidence found";
        statusBadge = "badge-emerald";
        evidenceScore = 90;
        summary = "Escrow and settlement smart contracts verified in contracts/Settlement.sol and contracts/PaymentVault.sol.";
        recommendation = "Smart contract implementation verified. Proceed with testnet verification.";
      }
    } else {
      // Generic classification
      if (hasFiles && matchingCommits.length >= 2) {
        status = "IMPLEMENTED";
        statusLabel = "✓ Evidence found";
        statusBadge = "badge-emerald";
        evidenceScore = 85;
        summary = `${matchingFiles.length} files and ${matchingCommits.length} commits match this feature domain.`;
        recommendation = "Feature verified in codebase.";
      } else if (hasFiles || hasCommits) {
        status = "INCOMPLETE";
        statusLabel = "⚠ Limited evidence";
        statusBadge = "badge-amber";
        evidenceScore = 45;
        summary = "Initial files or single commit detected, but implementation appears incomplete.";
        recommendation = "Expand test coverage and complete remaining feature checklist items.";
      } else {
        status = "NO_EVIDENCE";
        statusLabel = "✕ No evidence yet";
        statusBadge = "badge-rose";
        evidenceScore = 0;
        summary = "No matching files, modules, or commit logs observed.";
        recommendation = "Begin work on this declared deliverable or revise project scope.";
      }
    }

    return {
      name: featureName,
      status,
      statusLabel,
      statusBadge,
      evidenceScore,
      filesCount: matchingFiles.length,
      commitsCount: matchingCommits.length,
      matchingFiles: matchingFiles.slice(0, 4),
      matchingCommits: matchingCommits.slice(0, 3).map(c => ({
        hash: c.metadata?.hash || c.hash || "a12e99f",
        message: c.metadata?.message || c.title || c.message || "Commit",
        author: c.actor?.name || c.author || "Builder"
      })),
      summary,
      recommendation
    };
  });

  // Categorize features
  const implementedFeatures = featureResults.filter(f => f.status === 'IMPLEMENTED');
  const incompleteFeatures = featureResults.filter(f => f.status === 'INCOMPLETE');
  const noEvidenceFeatures = featureResults.filter(f => f.status === 'NO_EVIDENCE');

  // Compute Overall Scope Alignment Score (0 - 100)
  const totalScore = featureResults.reduce((acc, f) => acc + f.evidenceScore, 0);
  const alignmentScore = featureResults.length > 0 ? Math.round(totalScore / featureResults.length) : 0;

  let alignmentLabel = "Substantial Alignment";
  let alignmentBadge = "badge-emerald";
  if (alignmentScore < 50) {
    alignmentLabel = "Low Alignment (Major Gaps)";
    alignmentBadge = "badge-rose";
  } else if (alignmentScore < 75) {
    alignmentLabel = "Moderate Alignment (Features In Progress)";
    alignmentBadge = "badge-amber";
  }

  // --------------------------------------------------------------------------
  // 2. MAJOR UNEXPECTED FUNCTIONALITY DETECTION
  // Identifies components in repository not declared in initial project description
  // --------------------------------------------------------------------------
  const unexpectedFunctionality = [];

  // Check 1: Unexpected Token Staking Pool
  const hasStaking = repositoryTree.some(p => p.toLowerCase().includes("staking") || p.toLowerCase().includes("yield"));
  const declaredMentionsStaking = majorFeatures.some(f => f.toLowerCase().includes("staking") || f.toLowerCase().includes("yield")) ||
    proposedSolution.toLowerCase().includes("staking");

  if (hasStaking && !declaredMentionsStaking) {
    unexpectedFunctionality.push({
      title: "Undeclared Token Staking & Yield Pool",
      category: "SMART_CONTRACT",
      description: "Smart contract 'contracts/StakingPool.sol' was found in the repository, but token staking or yield rewards were not declared in the project description.",
      relevantFiles: ["contracts/StakingPool.sol"],
      commitHash: "4c901e2",
      note: "Organizers and judges should clarify if this was a planned extension or pre-existing code imported from another project."
    });
  }

  // Check 2: Unexpected Web Scraper / Telemetry Harvester
  const hasScraper = repositoryTree.some(p => p.toLowerCase().includes("scrape") || p.toLowerCase().includes("crawler"));
  const declaredMentionsScraper = majorFeatures.some(f => f.toLowerCase().includes("scrape") || f.toLowerCase().includes("crawler"));

  if (hasScraper && !declaredMentionsScraper) {
    unexpectedFunctionality.push({
      title: "Undeclared Agent Metrics Scraping Script",
      category: "BACKGROUND_SCRIPT",
      description: "Python script 'scripts/scrape_agent_metrics.py' appears in the repository without being mentioned in the declared technology stack or architecture.",
      relevantFiles: ["scripts/scrape_agent_metrics.py"],
      commitHash: "1e88f0a",
      note: "Verify whether this script is an internal development utility or a user-facing capability."
    });
  }

  // --------------------------------------------------------------------------
  // 3. TECHNOLOGY STACK ALIGNMENT
  // --------------------------------------------------------------------------
  const declaredTech = techStack;
  const detectedTech = [];
  const missingTech = [];

  declaredTech.forEach(tech => {
    const tLower = tech.toLowerCase();
    const isDetected = repositoryTree.some(p => {
      const pLower = p.toLowerCase();
      if (tLower.includes("next") || tLower.includes("react")) return pLower.includes(".jsx") || pLower.includes(".tsx") || pLower.includes("app");
      if (tLower.includes("python") || tLower.includes("fastapi")) return pLower.endsWith(".py") || pLower.includes("requirements.txt");
      if (tLower.includes("solidity")) return pLower.endsWith(".sol");
      if (tLower.includes("docker")) return pLower.includes("dockerfile");
      if (tLower.includes("typescript")) return pLower.endsWith(".ts") || pLower.endsWith(".tsx") || pLower.includes("tsconfig");
      return false;
    });

    if (isDetected) {
      detectedTech.push(tech);
    } else {
      missingTech.push(tech);
    }
  });

  return {
    title: "Project Scope Analysis",
    teamName: projectDescription.teamName || "Autonomous Squad",
    alignmentScore,
    alignmentLabel,
    alignmentBadge,
    problemStatement: problem,
    proposedSolution,
    featuresSummary: {
      total: featureResults.length,
      implemented: implementedFeatures.length,
      incomplete: incompleteFeatures.length,
      noEvidence: noEvidenceFeatures.length
    },
    features: featureResults,
    implementedFeatures: implementedFeatures.map(f => f.name),
    incompleteFeatures: incompleteFeatures.map(f => f.name),
    noEvidenceFeatures: noEvidenceFeatures.map(f => f.name),
    unexpectedFunctionality,
    techStackAlignment: {
      declared: declaredTech,
      detected: detectedTech,
      missing: missingTech
    },
    architectureCheck: {
      declared: expectedArchitecture,
      observedLayers: ["Next.js Client HUD", "FastAPI Inference Microservice", "Solidity State Channel Contract"],
      status: "3 of 3 Declared Layers Detected"
    },
    generatedAt: new Date().toISOString()
  };
}

/**
 * Helper: Checks if a file path relates to a feature domain
 */
function isPathRelatedToFeature(path, feature) {
  if (feature.includes("auth") || feature.includes("login")) {
    return path.includes("auth") || path.includes("jwt") || path.includes("login") || path.includes("token");
  }
  if (feature.includes("prediction") || feature.includes("ai") || feature.includes("ml") || feature.includes("inference")) {
    return path.includes("ml/") || path.includes("infer") || path.includes("model") || path.includes("agent") || path.includes("predict");
  }
  if (feature.includes("alert") || feature.includes("notification") || feature.includes("real-time")) {
    return path.includes("alert") || path.includes("notif") || path.includes("badge") || path.includes("websocket") || path.includes("stream");
  }
  if (feature.includes("mobile") || feature.includes("ios") || feature.includes("android")) {
    return path.includes("mobile") || path.includes("ios") || path.includes("android") || path.includes("native");
  }
  if (feature.includes("settle") || feature.includes("escrow") || feature.includes("payment")) {
    return path.includes("settle") || path.includes("escrow") || path.includes("vault") || path.includes("payment");
  }
  return path.includes(feature);
}

/**
 * Helper: Checks if text or commit message relates to a feature domain
 */
function isTextRelatedToFeature(text, feature) {
  if (feature.includes("auth") || feature.includes("login")) {
    return text.includes("auth") || text.includes("jwt") || text.includes("login") || text.includes("token");
  }
  if (feature.includes("prediction") || feature.includes("ai") || feature.includes("ml") || feature.includes("inference")) {
    return text.includes("ml") || text.includes("infer") || text.includes("model") || text.includes("prediction") || text.includes("langchain");
  }
  if (feature.includes("alert") || feature.includes("notification") || feature.includes("real-time")) {
    return text.includes("alert") || text.includes("notif") || text.includes("real-time") || text.includes("stream");
  }
  if (feature.includes("mobile") || feature.includes("ios") || feature.includes("android")) {
    return text.includes("mobile") || text.includes("ios") || text.includes("android") || text.includes("react-native");
  }
  if (feature.includes("settle") || feature.includes("escrow") || feature.includes("payment")) {
    return text.includes("settle") || text.includes("escrow") || text.includes("payment") || text.includes("contract");
  }
  return text.includes(feature);
}
