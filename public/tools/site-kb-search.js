/**
 * Zoth Studio — Instant KB Search & Cmd+K Modal (v2.0)
 */
(function(global) {
  'use strict';
  const ZothKBSearch = {
    VERSION: '2.0.0',
    search(query, index = []) {
      const q = (query || '').toLowerCase().trim();
      if (!q) return index;
      return index.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q))
      );
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothKBSearch;
  else global.ZothKBSearch = ZothKBSearch;
})(typeof window !== 'undefined' ? window : globalThis);
