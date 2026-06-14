'use client';

import { useEffect, useState } from 'react';
import { entities, links, delhiNCRCenter, policeDistricts, type Entity } from '@/lib/data';

const entityColors: Record<string, string> = {
  person: '#3b82f6', location: '#22c55e', vehicle: '#eab308',
  organization: '#a855f7', event: '#f97316', communication: '#06b6d4', financial: '#ef4444',
};

const entityIcons: Record<string, string> = {
  person: '👤', location: '📍', vehicle: '🚗',
  organization: '🏢', event: '⚡', communication: '📡', financial: '💰',
};

export default function GeoSpatial() {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showHeatzone, setShowHeatzone] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Dynamically import leaflet (client-only)
  useEffect(() => {
    import('leaflet').then(mod => {
      setL(mod.default);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L) return;
    const map = L.map('argus-map', {
      center: [delhiNCRCenter.lat, delhiNCRCenter.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    setMapInstance(map);
    setMapReady(true);

    return () => { map.remove(); };
  }, [L]);

  // Update layers
  useEffect(() => {
    if (!mapInstance || !L || !mapReady) return;

    // Clear markers/circles/polylines only
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        mapInstance.removeLayer(layer);
      }
    });

    const filteredEntities = filterType === 'all'
      ? entities.filter(e => e.location)
      : entities.filter(e => e.location && e.type === filterType);

    // Police districts
    if (showDistricts) {
      policeDistricts.forEach(d => {
        L.circle([d.center.lat, d.center.lng], {
          radius: 3000,
          color: 'rgba(42, 53, 85, 0.5)',
          fillColor: 'rgba(42, 53, 85, 0.1)',
          fillOpacity: 0.1,
          weight: 1,
          dashArray: '4 4',
        }).addTo(mapInstance).bindTooltip(d.name, {
          permanent: false,
          className: 'argus-tooltip',
          direction: 'top',
        });
      });
    }

    // Risk heat zones
    if (showHeatzone) {
      entities.filter(e => e.location && (e.riskScore ?? 0) > 60).forEach(e => {
        const colorBase = (e.riskScore ?? 0) >= 80 ? 'rgba(239, 68, 68,' : 'rgba(249, 115, 22,';
        L.circle([e.location!.lat, e.location!.lng], {
          radius: 800 + ((e.riskScore ?? 0) / 100) * 1200,
          color: colorBase + '0.3)',
          fillColor: colorBase + '0.08)',
          fillOpacity: 0.3,
          weight: 1,
        }).addTo(mapInstance);
      });
    }

    // Links as lines
    const filteredIds = new Set(filteredEntities.map(e => e.id));
    links.filter(l => filteredIds.has(l.source) && filteredIds.has(l.target)).forEach(link => {
      const src = entities.find(e => e.id === link.source);
      const tgt = entities.find(e => e.id === link.target);
      if (src?.location && tgt?.location) {
        L.polyline(
          [[src.location.lat, src.location.lng], [tgt.location.lat, tgt.location.lng]],
          { color: 'rgba(6, 182, 212, 0.3)', weight: 1.5, dashArray: '4 4' }
        ).addTo(mapInstance);
      }
    });

    // Entity markers
    filteredEntities.forEach(e => {
      const color = entityColors[e.type] || '#94a3b8';
      const isHighRisk = (e.riskScore ?? 0) >= 80;

      const marker = L.circleMarker([e.location!.lat, e.location!.lng], {
        radius: isHighRisk ? 10 : 7,
        color: color,
        fillColor: color,
        fillOpacity: isHighRisk ? 0.9 : 0.6,
        weight: isHighRisk ? 2 : 1,
      }).addTo(mapInstance);

      if (isHighRisk) {
        L.circleMarker([e.location!.lat, e.location!.lng], {
          radius: 15,
          color: color,
          fillColor: 'transparent',
          fillOpacity: 0,
          weight: 1,
          opacity: 0.3,
          dashArray: '3 3',
        }).addTo(mapInstance);
      }

      marker.bindTooltip(
        `<div style="font-size:11px;"><strong>${entityIcons[e.type]} ${e.name}</strong><br/><span style="color:${color}">${e.type.toUpperCase()}</span> | Risk: ${e.riskScore}<br/>${e.location!.address}</div>`,
        { className: 'argus-tooltip', direction: 'top' }
      );

      marker.on('click', () => setSelectedEntity(e));
    });

  }, [mapInstance, L, filterType, showHeatzone, showDistricts, mapReady]);

  const typeFilters = ['all', 'person', 'location', 'vehicle', 'organization', 'event', 'communication', 'financial'];

  return (
    <div className="h-full flex">
      <div className="flex-1 relative">
        <div id="argus-map" className="w-full h-full" />

        {/* Control Panel */}
        <div className="absolute top-3 left-3 z-[1000] argus-card p-3 space-y-2" style={{ minWidth: '180px' }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--accent-cyan)' }}>
            Layer Controls
          </div>
          <div className="space-y-1">
            {typeFilters.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="w-full text-left px-2 py-1 rounded text-[10px] transition-all"
                style={{
                  background: filterType === t ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  color: filterType === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${filterType === t ? 'var(--accent-cyan)' : 'transparent'}`,
                }}
              >
                {t === 'all' ? '🗺️' : entityIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="pt-1 space-y-1.5" style={{ borderTop: '1px solid var(--border)' }}>
            <label className="flex items-center gap-2 text-[10px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={showHeatzone} onChange={(e) => setShowHeatzone(e.target.checked)} className="accent-cyan-500" />
              Risk Heat Zones
            </label>
            <label className="flex items-center gap-2 text-[10px] cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={showDistricts} onChange={(e) => setShowDistricts(e.target.checked)} className="accent-cyan-500" />
              Police Districts
            </label>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-[1000] argus-card p-2.5 flex gap-3">
          {Object.entries(entityColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {type}
            </div>
          ))}
        </div>
      </div>

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
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                {selectedEntity.location.lat.toFixed(4)}°N, {selectedEntity.location.lng.toFixed(4)}°E
              </div>
            </div>
          )}
          {selectedEntity.tags && (
            <div className="mb-4">
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
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Connected Entities</div>
            <div className="space-y-1">
              {links.filter(l => l.source === selectedEntity.id || l.target === selectedEntity.id).map(l => {
                const otherId = l.source === selectedEntity.id ? l.target : l.source;
                const other = entities.find(e => e.id === otherId);
                if (!other) return null;
                return (
                  <div key={l.id} className="flex items-center gap-2 text-xs p-1.5 rounded" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: entityColors[other.type] }} />
                    <span className="truncate">{other.name}</span>
                    <span className="ml-auto text-[9px]" style={{ color: 'var(--text-secondary)' }}>{l.type.replace(/_/g, ' ')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
