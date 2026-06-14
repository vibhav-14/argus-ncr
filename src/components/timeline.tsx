'use client';

import { entities, links, type Entity } from '@/lib/data';

const entityColors: Record<string, string> = {
  person: '#3b82f6', location: '#22c55e', vehicle: '#eab308',
  organization: '#a855f7', event: '#f97316', communication: '#06b6d4', financial: '#ef4444',
};

interface TimelineEvent {
  id: string;
  timestamp: string;
  entity: Entity;
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export default function Timeline() {
  // Build timeline from entities with timestamps
  const timelineEvents: TimelineEvent[] = [];

  entities.forEach(e => {
    if (e.timestamp) {
      timelineEvents.push({
        id: e.id,
        timestamp: e.timestamp,
        entity: e,
        type: e.type,
        description: e.name,
        severity: (e.riskScore ?? 0) >= 80 ? 'critical' : (e.riskScore ?? 0) >= 60 ? 'high' : (e.riskScore ?? 0) >= 40 ? 'medium' : 'low',
      });
    }
  });

  // Add link events
  links.forEach(l => {
    if (l.timestamp) {
      const src = entities.find(e => e.id === l.source);
      const tgt = entities.find(e => e.id === l.target);
      if (src && tgt) {
        timelineEvents.push({
          id: l.id,
          timestamp: l.timestamp,
          entity: src,
          type: 'link',
          description: `${src.name} → ${tgt.name} (${l.type.replace(/_/g, ' ')})`,
          severity: (l.weight ?? 0) >= 0.8 ? 'critical' : (l.weight ?? 0) >= 0.6 ? 'high' : 'medium',
        });
      }
    }
  });

  // Sort by timestamp
  timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Group by date
  const grouped = timelineEvents.reduce((acc, event) => {
    const date = formatDate(event.timestamp);
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const severityColors = {
    critical: 'var(--accent-red)', high: 'var(--accent-orange)', medium: 'var(--accent-yellow)', low: 'var(--accent-green)',
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--accent-cyan)' }}>Event Timeline</h1>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Chronological analysis of intelligence events — {timelineEvents.length} events across {Object.keys(grouped).length} days
            </p>
          </div>
        </div>

        <div className="relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'var(--border)' }} />

          {Object.entries(grouped).map(([date, events]) => (
            <div key={date} className="mb-6">
              {/* Date header */}
              <div className="relative mb-3">
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{
                  background: 'var(--bg-card)', border: '2px solid var(--accent-cyan)',
                }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-cyan)' }}>{date}</span>
                <span className="ml-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>{events.length} events</span>
              </div>

              {/* Events */}
              <div className="space-y-2 ml-2">
                {events.map(event => (
                  <div key={event.id} className="relative pl-6 pb-3">
                    {/* Event dot on line */}
                    <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full" style={{
                      background: severityColors[event.severity],
                      boxShadow: `0 0 6px ${severityColors[event.severity]}`,
                    }} />

                    <div className="argus-card p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-right shrink-0" style={{ minWidth: '45px' }}>
                          <div className="text-sm font-mono font-bold" style={{ color: 'var(--accent-cyan)' }}>
                            {formatTime(event.timestamp)}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block" style={{
                            background: `${severityColors[event.severity]}15`, color: severityColors[event.severity],
                          }}>
                            {event.severity}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: entityColors[event.type] }} />
                            <span className="text-[10px] uppercase tracking-wider" style={{ color: entityColors[event.type] }}>
                              {event.type}
                            </span>
                          </div>
                          <div className="text-sm font-medium">{event.description}</div>

                          {/* Entity properties summary */}
                          {event.entity.properties && (
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {Object.entries(event.entity.properties).slice(0, 4).map(([key, val]) => (
                                <span key={key} className="text-[9px] px-1.5 py-0.5 rounded" style={{
                                  background: 'var(--bg-secondary)', color: 'var(--text-secondary)'
                                }}>
                                  {key}: {String(val).slice(0, 20)}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Tags */}
                          {event.entity.tags && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {event.entity.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded" style={{
                                  background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)',
                                  border: '1px solid rgba(59, 130, 246, 0.2)',
                                }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Risk Score */}
                        <div className="text-center shrink-0">
                          <div className="text-lg font-bold" style={{ color: severityColors[event.severity] }}>
                            {event.entity.riskScore}
                          </div>
                          <div className="text-[8px] uppercase" style={{ color: 'var(--text-secondary)' }}>Risk</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
