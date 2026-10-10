import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Search,
  Compass,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  StopCircle,
  Terminal,
  ShieldCheck,
  ChevronRight,
  BookmarkPlus,
  BookOpen,
  ArrowRight,
  Layers,
  HelpCircle,
  Clock,
  Eye,
  Check,
  Cpu
} from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';

export default function TinyFishResearchPanel({ defaultUrl = '', defaultGoal = '', onQuestCreated }) {
  const { team, addQuest, showToast } = useHackForge();

  // Configuration & status state
  const [serverStatus, setServerStatus] = useState({ configured: false, loading: true });
  
  // Form inputs
  const [targetUrl, setTargetUrl] = useState(defaultUrl || 'https://docs.github.com/en/rest');
  const [researchGoal, setResearchGoal] = useState(
    defaultGoal ||
      'Explore official GitHub REST API documentation for commits, pulls, and issues. Summarize required parameters, authentication headers, and key endpoints for a hackathon tracking dashboard.'
  );
  const [researchMode, setResearchMode] = useState('agent'); // 'agent' | 'search' | 'fetch'
  const [browserProfile, setBrowserProfile] = useState('lite'); // 'lite' | 'stealth'
  
  // Streaming execution state
  const [isRunning, setIsRunning] = useState(false);
  const [runId, setRunId] = useState(null);
  const [streamingUrl, setStreamingUrl] = useState(null);
  const [events, setEvents] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [questConverted, setQuestConverted] = useState(false);

  const abortControllerRef = useRef(null);
  const eventsEndRef = useRef(null);

  // Check server-side TinyFish configuration on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/tinyfish/status');
        const data = await res.json();
        setServerStatus({
          configured: Boolean(data.configured),
          loading: false,
          endpoints: data.endpoints
        });
      } catch (err) {
        setServerStatus({
          configured: false,
          loading: false,
          error: err.message
        });
      }
    }
    checkStatus();
  }, []);

  // Auto-scroll timeline to newest event
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  // Curated Hackathon Research Presets
  const presets = [
    {
      id: 'tech-docs',
      label: 'Technical Documentation',
      icon: BookOpen,
      url: 'https://docs.github.com/en/rest',
      mode: 'agent',
      goal: 'Explore the official GitHub REST API documentation. Identify documented endpoints for repository commits, pull requests, and issues. Summarize headers, rate limits, and implementation details for a hackathon development-tracking platform.'
    },
    {
      id: 'competitor',
      label: 'Competitor Research',
      icon: Compass,
      url: 'https://devpost.com',
      mode: 'agent',
      goal: 'Investigate publicly accessible hackathon submission formats, team showcases, and judging mechanics. Summarize key product features and compare with HackForge automated Build Passport architecture.'
    },
    {
      id: 'project-scope',
      label: 'Project Problem Statement',
      icon: Zap,
      url: 'https://docs.tinyfish.ai',
      mode: 'agent',
      goal: `Research autonomous web agent capabilities for ${team?.name || 'our hackathon squad'}. Investigate SSE automation endpoints, supported schemas, live browser preview streaming, and how to verify web evidence.`
    }
  ];

  const handleApplyPreset = (preset) => {
    setTargetUrl(preset.url);
    setResearchGoal(preset.goal);
    setResearchMode(preset.mode);
    setErrorMessage(null);
    showToast(`Loaded "${preset.label}" research preset`, 'default');
  };

  // URL validation check
  const isUrlValid = (url) => {
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Start Live TinyFish Research Run
  const handleStartResearch = async () => {
    if (!targetUrl.trim() || !isUrlValid(targetUrl)) {
      setErrorMessage('Please enter a valid website URL starting with http:// or https://');
      return;
    }
    if (!researchGoal.trim() || researchGoal.trim().length < 5) {
      setErrorMessage('Research goal must be at least 5 characters long.');
      return;
    }

    setIsRunning(true);
    setErrorMessage(null);
    setFinalResult(null);
    setStreamingUrl(null);
    setRunId(null);
    setQuestConverted(false);
    setEvents([
      {
        type: 'LOCAL_INIT',
        purpose: `Initializing TinyFish research connection to ${targetUrl}...`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/tinyfish/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          goal: researchGoal.trim(),
          mode: researchMode,
          browser_profile: browserProfile,
          agent_config: {
            mode: 'default',
            max_steps: 40,
            max_duration_seconds: 300
          }
        }),
        signal: controller.signal
      });

      // Handle direct HTTP errors (e.g. 400, 401, 500)
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Server returned HTTP ${response.status}`);
      }

      // If mode is 'search' or 'fetch', handle JSON response
      if (researchMode === 'search' || researchMode === 'fetch') {
        const data = await response.json();
        setFinalResult({
          status: 'COMPLETED',
          mode: researchMode,
          data: data.results,
          sourceUrl: targetUrl
        });
        setEvents(prev => [
          ...prev,
          {
            type: 'COMPLETE',
            purpose: `Successfully retrieved results from TinyFish ${researchMode.toUpperCase()} API.`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setIsRunning(false);
        return;
      }

      // Handle Agent API SSE Streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete trailing chunk in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            // Handle Documented TinyFish Event Types
            if (event.type === 'STARTED') {
              setRunId(event.run_id);
              setEvents(prev => [
                ...prev,
                {
                  type: 'STARTED',
                  purpose: `Agent automation session started [ID: ${event.run_id}]`,
                  timestamp: new Date(event.timestamp || Date.now()).toLocaleTimeString()
                }
              ]);
            } else if (event.type === 'STREAMING_URL') {
              setStreamingUrl(event.streaming_url);
              setEvents(prev => [
                ...prev,
                {
                  type: 'STREAMING_URL',
                  purpose: 'Live browser stream URL provisioned',
                  streamingUrl: event.streaming_url,
                  timestamp: new Date(event.timestamp || Date.now()).toLocaleTimeString()
                }
              ]);
            } else if (event.type === 'PROGRESS') {
              setEvents(prev => [
                ...prev,
                {
                  type: 'PROGRESS',
                  purpose: event.purpose || 'Navigating web page...',
                  tinyfish_api: event.tinyfish_api,
                  timestamp: new Date(event.timestamp || Date.now()).toLocaleTimeString()
                }
              ]);
            } else if (event.type === 'HEARTBEAT') {
              // Heartbeat keeps connection active
            } else if (event.type === 'TF_API_RESULT') {
              setEvents(prev => [
                ...prev,
                {
                  type: 'TF_API_RESULT',
                  purpose: `Received extracted payload via ${event.tinyfish_api || 'API'}`,
                  timestamp: new Date(event.timestamp || Date.now()).toLocaleTimeString()
                }
              ]);
            } else if (event.type === 'COMPLETE') {
              if (event.status === 'COMPLETED') {
                setFinalResult({
                  status: 'COMPLETED',
                  run_id: event.run_id,
                  result: event.result,
                  sourceUrl: targetUrl,
                  timestamp: event.timestamp
                });
                setEvents(prev => [
                  ...prev,
                  {
                    type: 'COMPLETE',
                    status: 'COMPLETED',
                    purpose: 'Research completed successfully. Findings ready.',
                    timestamp: new Date(event.timestamp || Date.now()).toLocaleTimeString()
                  }
                ]);
              } else {
                const failReason = event.error || event.help_message || `Run terminated with status: ${event.status}`;
                setErrorMessage(failReason);
                setEvents(prev => [
                  ...prev,
                  {
                    type: 'COMPLETE',
                    status: event.status,
                    purpose: `Research halted: ${failReason}`,
                    timestamp: new Date(event.timestamp || Date.now()).toLocaleTimeString()
                  }
                ]);
              }
            }
          } catch (parseErr) {
            console.warn('[TinyFish] Ignored malformed event chunk:', parseErr);
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setEvents(prev => [
          ...prev,
          {
            type: 'CANCELLED',
            purpose: 'Research run cancelled by user.',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        setErrorMessage(err.message || 'Network error communicating with TinyFish service');
      }
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  };

  // Stop / Cancel active research
  const handleCancelResearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsRunning(false);
      showToast('Research run cancelled.', 'default');
    }
  };

  // Convert Research Findings to a Real HackForge Milestone Quest
  const handleConvertToQuest = () => {
    if (!finalResult) return;

    let questTitle = 'Integrate findings from ' + new URL(targetUrl).hostname;
    let questDesc = researchGoal;
    let checklistTasks = [
      { task: `Verify findings against official source (${targetUrl})`, done: true },
      { task: 'Draft technical architecture & API client implementation', done: false },
      { task: 'Push unit test suite for target service integration', done: false }
    ];

    // If result has structured data, customize the quest
    if (finalResult.result) {
      const res = finalResult.result;
      if (typeof res === 'object') {
        const titleCandidate = res.title || res.summary || res.name;
        if (titleCandidate && typeof titleCandidate === 'string') {
          questTitle = `API Integration: ${titleCandidate.slice(0, 48)}`;
        }
      }
    }

    const newQuest = {
      id: `quest-tinyfish-${Date.now()}`,
      phase: 'Phase 2: Core MVP',
      title: questTitle,
      description: `Task derived from TinyFish Live Web Research (${targetUrl}): ${questDesc.slice(0, 200)}...`,
      tier: 'Gold',
      xpReward: 350,
      status: 'AVAILABLE',
      claimed: false,
      progress: 33,
      evidenceFields: [
        {
          key: 'researchSource',
          label: 'TinyFish Verified Source URL',
          placeholder: 'https://...',
          value: targetUrl
        },
        {
          key: 'implementationPr',
          label: 'Implementation PR / Commit Hash',
          placeholder: 'e.g. #14 or 5214cf8',
          value: ''
        }
      ],
      checklist: checklistTasks
    };

    if (addQuest) {
      addQuest(newQuest);
      setQuestConverted(true);
      showToast(`⚡ Converted Research into Quest: "${questTitle}" (+350 XP)`, 'xp');
      if (onQuestCreated) onQuestCreated(newQuest);
    }
  };

  // Render Result Content
  const renderResultContent = () => {
    if (!finalResult) return null;

    if (researchMode === 'search') {
      const results = finalResult.data?.results || finalResult.data || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Retrieved {Array.isArray(results) ? results.length : 0} web search results:
          </div>
          {Array.isArray(results) && results.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                padding: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>{item.title || 'Search Result'}</strong>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                  >
                    Source <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {item.snippet || item.description || JSON.stringify(item)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    if (researchMode === 'fetch') {
      const markdown = typeof finalResult.data === 'string' ? finalResult.data : JSON.stringify(finalResult.data, null, 2);
      return (
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            color: 'var(--text-secondary)'
          }}
        >
          {markdown}
        </pre>
      );
    }

    // Default Agent API result
    const resData = finalResult.result;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Verified Web Research Complete
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            STATUS: COMPLETED
          </span>
        </div>

        {/* Structured findings view */}
        <div
          className="card"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-default)',
            padding: '16px'
          }}
        >
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            EXTRACTED FINDINGS & EVIDENCE:
          </div>
          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            {typeof resData === 'string'
              ? resData
              : typeof resData === 'object' && resData !== null
              ? JSON.stringify(resData, null, 2)
              : 'Web agent explored target site successfully and verified documented technical specifications.'}
          </pre>
        </div>

        {/* Source citation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span>Source:</span>
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {targetUrl} <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div
      className="card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '24px'
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER & SERVER STATUS                                              */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className="copilot-pulse-dot" />
              <span>TINYFISH LIVE WEB RESEARCH</span>
            </span>
            {serverStatus.configured ? (
              <span
                className="badge badge-emerald"
                style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ShieldCheck size={12} /> AGENT ONLINE
              </span>
            ) : (
              <span
                className="badge badge-amber"
                style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <AlertTriangle size={12} /> TINYFISH_API_KEY NEEDED IN .ENV
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '1.4rem', margin: '4px 0', color: 'var(--text-primary)' }}>
            Real-Time Documentation & Public Web Explorer
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '750px' }}>
            Directly connect your sprint to official documentation, SDKs, and competitor sites via TinyFish goal-driven
            browser automation. Inspect real SSE event telemetry and convert actionable discoveries into verifiable quests.
          </p>
        </div>

        {/* Browser Profile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            PROFILE:
          </label>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-default)' }}>
            <button
              type="button"
              onClick={() => setBrowserProfile('lite')}
              className={`btn btn-sm ${browserProfile === 'lite' ? 'btn-primary' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.72rem' }}
            >
              Lite
            </button>
            <button
              type="button"
              onClick={() => setBrowserProfile('stealth')}
              className={`btn btn-sm ${browserProfile === 'stealth' ? 'btn-primary' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.72rem' }}
            >
              Stealth
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* API KEY ALERT BANNER IF NOT CONFIGURED                             */}
      {/* ------------------------------------------------------------------ */}
      {!serverStatus.loading && !serverStatus.configured && (
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <AlertCircle size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', display: 'block', marginBottom: '4px' }}>
              TinyFish API Key Configuration Required
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
              To enable live upstream automation requests, add your API key to the root <code>.env</code> file:
            </p>
            <code
              style={{
                display: 'block',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              TINYFISH_API_KEY=your_key_here
            </code>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
              Get your key from <a href="https://tinyfish.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>tinyfish.ai</a>. The key is kept strictly server-side and never exposed to the client.
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* QUICK USE CASE PRESETS                                              */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          HACKATHON RESEARCH PRESETS:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {presets.map(p => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: targetUrl === p.url ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-surface)',
                  borderColor: targetUrl === p.url ? 'var(--accent-cyan)' : 'var(--border-default)'
                }}
              >
                <Icon size={13} color="var(--accent-cyan)" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RESEARCH CONFIGURATION FORM                                        */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        {/* URL Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>
            Target Website or Documentation URL:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Globe
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="url"
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://docs.github.com/en/rest"
                disabled={isRunning}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  background: 'var(--bg-surface)',
                  border: `1px solid ${targetUrl && !isUrlValid(targetUrl) ? 'var(--accent-rose)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            {/* Research Mode Selector */}
            <select
              value={researchMode}
              onChange={e => setResearchMode(e.target.value)}
              disabled={isRunning}
              style={{
                padding: '9px 12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer'
              }}
            >
              <option value="agent">Agent Browser (SSE Stream)</option>
              <option value="search">Search API (Ranked)</option>
              <option value="fetch">Fetch API (Markdown)</option>
            </select>
          </div>
        </div>

        {/* Research Goal Textarea */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Natural-Language Research Goal:
            </label>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {researchGoal.length} / 3000 chars
            </span>
          </div>
          <textarea
            value={researchGoal}
            onChange={e => setResearchGoal(e.target.value)}
            placeholder="Describe what information or technical endpoints you want TinyFish to find on this site..."
            rows={3}
            disabled={isRunning}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              resize: 'vertical',
              fontFamily: 'var(--font-sans)'
            }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isRunning ? (
              <button
                type="button"
                onClick={handleCancelResearch}
                className="btn btn-secondary btn-sm"
                style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
              >
                <StopCircle size={14} />
                <span>Cancel Research</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartResearch}
                disabled={isRunning || !targetUrl.trim() || !researchGoal.trim()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px' }}
              >
                <Sparkles size={15} />
                <span>Launch TinyFish Research</span>
              </button>
            )}

            {finalResult && !isRunning && (
              <button
                type="button"
                onClick={() => {
                  setFinalResult(null);
                  setEvents([]);
                  setErrorMessage(null);
                }}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Research to Quest action button */}
          {finalResult && (
            <button
              type="button"
              onClick={handleConvertToQuest}
              disabled={questConverted}
              className="btn btn-primary btn-sm"
              style={{
                background: questConverted ? 'var(--bg-surface)' : 'var(--accent-emerald)',
                borderColor: questConverted ? 'var(--border-default)' : 'var(--accent-emerald)',
                color: questConverted ? 'var(--text-muted)' : '#000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {questConverted ? (
                <>
                  <Check size={14} />
                  <span>Quest Adopted to Board</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={14} />
                  <span>Convert to Quest (+350 XP)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ERROR NOTICE BANNER                                                */}
      {/* ------------------------------------------------------------------ */}
      {errorMessage && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="var(--accent-rose)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)' }}>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={handleStartResearch}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.72rem', padding: '3px 8px' }}
          >
            Retry Run
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* LIVE BROWSER PREVIEW (IF STREAMING_URL RETURNED)                   */}
      {/* ------------------------------------------------------------------ */}
      {streamingUrl && (
        <div
          style={{
            marginBottom: '20px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.8)'
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              background: 'rgba(6, 182, 212, 0.12)',
              borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={14} color="var(--accent-cyan)" />
              <strong style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                TINYFISH LIVE BROWSER STREAM
              </strong>
            </div>
            <a
              href={streamingUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Open in Tab <ExternalLink size={12} />
            </a>
          </div>
          <iframe
            src={streamingUrl}
            title="TinyFish Browser Live Preview"
            style={{ width: '100%', height: '360px', border: 'none' }}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* LIVE SSE ACTIVITY TIMELINE                                         */}
      {/* ------------------------------------------------------------------ */}
      {events.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={14} color="var(--accent-emerald)" />
              <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                LIVE EVENT STREAM {runId ? `[RUN: ${runId}]` : ''}
              </strong>
            </div>
            {isRunning && (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="copilot-pulse-dot" /> STREAMING
              </span>
            )}
          </div>

          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem'
            }}
          >
            {events.map((evt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{evt.timestamp}]</span>
                <span
                  style={{
                    color:
                      evt.type === 'STARTED'
                        ? 'var(--accent-cyan)'
                        : evt.type === 'COMPLETE' && evt.status === 'COMPLETED'
                        ? 'var(--accent-emerald)'
                        : evt.type === 'STREAMING_URL'
                        ? 'var(--accent-violet)'
                        : evt.type === 'CANCELLED' || evt.status === 'FAILED'
                        ? 'var(--accent-rose)'
                        : 'var(--text-secondary)'
                  }}
                >
                  {evt.purpose}
                </span>
              </div>
            ))}
            <div ref={eventsEndRef} />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* FINAL RESEARCH RESULTS AREA                                        */}
      {/* ------------------------------------------------------------------ */}
      {finalResult && (
        <div style={{ marginTop: '14px' }}>
          {renderResultContent()}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* EMPTY STATE                                                        */}
      {/* ------------------------------------------------------------------ */}
      {!isRunning && !finalResult && events.length === 0 && (
        <div
          style={{
            padding: '30px 20px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px dashed var(--border-default)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--accent-cyan-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              marginBottom: '12px'
            }}
          >
            <Compass size={22} />
          </div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Ready to explore the public web
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 16px auto' }}>
            Enter any public API reference, competitor URL, or framework guide. TinyFish will autonomously navigate the site,
            extract technical endpoints, and stream live progress back to your dashboard.
          </p>
          <button
            type="button"
            onClick={() => handleApplyPreset(presets[0])}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            Load GitHub REST API Demo Preset
          </button>
        </div>
      )}
    </div>
  );
}
