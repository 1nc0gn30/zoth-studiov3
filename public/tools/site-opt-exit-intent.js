/** Zoth Studio — Exit Intent Detector (v2.0) */
(function(global){
  const ZothExitIntent = { VERSION: '2.0.0', onExit(cb) { document.addEventListener('mouseleave', (e) => { if (e.clientY <= 0) cb(); }); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothExitIntent;
  else global.ZothExitIntent = ZothExitIntent;
})(typeof window !== 'undefined' ? window : globalThis);
