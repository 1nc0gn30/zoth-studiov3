/** Zoth Studio — Zero-XSS HTML Sanitizer (v2.0) */
(function(global){
  const ZothSanitizer = { VERSION: '2.0.0', sanitize(dirty) { return dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothSanitizer;
  else global.ZothSanitizer = ZothSanitizer;
})(typeof window !== 'undefined' ? window : globalThis);
