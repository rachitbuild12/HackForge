import { Router } from 'express';
import { validateTargetUrl, validateResearchGoal, TINYFISH_ENDPOINTS } from './tinyfishService.js';

export function createTinyFishRouter() {
  const router = Router();
  let activeResearchStreams = 0;
  const MAX_CONCURRENT_RESEARCH = 5;

  // 1. Status & Configuration Check
  router.get('/status', (req, res) => {
    const apiKey = process.env.TINYFISH_API_KEY;
    const isConfigured = Boolean(apiKey && apiKey.trim().length > 0);

    return res.json({
      configured: isConfigured,
      provider: 'TinyFish Web Agent',
      endpoints: {
        agentSse: TINYFISH_ENDPOINTS.AGENT_SSE,
        search: TINYFISH_ENDPOINTS.SEARCH,
        fetch: TINYFISH_ENDPOINTS.FETCH
      },
      activeStreams: activeResearchStreams,
      version: '1.0.0'
    });
  });

  // 2. Live Web Research (SSE Streaming via Agent API)
  router.post('/research', async (req, res) => {
    const apiKey = process.env.TINYFISH_API_KEY;

    // A. Validate API Key presence
    if (!apiKey || !apiKey.trim()) {
      return res.status(500).json({
        error: 'MISSING_API_KEY',
        message: 'TINYFISH_API_KEY is not configured on the HackForge server. Please add TINYFISH_API_KEY to your .env file and restart the server.'
      });
    }

    // B. Concurrency check
    if (activeResearchStreams >= MAX_CONCURRENT_RESEARCH) {
      return res.status(429).json({
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many concurrent research tasks running. Please wait for an active task to finish.'
      });
    }

    const { url, goal, mode = 'agent', browser_profile = 'lite', agent_config = {} } = req.body || {};

    // C. Validate Target URL
    const urlValidation = validateTargetUrl(url);
    if (!urlValidation.valid) {
      return res.status(400).json({
        error: 'INVALID_URL',
        message: urlValidation.error
      });
    }

    // D. Validate Research Goal
    const goalValidation = validateResearchGoal(goal);
    if (!goalValidation.valid) {
      return res.status(400).json({
        error: 'INVALID_GOAL',
        message: goalValidation.error
      });
    }

    // E. Handle Search Mode (TinyFish Search API)
    if (mode === 'search') {
      try {
        const searchUrl = `${TINYFISH_ENDPOINTS.SEARCH}?query=${encodeURIComponent(goalValidation.sanitizedGoal)}&limit=5`;
        const response = await fetch(searchUrl, {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey.trim(),
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return res.status(response.status).json({
            error: errData.error?.code || 'UPSTREAM_SEARCH_ERROR',
            message: errData.error?.message || `TinyFish Search API responded with status ${response.status}`,
            details: errData
          });
        }

        const data = await response.json();
        return res.json({
          mode: 'search',
          results: data
        });
      } catch (err) {
        console.error('TinyFish Search API error:', err);
        return res.status(502).json({
          error: 'SEARCH_NETWORK_ERROR',
          message: `Network error connecting to TinyFish Search API: ${err.message}`
        });
      }
    }

    // F. Handle Fetch Mode (TinyFish Fetch API)
    if (mode === 'fetch') {
      try {
        const response = await fetch(TINYFISH_ENDPOINTS.FETCH, {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey.trim(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            urls: [urlValidation.sanitizedUrl],
            format: 'markdown'
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return res.status(response.status).json({
            error: errData.error?.code || 'UPSTREAM_FETCH_ERROR',
            message: errData.error?.message || `TinyFish Fetch API responded with status ${response.status}`,
            details: errData
          });
        }

        const data = await response.json();
        return res.json({
          mode: 'fetch',
          results: data
        });
      } catch (err) {
        console.error('TinyFish Fetch API error:', err);
        return res.status(502).json({
          error: 'FETCH_NETWORK_ERROR',
          message: `Network error connecting to TinyFish Fetch API: ${err.message}`
        });
      }
    }

    // G. Primary Mode: Agent API with Server-Sent Events (SSE)
    const payload = {
      url: urlValidation.sanitizedUrl,
      goal: goalValidation.sanitizedGoal,
      browser_profile: browser_profile === 'stealth' ? 'stealth' : 'lite'
    };

    // Include agent_config if requested and avoid beta-only custom max_steps
    if (agent_config && (agent_config.mode || agent_config.cursor_style)) {
      payload.agent_config = {
        mode: agent_config.mode === 'strict' ? 'strict' : 'default',
        cursor_style: 'standard'
      };
    }

    const abortController = new AbortController();
    activeResearchStreams++;

    // Client connection lifecycle: abort only if the response is closed prematurely
    res.on('close', () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    });

    try {
      console.log(`[TinyFish] Dispatching research run -> ${payload.url}`);

      const upstreamRes = await fetch(TINYFISH_ENDPOINTS.AGENT_SSE, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      if (!upstreamRes.ok) {
        activeResearchStreams = Math.max(0, activeResearchStreams - 1);
        const errJson = await upstreamRes.json().catch(() => ({}));
        const errCode = errJson.error?.code || 'UPSTREAM_ERROR';
        const errMsg = errJson.error?.message || `TinyFish Agent API returned status ${upstreamRes.status} (${upstreamRes.statusText})`;
        
        console.error(`[TinyFish] Upstream error (${upstreamRes.status}):`, errMsg);

        return res.status(upstreamRes.status).json({
          error: errCode,
          message: errMsg,
          details: errJson
        });
      }

      // Set headers for live SSE streaming to the frontend
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      if (res.flushHeaders) res.flushHeaders();

      const reader = upstreamRes.body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } catch (streamErr) {
        if (streamErr.name !== 'AbortError') {
          console.error('[TinyFish] Stream transmission error:', streamErr);
          const errorEvent = {
            type: 'COMPLETE',
            status: 'FAILED',
            error: streamErr.message,
            timestamp: new Date().toISOString()
          };
          res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
        }
      } finally {
        activeResearchStreams = Math.max(0, activeResearchStreams - 1);
        res.end();
      }
    } catch (err) {
      activeResearchStreams = Math.max(0, activeResearchStreams - 1);
      if (err.name === 'AbortError') {
        console.log('[TinyFish] Research stream aborted by client.');
        return;
      }

      console.error('[TinyFish] Connection failure:', err);
      if (!res.headersSent) {
        return res.status(502).json({
          error: 'NETWORK_FAILURE',
          message: `Failed to connect to TinyFish Agent API: ${err.message}`
        });
      } else {
        const errorEvent = {
          type: 'COMPLETE',
          status: 'FAILED',
          error: err.message,
          timestamp: new Date().toISOString()
        };
        res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
        res.end();
      }
    }
  });

  return router;
}
