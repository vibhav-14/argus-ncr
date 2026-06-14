'use client';

import { useEffect, useRef, useState } from 'react';
import { entities, links, delhiNCRCenter, type Entity, type Link } from '@/lib/data';

const entityColors: Record<string, string> = {
  person: '#3b82f6', location: '#22c55e', vehicle: '#eab308',
  organization: '#a855f7', event: '#f97316', communication: '#06b6d4', financial: '#ef4444',
};

const entitySizes: Record<string, number> = {
  person: 8, location: 7, vehicle: 6, organization: 9, event: 7, communication: 5, financial: 6,
};

export default function GraphView() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const nodesRef = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = svg.clientWidth;
    const height = svg.clientHeight;

    // Filter entities based on type
    const filteredEntities = filterType === 'all' ? entities : entities.filter(e => e.type === filterType);
    const filteredIds = new Set(filteredEntities.map(e => e.id));
    const filteredLinks = links.filter(l => filteredIds.has(l.source) && filteredIds.has(l.target));

    // Initialize node positions
    nodesRef.current.clear();
    filteredEntities.forEach((e, i) => {
      const angle = (i / filteredEntities.length) * 2 * Math.PI;
      const r = Math.min(width, height) * 0.3;
      nodesRef.current.set(e.id, {
        x: width / 2 + r * Math.cos(angle),
        y: height / 2 + r * Math.sin(angle),
        vx: 0, vy: 0
      });
    });

    // Force simulation
    let running = true;
    const simulate = () => {
      if (!running) return;
      const nodes = nodesRef.current;
      const alpha = 0.3;

      // Repulsion between all nodes
      const nodeEntries = Array.from(nodes.entries());
      for (let i = 0; i < nodeEntries.length; i++) {
        for (let j = i + 1; j < nodeEntries.length; j++) {
          const [, a] = nodeEntries[i];
          const [, b] = nodeEntries[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          let force = -800 / (dist * dist);
          a.vx += force * dx / dist * alpha;
          a.vy += force * dy / dist * alpha;
          b.vx -= force * dx / dist * alpha;
          b.vy -= force * dy / dist * alpha;
        }
      }

      // Attraction along links
      filteredLinks.forEach(link => {
        const a = nodes.get(link.source);
        const b = nodes.get(link.target);
        if (!a || !b) return;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let force = (dist - 150) * 0.005 * (link.weight || 0.5);
        a.vx += force * dx / dist;
        a.vy += force * dy / dist;
        b.vx -= force * dx / dist;
        b.vy -= force * dy / dist;
      });

      // Center gravity
      nodes.forEach(n => {
        n.vx += (width / 2 - n.x) * 0.001;
        n.vy += (height / 2 - n.y) * 0.001;
      });

      // Apply velocities
      nodes.forEach(n => {
        n.vx *= 0.6;
        n.vy *= 0.6;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(40, Math.min(width - 40, n.x));
        n.y = Math.max(40, Math.min(height - 40, n.y));
      });
    };

    // Run simulation steps
    for (let i = 0; i < 200; i++) simulate();

    // Render
    const render = () => {
      const nodes = nodesRef.current;

      // Clear
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      // Defs for glow
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      filteredEntities.forEach(e => {
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', `glow-${e.id}`);
        const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('stdDeviation', '3');
        blur.setAttribute('result', 'coloredBlur');
        const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        const mn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        mn1.setAttribute('in', 'coloredBlur');
        const mn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        mn2.setAttribute('in', 'SourceGraphic');
        merge.appendChild(mn1); merge.appendChild(mn2);
        filter.appendChild(blur); filter.appendChild(merge);
        defs.appendChild(filter);
      });
      svg.appendChild(defs);

      // Links
      filteredLinks.forEach(link => {
        const a = nodes.get(link.source);
        const b = nodes.get(link.target);
        if (!a || !b) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(a.x));
        line.setAttribute('y1', String(a.y));
        line.setAttribute('x2', String(b.x));
        line.setAttribute('y2', String(b.y));
        const isHighlighted = hoveredEntity === link.source || hoveredEntity === link.target;
        line.setAttribute('stroke', isHighlighted ? 'rgba(6, 182, 212, 0.6)' : 'rgba(42, 53, 85, 0.6)');
        line.setAttribute('stroke-width', isHighlighted ? '2' : '1');
        if (isHighlighted) line.setAttribute('stroke-dasharray', '4 2');
        svg.appendChild(line);

        // Link label
        if (isHighlighted) {
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          label.setAttribute('x', String(midX));
          label.setAttribute('y', String(midY - 5));
          label.setAttribute('fill', '#94a3b8');
          label.setAttribute('font-size', '9');
          label.setAttribute('text-anchor', 'middle');
          label.textContent = link.type.replace(/_/g, ' ');
          svg.appendChild(label);
        }
      });

      // Nodes
      filteredEntities.forEach(e => {
        const pos = nodes.get(e.id);
        if (!pos) return;
        const color = entityColors[e.type] || '#94a3b8';
        const size = entitySizes[e.type] || 6;
        const isHovered = hoveredEntity === e.id;
        const isSelected = selectedEntity?.id === e.id;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.style.cursor = 'pointer';

        // Outer ring for selected
        if (isSelected) {
          const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          outer.setAttribute('cx', String(pos.x));
          outer.setAttribute('cy', String(pos.y));
          outer.setAttribute('r', String(size + 6));
          outer.setAttribute('fill', 'none');
          outer.setAttribute('stroke', color);
          outer.setAttribute('stroke-width', '2');
          outer.setAttribute('stroke-dasharray', '3 3');
          g.appendChild(outer);
        }

        // Glow
        if (isHovered || isSelected) {
          const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          glow.setAttribute('cx', String(pos.x));
          glow.setAttribute('cy', String(pos.y));
          glow.setAttribute('r', String(size + 3));
          glow.setAttribute('fill', color);
          glow.setAttribute('opacity', '0.2');
          g.appendChild(glow);
        }

        // Node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(pos.x));
        circle.setAttribute('cy', String(pos.y));
        circle.setAttribute('r', String(size));
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', isHovered ? '#fff' : color);
        circle.setAttribute('stroke-width', isHovered ? '2' : '1');
        g.appendChild(circle);

        // Risk indicator
        if ((e.riskScore ?? 0) >= 80) {
          const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          ring.setAttribute('cx', String(pos.x));
          ring.setAttribute('cy', String(pos.y));
          ring.setAttribute('r', String(size + 2));
          ring.setAttribute('fill', 'none');
          ring.setAttribute('stroke', '#ef4444');
          ring.setAttribute('stroke-width', '1.5');
          ring.setAttribute('opacity', '0.6');
          g.appendChild(ring);
        }

        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', String(pos.x));
        label.setAttribute('y', String(pos.y + size + 14));
        label.setAttribute('fill', isHovered ? '#e2e8f0' : '#94a3b8');
        label.setAttribute('font-size', isHovered ? '11' : '9');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-weight', isHovered ? '600' : '400');
        label.textContent = e.name.length > 18 ? e.name.slice(0, 18) + '…' : e.name;
        g.appendChild(label);

        // Event handlers
        g.addEventListener('mouseenter', () => setHoveredEntity(e.id));
        g.addEventListener('mouseleave', () => setHoveredEntity(null));
        g.addEventListener('click', () => setSelectedEntity(e));

        svg.appendChild(g);
      });
    };

    render();
    return () => { running = false; };
  }, [filterType, hoveredEntity, selectedEntity]);

  const typeFilters = ['all', 'person', 'location', 'vehicle', 'organization', 'event', 'communication', 'financial'];

  return (
    <div className="h-full flex">
      {/* Graph */}
      <div className="flex-1 relative grid-bg">
        {/* Filter Bar */}
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          {typeFilters.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-2.5 py-1 rounded text-[10px] uppercase tracking-wider transition-all"
              style={{
                background: filterType === t ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-card)',
                border: `1px solid ${filterType === t ? 'var(--accent-cyan)' : 'var(--border)'}`,
                color: filterType === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <svg ref={svgRef} className="w-full h-full" />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 argus-card p-2.5 flex gap-3">
          {Object.entries(entityColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {type}
            </div>
          ))}
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

          {/* Risk Score */}
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Risk Score</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: `${selectedEntity.riskScore}%`,
                  background: (selectedEntity.riskScore ?? 0) >= 80 ? 'var(--accent-red)' : (selectedEntity.riskScore ?? 0) >= 60 ? 'var(--accent-orange)' : (selectedEntity.riskScore ?? 0) >= 40 ? 'var(--accent-yellow)' : 'var(--accent-green)'
                }} />
              </div>
              <span className="text-sm font-bold">{selectedEntity.riskScore}</span>
            </div>
          </div>

          {/* Properties */}
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

          {/* Location */}
          {selectedEntity.location && (
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Location</div>
              <div className="text-xs font-mono">{selectedEntity.location.address}</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                {selectedEntity.location.lat.toFixed(4)}, {selectedEntity.location.lng.toFixed(4)}
              </div>
            </div>
          )}

          {/* Tags */}
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

          {/* Connections */}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Connections</div>
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
