/**
 * Zoth Studio — High-Conversion Notification Toasts (v2.0)
 */
(function(global) {
  'use strict';
  const ZothToastAlerts = {
    VERSION: '2.0.0',
    show(message, type = 'info') {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:24px;left:24px;background:rgba(10,15,30,0.95);border:1px solid rgba(0,240,255,0.4);border-radius:10px;padding:10px 16px;font-family:sans-serif;font-size:0.82rem;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.7);z-index:9999;transition:opacity 0.3s;';
      toast.innerHTML = `<span>⚡ ${message}</span>`;
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothToastAlerts;
  else global.ZothToastAlerts = ZothToastAlerts;
})(typeof window !== 'undefined' ? window : globalThis);
