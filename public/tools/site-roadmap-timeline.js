/**
 * Zoth Studio — Interactive Roadmap Timeline Component (v2.0)
 */
(function(global) {
  'use strict';
  const ZothRoadmap = {
    VERSION: '2.0.0',
    renderTimeline(quarters = []) {
      const qList = quarters.length ? quarters : [
        { q: 'Q1', title: 'Sovereign Core', desc: 'Hardware-isolated BYOK key vault and local loopback bus.' },
        { q: 'Q2', title: 'Swarm Arenas', desc: 'Consensus Arena v2 and 3D kinetic WebGL battle arenas.' },
        { q: 'Q3', title: 'Rapid Site Studio', desc: 'Multi-framework exporter suite and Netlify AX self-healing engine.' }
      ];
      let html = '<div style="display:flex;gap:16px;overflow-x:auto;padding:10px 0;">';
      qList.forEach(item => {
        html += `<div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:12px;padding:16px;min-width:260px;"><div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent);">${item.q}</div><h4 style="color:#fff;margin:6px 0;">${item.title}</h4><p style="color:var(--text-muted);font-size:0.85rem;">${item.desc}</p></div>`;
      });
      return html + '</div>';
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothRoadmap;
  else global.ZothRoadmap = ZothRoadmap;
})(typeof window !== 'undefined' ? window : globalThis);
