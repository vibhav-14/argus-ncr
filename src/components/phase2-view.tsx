'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Car, Shield, AlertTriangle, MapPin, ExternalLink, Radio, Camera } from 'lucide-react';

interface Phase2Data {
  generatedAt: string;
  news: Array<{ source: string; title: string; description: string; link: string; pubDate: string }>;
  beatReports: Array<{
    id: string; name: string; properties: Record<string, any>;
    location: { lat: number; lng: number; address: string };
    timestamp: string; riskScore: number; tags: string[];
  }>;
  anprHits: Array<{
    id: string; name: string; properties: Record<string, any>;
    location: { lat: number; lng: number; address: string };
    timestamp: string; riskScore: number; tags: string[];
  }>;
  stats: { newsArticles: number; beatReports: number; anprHits: number; flaggedVehicles: number };
}

const emptyData: Phase2Data = { generatedAt: '', news: [], beatReports: [], anprHits: [], stats: { newsArticles: 0, beatReports: 0, anprHits: 0, flaggedVehicles: 0 } };

export default function Phase2View() {
  const [data, setData] = useState<Phase2Data>(emptyData);
  const [tab, setTab] = useState<'news' | 'beat' | 'anpr'>('news');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/phase2-feed.json?t=' + Date.now());
        if (res.ok) setData(await res.json());
      } catch { /* use empty */ }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }); }
    catch { return '--:--'; }
  };

  const formatDate = (ts: string) => {
    try { return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    catch { return '--'; }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--accent-cyan)' }}>
            Phase 2 — Live Data Connectors
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Real-time feeds: News scraper · Beat analytics · ANPR tracker
            {data.generatedAt && <span className="ml-2" style={{ color: 'var(--accent-green)' }}>● Last run: {formatTime(data.generatedAt)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-green)' }}>
          <Radio size={12} className="pulse-critical" />
          LIVE FEEDS
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="argus-card p-3 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent-cyan)' }}>{data.stats.newsArticles}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>News Articles</div>
        </div>
        <div className="argus-card p-3 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent-orange)' }}>{data.stats.beatReports}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Beat Reports</div>
        </div>
        <div className="argus-card p-3 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent-purple)' }}>{data.stats.anprHits}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>ANPR Hits</div>
        </div>
        <div className="argus-card p-3 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent-red)' }}>{data.stats.flaggedVehicles}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Flagged Vehicles</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1">
        {[
          { id: 'news' as const, icon: Newspaper, label: '📰 News Feed', count: data.stats.newsArticles, color: 'var(--accent-cyan)' },
          { id: 'beat' as const, icon: Shield, label: '🚔 Beat Analytics', count: data.stats.beatReports, color: 'var(--accent-orange)' },
          { id: 'anpr' as const, icon: Camera, label: '📸 ANPR Tracker', count: data.stats.anprHits, color: 'var(--accent-green)' },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2 px-4 py-2 rounded-t-md text-xs transition-all"
              style={{
                background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                color: tab === t.id ? t.color : 'var(--text-secondary)',
                borderBottom: tab === t.id ? `2px solid ${t.color}` : '2px solid transparent',
              }}
            >
              <Icon size={14} />
              {t.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="argus-card p-4" style={{ borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        {/* NEWS TAB */}
        {tab === 'news' && (
          <div className="space-y-3">
            {data.news.length === 0 && (
              <div className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Newspaper size={32} className="mx-auto mb-2 opacity-30" />
                No articles loaded. Run the Phase 2 connectors to fetch live news.
              </div>
            )}
            {data.news.map((article, i) => (
              <div key={i} className="flex gap-3 p-2.5 rounded-md" style={{ background: 'var(--bg-secondary)', borderLeft: '2px solid var(--accent-cyan)' }}>
                <div className="text-[10px] shrink-0 px-2 py-1 rounded text-center" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', minWidth: '60px' }}>
                  {article.source}
                </div>
                <div className="flex-1 min-w-0">
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline flex items-start gap-1" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                    <ExternalLink size={10} className="shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                  </a>
                  {article.description && (
                    <p className="text-[10px] mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{article.description}</p>
                  )}
                </div>
                <div className="text-[10px] shrink-0 font-mono" style={{ color: 'var(--text-secondary)' }}>{formatDate(article.pubDate)}</div>
              </div>
            ))}
          </div>
        )}

        {/* BEAT TAB */}
        {tab === 'beat' && (
          <div className="space-y-3">
            {data.beatReports.map(report => {
              const riskColor = (report.riskScore ?? 0) >= 60 ? 'var(--accent-red)' : (report.riskScore ?? 0) >= 40 ? 'var(--accent-orange)' : 'var(--accent-yellow)';
              return (
                <div key={report.id} className="flex items-center gap-3 p-2.5 rounded-md" style={{
                  background: 'var(--bg-secondary)',
                  borderLeft: `3px solid ${riskColor}`,
                }}>
                  <div className="text-center shrink-0" style={{ minWidth: '50px' }}>
                    <div className="text-lg font-bold" style={{ color: riskColor }}>{report.riskScore}</div>
                    <div className="text-[8px] uppercase" style={{ color: 'var(--text-secondary)' }}>Risk</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium capitalize">{report.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin size={10} /> {report.properties.district}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--accent-cyan)' }}>{report.properties.rate}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>
                        {report.properties.crimeType?.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    {formatTime(report.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ANPR TAB */}
        {tab === 'anpr' && (
          <div className="space-y-3">
            {data.anprHits.map(hit => {
              const flagged = hit.properties.flagged;
              const riskColor = flagged ? 'var(--accent-red)' : 'var(--accent-blue)';
              return (
                <div key={hit.id} className="flex items-center gap-3 p-2.5 rounded-md" style={{
                  background: flagged ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-secondary)',
                  borderLeft: `3px solid ${riskColor}`,
                }}>
                  <div className="p-2 rounded-lg shrink-0" style={{ background: flagged ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.1)' }}>
                    <Car size={18} style={{ color: riskColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold" style={{ color: riskColor }}>{hit.properties.plate}</span>
                      {flagged && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-red)' }}>
                          ⚠ FLAGGED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      {hit.properties.vehicle} · {hit.properties.owner} · {hit.properties.direction}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <Camera size={10} /> {hit.properties.location}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{hit.properties.confidence}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{formatTime(hit.timestamp)}</div>
                    <div className="text-[10px]" style={{ color: riskColor }}>{hit.riskScore}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sources Footer */}
      <div className="text-center text-[9px]" style={{ color: 'var(--text-secondary)' }}>
        Sources: TOI Delhi · The Hindu · Indian Express · NDTV · Hindustan Times · Delhi Police Beat · ANPR Camera Network
      </div>
    </div>
  );
}
