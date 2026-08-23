/**
 * Zoth Studio — Zero-Cookie Privacy Banner (v2.0)
 */
(function(global) {
  'use strict';
  const ZothCookieBanner = {
    VERSION: '2.0.0',
    renderBanner() {
      return `<div id="zothPrivacyBanner" style="position:fixed;bottom:16px;right:16px;background:rgba(10,15,30,0.95);border:1px solid var(--border);border-radius:12px;padding:12px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.6);z-index:9999;"><span style="font-size:0.8rem;color:#cbd5e1;">🔒 <strong>100% Privacy Guaranteed:</strong> Zero third-party trackers or ad cookies.</span><button class="btn btn-accent" onclick="this.parentElement.style.display='none'" style="font-size:0.75rem;padding:6px 12px;">Got It</button></div>`;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothCookieBanner;
  else global.ZothCookieBanner = ZothCookieBanner;
})(typeof window !== 'undefined' ? window : globalThis);
