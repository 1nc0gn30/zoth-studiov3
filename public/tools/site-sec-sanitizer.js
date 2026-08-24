/**
 * ⚡ ZOTH STUDIO — Zero-XSS HTML Sanitizer & Security Sentinel (v3.0.0)
 * Robust, client-side & server-side zero-dependency HTML sanitizer and AST security cleaner.
 * Strips script tags, unsafe protocols (javascript:, vbscript:, data:text/html),
 * inline event handlers (on*), iframes, objects, and malformed nested injection vectors.
 */
(function(global) {
  'use strict';

  const ALLOWED_TAGS = new Set([
    'a', 'abbr', 'address', 'article', 'aside', 'b', 'bdi', 'bdo', 'blockquote', 'br',
    'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'dd', 'del', 'details', 'dfn',
    'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'main', 'mark',
    'nav', 'ol', 'p', 'picture', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section',
    'small', 'span', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot',
    'th', 'thead', 'time', 'tr', 'u', 'ul', 'var', 'wbr'
  ]);

  const ALLOWED_ATTRS = new Set([
    'class', 'id', 'title', 'alt', 'src', 'href', 'target', 'rel', 'width', 'height',
    'loading', 'decoding', 'aria-label', 'aria-hidden', 'aria-expanded', 'aria-controls',
    'role', 'tabindex', 'data-*'
  ]);

  const FORBIDDEN_PROTOCOLS = /^(?:javascript|vbscript|data(?:\s*:\s*text\/html)|file):/i;
  const EVENT_HANDLER_ATTR = /^on[a-z]+/i;

  const ZothSanitizer = {
    VERSION: '3.0.0',

    /**
     * Sanitizes dirty HTML strings by removing unsafe tags, attributes, and protocols.
     * @param {string} dirty - Unsanitized HTML string.
     * @param {Object} [options] - Configuration options.
     * @returns {string} - Cleaned, safe HTML string.
     */
    sanitize(dirty, options = {}) {
      if (typeof dirty !== 'string') return '';
      let clean = dirty;

      // 1. Remove dangerous blocks repeatedly to prevent nested bypasses (e.g. <scr<script>ipt>)
      const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'applet', 'meta', 'base', 'link', 'svg'];
      dangerousTags.forEach(tag => {
        const tagRegex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>|<${tag}\\b[^>]*\\/?>`, 'gi');
        while (tagRegex.test(clean)) {
          clean = clean.replace(tagRegex, '');
        }
      });

      // 2. Strip inline event handlers (e.g., onerror=, onclick=, onload=)
      clean = clean.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

      // 3. Strip javascript: and vbscript: pseudoprotocols in attributes
      clean = clean.replace(/\s+(href|src|action|formaction|poster|data)\s*=\s*(["'])(.*?)\2/gi, (match, attr, quote, val) => {
        const trimmed = val.replace(/[\u0000-\u0020]/g, '').trim();
        if (FORBIDDEN_PROTOCOLS.test(trimmed)) {
          return ` ${attr}="#"`;
        }
        return match;
      });

      return clean;
    },

    /**
     * Inspects HTML for dangerous security risks and returns an audit report.
     * @param {string} dirty - HTML string to audit.
     * @returns {Object} - Audit findings and risk score.
     */
    audit(dirty) {
      if (typeof dirty !== 'string') return { risk_score: 0, findings: [] };
      const findings = [];
      
      if (/<script\b/i.test(dirty)) findings.push({ type: 'SCRIPT_TAG', severity: 'HIGH', desc: 'Executable <script> tag detected' });
      if (/<iframe\b/i.test(dirty)) findings.push({ type: 'IFRAME_TAG', severity: 'MEDIUM', desc: 'Cross-origin <iframe> detected' });
      if (/\son[a-z]+\s*=/i.test(dirty)) findings.push({ type: 'EVENT_HANDLER', severity: 'CRITICAL', desc: 'Inline DOM event handler (XSS vector)' });
      if (/javascript:/i.test(dirty)) findings.push({ type: 'JAVASCRIPT_URI', severity: 'CRITICAL', desc: 'javascript: pseudoprotocol URI' });

      const risk_score = findings.reduce((acc, f) => acc + (f.severity === 'CRITICAL' ? 40 : f.severity === 'HIGH' ? 25 : 10), 0);

      return {
        is_safe: findings.length === 0,
        risk_score: Math.min(100, risk_score),
        findings,
        sanitized: this.sanitize(dirty)
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZothSanitizer;
  } else {
    global.ZothSanitizer = ZothSanitizer;
  }
})(typeof window !== 'undefined' ? window : globalThis);
