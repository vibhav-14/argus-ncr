'use client';

import { alerts, dashboardStats, entities } from '@/lib/data';
import { dailyFeed as defaultFeed } from '@/lib/daily-feed';
import {
  AlertTriangle, Users, MapPin, GitBranch, Radio,
  TrendingUp, Shield, Eye, Activity, Banknote, Zap, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';

const riskColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

export default function Dashboard() {
  const [liveFeed, setLiveFeed] = useState(defaultFeed);
  const stats = dashboardStats;
  const dailyFeed = liveFeed;
  const feedStats = dailyFeed?.stats;
  const feedAlerts = dailyFeed?.alerts || [];
  const feedActivity = dailyFeed?.activity || [];

  // Poll for live feed every 30s
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/daily-feed.json?t=' + Date.now());
        if (res.ok) setLiveFeed(await res.json());
      } catch { /* use default */ }
    };
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, []);

  // Merge base alerts with daily feed alerts
  const allAlerts = [...alerts.filter(a => !a.acknowledged), ...feedAlerts.filter(a => !a.acknowledged)];
  
  // Merge activity feeds
  const allActivity = [
    ...feedActivity.map((a: any) => ({ ...a, source: 'live' })),
    ...stats.recentActivity.map((a: any) => ({ ...a, source: 'base' })),
  ].slice(0, 8);

  // Total active alerts including daily feed
  const totalActiveAlerts = stats.activeAlerts + feedAlerts.filter((a: any) => !a.acknowledged).length;
  const totalCritical = stats.criticalAlerts + feedAlerts.filter((a: any) => a.severity === 'critical').length;

  const statCards = [
    { label: 'Total Entities', value: stats.totalEntities, icon: DatabaseIcon, color: 'var(--accent-cyan)' },
    { label: 'Active Alerts', value: totalActiveAlerts, icon: AlertTriangle, color: 'var(--accent-red)', pulse: totalActiveAlerts > stats.activeAlerts },
    { label: 'Critical', value: totalCritical, icon: Shield, color: 'var(--accent-red)', pulse: true },
    { label: 'Today New Intel', value: feedStats?.newEvents || 0, icon: Zap, color: 'var(--accent-yellow)' },
    { label: 'Locations Monitored', value: stats.locationsMonitored, icon: MapPin, color: 'var(--accent-green)' },
    { label: 'Links Traced', value: stats.linksTraced, icon: GitBranch, color: 'var(--accent-purple)' },
    { label: 'Intercepts', value: stats.communicationsIntercepted + (feedStats?.newEvents || 0), icon: Radio, color: 'var(--accent-blue)' },
    { label: 'Financial Anomalies', value: stats.financialAnomalies, icon: Banknote, color: 'var(--accent-yellow)' },
  ];

  const riskData = [
    { name: 'Critical', value: stats.riskDistribution.critical, fill: '#ef4444' },
    { name: 'High', value: stats.riskDistribution.high, fill: '#f97316' },
    { name: 'Medium', value: stats.riskDistribution.medium, fill: '#eab308' },
    { name: 'Low', value: stats.riskDistribution.low, fill: '#22c55e' },
  ];

  const entityDistData = [
    { name: 'Person', count: 8 },
    { name: 'Location', count: 4 },
    { name: 'Vehicle', count: 3 },
    { name: 'Org', count: 3 },
    { name: 'Event', count: 4 + (dailyFeed?.entities?.filter((e: any) => e.type === 'event').length || 0) },
    { name: 'Comm', count: 3 + (dailyFeed?.entities?.filter((e: any) => e.type === 'communication').length || 0) },
    { name: 'Financial', count: 2 + (dailyFeed?.entities?.filter((e: any) => e.type === 'financial').length || 0) },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--accent-cyan)' }}>
            ARGUS Operations Dashboard
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Delhi NCR ARGUS Fusion Center — Real-time Situational Awareness
            {feedStats && <span className="ml-2" style={{ color: 'var(--accent-green)' }}>● Live Feed: {feedStats.lastUpdated}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-red)' }}>
            <Activity size={12} className="pulse-critical" />
            LIVE
          </div>
          {feedStats && (
            <div className="text-[10px] px-2 py-1 rounded" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>
              FEED: {feedStats.date}
            </div>
          )}
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="argus-card p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: `${card.color}15`, color: card.color }}>
                <Icon size={20} className={card.pulse ? 'pulse-critical' : ''} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: card.color }}>{card.value}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Charts + Activity */}
      <div className="grid grid-cols-3 gap-3">
        {/* Risk Distribution */}
        <div className="argus-card p-4">
          <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Risk Distribution
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" stroke="none">
                  {riskData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {riskData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span className="font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Entity Distribution */}
        <div className="argus-card p-4">
          <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Entity Distribution
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={entityDistData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a2235', border: '1px solid #2a3555', borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Activity Feed */}
        <div className="argus-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Activity Feed
            </div>
            <div className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--accent-green)' }}>
              LIVE
            </div>
          </div>
          <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
            {allActivity.map((act: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="font-mono shrink-0" style={{ color: act.source === 'live' ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>{act.time}</span>
                <span
                  className="status-dot mt-1.5 shrink-0"
                  style={{
                    background: act.severity === 'critical' ? 'var(--accent-red)' : act.severity === 'high' ? 'var(--accent-orange)' : 'var(--accent-yellow)',
                    boxShadow: `0 0 6px ${act.severity === 'critical' ? 'var(--accent-red)' : act.severity === 'high' ? 'var(--accent-orange)' : 'var(--accent-yellow)'}`
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {act.source === 'live' && <span className="text-[9px] mr-1" style={{ color: 'var(--accent-green)' }}>●</span>}
                  {act.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Feed Alerts + Base Alerts */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Feed Intake */}
        <div className="argus-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-green)' }}>
              ⚡ Today's Intelligence Intake
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              {feedStats?.newEvents || 0} signals processed
            </div>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {dailyFeed?.entities?.slice(0, 6).map((entity: any) => (
              <div key={entity.id} className="flex items-center gap-3 p-2 rounded-md" style={{
                background: (entity.riskScore ?? 0) >= 70 ? 'rgba(239, 68, 68, 0.06)' : 'rgba(59, 130, 246, 0.05)',
                borderLeft: `2px solid ${(entity.riskScore ?? 0) >= 70 ? 'var(--accent-red)' : 'var(--accent-cyan)'}`
              }}>
                <div className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>{entity.type}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate">{entity.name}</div>
                  {entity.properties?.keyPhrase && (
                    <div className="text-[10px] italic mt-0.5" style={{ color: 'var(--text-secondary)' }}>{entity.properties.keyPhrase}</div>
                  )}
                </div>
                <div className="text-[10px] font-mono" style={{ color: (entity.riskScore ?? 0) >= 70 ? 'var(--accent-red)' : 'var(--accent-yellow)' }}>
                  {entity.riskScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts (merged) */}
        <div className="argus-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-red)' }}>
              Active Alerts
            </div>
            <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-red)' }}>
              <Eye size={12} />
              {totalActiveAlerts} Unacknowledged
            </div>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {allAlerts.slice(0, 6).map((alert: any) => (
              <div key={alert.id} className="flex items-center gap-3 p-2.5 rounded-md" style={{
                background: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.08)' : alert.severity === 'high' ? 'rgba(249, 115, 22, 0.08)' : 'rgba(234, 179, 8, 0.08)',
                borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--accent-red)' : alert.severity === 'high' ? 'var(--accent-orange)' : 'var(--accent-yellow)'}`
              }}>
                <div className={`status-dot ${alert.severity === 'critical' ? 'status-critical pulse-critical' : `status-${alert.severity}`}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{alert.title}</div>
                  <div className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>{alert.description}</div>
                </div>
                <div className="text-[10px]" style={{ color: alert.acknowledged === false ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                  {alert.acknowledged === false ? 'NEW' : 'ACK'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: any) {
  const { size = 24, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
