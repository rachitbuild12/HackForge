/**
 * Supabase Metadata Persistence Service
 * Persists minimal GitHub App installation and repository records.
 * Gracefully falls back to local in-memory storage when Supabase environment variables are omitted.
 */

// In-memory fallback stores
const memoryInstallations = new Map();
const memoryProjectRepositories = new Map();
const memoryProjectActivities = new Map();

export class SupabaseService {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    this.isConfigured = Boolean(this.supabaseUrl && this.supabaseKey);
    
    if (this.isConfigured) {
      console.log('⚡ Supabase persistence layer connected:', this.supabaseUrl);
    } else {
      console.log('ℹ️ Supabase not configured in .env; operating with secure in-memory store.');
    }
  }

  // 1. Save or Update Installation
  async saveInstallation(data) {
    memoryInstallations.set(String(data.installation_id), {
      ...data,
      updated_at: new Date().toISOString()
    });

    if (!this.isConfigured) return;

    try {
      const endpoint = `${this.supabaseUrl}/rest/v1/github_app_installations`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          installation_id: data.installation_id,
          account_login: data.account_login,
          account_id: data.account_id,
          account_type: data.account_type || 'User',
          account_avatar_url: data.account_avatar_url,
          repository_selection: data.repository_selection || 'selected',
          permissions: data.permissions || {}
        })
      });
    } catch (err) {
      console.warn('[Supabase] Failed saving installation, retained in memory:', err.message);
    }
  }

  // 2. Save or Update Project Associated Repository
  async saveProjectRepository(data) {
    memoryProjectRepositories.set(data.project_id, {
      ...data,
      updated_at: new Date().toISOString()
    });

    if (!this.isConfigured) return;

    try {
      const endpoint = `${this.supabaseUrl}/rest/v1/project_github_repositories`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          project_id: data.project_id,
          installation_id: data.installation_id,
          repository_id: data.repository_id,
          owner_login: data.owner_login,
          name: data.name,
          full_name: data.full_name,
          default_branch: data.default_branch || 'main',
          html_url: data.html_url,
          is_private: Boolean(data.is_private),
          commits_count: data.commits_count || 0,
          open_issues_count: data.open_issues_count || 0,
          lines_changed: data.lines_changed || '+0 / -0',
          latest_commit: data.latest_commit || null,
          synced_at: new Date().toISOString()
        })
      });
    } catch (err) {
      console.warn('[Supabase] Failed saving project repository, retained in memory:', err.message);
    }
  }

  // 3. Save Project Activities
  async saveProjectActivities(projectId, activities = []) {
    memoryProjectActivities.set(projectId, activities);

    if (!this.isConfigured || activities.length === 0) return;

    try {
      const endpoint = `${this.supabaseUrl}/rest/v1/project_github_activities`;
      const records = activities.slice(0, 50).map(a => ({
        id: a.id,
        project_id: projectId,
        type: a.type,
        title: a.title,
        author_name: a.author?.name || 'Anonymous',
        author_login: a.author?.login || null,
        author_avatar: a.author?.avatar || null,
        branch: a.branch || null,
        hash: a.hash || null,
        number: a.number || null,
        state: a.state || null,
        url: a.url || null,
        timestamp: a.timestamp
      }));

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify(records)
      });
    } catch (err) {
      console.warn('[Supabase] Failed saving project activities, retained in memory:', err.message);
    }
  }

  // 4. Retrieve Repository by Project ID
  async getProjectRepository(projectId) {
    if (this.isConfigured) {
      try {
        const endpoint = `${this.supabaseUrl}/rest/v1/project_github_repositories?project_id=eq.${encodeURIComponent(projectId)}&limit=1`;
        const res = await fetch(endpoint, {
          headers: {
            apikey: this.supabaseKey,
            Authorization: `Bearer ${this.supabaseKey}`,
            Accept: 'application/json'
          }
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list[0];
          }
        }
      } catch (err) {
        console.warn('[Supabase] Read error, falling back to memory:', err.message);
      }
    }

    return memoryProjectRepositories.get(projectId) || null;
  }

  // 5. Delete Project Repository (Disconnect)
  async deleteProjectRepository(projectId) {
    memoryProjectRepositories.delete(projectId);
    memoryProjectActivities.delete(projectId);

    if (!this.isConfigured) return;

    try {
      const endpoint = `${this.supabaseUrl}/rest/v1/project_github_repositories?project_id=eq.${encodeURIComponent(projectId)}`;
      await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`
        }
      });
    } catch (err) {
      console.warn('[Supabase] Failed deleting project repository:', err.message);
    }
  }
}

export const supabaseService = new SupabaseService();
