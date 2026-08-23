/** Zoth Studio — Dynamic Year (v2.0) */
(function(global){
  const ZothDynamicYear = { VERSION: '2.0.0', hydrate() { document.querySelectorAll('.dynamic-year').forEach(el => el.textContent = new Date().getFullYear()); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothDynamicYear;
  else global.ZothDynamicYear = ZothDynamicYear;
})(typeof window !== 'undefined' ? window : globalThis);
