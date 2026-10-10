/**
 * HackForge Deterministic AI Copilot Engine - Test Suite
 * 
 * Verifies data-driven behavior, telemetry causality, time-window precision,
 * graceful handling of empty/malformed datasets, and anti-hallucination guarantees.
 * 
 * Usage:
 *   node server/test-copilot-engine.js
 */

import {
  extractStructuredContext,
  filterByTimeWindow,
  generateTeamSummary,
  generateProgressSummary,
  detectBlockers,
  recommendNextAction,
  computeTeamHealth,
  suggestQuests,
  generateStandup,
  answerCopilotPrompt
} from '../src/utils/aiCopilotEngine.js';

console.log('================================================================');
console.log(' 🤖 HACKFORGE AI COPILOT ENGINE // AUTOMATED VERIFICATION SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    failCount++;
  }
}

async function runAllTests() {
  // =========================================================================
  // TEST SUITE 1: Empty Context & No Repository
  // =========================================================================
  console.log('📋 Test Suite 1: Empty Context & No Repository Handling');
  {
    const emptyCtx = extractStructuredContext({});
    assert(emptyCtx.recentCommits.length === 0, 'Empty context produces 0 commits');
    assert(emptyCtx.teamMembers.length === 0, 'Empty context produces 0 team members');
    assert(emptyCtx.projectStatus.isRepoConnected === false, 'Repo marked as not connected');
    assert(emptyCtx.projectStatus.integrityScore === null, 'Integrity score is null (no fake score)');

    const teamSummary = generateTeamSummary(emptyCtx);
    assert(teamSummary.hasInsufficientData === true, 'Team summary flags insufficient data');
    assert(teamSummary.evidence.length === 0, 'Zero fabricated evidence items in empty team summary');
    assert(teamSummary.stats.backendCommits === 0, 'Zero backend commits in empty team summary');

    const progressSummary = generateProgressSummary(emptyCtx, '1h');
    assert(progressSummary.hasInsufficientData === true, 'Progress summary flags insufficient data');
    assert(progressSummary.delta.commits === 0, 'Zero commits in empty 1h progress');
    assert(progressSummary.delta.additions === 0, 'Zero additions in empty 1h progress');

    const standup = generateStandup(emptyCtx, 'hourly');
    assert(standup.hasInsufficientData === true, 'Standup flags insufficient data');
    assert(standup.completed.length === 0, 'Zero completed items in empty standup');
    assert(standup.markdown.includes('Insufficient telemetry'), 'Standup markdown reports insufficient telemetry');

    const q1 = answerCopilotPrompt("What happened during the last hour?", emptyCtx);
    assert(q1.answer.toLowerCase().includes('insufficient telemetry') || q1.answer.toLowerCase().includes('0 commits'), 'Copilot Q&A reports insufficient evidence for last hour');
    assert(q1.evidence.length === 0, 'Copilot Q&A returns zero evidence when no repo connected');

    const health = computeTeamHealth(emptyCtx);
    assert(health.collaboration.status === 'INSUFFICIENT_DATA', 'Health collaboration status is INSUFFICIENT_DATA');
    assert(health.risk.integrityAuditScore === null, 'Risk integrityAuditScore is null');
  }

  // =========================================================================
  // TEST SUITE 2: Valid GitHub Activity with Authentic Records
  // =========================================================================
  console.log('\n📋 Test Suite 2: Valid GitHub Activity & Telemetry Causality');
  {
    const now = Date.now();
    const mockTeam = {
      name: "CyberSentinels",
      members: [
        { id: "mem-1", name: "Dev Alpha", role: "Backend Architect" },
        { id: "mem-2", name: "Dev Beta", role: "Frontend Lead" }
      ],
      githubRepo: "https://github.com/cybersentinels/sentinel-hub",
      xpEarned: 1800
    };

    const mockActivities = [
      {
        id: "act-1",
        type: "COMMIT",
        timestamp: new Date(now - 15 * 60 * 1000).toISOString(), // 15 mins ago
        actor: { name: "Dev Alpha" },
        metadata: {
          hash: "7f8a9b0c1d2e3f4",
          message: "feat(backend): implement authenticated API endpoints",
          additions: 120,
          deletions: 15
        }
      },
      {
        id: "act-2",
        type: "COMMIT",
        timestamp: new Date(now - 25 * 60 * 1000).toISOString(), // 25 mins ago
        actor: { name: "Dev Beta" },
        metadata: {
          hash: "1a2b3c4d5e6f7a8",
          message: "feat(ui): build reactive dashboard component",
          additions: 85,
          deletions: 5
        }
      }
    ];

    const mockIssues = [
      {
        id: "iss-1",
        number: 42,
        title: "CORS error on auth routes during local testing",
        severity: "HIGH",
        author: "Dev Beta",
        description: "Preflight OPTIONS request rejected by server"
      }
    ];

    const mockQuests = [
      {
        id: "q-1",
        title: "Deploy API Gateway",
        status: "COMPLETED",
        claimedBy: "Dev Alpha"
      },
      {
        id: "q-2",
        title: "User Experience Polish",
        status: "IN_PROGRESS",
        claimedBy: "Dev Beta",
        checklist: [
          { task: "Design navigation", done: true },
          { task: "Implement mobile drawer", done: false }
        ]
      }
    ];

    const validCtx = extractStructuredContext({
      team: mockTeam,
      activities: mockActivities,
      issues: mockIssues,
      quests: mockQuests,
      activeHackathon: { endsAt: new Date(now + 24 * 3600 * 1000).toISOString() }
    });

    assert(validCtx.recentCommits.length === 2, 'Extracts exactly 2 commits');
    assert(validCtx.teamMembers.length === 2, 'Extracts 2 team members');

    const teamSummary = generateTeamSummary(validCtx);
    assert(teamSummary.hasInsufficientData === false, 'Team summary computed with real data');
    assert(teamSummary.stats.backendCommits === 1, 'Correctly detected 1 backend commit');
    assert(teamSummary.stats.frontendCommits === 1, 'Correctly detected 1 frontend commit');
    assert(teamSummary.evidence.some(e => e.hash === '7f8a9b0c1d2e3f4'), 'Backend commit 7f8a9b0c1d2e3f4 present in evidence');

    const blockers = detectBlockers(validCtx);
    const corsBlocker = blockers.find(b => b.causedBy?.number === 42);
    assert(corsBlocker !== undefined, 'Detected real Issue #42 as blocker');
    assert(corsBlocker.causedBy.author === 'Dev Beta', 'Blocker attributed to real author Dev Beta');

    const qAlpha = answerCopilotPrompt("What did Dev Alpha work on?", validCtx);
    assert(qAlpha.answer.includes("Dev Alpha"), 'Copilot answers about Dev Alpha');
    assert(qAlpha.answer.includes("7f8a9b0c1d2e3f4".slice(0, 7)), 'Answer references authentic commit hash');
    assert(qAlpha.evidence.length > 0, 'Evidence array contains supporting record');

    const qBlocker = answerCopilotPrompt("What blockers are detected?", validCtx);
    assert(qBlocker.answer.includes("Issue #42"), 'Blocker answer explicitly references Issue #42');
    assert(qBlocker.answer.includes("CORS error on auth routes"), 'Blocker answer quotes actual issue title');
  }

  // =========================================================================
  // TEST SUITE 3: Missing, Null, and Invalid Timestamps
  // =========================================================================
  console.log('\n📋 Test Suite 3: Safe Handling of Missing and Invalid Timestamps');
  {
    const now = Date.now();
    const messyActivities = [
      { id: "m-1", type: "COMMIT", timestamp: null, metadata: { message: "no timestamp" } },
      { id: "m-2", type: "COMMIT", timestamp: "not-a-valid-date", metadata: { message: "bogus date" } },
      { id: "m-3", type: "COMMIT", timestamp: undefined, metadata: { message: "undefined date" } },
      { id: "m-4", type: "COMMIT", timestamp: "", metadata: { message: "empty string date" } },
      { id: "m-5", type: "COMMIT", timestamp: new Date(now - 10 * 60 * 1000).toISOString(), metadata: { message: "valid 10m ago" } }
    ];

    const filtered1h = filterByTimeWindow(messyActivities, '1h');
    assert(filtered1h.length === 1, 'filterByTimeWindow safely ignores null/invalid timestamps and keeps valid 1', `Count: ${filtered1h.length}`);
    assert(filtered1h[0].id === 'm-5', 'Preserved the single valid recent activity');

    const messyCtx = extractStructuredContext({
      activities: messyActivities
    });

    const progress = generateProgressSummary(messyCtx, '1h');
    assert(!isNaN(progress.delta.commits), 'Commit count is not NaN');
    assert(!isNaN(progress.delta.additions), 'Additions count is not NaN');
    assert(progress.delta.commits === 1, 'Correctly counted exactly 1 valid commit in 1h window');
  }

  // =========================================================================
  // TEST SUITE 4: Time-Window Calculations Using Current Clock (Date.now())
  // =========================================================================
  console.log('\n📋 Test Suite 4: Time-Window Filtering Using Real Clock');
  {
    const now = Date.now();
    const timeActivities = [
      { id: "t-30m", timestamp: new Date(now - 30 * 60 * 1000).toISOString() },  // 30m ago (inside 1h & 3h)
      { id: "t-2h",  timestamp: new Date(now - 120 * 60 * 1000).toISOString() }, // 2h ago (inside 3h, outside 1h)
      { id: "t-5h",  timestamp: new Date(now - 300 * 60 * 1000).toISOString() }, // 5h ago (outside 1h & 3h)
      { id: "t-24h", timestamp: new Date(now - 24 * 3600 * 1000).toISOString() } // 24h ago
    ];

    const res1h = filterByTimeWindow(timeActivities, '1h');
    assert(res1h.length === 1 && res1h[0].id === 't-30m', '1h window returns only events within last 60 minutes');

    const res3h = filterByTimeWindow(timeActivities, '3h');
    assert(res3h.length === 2, '3h window returns events within last 180 minutes (2 events)');
    assert(res3h.some(e => e.id === 't-30m') && res3h.some(e => e.id === 't-2h'), '3h window contains t-30m and t-2h');

    const resAll = filterByTimeWindow(timeActivities, 'all');
    assert(resAll.length === 4, 'all window returns all 4 valid activities');

    // Scenario: All events are from yesterday. In a real-time system, a 1h window MUST return 0 events,
    // not treat yesterday\'s event as "now".
    const yesterdayActivities = [
      { id: "old-1", timestamp: new Date(now - 26 * 3600 * 1000).toISOString() },
      { id: "old-2", timestamp: new Date(now - 28 * 3600 * 1000).toISOString() }
    ];
    const resStale1h = filterByTimeWindow(yesterdayActivities, '1h');
    assert(resStale1h.length === 0, 'Real current clock correctly excludes stale events from 1h window even if they are the latest available');
  }

  // =========================================================================
  // TEST SUITE 5: Unknown Members and Members with Zero Commits
  // =========================================================================
  console.log('\n📋 Test Suite 5: Unknown Members & 0-Commit Member Handling');
  {
    const teamWithMembers = {
      name: "VectorFlow",
      members: [
        { id: "m1", name: "Kiran Patel", role: "Smart Contract Lead" },
        { id: "m2", name: "Elena Rostova", role: "Frontend Engineer" }
      ]
    };

    // Kiran has commits, Elena has zero commits
    const memberActivities = [
      {
        id: "c-1",
        type: "COMMIT",
        timestamp: new Date().toISOString(),
        actor: { name: "Kiran Patel" },
        metadata: { hash: "cc11223", message: "Deploy staking smart contracts" }
      }
    ];

    const memberCtx = extractStructuredContext({
      team: teamWithMembers,
      activities: memberActivities
    });

    // 1. Unknown member query
    const unknownAns = answerCopilotPrompt("What did Zack work on in the sprint?", memberCtx);
    assert(unknownAns.answer.includes("not recognized as a member of VectorFlow"), 'Explicitly reports Zack is unrecognized');
    assert(unknownAns.answer.includes("Kiran Patel") && unknownAns.answer.includes("Elena Rostova"), 'Lists actual team members');
    assert(unknownAns.evidence.length === 0, 'No fabricated evidence for unknown member');

    // 2. Recognized member with zero commits
    const elenaAns = answerCopilotPrompt("What did Elena Rostova work on?", memberCtx);
    assert(elenaAns.answer.includes("0 commits"), 'Explicitly reports 0 commits for Elena Rostova');
    assert(!elenaAns.answer.toLowerCase().includes("cheat"), 'Does NOT accuse member of cheating or misconduct');
  }

  // =========================================================================
  // TEST SUITE 6: Anti-Hallucination & Evidence Attribution Audit
  // =========================================================================
  console.log('\n📋 Test Suite 6: Anti-Hallucination & Evidence Attribution');
  {
    // Provide a dataset that does NOT contain "Arjun", "Sophia", "a12e99f", "3d9c70b", or "Issue #8"
    const cleanTeam = {
      name: "QuantumNexus",
      members: [{ id: "qn-1", name: "Maya Lin", role: "Lead Dev" }],
      githubRepo: "https://github.com/quantumnexus/core"
    };
    const cleanActivities = [
      {
        id: "act-real-1",
        type: "COMMIT",
        timestamp: new Date().toISOString(),
        actor: { name: "Maya Lin" },
        metadata: { hash: "99aa88bb77cc", message: "Initial Quantum contract setup" }
      }
    ];

    const cleanCtx = extractStructuredContext({
      team: cleanTeam,
      activities: cleanActivities
    });

    const summary = generateTeamSummary(cleanCtx);
    const progress = generateProgressSummary(cleanCtx, '1h');
    const blockers = detectBlockers(cleanCtx);
    const health = computeTeamHealth(cleanCtx);
    const standup = generateStandup(cleanCtx, 'hourly');
    const qAudit = answerCopilotPrompt("Run Pre-Submission Architecture Audit", cleanCtx);
    const qPacing = answerCopilotPrompt("Sprint Pacing Assessment", cleanCtx);

    const allOutputStrings = [
      summary.text,
      ...summary.evidence.map(e => JSON.stringify(e)),
      progress.text,
      ...blockers.map(b => JSON.stringify(b)),
      health.collaboration.detail,
      health.risk.justification,
      standup.markdown,
      qAudit.answer,
      qPacing.answer
    ].join(' ');

    assert(!allOutputStrings.includes("Arjun"), 'Zero occurrences of hardcoded "Arjun"');
    assert(!allOutputStrings.includes("Sophia"), 'Zero occurrences of hardcoded "Sophia"');
    assert(!allOutputStrings.includes("a12e99f"), 'Zero occurrences of hardcoded hash "a12e99f"');
    assert(!allOutputStrings.includes("3d9c70b"), 'Zero occurrences of hardcoded hash "3d9c70b"');
    assert(!allOutputStrings.includes("97.4%"), 'Zero occurrences of hardcoded "97.4%" originality');
    assert(!allOutputStrings.includes("31h remaining"), 'Zero occurrences of hardcoded "31h remaining"');

    // Evidence attribution check
    summary.evidence.forEach(ev => {
      assert(ev.hash === "99aa88bb77cc", 'All evidence hashes directly match input records', `Found: ${ev.hash}`);
      assert(ev.actor === "Maya Lin", 'All evidence actors directly match input records', `Found: ${ev.actor}`);
    });
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n================================================================');
  console.log(` 🏁 TEST RUN COMPLETE: ${passCount} Passed, ${failCount} Failed`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
