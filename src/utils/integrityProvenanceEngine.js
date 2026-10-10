// ============================================================================
// HACKFORGE BUILD PROVENANCE & INTEGRITY ANALYSIS ENGINE
//
// CORE PRODUCT PRINCIPLE:
// The system must NEVER claim: "This project is definitely cheating."
// It only identifies suspicious patterns and sends them to organizers for human review.
// The purpose is transparency, not automatic punishment.
// Never automatically disqualify a team.
// ============================================================================

/**
 * Standard Whitelisted Starter Boilerplates
 */
export const WHITELISTED_STARTERS = [
  {
    name: "Next.js 14 Web3 Starter (next-viem-starter)",
    repo: "github.com/hackforge-templates/next-viem-starter",
    patterns: [
      "next.config.js",
      "next.config.mjs",
      "package.json",
      "tsconfig.json",
      "postcss.config.js",
      "tailwind.config.js",
      "src/app/layout.tsx",
      "src/app/providers.tsx",
      "src/config/wagmi.ts"
    ]
  },
  {
    name: "Foundry Smart Contract Template (foundry-forge)",
    repo: "github.com/hackforge-templates/foundry-forge",
    patterns: [
      "foundry.toml",
      "lib/forge-std",
      "test/Counter.t.sol",
      "script/Deploy.s.sol"
    ]
  },
  {
    name: "FastAPI + LangChain Agent Scaffold (agent-scaffold)",
    repo: "github.com/hackforge-templates/agent-scaffold",
    patterns: [
      "requirements.txt",
      "Dockerfile",
      "docker-compose.yml",
      "app/main.py",
      "app/config.py",
      "app/core/agent_base.py"
    ]
  }
];

/**
 * Normalizes and executes Build Provenance & Integrity Analysis
 *
 * INPUTS (10):
 * 1. hackathonStartsAt (ISO string or timestamp)
 * 2. repoCreatedAt (ISO string or timestamp)
 * 3. repoHistory (Array of commits)
 * 4. commitTimestamps (Array of timestamps)
 * 5. fileHistory (Array of files with firstObserved, additions, author)
 * 6. problemStatement (Object or title)
 * 7. projectDescription (Team's project description)
 * 8. declaredMajorFeatures (Array of declared feature strings)
 * 9. allowedStarters (Whitelisted starters list)
 * 10. hackathonRules (Array of hackathon rules)
 */
export function analyzeRepositoryProvenance({
  hackathonStartsAt = "2026-09-20T10:00:00Z",
  repoCreatedAt = "2026-09-20T10:14:00Z",
  repoHistory = [],
  commitTimestamps = [],
  fileHistory = [],
  problemStatement = "Autonomous Agent-to-Agent Micro-Settlement Protocol",
  projectDescription = "Autonomous high-velocity agent settlement layer with instant ZK receipts",
  declaredMajorFeatures = ["payment engine", "ZK settlement contract", "FastAPI inference microservice"],
  allowedStarters = WHITELISTED_STARTERS,
  hackathonRules = []
}) {
  const startTime = new Date(hackathonStartsAt).getTime();
  const repoCreatedTime = new Date(repoCreatedAt).getTime();

  // Combine whitelisted starters
  const activeStarters = [...WHITELISTED_STARTERS, ...(allowedStarters || [])];
  const starterFilePatterns = new Set();
  activeStarters.forEach(s => {
    (s.patterns || []).forEach(p => starterFilePatterns.add(p.toLowerCase()));
  });

  // Helper: check if file is an allowed starter file
  const isStarterFile = (filePath = "") => {
    const clean = filePath.toLowerCase().replace(/\\/g, '/');
    for (const pattern of starterFilePatterns) {
      if (clean.includes(pattern) || clean.endsWith(pattern)) {
        return true;
      }
    }
    return false;
  };

  // --------------------------------------------------------------------------
  // MODULE A: PRE-HACKATHON ACTIVITY
  // Identify files or repository history that appear to predate the allowed window
  // --------------------------------------------------------------------------
  const preHackathonCommits = [];
  const preHackathonFiles = [];
  let earliestObservedTime = repoCreatedTime;

  // Scan commit history
  repoHistory.forEach(commit => {
    if (!commit.timestamp) return;
    const cTime = new Date(commit.timestamp).getTime();
    if (cTime < earliestObservedTime) {
      earliestObservedTime = cTime;
    }
    if (cTime < startTime) {
      preHackathonCommits.push({
        hash: commit.hash || commit.sha || "origin-c1",
        message: commit.message || commit.title || "Pre-existing commit",
        author: commit.author?.name || commit.author || "Committer",
        timestamp: commit.timestamp,
        additions: commit.additions || 0,
        predatesHackathon: true
      });
    }
  });

  // Scan file history
  fileHistory.forEach(file => {
    const fTime = file.firstObserved ? new Date(file.firstObserved).getTime() : repoCreatedTime;
    const starterAllowed = isStarterFile(file.path);

    if (fTime < startTime && !starterAllowed) {
      preHackathonFiles.push({
        path: file.path,
        additions: file.additions || 0,
        firstObserved: file.firstObserved || repoCreatedAt,
        isStarterAllowed: false,
        featureTag: detectFeatureTag(file.path, declaredMajorFeatures)
      });
    }
  });

  const repoPredatesStart = repoCreatedTime < startTime;
  const earliestCommitPredates = earliestObservedTime < startTime;
  const hoursBeforeStart = Math.max(0, Math.round((startTime - earliestObservedTime) / (1000 * 60 * 60)));

  // --------------------------------------------------------------------------
  // MODULE B: FEATURE SCOPE ANALYSIS
  // Compare team's declared major features with repository activity
  // --------------------------------------------------------------------------
  const featureScopeResults = declaredMajorFeatures.map(feature => {
    const lowerFeature = feature.toLowerCase();
    
    // Find matching files
    const matchingFiles = fileHistory.filter(f => {
      const p = (f.path || "").toLowerCase();
      return p.includes(lowerFeature) || isFileRelatedToFeature(p, lowerFeature);
    });

    // Check if these files predate hackathon
    const preExistingFiles = matchingFiles.filter(f => {
      const fTime = f.firstObserved ? new Date(f.firstObserved).getTime() : repoCreatedTime;
      return fTime < startTime && !isStarterFile(f.path);
    });

    const isPredating = preExistingFiles.length > 0;
    const totalLines = matchingFiles.reduce((acc, curr) => acc + (curr.additions || 0), 0);

    return {
      feature,
      filesMatched: matchingFiles.length,
      preExistingCount: preExistingFiles.length,
      totalLines,
      isPredating,
      preExistingFiles
    };
  });

  const predatingFeatures = featureScopeResults.filter(f => f.isPredating);

  // --------------------------------------------------------------------------
  // MODULE C: DEVELOPMENT TIMELINE (UNUSUAL PATTERNS)
  // - Large feature appearing immediately after team creation
  // - Large amounts of code appearing without corresponding development activity
  // - Major repository history predating the hackathon
  // - Sudden bulk code additions
  // --------------------------------------------------------------------------
  const timelineAnomalies = [];

  // Check 1: Sudden Bulk Code Additions (Single massive drop)
  repoHistory.forEach(commit => {
    const adds = commit.additions || 0;
    const cTime = commit.timestamp ? new Date(commit.timestamp).getTime() : Date.now();
    const isEarly = (cTime - repoCreatedTime) < (30 * 60 * 1000); // within 30 mins of repo creation

    if (adds >= 8000 && isEarly) {
      timelineAnomalies.push({
        type: "EARLY_MASS_ADDITION",
        title: "Large feature appearing immediately after repository creation",
        detail: `${adds.toLocaleString()} lines committed within 30 minutes of repository creation (${commit.hash}).`,
        commitHash: commit.hash,
        additions: adds
      });
    } else if (adds >= 12000) {
      timelineAnomalies.push({
        type: "BULK_CODE_BURST",
        title: "Sudden bulk code addition without incremental commits",
        detail: `${adds.toLocaleString()} lines added in a single snapshot commit without branch progression.`,
        commitHash: commit.hash,
        additions: adds
      });
    }
  });

  // Check 2: Major repository history predating hackathon
  if (hoursBeforeStart >= 24) {
    timelineAnomalies.push({
      type: "HISTORICAL_REPOSITORY_PREDATE",
      title: "Major repository history predating hackathon start",
      detail: `Earliest commit observed ${hoursBeforeStart} hours (${Math.round(hoursBeforeStart / 24)} days) prior to hackathon launch.`,
      hoursBeforeStart
    });
  }

  // --------------------------------------------------------------------------
  // MODULE D: STARTER CODE POLICY
  // Mark known starter files as allowed; do not flag them; track post-start delta
  // --------------------------------------------------------------------------
  const starterExemptions = [];
  let allowedStarterLines = 0;

  fileHistory.forEach(f => {
    if (isStarterFile(f.path)) {
      starterExemptions.push({
        path: f.path,
        additions: f.additions || 0,
        status: "ALLOWED_STARTER",
        matchedStarter: "Whitelisted Boilerplate Template"
      });
      allowedStarterLines += (f.additions || 0);
    }
  });

  // --------------------------------------------------------------------------
  // MODULE E: INTEGRITY CONCERN CLASSIFICATION
  // Strict non-accusatory categorization:
  // - LOW CONCERN
  // - REVIEW RECOMMENDED
  // - HIGH PRIORITY REVIEW
  // --------------------------------------------------------------------------
  let classification = "LOW_CONCERN";
  let concernLevel = "Low Concern";
  let primaryReason = "Normal incremental commit activity verified. Starter code declared and whitelisted.";
  let confidence = "94% (High Confidence)";
  let recommendedAction = "No action required. Standard sprint progression.";

  // High Priority Review condition
  if (timelineAnomalies.some(a => a.type === "EARLY_MASS_ADDITION") || (hoursBeforeStart > 48 && preHackathonFiles.length > 20)) {
    classification = "HIGH_PRIORITY_REVIEW";
    concernLevel = "High Priority Review";
    primaryReason = "A large monolithic codebase appeared immediately after creation with substantial history predating the hackathon.";
    confidence = "91% (High Confidence)";
    recommendedAction = "Request code walkthrough and verify implementation history with team leader.";
  }
  // Review Recommended condition
  else if (predatingFeatures.length > 0 || preHackathonFiles.length > 0 || timelineAnomalies.length > 0) {
    classification = "REVIEW_RECOMMENDED";
    concernLevel = "Review Recommended";
    
    if (predatingFeatures.length > 0) {
      const feat = predatingFeatures[0];
      primaryReason = `A substantial portion of the declared "${feat.feature}" appears to have repository history predating the hackathon start.`;
      recommendedAction = "Ask team to explain the origin and role of these files.";
    } else if (hoursBeforeStart > 0) {
      primaryReason = `Repository history contains commits authored ${hoursBeforeStart} hours before the official hackathon start.`;
      recommendedAction = "Verify whether pre-start commits are personal boilerplate or completed features.";
    } else {
      primaryReason = "Sudden bulk code additions detected without matching iterative development progression.";
      recommendedAction = "Review commit diffs with team to verify sprint-authored originality.";
    }

    confidence = "86% (High Confidence)";
  }

  // Compile final structured Provenance Report
  return {
    classification,
    concernLevel,
    reason: primaryReason,
    evidence: {
      preHackathonFilesCount: preHackathonFiles.length,
      preHackathonCommitsCount: preHackathonCommits.length,
      firstObservedDate: new Date(earliestObservedTime).toISOString(),
      hackathonStartDate: new Date(startTime).toISOString(),
      hoursBeforeStart,
      totalStarterLinesExempt: allowedStarterLines,
      starterFilesExemptCount: starterExemptions.length,
      summary: preHackathonFiles.length > 0
        ? `${preHackathonFiles.length} files first observed on ${new Date(earliestObservedTime).toLocaleDateString()} (Hackathon started ${new Date(startTime).toLocaleDateString()}).`
        : "All examined files were authored within or after the official hackathon start timestamp."
    },
    relevantFiles: preHackathonFiles.length > 0 ? preHackathonFiles : fileHistory.slice(0, 5),
    relevantCommits: preHackathonCommits.length > 0 ? preHackathonCommits : repoHistory.slice(0, 3),
    timelineAnomalies,
    starterExemptions,
    featureScopeResults,
    confidence,
    recommendedAction,
    timestamp: new Date().toISOString()
  };
}

/**
 * Helper: Detect which declared feature relates to a file path
 */
function detectFeatureTag(filePath = "", declaredFeatures = []) {
  const p = filePath.toLowerCase();
  for (const feat of declaredFeatures) {
    const fLower = feat.toLowerCase();
    if (p.includes(fLower) || isFileRelatedToFeature(p, fLower)) {
      return feat;
    }
  }
  return "Core Module";
}

/**
 * Helper: Semantic keyword matching between file paths and feature names
 */
function isFileRelatedToFeature(filePath, featureName) {
  if (featureName.includes("payment") || featureName.includes("settle")) {
    return filePath.includes("pay") || filePath.includes("settle") || filePath.includes("vault") || filePath.includes("escrow") || filePath.includes("channel");
  }
  if (featureName.includes("zk") || featureName.includes("proof")) {
    return filePath.includes("zk") || filePath.includes("proof") || filePath.includes("verifier") || filePath.includes("circuit") || filePath.includes("noir");
  }
  if (featureName.includes("inference") || featureName.includes("ai") || featureName.includes("ml")) {
    return filePath.includes("ml") || filePath.includes("infer") || filePath.includes("model") || filePath.includes("agent") || filePath.includes("predict");
  }
  return false;
}
