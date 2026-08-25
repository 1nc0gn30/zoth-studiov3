/**
 * Zoth Studio — Prompt-Driven Template Rebranding Engine
 * Version: 4.0.0
 * 
 * Takes any base template from the 306+ project catalog and transforms it
 * into a fully branded, production-ready website/app according to the user's prompt.
 * Performs deep design-system swaps, inline SVG logo generation, trade-specific copy,
 * custom offering catalogs, localized testimonials, and multi-route packaging.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./site-templates-catalog', './zoth-domain-synthesizer', './site-swarm-orchestrator'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./site-templates-catalog.js'),
      require('./zoth-domain-synthesizer.js'),
      require('./site-swarm-orchestrator.js')
    );
  } else {
    root.ZothTemplateRebrander = factory(
      root.ZothTemplatesCatalog,
      root.ZothDomainSynthesizer,
      root.ZothSwarmOrchestrator
    );
  }
}(typeof self !== 'undefined' ? self : this, function (TemplatesCatalog, DomainSynthesizer, SwarmOrchestrator) {

  var PALETTES = {
    emerald: { bg: '#040d08', surface: '#0a1a11', border: 'rgba(52, 211, 153, 0.25)', accent: '#34d399', textMuted: '#94a3b8', name: 'Emerald Grounds' },
    cyan: { bg: '#040711', surface: '#0c1122', border: 'rgba(0, 240, 255, 0.25)', accent: '#00f0ff', textMuted: '#94a3b8', name: 'Obsidian Cyan' },
    gold: { bg: '#090805', surface: '#16130a', border: 'rgba(232, 200, 114, 0.25)', accent: '#e8c872', textMuted: '#a3a3a3', name: 'Champagne Gold' },
    coral: { bg: '#0d0708', surface: '#1c0f12', border: 'rgba(244, 63, 94, 0.25)', accent: '#fb7185', textMuted: '#a8a29e', name: 'Warm Coral' },
    violet: { bg: '#07050d', surface: '#120d22', border: 'rgba(192, 132, 252, 0.25)', accent: '#c084fc', textMuted: '#94a3b8', name: 'Ultraviolet' },
    amber: { bg: '#0d0a04', surface: '#1a1408', border: 'rgba(251, 191, 36, 0.25)', accent: '#fbbf24', textMuted: '#a3a3a3', name: 'Warm Amber' }
  };

  var ZothTemplateRebrander = {
    VERSION: '4.0.0',

    /**
     * Extract brand identity parameters from prompt and base template
     */
    extractBrandIdentity: function(baseTemplate, promptText) {
      var p = (promptText || '').trim();
      var t = baseTemplate || {};

      // Detect explicit brand name in quotes or before 'for' / 'as'
      var brandName = '';
      var quoteMatch = p.match(/["']([^"']+)["']/);
      if (quoteMatch) {
        brandName = quoteMatch[1];
      } else {
        var forMatch = p.match(/(?:rebrand\s+(?:this\s+)?(?:for|to|as)\s+)([a-zA-Z0-9\s&'-]+?)(?:\s+in|\s+with|\s+by|\s+featuring|\.|,|$)/i);
        if (forMatch && forMatch[1] && forMatch[1].length < 40) {
          brandName = forMatch[1].trim();
        }
      }

      if (!brandName) {
        brandName = t.title ? t.title.replace(/(?:Website|App|Tool|Template)$/i, '').trim() : 'Apex Sovereign';
      }

      // Extract owner / operator name
      var owner = 'Alex Mercer';
      var ownerMatch = p.match(/(?:by|owner|founder|run by|craftsman)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
      if (ownerMatch) {
        owner = ownerMatch[1].trim();
      }

      // Extract city / region
      var location = 'Virginia Beach, VA';
      var locMatch = p.match(/(?:in|serving|based in|located in)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/);
      if (locMatch && !locMatch[1].toLowerCase().includes('with')) {
        location = locMatch[1].trim();
      }

      // Extract theme color or palette preference
      var chosenPalette = 'cyan';
      var pLower = p.toLowerCase();
      if (pLower.includes('emerald') || pLower.includes('green') || pLower.includes('lawn') || pLower.includes('landscap')) {
        chosenPalette = 'emerald';
      } else if (pLower.includes('gold') || pLower.includes('luxury') || pLower.includes('jewelry') || pLower.includes('horolog')) {
        chosenPalette = 'gold';
      } else if (pLower.includes('coral') || pLower.includes('clean') || pLower.includes('wash') || pLower.includes('spa')) {
        chosenPalette = 'coral';
      } else if (pLower.includes('violet') || pLower.includes('purple') || pLower.includes('ai') || pLower.includes('neural')) {
        chosenPalette = 'violet';
      } else if (pLower.includes('amber') || pLower.includes('bakery') || pLower.includes('coffee') || pLower.includes('cafe')) {
        chosenPalette = 'amber';
      }

      return {
        name: brandName,
        owner: owner,
        location: location,
        paletteKey: chosenPalette,
        theme: PALETTES[chosenPalette] || PALETTES.cyan,
        templateId: t.id || 'custom-template',
        templateTitle: t.title || 'Base Blueprint'
      };
    },

    /**
     * Generate inline code-based SVG logo monogram
     */
    generateInlineLogoSvg: function(brandName, accentColor) {
      var initials = brandName.split(/\s+/).map(function(w) { return w[0]; }).slice(0, 2).join('').toUpperCase() || 'AZ';
      var color = accentColor || '#00f0ff';

      return '<svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">' +
        '<rect x="1" y="1" width="36" height="36" rx="8" fill="#070a14" stroke="' + color + '" stroke-width="1.5" stroke-opacity="0.6"/>' +
        '<rect x="4" y="4" width="30" height="30" rx="6" fill="' + color + '" fill-opacity="0.1"/>' +
        '<text x="19" y="24" font-family="Syne, sans-serif" font-size="14" font-weight="900" fill="' + color + '" text-anchor="middle">' + initials + '</text>' +
      '</svg>';
    },

    /**
     * Rebrand a base template according to a prompt
     * @param {string|Object} templateIdOrObj - Template ID from catalog or template object
     * @param {string} promptText - User rebranding prompt
     * @param {Object} customOptions - Optional overrides (accent, framework, hosting, etc.)
     */
    rebrand: function(templateIdOrObj, promptText, customOptions) {
      customOptions = customOptions || {};

      // 1. Resolve template
      var baseTemplate = null;
      if (typeof templateIdOrObj === 'string' && typeof TemplatesCatalog !== 'undefined') {
        baseTemplate = TemplatesCatalog.getById(templateIdOrObj);
      } else if (typeof templateIdOrObj === 'object') {
        baseTemplate = templateIdOrObj;
      }

      if (!baseTemplate) {
        baseTemplate = {
          id: 'universal-starter',
          title: 'Universal High-Performance Starter',
          category: '01-clients-services',
          stack: ['react', 'vite', 'tailwind'],
          framework: 'react',
          description: 'Production-ready web application blueprint.'
        };
      }

      // 2. Extract brand identity
      var identity = ZothTemplateRebrander.extractBrandIdentity(baseTemplate, promptText);
      if (customOptions.customAccent) {
        identity.theme.accent = customOptions.customAccent;
      }

      // 3. Hydrate authentic base template site model or synthesize
      var siteData = null;
      if (typeof TemplatesCatalog !== 'undefined' && TemplatesCatalog.getTemplateSite) {
        siteData = TemplatesCatalog.getTemplateSite(baseTemplate);
      }

      if (!siteData && typeof DomainSynthesizer !== 'undefined' && DomainSynthesizer.synthesize) {
        var synthPrompt = identity.name + ' — ' + (promptText || baseTemplate.description) + ' serving ' + identity.location + ' by ' + identity.owner;
        siteData = DomainSynthesizer.synthesize(synthPrompt, customOptions.agent || 'antigravity');
      }

      if (!siteData) {
        siteData = {
          name: identity.name,
          tagline: 'Craftsmanship, Precision & Sovereign Performance',
          badge: '⭐ Verified Premier Service',
          icon: '⚡',
          theme: identity.theme,
          hero: {
            title: 'Welcome to ' + identity.name + ' in ' + identity.location,
            sub: 'Owner-led excellence by ' + identity.owner + ' delivering bespoke quality and guaranteed satisfaction.',
            cta: '⚡ Get Instant Quote',
            ctaSecondary: '📞 Speak with ' + identity.owner.split(' ')[0]
          },
          bentoFeatures: [
            { icon: '🏆', title: 'Owner-Led Craftsmanship', desc: 'Direct oversight by ' + identity.owner + ' on every single project.' },
            { icon: '⏱️', title: 'Same-Day Dispatch', desc: 'Rapid response throughout the entire ' + identity.location + ' corridor.' },
            { icon: '🛡️', title: '100% Satisfaction Guarantee', desc: 'Zero risk. Upfront transparent rate cards with zero surprise fees.' }
          ],
          pricing: [
            { tier: 'Standard', price: '$49', desc: 'Essential coverage and maintenance.', perks: ['Full service scan', '24h Turnaround', 'Email reports'] },
            { tier: 'Premier Care', price: '$149', popular: true, desc: 'Complete turn-key VIP coverage.', perks: ['Priority dispatch', 'Weekly service', 'Direct SMS line with ' + identity.owner.split(' ')[0], 'Free annual inspection'] },
            { tier: 'Estate / Commercial', price: '$349', desc: 'Enterprise & multi-property contracts.', perks: ['Custom SLA', 'Dedicated crew', 'Dedicated account manager'] }
          ]
        };
      }

      // Ensure siteData has the exact rebranded name, theme, and identity tokens
      siteData.name = identity.name;
      siteData.theme = identity.theme;
      siteData.owner = identity.owner;
      siteData.location = identity.location;
      siteData.baseTemplate = baseTemplate;
      siteData.logoSvg = ZothTemplateRebrander.generateInlineLogoSvg(identity.name, identity.theme.accent);

      if (promptText && promptText.trim()) {
        siteData.hero.title = (identity.name !== baseTemplate.title) ? (identity.name + ' — ' + (baseTemplate.categoryShort || 'Premier') + ' in ' + identity.location) : siteData.hero.title;
        siteData.hero.sub = 'Owner-led excellence by ' + identity.owner + ' delivering bespoke quality, precision engineering, and guaranteed satisfaction.';
      }

      // 4. Generate all 6 routes with SwarmOrchestrator
      var routes = {};
      if (typeof SwarmOrchestrator !== 'undefined' && SwarmOrchestrator.generateRouteSuite) {
        routes = SwarmOrchestrator.generateRouteSuite(siteData, customOptions);
      }

      return {
        template: baseTemplate,
        prompt: promptText,
        identity: identity,
        site: siteData,
        routes: routes,
        rebrandedAt: new Date().toISOString()
      };
    }
  };

  return ZothTemplateRebrander;
}));
