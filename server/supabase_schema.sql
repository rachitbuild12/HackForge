-- ====================================================================
-- HACKFORGE // GITHUB APP INTEGRATION SUPABASE SCHEMA
-- Minimal Required Metadata Persistence with Row Level Security (RLS)
-- ====================================================================

-- 1. GitHub App Installations Table
-- Stores metadata for installed GitHub Apps per team / account
CREATE TABLE IF NOT EXISTS public.github_app_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id BIGINT UNIQUE NOT NULL,
    account_login TEXT NOT NULL,
    account_id BIGINT NOT NULL,
    account_type TEXT DEFAULT 'User', -- 'User' | 'Organization'
    account_avatar_url TEXT,
    repository_selection TEXT DEFAULT 'selected', -- 'all' | 'selected'
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on installation_id for instant lookups
CREATE INDEX IF NOT EXISTS idx_github_installations_id 
ON public.github_app_installations(installation_id);

-- 2. Project Associated GitHub Repositories Table
-- Links a HackForge hackathon team/project to an authorized repository
CREATE TABLE IF NOT EXISTS public.project_github_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL UNIQUE,
    installation_id BIGINT REFERENCES public.github_app_installations(installation_id) ON DELETE SET NULL,
    repository_id BIGINT NOT NULL,
    owner_login TEXT NOT NULL,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    default_branch TEXT DEFAULT 'main',
    html_url TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    commits_count INTEGER DEFAULT 0,
    open_issues_count INTEGER DEFAULT 0,
    lines_changed TEXT DEFAULT '+0 / -0',
    latest_commit JSONB,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on project_id and full_name
CREATE INDEX IF NOT EXISTS idx_project_github_repo_project_id 
ON public.project_github_repositories(project_id);

CREATE INDEX IF NOT EXISTS idx_project_github_repo_full_name 
ON public.project_github_repositories(full_name);

-- 3. Normalized Project Development Activities Table
-- Stores webhook & synced telemetry events (commits, PRs, issues)
CREATE TABLE IF NOT EXISTS public.project_github_activities (
    id TEXT PRIMARY KEY, -- e.g. 'gh-commit-<hash>' or 'gh-pr-<id>'
    project_id TEXT NOT NULL REFERENCES public.project_github_repositories(project_id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'COMMIT' | 'PULL_REQUEST' | 'ISSUE' | 'BRANCH'
    title TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_login TEXT,
    author_avatar TEXT,
    branch TEXT,
    hash TEXT,
    number INTEGER,
    state TEXT,
    url TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on project_id and timestamp for timeline queries
CREATE INDEX IF NOT EXISTS idx_project_activities_timeline 
ON public.project_github_activities(project_id, timestamp DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.github_app_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_github_activities ENABLE ROW LEVEL SECURITY;

-- 1. Read policies: Publicly readable for authenticated hackathon participants and judges
CREATE POLICY "Allow authenticated read for installations"
ON public.github_app_installations FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow authenticated read for project repositories"
ON public.project_github_repositories FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow authenticated read for project activities"
ON public.project_github_activities FOR SELECT
TO authenticated, anon
USING (true);

-- 2. Write policies: Only server service_role can insert/update installation & repository records
CREATE POLICY "Allow service role management of installations"
ON public.github_app_installations FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role management of project repositories"
ON public.project_github_repositories FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role management of activities"
ON public.project_github_activities FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
