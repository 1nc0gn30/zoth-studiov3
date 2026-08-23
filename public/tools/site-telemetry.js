/**
 * Zoth Studio — Privacy Telemetry & Conversion Funnel Engine (v2.0)
 */
(function(global) {
  'use strict';
  const ZothTelemetry = {
    VERSION: '2.0.0',
    events: [],
    track(eventName, payload = {}) {
      const entry = { event: eventName, data: payload, timestamp: Date.now() };
      this.events.push(entry);
      console.log(`[Telemetry Event] ${eventName}:`, payload);
      try { sessionStorage.setItem('zoth_telemetry_log', JSON.stringify(this.events)); } catch(e) {}
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothTelemetry;
  else global.ZothTelemetry = ZothTelemetry;
})(typeof window !== 'undefined' ? window : globalThis);
