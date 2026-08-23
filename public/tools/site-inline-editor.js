/**
 * Zoth Studio — WYSIWYG In-Place Content Editor (v2.0)
 */
(function(global) {
  'use strict';
  const ZothInlineEditor = {
    VERSION: '2.0.0',
    enableEditable(iframeId) {
      const iframe = document.getElementById(iframeId);
      if (!iframe || !iframe.contentDocument) return;
      const doc = iframe.contentDocument;
      doc.querySelectorAll('h1, h2, h3, h4, p, span.badge, button.btn').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.style.outline = '1px dashed rgba(0, 240, 255, 0.4)';
        el.addEventListener('input', () => {
          console.log('[Inline Edit]', el.tagName, el.innerText);
        });
      });
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothInlineEditor;
  else global.ZothInlineEditor = ZothInlineEditor;
})(typeof window !== 'undefined' ? window : globalThis);
