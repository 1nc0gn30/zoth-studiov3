/**
 * Zoth Studio — Before/After dual-layer image slider. (v2.0)
 */
(function(global) {
  'use strict';
  const ZothImageComparison = {
    VERSION: '2.0.0',
    initSlider() {
      console.log('[ZothImageComparison] Invoked initSlider()');
      return true;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothImageComparison;
  else global.ZothImageComparison = ZothImageComparison;
})(typeof window !== 'undefined' ? window : globalThis);
