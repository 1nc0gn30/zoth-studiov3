/**
 * Zoth Studio — Netlify Blobs Key-Value Emulator (v2.0)
 */
(function(global) {
  'use strict';
  const ZothBlobsSimulator = {
    VERSION: '2.0.0',
    store: {},
    async get(key) {
      return this.store[key] !== undefined ? this.store[key] : null;
    },
    async set(key, value) {
      this.store[key] = value;
      try { localStorage.setItem('zoth_blobs_' + key, JSON.stringify(value)); } catch(e) {}
      return true;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothBlobsSimulator;
  else global.ZothBlobsSimulator = ZothBlobsSimulator;
})(typeof window !== 'undefined' ? window : globalThis);
