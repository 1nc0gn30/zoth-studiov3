/** Zoth Studio — Copy Snippets System (v2.0) */
(function(global){
  const ZothCopySnippets = { VERSION: '2.0.0', copyText(text) { navigator.clipboard.writeText(text); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothCopySnippets;
  else global.ZothCopySnippets = ZothCopySnippets;
})(typeof window !== 'undefined' ? window : globalThis);
