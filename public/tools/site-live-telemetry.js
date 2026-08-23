/**
 * Zoth Studio — Live Telemetry & SSE Stream Simulator (v2.0)
 */
(function(global) {
  'use strict';
  const ZothLiveTelemetry = {
    VERSION: '2.0.0',
    startFeed(logElementId) {
      const el = document.getElementById(logElementId);
      if (!el) return;
      setInterval(() => {
        const line = document.createElement('div');
        const now = new Date().toTimeString().split(' ')[0];
        const ping = (Math.random() * 2 + 0.1).toFixed(2);
        line.textContent = `[${now}] Node pulse verified: ${ping}ms | Zero egress`;
        el.appendChild(line);
        el.scrollTop = el.scrollHeight;
        if (el.children.length > 20) el.removeChild(el.children[0]);
      }, 2000);
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothLiveTelemetry;
  else global.ZothLiveTelemetry = ZothLiveTelemetry;
})(typeof window !== 'undefined' ? window : globalThis);
