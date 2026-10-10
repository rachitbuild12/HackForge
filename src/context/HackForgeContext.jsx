import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialUser,
  hackathons,
  currentTeam,
  initialQuests,
  initialActivities,
  currentBuildPassport,
  organizerMetrics,
  mockIntegrityAlerts,
  mockJudgeQueue,
  organizerJudgingCriteria,
  mockLeaderboard,
  mockAiInsights,
  mockPullRequests,
  mockIssues,
  TEAM_ROLES
} from '../data/mockData';
import {
  demoHackathon,
  demoTeams,
  demoActivities,
  demoAiInsights,
  demoIntegrityAlert,
  demoBuildPassport,
  DEMO_HACKATHON_ID,
  DEMO_STEPS
} from '../data/demoModeData';
import BadgeUnlockModal from '../components/BadgeUnlockModal';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const HackForgeContext = createContext(null);

export function HackForgeProvider({ children }) {
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [user, setUser] = useState(initialUser);
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('hackforge_team');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.githubRepo && parsed.githubRepo.includes('hyperdrive-protocol')) {
          localStorage.removeItem('hackforge_team');
          return currentTeam;
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Failed loading team from localStorage", e);
    }
    return currentTeam;
  });

  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('hackforge_quests');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed loading quests from localStorage", e);
    }
    return initialQuests;
  });

  const [activities, setActivities] = useState(initialActivities);
  const [passport, setPassport] = useState(currentBuildPassport);
  const [integrityAlerts, setIntegrityAlerts] = useState(mockIntegrityAlerts);
  const [judgeQueue, setJudgeQueue] = useState(mockJudgeQueue);
  const [unlockModalData, setUnlockModalData] = useState(null);

  // GitHub Integration state
  const [githubUser, setGithubUser] = useState(null);
  const [githubConnectedRepo, setGithubConnectedRepo] = useState(() => {
    try {
      const saved = localStorage.getItem('hackforge_github_repo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.full_name && parsed.full_name.includes('hyperdrive-protocol')) {
          localStorage.removeItem('hackforge_github_repo');
          return null;
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Failed loading github repo from localStorage", e);
    }
    return null;
  });
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState(null);
  const [githubAppStatus, setGithubAppStatus] = useState({
    configured: false,
    appSlug: null,
    appId: null,
    activeInstallationId: null,
    permissions: {}
  });

  const [hackathonsList, setHackathonsList] = useState(() => {
    const baseWithDemo = [demoHackathon, ...hackathons];
    try {
      const saved = localStorage.getItem('hackforge_hackathons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.some(h => h.id === DEMO_HACKATHON_ID)) {
          return [demoHackathon, ...parsed];
        }
        return parsed;
      }
    } catch (err) {
      console.warn("Failed to load hackathons from localStorage", err);
    }
    return baseWithDemo;
  });

  const [toasts, setToasts] = useState([]);
  const [activeHackathonId, setActiveHackathonId] = useState("eth-global-2026");

  // Demo Mode state
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      return localStorage.getItem('hackforge_demo_mode') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [demoStep, setDemoStep] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Save team & quests to localStorage helper
  const saveTeamState = (newTeam) => {
    setTeam(newTeam);
    try {
      localStorage.setItem('hackforge_team', JSON.stringify(newTeam));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveQuestsState = (newQuests) => {
    setQuests(newQuests);
    try {
      localStorage.setItem('hackforge_quests', JSON.stringify(newQuests));
    } catch (e) {
      console.warn(e);
    }
  };

  // Helper to trigger floating toast
  const showToast = (message, type = "default") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Switch role seamlessly for testing
  const switchRole = (newRole) => {
    setUser(prev => ({ ...prev, role: newRole }));
    showToast(`Switched active perspective to: ${newRole.toUpperCase().replace('_', ' ')}`, "role");
  };

  // -------------------------------------------------------------
  // REAL GITHUB INTEGRATION & OAUTH LIFECYCLE
  // -------------------------------------------------------------
  const checkGitHubAuthStatus = useCallback(async () => {
    setIsGithubLoading(true);
    setGithubError(null);
    try {
      const res = await fetch('/api/auth/github/status', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setGithubUser(data.user);
        return data.user;
      } else {
        setGithubUser(null);
        return null;
      }
    } catch (err) {
      console.warn("Failed checking GitHub auth status:", err);
      return null;
    } finally {
      setIsGithubLoading(false);
    }
  }, []);

  const checkGitHubAppStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/github/app/status', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setGithubAppStatus(data);
        return data;
      }
    } catch (err) {
      console.warn("Failed checking GitHub App status:", err);
    }
    return null;
  }, []);

  // Check URL callback parameters on mount (e.g. ?github_auth=success or ?github_app_installed=true or ?github_error=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('github_app_installed') === 'true') {
        const account = params.get('account') || 'GitHub';
        showToast(`GitHub App connected for @${account}!`, "default");
        checkGitHubAppStatus();
        checkGitHubAuthStatus();
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      } else if (params.get('github_auth') === 'success') {
        showToast("GitHub account connected successfully!", "default");
        checkGitHubAuthStatus();
        checkGitHubAppStatus();
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      } else if (params.get('github_error')) {
        const errorMsg = params.get('github_error');
        setGithubError(errorMsg);
        showToast(`GitHub connection failed: ${errorMsg}`, "alert");
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      } else {
        checkGitHubAuthStatus();
        checkGitHubAppStatus();
      }
    }
  }, [checkGitHubAuthStatus, checkGitHubAppStatus]);

  // -------------------------------------------------------------
  // SUPABASE AUTHENTICATION LIFECYCLE
  // -------------------------------------------------------------
  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!error && session?.user) {
          setSupabaseUser(session.user);
          setUser(prev => ({
            ...prev,
            email: session.user.email || prev.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || prev.name,
            avatar: session.user.user_metadata?.avatar_url || prev.avatar
          }));
        }
      });

      // Listen for auth state changes (sign in, sign out, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser(prev => ({
            ...prev,
            email: session.user.email || prev.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || prev.name,
            avatar: session.user.user_metadata?.avatar_url || prev.avatar
          }));
        } else {
          setSupabaseUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const supabaseSignIn = async (email, password) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    showToast(`Logged in via Supabase as ${data.user.email}!`, 'default');
    return data;
  };

  const supabaseSignUp = async (email, password, metadata = {}) => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    showToast(`Account created via Supabase!`, 'default');
    return data;
  };

  const supabaseSignOut = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
      setSupabaseUser(null);
      showToast('Signed out of Supabase.', 'default');
    }
  };

  const supabaseSignInWithGitHub = async () => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet.');
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/hackathons/eth-global-2026/team'
      }
    });
    if (error) throw error;
    return data;
  };

  const fetchGitHubRepos = async () => {
    setIsGithubLoading(true);
    setGithubError(null);
    try {
      const res = await fetch('/api/github/repos', {
        credentials: 'include'
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to fetch repositories');
      }
      const data = await res.json();
      return data.repositories || [];
    } catch (err) {
      setGithubError(err.message);
      showToast(`Error fetching repositories: ${err.message}`, "alert");
      throw err;
    } finally {
      setIsGithubLoading(false);
    }
  };

  const associateGitHubRepo = async (owner, repo, projectId = team?.id || 'team-1') => {
    setIsGithubLoading(true);
    setGithubError(null);
    try {
      const res = await fetch('/api/github/associate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ owner, repo, projectId })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to associate repository');
      }
      const data = await res.json();
      const { repository, activities: newActivities } = data;

      // Update state
      setGithubConnectedRepo(repository);
      try {
        localStorage.setItem('hackforge_github_repo', JSON.stringify(repository));
      } catch (e) {
        console.warn(e);
      }

      // Update team info with real telemetry
      const updatedTeam = {
        ...team,
        githubRepo: repository.html_url,
        repoOwner: repository.owner,
        repoName: repository.name,
        repoStatus: "Connected & Verified",
        branch: repository.default_branch,
        commitsCount: repository.commit_count || team.commitsCount || 1,
        linesChanged: repository.lines_changed || team.linesChanged || "+0 / -0",
        lastCommitTime: repository.latest_commit ? new Date(repository.latest_commit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
      };
      saveTeamState(updatedTeam);

      // Prepend or merge normalized activities into timeline
      if (newActivities && newActivities.length > 0) {
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const filteredNew = newActivities.filter(a => !existingIds.has(a.id));
          return [...filteredNew, ...prev];
        });
      }

      if (repository.commit_count > 0) {
        evaluateActivityForMilestones("FIRST_BUILD_SUCCESS");
      }

      showToast(`Repository ${repository.full_name} successfully linked to project!`, "default");
      return repository;
    } catch (err) {
      setGithubError(err.message);
      showToast(`Failed linking repository: ${err.message}`, "alert");
      throw err;
    } finally {
      setIsGithubLoading(false);
    }
  };

  const syncGitHubTelemetry = async (projectId = team?.id || 'team-1') => {
    setIsGithubLoading(true);
    try {
      const res = await fetch(`/api/github/sync/${projectId}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to sync telemetry');
      }
      const data = await res.json();
      const { repository, activities: newActivities } = data;

      if (repository) {
        setGithubConnectedRepo(repository);
        try {
          localStorage.setItem('hackforge_github_repo', JSON.stringify(repository));
        } catch (e) {
          console.warn(e);
        }
        const updatedTeam = {
          ...team,
          commitsCount: repository.commit_count || team.commitsCount,
          linesChanged: repository.lines_changed || team.linesChanged,
          lastCommitTime: repository.latest_commit ? new Date(repository.latest_commit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : team.lastCommitTime
        };
        saveTeamState(updatedTeam);
      }

      if (newActivities && newActivities.length > 0) {
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const filteredNew = newActivities.filter(a => !existingIds.has(a.id));
          return [...filteredNew, ...prev];
        });
      }

      showToast("Live telemetry synced from GitHub!", "default");
      return data;
    } catch (err) {
      console.warn("Sync failed:", err);
      showToast(`Sync failed: ${err.message}`, "alert");
      throw err;
    } finally {
      setIsGithubLoading(false);
    }
  };

  const disconnectGitHub = async () => {
    try {
      await fetch('/api/auth/github/disconnect', {
        method: 'POST',
        credentials: 'include'
      });
      setGithubUser(null);
      setGithubConnectedRepo(null);
      localStorage.removeItem('hackforge_github_repo');
      showToast("GitHub account disconnected.", "default");
    } catch (err) {
      console.warn("Disconnect error:", err);
    }
  };

  const connectDirectToken = async (token) => {
    setIsGithubLoading(true);
    setGithubError(null);
    try {
      const res = await fetch('/api/auth/github/direct-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Direct token validation failed');
      }
      const data = await res.json();
      setGithubUser(data.user);
      showToast(`Authenticated as @${data.user.login} via Personal Access Token!`, "default");
      return data.user;
    } catch (err) {
      setGithubError(err.message);
      showToast(`Authentication failed: ${err.message}`, "alert");
      throw err;
    } finally {
      setIsGithubLoading(false);
    }
  };

  const fetchGitHubAppRepos = async (installationId) => {
    setIsGithubLoading(true);
    setGithubError(null);
    try {
      const url = installationId ? `/api/github/app/repos?installationId=${installationId}` : '/api/github/app/repos';
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch repositories for GitHub App');
      }
      const data = await res.json();
      return data.repositories || [];
    } catch (err) {
      setGithubError(err.message);
      showToast(`Error fetching App repositories: ${err.message}`, "alert");
      throw err;
    } finally {
      setIsGithubLoading(false);
    }
  };

  const associateGitHubAppRepo = async (owner, repo, installationId, projectId = team?.id || 'team-hyperdrive') => {
    setIsGithubLoading(true);
    setGithubError(null);
    try {
      const res = await fetch('/api/github/app/associate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ owner, repo, installationId, projectId })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to associate repository');
      }
      const data = await res.json();
      const { repository, activities: newActivities } = data;

      setGithubConnectedRepo(repository);
      try {
        localStorage.setItem('hackforge_github_repo', JSON.stringify(repository));
      } catch (e) {
        console.warn(e);
      }

      const updatedTeam = {
        ...team,
        githubRepo: repository.html_url,
        repoOwner: repository.owner,
        repoName: repository.name,
        repoStatus: "Connected & Verified (GitHub App)",
        branch: repository.default_branch,
        commitsCount: repository.commits_count || repository.commit_count || team.commitsCount || 1,
        linesChanged: repository.lines_changed || team.linesChanged || "+0 / -0",
        lastCommitTime: repository.latest_commit ? new Date(repository.latest_commit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
      };
      saveTeamState(updatedTeam);

      if (newActivities && newActivities.length > 0) {
        setActivities(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const filteredNew = newActivities.filter(a => !existingIds.has(a.id));
          return [...filteredNew, ...prev];
        });
      }

      showToast(`Connected repository "${repository.full_name}" via GitHub App!`, "default");
      return data;
    } catch (err) {
      setGithubError(err.message);
      showToast(`Association error: ${err.message}`, "alert");
      throw err;
    } finally {
      setIsGithubLoading(false);
    }
  };

  const disconnectGitHubApp = async (projectId = team?.id || 'team-hyperdrive') => {
    try {
      await fetch('/api/github/app/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId })
      });
      setGithubConnectedRepo(null);
      localStorage.removeItem('hackforge_github_repo');
      showToast("GitHub App repository disconnected safely.", "default");
    } catch (err) {
      console.warn("Disconnect error:", err);
    }
  };

  // -------------------------------------------------------------
  // PARTICIPANT TEAM ACTIONS
  // -------------------------------------------------------------
  const createTeam = ({ name, slogan, avatar, problemStatementId, problemStatementTitle, githubRepo, techStack }) => {
    const randomCode = `FORGE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newTeam = {
      id: `team-${Date.now()}`,
      hackathonId: activeHackathonId,
      name: name || "Autonomous Squad",
      avatar: avatar || "🚀",
      slogan: slogan || "Building verifiable autonomous systems on HackForge",
      inviteCode: randomCode,
      problemStatementId: problemStatementId || "ps-1",
      problemStatementTitle: problemStatementTitle || "Open Innovation Challenge",
      githubRepo: githubRepo || "https://github.com/hackforge-squad/sprint-project",
      repoStatus: "Connected & Verified",
      branch: "main",
      commitsCount: 1,
      linesChanged: "+250 / -0",
      lastCommitTime: "Just now",
      integrityScore: 100,
      xpEarned: 0,
      leaderboardRank: 12,
      members: [
        {
          id: user.id || "usr_current",
          name: user.name || "Alex Chen",
          role: "Team Leader",
          avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          commits: 1,
          xp: 150,
          status: "Active now"
        }
      ],
      techStack: techStack || ["React", "TypeScript", "Node.js"]
    };

    saveTeamState(newTeam);
    showToast(`Squad "${newTeam.name}" created! Invite code: ${randomCode}`, "default");
    return newTeam;
  };

  const joinTeam = (inviteCode, requestedRole = "Frontend") => {
    const cleanCode = (inviteCode || "").trim().toUpperCase();
    if (!cleanCode) {
      showToast("Please enter an invite code", "alert");
      return false;
    }

    // Check if matching current team or mock squads
    if (team.inviteCode && team.inviteCode.toUpperCase() === cleanCode) {
      const alreadyMember = team.members.some(m => m.id === user.id);
      if (alreadyMember) {
        showToast("You are already an active member of this squad!", "default");
        return true;
      }

      if (team.members.length >= 8) {
        showToast("This squad has reached the maximum team capacity (8 members).", "alert");
        return false;
      }

      const updatedMembers = [
        ...team.members,
        {
          id: user.id || `usr-${Date.now()}`,
          name: user.name || "Builder",
          role: requestedRole,
          avatar: user.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          commits: 0,
          xp: 0,
          status: "Joined just now"
        }
      ];

      const updatedTeam = { ...team, members: updatedMembers };
      saveTeamState(updatedTeam);
      showToast(`🎉 Joined squad "${team.name}" as ${requestedRole}!`, "default");
      return true;
    }

    // Fallback: join simulated squad with valid code
    const newSimulatedTeam = {
      ...currentTeam,
      name: `Squad ${cleanCode.slice(-4)}`,
      inviteCode: cleanCode,
      members: [
        ...currentTeam.members.slice(0, 2),
        {
          id: user.id || "usr_current",
          name: user.name || "Alex Chen",
          role: requestedRole,
          avatar: user.avatar,
          commits: 0,
          xp: 0,
          status: "Active now"
        }
      ]
    };
    saveTeamState(newSimulatedTeam);
    showToast(`Joined squad with code ${cleanCode}!`, "default");
    return true;
  };

  const assignMemberRole = (memberId, newRole) => {
    const updatedMembers = team.members.map(m => {
      if (m.id === memberId) {
        return { ...m, role: newRole };
      }
      return m;
    });

    const updatedTeam = { ...team, members: updatedMembers };
    saveTeamState(updatedTeam);
    showToast(`Assigned role "${newRole}" to member`, "default");
  };

  const selectProblemStatement = (problemStatementId, problemStatementTitle) => {
    const updatedTeam = {
      ...team,
      problemStatementId,
      problemStatementTitle
    };
    saveTeamState(updatedTeam);
    showToast(`Locked onto challenge: "${problemStatementTitle}"`, "default");
  };

  const inviteMemberByEmail = (email, role = "Frontend") => {
    showToast(`Encrypted invite link dispatched to ${email}`, "default");
  };

  const updateProjectDescription = (newDescription) => {
    const updatedTeam = {
      ...team,
      structuredProjectDescription: {
        ...(team.structuredProjectDescription || {}),
        ...newDescription,
        updatedAt: new Date().toISOString()
      }
    };
    saveTeamState(updatedTeam);
    showToast("Project Scope description updated successfully!", "default");
  };

  // -------------------------------------------------------------
  // MILESTONE QUEST SYSTEM & XP ACTIONS
  // -------------------------------------------------------------
  const updateQuestRequirementEvidence = (questId, key, value) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId && q.evidenceFields) {
          const updatedEvidence = q.evidenceFields.map(ef => {
            if (ef.key === key) return { ...ef, value };
            return ef;
          });

          // Check if all evidence is provided
          const allEvidenceProvided = updatedEvidence.every(ef => ef.value && ef.value.trim().length > 0);
          const newStatus = allEvidenceProvided && q.status !== 'COMPLETED' ? 'CLAIMABLE' : q.status;
          const newProgress = allEvidenceProvided ? 100 : 50;

          return {
            ...q,
            evidenceFields: updatedEvidence,
            status: newStatus,
            progress: newProgress
          };
        }
        return q;
      });
      saveQuestsState(updated);
      return updated;
    });
  };

  const toggleQuestTask = (questId, taskIndex) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId) {
          const newChecklist = [...q.checklist];
          newChecklist[taskIndex] = {
            ...newChecklist[taskIndex],
            done: !newChecklist[taskIndex].done
          };
          const completedCount = newChecklist.filter(item => item.done).length;
          const progress = Math.round((completedCount / newChecklist.length) * 100);
          let newStatus = q.status;
          if (progress === 100 && !q.claimed) {
            newStatus = 'CLAIMABLE';
          } else if (progress > 0 && progress < 100) {
            newStatus = 'IN_PROGRESS';
          }

          return {
            ...q,
            checklist: newChecklist,
            progress,
            status: newStatus
          };
        }
        return q;
      });
      saveQuestsState(updated);
      return updated;
    });
  };

  const addQuest = (newQuest) => {
    setQuests(prev => {
      if (prev.some(q => q.id === newQuest.id || q.title.toLowerCase() === newQuest.title.toLowerCase())) {
        showToast("Quest already present on Quest Board!", "default");
        return prev;
      }
      const updated = [newQuest, ...prev];
      saveQuestsState(updated);
      showToast(`⚡ New Quest Adopted: "${newQuest.title}" (+${newQuest.xpReward} XP)`, "xp");
      return updated;
    });
  };

  // Claim quest XP & trigger celebration
  const claimQuestXp = (questId) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest || targetQuest.claimed) return;

    const xpBonus = targetQuest.xpReward;

    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId) {
          return { ...q, claimed: true, status: 'COMPLETED', progress: 100 };
        }
        return q;
      });
      saveQuestsState(updated);
      return updated;
    });

    // Update user XP & Level
    let isLevelUp = false;
    let newLevel = user.level;
    let newTitle = user.levelTitle;

    setUser(prev => {
      const newXp = prev.xp + xpBonus;
      if (newXp >= 6500 && prev.level < 7) {
        newLevel = 7;
        newTitle = "Grandmaster Forge";
        isLevelUp = true;
      }
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        levelTitle: newTitle
      };
    });

    // Award XP to Team Vault
    const updatedTeam = {
      ...team,
      xpEarned: (team.xpEarned || 0) + xpBonus
    };
    saveTeamState(updatedTeam);

    // Trigger Celebratory Unlock Modal
    setUnlockModalData({
      type: isLevelUp ? 'level' : 'quest',
      title: targetQuest.title,
      subtitle: `Verified development milestone: ${targetQuest.description}`,
      xpReward: xpBonus,
      badgeTier: targetQuest.tier
    });

    // Add activity event
    const newActivity = {
      id: `act-${Date.now()}`,
      author: user.name,
      authorAvatar: user.avatar,
      type: "quest_complete",
      hash: `+${xpBonus} XP`,
      branch: team.branch || "main",
      title: `Milestone Conquered: '${targetQuest.title}'`,
      diff: `+${xpBonus} XP to Team Vault`,
      timestamp: "Just now",
      verified: true
    };
    setActivities(prev => [newActivity, ...prev]);

    showToast(`⚡ +${xpBonus} XP Awarded for Milestone "${targetQuest.title}"!`, "xp");
  };

  // Activity Evaluation Engine: Evaluates meaningful project activity, NOT raw commit spam
  const evaluateActivityForMilestones = (activityType, details = {}) => {
    let triggeredQuestId = null;

    if (activityType === "API_DEPLOYED") {
      triggeredQuestId = "q-4"; // Deploy your first working API
    } else if (activityType === "FIRST_BUILD_SUCCESS") {
      triggeredQuestId = "q-3"; // First Successful Build
    } else if (activityType === "AI_MODEL_INTEGRATED") {
      triggeredQuestId = "q-5"; // First AI Model
    } else if (activityType === "API_INTEGRATED") {
      triggeredQuestId = "q-6"; // First API Integration
    } else if (activityType === "MVP_DEPLOYED") {
      triggeredQuestId = "q-7"; // Deploy MVP
    } else if (activityType === "DOCS_COMPLETED") {
      triggeredQuestId = "q-8"; // Complete Documentation
    }

    if (triggeredQuestId) {
      setQuests(prev => {
        const updated = prev.map(q => {
          if (q.id === triggeredQuestId) {
            const completedChecklist = q.checklist.map(c => ({ ...c, done: true }));
            return {
              ...q,
              checklist: completedChecklist,
              progress: 100,
              status: q.claimed ? 'COMPLETED' : 'CLAIMABLE'
            };
          }
          return q;
        });
        saveQuestsState(updated);
        return updated;
      });

      showToast(`🎯 Verified milestone activity! Quest "${triggeredQuestId}" is now ready to claim!`, "xp");
    }
  };

  // Resolve or update an integrity alert (for organizer)
  const resolveIntegrityAlert = (alertId, resolution, notes = "") => {
    setIntegrityAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: resolution,
          organizerNotes: notes || alert.organizerNotes,
          resolvedAt: new Date().toISOString()
        };
      }
      return alert;
    }));

    if (resolution === 'EXPLAINED') {
      showToast("Alert marked as Explained by team.", "default");
    } else if (resolution === 'ALLOWED') {
      showToast("Alert marked as Allowed (Whitelisted starter exemption).", "default");
    } else if (resolution === 'EXPLANATION_REQUESTED') {
      showToast("Inquiry dispatched to team workspace: Explanation requested.", "alert");
    } else if (resolution === 'ESCALATED') {
      showToast("Incident escalated to Jury Panel for human review.", "alert");
    } else {
      showToast(`Alert status updated to ${resolution}`, "default");
    }
  };

  const addIntegrityAlert = (newAlert) => {
    setIntegrityAlerts(prev => [newAlert, ...prev]);
    showToast(`New Provenance Alert logged: ${newAlert.concernLevel}`, "alert");
  };

  // Update judge scores
  const updateJudgeScore = (projectId, category, value) => {
    setJudgeQueue(prev => prev.map(item => {
      if (item.id === projectId) {
        return {
          ...item,
          scores: {
            ...item.scores,
            [category]: parseFloat(value)
          }
        };
      }
      return item;
    }));
  };

  // Update judge qualitative notes
  const updateJudgeNotes = (projectId, notes) => {
    setJudgeQueue(prev => prev.map(item => {
      if (item.id === projectId) {
        return { ...item, notes };
      }
      return item;
    }));
  };

  // Save judge review draft
  const saveJudgeDraft = (projectId) => {
    setJudgeQueue(prev => prev.map(item => {
      if (item.id === projectId) {
        return { ...item, status: item.status === 'SCORED' ? 'SCORED' : 'DRAFT_SAVED' };
      }
      return item;
    }));
    showToast("Evaluation draft saved locally.", "default");
  };

  // Submit judge review
  const submitJudgeReview = (projectId) => {
    setJudgeQueue(prev => prev.map(item => {
      if (item.id === projectId) {
        return { ...item, status: "SCORED" };
      }
      return item;
    }));
    showToast("Project scores locked and submitted to jury ledger!", "judge");
  };

  // Create new hackathon with persistence
  const createHackathon = (hackathonData) => {
    const slug = hackathonData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `hackathon-${Date.now()}`;
    
    const uniqueId = hackathonsList.some(h => h.id === slug) ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newHackathon = {
      id: uniqueId,
      title: hackathonData.title || "Untitled Hackathon",
      tagline: hackathonData.tagline || hackathonData.description?.slice(0, 100) || "An innovative sprint on HackForge",
      description: hackathonData.description || "",
      banner: hackathonData.banner || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      status: "LIVE",
      startsAt: hackathonData.startsAt || new Date().toISOString(),
      endsAt: hackathonData.endsAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      timeLeft: "Sprint Live",
      prizePool: hackathonData.prizePool || "$50,000",
      participantsCount: 0,
      teamsCount: 0,
      format: hackathonData.format || "Virtual / Online",
      location: hackathonData.location || "Online",
      maxTeamSize: hackathonData.maxTeamSize || 4,
      organizer: hackathonData.organizer || user.name || "Hackathon Organizer",
      rules: hackathonData.rules || [],
      allowedTechnologies: hackathonData.allowedTechnologies || [],
      aiPolicy: hackathonData.aiPolicy || "Full AI Allowed",
      repositoryRequirements: hackathonData.repositoryRequirements || [],
      starterCodePolicy: hackathonData.starterCodePolicy || "Declared & Whitelisted Only",
      submissionRequirements: hackathonData.submissionRequirements || [],
      allowedStarters: hackathonData.allowedStarters || [],
      problemStatements: hackathonData.problemStatements || [],
      integrityConfig: hackathonData.integrityConfig || {
        githubMandatory: true,
        flagPreExistingCode: true,
        integrityThreshold: 80,
        baselineSnapshotTime: hackathonData.startsAt || new Date().toISOString(),
        aiDisclosureRequired: true
      },
      tracks: (hackathonData.problemStatements || []).map(ps => ({
        name: ps.category || ps.track || "Open Innovation",
        prize: ps.bounty || "$10,000",
        description: ps.title
      })),
      createdAt: new Date().toISOString()
    };

    setHackathonsList(prev => {
      const updated = [newHackathon, ...prev];
      try {
        localStorage.setItem('hackforge_hackathons', JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed saving to localStorage", e);
      }
      return updated;
    });

    setActiveHackathonId(newHackathon.id);
    showToast(`🚀 Hackathon "${newHackathon.title}" published and live!`, "default");
    return newHackathon;
  };

  // Update an existing hackathon
  const updateHackathon = (id, updatedFields) => {
    setHackathonsList(prev => {
      const updated = prev.map(h => (h.id === id ? { ...h, ...updatedFields } : h));
      try {
        localStorage.setItem('hackforge_hackathons', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    showToast("Hackathon settings updated successfully!", "default");
  };

  // Delete / Reset hackathons
  const deleteHackathon = (id) => {
    setHackathonsList(prev => {
      const updated = prev.filter(h => h.id !== id);
      try {
        localStorage.setItem('hackforge_hackathons', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    showToast("Hackathon removed.", "default");
  };

  const resetHackathons = () => {
    localStorage.removeItem('hackforge_hackathons');
    setHackathonsList(hackathons);
    showToast("Hackathons reset to default dataset", "default");
  };

  // -------------------------------------------------------------
  // HACKATHON DEMO MODE CONTROLS (SEEDED 5-MINUTE GUIDED TOUR)
  // -------------------------------------------------------------
  const startDemoMode = (initialStep = 1) => {
    setIsDemoMode(true);
    try {
      localStorage.setItem('hackforge_demo_mode', 'true');
    } catch (e) {}
    setDemoStep(initialStep);
    setActiveHackathonId(DEMO_HACKATHON_ID);

    // Set active team to Nexus Sentinel
    setTeam(demoTeams[0]);

    // Set activities to demoActivities
    setActivities(demoActivities);

    // Set passport to demoBuildPassport
    setPassport(demoBuildPassport);

    // Ensure integrityAlerts includes demoIntegrityAlert
    setIntegrityAlerts(prev => {
      if (prev.some(a => a.id === demoIntegrityAlert.id)) return prev;
      return [demoIntegrityAlert, ...prev];
    });

    const stepObj = DEMO_STEPS.find(s => s.step === initialStep) || DEMO_STEPS[0];
    setUser(prev => ({ ...prev, role: stepObj.role }));

    showToast("🚀 HackForge Demo Mode: 'HackForge Grand Challenge' loaded!", "default");
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setIsAutoPlaying(false);
    try {
      localStorage.removeItem('hackforge_demo_mode');
    } catch (e) {}
    setActiveHackathonId("eth-global-2026");
    setTeam(currentTeam);
    setActivities(initialActivities);
    setPassport(currentBuildPassport);
    setUser(prev => ({ ...prev, role: "participant" }));
    showToast("Exited Demo Mode. Restored standard hackathon view.", "default");
  };

  const jumpToDemoStep = (stepNumber) => {
    const bounded = Math.max(1, Math.min(12, stepNumber));
    setDemoStep(bounded);
    const stepObj = DEMO_STEPS.find(s => s.step === bounded) || DEMO_STEPS[0];
    setUser(prev => ({ ...prev, role: stepObj.role }));
  };

  const nextDemoStep = () => {
    if (demoStep < 12) {
      jumpToDemoStep(demoStep + 1);
    }
  };

  const prevDemoStep = () => {
    if (demoStep > 1) {
      jumpToDemoStep(demoStep - 1);
    }
  };

  // Active hackathon object
  const activeHackathon = hackathonsList.find(h => h.id === activeHackathonId) || hackathonsList[0];

  return (
    <HackForgeContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        team,
        setTeam,
        TEAM_ROLES,
        createTeam,
        joinTeam,
        assignMemberRole,
        selectProblemStatement,
        inviteMemberByEmail,
        updateProjectDescription,
        unlockModalData,
        setUnlockModalData,
        activities,
        passport,
        setPassport,
        hackathons: hackathonsList,
        createHackathon,
        updateHackathon,
        deleteHackathon,
        resetHackathons,
        activeHackathon,
        activeHackathonId,
        setActiveHackathonId,
        organizerMetrics,
        integrityAlerts,
        resolveIntegrityAlert,
        addIntegrityAlert,
        judgeQueue,
        organizerJudgingCriteria,
        updateJudgeScore,
        updateJudgeNotes,
        saveJudgeDraft,
        submitJudgeReview,
        quests,
        addQuest,
        claimQuestXp,
        toggleQuestTask,
        updateQuestRequirementEvidence,
        evaluateActivityForMilestones,
        pullRequests: mockPullRequests,
        issues: mockIssues,
        leaderboard: mockLeaderboard,
        aiInsights: isDemoMode ? [...demoAiInsights, ...mockAiInsights] : mockAiInsights,
        // Demo Mode (5-Minute Guided Tour)
        isDemoMode,
        demoStep,
        isAutoPlaying,
        setIsAutoPlaying,
        startDemoMode,
        exitDemoMode,
        jumpToDemoStep,
        nextDemoStep,
        prevDemoStep,
        demoTeams,
        demoHackathon,
        showToast,
        // Real GitHub Integration
        githubUser,
        githubConnectedRepo,
        isGithubLoading,
        githubError,
        checkGitHubAuthStatus,
        fetchGitHubRepos,
        associateGitHubRepo,
        syncGitHubTelemetry,
        disconnectGitHub,
        connectDirectToken,
        // Supabase Auth Integration
        supabaseUser,
        isSupabaseConfigured,
        supabaseSignIn,
        supabaseSignUp,
        supabaseSignOut,
        supabaseSignInWithGitHub,
        // GitHub App Integration
        githubAppStatus,
        checkGitHubAppStatus,
        fetchGitHubAppRepos,
        associateGitHubAppRepo,
        disconnectGitHubApp
      }}
    >
      {children}

      {/* Celebratory Badge / XP Unlock Modal */}
      {unlockModalData && (
        <BadgeUnlockModal
          data={unlockModalData}
          onClose={() => setUnlockModalData(null)}
        />
      )}

      {/* Universal Floating Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span style={{ fontSize: '1.2rem' }}>
              {toast.type === 'xp' ? '⚡' : toast.type === 'role' ? '🛡️' : '🔔'}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{toast.message}</div>
            </div>
          </div>
        ))}
      </div>
    </HackForgeContext.Provider>
  );
}

export function useHackForge() {
  const context = useContext(HackForgeContext);
  if (!context) {
    throw new Error("useHackForge must be used within a HackForgeProvider");
  }
  return context;
}
