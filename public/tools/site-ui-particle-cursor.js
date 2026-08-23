/**
 * Zoth Studio — Hermetic Celestial Particle Cursor Module (v3.0)
 * Colors: #fbbf24 (Solar Gold) · #00f0ff (Aether Cyan) · #34d399 (Emerald Verde) · #050508 (Deep Void)
 */
(function(global) {
  'use strict';
  const ZothParticleCursor = {
    VERSION: '3.0.0',
    init() {
      if (global.HermeticCelestialTrail) {
        global.HermeticCelestialTrail.resume();
        return true;
      }
      return false;
    },
    burst(x, y, count = 16) {
      if (global.HermeticCelestialTrail && global.HermeticCelestialTrail.burst) {
        global.HermeticCelestialTrail.burst(x, y, count);
        return true;
      }
      return false;
    },
    pause() {
      if (global.HermeticCelestialTrail && global.HermeticCelestialTrail.pause) {
        global.HermeticCelestialTrail.pause();
      }
    },
    resume() {
      if (global.HermeticCelestialTrail && global.HermeticCelestialTrail.resume) {
        global.HermeticCelestialTrail.resume();
      }
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothParticleCursor;
  else global.ZothParticleCursor = ZothParticleCursor;
})(typeof window !== 'undefined' ? window : globalThis);

