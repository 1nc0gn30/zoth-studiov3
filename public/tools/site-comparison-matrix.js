/**
 * Zoth Studio — Feature Comparison Matrix Table Builder (v2.0)
 */
(function(global) {
  'use strict';
  const ZothComparisonMatrix = {
    VERSION: '2.0.0',
    renderTable(appName = 'Apex Cloud') {
      return `<div style="overflow-x:auto;margin:30px 0;"><table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.85rem;"><tr style="border-bottom:1px solid var(--border);"><th style="padding:10px;color:#fff;">Feature</th><th style="padding:10px;color:var(--accent);">${appName}</th><th style="padding:10px;color:var(--text-muted);">Legacy SaaS</th></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:10px;">Zero Cloud Lock-in</td><td style="padding:10px;color:var(--accent);">✓ 100% Loopback</td><td style="padding:10px;color:#ef4444;">✗ Proprietary</td></tr><tr style="border-bottom:1px solid rgba(255,255,255,0.06);"><td style="padding:10px;">AST Self-Healing</td><td style="padding:10px;color:var(--accent);">✓ Automated v3.0</td><td style="padding:10px;color:#ef4444;">✗ Manual Tickets</td></tr></table></div>`;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothComparisonMatrix;
  else global.ZothComparisonMatrix = ZothComparisonMatrix;
})(typeof window !== 'undefined' ? window : globalThis);
