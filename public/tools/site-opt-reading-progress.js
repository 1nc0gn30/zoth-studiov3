/**
 * Zoth Studio — Scroll Reading Progress & Reading Time Meter (v2.0)
 * 
 * High-performance, zero-dependency client-side & SSR compatible reading progress indicator
 * with calculated reading time badge, dynamic time-remaining countdown, and multi-theme support.
 * Designed for documentation engines, blogs, technical articles, and content platforms.
 */
(function(global) {
  'use strict';

  const ZothReadingProgress = {
    VERSION: '2.0.0',

    // Default configuration options
    DEFAULTS: {
      wpm: 200,                  // Average reading speed in words per minute
      codeWpm: 120,              // Speed for technical code blocks
      imageSeconds: 12,          // Estimated seconds per image (Medium-style)
      barHeight: '3px',          // Height of the top progress bar
      theme: 'cyber-cyan',       // 'cyber-cyan' | 'emerald-matrix' | 'amber-fire' | 'obsidian-gold' | 'minimal' | 'custom'
      customGradient: null,      // Optional custom CSS gradient/color string
      glow: true,                // Enable neon glow effect
      zIndex: 99999,             // Z-index for the fixed progress bar
      targetSelector: 'article, .prose, .markdown-body, .doc-content, #content, main',
      badgeSelector: '.reading-time-target, .article-meta, .post-meta, .doc-header',
      showBadge: true,           // Auto-generate and inject reading time badge
      badgePosition: 'inline',   // 'inline' (inside metadata) or 'floating' (top right corner)
      showRemaining: true,       // Dynamically update time remaining on scroll
      showPercentage: false,     // Show small percentage badge inside progress bar
      smoothScroll: true         // Use hardware-accelerated transform for silky 60/120fps
    },

    // Built-in theme presets
    THEMES: {
      'cyber-cyan': {
        gradient: 'linear-gradient(90deg, #00f0ff 0%, #7000ff 50%, #ff007a 100%)',
        glow: '0 0 12px rgba(0, 240, 255, 0.75)',
        accent: '#00f0ff',
        bg: 'rgba(10, 15, 30, 0.85)',
        border: 'rgba(0, 240, 255, 0.3)'
      },
      'emerald-matrix': {
        gradient: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
        glow: '0 0 12px rgba(16, 185, 129, 0.75)',
        accent: '#10b981',
        bg: 'rgba(6, 20, 15, 0.85)',
        border: 'rgba(16, 185, 129, 0.3)'
      },
      'amber-fire': {
        gradient: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
        glow: '0 0 12px rgba(245, 158, 11, 0.75)',
        accent: '#f59e0b',
        bg: 'rgba(25, 15, 10, 0.85)',
        border: 'rgba(245, 158, 11, 0.3)'
      },
      'obsidian-gold': {
        gradient: 'linear-gradient(90deg, #d97706 0%, #fbbf24 50%, #fef08a 100%)',
        glow: '0 0 12px rgba(251, 191, 36, 0.75)',
        accent: '#fbbf24',
        bg: 'rgba(20, 18, 10, 0.85)',
        border: 'rgba(251, 191, 36, 0.3)'
      },
      'minimal': {
        gradient: '#ffffff',
        glow: '0 0 8px rgba(255, 255, 255, 0.4)',
        accent: '#ffffff',
        bg: 'rgba(0, 0, 0, 0.85)',
        border: 'rgba(255, 255, 255, 0.2)'
      }
    },

    /**
     * Extracts clean text content from string, DOM node, or selector
     * @param {string|HTMLElement} source
     * @returns {{ text: string, codeText: string, imageCount: number }}
     */
    extractContent(source) {
      if (!source) return { text: '', codeText: '', imageCount: 0 };

      // If running in Node/testing without DOM or passed a plain string
      if (typeof source === 'string') {
        // If it looks like HTML
        if (/<[a-z][\s\S]*>/i.test(source)) {
          const imgMatches = source.match(/<img\b[^>]*>/gi) || [];
          const codeMatches = source.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi) || [];
          const codeText = codeMatches.map(c => c.replace(/<[^>]+>/g, ' ')).join(' ');
          const cleanText = source
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<pre\b[^<]*(?:(?!<\/pre>)<[^<]*)*<\/pre>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return { text: cleanText, codeText, imageCount: imgMatches.length };
        }
        return { text: source.trim(), codeText: '', imageCount: 0 };
      }

      // If source is a DOM Element
      if (typeof HTMLElement !== 'undefined' && source instanceof HTMLElement) {
        const clone = source.cloneNode(true);
        // Remove non-content elements
        const removeSelectors = 'script, style, nav, footer, noscript, .no-read-progress';
        clone.querySelectorAll(removeSelectors).forEach(el => el.remove());

        const images = clone.querySelectorAll('img').length;
        const codeEls = clone.querySelectorAll('pre, code');
        let codeText = '';
        codeEls.forEach(c => {
          codeText += ' ' + (c.textContent || '');
        });

        // Remove code elements to prevent double counting in prose
        codeEls.forEach(c => c.remove());
        const proseText = (clone.textContent || '').replace(/\s+/g, ' ').trim();

        return { text: proseText, codeText: codeText.trim(), imageCount: images };
      }

      return { text: '', codeText: '', imageCount: 0 };
    },

    /**
     * Calculates detailed reading statistics for given content
     * @param {string|HTMLElement} content 
     * @param {Object} options 
     * @returns {Object}
     */
    calculateReadingTime(content, options = {}) {
      const opts = Object.assign({}, this.DEFAULTS, options);
      const { text, codeText, imageCount } = this.extractContent(content);

      const proseWords = text ? text.split(/\s+/).filter(Boolean).length : 0;
      const codeWords = codeText ? codeText.split(/\s+/).filter(Boolean).length : 0;
      const totalWords = proseWords + codeWords;
      const totalChars = (text ? text.length : 0) + (codeText ? codeText.length : 0);

      // Calculate time from prose, code, and images
      const proseMinutes = proseWords / (opts.wpm || 200);
      const codeMinutes = codeWords / (opts.codeWpm || 120);
      const imageMinutes = (imageCount * (opts.imageSeconds || 12)) / 60;

      const rawMinutes = proseMinutes + codeMinutes + imageMinutes;
      const minutes = Math.max(1, Math.ceil(rawMinutes));
      const totalSeconds = Math.round(rawMinutes * 60);

      const formattedTime = minutes === 1 ? '1 min read' : `${minutes} min read`;
      const badgeText = `⏱️ ${formattedTime} • ${totalWords.toLocaleString()} words`;

      return {
        words: totalWords,
        proseWords,
        codeWords,
        characters: totalChars,
        images: imageCount,
        minutes,
        seconds: totalSeconds,
        formattedTime,
        badgeText,
        wpm: opts.wpm
      };
    },

    /**
     * Calculates scroll progress percentage (0 - 100) and remaining time
     * @param {HTMLElement|Window} container 
     * @param {number} totalMinutes 
     * @returns {Object}
     */
    calculateProgress(container, totalMinutes = 1) {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      const isWindow = !container || container === (typeof window !== 'undefined' ? window : null) || container === global;

      if (typeof window !== 'undefined' && isWindow) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        scrollHeight = Math.max(
          document.body.scrollHeight || 0,
          document.documentElement.scrollHeight || 0
        );
        clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      } else if (container && typeof container === 'object') {
        scrollTop = container.scrollTop || 0;
        scrollHeight = container.scrollHeight || 0;
        clientHeight = container.clientHeight || 0;
      }

      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      const rawPercent = (scrollTop / maxScroll) * 100;
      const percent = Math.min(100, Math.max(0, Math.round(rawPercent * 10) / 10));
      const isComplete = percent >= 99.5;

      const remainingDecimal = totalMinutes * (1 - (percent / 100));
      const remainingMinutes = isComplete ? 0 : Math.max(1, Math.ceil(remainingDecimal));
      const remainingText = isComplete ? '🎉 Finished' : `${remainingMinutes} min left`;

      return {
        percent,
        scrollTop,
        scrollHeight,
        clientHeight,
        maxScroll,
        isComplete,
        remainingMinutes,
        remainingText
      };
    },

    /**
     * Generates the DOM element for the top scroll progress bar
     * @param {Object} options 
     * @returns {HTMLElement|null}
     */
    createProgressBar(options = {}) {
      if (typeof document === 'undefined') return null;

      const opts = Object.assign({}, this.DEFAULTS, options);
      const theme = this.THEMES[opts.theme] || this.THEMES['cyber-cyan'];
      const gradient = opts.customGradient || theme.gradient;
      const glow = opts.glow ? (theme.glow || '0 0 10px rgba(0,240,255,0.7)') : 'none';

      const existing = document.getElementById('zoth-reading-progress-bar');
      if (existing) existing.remove();

      // Outer container
      const container = document.createElement('div');
      container.id = 'zoth-reading-progress-bar';
      container.setAttribute('aria-hidden', 'true');
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: ${opts.barHeight};
        background: rgba(0, 0, 0, 0.15);
        z-index: ${opts.zIndex};
        pointer-events: none;
        overflow: hidden;
      `;

      // Inner active progress fill
      const fill = document.createElement('div');
      fill.className = 'zoth-progress-fill';
      fill.style.cssText = `
        height: 100%;
        width: 100%;
        background: ${gradient};
        box-shadow: ${glow};
        transform-origin: 0 50%;
        transform: scaleX(0);
        will-change: transform;
        transition: transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1);
      `;

      // Optional percentage pill
      if (opts.showPercentage) {
        const badge = document.createElement('div');
        badge.className = 'zoth-progress-pct';
        badge.style.cssText = `
          position: absolute;
          top: calc(${opts.barHeight} + 4px);
          right: 12px;
          background: ${theme.bg};
          border: 1px solid ${theme.border};
          color: ${theme.accent};
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 6px;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          pointer-events: auto;
          opacity: 0;
          transition: opacity 0.3s ease;
        `;
        badge.innerText = '0%';
        container.appendChild(badge);
      }

      container.appendChild(fill);
      return container;
    },

    /**
     * Creates a sleek reading time badge DOM element
     * @param {Object} stats Result from calculateReadingTime
     * @param {Object} options 
     * @returns {HTMLElement|null}
     */
    createBadge(stats, options = {}) {
      if (typeof document === 'undefined') return null;

      const opts = Object.assign({}, this.DEFAULTS, options);
      const theme = this.THEMES[opts.theme] || this.THEMES['cyber-cyan'];

      const badge = document.createElement('div');
      badge.className = 'zoth-reading-time-badge';
      badge.setAttribute('role', 'status');
      badge.setAttribute('aria-label', `Estimated reading time: ${stats.formattedTime}`);

      const baseStyles = `
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: ${theme.bg};
        border: 1px solid ${theme.border};
        color: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 0.8rem;
        font-weight: 500;
        padding: 5px 12px;
        border-radius: 9999px;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        transition: all 0.25s ease;
      `;

      if (opts.badgePosition === 'floating') {
        badge.style.cssText = `
          ${baseStyles}
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: ${opts.zIndex - 1};
          pointer-events: auto;
        `;
      } else {
        badge.style.cssText = baseStyles;
      }

      badge.innerHTML = `
        <span style="color:${theme.accent};font-size:0.9rem;line-height:1;">⚡</span>
        <span class="zoth-badge-static-time">${stats.formattedTime}</span>
        <span style="opacity:0.4;font-size:0.75rem;">•</span>
        <span style="color:#94a3b8;font-size:0.75rem;">${stats.words.toLocaleString()} words</span>
        ${opts.showRemaining ? `<span class="zoth-badge-remaining" style="margin-left:4px;padding-left:8px;border-left:1px solid ${theme.border};color:${theme.accent};font-size:0.72rem;font-family:monospace;">${stats.minutes}m left</span>` : ''}
      `;

      return badge;
    },

    /**
     * Initializes the scroll progress bar and reading time meter on the current page
     * @param {Object} options 
     * @returns {Object} Instance controller
     */
    init(options = {}) {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return {
          destroy() {},
          update() {},
          getStats() { return null; }
        };
      }

      const opts = Object.assign({}, this.DEFAULTS, options);

      // Locate target content container
      let targetEl = null;
      if (typeof opts.targetSelector === 'string') {
        targetEl = document.querySelector(opts.targetSelector);
      } else if (opts.targetSelector instanceof HTMLElement) {
        targetEl = opts.targetSelector;
      }

      // Calculate stats based on target or fallback to document body
      const contentSource = targetEl || document.body;
      const stats = this.calculateReadingTime(contentSource, opts);

      // Create and inject progress bar
      const barEl = this.createProgressBar(opts);
      if (barEl) {
        document.body.appendChild(barEl);
      }
      const fillEl = barEl ? barEl.querySelector('.zoth-progress-fill') : null;
      const pctEl = barEl ? barEl.querySelector('.zoth-progress-pct') : null;

      // Create and inject reading time badge if enabled
      let badgeEl = null;
      if (opts.showBadge) {
        badgeEl = this.createBadge(stats, opts);
        if (opts.badgePosition === 'floating') {
          document.body.appendChild(badgeEl);
        } else {
          const badgeTarget = document.querySelector(opts.badgeSelector);
          if (badgeTarget) {
            badgeTarget.prepend(badgeEl);
          } else if (targetEl && targetEl.firstElementChild) {
            targetEl.insertBefore(badgeEl, targetEl.firstElementChild);
          }
        }
      }
      const remainingSpan = badgeEl ? badgeEl.querySelector('.zoth-badge-remaining') : null;

      let ticking = false;
      let currentProgress = 0;

      const updateProgress = () => {
        const progress = this.calculateProgress(window, stats.minutes);
        currentProgress = progress.percent;

        if (fillEl) {
          fillEl.style.transform = `scaleX(${progress.percent / 100})`;
        }

        if (pctEl) {
          pctEl.innerText = `${Math.round(progress.percent)}%`;
          pctEl.style.opacity = progress.percent > 1 ? '1' : '0';
        }

        if (remainingSpan && opts.showRemaining) {
          remainingSpan.innerText = progress.isComplete ? '🎉 Finished' : `${progress.remainingMinutes}m left`;
        }

        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      // Initial update
      updateProgress();

      return {
        stats,
        barElement: barEl,
        badgeElement: badgeEl,
        getProgress: () => currentProgress,
        update: () => updateProgress(),
        destroy: () => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
          if (barEl) barEl.remove();
          if (badgeEl) badgeEl.remove();
        }
      };
    },

    /**
     * Generates a ready-to-embed HTML/CSS snippet for static sites, blogs, and documentation
     * @param {Object} config 
     * @returns {string}
     */
    generateHtmlWidget(config = {}) {
      const opts = Object.assign({}, this.DEFAULTS, config);
      const theme = this.THEMES[opts.theme] || this.THEMES['cyber-cyan'];
      const gradient = opts.customGradient || theme.gradient;
      const glow = opts.glow ? (theme.glow || '0 0 10px rgba(0,240,255,0.7)') : 'none';

      return `<!-- Zoth Reading Progress & Time Indicator -->
<div id="zoth-progress-container" style="position:fixed;top:0;left:0;width:100%;height:${opts.barHeight};z-index:${opts.zIndex};background:rgba(0,0,0,0.1);pointer-events:none;">
  <div id="zoth-progress-bar" style="height:100%;width:100%;background:${gradient};box-shadow:${glow};transform-origin:left;transform:scaleX(0);will-change:transform;transition:transform 0.08s linear;"></div>
</div>
<script>
(function() {
  var bar = document.getElementById('zoth-progress-bar');
  if (!bar) return;
  function onScroll() {
    var total = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
    var pct = total > 0 ? (window.pageYOffset || document.documentElement.scrollTop) / total : 0;
    bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct)) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
</script>`;
    }
  };

  // Export for Node.js / CommonJS or Browser Global
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZothReadingProgress;
  } else {
    global.ZothReadingProgress = ZothReadingProgress;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
