'use client';

import { entities, links, type Entity } from '@/lib/data';
import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Eye, ChevronDown, ChevronRight } from 'lucide-react';

const entityColors: Record<string, string> = {
  person: '#3b82f6', location: '#22c55e', vehicle: '#eab308',
  organization: '#a855f7', event: '#f97316', communication: '#06b6d4', financial: '#ef4444',
};

const entityIcons: Record<string, string> = {
  person: '👤', location: '📍', vehicle: '🚗',
  organization: '🏢', event: '⚡', communication: '📡', financial: '💰',
};

export default function DataView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'riskScore' | 'type'>('riskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const filteredEntities = useMemo(() => {
    let result = [...entities];

    if (filterType !== 'all') {
      result = result.filter(e => e.type === filterType);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        (e.tags || []).some(t => t.toLowerCase().includes(q)) ||
        Object.values(e.properties).some(v => String(v).toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'riskScore') cmp = (a.riskScore ?? 0) - (b.riskScore ?? 0);
      else cmp = a.type.localeCompare(b.type);
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [searchQuery, filterType, sortBy, sortDir]);

  const getConnectionCount = (id: string) => links.filter(l => l.source === id || l.target === id).length;

  return (
    <div className="h-full flex">
      {/* List View */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search entities, tags, properties..."
              className="argus-search text-xs"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter size={12} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs px-2 py-1.5 rounded border-0 outline-none"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Types</option>
              <option value="person">Person</option>
              <option value="location">Location</option>
              <option value="vehicle">Vehicle</option>
              <option value="organization">Organization</option>
              <option value="event">Event</option>
              <option value="communication">Communication</option>
              <option value="financial">Financial</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (sortBy === 'riskScore') setSortDir(d => d === 'desc' ? 'asc' : 'desc');
              else { setSortBy('riskScore'); setSortDir('desc'); }
            }}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
          >
            <ArrowUpDown size={12} />
            Risk {sortDir === 'desc' ? '↓' : '↑'}
          </button>

          <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            {filteredEntities.length} entities
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 grid grid-cols-[40px_1fr_100px_80px_80px_60px] gap-2 px-4 py-2 text-[10px] uppercase tracking-wider" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
            <div></div>
            <div>Name</div>
            <div>Type</div>
            <div>Risk</div>
            <div>Links</div>
            <div></div>
          </div>

          {filteredEntities.map(entity => {
            const isExpanded = expandedId === entity.id;
            const connections = links.filter(l => l.source === entity.id || l.target === entity.id);
            const color = entityColors[entity.type];

            return (
              <div key={entity.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <div
                  className="grid grid-cols-[40px_1fr_100px_80px_80px_60px] gap-2 px-4 py-2.5 items-center cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                  onClick={() => setExpandedId(isExpanded ? null : entity.id)}
                >
                  <div className="text-center">{entityIcons[entity.type]}</div>
                  <div className="text-xs font-medium truncate">{entity.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] uppercase" style={{ color }}>{entity.type}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                        <div className="h-full rounded-full" style={{
                          width: `${entity.riskScore}%`,
                          background: (entity.riskScore ?? 0) >= 80 ? 'var(--accent-red)' : (entity.riskScore ?? 0) >= 60 ? 'var(--accent-orange)' : (entity.riskScore ?? 0) >= 40 ? 'var(--accent-yellow)' : 'var(--accent-green)'
                        }} />
                      </div>
                      <span className="text-[10px] font-mono">{entity.riskScore}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{connections.length}</div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedEntity(entity); }} className="p-0.5" style={{ color: 'var(--accent-cyan)' }}>
                      <Eye size={12} />
                    </button>
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-3 grid grid-cols-2 gap-4" style={{ background: 'rgba(26, 34, 53, 0.5)' }}>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Properties</div>
                      <div className="space-y-1">
                        {Object.entries(entity.properties).map(([k, v]) => (
                          <div key={k} className="flex text-xs">
                            <span className="w-32 shrink-0" style={{ color: 'var(--text-secondary)' }}>{k}</span>
                            <span className="font-mono text-[11px]">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Connections</div>
                      <div className="space-y-1">
                        {connections.slice(0, 5).map(l => {
                          const otherId = l.source === entity.id ? l.target : l.source;
                          const other = entities.find(e => e.id === otherId);
                          return other ? (
                            <div key={l.id} className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: entityColors[other.type] }} />
                              <span>{other.name}</span>
                              <span className="text-[9px] ml-auto" style={{ color: 'var(--text-secondary)' }}>{l.type.replace(/_/g, ' ')}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      {entity.tags && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {entity.tags.map(tag => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded" style={{
                                background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedEntity && (
        <div className="entity-panel w-80 p-4 overflow-y-auto" style={{ borderLeft: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider" style={{ color: entityColors[selectedEntity.type] }}>
              {selectedEntity.type}
            </div>
            <button onClick={() => setSelectedEntity(null)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>✕</button>
          </div>

          <h2 className="text-lg font-semibold mb-2">{selectedEntity.name}</h2>

          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Risk Score</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${selectedEntity.riskScore}%`,
                  background: (selectedEntity.riskScore ?? 0) >= 80 ? 'var(--accent-red)' : (selectedEntity.riskScore ?? 0) >= 60 ? 'var(--accent-orange)' : (selectedEntity.riskScore ?? 0) >= 40 ? 'var(--accent-yellow)' : 'var(--accent-green)'
                }} />
              </div>
              <span className="text-sm font-bold">{selectedEntity.riskScore}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Properties</div>
            <div className="space-y-1.5">
              {Object.entries(selectedEntity.properties).map(([key, val]) => (
                <div key={key} className="flex text-xs">
                  <span className="w-28 shrink-0" style={{ color: 'var(--text-secondary)' }}>{key}</span>
                  <span className="font-mono">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedEntity.location && (
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Location</div>
              <div className="text-xs font-mono">{selectedEntity.location.address}</div>
            </div>
          )}

          {selectedEntity.tags && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tags</div>
              <div className="flex flex-wrap gap-1">
                {selectedEntity.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px]" style={{
                    background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
