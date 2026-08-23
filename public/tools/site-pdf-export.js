/**
 * Zoth Studio — Print & PDF Export Generator (v2.0)
 */
(function(global) {
  'use strict';
  const ZothPdfExport = {
    VERSION: '2.0.0',
    triggerPrint() {
      window.print();
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothPdfExport;
  else global.ZothPdfExport = ZothPdfExport;
})(typeof window !== 'undefined' ? window : globalThis);
