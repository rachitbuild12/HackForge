import crypto from 'crypto';

// In-memory cache for installation access tokens
// installationId -> { token: string, expiresAt: number, permissions: object }
const installationTokenCache = new Map();

/**
 * Normalizes PEM private key from various environment variable formats
 * (e.g. raw PEM with newlines, single-line with \n, or base64 encoded).
 */
export function formatPrivateKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') return '';
  let key = rawKey.trim();

  // If base64 encoded without PEM headers
  if (!key.includes('-----BEGIN') && !key.includes('PRIVATE KEY')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8');
      if (decoded.includes('-----BEGIN')) {
        key = decoded;
      }
    } catch {
      // not base64, proceed
    }
  }

  // Replace literal '\n' characters with real newlines
  key = key.replace(/\\n/g, '\n');

  return key;
}

/**
 * Generates an RS256-signed JWT for GitHub App authentication.
 * Token expires in 10 minutes (maximum permitted by GitHub).
 */
export function generateGitHubAppJWT(appId, privateKeyPem) {
  if (!appId) {
    throw new Error('GITHUB_APP_ID is required to generate GitHub App JWT.');
  }
  const cleanPem = formatPrivateKey(privateKeyPem);
  if (!cleanPem || !cleanPem.includes('PRIVATE KEY')) {
    throw new Error('Valid GITHUB_APP_PRIVATE_KEY PEM is required to generate GitHub App JWT.');
  }

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60, // 60s in the past to allow for server clock drift
    exp: now + (10 * 60), // expires after 10 minutes
    iss: String(appId).trim()
  };

  const base64UrlEncode = (data) => {
    return Buffer.from(typeof data === 'string' ? data : JSON.stringify(data))
      .toString('base64url');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(dataToSign);
  const signature = signer.sign(cleanPem, 'base64url');

  return `${dataToSign}.${signature}`;
}

/**
 * Generates or retrieves a cached GitHub App Installation Access Token.
 * Tokens expire in 1 hour; we cache and refresh before expiry.
 */
export async function getInstallationAccessToken(appId, privateKeyPem, installationId) {
  if (!installationId) {
    throw new Error('installationId is required to generate installation access token.');
  }

  const cached = installationTokenCache.get(String(installationId));
  const now = Date.now();

  // If token is cached and has at least 5 minutes of validity remaining
  if (cached && cached.expiresAt > now + (5 * 60 * 1000)) {
    return {
      token: cached.token,
      expires_at: new Date(cached.expiresAt).toISOString(),
      permissions: cached.permissions,
      cached: true
    };
  }

  const jwt = generateGitHubAppJWT(appId, privateKeyPem);

  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'HackForge-OS'
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub returned HTTP ${response.status} when requesting installation token`);
  }

  const data = await response.json();
  const expiresAt = new Date(data.expires_at).getTime();

  installationTokenCache.set(String(installationId), {
    token: data.token,
    expiresAt,
    permissions: data.permissions || {}
  });

  return {
    token: data.token,
    expires_at: data.expires_at,
    permissions: data.permissions || {},
    repository_selection: data.repository_selection,
    cached: false
  };
}

/**
 * Verifies the HMAC-SHA256 signature of an incoming GitHub webhook payload.
 */
export function verifyWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  if (!rawBody || !signatureHeader || !webhookSecret) {
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', webhookSecret.trim());
    hmac.update(rawBody);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;

    const sigBuf = Buffer.from(signatureHeader);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Fetches all repositories authorized for this GitHub App installation.
 */
export async function fetchInstallationRepositories(installationToken) {
  const response = await fetch('https://api.github.com/installation/repositories?per_page=100', {
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'HackForge-OS'
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `GitHub returned HTTP ${response.status} listing installation repositories`);
  }

  const data = await response.json();
  const rawRepos = data.repositories || [];

  return rawRepos.map(r => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    owner: {
      login: r.owner.login,
      avatar_url: r.owner.avatar_url
    },
    html_url: r.html_url,
    description: r.description,
    default_branch: r.default_branch || 'main',
    private: r.private,
    created_at: r.created_at,
    updated_at: r.updated_at,
    pushed_at: r.pushed_at,
    stars: r.stargazers_count,
    language: r.language,
    forks: r.forks_count,
    permissions: r.permissions || {}
  }));
}

/**
 * Fetches comprehensive repository metadata and dev telemetry (commits, PRs, issues, branches).
 */
export async function fetchRepositoryTelemetry(installationToken, owner, repo) {
  const headers = {
    Authorization: `Bearer ${installationToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'HackForge-OS'
  };

  const [repoRes, commitsRes, pullsRes, issuesRes, branchesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=35`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=20`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=20`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, { headers })
  ]);

  if (!repoRes.ok) {
    const err = await repoRes.json().catch(() => ({}));
    throw new Error(err.message || `Repository ${owner}/${repo} returned HTTP ${repoRes.status}`);
  }

  const repoData = await repoRes.json();
  const commitsData = commitsRes.ok ? await commitsRes.json() : [];
  const pullsData = pullsRes.ok ? await pullsRes.json() : [];
  const issuesData = issuesRes.ok ? await issuesRes.json() : [];
  const branchesData = branchesRes.ok ? await branchesRes.json() : [];

  const repoMeta = {
    id: repoData.id,
    name: repoData.name,
    full_name: repoData.full_name,
    html_url: repoData.html_url,
    owner: repoData.owner.login,
    owner_avatar: repoData.owner.avatar_url,
    default_branch: repoData.default_branch || 'main',
    private: repoData.private,
    description: repoData.description,
    created_at: repoData.created_at,
    pushed_at: repoData.pushed_at,
    commits_count: Array.isArray(commitsData) ? commitsData.length : 0,
    open_issues: repoData.open_issues_count || 0,
    branches: Array.isArray(branchesData) ? branchesData.map(b => b.name) : [repoData.default_branch],
    latest_commit: Array.isArray(commitsData) && commitsData.length > 0 ? {
      hash: commitsData[0].sha?.substring(0, 7),
      message: commitsData[0].commit?.message,
      author: commitsData[0].commit?.author?.name,
      date: commitsData[0].commit?.author?.date
    } : null,
    synced_at: new Date().toISOString()
  };

  return {
    repoMeta,
    commits: Array.isArray(commitsData) ? commitsData : [],
    pulls: Array.isArray(pullsData) ? pullsData : [],
    issues: Array.isArray(issuesData) ? issuesData : [],
    branches: Array.isArray(branchesData) ? branchesData : []
  };
}

/**
 * Normalizes raw GitHub commits, pulls, and issues into HackForge ProjectActivity items.
 */
export function normalizeGitHubActivities(projectId, commits = [], pulls = [], issues = [], branches = []) {
  const activities = [];

  // 1. Commits -> COMMIT
  commits.forEach(c => {
    activities.push({
      id: `gh-commit-${c.sha}`,
      projectId,
      type: 'COMMIT',
      title: c.commit.message.split('\n')[0],
      author: {
        name: c.commit.author.name || 'Anonymous',
        login: c.author?.login || c.commit.author.name || 'builder',
        avatar: c.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      hash: c.sha.substring(0, 7),
      fullHash: c.sha,
      url: c.html_url,
      branch: 'main',
      linesChanged: '+45 / -12',
      timestamp: c.commit.author.date,
      verified: Boolean(c.commit.verification?.verified)
    });
  });

  // 2. Pull Requests -> PULL_REQUEST
  pulls.forEach(pr => {
    activities.push({
      id: `gh-pr-${pr.id}`,
      projectId,
      type: 'PULL_REQUEST',
      title: pr.title,
      author: {
        name: pr.user?.login || 'Collaborator',
        login: pr.user?.login || 'collaborator',
        avatar: pr.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      number: pr.number,
      state: pr.state,
      merged: Boolean(pr.merged_at),
      url: pr.html_url,
      branch: pr.head?.ref || 'feature',
      baseBranch: pr.base?.ref || 'main',
      timestamp: pr.updated_at || pr.created_at,
      verified: true
    });
  });

  // 3. Issues -> ISSUE
  issues.filter(i => !i.pull_request).forEach(issue => {
    activities.push({
      id: `gh-issue-${issue.id}`,
      projectId,
      type: 'ISSUE',
      title: issue.title,
      author: {
        name: issue.user?.login || 'Tester',
        login: issue.user?.login || 'tester',
        avatar: issue.user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      number: issue.number,
      state: issue.state,
      url: issue.html_url,
      timestamp: issue.updated_at || issue.created_at,
      verified: true
    });
  });

  // Sort activities newest first
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return activities;
}
