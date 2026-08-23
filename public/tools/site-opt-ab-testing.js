/** Zoth Studio — A/B Testing Router (v2.0) */
(function(global){
  const ZothABTesting = { VERSION: '2.0.0', getVariant() { return Math.random() > 0.5 ? 'B' : 'A'; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothABTesting;
  else global.ZothABTesting = ZothABTesting;
})(typeof window !== 'undefined' ? window : globalThis);
