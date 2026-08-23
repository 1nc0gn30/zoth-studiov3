/**
 * Zoth Studio — Social Proof & Marquee Ticker Engine (v2.0)
 */
(function(global) {
  'use strict';
  const ZothSocialProof = {
    VERSION: '2.0.0',
    generateMarquee(items = []) {
      const list = items.length ? items : [
        { name: 'Dr. Vance', role: 'CTO @ Apex', quote: 'Reduced our deployment latency to sub-10ms globally.' },
        { name: 'Kaelen Thorne', role: 'Principal Architect', quote: 'Zero-cloud lock-in and 100% AST verified stability.' },
        { name: 'Sarah Chen', role: 'Security Director', quote: 'Hardware-level key vault gives us complete peace of mind.' }
      ];
      let cards = '';
      list.forEach(c => {
        cards += `<div class="marquee-card" style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:12px;padding:16px;min-width:280px;"><p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px;">"${c.quote}"</p><div style="font-family:var(--font-display);font-size:0.85rem;font-weight:700;color:#fff;">${c.name}</div><div style="font-size:0.72rem;color:var(--accent);">${c.role}</div></div>`;
      });
      return `<div class="marquee-track" style="display:flex;gap:14px;overflow-x:auto;padding:10px 0;">${cards}</div>`;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothSocialProof;
  else global.ZothSocialProof = ZothSocialProof;
})(typeof window !== 'undefined' ? window : globalThis);
