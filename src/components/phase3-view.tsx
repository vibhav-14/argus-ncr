'use client';

import { useState, useEffect } from 'react';
import { Brain, Link2, TrendingUp, AlertTriangle, Users, Building2, MapPin, ArrowUp, ArrowDown, Minus, Activity } from 'lucide-react';

interface P3Data {
  generatedAt: string;
  entityExtraction: {
    extracted: { persons: string[]; organizations: string[]; locations: string[] };
    stats: { persons: number; organizations: number; locations: number; articles: number };
  };
  relationshipDiscovery: Array<{
    id: string; source: string; sourceType: string; target: string; targetType: string;
    evidence: string; evidenceSource: string; confidence: number; method: string; timestamp: string;
    extractedName?: string; matchedEntityId?: string; matchedEntityName?: string;
  }>;
  riskScores: Array<{
    entityId: string; entityName: string; entityType: string;
    baseScore: number; dynamicScore: number; delta: number;
    adjustments: Array<{ factor: string; delta: number; detail: string }>;
    trend: string;
  }>;
  anomalies: Array<{
    id: string; type: string; entity: string; description: string;
    severity: string; value: number; baseline: number; deviation: number; timestamp: string;
  }>;
  stats: { extractedEntities: number; discoveredRelationships: number; riskRecalculations: number; anomaliesDetected: number; criticalAnomalies: number };
}

const emptyData: P3Data = {
  generatedAt: '', entityExtraction: { extracted: { persons: [], organizations: [], locations: [] }, stats: { persons: 0, organizations: 0, locations: 0, articles: 0 } },
  relationshipDiscovery: [], riskScores: [], anomalies: [],
  stats: { extractedEntities: 0, discoveredRelationships: 0, riskRecalculations: 0, anomaliesDetected: 0, criticalAnomalies: 0 },
};

const trendIcon = (t: string) => t === 'escalating' ? <ArrowUp size={12} /> : t === 'declining' ? <ArrowDown size={12} /> : <Minus size={12} />;

export default function Phase3View() {
  const [data, setData] = useState<P3Data>(emptyData);
  const [tab, setTab] = useState<'extraction' | 'relationships' | 'risk' | 'anomalies'>('extraction');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/phase3-feed.json?t=' + Date.now());
        if (res.ok) setData(await res.json());
      } catch {}
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }); }
    catch { return '--:--'; }
  };

  const severityColor = (s: string) => s === 'critical' ? 'var(--accent-red)' : s === 'high' ? 'var(--accent-orange)' : 'var(--accent-yellow)';

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--accent-purple)' }}>
            Phase 3 — AI-Powered Analysis
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Entity extraction · Relationship discovery · Dynamic risk scoring · Anomaly detection
            {data.generatedAt && <span className="ml-2" style={{ color: 'var(--accent-green)' }}>● Engine: {formatTime(data.generatedAt)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(168, 85, 247, 0.12)', color: 'var(--accent-purple)' }}>
          <Brain size={12} /> AI ENGINE
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Entities Extracted', value: data.stats.extractedEntities, color: 'var(--accent-cyan)', icon: Users },
          { label: 'Relationships Found', value: data.stats.discoveredRelationships, color: 'var(--accent-green)', icon: Link2 },
          { label: 'Risk Recalculations', value: data.stats.riskRecalculations, color: 'var(--accent-orange)', icon: TrendingUp },
          { label: 'Anomalies Detected', value: data.stats.anomaliesDetected, color: 'var(--accent-yellow)', icon: AlertTriangle },
          { label: 'Critical Anomalies', value: data.stats.criticalAnomalies, color: 'var(--accent-red)', icon: Activity },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="argus-card p-3 text-center">
              <Icon size={18} className="mx-auto mb-1" style={{ color: s.color }} />
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {[
          { id: 'extraction' as const, label: '🧠 Entity Extraction', color: 'var(--accent-cyan)' },
          { id: 'relationships' as const, label: '🔗 Relationships', color: 'var(--accent-green)' },
          { id: 'risk' as const, label: '📈 Dynamic Risk', color: 'var(--accent-orange)' },
          { id: 'anomalies' as const, label: '🔊 Anomalies', color: 'var(--accent-red)' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-t-md text-xs transition-all"
            style={{
              background: tab === t.id ? 'var(--bg-card)' : 'transparent',
              color: tab === t.id ? t.color : 'var(--text-secondary)',
              borderBottom: tab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="argus-card p-4" style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>

        {/* EXTRACTION TAB */}
        {tab === 'extraction' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Persons */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} style={{ color: 'var(--accent-blue)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Persons ({data.entityExtraction.stats.persons})
                </span>
              </div>
              <div className="space-y-1.5">
                {data.entityExtraction.extracted.persons.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded text-xs" style={{ background: 'var(--bg-secondary)', borderLeft: '2px solid var(--accent-blue)' }}>
                    <span>👤</span>
                    <span>{p}</span>
                  </div>
                ))}
                {data.entityExtraction.extracted.persons.length === 0 && (
                  <div className="text-[10px] p-2" style={{ color: 'var(--text-secondary)' }}>No persons extracted from current news</div>
                )}
              </div>
            </div>
            {/* Organizations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={14} style={{ color: 'var(--accent-purple)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Organizations ({data.entityExtraction.stats.organizations})
                </span>
              </div>
              <div className="space-y-1.5">
                {data.entityExtraction.extracted.organizations.map((o, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded text-xs" style={{ background: 'var(--bg-secondary)', borderLeft: '2px solid var(--accent-purple)' }}>
                    <span>🏢</span>
                    <span>{o}</span>
                  </div>
                ))}
                {data.entityExtraction.extracted.organizations.length === 0 && (
                  <div className="text-[10px] p-2" style={{ color: 'var(--text-secondary)' }}>No organizations extracted from current news</div>
                )}
              </div>
            </div>
            {/* Locations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} style={{ color: 'var(--accent-green)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Locations ({data.entityExtraction.stats.locations})
                </span>
              </div>
              <div className="space-y-1.5">
                {data.entityExtraction.extracted.locations.map((l, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded text-xs" style={{ background: 'var(--bg-secondary)', borderLeft: '2px solid var(--accent-green)' }}>
                    <span>📍</span>
                    <span>{l}</span>
                  </div>
                ))}
                {data.entityExtraction.extracted.locations.length === 0 && (
                  <div className="text-[10px] p-2" style={{ color: 'var(--text-secondary)' }}>No locations extracted from current news</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RELATIONSHIPS TAB */}
        {tab === 'relationships' && (
          <div className="space-y-3">
            {data.relationshipDiscovery.length === 0 && (
              <div className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Link2 size={32} className="mx-auto mb-2 opacity-30" />
                No relationships discovered yet. Run Phase 2 + Phase 3 connectors.
              </div>
            )}
            {data.relationshipDiscovery.map(r => (
              <div key={r.id} className="p-3 rounded-md" style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-green)' }}>
                {r.method === 'name-match' ? (
                  <div>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-medium" style={{ color: 'var(--accent-cyan)' }}>{r.extractedName}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>→</span>
                      <span className="font-medium" style={{ color: 'var(--accent-blue)' }}>{r.matchedEntityName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>NAME MATCH</span>
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Evidence: {r.evidence}</div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span style={{ color: 'var(--accent-blue)' }}>{r.source}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>↔</span>
                      <span style={{ color: 'var(--accent-green)' }}>{r.target}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)' }}>CO-OCCURRENCE</span>
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Evidence: {r.evidence} — {r.evidenceSource}</div>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${r.confidence}%`, background: r.confidence >= 80 ? 'var(--accent-green)' : r.confidence >= 60 ? 'var(--accent-yellow)' : 'var(--accent-orange)' }} />
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{r.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RISK TAB */}
        {tab === 'risk' && (
          <div className="space-y-3">
            {data.riskScores.length === 0 && (
              <div className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <TrendingUp size={32} className="mx-auto mb-2 opacity-30" />
                No risk score adjustments yet.
              </div>
            )}
            {data.riskScores.sort((a, b) => b.delta - a.delta).map(r => (
              <div key={r.entityId} className="p-3 rounded-md" style={{
                background: 'var(--bg-secondary)',
                borderLeft: `3px solid ${r.trend === 'escalating' ? 'var(--accent-red)' : r.trend === 'declining' ? 'var(--accent-green)' : 'var(--accent-yellow)'}`,
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5" style={{ color: r.trend === 'escalating' ? 'var(--accent-red)' : r.trend === 'declining' ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
                    {trendIcon(r.trend)}
                  </div>
                  <span className="text-xs font-medium">{r.entityName}</span>
                  <span className="text-[9px] uppercase" style={{ color: 'var(--text-secondary)' }}>{r.entityType}</span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{
                    background: r.trend === 'escalating' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: r.trend === 'escalating' ? 'var(--accent-red)' : 'var(--accent-green)',
                  }}>
                    {r.trend.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>{r.baseScore}</div>
                    <div className="text-[8px] uppercase" style={{ color: 'var(--text-secondary)' }}>Base</div>
                  </div>
                  <div style={{ color: r.delta > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>→</div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: r.dynamicScore >= 70 ? 'var(--accent-red)' : r.dynamicScore >= 50 ? 'var(--accent-orange)' : 'var(--accent-yellow)' }}>{r.dynamicScore}</div>
                    <div className="text-[8px] uppercase" style={{ color: 'var(--text-secondary)' }}>Dynamic</div>
                  </div>
                  <div className="text-xs font-mono" style={{ color: r.delta > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    ({r.delta > 0 ? '+' : ''}{r.delta})
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {r.adjustments.map((a, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{
                      background: a.delta > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                      color: a.delta > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
                    }}>
                      {a.factor.replace(/_/g, ' ')}: {a.delta > 0 ? '+' : ''}{a.delta} ({a.detail})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANOMALIES TAB */}
        {tab === 'anomalies' && (
          <div className="space-y-3">
            {data.anomalies.length === 0 && (
              <div className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <AlertTriangle size={32} className="mx-auto mb-2 opacity-30" />
                No anomalies detected. System operating within normal parameters.
              </div>
            )}
            {data.anomalies.map(a => (
              <div key={a.id} className="p-3 rounded-md" style={{
                background: a.severity === 'critical' ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-secondary)',
                borderLeft: `3px solid ${severityColor(a.severity)}`,
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase" style={{
                    background: `${severityColor(a.severity)}15`, color: severityColor(a.severity),
                  }}>
                    {a.severity}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    {a.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs font-medium mb-1">{a.entity}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{a.description}</div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-[10px]">
                    <span style={{ color: 'var(--text-secondary)' }}>Value:</span>
                    <span className="font-mono" style={{ color: severityColor(a.severity) }}>{a.value}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span style={{ color: 'var(--text-secondary)' }}>Baseline:</span>
                    <span className="font-mono">{a.baseline}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span style={{ color: 'var(--text-secondary)' }}>Deviation:</span>
                    <span className="font-mono" style={{ color: a.deviation > 100 ? 'var(--accent-red)' : 'var(--accent-orange)' }}>+{a.deviation}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Engine Info Footer */}
      <div className="text-center text-[9px]" style={{ color: 'var(--text-secondary)' }}>
        NER: Pattern-based Indian name extraction · Relationships: Co-occurrence analysis · Risk: Behavioral deviation model · Anomalies: Statistical baseline + threshold
      </div>
    </div>
  );
}
