'use client';

import { useState } from 'react';
import { 
  FileText, Shield, Users, Map, Target, Camera, Radio, 
  Clipboard, Briefcase, BadgeCheck, BarChart3, Crosshair, 
  Layers, Network, Zap, TrendingUp, Clock
} from 'lucide-react';

// ─── AGENCY DATA ────────────────────────────────────────────────────
const agencies = [
  { id: 'DP', name: 'Delhi Police', icon: Shield, color: '#3b82f6', status: 'active', officers: 84000, cases: 142 },
  { id: 'NIA', name: 'NIA', icon: Target, color: '#ef4444', status: 'active', officers: 800, cases: 23 },
  { id: 'ED', name: 'Enforcement Directorate', icon: Briefcase, color: '#f97316', status: 'active', officers: 2000, cases: 18 },
  { id: 'CUSTOMS', name: 'Customs Intelligence', icon: FileText, color: '#eab308', status: 'active', officers: 3500, cases: 31 },
  { id: 'IB', name: 'Intelligence Bureau', icon: Radio, color: '#a855f7', status: 'active', officers: 17000, cases: 56 },
  { id: 'CYBER', name: 'Cyber Cell', icon: Zap, color: '#06b6d4', status: 'active', officers: 450, cases: 89 },
];

const cases = [
  { id: 'CASE-2026-042', name: 'Operation Sandstorm — Sussex Pipeline', leadAgency: 'DP', severity: 'critical',
    entities: ['P-001', 'P-002', 'P-005', 'O-001'], status: 'active', lastUpdate: '2026-06-16T14:30:00',
    description: 'Cross-border smuggling network operating through IGI Airport cargo terminal. Linked to Siddiqui Imports and Qureshi transport syndicate.' },
  { id: 'CASE-2026-041', name: 'Operation Clean Slate — Corruption Probe', leadAgency: 'ED', severity: 'high',
    entities: ['P-003', 'P-007', 'O-003'], status: 'active', lastUpdate: '2026-06-16T11:00:00',
    description: 'Investigation into land fraud and quid pro quo involving MCD officials and real estate developers.' },
  { id: 'CASE-2026-040', name: 'Operation Hawala Trace — Financial Network', leadAgency: 'ED', severity: 'critical',
    entities: ['P-001', 'P-005', 'F-001', 'F-002'], status: 'active', lastUpdate: '2026-06-16T09:15:00',
    description: '₹3.2Cr hawala network traced from Chandni Chowk to Dubai. Multiple shell companies identified.' },
  { id: 'CASE-2026-039', name: 'Project Alpha — Encrypted Comms', leadAgency: 'IB', severity: 'high',
    entities: ['P-002', 'C-003'], status: 'active', lastUpdate: '2026-06-15T22:00:00',
    description: 'Decrypted WhatsApp group coordinating smuggling operations. 7 members, 234 messages.' },
  { id: 'CASE-2026-038', name: 'Cyber Cell — Dark Web Crackdown', leadAgency: 'CYBER', severity: 'medium',
    entities: ['P-004'], status: 'active', lastUpdate: '2026-06-15T18:00:00',
    description: 'Dark web marketplace monitoring. New listings matching contraband profile detected.' },
];

const fieldOps = [
  { id: 'FO-01', unit: 'Alpha Team', location: 'Ghazipur Border', status: 'deployed', personnel: 6, eta: 'Ongoing', objective: 'Vehicle checkpoint — monitor UP-16-T-9054' },
  { id: 'FO-02', unit: 'Bravo Team', location: 'IGI Airport Cargo T3', status: 'deployed', personnel: 8, eta: 'Ongoing', objective: 'Cargo inspection — 14 tons electronics shipment' },
  { id: 'FO-03', unit: 'Watch Tower', location: 'Cyber City, Gurugram', status: 'surveillance', personnel: 3, eta: 'Until 22:00', objective: 'Static surveillance on tower B — Malhotra residence' },
  { id: 'FO-04', unit: 'Rapid Response', location: 'Chandni Chowk', status: 'standby', personnel: 12, eta: '15 min', objective: 'QRF for potential raid on Siddiqui Imports' },
];

const evidenceLog = [
  { id: 'EV-001', case: 'CASE-2026-042', type: 'Phone Intercept', description: 'Call recording — Malhotra ↔ Qureshi discussing shipment', custody: 'IB Evidence Locker', chain: 4, timestamp: '2026-06-15T20:15:00' },
  { id: 'EV-002', case: 'CASE-2026-042', type: 'Document', description: 'Customs declaration — IGI Cargo (declared ₹2.1Cr vs actual ₹8.5Cr)', custody: 'Customs HQ', chain: 3, timestamp: '2026-06-15T14:30:00' },
  { id: 'EV-003', case: 'CASE-2026-041', type: 'Financial Record', description: 'SBI STR Report — ₹2.4Cr cash deposit Janakpuri', custody: 'ED Evidence Room', chain: 2, timestamp: '2026-06-14T11:15:00' },
  { id: 'EV-004', case: 'CASE-2026-040', type: 'Bank Statement', description: 'Hawala trail — 4 intermediate accounts identified', custody: 'ED Evidence Room', chain: 3, timestamp: '2026-06-12T15:00:00' },
  { id: 'EV-005', case: 'CASE-2026-041', type: 'Property Deed', description: 'Dwarka Sector 21 — ₹12Cr sale to shell company', custody: 'ED Evidence Room', chain: 2, timestamp: '2026-06-13T16:00:00' },
];

const liveTracking = [
  { id: 'TRK-01', asset: 'UP-16-T-9054', type: 'vehicle', lat: 28.6300, lng: 77.3200, speed: '45 km/h', heading: 'East', lastPing: '2 min ago', status: 'active' },
  { id: 'TRK-02', asset: 'DL-3C-AX-7842', type: 'vehicle', lat: 28.4947, lng: 77.0887, speed: '0 km/h', heading: 'Parked', lastPing: '8 min ago', status: 'idle' },
  { id: 'TRK-03', asset: 'Alpha Team', type: 'unit', lat: 28.6300, lng: 77.3200, speed: '—', heading: 'Static', lastPing: '1 min ago', status: 'active' },
  { id: 'TRK-04', asset: 'Bravo Team', type: 'unit', lat: 28.5627, lng: 77.1180, speed: '—', heading: 'Static', lastPing: '3 min ago', status: 'active' },
];

// ─── PREDICTIVE DATA (Phase 5) ──────────────────────────────────────
const hotspotPredictions = [
  { district: 'Ghazipur Border Area', risk: 92, trend: 'rising', factors: ['Cross-border activity spike', 'Multiple flagged vehicles', 'Handover zone'], confidence: 82 },
  { district: 'IGI Airport Cargo', risk: 88, trend: 'rising', factors: ['Customs discrepancy pattern', 'Shell company consignees', 'Consistent undervaluation'], confidence: 78 },
  { district: 'Chandni Chowk', risk: 85, trend: 'stable', factors: ['Hawala hub', 'Multiple flagged transactions', 'Shell company density'], confidence: 85 },
  { district: 'Gurugram Cyber City', risk: 75, trend: 'rising', factors: ['Financial irregularity cluster', 'HVT presence', 'Shell company nexus'], confidence: 72 },
  { district: 'Dwarka Sector 21', risk: 70, trend: 'rising', factors: ['Land fraud pattern', 'Official collusion suspected', 'Shell entity transactions'], confidence: 68 },
  { district: 'Jamia Nagar', risk: 68, trend: 'stable', factors: ['HVT frequent location', 'Safe house suspected', 'Low electronic footprint'], confidence: 75 },
];

const disruptionScenarios = [
  {
    id: 'SIM-001', target: 'Rashid Qureshi (P-002)', action: 'Arrest + Vehicle Seizure',
    impact: { networkFragmentation: '65%', downstreamDisruption: ['NCR Transport Syndicate operations', 'Ghaziabad warehouse activity', 'Cross-border logistics'], escapedNodes: ['Vikram Malhotra', 'Farhan Siddiqui'], riskOfEscalation: 'Medium — financiers remain at large' },
  },
  {
    id: 'SIM-002', target: 'Siddiqui Imports LLC (O-001)', action: 'Business Shutdown + Asset Freeze',
    impact: { networkFragmentation: '78%', downstreamDisruption: ['Import pipeline severed', 'Hawala network disrupted', 'Cargo terminal operations'], escapedNodes: ['Rashid Qureshi', 'Suresh Kalmadi'], riskOfEscalation: 'Low — key operational node eliminated' },
  },
  {
    id: 'SIM-003', target: 'Simultaneous — All HVTs', action: 'Coordinated Multi-Agency Raid',
    impact: { networkFragmentation: '95%', downstreamDisruption: ['All active pipelines frozen', 'Financial network collapse', 'Comms network blind'], escapedNodes: ['Minor operatives only'], riskOfEscalation: 'High — secondary leadership may emerge from lower tier' },
  },
];

const threatForecast = [
  { timeframe: '24 Hours', probability: 72, threats: ['Cross-border movement attempt via Ghazipur', 'Encrypted comms burst — prep for operation', 'Financial transfer spike'], recommendations: ['Reinforce Ghazipur checkpoint', 'Activate SIGINT monitoring surge', 'Alert Financial Intelligence Unit'] },
  { timeframe: '48 Hours', probability: 64, threats: ['Cargo movement via IGI', 'Hawala transfer to Dubai', 'Property registration via shell corp'], recommendations: ['Flag all Siddiqui-linked cargo', 'Freeze known hawala accounts', 'Alert Sub-Registrar Dwarka'] },
  { timeframe: '72 Hours', probability: 55, threats: ['Leadership consolidation by secondary tier', 'Route change to alternate border crossings', 'Evidence tampering attempt'], recommendations: ['Deploy surveillance on secondary operatives', 'Monitor all UP border crossings', 'Secure evidence chain'] },
];

export default function Phase45View() {
  const [p4tab, setP4tab] = useState<'cases' | 'tracking' | 'agencies' | 'evidence'>('cases');
  const [p5tab, setP5tab] = useState<'hotspots' | 'disruption' | 'forecast'>('hotspots');

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--accent-cyan)' }}>
            Phase 4 & 5 — Operations + Predictive
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Case management · Live tracking · Agency fusion · Evidence chain · Hotspot prediction · Disruption simulation · Threat forecast
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-blue)' }}>P4: OPERATIONS</div>
          <div className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(249, 115, 22, 0.12)', color: 'var(--accent-orange)' }}>P5: PREDICTIVE</div>
        </div>
      </div>

      {/* ── PHASE 4 ── */}
      <div className="argus-card p-0 overflow-hidden">
        <div className="flex items-center px-4 py-2" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider mr-4" style={{ color: 'var(--accent-blue)' }}>Phase 4: Operational</span>
          <div className="flex gap-1">
            {[
              { id: 'cases' as const, label: '📋 Case Management' },
              { id: 'tracking' as const, label: '📍 Live Tracking' },
              { id: 'agencies' as const, label: '🏛 Agency Fusion' },
              { id: 'evidence' as const, label: '🔗 Evidence Chain' },
            ].map(t => (
              <button key={t.id} onClick={() => setP4tab(t.id)}
                className="px-3 py-1.5 rounded text-[10px] transition-all"
                style={{
                  background: p4tab === t.id ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: p4tab === t.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* CASES */}
          {p4tab === 'cases' && (
            <div className="grid grid-cols-2 gap-3">
              {cases.map(c => {
                const agency = agencies.find(a => a.id === c.leadAgency);
                return (
                  <div key={c.id} className="p-3 rounded-md" style={{
                    background: 'var(--bg-secondary)',
                    borderLeft: `3px solid ${c.severity === 'critical' ? 'var(--accent-red)' : c.severity === 'high' ? 'var(--accent-orange)' : 'var(--accent-yellow)'}`,
                  }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>{c.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                        background: c.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                        color: c.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-orange)',
                      }}>{c.severity.toUpperCase()}</span>
                    </div>
                    <div className="text-xs font-semibold mb-1">{c.name}</div>
                    <div className="text-[10px] mb-2" style={{ color: 'var(--text-secondary)' }}>{c.description}</div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span style={{ color: agency?.color }}>⚡ {agency?.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{c.entities.length} entities</span>
                      <span className="ml-auto" style={{ color: 'var(--text-secondary)' }}>Updated: {new Date(c.lastUpdate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIVE TRACKING */}
          {p4tab === 'tracking' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {liveTracking.map(t => (
                  <div key={t.id} className="p-3 rounded-md" style={{
                    background: t.status === 'active' ? 'rgba(34, 197, 94, 0.06)' : 'var(--bg-secondary)',
                    borderLeft: `2px solid ${t.status === 'active' ? 'var(--accent-green)' : 'var(--accent-yellow)'}`,
                  }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-cyan)' }}>{t.asset}</span>
                      <span className="w-2 h-2 rounded-full" style={{
                        background: t.status === 'active' ? 'var(--accent-green)' : 'var(--accent-yellow)',
                        boxShadow: t.status === 'active' ? '0 0 6px var(--accent-green)' : 'none',
                      }} />
                    </div>
                    <div className="text-[10px] space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                      <div>{t.speed} · {t.heading}</div>
                      <div>📍 {t.lat.toFixed(4)}°N, {t.lng.toFixed(4)}°E</div>
                      <div>🕐 {t.lastPing}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-[9px] mt-2" style={{ color: 'var(--text-secondary)' }}>
                GPS trackers: 2 vehicles · ANPR cameras: 10 · Field units: 4 · Refresh: 30s
              </div>
            </div>
          )}

          {/* AGENCIES */}
          {p4tab === 'agencies' && (
            <div className="space-y-2">
              {agencies.map(a => {
                const Icon = a.icon;
                const agencyCases = cases.filter(c => c.leadAgency === a.id);
                return (
                  <div key={a.id} className="flex items-center gap-4 p-3 rounded-md" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="p-2 rounded-lg" style={{ background: `${a.color}15`, color: a.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{a.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{a.officers.toLocaleString()} officers · {agencyCases.length} active cases</div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      {agencyCases.map(c => (
                        <span key={c.id} className="px-1.5 py-0.5 rounded" style={{
                          background: c.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                          color: c.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-orange)',
                        }}>{c.id}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--accent-green)' }}>
                      <BadgeCheck size={12} />
                      SECURE
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EVIDENCE CHAIN */}
          {p4tab === 'evidence' && (
            <div className="space-y-2">
              {evidenceLog.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-md" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)' }}>{e.id}</div>
                  <div className="w-16 text-[10px] text-center px-1.5 py-0.5 rounded" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)' }}>{e.type}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs">{e.description}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Case: {e.case} · Custody: {e.custody}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>{e.chain}</div>
                    <div className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>CUSTODIANS</div>
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{new Date(e.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PHASE 5 ── */}
      <div className="argus-card p-0 overflow-hidden">
        <div className="flex items-center px-4 py-2" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider mr-4" style={{ color: 'var(--accent-orange)' }}>Phase 5: Predictive</span>
          <div className="flex gap-1">
            {[
              { id: 'hotspots' as const, label: '🔮 Hotspot Prediction' },
              { id: 'disruption' as const, label: '🕸 Disruption Simulation' },
              { id: 'forecast' as const, label: '⏱ Threat Forecast' },
            ].map(t => (
              <button key={t.id} onClick={() => setP5tab(t.id)}
                className="px-3 py-1.5 rounded text-[10px] transition-all"
                style={{
                  background: p5tab === t.id ? 'rgba(249, 115, 22, 0.12)' : 'transparent',
                  color: p5tab === t.id ? 'var(--accent-orange)' : 'var(--text-secondary)',
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* HOTSPOTS */}
          {p5tab === 'hotspots' && (
            <div className="space-y-3">
              {hotspotPredictions.map(h => (
                <div key={h.district} className="p-3 rounded-md" style={{
                  background: h.risk >= 85 ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-secondary)',
                  borderLeft: `3px solid ${h.risk >= 85 ? 'var(--accent-red)' : h.risk >= 70 ? 'var(--accent-orange)' : 'var(--accent-yellow)'}`,
                }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium flex-1">{h.district}</span>
                    <span className="text-xs font-bold" style={{ color: h.risk >= 85 ? 'var(--accent-red)' : h.risk >= 70 ? 'var(--accent-orange)' : 'var(--accent-yellow)' }}>
                      Risk: {h.risk}/100
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                      background: h.trend === 'rising' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: h.trend === 'rising' ? 'var(--accent-red)' : 'var(--accent-yellow)',
                    }}>
                      {h.trend === 'rising' ? '↑ RISING' : '→ STABLE'}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Confidence: {h.confidence}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {h.factors.map(f => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--accent-blue)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DISRUPTION SIMULATION */}
          {p5tab === 'disruption' && (
            <div className="space-y-3">
              {disruptionScenarios.map(s => (
                <div key={s.id} className="p-3 rounded-md" style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-purple)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-purple)' }}>{s.id}</span>
                    <span className="text-xs font-semibold">{s.target}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded ml-auto" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>{s.action}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded" style={{ background: 'var(--bg-primary)' }}>
                      <div className="text-lg font-bold" style={{ color: 'var(--accent-red)' }}>{s.impact.networkFragmentation}</div>
                      <div className="text-[8px] uppercase" style={{ color: 'var(--text-secondary)' }}>Network Fragmentation</div>
                    </div>
                    <div className="col-span-2 p-2 rounded" style={{ background: 'var(--bg-primary)' }}>
                      <div className="text-[9px] uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Disrupted Nodes</div>
                      <div className="flex flex-wrap gap-1">
                        {s.impact.downstreamDisruption.map(d => (
                          <span key={d} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--accent-green)' }}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[10px]">
                    <span style={{ color: 'var(--text-secondary)' }}>Escaped: {s.impact.escapedNodes.join(', ')}</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded" style={{
                      background: s.impact.riskOfEscalation.includes('High') ? 'rgba(239, 68, 68, 0.1)' : s.impact.riskOfEscalation.includes('Medium') ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: s.impact.riskOfEscalation.includes('High') ? 'var(--accent-red)' : s.impact.riskOfEscalation.includes('Medium') ? 'var(--accent-orange)' : 'var(--accent-green)',
                    }}>
                      {s.impact.riskOfEscalation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* THREAT FORECAST */}
          {p5tab === 'forecast' && (
            <div className="space-y-3">
              {threatForecast.map(f => (
                <div key={f.timeframe} className="p-3 rounded-md" style={{
                  background: f.probability >= 70 ? 'rgba(239, 68, 68, 0.06)' : f.probability >= 60 ? 'rgba(249, 115, 22, 0.06)' : 'rgba(234, 179, 8, 0.06)',
                  borderLeft: `3px solid ${f.probability >= 70 ? 'var(--accent-red)' : f.probability >= 60 ? 'var(--accent-orange)' : 'var(--accent-yellow)'}`,
                }}>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={16} style={{ color: f.probability >= 70 ? 'var(--accent-red)' : 'var(--accent-orange)' }} />
                    <span className="text-xs font-semibold">{f.timeframe}</span>
                    <span className="text-xs font-bold ml-auto" style={{ color: f.probability >= 70 ? 'var(--accent-red)' : 'var(--accent-orange)' }}>{f.probability}%</span>
                  </div>
                  <div className="mb-2">
                    <div className="text-[9px] uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Projected Threats</div>
                    <div className="flex flex-wrap gap-1">
                      {f.threats.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--accent-red)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Recommended Actions</div>
                    <div className="flex flex-wrap gap-1">
                      {f.recommendations.map(r => (
                        <span key={r} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(34, 197, 94, 0.08)', color: 'var(--accent-green)' }}>✓ {r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
