/**
 * Zoth Studio — Dynamic GitHub Shields & Status Badge Generator (v2.0)
 * Procedural SVG badge engine for build passing, version, license, uptime, and custom shields.
 * 
 * Supports standard shields.io styles (flat, flat-square, plastic, for-the-badge, pill)
 * and futuristic Cyber-Neon / Sovereign glowing status badges.
 */
(function(global) {
  'use strict';

  // --- XML & String Escaping ---
  function escapeXml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // --- Color Palette Presets ---
  const COLOR_PRESETS = {
    brightgreen: '#4c1',
    green: '#2ea44f',
    emerald: '#10b981',
    yellowgreen: '#a4a61d',
    yellow: '#dfb317',
    amber: '#f59e0b',
    orange: '#fe7d37',
    red: '#e05d44',
    rose: '#f43f5e',
    blue: '#007ec6',
    indigo: '#6366f1',
    purple: '#8b5cf6',
    pink: '#ec4899',
    magenta: '#d946ef',
    cyan: '#00f0ff',
    teal: '#14b8a6',
    grey: '#555555',
    gray: '#555555',
    lightgrey: '#9f9f9f',
    lightgray: '#9f9f9f',
    dark: '#1e293b',
    black: '#0f172a',
    cyber: '#00f0ff',
    sovereign: '#38bdf8'
  };

  function resolveColor(color, defaultColor = '#555555') {
    if (!color) return defaultColor;
    const lower = String(color).toLowerCase().trim();
    if (COLOR_PRESETS[lower]) return COLOR_PRESETS[lower];
    if (lower.startsWith('#') || lower.startsWith('rgb') || lower.startsWith('hsl')) {
      return color;
    }
    return `#${color}`;
  }

  // --- Text Width Estimation (Verdana / System Sans at ~11px) ---
  function estimateCharWidth(ch) {
    if ('il.:!|;,\''.includes(ch)) return 3.6;
    if ('Irt`j[]() -/'.includes(ch)) return 5.8;
    if ('ABCDEFGHJKLMNOPQRSTUVWXYZmwMW%#@&_~+'.includes(ch)) return 8.6;
    if ('0123456789'.includes(ch)) return 7.2;
    return 6.8;
  }

  function calculateTextWidth(text, fontSize = 11, isUpperCase = false) {
    if (!text) return 0;
    const str = isUpperCase ? String(text).toUpperCase() : String(text);
    let total = 0;
    for (let i = 0; i < str.length; i++) {
      total += estimateCharWidth(str[i]);
    }
    const scale = fontSize / 11;
    return Math.round(total * scale);
  }

  // --- Built-in SVG Icons (14x14 viewBox) ---
  const ICONS = {
    check: '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
    cross: '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
    gear: '<path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.45.17-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
    tag: '<path fill="currentColor" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>',
    shield: '<path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>',
    scale: '<path fill="currentColor" d="M12 3v2.28C8.61 5.79 6 8.74 6 12.3c0 3.98 3.22 7.2 7.2 7.2 3.98 0 7.2-3.22 7.2-7.2 0-3.56-2.61-6.51-6-7.02V3h4v-2H5v2h7zm-4.7 9.3c0-2.6 2.1-4.7 4.7-4.7s4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7-4.7-2.1-4.7-4.7z"/>',
    pulse: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    bolt: '<path fill="currentColor" d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>',
    github: '<path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>',
    rocket: '<path fill="currentColor" d="M13.13 2.05c-1.44.13-2.91.73-4.13 1.95L7.29 5.71C6.73 5.48 6.13 5.34 5.5 5.34c-1.9 0-3.5 1.6-3.5 3.5 0 .63.14 1.23.37 1.79L.71 12.29c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l1.66-1.66c.56.23 1.16.37 1.79.37 1.9 0 3.5-1.6 3.5-3.5 0-.63-.14-1.23-.37-1.79l1.71-1.71c2.14-2.14 2.82-5.18 1.6-7.48zM5.5 8.84c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11.36 4.3l-2.12-2.12c-.39-.39-1.02-.39-1.41 0l-1.66 1.66c.39.39.73.83 1.01 1.32l1.07-1.07 1.41 1.41-1.07 1.07c.49.28.93.62 1.32 1.01l1.66-1.66c.4-.39.4-1.03-.21-1.62z"/>',
    cube: '<path fill="currentColor" d="M12 2l-9.5 5.5v11L12 24l9.5-5.5v-11L12 2zm0 2.311l7.5 4.344-3.5 2.027-7.5-4.344 3.5-2.027zm-8 6.476l7 4.056v8.083l-7-4.056V10.787zm9 12.139v-8.083l7-4.056v8.083l-7 4.056z"/>'
  };

  const ZothBadgeGenerator = {
    VERSION: '2.0.0',

    /**
     * Get list of supported badge styles
     */
    getAvailableStyles() {
      return ['flat', 'flat-square', 'plastic', 'for-the-badge', 'cyber', 'neon', 'pill'];
    },

    /**
     * Get list of preset colors
     */
    getPresetColors() {
      return Object.assign({}, COLOR_PRESETS);
    },

    /**
     * Core SVG Badge Generator
     * @param {Object} options Configuration options
     * @returns {string} Procedural SVG string
     */
    generateBadge(options = {}) {
      const {
        label = 'badge',
        message = 'online',
        color = '#10b981',
        labelColor = '#555555',
        style = 'flat',
        logo = null,
        logoColor = '#ffffff',
        logoWidth = 14,
        logoPadding = 3,
        link = null,
        shadow = true,
        glow = false,
        pulse = false,
        borderRadius = null,
        fontFamily = 'Verdana,Geneva,"DejaVu Sans",sans-serif',
        labelTextColor = '#ffffff',
        messageTextColor = '#ffffff'
      } = options;

      const isForTheBadge = style === 'for-the-badge';
      const isCyber = style === 'cyber' || style === 'neon';
      const isPlastic = style === 'plastic';
      const isFlatSquare = style === 'flat-square';
      const isPill = style === 'pill';

      const height = isForTheBadge ? 28 : (isCyber ? 24 : 20);
      const fontSize = isForTheBadge ? 10 : (isCyber ? 11 : 11);
      const labelText = isForTheBadge ? String(label).toUpperCase() : String(label);
      const messageText = isForTheBadge ? String(message).toUpperCase() : String(message);

      // Width calculations
      const rawLabelWidth = calculateTextWidth(labelText, fontSize, isForTheBadge);
      const rawMessageWidth = calculateTextWidth(messageText, fontSize, isForTheBadge);

      const hasLogo = Boolean(logo && (ICONS[logo] || logo.startsWith('<path') || logo.startsWith('<svg')));
      const logoSpace = hasLogo ? (logoWidth + logoPadding + 3) : 0;
      
      const horizontalPad = isForTheBadge ? 14 : (isCyber ? 10 : 8);
      const leftWidth = labelText ? (rawLabelWidth + (horizontalPad * 2) + logoSpace) : 0;
      const rightWidth = rawMessageWidth + (horizontalPad * 2);
      const totalWidth = leftWidth + rightWidth;

      // Positioning coordinates
      const logoX = horizontalPad + (logoWidth / 2);
      const logoY = (height - logoWidth) / 2;
      const labelX = leftWidth ? (hasLogo ? (logoSpace + horizontalPad + (rawLabelWidth / 2)) : (leftWidth / 2)) : 0;
      const messageX = leftWidth + (rightWidth / 2);
      
      // Text baseline
      const textY = isForTheBadge ? 18 : (isCyber ? 16 : 14);
      const shadowY = textY + 1;

      // Radius
      let rx = 3;
      if (isFlatSquare) rx = 0;
      else if (isForTheBadge) rx = 0;
      else if (isPill) rx = Math.round(height / 2);
      else if (isCyber) rx = 4;
      if (borderRadius !== null) rx = borderRadius;

      // Color resolution
      const resolvedRightBg = resolveColor(color, '#10b981');
      const resolvedLeftBg = resolveColor(labelColor, isCyber ? '#090d16' : '#555555');

      // Unique gradient IDs
      const uid = 'zbg_' + Math.random().toString(36).substring(2, 9);

      // Build SVG output
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${height}" role="img" aria-label="${escapeXml(label)}: ${escapeXml(message)}">\n`;
      svg += `  <title>${escapeXml(label)}: ${escapeXml(message)}</title>\n`;

      // Definitions & Filters
      svg += `  <defs>\n`;
      if (isPlastic) {
        svg += `    <linearGradient id="${uid}_sheen" x1="0" y1="0" x2="0" y2="100%">\n`;
        svg += `      <stop offset="0" stop-color="#fff" stop-opacity=".7"/>\n`;
        svg += `      <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>\n`;
        svg += `      <stop offset=".9" stop-color="#000" stop-opacity=".3"/>\n`;
        svg += `      <stop offset="1" stop-color="#000" stop-opacity=".5"/>\n`;
        svg += `    </linearGradient>\n`;
      }
      if (isCyber || glow) {
        svg += `    <linearGradient id="${uid}_cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">\n`;
        svg += `      <stop offset="0%" stop-color="#00f0ff"/>\n`;
        svg += `      <stop offset="50%" stop-color="#3b82f6"/>\n`;
        svg += `      <stop offset="100%" stop-color="#d946ef"/>\n`;
        svg += `    </linearGradient>\n`;
        svg += `    <filter id="${uid}_neonGlow" x="-20%" y="-20%" width="140%" height="140%">\n`;
        svg += `      <feGaussianBlur stdDeviation="2" result="blur"/>\n`;
        svg += `      <feComposite in="SourceGraphic" in2="blur" operator="over"/>\n`;
        svg += `    </filter>\n`;
      }
      svg += `    <clipPath id="${uid}_clip">\n`;
      svg += `      <rect width="${totalWidth}" height="${height}" rx="${rx}" fill="#fff"/>\n`;
      svg += `    </clipPath>\n`;
      svg += `  </defs>\n`;

      // Background rects clipped
      svg += `  <g clip-path="url(#${uid}_clip)">\n`;
      if (leftWidth > 0) {
        svg += `    <rect width="${leftWidth}" height="${height}" fill="${resolvedLeftBg}"/>\n`;
        svg += `    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${resolvedRightBg}"/>\n`;
      } else {
        svg += `    <rect width="${totalWidth}" height="${height}" fill="${resolvedRightBg}"/>\n`;
      }

      if (isPlastic) {
        svg += `    <rect width="${totalWidth}" height="${height}" fill="url(#${uid}_sheen)"/>\n`;
      }

      if (isCyber) {
        // Futuristic cyber grid/corner accents
        svg += `    <line x1="0" y1="0" x2="${totalWidth}" y2="0" stroke="url(#${uid}_cyberGrad)" stroke-width="1.5" opacity="0.8"/>\n`;
        svg += `    <line x1="${leftWidth}" y1="0" x2="${leftWidth}" y2="${height}" stroke="rgba(0,240,255,0.4)" stroke-width="1"/>\n`;
        svg += `    <rect x="0.5" y="0.5" width="${totalWidth - 1}" height="${height - 1}" rx="${rx}" fill="none" stroke="url(#${uid}_cyberGrad)" stroke-width="1" opacity="0.6"/>\n`;
      }
      svg += `  </g>\n`;

      // Optional pulse dot for live uptime or active status
      if (pulse) {
        const dotX = leftWidth ? (leftWidth + 10) : 10;
        const dotY = height / 2;
        svg += `  <circle cx="${dotX}" cy="${dotY}" r="3" fill="#10b981">\n`;
        svg += `    <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/>\n`;
        svg += `    <animate attributeName="r" values="3;4.2;3" dur="1.6s" repeatCount="indefinite"/>\n`;
        svg += `  </circle>\n`;
      }

      // Icon Render
      if (hasLogo) {
        const iconSvg = ICONS[logo] || logo;
        const iconColor = resolveColor(logoColor, '#ffffff');
        svg += `  <g transform="translate(${horizontalPad}, ${logoY})" color="${iconColor}">\n`;
        svg += `    <svg width="${logoWidth}" height="${logoWidth}" viewBox="0 0 24 24" fill="currentColor">\n`;
        svg += `      ${iconSvg}\n`;
        svg += `    </svg>\n`;
        svg += `  </g>\n`;
      }

      // Typography rendering
      const letterSpacing = isForTheBadge ? ' letter-spacing="1.5"' : '';
      const fontWeight = isForTheBadge ? ' font-weight="700"' : (isCyber ? ' font-weight="600"' : ' font-weight="400"');
      const font = isCyber ? '"Fira Code",Consolas,Menlo,monospace' : fontFamily;

      svg += `  <g fill="#fff" text-anchor="middle" font-family="${font}" font-size="${fontSize}"${fontWeight}${letterSpacing} text-rendering="geometricPrecision">\n`;
      
      // Label text
      if (leftWidth > 0 && labelText) {
        if (shadow && !isCyber) {
          svg += `    <text x="${labelX}" y="${shadowY}" fill="#010101" fill-opacity=".3">${escapeXml(labelText)}</text>\n`;
        }
        svg += `    <text x="${labelX}" y="${textY}" fill="${labelTextColor}">${escapeXml(labelText)}</text>\n`;
      }

      // Message text
      if (messageText) {
        if (shadow && !isCyber) {
          svg += `    <text x="${messageX}" y="${shadowY}" fill="#010101" fill-opacity=".3">${escapeXml(messageText)}</text>\n`;
        }
        const msgGlow = isCyber ? ` filter="url(#${uid}_neonGlow)"` : '';
        svg += `    <text x="${messageX}" y="${textY}" fill="${messageTextColor}"${msgGlow}>${escapeXml(messageText)}</text>\n`;
      }

      svg += `  </g>\n`;
      svg += `</svg>`;

      return svg;
    },

    /**
     * Build Status Badge
     * @param {string} status - 'passing' | 'failing' | 'running' | 'unknown'
     * @param {Object} options
     * @returns {string} SVG
     */
    generateBuildBadge(status = 'passing', options = {}) {
      const s = String(status).toLowerCase();
      let color = '#10b981';
      let message = 'passing';
      let logo = 'check';

      if (s === 'failing' || s === 'failed' || s === 'failure' || s === 'error') {
        color = '#ef4444';
        message = 'failing';
        logo = 'cross';
      } else if (s === 'running' || s === 'building' || s === 'pending') {
        color = '#00f0ff';
        message = 'running';
        logo = 'gear';
      } else if (s === 'unknown' || s === 'skipped' || s === 'cancelled') {
        color = '#6b7280';
        message = 'unknown';
        logo = null;
      }

      return this.generateBadge(Object.assign({
        label: 'build',
        message: options.message || message,
        color: options.color || color,
        logo: options.logo !== undefined ? options.logo : logo,
        logoColor: '#ffffff'
      }, options));
    },

    /**
     * Release Version Badge
     * @param {string} version - e.g. 'v3.0.0'
     * @param {Object} options
     * @returns {string} SVG
     */
    generateVersionBadge(version = 'v3.0.0', options = {}) {
      const v = String(version);
      const isPrerelease = v.includes('-') || v.includes('alpha') || v.includes('beta') || v.includes('rc');
      const color = isPrerelease ? '#f59e0b' : '#00f0ff';

      return this.generateBadge(Object.assign({
        label: 'version',
        message: v.startsWith('v') ? v : `v${v}`,
        color: options.color || color,
        logo: options.logo !== undefined ? options.logo : 'tag',
        logoColor: '#ffffff'
      }, options));
    },

    /**
     * Software License Badge
     * @param {string} license - e.g. 'MIT', 'Apache-2.0', 'Proprietary'
     * @param {Object} options
     * @returns {string} SVG
     */
    generateLicenseBadge(license = 'MIT', options = {}) {
      const lic = String(license).toUpperCase();
      let color = '#3b82f6';
      if (lic === 'MIT') color = '#10b981';
      else if (lic.includes('APACHE') || lic.includes('BSD')) color = '#00f0ff';
      else if (lic.includes('GPL') || lic.includes('AGPL')) color = '#f59e0b';
      else if (lic.includes('PROPRIETARY') || lic.includes('COMMERCIAL')) color = '#d946ef';

      return this.generateBadge(Object.assign({
        label: 'license',
        message: String(license),
        color: options.color || color,
        logo: options.logo !== undefined ? options.logo : 'shield',
        logoColor: '#ffffff'
      }, options));
    },

    /**
     * Live Service Uptime Badge
     * @param {string|number} uptime - e.g. '99.99%', 99.98
     * @param {Object} options
     * @returns {string} SVG
     */
    generateUptimeBadge(uptime = '99.99%', options = {}) {
      const rawNum = parseFloat(String(uptime).replace('%', ''));
      let color = '#10b981';
      if (!isNaN(rawNum)) {
        if (rawNum >= 99.5) color = '#10b981';
        else if (rawNum >= 95.0) color = '#f59e0b';
        else color = '#ef4444';
      }

      const formatted = String(uptime).includes('%') ? String(uptime) : `${uptime}%`;

      return this.generateBadge(Object.assign({
        label: 'uptime',
        message: formatted,
        color: options.color || color,
        logo: options.logo !== undefined ? options.logo : 'pulse',
        pulse: options.pulse !== undefined ? options.pulse : true
      }, options));
    },

    /**
     * Custom Custom-Tailored Badge
     * @param {string} label
     * @param {string} message
     * @param {string} color
     * @param {Object} options
     * @returns {string} SVG
     */
    generateCustomBadge(label, message, color, options = {}) {
      return this.generateBadge(Object.assign({
        label,
        message,
        color
      }, options));
    },

    /**
     * Convert raw SVG to browser-safe Data URI
     * @param {string} svgContent
     * @returns {string} Data URI
     */
    toDataUri(svgContent) {
      if (typeof btoa === 'function') {
        try {
          return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
        } catch (e) {
          // Fallback to URL encoding
        }
      }
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgContent);
    },

    /**
     * Format badge as GitHub Markdown
     * @param {Object} badgeConfig
     * @returns {string} Markdown snippet
     */
    toMarkdown(badgeConfig = {}) {
      const svg = this.generateBadge(badgeConfig);
      const dataUri = this.toDataUri(svg);
      const alt = `${badgeConfig.label || 'badge'}: ${badgeConfig.message || ''}`;
      const link = badgeConfig.link || '#';
      return `[![${escapeXml(alt)}](${dataUri})](${link})`;
    },

    /**
     * Format badge as HTML <img> or raw <svg>
     * @param {Object} badgeConfig
     * @param {boolean} rawSvg
     * @returns {string} HTML snippet
     */
    toHtml(badgeConfig = {}, rawSvg = false) {
      const svg = this.generateBadge(badgeConfig);
      if (rawSvg) return svg;
      const dataUri = this.toDataUri(svg);
      const alt = `${badgeConfig.label || 'badge'}: ${badgeConfig.message || ''}`;
      return `<img src="${dataUri}" alt="${escapeXml(alt)}" />`;
    },

    /**
     * Generate complete standard badge suite for repository/dashboard
     * @param {Object} suiteConfig
     * @returns {Object} Collection of SVGs and markdown links
     */
    generateBadgeSuite(suiteConfig = {}) {
      const {
        name = 'Apex Platform',
        version = 'v3.0.0',
        buildStatus = 'passing',
        license = 'MIT',
        uptime = '99.99%',
        style = 'for-the-badge',
        repoUrl = 'https://github.com/azoth-sovereign'
      } = suiteConfig;

      const buildSvg = this.generateBuildBadge(buildStatus, { style });
      const versionSvg = this.generateVersionBadge(version, { style });
      const licenseSvg = this.generateLicenseBadge(license, { style });
      const uptimeSvg = this.generateUptimeBadge(uptime, { style });
      const sovereignSvg = this.generateCustomBadge('platform', name, '#00f0ff', { style, logo: 'cube' });

      return {
        build: { svg: buildSvg, markdown: this.toMarkdown({ label: 'build', message: buildStatus, color: '#10b981', style, logo: 'check' }) },
        version: { svg: versionSvg, markdown: this.toMarkdown({ label: 'version', message: version, color: '#00f0ff', style, logo: 'tag' }) },
        license: { svg: licenseSvg, markdown: this.toMarkdown({ label: 'license', message: license, color: '#3b82f6', style, logo: 'shield' }) },
        uptime: { svg: uptimeSvg, markdown: this.toMarkdown({ label: 'uptime', message: uptime, color: '#10b981', style, logo: 'pulse' }) },
        platform: { svg: sovereignSvg, markdown: this.toMarkdown({ label: 'platform', message: name, color: '#00f0ff', style, logo: 'cube' }) },
        allMarkdown: [
          this.toMarkdown({ label: 'platform', message: name, color: '#00f0ff', style, logo: 'cube', link: repoUrl }),
          this.toMarkdown({ label: 'version', message: version, color: '#00f0ff', style, logo: 'tag', link: repoUrl }),
          this.toMarkdown({ label: 'build', message: buildStatus, color: '#10b981', style, logo: 'check', link: repoUrl }),
          this.toMarkdown({ label: 'uptime', message: uptime, color: '#10b981', style, logo: 'pulse', link: repoUrl }),
          this.toMarkdown({ label: 'license', message: license, color: '#3b82f6', style, logo: 'shield', link: repoUrl })
        ].join(' ')
      };
    },

    /**
     * Render badges dynamically into a DOM element
     * @param {HTMLElement|string} container - DOM element or selector
     * @param {Array<Object>} badges - Array of badge options
     */
    renderBadgesToContainer(container, badges = []) {
      if (typeof document === 'undefined') return;
      const el = typeof container === 'string' ? document.querySelector(container) : container;
      if (!el) return;

      el.innerHTML = '';
      el.style.display = 'inline-flex';
      el.style.flexWrap = 'wrap';
      el.style.gap = '8px';
      el.style.alignItems = 'center';

      badges.forEach(badgeOptions => {
        const span = document.createElement('span');
        span.className = 'zoth-dynamic-badge';
        span.innerHTML = this.generateBadge(badgeOptions);
        el.appendChild(span);
      });
    }
  };

  // Module Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZothBadgeGenerator;
  } else {
    global.ZothBadgeGenerator = ZothBadgeGenerator;
  }
})(typeof window !== 'undefined' ? window : globalThis);
