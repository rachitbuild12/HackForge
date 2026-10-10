import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createTinyFishRouter } from './tinyfishRoutes.js';
import { createGitHubAppRouter } from './githubAppRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

// Server-side in-memory session store (Access tokens NEVER leave the server)
// sessionId -> { token: string, user: object, createdAt: number }
const serverSessions = new Map();

// Associated project repositories & normalized activities
// projectId -> { repoMeta: object, activities: ProjectActivity[] }
const projectDataStore = new Map();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hackforges.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.endsWith('.netlify.app'))) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(cookieParser());

// Helper: Extract valid server session
function getSession(req) {
  const sessionId = req.cookies?.hackforge_session_id;
  if (!sessionId) return null;
  return serverSessions.get(sessionId) || null;
}

// =========================================================
// OAUTH & AUTHENTICATION ENDPOINTS
// =========================================================

// 1. Check current auth status & configuration
app.get('/api/auth/github/status', (req, res) => {
  const session = getSession(req);
  const isConfigured = Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);

  if (session && session.user) {
    return res.json({
      authenticated: true,
      configured: isConfigured,
      clientId: GITHUB_CLIENT_ID ? `${GITHUB_CLIENT_ID.slice(0, 6)}...` : null,
      user: session.user
    });
  }

  return res.json({
    authenticated: false,
    configured: isConfigured,
    clientId: GITHUB_CLIENT_ID ? `${GITHUB_CLIENT_ID.slice(0, 6)}...` : null,
    user: null
  });
});

// 2. Initiate GitHub OAuth
app.get('/api/auth/github', (req, res) => {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.redirect(
      `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(
        'GitHub OAuth credentials (GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET) are not configured in .env. You can connect instantly using a Personal Access Token in the modal!'
      )}`
    );
  }

  const state = crypto.randomBytes(16).toString('hex');
  const scopes = 'repo,read:user,user:email';

  let authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
    GITHUB_CLIENT_ID
  )}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}`;

  if (process.env.GITHUB_CALLBACK_URL) {
    authUrl += `&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}`;
  }

  res.redirect(authUrl);
});

// 3. OAuth Callback handler
app.get('/api/auth/github/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error || !code) {
    console.error('OAuth callback error from GitHub:', error, error_description);
    const friendlyMsg = error_description || (error === 'redirect_uri_mismatch'
      ? 'Callback URL mismatch: Please verify Authorization callback URL in your GitHub OAuth App settings'
      : (error || 'GitHub authorization was cancelled or failed'));
    return res.redirect(
      `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(friendlyMsg)}`
    );
  }

  try {
    // Exchange authorization code for access token (server-to-server)
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Failed to obtain access token from GitHub:', tokenData);
      return res.redirect(
        `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(
          tokenData.error_description || 'Failed to exchange authorization code'
        )}`
      );
    }

    // Fetch user profile from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'HackForge-OS'
      }
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub user API returned ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Create secure server-side session
    const sessionId = crypto.randomUUID();
    serverSessions.set(sessionId, {
      token: tokenData.access_token,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        email: userData.email || null
      },
      createdAt: Date.now()
    });

    // Set secure HTTP-only cookie (token never sent to client!)
    res.cookie('hackforge_session_id', sessionId, {
      httpOnly: true,
      secure: false, // Set to true in HTTPS production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect(`${CLIENT_URL}/hackathons/eth-global-2026/team?github_auth=success`);
  } catch (err) {
    console.error('Exception in GitHub OAuth callback:', err);
    res.redirect(
      `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(
        err.message || 'Server error exchanging OAuth code'
      )}`
    );
  }
});

// OAuth Callback aliases (supporting varied developer callback configurations)
app.get('/api/github/callback', (req, res) => {
  const q = new URLSearchParams(req.query).toString();
  res.redirect(`/api/auth/github/callback?${q}`);
});

app.get('/api/auth/callback', (req, res) => {
  const q = new URLSearchParams(req.query).toString();
  res.redirect(`/api/auth/github/callback?${q}`);
});

// 4. Direct Secure Token Authentication (Developer fallback for instant local testing)
app.post('/api/auth/github/direct-token', async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'TOKEN_REQUIRED', message: 'A valid GitHub token is required.' });
  }

  try {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        'User-Agent': 'HackForge-OS'
      }
    });

    if (!userResponse.ok) {
      return res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'GitHub rejected this token. Please check token permissions.'
      });
    }

    const userData = await userResponse.json();
    const sessionId = crypto.randomUUID();

    serverSessions.set(sessionId, {
      token: token.trim(),
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        email: userData.email || null
      },
      createdAt: Date.now()
    });

    res.cookie('hackforge_session_id', sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url
      }
    });
  } catch (err) {
    console.error('Error validating direct token:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// 5. Disconnect GitHub / Logout
app.post('/api/auth/github/disconnect', (req, res) => {
  const sessionId = req.cookies?.hackforge_session_id;
  if (sessionId) {
    serverSessions.delete(sessionId);
  }
  res.clearCookie('hackforge_session_id');
  res.json({ success: true, message: 'Disconnected GitHub session.' });
});

app.post('/api/auth/github/logout', (req, res) => {
  const sessionId = req.cookies?.hackforge_session_id;
  if (sessionId) {
    serverSessions.delete(sessionId);
  }
  res.clearCookie('hackforge_session_id');
  res.json({ success: true, message: 'Logged out of GitHub session.' });
});

// =========================================================
// REPOSITORY & LIVE TELEMETRY ENDPOINTS
// =========================================================

// 6. List user repositories from GitHub
app.get('/api/github/repos', async (req, res) => {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'GitHub account is not connected.' });
  }

  try {
    const reposRes = await fetch(
      'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member',
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          'User-Agent': 'HackForge-OS'
        }
      }
    );

    if (!reposRes.ok) {
      throw new Error(`GitHub repos API returned ${reposRes.status}`);
    }

    const reposData = await reposRes.json();
    const formatted = reposData.map(r => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      owner: {
        login: r.owner.login,
        avatar_url: r.owner.avatar_url
      },
      html_url: r.html_url,
      description: r.description,
      default_branch: r.default_branch,
      private: r.private,
      created_at: r.created_at,
      updated_at: r.updated_at,
      pushed_at: r.pushed_at,
      stars: r.stargazers_count,
      language: r.language,
      forks: r.forks_count
    }));

    res.json({ success: true, repositories: formatted });
  } catch (err) {
    console.error('Error fetching GitHub repos:', err);
    res.status(500).json({ error: 'GITHUB_API_ERROR', message: err.message });
  }
});

// Helper: Normalize raw GitHub data into ProjectActivity schema
function normalizeGitHubActivities(projectId, commits = [], pulls = [], issues = [], branches = []) {
  const activities = [];

  // 1. Commits -> COMMIT
  commits.forEach(c => {
    const actorName = c.commit?.author?.name || c.author?.login || 'Anonymous Committer';
    const actorUsername = c.author?.login || actorName.toLowerCase().replace(/\s+/g, '-');
    const actorAvatar = c.author?.avatar_url || (c.author?.login ? `https://avatars.githubusercontent.com/${c.author.login}` : `https://github.com/identicons/${encodeURIComponent(actorUsername)}.png`);
    const message = c.commit?.message?.split('\n')[0] || 'Code modification';
    const shortSha = c.sha?.substring(0, 7) || 'commit';

    activities.push({
      id: `act-commit-${shortSha}`,
      project_id: projectId,
      type: 'COMMIT',
      actor: {
        name: actorName,
        username: actorUsername,
        avatar_url: actorAvatar
      },
      timestamp: c.commit?.author?.date || c.commit?.committer?.date || new Date().toISOString(),
      metadata: {
        hash: shortSha,
        full_hash: c.sha,
        message,
        url: c.html_url,
        additions: c.stats?.additions ?? 0,
        deletions: c.stats?.deletions ?? 0,
        changed_files: c.files?.length ?? 0
      },
      github_event_id: `gh-commit-${c.sha}`
    });
  });

  // 2. Pull Requests -> PULL_REQUEST
  pulls.forEach(pr => {
    const username = pr.user?.login || 'developer';
    const avatarUrl = pr.user?.avatar_url || `https://avatars.githubusercontent.com/${username}`;

    activities.push({
      id: `act-pr-${pr.number}`,
      project_id: projectId,
      type: 'PULL_REQUEST',
      actor: {
        name: pr.user?.login || 'Developer',
        username: username,
        avatar_url: avatarUrl
      },
      timestamp: pr.created_at,
      metadata: {
        number: pr.number,
        title: pr.title,
        state: pr.state,
        url: pr.html_url,
        branch: pr.head?.ref || 'feature',
        base: pr.base?.ref || 'main',
        is_merged: Boolean(pr.merged_at)
      },
      github_event_id: `gh-pr-${pr.id}`
    });
  });

  // 3. Issues -> ISSUE
  issues.forEach(issue => {
    if (issue.pull_request) return;
    const username = issue.user?.login || 'contributor';
    const avatarUrl = issue.user?.avatar_url || `https://avatars.githubusercontent.com/${username}`;

    activities.push({
      id: `act-issue-${issue.number}`,
      project_id: projectId,
      type: 'ISSUE',
      actor: {
        name: issue.user?.login || 'Contributor',
        username: username,
        avatar_url: avatarUrl
      },
      timestamp: issue.created_at,
      metadata: {
        number: issue.number,
        title: issue.title,
        state: issue.state,
        url: issue.html_url
      },
      github_event_id: `gh-issue-${issue.id}`
    });
  });

  // 4. Branches -> BRANCH
  branches.forEach(b => {
    if (b.name === 'main' || b.name === 'master') return;
    activities.push({
      id: `act-branch-${b.name}`,
      project_id: projectId,
      type: 'BRANCH',
      actor: {
        name: 'Git Branch',
        username: 'git-branch',
        avatar_url: `https://github.com/identicons/${encodeURIComponent(b.name)}.png`
      },
      timestamp: new Date().toISOString(),
      metadata: {
        branch: b.name,
        latest_sha: b.commit?.sha?.substring(0, 7)
      },
      github_event_id: `gh-branch-${b.name}`
    });
  });

  // Sort activities newest first
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return activities;
}

// 7. Associate Repository with Hackathon Project & Collect Live Telemetry
app.post('/api/github/associate', async (req, res) => {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'GitHub account is not connected.' });
  }

  const { owner, repo, projectId = 'team-hyperdrive' } = req.body;
  if (!owner || !repo) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'owner and repo are required.' });
  }

  try {
    const headers = {
      Authorization: `Bearer ${session.token}`,
      'User-Agent': 'HackForge-OS'
    };

    // 1. Fetch Repo Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      throw new Error(`Repository ${owner}/${repo} returned HTTP ${repoRes.status}`);
    }
    const repoData = await repoRes.json();

    // 2. Fetch Commits
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=35`, { headers });
    const commitsData = commitsRes.ok ? await commitsRes.json() : [];

    // 3. Fetch Pull Requests
    const pullsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=20`, { headers });
    const pullsData = pullsRes.ok ? await pullsRes.json() : [];

    // 4. Fetch Issues
    const issuesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=20`, { headers });
    const issuesData = issuesRes.ok ? await issuesRes.json() : [];

    // 5. Fetch Branches
    const branchesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, { headers });
    const branchesData = branchesRes.ok ? await branchesRes.json() : [];

    // Format Repository metadata
    const repoMeta = {
      name: repoData.name,
      full_name: repoData.full_name,
      html_url: repoData.html_url,
      owner: repoData.owner.login,
      owner_avatar: repoData.owner.avatar_url,
      default_branch: repoData.default_branch,
      created_at: repoData.created_at,
      pushed_at: repoData.pushed_at,
      commits_count: Array.isArray(commitsData) ? commitsData.length : 0,
      open_issues: repoData.open_issues_count,
      branches: Array.isArray(branchesData) ? branchesData.map(b => b.name) : [repoData.default_branch],
      synced_at: new Date().toISOString()
    };

    // Normalize activities
    const activities = normalizeGitHubActivities(
      projectId,
      Array.isArray(commitsData) ? commitsData : [],
      Array.isArray(pullsData) ? pullsData : [],
      Array.isArray(issuesData) ? issuesData : [],
      Array.isArray(branchesData) ? branchesData : []
    );

    // Save in project store
    projectDataStore.set(projectId, {
      repoMeta,
      activities
    });

    res.json({
      success: true,
      repository: repoMeta,
      activities
    });
  } catch (err) {
    console.error('Error associating GitHub repository:', err);
    res.status(500).json({ error: 'ASSOCIATION_ERROR', message: err.message });
  }
});

// 8. Fetch real-time normalized timeline for a project
app.get('/api/github/timeline/:projectId', (req, res) => {
  const { projectId } = req.params;
  const projectData = projectDataStore.get(projectId);

  if (!projectData) {
    return res.json({
      success: true,
      associated: false,
      repository: null,
      activities: []
    });
  }

  res.json({
    success: true,
    associated: true,
    repository: projectData.repoMeta,
    activities: projectData.activities
  });
});

// 9. Sync Telemetry On-Demand
app.post('/api/github/sync/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const session = getSession(req);

  const projectData = projectDataStore.get(projectId);
  if (!projectData || !projectData.repoMeta) {
    return res.status(404).json({ error: 'PROJECT_NOT_ASSOCIATED', message: 'No repository associated with this project.' });
  }

  if (!session) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'GitHub account is not connected.' });
  }

  try {
    const { owner, name } = projectData.repoMeta;
    const headers = {
      Authorization: `Bearer ${session.token}`,
      'User-Agent': 'HackForge-OS'
    };

    // Re-fetch commits and PRs
    const [commitsRes, pullsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${name}/commits?per_page=35`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${name}/pulls?state=all&per_page=20`, { headers })
    ]);

    const commitsData = commitsRes.ok ? await commitsRes.json() : [];
    const pullsData = pullsRes.ok ? await pullsRes.json() : [];

    const updatedActivities = normalizeGitHubActivities(
      projectId,
      Array.isArray(commitsData) ? commitsData : [],
      Array.isArray(pullsData) ? pullsData : [],
      [],
      []
    );

    projectData.activities = updatedActivities;
    projectData.repoMeta.synced_at = new Date().toISOString();
    projectData.repoMeta.commits_count = Array.isArray(commitsData) ? commitsData.length : projectData.repoMeta.commits_count;

    projectDataStore.set(projectId, projectData);

    res.json({
      success: true,
      repository: projectData.repoMeta,
      activities: updatedActivities
    });
  } catch (err) {
    console.error('Error syncing telemetry:', err);
    res.status(500).json({ error: 'SYNC_ERROR', message: err.message });
  }
});

// 10. TinyFish Live Web Research API Routes
app.use('/api/tinyfish', createTinyFishRouter());

// 11. GitHub App Integration Routes & Webhook Listener
const githubAppRouter = createGitHubAppRouter(projectDataStore);
app.use('/api/github/app', githubAppRouter);
app.post('/api/github/webhook', (req, res, next) => {
  req.url = '/webhook';
  githubAppRouter(req, res, next);
});

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ HackForge Secure GitHub Backend running on http://localhost:${PORT}`);
  console.log(`🔒 Client Origin: ${CLIENT_URL}`);
  console.log(`🔑 GitHub OAuth configured: ${Boolean(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET)}`);
  console.log(`🤖 GitHub App configured: ${Boolean(process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY)}`);
  console.log(`🐟 TinyFish Live Research configured: ${Boolean(process.env.TINYFISH_API_KEY && process.env.TINYFISH_API_KEY.trim())}`);
});
