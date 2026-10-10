/**
 * HackForge Real GitHub Integration Test Suite
 * 
 * Runs REAL network requests against GitHub's official API and HackForge's Express server.
 * Uses real public repositories (e.g. rachitbuild12/HackForge) to verify live commit,
 * branch, telemetry normalization and server authentication endpoints.
 * 
 * Usage:
 *   node server/test-real-github.js [optional_github_token]
 */

import { normalizeGitHubActivities } from './githubAppService.js';

const SERVER_BASE = process.env.TEST_SERVER_URL || 'http://localhost:3001';
const CLI_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN || process.env.TEST_GITHUB_TOKEN || '';
const TARGET_REPO = 'rachitbuild12/HackForge';

console.log('================================================================');
console.log(' 🔥 HACKFORGE // REAL GITHUB INTEGRATION TEST SUITE');
console.log('================================================================');
console.log(` Target Server : ${SERVER_BASE}`);
console.log(` Public Repo   : https://github.com/${TARGET_REPO}`);
console.log(` Live Token    : ${CLI_TOKEN ? 'Provided (Will run full authenticated tests)' : 'None (Testing public endpoints & server security)'}`);
console.log('----------------------------------------------------------------\n');

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

async function runTests() {
  // -------------------------------------------------------------
  // TEST SUITE 1: REAL GITHUB API CONNECTIVITY & LIVE REPO DATA
  // -------------------------------------------------------------
  console.log('1️⃣ [REAL GITHUB API] Testing Live Connectivity & Metadata...');
  try {
    const zenRes = await fetch('https://api.github.com/zen', {
      headers: { 'User-Agent': 'HackForge-Test-Runner' }
    });
    assert(zenRes.ok, 'GitHub API Zen Endpoint Responds', `Status: ${zenRes.status}`);

    const repoRes = await fetch(`https://api.github.com/repos/${TARGET_REPO}`, {
      headers: { 'User-Agent': 'HackForge-Test-Runner' }
    });
    assert(repoRes.ok, `Fetch Real Metadata for ${TARGET_REPO}`, `Status: ${repoRes.status}`);
    
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      assert(repoData.full_name === TARGET_REPO, 'Repo Full Name Matches', repoData.full_name);
      assert(Boolean(repoData.default_branch), 'Default Branch Detected', repoData.default_branch);
      assert(repoData.owner?.login === 'rachitbuild12', 'Owner Login Matches', repoData.owner?.login);
      assert(repoData.owner?.avatar_url?.startsWith('https://'), 'Real Owner Avatar Present', repoData.owner?.avatar_url);
    }
  } catch (err) {
    assert(false, 'Live GitHub API Connectivity', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 2: REAL COMMITS & REAL TELEMETRY NORMALIZATION
  // -------------------------------------------------------------
  console.log('\n2️⃣ [REAL TELEMETRY] Fetching Real Commits & Normalizing...');
  let realCommits = [];
  try {
    const commitsRes = await fetch(`https://api.github.com/repos/${TARGET_REPO}/commits?per_page=5`, {
      headers: { 'User-Agent': 'HackForge-Test-Runner' }
    });
    assert(commitsRes.ok, `Fetch Real Commits from ${TARGET_REPO}`, `Status: ${commitsRes.status}`);

    if (commitsRes.ok) {
      realCommits = await commitsRes.json();
      assert(Array.isArray(realCommits) && realCommits.length > 0, 'Real Commits Retrieved', `Count: ${realCommits.length}`);
      
      const latest = realCommits[0];
      const shortSha = latest.sha?.substring(0, 7);
      const commitMsg = latest.commit?.message?.split('\n')[0];
      const authorName = latest.commit?.author?.name;
      console.log(`     ↳ Latest Commit: [${shortSha}] "${commitMsg}" by ${authorName}`);

      // Normalize into HackForge ProjectActivity items
      const normalized = normalizeGitHubActivities('team-hyperdrive', realCommits, [], [], []);
      assert(normalized.length === realCommits.length, 'Normalized Activities Count Matches Real Commits', `Count: ${normalized.length}`);

      const firstNorm = normalized[0];
      assert(firstNorm.type === 'COMMIT', 'Activity Type is COMMIT', firstNorm.type);
      assert(firstNorm.hash === shortSha, 'Activity Hash Matches Real SHA', firstNorm.hash);
      assert(firstNorm.title === commitMsg, 'Activity Title Matches Real Message', firstNorm.title);
      assert(firstNorm.author.avatar.startsWith('https://avatars.githubusercontent.com') || firstNorm.author.avatar.startsWith('https://'), 'Uses Real GitHub Avatar', firstNorm.author.avatar);
      assert(!firstNorm.author.avatar.includes('unsplash.com'), 'Zero Fake Unsplash Avatars', 'Clean');
      assert(!firstNorm.linesChanged.includes('undefined'), 'Valid Stats Formatting', firstNorm.linesChanged);
    }
  } catch (err) {
    assert(false, 'Real Commits Normalization', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 3: SERVER ENDPOINTS & ACCESS CONTROL TESTS
  // -------------------------------------------------------------
  console.log('\n3️⃣ [LOCAL SERVER API] Testing HackForge Express Auth Endpoints...');
  try {
    // 3.1 Check /api/auth/github/status
    const statusRes = await fetch(`${SERVER_BASE}/api/auth/github/status`);
    assert(statusRes.ok, 'GET /api/auth/github/status Responds', `Status: ${statusRes.status}`);
    const statusData = await statusRes.json();
    assert(typeof statusData.authenticated === 'boolean', 'Status Contains authenticated Boolean', `authenticated: ${statusData.authenticated}`);

    // 3.2 Direct Token - Missing token validation
    const missingTokenRes = await fetch(`${SERVER_BASE}/api/auth/github/direct-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: '' })
    });
    assert(missingTokenRes.status === 400, 'POST /api/auth/github/direct-token Rejects Empty Token', `Status: ${missingTokenRes.status}`);

    // 3.3 Direct Token - Invalid token validation
    const invalidTokenRes = await fetch(`${SERVER_BASE}/api/auth/github/direct-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: 'ghp_invalid_dummy_token_12345' })
    });
    assert(invalidTokenRes.status === 401, 'POST /api/auth/github/direct-token Rejects Fake Token', `Status: ${invalidTokenRes.status}`);
    const invalidData = await invalidTokenRes.json();
    assert(invalidData.error === 'INVALID_TOKEN', 'Error Code is INVALID_TOKEN', invalidData.error);

    // 3.4 Unauthorized Repos Fetch
    const unauthReposRes = await fetch(`${SERVER_BASE}/api/github/repos`);
    assert(unauthReposRes.status === 401, 'GET /api/github/repos Rejects Unauthenticated Client', `Status: ${unauthReposRes.status}`);

    // 3.5 Unauthorized Associate Fetch
    const unauthAssocRes = await fetch(`${SERVER_BASE}/api/github/associate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner: 'rachitbuild12', repo: 'HackForge' })
    });
    assert(unauthAssocRes.status === 401, 'POST /api/github/associate Rejects Unauthenticated Client', `Status: ${unauthAssocRes.status}`);

    // 3.6 GitHub App Status
    const appStatusRes = await fetch(`${SERVER_BASE}/api/github/app/status`);
    assert(appStatusRes.ok, 'GET /api/github/app/status Responds', `Status: ${appStatusRes.status}`);
  } catch (err) {
    assert(false, 'Local Server API Tests', err.message);
  }

  // -------------------------------------------------------------
  // TEST SUITE 4: REAL AUTHENTICATED END-TO-END FLOW (IF TOKEN GIVEN)
  // -------------------------------------------------------------
  if (CLI_TOKEN) {
    console.log('\n4️⃣ [AUTHENTICATED FLOW] Testing Real Token Login & Repo Association...');
    try {
      // 4.1 Authenticate with real token
      const authRes = await fetch(`${SERVER_BASE}/api/auth/github/direct-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: CLI_TOKEN })
      });
      assert(authRes.ok, 'Real Token Authenticated Successfully', `Status: ${authRes.status}`);
      const authData = await authRes.json();
      assert(Boolean(authData.user?.login), 'Real User Login Retrieved', `@${authData.user?.login}`);

      // Extract session cookie
      const cookie = authRes.headers.get('set-cookie');
      assert(Boolean(cookie), 'Server Set-Cookie Received');

      // 4.2 Fetch real user repositories
      const reposRes = await fetch(`${SERVER_BASE}/api/github/repos`, {
        headers: { Cookie: cookie }
      });
      assert(reposRes.ok, 'GET /api/github/repos with Real Session', `Status: ${reposRes.status}`);
      const reposData = await reposRes.json();
      assert(Array.isArray(reposData.repositories), 'Real Repositories List Returned', `Total: ${reposData.repositories.length}`);

      // 4.3 Associate target repository
      const assocRes = await fetch(`${SERVER_BASE}/api/github/associate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ owner: 'rachitbuild12', repo: 'HackForge', projectId: 'team-hyperdrive' })
      });
      assert(assocRes.ok, 'POST /api/github/associate Real Repo', `Status: ${assocRes.status}`);
      const assocData = await assocRes.json();
      assert(assocData.success === true, 'Associate Success Response', assocData.repository?.full_name);
      assert(assocData.activities?.length > 0, 'Real Activities Synchronized', `Activities: ${assocData.activities?.length}`);

      // 4.4 Disconnect session
      const discRes = await fetch(`${SERVER_BASE}/api/auth/github/disconnect`, {
        method: 'POST',
        headers: { Cookie: cookie }
      });
      assert(discRes.ok, 'POST /api/auth/github/disconnect Cleared Session', `Status: ${discRes.status}`);
    } catch (err) {
      assert(false, 'Authenticated End-to-End Flow', err.message);
    }
  } else {
    console.log('\nℹ️ TIP: To run Suite 4 with an active GitHub session:');
    console.log('   node server/test-real-github.js <your_github_token>');
  }

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(` 🏁 RESULTS: ${passCount} Passed, ${failCount} Failed`);
  console.log('================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
