// ============================================================================
// HACKFORGE TELEMETRY REASONING COPILOT ENGINE
// Grounded Sprint Intelligence & Activity Reasoning (Rule-Based, Non-Generative)
// ============================================================================

/**
 * Normalizes and extracts structured project context safely from input parameters.
 * Validates the shape of each data source before using it.
 */
export function extractStructuredContext({
  team = {},
  problemStatement = null,
  quests = [],
  activities = [],
  pullRequests = [],
  issues = [],
  activeHackathon = null
} = {}) {
  // Safe team object
  const safeTeam = team && typeof team === 'object' ? team : {};

  // Resolve problem statement
  const ps = problemStatement || (activeHackathon?.problemStatements?.find(p => p.id === safeTeam.problemStatementId)) || {
    id: safeTeam.problemStatementId || null,
    title: safeTeam.problemStatementTitle || "Undeclared Problem Statement",
    track: safeTeam.track || "General Track",
    description: safeTeam.problemDescription || safeTeam.slogan || "No problem statement description provided.",
    bounty: safeTeam.bounty || null,
    sponsor: safeTeam.sponsor || null
  };

  // Safe team members array
  const members = Array.isArray(safeTeam.members) ? safeTeam.members : [];
  const assignedRoles = members.map(m => m.role).filter(Boolean);

  // Safe arrays for quests, activities, PRs, issues
  const safeQuests = Array.isArray(quests) ? quests : [];
  const safeActivities = Array.isArray(activities) ? activities : [];
  const safePRs = Array.isArray(pullRequests) ? pullRequests : [];
  const safeIssues = Array.isArray(issues) ? issues : [];

  // Quests categorization
  const completedQuests = safeQuests.filter(q => q && (q.status === 'COMPLETED' || q.claimed));
  const inProgressQuests = safeQuests.filter(q => q && (q.status === 'IN_PROGRESS' || q.status === 'CLAIMABLE'));
  const availableQuests = safeQuests.filter(q => q && (q.status === 'AVAILABLE'));

  // Activities categorization
  const commits = safeActivities.filter(a => a && a.type === 'COMMIT');
  const prActivities = safeActivities.filter(a => a && a.type === 'PULL_REQUEST');
  const milestoneActivities = safeActivities.filter(a => a && a.type === 'MILESTONE');

  return {
    problemStatement: ps,
    projectDescription: safeTeam.slogan || safeTeam.description || "",
    teamName: safeTeam.name || "Unnamed Squad",
    teamMembers: members,
    assignedRoles,
    currentQuests: inProgressQuests,
    availableQuests,
    completedQuests,
    allQuests: safeQuests,
    activities: safeActivities,
    recentCommits: commits,
    pullRequests: safePRs.length > 0 ? safePRs : prActivities,
    issues: safeIssues,
    activeHackathon: activeHackathon || null,
    projectMilestones: {
      total: safeQuests.length,
      completed: completedQuests.length,
      progressPercent: safeQuests.length > 0 ? Math.round((completedQuests.length / safeQuests.length) * 100) : 0,
      events: milestoneActivities
    },
    projectStatus: {
      repoUrl: safeTeam.githubRepo || null,
      isRepoConnected: Boolean(safeTeam.githubRepo),
      branch: safeTeam.branch || 'main',
      commitsCount: safeTeam.commitsCount !== undefined && safeTeam.commitsCount !== null ? safeTeam.commitsCount : commits.length,
      linesChanged: safeTeam.linesChanged || null,
      integrityScore: safeTeam.integrityScore !== undefined && safeTeam.integrityScore !== null ? safeTeam.integrityScore : null,
      lastCommitTime: safeTeam.lastCommitTime || null
    }
  };
}

/**
 * Filter activities by time window (1h, 3h, all) based on the ACTUAL current time.
 * Handles missing, malformed, and non-parseable timestamps safely.
 */
export function filterByTimeWindow(activities, windowType = '3h') {
  if (!Array.isArray(activities) || activities.length === 0) {
    return [];
  }

  if (windowType === 'all') {
    return activities.filter(act => act && typeof act === 'object');
  }

  const now = Date.now();
  const windowMinutes = windowType === '1h' ? 60 : 180;
  const threshold = now - (windowMinutes * 60 * 1000);

  return activities.filter(act => {
    if (!act || !act.timestamp) return false;
    const parsedTime = Date.parse(act.timestamp);
    if (isNaN(parsedTime)) return false;
    // Event must have occurred within the last [windowMinutes] minutes up to now
    return parsedTime >= threshold && parsedTime <= (now + 60000); // 1-minute clock skew tolerance
  });
}

/**
 * 1. TEAM SUMMARY GENERATOR
 * Identifies workstream velocity and bottlenecks strictly from real activity records.
 */
export function generateTeamSummary(context) {
  const { recentCommits = [], teamMembers = [] } = context;

  if (!recentCommits || recentCommits.length === 0) {
    return {
      text: "Insufficient telemetry evidence: No commits recorded in the repository. Workstream velocity cannot be computed.",
      hasInsufficientData: true,
      evidence: [],
      stats: { backendCommits: 0, mlCommits: 0, frontendCommits: 0, docCommits: 0 },
      workstreamHealth: {
        backend: "INSUFFICIENT_DATA",
        ml: "INSUFFICIENT_DATA",
        frontend: "INSUFFICIENT_DATA",
        docs: "INSUFFICIENT_DATA"
      }
    };
  }

  // Classify commits by workstream based on actual message & files
  const backendCommits = recentCommits.filter(c => {
    const msg = (c.metadata?.message || c.title || "").toLowerCase();
    return msg.includes('api') || msg.includes('auth') || msg.includes('server') || msg.includes('backend') || msg.includes('contract') || msg.includes('solidity');
  });

  const mlCommits = recentCommits.filter(c => {
    const msg = (c.metadata?.message || c.title || "").toLowerCase();
    return msg.includes('ml') || msg.includes('inference') || msg.includes('model') || msg.includes('agent') || msg.includes('langchain') || msg.includes('ai');
  });

  const frontendCommits = recentCommits.filter(c => {
    const msg = (c.metadata?.message || c.title || "").toLowerCase();
    return msg.includes('ui') || msg.includes('frontend') || msg.includes('component') || msg.includes('react') || msg.includes('hud') || msg.includes('css') || msg.includes('client');
  });

  const docCommits = recentCommits.filter(c => {
    const msg = (c.metadata?.message || c.title || "").toLowerCase();
    return msg.includes('doc') || msg.includes('readme') || msg.includes('spec') || msg.includes('rfc');
  });

  // Collect concrete evidence references ONLY from real commits
  const evidence = [];
  if (backendCommits.length > 0) {
    const bc = backendCommits[0];
    const hash = bc.metadata?.hash || bc.metadata?.commit_hash || bc.hash || null;
    const actor = bc.actor?.name || bc.actor?.username || bc.actor?.login || "Teammate";
    const msg = bc.metadata?.message || bc.title || "Backend commit";
    evidence.push({
      type: 'COMMIT',
      id: bc.id,
      hash,
      actor,
      label: `Backend active: "${msg}" by ${actor}${hash ? ` (${hash.slice(0, 7)})` : ''}`,
      timestamp: bc.timestamp || null
    });
  }

  if (mlCommits.length > 0) {
    const mc = mlCommits[0];
    const hash = mc.metadata?.hash || mc.metadata?.commit_hash || mc.hash || null;
    const actor = mc.actor?.name || mc.actor?.username || mc.actor?.login || "Teammate";
    const msg = mc.metadata?.message || mc.title || "AI/ML commit";
    evidence.push({
      type: 'COMMIT',
      id: mc.id,
      hash,
      actor,
      label: `AI/ML active: "${msg}" by ${actor}${hash ? ` (${hash.slice(0, 7)})` : ''}`,
      timestamp: mc.timestamp || null
    });
  }

  if (frontendCommits.length > 0) {
    const fc = frontendCommits[0];
    const hash = fc.metadata?.hash || fc.metadata?.commit_hash || fc.hash || null;
    const actor = fc.actor?.name || fc.actor?.username || fc.actor?.login || "Teammate";
    const msg = fc.metadata?.message || fc.title || "Frontend commit";
    evidence.push({
      type: 'COMMIT',
      id: fc.id,
      hash,
      actor,
      label: `Frontend active: "${msg}" by ${actor}${hash ? ` (${hash.slice(0, 7)})` : ''}`,
      timestamp: fc.timestamp || null
    });
  }

  if (docCommits.length > 0) {
    const dc = docCommits[0];
    const hash = dc.metadata?.hash || dc.metadata?.commit_hash || dc.hash || null;
    const actor = dc.actor?.name || dc.actor?.username || dc.actor?.login || "Teammate";
    const msg = dc.metadata?.message || dc.title || "Documentation commit";
    evidence.push({
      type: 'COMMIT',
      id: dc.id,
      hash,
      actor,
      label: `Docs active: "${msg}" by ${actor}${hash ? ` (${hash.slice(0, 7)})` : ''}`,
      timestamp: dc.timestamp || null
    });
  }

  // Synthesize Summary without hardcoding fictional names
  let summaryText = "";
  if (backendCommits.length > 0 && frontendCommits.length === 0) {
    summaryText = `Backend workstream is active (${backendCommits.length} commits), but frontend UI integration has no recorded commits in the repository.`;
  } else if (frontendCommits.length > 0 && backendCommits.length > 0) {
    summaryText = `Full-stack development is synchronized across backend (${backendCommits.length}) and UI (${frontendCommits.length}) workstreams.`;
  } else if (mlCommits.length > 0 && frontendCommits.length === 0) {
    summaryText = `AI/ML components have active commits (${mlCommits.length}), but no frontend hooks or interface commits have been detected yet.`;
  } else {
    summaryText = `Sprint is actively moving with ${recentCommits.length} verified commits across team roles.`;
  }

  return {
    text: summaryText,
    hasInsufficientData: false,
    evidence,
    stats: {
      backendCommits: backendCommits.length,
      mlCommits: mlCommits.length,
      frontendCommits: frontendCommits.length,
      docCommits: docCommits.length
    },
    workstreamHealth: {
      backend: backendCommits.length > 0 ? "ADVANCED" : "STALLED",
      ml: mlCommits.length > 0 ? "ADVANCED" : "PENDING",
      frontend: frontendCommits.length > 0 ? "ACTIVE" : "NOT_STARTED",
      docs: docCommits.length > 0 ? "CURRENT" : "MINIMAL"
    }
  };
}

/**
 * 2. PROGRESS SUMMARY GENERATOR
 * Computes exact changes in 1h, 3h, and full hackathon windows.
 * Filters strictly against actual current time.
 */
export function generateProgressSummary(context, timeWindow = '3h') {
  const { activities = [], recentCommits = [], pullRequests = [], completedQuests = [] } = context;

  const windowActivities = filterByTimeWindow(activities, timeWindow);

  if (windowActivities.length === 0) {
    const windowLabel = timeWindow === '1h' ? 'last 1 hour' : timeWindow === '3h' ? 'last 3 hours' : 'entire hackathon';
    return {
      window: timeWindow,
      text: `Insufficient evidence in the ${windowLabel}: No commits, pull requests, or telemetry events were recorded during this period.`,
      hasInsufficientData: true,
      delta: {
        commits: 0,
        additions: 0,
        deletions: 0,
        activeAuthors: [],
        prsMerged: 0,
        milestones: 0
      },
      events: []
    };
  }

  // Aggregate metrics from real events
  let totalAdditions = 0;
  let totalDeletions = 0;
  let commitsCount = 0;
  const authorsSet = new Set();
  let prsMerged = 0;
  let milestonesCount = 0;

  const events = windowActivities.map(act => {
    const isCommit = act.type === 'COMMIT';
    const isPR = act.type === 'PULL_REQUEST';
    const isMilestone = act.type === 'MILESTONE';

    if (isCommit) {
      commitsCount++;
      totalAdditions += (Number(act.metadata?.additions) || 0);
      totalDeletions += (Number(act.metadata?.deletions) || 0);
    }
    if (isPR && act.metadata?.is_merged) {
      prsMerged++;
    }
    if (isMilestone) {
      milestonesCount++;
    }

    const actorName = act.actor?.name || act.actor?.username || act.actor?.login;
    if (actorName) {
      authorsSet.add(actorName);
    }

    let timeStr = "Recent";
    if (act.timestamp) {
      const parsed = new Date(act.timestamp);
      if (!isNaN(parsed.getTime())) {
        timeStr = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      }
    }

    return {
      id: act.id,
      type: act.type,
      time: timeStr,
      rawTimestamp: act.timestamp || null,
      actor: actorName || "Contributor",
      avatar: act.actor?.avatar_url || act.actor?.avatar || null,
      title: act.metadata?.message || act.metadata?.title || act.title || "Telemetry event",
      diff: act.metadata?.additions !== undefined ? `+${act.metadata.additions} / -${act.metadata.deletions}` : act.metadata?.diff,
      hash: act.metadata?.hash || act.metadata?.commit_hash || act.hash || (act.github_event_id ? act.github_event_id.slice(-7) : undefined),
      branch: act.metadata?.branch || act.branch || 'main'
    };
  });

  const activeAuthors = Array.from(authorsSet);

  let narrative = "";
  if (timeWindow === '1h') {
    narrative = `During the last 1 hour, ${activeAuthors.length > 0 ? activeAuthors.join(', ') : 'the squad'} recorded ${commitsCount} commit(s) (+${totalAdditions} / -${totalDeletions} lines). Notable changes: ${events.slice(0, 2).map(e => `"${e.title}" by ${e.actor}`).join('; ')}.`;
  } else if (timeWindow === '3h') {
    narrative = `During the last 3 hours, ${activeAuthors.length} active builder(s) recorded ${commitsCount} commit(s), merged ${prsMerged} PR(s), with +${totalAdditions} net additions.`;
  } else {
    const integrityNote = context.projectStatus.integrityScore !== null 
      ? ` with an integrity audit score of ${context.projectStatus.integrityScore}%` 
      : '';
    narrative = `Across the hackathon, ${context.teamName} has recorded ${context.projectStatus.commitsCount} verified commit(s)${totalAdditions > 0 ? ` (+${totalAdditions} / -${totalDeletions} lines)` : ''}, completing ${completedQuests.length} milestone quest(s)${integrityNote}.`;
  }

  return {
    window: timeWindow,
    text: narrative,
    hasInsufficientData: false,
    delta: {
      commits: commitsCount,
      additions: totalAdditions,
      deletions: totalDeletions,
      activeAuthors,
      prsMerged,
      milestones: milestonesCount
    },
    events
  };
}

/**
 * 3. BLOCKER DETECTION
 * Identifies blockers, separating observed evidence from inferred possibilities.
 * Never classifies suspected cheating automatically.
 */
export function detectBlockers(context) {
  const { recentCommits = [], currentQuests = [], teamMembers = [], issues = [], pullRequests = [] } = context;
  const blockers = [];

  // Check 1: Inactive Workstreams / Missing Role Activity (Inferred Possibility)
  const activeActors = new Set(
    recentCommits.map(c => c.actor?.name || c.actor?.username || c.actor?.login).filter(Boolean)
  );

  teamMembers.forEach(member => {
    if (member && member.name && !activeActors.has(member.name)) {
      blockers.push({
        id: `blk-inferred-${member.id || member.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: "INFERRED_WORKSTREAM_GAP",
        severity: "WARNING",
        title: `Workstream Gap: ${member.role || 'Member'} (${member.name})`,
        description: `Observed evidence: 0 commits recorded under ${member.name} (${member.role || 'Unspecified Role'}). Inferred possibility: May be conducting off-repo research, blocked by unmerged dependencies, or designing architecture.`,
        causedBy: {
          type: "ROSTER_AUDIT",
          detail: `0 commits attributed to ${member.name} in available repository telemetry.`
        },
        remediation: `Check in with ${member.name} during the next standup to confirm if they need unblocking or help pushing local branches.`
      });
    }
  });

  // Check 2: Actual Open Issues
  issues.forEach(issue => {
    const title = issue.title || "";
    const isBlocker = title.toLowerCase().includes("cors") ||
      title.toLowerCase().includes("bug") ||
      title.toLowerCase().includes("error") ||
      title.toLowerCase().includes("block") ||
      issue.severity === 'HIGH' ||
      issue.severity === 'CRITICAL';

    if (isBlocker) {
      blockers.push({
        id: `blk-issue-${issue.number || issue.id || Math.random()}`,
        category: "REPORTED_ISSUE",
        severity: issue.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        title: `Reported Issue #${issue.number || '?'}: ${title}`,
        description: issue.description || `Active issue #${issue.number} flagged in repository issue tracker.`,
        causedBy: {
          type: "ISSUE",
          number: issue.number,
          author: issue.author || issue.user?.login || "Issue Reporter",
          title: issue.title,
          detail: `Issue #${issue.number || '?'}: "${title}" authored by ${issue.author || 'contributor'}.`
        },
        remediation: issue.remediation || `Review and resolve issue #${issue.number} before the final submission deadline.`
      });
    }
  });

  // Check 3: Unfinished In-Progress Quests
  currentQuests.forEach(quest => {
    const unfulfilledItems = (quest.checklist || []).filter(c => !c.done);
    if (unfulfilledItems.length > 0) {
      blockers.push({
        id: `blk-quest-${quest.id}`,
        category: "UNFINISHED_MILESTONE",
        severity: "ADVISORY",
        title: `Incomplete Deliverable: "${quest.title}"`,
        description: `Quest is currently ${quest.progress || 0}% complete with ${unfulfilledItems.length} checklist item(s) unfulfilled.`,
        causedBy: {
          type: "QUEST_STATUS",
          id: quest.id,
          title: quest.title,
          detail: `Quest ${quest.id}: ${unfulfilledItems.length} task(s) unfulfilled (${unfulfilledItems.map(t => t.task).slice(0, 2).join(', ')}).`
        },
        remediation: "Provide verification proof for the remaining quest requirements to claim milestone XP."
      });
    }
  });

  // Fallback if no issues found
  if (blockers.length === 0) {
    if (recentCommits.length === 0) {
      blockers.push({
        id: "blk-insufficient",
        category: "INSUFFICIENT_DATA",
        severity: "ADVISORY",
        title: "No Repository Activity Detected",
        description: "Connect a GitHub repository or push sprint commits to activate automated telemetry blocker detection.",
        causedBy: {
          type: "STATUS",
          detail: "Repository not connected or no commits recorded."
        },
        remediation: "Link your GitHub repository in the Team Workspace to stream live telemetry."
      });
    } else {
      blockers.push({
        id: "blk-none",
        category: "CLEAR",
        severity: "SUCCESS",
        title: "Zero Critical Telemetry Blockers",
        description: "No code freezes, build failures, or unfulfilled checklist items detected in current telemetry.",
        causedBy: {
          type: "AUDIT",
          detail: "All active checks passing with 0 reported blockers."
        },
        remediation: "Maintain current development pace towards final Build Passport submission."
      });
    }
  }

  return blockers;
}

/**
 * 4. NEXT ACTION RECOMMENDATION
 * Evaluates the highest-leverage task based strictly on actual project state.
 */
export function recommendNextAction(context) {
  const { currentQuests = [], availableQuests = [], recentCommits = [], projectStatus = {} } = context;

  // Case 1: No repository connected
  if (!projectStatus.repoUrl && recentCommits.length === 0) {
    return {
      title: "Connect GitHub Repository to Workspace",
      targetRole: "Team Leader",
      targetAssignee: context.teamMembers[0]?.name || "Team Leader",
      priority: "CRITICAL",
      xpReward: 100,
      judgingImpact: "Required for Automated Build Passport Eligibility",
      whyNow: "Without a connected repository, the squad cannot stream commit telemetry, verify code originality, or mint a verifiable Build Passport for judging.",
      causedBy: {
        type: "REPOSITORY_STATUS",
        detail: "No active GitHub repository linked to this workspace."
      },
      executionChecklist: [
        { step: 1, text: "Open Team Workspace (/team) and click 'Connect GitHub Repository'" },
        { step: 2, text: "Authorize GitHub OAuth or select repository from installed repos" },
        { step: 3, text: "Push first commit during hackathon window to establish provenance baseline" }
      ]
    };
  }

  // Case 2: In-Progress quest available
  if (currentQuests.length > 0) {
    const q = currentQuests[0];
    const remainingTasks = (q.checklist || []).filter(c => !c.done);
    return {
      title: `Complete In-Progress Milestone: "${q.title}"`,
      targetRole: q.role || "Squad",
      targetAssignee: context.teamMembers.find(m => m.role === q.role)?.name || context.teamMembers[0]?.name || "Squad",
      priority: "HIGH_VALUE",
      xpReward: q.xpReward || 250,
      judgingImpact: `+${q.xpReward || 250} XP towards Team Vault and milestone leaderboard rank`,
      whyNow: `This milestone is already underway (${q.progress || 0}%). Finishing the remaining ${remainingTasks.length} task(s) unlocks XP and qualifies the deliverable for Build Passport inclusion.`,
      causedBy: {
        type: "QUEST_PROGRESS",
        id: q.id,
        detail: `Quest "${q.title}" has ${remainingTasks.length} pending task(s).`
      },
      executionChecklist: remainingTasks.length > 0 
        ? remainingTasks.map((t, idx) => ({ step: idx + 1, text: t.task }))
        : [{ step: 1, text: "Review evidence requirements and claim quest XP" }]
    };
  }

  // Case 3: Next available quest
  if (availableQuests.length > 0) {
    const q = availableQuests[0];
    return {
      title: `Unlock Next Milestone: "${q.title}"`,
      targetRole: q.role || "Squad",
      targetAssignee: context.teamMembers[0]?.name || "Squad",
      priority: "RECOMMENDED",
      xpReward: q.xpReward || 200,
      judgingImpact: `+${q.xpReward || 200} XP towards milestone completion`,
      whyNow: `Adopting "${q.title}" establishes the next core deliverable for your hackathon submission.`,
      causedBy: {
        type: "QUEST_BOARD",
        id: q.id,
        detail: `Next sequential milestone in ${q.phase || 'hackathon roadmap'}.`
      },
      executionChecklist: (q.checklist || []).map((t, idx) => ({ step: idx + 1, text: t.task }))
    };
  }

  // Case 4: All milestones completed
  return {
    title: "Finalize Video Presentation & Seal Build Passport",
    targetRole: "Team Leader / Presentation",
    targetAssignee: context.teamMembers[0]?.name || "Team Leader",
    priority: "FINALE",
    xpReward: 500,
    judgingImpact: "Final Qualification for Jury Evaluation",
    whyNow: "All development milestones are complete. Record your 3-minute video walkthrough and seal the cryptographic Build Passport.",
    causedBy: {
      type: "COMPLETION",
      detail: "All registered quests successfully completed."
    },
    executionChecklist: [
      { step: 1, text: "Record 3-minute Loom or YouTube product demonstration" },
      { step: 2, text: "Attach demo video URL in Build Passport settings" },
      { step: 3, text: "Click 'Seal & Submit to Jury' on the Build Passport page" }
    ]
  };
}

/**
 * 5. TEAM HEALTH EVALUATION
 * Computes collaboration, velocity, and integration from real activity records.
 */
export function computeTeamHealth(context) {
  const { recentCommits = [], teamMembers = [], projectStatus = {}, activeHackathon = null } = context;

  // Active committing members
  const activeActors = new Set(
    recentCommits.map(c => c.actor?.name || c.actor?.username || c.actor?.login).filter(Boolean)
  );
  const totalMembers = teamMembers.length || 1;
  const collabScore = Math.min(100, Math.round((activeActors.size / totalMembers) * 100));

  let collabStatus = "OPTIMAL";
  let collabDetail = `${activeActors.size} of ${totalMembers} squad members actively committing code.`;
  if (recentCommits.length === 0) {
    collabStatus = "INSUFFICIENT_DATA";
    collabDetail = "No commits recorded to measure collaboration.";
  } else if (collabScore < 50) {
    collabStatus = "STALLED";
    collabDetail = `Only ${activeActors.size} member is committing; potential knowledge silo or workstream stall.`;
  } else if (collabScore < 80) {
    collabStatus = "MODERATE";
    collabDetail = `${activeActors.size} of ${totalMembers} members committing; cross-workstream check-in suggested.`;
  }

  // Development status
  const commitsCount = recentCommits.length;
  let devScore = 0;
  let devStatus = "IDLE";
  let devDetail = "Zero commits detected in repository.";
  if (commitsCount > 0) {
    devScore = Math.min(100, Math.round(commitsCount * 12));
    devStatus = commitsCount >= 10 ? "HIGH_VELOCITY" : "MODERATE_VELOCITY";
    devDetail = `${commitsCount} verified commits logged in sprint telemetry.`;
  }

  // Integration status from commit contents
  const hasBackend = recentCommits.some(c => (c.metadata?.message || c.title || "").toLowerCase().includes("api") || (c.metadata?.message || c.title || "").toLowerCase().includes("contract"));
  const hasMl = recentCommits.some(c => (c.metadata?.message || c.title || "").toLowerCase().includes("ml") || (c.metadata?.message || c.title || "").toLowerCase().includes("inference"));
  const hasFrontend = recentCommits.some(c => (c.metadata?.message || c.title || "").toLowerCase().includes("ui") || (c.metadata?.message || c.title || "").toLowerCase().includes("hud") || (c.metadata?.message || c.title || "").toLowerCase().includes("frontend"));

  let integrationScore = 30;
  let integrationStatus = "NOT_STARTED";
  let integrationDetail = "Integration between microservices and client UI has not started.";

  if (hasBackend && hasFrontend) {
    integrationScore = 90;
    integrationStatus = "SYNCHRONIZED";
    integrationDetail = "Full-stack integration verified across backend contracts/APIs and client UI.";
  } else if (hasBackend || hasMl) {
    integrationScore = 55;
    integrationStatus = "PARTIAL";
    integrationDetail = "Backend/core logic has commits, but frontend consumer commits are pending.";
  } else if (commitsCount === 0) {
    integrationScore = 0;
    integrationStatus = "INSUFFICIENT_DATA";
    integrationDetail = "No commits available to evaluate integration.";
  }

  // Calculate real remaining time safely
  let remainingHoursText = "Active sprint";
  if (activeHackathon?.endsAt) {
    const endMs = Date.parse(activeHackathon.endsAt);
    if (!isNaN(endMs)) {
      const diffHours = Math.max(0, Math.round((endMs - Date.now()) / (3600 * 1000)));
      remainingHoursText = `${diffHours}h remaining`;
    }
  }

  // Risk Level
  let riskLevel = "LOW";
  let riskColor = "var(--accent-emerald)";
  let riskJustification = "All systems progressing with balanced contributions.";

  if (commitsCount === 0) {
    riskLevel = "MODERATE";
    riskColor = "var(--accent-amber)";
    riskJustification = `No commits recorded yet. Connect repository to initiate telemetry tracking (${remainingHoursText}).`;
  } else if (collabScore < 40) {
    riskLevel = "HIGH";
    riskColor = "var(--accent-rose)";
    riskJustification = `Severe collaboration imbalance: only ${activeActors.size} member is authoring code.`;
  } else if (integrationScore < 50) {
    riskLevel = "MEDIUM";
    riskColor = "var(--accent-amber)";
    riskJustification = `Workstream disparity: core services deployed without UI client integration (${remainingHoursText}).`;
  }

  return {
    collaboration: {
      status: collabStatus,
      score: collabScore,
      detail: collabDetail,
      activeMembers: activeActors.size,
      totalMembers
    },
    development: {
      status: devStatus,
      score: devScore,
      detail: devDetail,
      commitsAnalyzed: commitsCount
    },
    integration: {
      status: integrationStatus,
      score: integrationScore,
      detail: integrationDetail
    },
    risk: {
      level: riskLevel,
      color: riskColor,
      justification: riskJustification,
      integrityAuditScore: projectStatus.integrityScore !== null ? projectStatus.integrityScore : null
    }
  };
}

/**
 * 6. AUTOMATIC QUEST SUGGESTIONS
 * Suggests quests grounded in real project gaps.
 */
export function suggestQuests(context) {
  const { allQuests = [], recentCommits = [], projectStatus = {} } = context;

  const existingTitles = new Set(allQuests.map(q => (q.title || "").toLowerCase()));
  const suggestions = [];

  // Suggestion 1: If repo not connected
  if (!projectStatus.repoUrl && !existingTitles.has("connect github repository")) {
    suggestions.push({
      id: "ai-quest-connect-repo",
      phase: "Phase 1: Genesis",
      title: "Connect GitHub repository to workspace",
      description: "Link team repository to stream live commit telemetry, verify code originality, and unlock Build Passport minting.",
      tier: "Silver",
      xpReward: 150,
      status: "AVAILABLE",
      claimed: false,
      progress: 0,
      checklist: [
        { task: "Connect GitHub OAuth in Team Workspace", done: false },
        { task: "Push initial commit to main branch", done: false }
      ],
      causedBy: {
        type: "STATUS",
        detail: "Identified gap: Repository not yet associated with HackForge workspace."
      },
      isAiSuggested: true
    });
  }

  // Suggestion 2: If integration tests not observed
  const hasTests = recentCommits.some(c => (c.metadata?.message || c.title || "").toLowerCase().includes("test"));
  if (!hasTests && recentCommits.length > 0 && !existingTitles.has("implement automated integration tests")) {
    suggestions.push({
      id: "ai-quest-test-suite",
      phase: "Phase 3: Integration",
      title: "Implement automated integration tests",
      description: "Author and pass unit or end-to-end integration tests verifying core application logic.",
      tier: "Gold",
      xpReward: 250,
      status: "AVAILABLE",
      claimed: false,
      progress: 0,
      checklist: [
        { task: "Write test suite for core service/contract logic", done: false },
        { task: "Verify passing test run in local environment or CI", done: false }
      ],
      causedBy: {
        type: "TELEMETRY_AUDIT",
        detail: "Zero commits with automated test declarations detected in current repository history."
      },
      isAiSuggested: true
    });
  }

  // Suggestion 3: Video walkthrough
  if (!existingTitles.has("record 3-minute video presentation")) {
    suggestions.push({
      id: "ai-quest-video-demo",
      phase: "Phase 4: Finale & Passport",
      title: "Record 3-minute video presentation",
      description: "Film a concise product walkthrough covering problem statement, live architecture, and demo workflow for judges.",
      tier: "Legendary",
      xpReward: 300,
      status: "AVAILABLE",
      claimed: false,
      progress: 0,
      checklist: [
        { task: "Record 3-minute demo covering problem, architecture, and live usage", done: false },
        { task: "Attach video URL to Build Passport submission", done: false }
      ],
      causedBy: {
        type: "JURY_READINESS",
        detail: "Standard hackathon jury requirement: video walkthrough mandatory for final placement."
      },
      isAiSuggested: true
    });
  }

  return suggestions.filter(s => !existingTitles.has(s.title.toLowerCase()));
}

/**
 * 7. DAILY / HOURLY STANDUP GENERATOR
 * Generates structured standup from actual events and quests.
 * Produces a clear empty standup when no events exist.
 */
export function generateStandup(context, mode = 'hourly') {
  const { recentCommits = [], currentQuests = [], completedQuests = [], issues = [], activities = [] } = context;

  const isHourly = mode === 'hourly';
  const targetActivities = isHourly ? filterByTimeWindow(activities, '3h') : activities;

  // If zero activities and zero completed quests, return clear empty standup
  if (targetActivities.length === 0 && completedQuests.length === 0 && recentCommits.length === 0) {
    const windowLabel = isHourly ? 'last 3 hours' : 'sprint duration';
    return {
      mode,
      completed: [],
      inProgress: [],
      blocked: [],
      next: [],
      hasInsufficientData: true,
      markdown: `### 📋 HackForge ${isHourly ? 'Hourly Sprint Sync' : 'Daily Standup'} - ${context.teamName}
**Status:** Insufficient telemetry in the ${windowLabel}.
No commits, pull requests, or completed quests have been logged. Connect a repository or claim milestone quests to generate automated standup notes.`
    };
  }

  // Completed items from real commits & completed quests
  const completed = [];
  const relevantCommits = isHourly 
    ? targetActivities.filter(a => a.type === 'COMMIT')
    : recentCommits.slice(0, 5);

  relevantCommits.forEach(c => {
    const actor = c.actor?.name || c.actor?.username || c.actor?.login || "Contributor";
    const msg = c.metadata?.message || c.title || "Commit";
    const hash = c.metadata?.hash || c.metadata?.commit_hash || c.hash || null;
    let timeStr = "";
    if (c.timestamp) {
      const parsed = new Date(c.timestamp);
      if (!isNaN(parsed.getTime())) {
        timeStr = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    completed.push({
      item: msg,
      author: actor,
      hash,
      time: timeStr || "Recent",
      causedBy: hash ? `Commit ${hash.slice(0, 7)}` : "Verified Commit"
    });
  });

  completedQuests.forEach(q => {
    completed.push({
      item: `Completed Milestone: ${q.title}`,
      author: q.role || "Squad",
      hash: null,
      time: "Claimed",
      causedBy: `Quest ${q.id}`
    });
  });

  // In-progress items from real in-progress quests
  const inProgress = currentQuests.map(q => ({
    item: `Developing milestone: ${q.title} (${q.progress || 0}% complete)`,
    author: q.role || context.teamMembers[0]?.name || "Squad",
    branch: context.projectStatus.branch || 'main',
    causedBy: `Quest ${q.id}`
  }));

  // Blocked items from real open issues or inferred gaps
  const blocked = issues.map(i => ({
    item: `Issue #${i.number || '?'}: ${i.title}`,
    impact: i.severity || "Medium",
    causedBy: `Issue reported by ${i.author || i.user?.login || 'contributor'}`
  }));

  // Next objectives from available quests
  const next = (context.availableQuests || []).slice(0, 3).map(q => ({
    item: q.title,
    targetRole: q.role || "Squad",
    eta: "Upcoming"
  }));

  // Format copyable Markdown
  const markdown = `### 🚀 HackForge ${isHourly ? 'Hourly Sprint Sync (Last 3 Hours)' : 'Daily Standup'} - ${context.teamName}
**Sprint Time:** ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · **Commits Analyzed:** ${relevantCommits.length} · **Quests Completed:** ${completedQuests.length}

#### ✅ Completed
${completed.length > 0 ? completed.map(c => `- **${c.author}**: ${c.item} \`(${c.causedBy})\``).join('\n') : '- No completed events logged.'}

#### 🔄 In Progress
${inProgress.length > 0 ? inProgress.map(i => `- **${i.author}**: ${i.item} [branch: \`${i.branch}\`]`).join('\n') : '- No active in-progress quests.'}

#### ⛔ Blockers
${blocked.length > 0 ? blocked.map(b => `- **[${b.impact}]** ${b.item} — *${b.causedBy}*`).join('\n') : '- Zero reported issue blockers.'}

#### 🎯 Next Objectives
${next.length > 0 ? next.map(n => `- **[${n.targetRole}]** ${n.item}`).join('\n') : '- Maintain velocity towards final project freeze.'}
`;

  return {
    mode,
    completed,
    inProgress,
    blocked,
    next,
    hasInsufficientData: false,
    markdown
  };
}

/**
 * 8. QUESTION ANSWERING DISPATCHER
 * Evaluates queries strictly grounded in structured context without fabricating names, hashes, or metrics.
 */
export function answerCopilotPrompt(prompt = "", context = {}, analysis = {}) {
  const p = prompt.toLowerCase().trim();

  // Ensure analysis defaults are computed dynamically if omitted
  const safeAnalysis = {
    teamSummary: analysis.teamSummary || generateTeamSummary(context),
    blockers: analysis.blockers || detectBlockers(context),
    nextAction: analysis.nextAction || recommendNextAction(context),
    teamHealth: analysis.teamHealth || computeTeamHealth(context),
    standup: analysis.standup || generateStandup(context),
    ...analysis
  };

  // 1. TinyFish Web Research Query
  if (p.includes("tinyfish") || p.includes("web research") || p.includes("research docs") || p.includes("competitor")) {
    const problemName = context.problemStatement?.title || "your sprint challenge";
    return {
      answer: `🐟 TinyFish Live Web Research Integration for ${context.teamName}:
- **Autonomous Navigation**: TinyFish web agents navigate live technical documentation, extract API schemas, and analyze architectural patterns for "${problemName}".
- **Real-Time Telemetry**: Server-Sent Events (SSE) deliver live browser streaming logs and source citations straight to your workspace.
- **Quest Conversion**: Convert discovered specifications directly into executable milestone quests with XP rewards (+350 XP).
- **How to Use**: Click the "TinyFish Live Web Research" tab above to initiate an automated documentation crawl.`,
      evidence: [{ type: "INTEGRATION", label: "TinyFish Live Web Research Agent" }]
    };
  }

  // 2. Querying "what happened in last hour" or time-window questions
  if (p.includes("last hour") || p.includes("past hour") || p.includes("1 hour") || p.includes("1h")) {
    const oneHourActivities = filterByTimeWindow(context.activities || [], '1h');
    if (oneHourActivities.length === 0) {
      return {
        answer: `⏱️ Last 1 Hour Activity Report:
Insufficient telemetry evidence: No commits, pull requests, or milestone events were logged during the last 1 hour for ${context.teamName}.
Ensure team members are committing to the connected repository to stream real-time activity.`,
        evidence: []
      };
    }

    const commits = oneHourActivities.filter(a => a.type === 'COMMIT');
    const authors = Array.from(new Set(oneHourActivities.map(a => a.actor?.name || a.actor?.username || a.actor?.login).filter(Boolean)));
    const commitList = commits.map(c => {
      const hash = c.metadata?.hash || c.metadata?.commit_hash || c.hash;
      const msg = c.metadata?.message || c.title || "Commit";
      const author = c.actor?.name || c.actor?.username || "Contributor";
      return `- "${msg}" by ${author}${hash ? ` (${hash.slice(0, 7)})` : ''}`;
    }).join('\n');

    return {
      answer: `⏱️ Last 1 Hour Activity Report for ${context.teamName}:
- **Total Events**: ${oneHourActivities.length} (${commits.length} commits)
- **Active Author(s)**: ${authors.join(', ') || 'None identified'}
- **Recent Commits**:
${commitList || '- No commits in this window.'}`,
      evidence: commits.slice(0, 3).map(c => ({
        type: "COMMIT",
        hash: c.metadata?.hash || c.hash || null,
        label: `${c.metadata?.message || c.title || 'Commit'} by ${c.actor?.name || 'Contributor'}`
      }))
    };
  }

  // 3. Pre-Submission Architecture Audit
  if (p.includes("architecture audit") || p.includes("audit") || p.includes("pre-submission")) {
    const repoStatus = context.projectStatus?.repoUrl ? `Connected (@${context.projectStatus.repoUrl.replace('https://github.com/', '')})` : "Not Connected";
    const commitCount = context.recentCommits?.length || 0;
    const completedCount = context.completedQuests?.length || 0;
    const totalQuests = context.allQuests?.length || 0;
    const integrity = context.projectStatus?.integrityScore !== null ? `${context.projectStatus.integrityScore}% Clean` : "Awaiting repository connection";
    const blockers = (safeAnalysis.blockers || []).filter(b => b.category !== 'CLEAR');

    const evidenceList = (context.recentCommits || []).slice(0, 3).map(c => ({
      type: "COMMIT",
      hash: c.metadata?.hash || c.hash || null,
      label: `${c.metadata?.message || c.title || 'Commit'} by ${c.actor?.name || 'Contributor'}`
    }));

    return {
      answer: `🔍 Pre-Submission Architecture Audit for ${context.teamName}:

1. **Repository & Telemetry Baseline**:
   - Status: ${repoStatus}
   - Verified Commits: ${commitCount}
   - Branch: ${context.projectStatus?.branch || 'main'}

2. **Milestone Progress**:
   - Quests Completed: ${completedCount}/${totalQuests}
   - Active Blockers: ${blockers.length} reported issue(s) or friction points

3. **Build Passport Integrity**:
   - Originality Audit: ${integrity}

**Recommended Focus**: ${safeAnalysis.nextAction?.title || "Complete remaining deliverables before code freeze."}`,
      evidence: evidenceList
    };
  }

  // 4. Sprint Pacing & Velocity
  if (p.includes("pacing") || p.includes("velocity") || p.includes("remaining")) {
    const commitCount = context.recentCommits?.length || 0;
    let remainingText = "Sprint window active";
    if (context.activeHackathon?.endsAt) {
      const endMs = Date.parse(context.activeHackathon.endsAt);
      if (!isNaN(endMs)) {
        const diffHours = Math.max(0, Math.round((endMs - Date.now()) / (3600 * 1000)));
        remainingText = `${diffHours} hour(s) remaining until submission freeze`;
      }
    }

    return {
      answer: `⏱️ Sprint Pacing & Velocity Diagnostic:
- **Recorded Commits**: ${commitCount} verified commits
- **Sprint Window**: ${remainingText}
- **Completed Milestones**: ${context.completedQuests?.length || 0} quests claimed
- **Assessment**: ${safeAnalysis.teamHealth?.development?.detail || "Pacing analysis active."}`,
      evidence: (context.recentCommits || []).slice(0, 2).map(c => ({
        type: "COMMIT",
        hash: c.metadata?.hash || c.hash || null,
        label: c.metadata?.message || c.title || 'Commit'
      }))
    };
  }

  // 5. Blockers / Gaps Query
  if (p.includes("blocker") || p.includes("friction") || p.includes("stuck") || p.includes("gap")) {
    const blockers = safeAnalysis.blockers || [];
    const formatted = blockers.map(b => `- **[${b.severity}] ${b.title}**: ${b.description}`).join('\n');
    return {
      answer: `⚠️ Active Telemetry Blockers & Friction Points (${blockers.length}):
${formatted}

**Recommended Remediation**: ${blockers[0]?.remediation || "Maintain steady commit cadence."}`,
      evidence: blockers.map(b => ({
        type: b.causedBy?.type || "BLOCKER",
        label: b.title
      }))
    };
  }

  // 6. Next Action / What should I do
  if (p.includes("next") || p.includes("what should i do") || p.includes("task") || p.includes("priority")) {
    const na = safeAnalysis.nextAction || recommendNextAction(context);
    return {
      answer: `🎯 Highest-Value Next Action: **${na.title}**
- **Assigned Role**: ${na.targetRole} (${na.targetAssignee})
- **Bounty Impact**: +${na.xpReward} XP (${na.judgingImpact})
- **Why Now**: ${na.whyNow}

**Action Steps**:
${na.executionChecklist.map(s => `${s.step}. ${s.text}`).join('\n')}`,
      evidence: na.causedBy ? [na.causedBy] : []
    };
  }

  // 7. Member query ("What did [name] do?" / "Is [name] active?")
  const members = context.teamMembers || [];
  const matchedMember = members.find(m => m && m.name && p.includes(m.name.toLowerCase()));
  
  if (matchedMember) {
    const memberName = matchedMember.name;
    const memberCommits = (context.recentCommits || []).filter(c => {
      const act = (c.actor?.name || c.actor?.username || c.actor?.login || "").toLowerCase();
      return act === memberName.toLowerCase() || act.includes(memberName.toLowerCase().split(' ')[0]);
    });

    if (memberCommits.length === 0) {
      return {
        answer: `👤 Workstream Report for ${memberName} (${matchedMember.role || 'Member'}):
- **Observed Commits**: 0 commits recorded in the connected repository history.
- **Inferred Possibility**: May be working in an unpushed local branch, researching architectures, or waiting on dependent services.
- **Status**: No repository telemetry available to measure code velocity.`,
        evidence: []
      };
    }

    const commitList = memberCommits.map(c => {
      const hash = c.metadata?.hash || c.metadata?.commit_hash || c.hash;
      const msg = c.metadata?.message || c.title || "Commit";
      return `- "${msg}"${hash ? ` (commit ${hash.slice(0, 7)})` : ''}`;
    }).join('\n');

    return {
      answer: `👤 Telemetry Summary for ${memberName} (${matchedMember.role || 'Member'}):
- **Verified Commits**: ${memberCommits.length}
- **Recent Activities**:
${commitList}`,
      evidence: memberCommits.slice(0, 3).map(c => ({
        type: "COMMIT",
        hash: c.metadata?.hash || c.hash || null,
        label: `${c.metadata?.message || c.title || 'Commit'} by ${memberName}`
      }))
    };
  }

  // Check if user is asking about an unrecognized person
  const cleanTokens = p.replace(/[?!.,;:'"()]/g, '').split(/\s+/);
  const potentialNameQuery = cleanTokens.find(w => w.length >= 3 && !['what', 'when', 'where', 'which', 'about', 'audit', 'pacing', 'sprint', 'hackathon', 'copilot', 'explain', 'show', 'tell', 'help', 'work', 'done', 'with', 'from', 'this', 'that', 'last', 'hour', 'team', 'member', 'squad'].includes(w));
  if ((p.includes("what did") || p.includes("who is") || p.includes("work on")) && potentialNameQuery) {
    return {
      answer: `❓ Unrecognized Member: "${potentialNameQuery}" is not recognized as a member of ${context.teamName}.
Registered team members: ${members.map(m => m.name).join(', ') || 'None registered'}.`,
      evidence: []
    };
  }

  // 8. General Grounded Fallback
  const commitCount = context.recentCommits?.length || 0;
  const questCount = context.completedQuests?.length || 0;
  return {
    answer: `🤖 HackForge Telemetry Diagnostic for "${prompt}":
Based on structured project state for ${context.teamName} (${commitCount} verified commits, ${questCount} completed quests):
- ${safeAnalysis.teamSummary?.text || "Workstream analysis active."}
- Top Blocker: ${safeAnalysis.blockers?.[0]?.title || "None detected"}
- Recommended Action: ${safeAnalysis.nextAction?.title || "Continue current development sprint."}`,
    evidence: safeAnalysis.teamSummary?.evidence || []
  };
}
