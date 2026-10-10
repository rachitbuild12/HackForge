import React, { useState } from 'react';
import { Search, Filter, Trophy, Calendar, Sparkles } from 'lucide-react';
import { useHackForge } from '../context/HackForgeContext';
import HackathonCard from '../components/HackathonCard';

export default function HackathonDiscovery() {
  const { hackathons } = useHackForge();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trackFilter, setTrackFilter] = useState('ALL');

  const tracks = ['ALL', 'Autonomous Agents', 'Zero-Knowledge Proofs', 'DeFi Velocity', 'Developer Copilots', 'Smart Contract Fuzzing'];

  const filteredHackathons = hackathons.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase()) ||
                          h.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;
    const matchesTrack = trackFilter === 'ALL' || h.tracks.some(t => t.name === trackFilter);
    return matchesSearch && matchesStatus && matchesTrack;
  });

  return (
    <div className="page-wrapper">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">
              SPRINT RADAR
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              VERIFIED BOUNTY POOLS
            </span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Hackathon Discovery</h1>
          <p className="page-subtitle">
            Explore active, upcoming, and sponsored global hackathons running on HackForge OS.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '28px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by title, track, or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Status filter tabs */}
          <div className="hud-tabs">
            {['ALL', 'LIVE', 'UPCOMING'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`hud-tab ${statusFilter === status ? 'active' : ''}`}
                style={{ fontSize: '0.78rem' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Track filter pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px' }}>
            <Filter size={12} /> Tracks:
          </span>
          {tracks.map(t => (
            <button
              key={t}
              onClick={() => setTrackFilter(t)}
              className={`badge ${trackFilter === t ? 'badge-cyan' : 'badge-muted'}`}
              style={{ cursor: 'pointer', border: trackFilter === t ? '1px solid var(--accent-cyan)' : undefined }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Hackathons Grid */}
      {filteredHackathons.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <Sparkles size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3>No hackathons found matching filters</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
            Try resetting your search query or track filters.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setSearch(''); setStatusFilter('ALL'); setTrackFilter('ALL'); }}
            style={{ marginTop: '16px' }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredHackathons.map(h => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      )}

    </div>
  );
}
