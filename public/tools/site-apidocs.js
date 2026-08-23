/**
 * Zoth Studio — Developer Docs & API Explorer Suite Engine (v2.0)
 * Provides interactive Swagger/OpenAPI style endpoint testing and multi-language SDK snippets.
 */
(function (global) {
  'use strict';
  const ZothApiDocs = {
    VERSION: '2.0.0',
    generateSnippet(endpoint, method = 'GET', lang = 'curl') {
      if (lang === 'curl') return `curl -X ${method} https://api.zoth.nullai.tech${endpoint} -H "Authorization: Bearer KEY"`;
      if (lang === 'js') return `const res = await fetch('https://api.zoth.nullai.tech${endpoint}');\nconst data = await res.json();`;
      if (lang === 'python') return `import requests\nres = requests.${method.lower()}('https://api.zoth.nullai.tech${endpoint}')\nprint(res.json())`;
      return '';
    }
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = ZothApiDocs; }
  else { global.ZothApiDocs = ZothApiDocs; }
})(typeof window !== 'undefined' ? window : globalThis);
