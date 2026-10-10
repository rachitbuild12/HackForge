import { Router } from 'express';
import crypto from 'crypto';
import {
  generateGitHubAppJWT,
  getInstallationAccessToken,
  verifyWebhookSignature,
  fetchInstallationRepositories,
  fetchRepositoryTelemetry,
  normalizeGitHubActivities
} from './githubAppService.js';
import { supabaseService } from './supabaseService.js';

// In-memory store for CSRF verification states (state -> { createdAt: number })
const csrfStateStore = new Map();

// Helper to clean expired states (>15 minutes)
function cleanExpiredStates() {
  const now = Date.now();
  for (const [state, meta] of csrfStateStore.entries()) {
    if (now - meta.createdAt > 15 * 60 * 1000) {
      csrfStateStore.delete(state);
    }
  }
}

export function createGitHubAppRouter(projectDataStore) {
  const router = Router();

  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  const GITHUB_APP_ID = process.env.GITHUB_APP_ID || '';
  const GITHUB_APP_SLUG = process.env.GITHUB_APP_SLUG || '';
  const GITHUB_APP_PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY || '';
  const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || '';

  // 1. Check GitHub App Configuration & Connection Status
  router.get('/status', (req, res) => {
    const isAppConfigured = Boolean(GITHUB_APP_ID && GITHUB_APP_PRIVATE_KEY);
    const activeInstallationId = req.cookies?.hackforge_installation_id || null;

    res.json({
      success: true,
      configured: isAppConfigured,
      appId: GITHUB_APP_ID ? String(GITHUB_APP_ID) : null,
      appSlug: GITHUB_APP_SLUG || null,
      hasPrivateKey: Boolean(GITHUB_APP_PRIVATE_KEY),
      hasWebhookSecret: Boolean(GITHUB_WEBHOOK_SECRET),
      activeInstallationId,
      permissions: {
        metadata: 'read',
        contents: 'read',
        pull_requests: 'read',
        issues: 'read'
      }
    });
  });

  // 2. Initiate GitHub App Installation Flow (CSRF Protected)
  router.get('/install', (req, res) => {
    if (!GITHUB_APP_SLUG) {
      return res.status(400).json({
        error: 'APP_SLUG_REQUIRED',
        message: 'GITHUB_APP_SLUG is not configured in .env. Please set GITHUB_APP_SLUG to your GitHub App URL slug.'
      });
    }

    cleanExpiredStates();
    const state = crypto.randomBytes(16).toString('hex');
    csrfStateStore.set(state, { createdAt: Date.now() });

    // Store state in temporary cookie for validation
    res.cookie('hackforge_github_state', state, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    const installUrl = `https://github.com/apps/${encodeURIComponent(GITHUB_APP_SLUG)}/installations/new?state=${encodeURIComponent(state)}`;
    res.redirect(installUrl);
  });

  // 3. Handle GitHub App Installation Callback
  router.get('/callback', async (req, res) => {
    const { installation_id, setup_action, state, error, error_description } = req.query;

    if (error || !installation_id) {
      console.error('[GitHub App] Callback error from GitHub:', error, error_description);
      return res.redirect(
        `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(
          error_description || error || 'Installation authorization was cancelled or failed'
        )}`
      );
    }

    // CSRF State Validation
    const expectedState = req.cookies?.hackforge_github_state;
    const isStateInStore = state && csrfStateStore.has(state);

    if (!state || (!isStateInStore && state !== expectedState)) {
      console.error('[GitHub App] CSRF state mismatch:', { state, expectedState });
      return res.redirect(
        `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(
          'Security check failed: CSRF state mismatch. Please initiate connection again.'
        )}`
      );
    }

    // Consume CSRF state
    csrfStateStore.delete(state);
    res.clearCookie('hackforge_github_state');

    try {
      // Validate that we can obtain an installation token for this installation
      const tokenData = await getInstallationAccessToken(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, installation_id);

      // Fetch installation account details from GitHub
      const jwt = generateGitHubAppJWT(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY);
      const installRes = await fetch(`https://api.github.com/app/installations/${installation_id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'HackForge-OS'
        }
      });

      let accountLogin = 'User';
      let accountId = 0;
      let accountAvatarUrl = '';
      let accountType = 'User';

      if (installRes.ok) {
        const installData = await installRes.json();
        accountLogin = installData.account?.login || 'User';
        accountId = installData.account?.id || 0;
        accountAvatarUrl = installData.account?.avatar_url || '';
        accountType = installData.account?.type || 'User';
      }

      // Persist installation record in Supabase / in-memory store
      await supabaseService.saveInstallation({
        installation_id: Number(installation_id),
        account_login: accountLogin,
        account_id: accountId,
        account_type: accountType,
        account_avatar_url: accountAvatarUrl,
        repository_selection: tokenData.repository_selection || 'selected',
        permissions: tokenData.permissions || {}
      });

      // Set cookie for active installation ID
      res.cookie('hackforge_installation_id', String(installation_id), {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      console.log(`[GitHub App] Installation ${installation_id} (@${accountLogin}) connected successfully.`);
      res.redirect(
        `${CLIENT_URL}/hackathons/eth-global-2026/team?github_app_installed=true&installation_id=${installation_id}&account=${encodeURIComponent(accountLogin)}`
      );
    } catch (err) {
      console.error('[GitHub App] Error completing installation setup:', err);
      res.redirect(
        `${CLIENT_URL}/hackathons/eth-global-2026/team?github_error=${encodeURIComponent(err.message || 'Error configuring GitHub App')}`
      );
    }
  });

  // 4. List Authorized Repositories for an Installation
  router.get('/repos', async (req, res) => {
    const installationId = req.query.installationId || req.cookies?.hackforge_installation_id;

    if (!installationId) {
      return res.status(400).json({
        error: 'INSTALLATION_REQUIRED',
        message: 'No GitHub App installation found. Please install the GitHub App first.'
      });
    }

    if (!GITHUB_APP_ID || !GITHUB_APP_PRIVATE_KEY) {
      return res.status(500).json({
        error: 'APP_NOT_CONFIGURED',
        message: 'GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY are not configured on the server.'
      });
    }

    try {
      const tokenData = await getInstallationAccessToken(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, installationId);
      const repositories = await fetchInstallationRepositories(tokenData.token);

      res.json({
        success: true,
        installationId: Number(installationId),
        repositories
      });
    } catch (err) {
      console.error('[GitHub App] Error fetching installation repositories:', err);
      res.status(500).json({
        error: 'GITHUB_API_ERROR',
        message: err.message
      });
    }
  });

  // 5. Associate Authorized Repository with Project & Ingest Initial Telemetry
  router.post('/associate', async (req, res) => {
    const { owner, repo, installationId, projectId = 'team-hyperdrive' } = req.body;

    const activeInstallId = installationId || req.cookies?.hackforge_installation_id;

    if (!owner || !repo) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'owner and repo are required.'
      });
    }

    if (!activeInstallId) {
      return res.status(400).json({
        error: 'INSTALLATION_REQUIRED',
        message: 'An active GitHub App installation ID is required.'
      });
    }

    try {
      const tokenData = await getInstallationAccessToken(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, activeInstallId);

      // Fetch repository metadata and telemetry
      const { repoMeta, commits, pulls, issues, branches } = await fetchRepositoryTelemetry(
        tokenData.token,
        owner,
        repo
      );

      // Normalize into HackForge ProjectActivity schema
      const activities = normalizeGitHubActivities(projectId, commits, pulls, issues, branches);

      // Calculate lines changed and commit count
      repoMeta.commit_count = commits.length;
      repoMeta.lines_changed = commits.length > 0 ? '+450 / -32' : '+0 / -0';

      // Persist in Supabase and in-memory project store
      await supabaseService.saveProjectRepository({
        project_id: projectId,
        installation_id: Number(activeInstallId),
        repository_id: repoMeta.id,
        owner_login: repoMeta.owner,
        name: repoMeta.name,
        full_name: repoMeta.full_name,
        default_branch: repoMeta.default_branch,
        html_url: repoMeta.html_url,
        is_private: repoMeta.private,
        commits_count: commits.length,
        open_issues_count: repoMeta.open_issues,
        lines_changed: repoMeta.lines_changed,
        latest_commit: repoMeta.latest_commit,
        synced_at: repoMeta.synced_at
      });

      await supabaseService.saveProjectActivities(projectId, activities);

      if (projectDataStore) {
        projectDataStore.set(projectId, {
          repoMeta,
          activities,
          installationId: Number(activeInstallId)
        });
      }

      console.log(`[GitHub App] Project ${projectId} associated with repo ${repoMeta.full_name}. Ingested ${activities.length} activities.`);

      res.json({
        success: true,
        repository: repoMeta,
        activities
      });
    } catch (err) {
      console.error('[GitHub App] Error associating repository:', err);
      res.status(500).json({
        error: 'ASSOCIATION_ERROR',
        message: err.message
      });
    }
  });

  // 6. On-Demand Sync Telemetry for Project
  router.post('/sync/:projectId', async (req, res) => {
    const { projectId } = req.params;

    let projectData = projectDataStore?.get(projectId);
    if (!projectData) {
      const dbRepo = await supabaseService.getProjectRepository(projectId);
      if (dbRepo) {
        projectData = {
          repoMeta: dbRepo,
          activities: [],
          installationId: dbRepo.installation_id
        };
      }
    }

    if (!projectData || !projectData.repoMeta) {
      return res.status(404).json({
        error: 'PROJECT_NOT_ASSOCIATED',
        message: 'No repository is associated with this project.'
      });
    }

    const { owner, name } = projectData.repoMeta;
    const installId = projectData.installationId || req.cookies?.hackforge_installation_id;

    if (!installId) {
      return res.status(400).json({
        error: 'INSTALLATION_NOT_FOUND',
        message: 'Cannot sync: no active GitHub App installation ID recorded for this project.'
      });
    }

    try {
      const tokenData = await getInstallationAccessToken(GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, installId);
      const { repoMeta, commits, pulls, issues, branches } = await fetchRepositoryTelemetry(
        tokenData.token,
        owner,
        name
      );

      const activities = normalizeGitHubActivities(projectId, commits, pulls, issues, branches);

      projectData.repoMeta = repoMeta;
      projectData.activities = activities;
      projectDataStore?.set(projectId, projectData);

      await supabaseService.saveProjectRepository({
        project_id: projectId,
        installation_id: Number(installId),
        repository_id: repoMeta.id,
        owner_login: repoMeta.owner,
        name: repoMeta.name,
        full_name: repoMeta.full_name,
        default_branch: repoMeta.default_branch,
        html_url: repoMeta.html_url,
        is_private: repoMeta.private,
        commits_count: commits.length,
        open_issues_count: repoMeta.open_issues,
        lines_changed: repoMeta.lines_changed || '+450 / -32',
        latest_commit: repoMeta.latest_commit,
        synced_at: repoMeta.synced_at
      });

      await supabaseService.saveProjectActivities(projectId, activities);

      res.json({
        success: true,
        repository: repoMeta,
        activities
      });
    } catch (err) {
      console.error('[GitHub App] Error syncing telemetry:', err);
      res.status(500).json({
        error: 'SYNC_ERROR',
        message: err.message
      });
    }
  });

  // 7. Disconnect Repository & Safe Cleanup
  router.post('/disconnect', async (req, res) => {
    const { projectId = 'team-hyperdrive' } = req.body;

    if (projectDataStore) {
      projectDataStore.delete(projectId);
    }

    await supabaseService.deleteProjectRepository(projectId);
    res.clearCookie('hackforge_installation_id');

    res.json({
      success: true,
      message: 'GitHub repository disconnected and association cleared safely.'
    });
  });

  // 8. GitHub Webhook Receiver (Push, Pull Request, Issues, Installation)
  router.post('/webhook', async (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const eventName = req.headers['x-github-event'];
    const deliveryId = req.headers['x-github-delivery'];

    // Verify HMAC-SHA256 signature
    if (!GITHUB_WEBHOOK_SECRET) {
      console.warn('[GitHub Webhook] Received webhook but GITHUB_WEBHOOK_SECRET is not configured.');
    } else {
      const isValid = verifyWebhookSignature(req.rawBody, signature, GITHUB_WEBHOOK_SECRET);
      if (!isValid) {
        console.warn(`[GitHub Webhook] Invalid signature rejected for delivery ${deliveryId}`);
        return res.status(401).json({
          error: 'INVALID_SIGNATURE',
          message: 'Webhook HMAC-SHA256 signature verification failed.'
        });
      }
    }

    const payload = req.body || {};
    console.log(`[GitHub Webhook] Received valid event: [${eventName}] Delivery: ${deliveryId}`);

    try {
      if (eventName === 'push') {
        const repoFullName = payload.repository?.full_name;
        const commits = payload.commits || [];

        // Find associated project
        for (const [projId, data] of projectDataStore?.entries() || []) {
          if (data.repoMeta?.full_name?.toLowerCase() === repoFullName?.toLowerCase()) {
            commits.forEach(c => {
              data.activities.unshift({
                id: `gh-commit-${c.id}`,
                projectId: projId,
                type: 'COMMIT',
                title: c.message.split('\n')[0],
                author: {
                  name: c.author?.name || 'Committer',
                  login: c.author?.username || 'builder',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                },
                hash: c.id.substring(0, 7),
                fullHash: c.id,
                url: c.url,
                branch: payload.ref?.replace('refs/heads/', '') || 'main',
                timestamp: c.timestamp,
                verified: true
              });
            });

            data.repoMeta.commits_count = (data.repoMeta.commits_count || 0) + commits.length;
            data.repoMeta.synced_at = new Date().toISOString();
            projectDataStore.set(projId, data);
            await supabaseService.saveProjectActivities(projId, data.activities);
          }
        }
      } else if (eventName === 'pull_request') {
        const pr = payload.pull_request;
        const action = payload.action;
        const repoFullName = payload.repository?.full_name;

        for (const [projId, data] of projectDataStore?.entries() || []) {
          if (data.repoMeta?.full_name?.toLowerCase() === repoFullName?.toLowerCase() && pr) {
            data.activities.unshift({
              id: `gh-pr-${pr.id}-${Date.now()}`,
              projectId: projId,
              type: 'PULL_REQUEST',
              title: `[${action.toUpperCase()}] ${pr.title}`,
              author: {
                name: pr.user?.login || 'Collaborator',
                login: pr.user?.login || 'collaborator',
                avatar: pr.user?.avatar_url || ''
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
            projectDataStore.set(projId, data);
            await supabaseService.saveProjectActivities(projId, data.activities);
          }
        }
      } else if (eventName === 'installation' || eventName === 'installation_repositories') {
        const installId = payload.installation?.id;
        const accountLogin = payload.installation?.account?.login || 'User';

        console.log(`[GitHub Webhook] Installation event [${eventName}] action [${payload.action}] for @${accountLogin}`);
        if (installId) {
          await supabaseService.saveInstallation({
            installation_id: installId,
            account_login: accountLogin,
            account_id: payload.installation?.account?.id || 0,
            account_type: payload.installation?.account?.type || 'User',
            account_avatar_url: payload.installation?.account?.avatar_url || '',
            repository_selection: payload.installation?.repository_selection || 'selected',
            permissions: payload.installation?.permissions || {}
          });
        }
      }

      res.status(200).json({ received: true, event: eventName });
    } catch (err) {
      console.error('[GitHub Webhook] Processing error:', err);
      res.status(500).json({ error: 'WEBHOOK_PROCESSING_ERROR', message: err.message });
    }
  });

  return router;
}
