'use client';

import { alerts, type Alert } from '@/lib/data';
import { AlertTriangle, CheckCircle, Clock, MapPin, Shield } from 'lucide-react';

export default function AlertsView() {
  const unacknowledged = alerts.filter(a => !a.acknowledged);
  const acknowledged = alerts.filter(a => a.acknowledged);

  const severityConfig = {
    critical: { color: 'var(--accent-red)', bg: 'rgba(239, 68, 68, 0.1)', icon: Shield },
    high: { color: 'var(--accent-orange)', bg: 'rgba(249, 115, 22, 0.1)', icon: AlertTriangle },
    medium: { color: 'var(--accent-yellow)', bg: 'rgba(234, 179, 8, 0.1)', icon: Clock },
    low: { color: 'var(--accent-green)', bg: 'rgba(34, 197, 94, 0.1)', icon: CheckCircle },
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--accent-red)' }}>Active Alerts</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {unacknowledged.length} unacknowledged · {acknowledged.length} acknowledged · {alerts.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}>
            <Shield size={14} />
            {alerts.filter(a => a.severity === 'critical').length} Critical
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--accent-orange)' }}>
            <AlertTriangle size={14} />
            {alerts.filter(a => a.severity === 'high').length} High
          </div>
        </div>
      </div>

      {/* Unacknowledged */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
          ⚠️ Unacknowledged ({unacknowledged.length})
        </div>
        <div className="space-y-3">
          {unacknowledged.map(alert => (
            <AlertCard key={alert.id} alert={alert} severityConfig={severityConfig} formatTimestamp={formatTimestamp} />
          ))}
        </div>
      </div>

      {/* Acknowledged */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
          ✅ Acknowledged ({acknowledged.length})
        </div>
        <div className="space-y-3">
          {acknowledged.map(alert => (
            <AlertCard key={alert.id} alert={alert} severityConfig={severityConfig} formatTimestamp={formatTimestamp} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert, severityConfig, formatTimestamp }: {
  alert: Alert;
  severityConfig: Record<string, { color: string; bg: string; icon: React.ElementType }>;
  formatTimestamp: (ts: string) => string;
}) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div className="argus-card p-4" style={{ borderLeft: `3px solid ${config.color}` }}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg shrink-0" style={{ background: config.bg, color: config.color }}>
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded" style={{
              background: config.bg, color: config.color,
            }}>
              {alert.severity}
            </span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
              {alert.id}
            </span>
          </div>
          <h3 className="text-sm font-semibold mb-1">{alert.title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{alert.description}</p>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <Clock size={10} />
              {formatTimestamp(alert.timestamp)}
            </div>
            {alert.location && (
              <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={10} />
                {alert.location.lat.toFixed(3)}°N, {alert.location.lng.toFixed(3)}°E
              </div>
            )}
            {alert.entityId && (
              <div className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-cyan)' }}>
                {alert.entityId}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
