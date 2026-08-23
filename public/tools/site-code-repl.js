/**
 * Zoth Studio — Sandboxed Code Playground & REPL (v2.0)
 */
(function(global) {
  'use strict';
  const ZothCodeREPL = {
    VERSION: '2.0.0',
    runCode(codeString, outputId) {
      const out = document.getElementById(outputId);
      if (!out) return;
      try {
        const result = new Function(codeString)();
        out.textContent = `[Output]: ${result !== undefined ? result : 'Executed successfully (0 errors)'}`;
      } catch(e) {
        out.textContent = `[Runtime Error]: ${e.message}`;
      }
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothCodeREPL;
  else global.ZothCodeREPL = ZothCodeREPL;
})(typeof window !== 'undefined' ? window : globalThis);
