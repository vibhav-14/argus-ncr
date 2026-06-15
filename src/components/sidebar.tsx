'use client';

import { useState } from 'react';
import {
  Map, GitBranch, Clock, AlertTriangle, BarChart3,
  Search, Bell, Settings, Activity, Database, Radio, Newspaper, Brain, Crosshair
} from 'lucide-react';
import OuroborosLogo from './ouroboros-logo';

export type View = 'dashboard' | 'geospatial' | 'graph' | 'timeline' | 'alerts' | 'dataview' | 'phase2' | 'phase3' | 'phase45';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  alertCount: number;
}

const navItems: { id: View; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'geospatial', icon: Map, label: 'Geo-Spatial' },
  { id: 'graph', icon: GitBranch, label: 'Graph Analysis' },
  { id: 'timeline', icon: Clock, label: 'Timeline' },
  { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
  { id: 'dataview', icon: Database, label: 'Data Explorer' },
  { id: 'phase2', icon: Newspaper, label: 'Live Feeds (P2)' },
  { id: 'phase3', icon: Brain, label: 'AI Analysis (P3)' },
  { id: 'phase45', icon: Crosshair, label: 'Ops & Predict (P4-5)' },
];

export default function Sidebar({ currentView, onViewChange, alertCount }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col" style={{ width: '220px', minWidth: '220px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <OuroborosLogo size={30} />
        <div>
          <div className="text-sm font-bold tracking-wider" style={{ color: 'var(--accent-cyan)' }}>ARGUS-NCR</div>
          <div className="text-[10px] tracking-widest" style={{ color: 'var(--text-secondary)' }}>ARGUS INTEL</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 relative">
        <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search entities..."
          className="argus-search text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                active ? 'font-medium' : ''
              }`}
              style={{
                background: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                borderLeft: active ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.id === 'alerts' && alertCount > 0 && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'var(--accent-red)', color: 'white' }}>
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-4 py-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <Activity size={12} style={{ color: 'var(--accent-green)' }} />
          <span>System Online</span>
          <span className="ml-auto" style={{ color: 'var(--accent-green)' }}>●</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <Radio size={12} style={{ color: 'var(--accent-cyan)' }} />
          <span>Feeds Active: 7</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <Database size={12} />
          <span>Data: NCR Region</span>
        </div>
      </div>

      {/* Timestamp */}
      <div className="px-4 py-2 text-[10px] text-center" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <div>CLASSIFICATION: SECRET</div>
        <div>Session: {new Date().toISOString().slice(0, 10)}</div>
      </div>
    </div>
  );
}
