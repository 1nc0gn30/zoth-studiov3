/**
 * Zoth Studio — SVG Kinetic Logo & Favicon Generator (v2.0)
 */
(function(global) {
  'use strict';
  const ZothLogoGenerator = {
    VERSION: '2.0.0',
    generateSvgLogo(name, color = '#00f0ff') {
      const initial = (name || 'Z')[0].toUpperCase();
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="#d946ef" />
          </linearGradient>
        </defs>
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="rgba(10,15,30,0.8)" stroke="url(#logoGrad)" stroke-width="3" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4,2" />
        <text x="50" y="57" font-family="Syne, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">${initial}</text>
      </svg>`;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothLogoGenerator;
  else global.ZothLogoGenerator = ZothLogoGenerator;
})(typeof window !== 'undefined' ? window : globalThis);
