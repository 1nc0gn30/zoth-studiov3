// Zoth Studio — Bento Section & Component Library Engine
// Hermes Lane: web-foundry/components
//
// 100% Sovereign, zero external dependencies, responsive modern HTML/CSS/JS component generators.
// Compatible with Browser (window.ZothSiteSections) and Node.js (CommonJS / ESM).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothSiteSections = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var VERSION = "2026-08-22";

  // ---- Available Variants Catalog -------------------------------------------
  var HERO_VARIANTS = {
    PARTICLE_MESH: "particle-mesh",
    TILT_CARD_3D: "tilt-card-3d",
    MINIMALIST_GLOW: "minimalist-glow"
  };

  var BENTO_VARIANTS = {
    BENTO_4_BOX: "bento-4-box",
    BENTO_6_BOX: "bento-6-box"
  };

  var PRICING_VARIANTS = {
    MATRIX_TOGGLE: "matrix-toggle"
  };

  var TESTIMONIAL_VARIANTS = {
    INFINITE_MARQUEE: "infinite-marquee",
    INTERACTIVE_CARDS: "interactive-cards"
  };

  var SANDBOX_VARIANTS = {
    CODE_EXEC_AUDIO: "code-exec-audio"
  };

  var FAQ_VARIANTS = {
    ACCORDION_A11Y: "accordion-a11y"
  };

  var MODAL_VARIANTS = {
    WAITLIST_LEAD_CAPTURE: "waitlist-lead-capture"
  };

  // ---- Default Theme Presets ------------------------------------------------
  var DEFAULT_THEME = {
    name: "Obsidian Cyan",
    bg: "#050711",
    surface: "rgba(10, 15, 29, 0.88)",
    card: "rgba(14, 20, 38, 0.75)",
    border: "rgba(0, 240, 255, 0.22)",
    borderHover: "rgba(0, 240, 255, 0.65)",
    accent: "#00f0ff",
    accentGlow: "rgba(0, 240, 255, 0.35)",
    gold: "#e8c872",
    green: "#34d399",
    purple: "#c084fc",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    badgeBg: "rgba(0, 240, 255, 0.12)",
    fontDisplay: "'Syne', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSans: "'Figtree', -apple-system, BlinkMacSystemFont, sans-serif",
    fontMono: "'IBM Plex Mono', monospace"
  };

  // ===========================================================================
  // SECTION GENERATORS
  // ===========================================================================

  // 1. HERO SECTION GENERATOR
  function generateHeroSection(variant, options) {
    variant = variant || HERO_VARIANTS.PARTICLE_MESH;
    var opt = options || {};
    var title = opt.title || "Next-Gen Autonomous Web Foundry";
    var highlight = opt.highlight || "Powered by Sovereign AI";
    var desc = opt.desc || "Build, orchestrate, and deploy high-performance applications locally with multi-agent swarms, deterministic AST validation, and zero cloud telemetry.";
    var badge = opt.badge || "⚡ Sovereign AI 2.0 · Local-First";
    var primaryCta = opt.primaryCta || "⚡ Launch Studio";
    var secondaryCta = opt.secondaryCta || "📖 Documentation";

    if (variant === HERO_VARIANTS.TILT_CARD_3D) {
      return `
      <!-- Zoth Hero: 3D Tilt Card Variant -->
      <section class="zoth-section zoth-hero zoth-hero-tilt" id="hero">
        <div class="zoth-hero-tilt-grid">
          <div class="zoth-hero-text">
            <div class="zoth-badge-row">
              <span class="zoth-badge zoth-badge-pulse">
                <span class="zoth-pulse-dot"></span>
                ${badge}
              </span>
            </div>
            <h1 class="zoth-hero-title">
              ${title} <br />
              <span class="zoth-gradient-text">${highlight}</span>
            </h1>
            <p class="zoth-hero-desc">${desc}</p>
            <div class="zoth-hero-cta">
              <button class="zoth-btn zoth-btn-primary" onclick="zothTriggerAction('launch')">${primaryCta}</button>
              <button class="zoth-btn zoth-btn-ghost" onclick="zothTriggerAction('docs')">${secondaryCta}</button>
            </div>
            <div class="zoth-trust-row">
              <div class="zoth-trust-item"><span class="zoth-check">✓</span> 100% Client-Side</div>
              <div class="zoth-trust-item"><span class="zoth-check">✓</span> Zero Telemetry</div>
              <div class="zoth-trust-item"><span class="zoth-check">✓</span> OWASP CSP Safe</div>
            </div>
          </div>
          <div class="zoth-hero-visual">
            <div class="zoth-tilt-container" id="zothTiltCard">
              <div class="zoth-tilt-card-glow"></div>
              <div class="zoth-tilt-card-body">
                <div class="zoth-tilt-header">
                  <div class="zoth-tilt-chips">
                    <span class="zoth-dot-red"></span>
                    <span class="zoth-dot-yellow"></span>
                    <span class="zoth-dot-green"></span>
                  </div>
                  <span class="zoth-tilt-status">SOVEREIGN CORE ACTIVE</span>
                </div>
                <div class="zoth-3d-hologram">
                  <div class="zoth-holo-cube">
                    <div class="zoth-cube-face zoth-cube-front">ZOTH</div>
                    <div class="zoth-cube-face zoth-cube-back">AI</div>
                    <div class="zoth-cube-face zoth-cube-right">AST</div>
                    <div class="zoth-cube-face zoth-cube-left">2026</div>
                    <div class="zoth-cube-face zoth-cube-top"></div>
                    <div class="zoth-cube-face zoth-cube-bottom"></div>
                  </div>
                </div>
                <div class="zoth-tilt-floating-badge zoth-float-1">
                  <span class="zoth-float-icon">⚡</span>
                  <div>
                    <div class="zoth-float-label">Multi-Agent Swarm</div>
                    <div class="zoth-float-val">21 Nodes Synchronized</div>
                  </div>
                </div>
                <div class="zoth-tilt-floating-badge zoth-float-2">
                  <span class="zoth-float-icon">🛡️</span>
                  <div>
                    <div class="zoth-float-label">AST Self-Healing</div>
                    <div class="zoth-float-val">14 Vectors Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    }

    if (variant === HERO_VARIANTS.MINIMALIST_GLOW) {
      return `
      <!-- Zoth Hero: Minimalist Headline with Glow Badges -->
      <section class="zoth-section zoth-hero zoth-hero-minimalist" id="hero">
        <div class="zoth-minimalist-ambient-glow"></div>
        <div class="zoth-badge-row zoth-center">
          <span class="zoth-badge zoth-badge-glow">${badge}</span>
          <span class="zoth-badge zoth-badge-glow">🔒 Zero Cloud Leakage</span>
          <span class="zoth-badge zoth-badge-glow">⚡ &lt;50ms AST Synth</span>
        </div>
        <h1 class="zoth-hero-title zoth-hero-title-lg">
          ${title} <br />
          <span class="zoth-gradient-text">${highlight}</span>
        </h1>
        <p class="zoth-hero-desc zoth-hero-desc-center">${desc}</p>
        <div class="zoth-hero-cta zoth-center">
          <button class="zoth-btn zoth-btn-primary zoth-btn-lg" onclick="zothTriggerAction('launch')">${primaryCta}</button>
          <button class="zoth-btn zoth-btn-ghost zoth-btn-lg" onclick="zothOpenWaitlistModal()">${secondaryCta}</button>
        </div>
        <div class="zoth-metrics-strip">
          <div class="zoth-metric-card">
            <div class="zoth-metric-val">100%</div>
            <div class="zoth-metric-lbl">Local Sovereignty</div>
          </div>
          <div class="zoth-metric-card">
            <div class="zoth-metric-val">14/14</div>
            <div class="zoth-metric-lbl">AST Security Vectors</div>
          </div>
          <div class="zoth-metric-card">
            <div class="zoth-metric-val">0.42s</div>
            <div class="zoth-metric-lbl">Synthesis Latency</div>
          </div>
          <div class="zoth-metric-card">
            <div class="zoth-metric-val">0 KB</div>
            <div class="zoth-metric-lbl">Cloud Telemetry</div>
          </div>
        </div>
      </section>`;
    }

    // Default: PARTICLE_MESH
    return `
      <!-- Zoth Hero: Particle Mesh Canvas Variant -->
      <section class="zoth-section zoth-hero zoth-hero-particle" id="hero">
        <canvas id="zothParticleCanvas" class="zoth-particle-canvas"></canvas>
        <div class="zoth-hero-content">
          <div class="zoth-badge-row zoth-center">
            <span class="zoth-badge zoth-badge-pulse">
              <span class="zoth-pulse-dot"></span>
              ${badge}
            </span>
          </div>
          <h1 class="zoth-hero-title">
            ${title} <br />
            <span class="zoth-gradient-text">${highlight}</span>
          </h1>
          <p class="zoth-hero-desc zoth-hero-desc-center">${desc}</p>
          <div class="zoth-hero-cta zoth-center">
            <button class="zoth-btn zoth-btn-primary" onclick="zothTriggerAction('launch')">${primaryCta}</button>
            <button class="zoth-btn zoth-btn-ghost" onclick="zothTriggerAction('docs')">${secondaryCta}</button>
          </div>
        </div>
      </section>`;
  }

  // 2. BENTO GRID SECTION GENERATOR
  function generateBentoSection(variant, options) {
    variant = variant || BENTO_VARIANTS.BENTO_6_BOX;
    var opt = options || {};
    var sectionTitle = opt.title || "Engineered for Autonomous Supremacy";
    var sectionSubtitle = opt.subtitle || "A complete suite of sovereign components designed for instant client-side execution.";

    if (variant === BENTO_VARIANTS.BENTO_4_BOX) {
      return `
      <!-- Zoth Bento Grid: 4-Box Asymmetric Variant -->
      <section class="zoth-section zoth-bento-section" id="features">
        <div class="zoth-section-header">
          <span class="zoth-badge">⚡ Architecture Blueprint</span>
          <h2 class="zoth-section-title">${sectionTitle}</h2>
          <p class="zoth-section-desc">${sectionSubtitle}</p>
        </div>
        <div class="zoth-bento-grid zoth-bento-4">
          <!-- Card 1: Wide 2-Col -->
          <div class="zoth-bento-card zoth-bento-span-2">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">SWARM DISPATCH</div>
              <div class="zoth-card-icon">🐺</div>
              <h3 class="zoth-card-title">Multi-Agent Neural Swarm</h3>
              <p class="zoth-card-desc">Simultaneously coordinate Lycan (Security), Kitsune (Visuals), Draco (AEO Schema), and Workbot (State Logic) locally with zero latency.</p>
              <div class="zoth-mini-visual zoth-nodes-visual">
                <div class="zoth-node-chip"><span class="zoth-node-dot active"></span> Lycan: Pass</div>
                <div class="zoth-node-chip"><span class="zoth-node-dot active"></span> Kitsune: Hydrated</div>
                <div class="zoth-node-chip"><span class="zoth-node-dot active"></span> Draco: AEO Valid</div>
              </div>
            </div>
          </div>
          <!-- Card 2: 1-Col -->
          <div class="zoth-bento-card">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">CLIENT-SIDE AST</div>
              <div class="zoth-card-icon">🛡️</div>
              <h3 class="zoth-card-title">AST Sanitizer</h3>
              <p class="zoth-card-desc">14-point deep security inspection prevents code injection and validates HTML5 grammar.</p>
              <div class="zoth-mini-badge-code"><code>OWASP.CSP: PASS</code></div>
            </div>
          </div>
          <!-- Card 3: 1-Col -->
          <div class="zoth-bento-card">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">ZERO-CLOUD</div>
              <div class="zoth-card-icon">🔒</div>
              <h3 class="zoth-card-title">Local Sovereign Vault</h3>
              <p class="zoth-card-desc">AES-GCM encrypted local storage guarantees your prompts and API tokens never leave your hardware.</p>
              <div class="zoth-mini-badge-code"><code>ENCRYPT: AES-256</code></div>
            </div>
          </div>
          <!-- Card 4: Wide 2-Col -->
          <div class="zoth-bento-card zoth-bento-span-2">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">EDGE DEPLOY</div>
              <div class="zoth-card-icon">🚀</div>
              <h3 class="zoth-card-title">Instant Netlify AX Pipeline</h3>
              <p class="zoth-card-desc">Generate production-ready netlify.toml configurations with immutable CDN rules, HTTP security headers, and single-click deploy triggers.</p>
              <div class="zoth-deploy-bar">
                <div class="zoth-deploy-progress"></div>
                <span class="zoth-deploy-stat">Deploy Velocity: 0.42s</span>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    }

    // Default: BENTO_6_BOX
    return `
      <!-- Zoth Bento Grid: 6-Box Asymmetric Variant -->
      <section class="zoth-section zoth-bento-section" id="features">
        <div class="zoth-section-header">
          <span class="zoth-badge">⚡ Bento Features</span>
          <h2 class="zoth-section-title">${sectionTitle}</h2>
          <p class="zoth-section-desc">${sectionSubtitle}</p>
        </div>
        <div class="zoth-bento-grid zoth-bento-6">
          <!-- Card 1: Master 2-Col x 2-Row -->
          <div class="zoth-bento-card zoth-bento-col-2 zoth-bento-row-2">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">AUTONOMOUS FOUNDRY</div>
              <div class="zoth-card-icon">🌌</div>
              <h3 class="zoth-card-title">Autonomous Multi-Agent Swarm</h3>
              <p class="zoth-card-desc">Execute distributed agent consensus on device. Synthesize high-conversion layouts, dynamic state controllers, and accessible web standards simultaneously.</p>
              <div class="zoth-bento-swarm-monitor">
                <div class="zoth-monitor-row">
                  <span>🐺 Security Audit (Lycan)</span>
                  <span class="zoth-status-green">100% OK</span>
                </div>
                <div class="zoth-monitor-row">
                  <span>🦊 UI Glassmorphism (Kitsune)</span>
                  <span class="zoth-status-green">COMPILED</span>
                </div>
                <div class="zoth-monitor-row">
                  <span>🐲 Semantic AEO Graph (Draco)</span>
                  <span class="zoth-status-green">INDEXED</span>
                </div>
                <div class="zoth-monitor-row">
                  <span>🤖 State Runtime (Workbot)</span>
                  <span class="zoth-status-cyan">LIVE (12ms)</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="zoth-bento-card">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">AST COMPILER</div>
              <div class="zoth-card-icon">🛡️</div>
              <h3 class="zoth-card-title">Deep AST Sanitizer</h3>
              <p class="zoth-card-desc">Deterministic linting and real-time security verification on all generated markup.</p>
            </div>
          </div>
          <!-- Card 3 -->
          <div class="zoth-bento-card">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">SOVEREIGNTY</div>
              <div class="zoth-card-icon">🔒</div>
              <h3 class="zoth-card-title">Zero Cloud Leaks</h3>
              <p class="zoth-card-desc">All computation executes in your browser environment with zero external API calls.</p>
            </div>
          </div>
          <!-- Card 4 -->
          <div class="zoth-bento-card">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">AUDIO ENGINE</div>
              <div class="zoth-card-icon">🎵</div>
              <h3 class="zoth-card-title">Web Audio Feedback</h3>
              <p class="zoth-card-desc">Integrated synthesized sound feedback for every state change and user interaction.</p>
            </div>
          </div>
          <!-- Card 5 -->
          <div class="zoth-bento-card">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner">
              <div class="zoth-card-badge">SELF-HEALING</div>
              <div class="zoth-card-icon">⚡</div>
              <h3 class="zoth-card-title">Autonomous Repair</h3>
              <p class="zoth-card-desc">Self-healing pipeline rectifies broken redirect rules and syntax mismatches on the fly.</p>
            </div>
          </div>
          <!-- Card 6: Wide Bottom -->
          <div class="zoth-bento-card zoth-bento-span-full">
            <div class="zoth-card-glow-track"></div>
            <div class="zoth-bento-card-inner zoth-flex-row">
              <div>
                <div class="zoth-card-badge">DEPLOY ACCELERATION</div>
                <h3 class="zoth-card-title">Universal Netlify AX Ready</h3>
                <p class="zoth-card-desc">Generate production Netlify configurations with automatic security headers and HSTS.</p>
              </div>
              <button class="zoth-btn zoth-btn-primary" onclick="zothTriggerAction('deploy')">🚀 Deploy in 0.42s</button>
            </div>
          </div>
        </div>
      </section>`;
  }

  // 3. PRICING MATRIX SECTION GENERATOR
  function generatePricingSection(options) {
    var opt = options || {};
    var sectionTitle = opt.title || "Transparent, Sovereign Pricing";
    var sectionSubtitle = opt.subtitle || "Choose your level of autonomous intelligence. No hidden fees. Cancel anytime.";
    var discountBadge = opt.discountBadge || "Save 20% · 2 Months Free";

    return `
      <!-- Zoth Pricing Matrix with Interactive Billing Toggle -->
      <section class="zoth-section zoth-pricing-section" id="pricing">
        <div class="zoth-section-header">
          <span class="zoth-badge">💎 Value Matrix</span>
          <h2 class="zoth-section-title">${sectionTitle}</h2>
          <p class="zoth-section-desc">${sectionSubtitle}</p>
        </div>

        <div class="zoth-pricing-toggle-wrap">
          <div class="zoth-billing-toggle" id="zothBillingToggle">
            <button class="zoth-toggle-btn active" id="zothMonthlyBtn" onclick="zothSetBilling('monthly')">Monthly</button>
            <button class="zoth-toggle-btn" id="zothAnnualBtn" onclick="zothSetBilling('annual')">Annual</button>
            <div class="zoth-toggle-indicator"></div>
          </div>
          <span class="zoth-discount-pill">${discountBadge}</span>
        </div>

        <div class="zoth-pricing-grid">
          <!-- Tier 1: Starter -->
          <div class="zoth-pricing-card">
            <div class="zoth-pricing-header">
              <h3 class="zoth-tier-name">Indie Starter</h3>
              <p class="zoth-tier-desc">For individual hackers and local developers exploring sovereign AI.</p>
              <div class="zoth-price-box">
                <span class="zoth-currency">$</span>
                <span class="zoth-price-number" data-monthly="0" data-annual="0">0</span>
                <span class="zoth-period">/ month</span>
              </div>
            </div>
            <ul class="zoth-feature-list">
              <li><span class="zoth-check">✓</span> 1 Sovereign Agent (Workbot)</li>
              <li><span class="zoth-check">✓</span> 5 Site Generations / Day</li>
              <li><span class="zoth-check">✓</span> 100% Client-Side AST Audit</li>
              <li><span class="zoth-check">✓</span> Standard Export (ZIP &amp; HTML)</li>
              <li class="zoth-feature-disabled">✕ Multi-Agent Swarm Consensus</li>
              <li class="zoth-feature-disabled">✕ Automated Netlify AX Deploy</li>
            </ul>
            <button class="zoth-btn zoth-btn-ghost zoth-btn-full" onclick="zothTriggerAction('plan_starter')">Get Started Free</button>
          </div>

          <!-- Tier 2: Sovereign Pro (Featured) -->
          <div class="zoth-pricing-card zoth-pricing-featured">
            <div class="zoth-featured-badge">MOST POPULAR</div>
            <div class="zoth-pricing-header">
              <h3 class="zoth-tier-name">Sovereign Studio Pro</h3>
              <p class="zoth-tier-desc">Complete autonomous web foundry for creators, agencies, and builders.</p>
              <div class="zoth-price-box">
                <span class="zoth-currency">$</span>
                <span class="zoth-price-number" data-monthly="29" data-annual="24">29</span>
                <span class="zoth-period" id="zothProPeriod">/ month</span>
              </div>
              <div class="zoth-annual-note" id="zothProAnnualNote">Billed annually ($288/yr)</div>
            </div>
            <ul class="zoth-feature-list">
              <li><span class="zoth-check">✓</span> Full 4-Agent Swarm (Lycan, Kitsune, Draco, Workbot)</li>
              <li><span class="zoth-check">✓</span> Unlimited Autonomous Generations</li>
              <li><span class="zoth-check">✓</span> 14-Vector Self-Healing AST Engine</li>
              <li><span class="zoth-check">✓</span> 1-Click Netlify AX Deployment</li>
              <li><span class="zoth-check">✓</span> AES-256 Encrypted Sovereign Vault</li>
              <li><span class="zoth-check">✓</span> Web Audio Sound Synthesizer UI</li>
            </ul>
            <button class="zoth-btn zoth-btn-primary zoth-btn-full" onclick="zothTriggerAction('plan_pro')">⚡ Start 14-Day Free Trial</button>
          </div>

          <!-- Tier 3: Enterprise Swarm -->
          <div class="zoth-pricing-card">
            <div class="zoth-pricing-header">
              <h3 class="zoth-tier-name">Enterprise Swarm</h3>
              <p class="zoth-tier-desc">Dedicated sovereign multi-node mesh for security-critical enterprises.</p>
              <div class="zoth-price-box">
                <span class="zoth-currency">$</span>
                <span class="zoth-price-number" data-monthly="99" data-annual="79">99</span>
                <span class="zoth-period" id="zothEntPeriod">/ month</span>
              </div>
              <div class="zoth-annual-note" id="zothEntAnnualNote">Billed annually ($948/yr)</div>
            </div>
            <ul class="zoth-feature-list">
              <li><span class="zoth-check">✓</span> Custom Multi-Node Swarm Clusters</li>
              <li><span class="zoth-check">✓</span> Air-Gapped / Offline Deployment Mode</li>
              <li><span class="zoth-check">✓</span> Custom AST Rule Generator &amp; Linter</li>
              <li><span class="zoth-check">✓</span> Dedicated Hermes Channel &amp; SLA</li>
              <li><span class="zoth-check">✓</span> Red-Team Security Compliance Report</li>
            </ul>
            <button class="zoth-btn zoth-btn-ghost zoth-btn-full" onclick="zothTriggerAction('plan_enterprise')">Contact Architects</button>
          </div>
        </div>
      </section>`;
  }

  // 4. TESTIMONIALS / SOCIAL PROOF SECTION GENERATOR
  function generateTestimonialsSection(variant, options) {
    variant = variant || TESTIMONIAL_VARIANTS.INFINITE_MARQUEE;
    var opt = options || {};
    var sectionTitle = opt.title || "Validated by Sovereign Engineers";
    var sectionSubtitle = opt.subtitle || "See how elite builders orchestrate sites with zero cloud telemetry.";

    var reviews = [
      { name: "Alex Vance", role: "Principal Architect, Nexus", quote: "Zoth's client-side AST sanitizer reduced our deploy verification time from 5 minutes to 420 milliseconds.", rating: 5, avatar: "AV" },
      { name: "Elena Rostova", role: "Founder, CyberMesh", quote: "The multi-agent swarm synthesis writes cleaner, more accessible HTML than any SaaS product on the market.", rating: 5, avatar: "ER" },
      { name: "Marcus Chen", role: "Security Lead, ZeroTrust Lab", quote: "Zero cloud telemetry is a game changer for our classified web applications. Complete local sovereignty.", rating: 5, avatar: "MC" },
      { name: "Sophia Thorne", role: "Design Systems Engineer", quote: "The 3D tilt cards and responsive bento grids look stunning out of the box. Absolutely top-tier aesthetics.", rating: 5, avatar: "ST" }
    ];

    if (variant === TESTIMONIAL_VARIANTS.INTERACTIVE_CARDS) {
      var cardsHtml = reviews.map(function (r) {
        var stars = "★".repeat(r.rating);
        return `
        <div class="zoth-review-card">
          <div class="zoth-review-stars">${stars}</div>
          <p class="zoth-review-quote">"${r.quote}"</p>
          <div class="zoth-review-author">
            <div class="zoth-author-avatar">${r.avatar}</div>
            <div>
              <div class="zoth-author-name">${r.name}</div>
              <div class="zoth-author-role">${r.role}</div>
            </div>
          </div>
        </div>`;
      }).join("");

      return `
      <!-- Zoth Testimonials: Interactive Review Cards -->
      <section class="zoth-section zoth-testimonials-section" id="testimonials">
        <div class="zoth-section-header">
          <span class="zoth-badge">💬 Social Proof</span>
          <h2 class="zoth-section-title">${sectionTitle}</h2>
          <p class="zoth-section-desc">${sectionSubtitle}</p>
        </div>
        <div class="zoth-reviews-grid">
          ${cardsHtml}
        </div>
      </section>`;
    }

    // Default: INFINITE_MARQUEE
    var marqueeItems = reviews.concat(reviews).map(function (r) {
      var stars = "★".repeat(r.rating);
      return `
      <div class="zoth-marquee-card">
        <div class="zoth-review-stars">${stars}</div>
        <p class="zoth-marquee-quote">"${r.quote}"</p>
        <div class="zoth-review-author">
          <div class="zoth-author-avatar">${r.avatar}</div>
          <div>
            <div class="zoth-author-name">${r.name}</div>
            <div class="zoth-author-role">${r.role}</div>
          </div>
        </div>
      </div>`;
    }).join("");

    return `
      <!-- Zoth Testimonials: Infinite Marquee Ticker -->
      <section class="zoth-section zoth-testimonials-section" id="testimonials">
        <div class="zoth-section-header">
          <span class="zoth-badge">💬 Verified Reviews</span>
          <h2 class="zoth-section-title">${sectionTitle}</h2>
          <p class="zoth-section-desc">${sectionSubtitle}</p>
        </div>
        <div class="zoth-marquee-viewport">
          <div class="zoth-marquee-track">
            ${marqueeItems}
          </div>
        </div>
      </section>`;
  }

  // 5. INTERACTIVE LIVE SANDBOX GENERATOR
  function generateSandboxSection(options) {
    var opt = options || {};
    var sectionTitle = opt.title || "Interactive Live Sandbox";
    var sectionSubtitle = opt.subtitle || "Test state dispatch, AST consensus, and Web Audio feedback in real time.";

    return `
      <!-- Zoth Interactive Live Sandbox with Web Audio -->
      <section class="zoth-section zoth-sandbox-section" id="sandbox">
        <div class="zoth-sandbox-card">
          <div class="zoth-sandbox-head">
            <div class="zoth-sandbox-title-wrap">
              <span class="zoth-pulse-dot"></span>
              <span class="zoth-sandbox-title">${sectionTitle}</span>
            </div>
            <span class="zoth-sandbox-status-chip">ONLINE · ZERO TELEMETRY · 12ms</span>
          </div>
          <div class="zoth-sandbox-body">
            <div class="zoth-sandbox-controls">
              <p class="zoth-controls-desc">${sectionSubtitle}</p>
              <div class="zoth-sandbox-btn-group">
                <button class="zoth-btn zoth-btn-ghost" onclick="zothRunSandbox('pulse')">⚡ Dispatch Pulse</button>
                <button class="zoth-btn zoth-btn-ghost" onclick="zothRunSandbox('verify')">🛡️ Verify AST</button>
                <button class="zoth-btn zoth-btn-ghost" onclick="zothRunSandbox('compile')">📦 Compile Netlify AX</button>
                <button class="zoth-btn zoth-btn-ghost" onclick="zothRunSandbox('clear')">🗑️ Clear Console</button>
              </div>
              <div class="zoth-sandbox-audio-indicator">
                <span>🔊 Audio Feedback:</span>
                <span class="zoth-audio-badge" id="zothAudioStatus">Web Audio Active</span>
              </div>
            </div>
            <div class="zoth-console" id="zothSimLog" role="region" aria-label="Terminal log output">
              <div class="zoth-log-row zoth-log-info">[00:00:00] [SYSTEM] Zoth Sovereign Web Foundry initialized.</div>
              <div class="zoth-log-row zoth-log-success">[00:00:01] [AST] OWASP &amp; WCAG AA verification engine online.</div>
            </div>
          </div>
        </div>
      </section>`;
  }

  // 6. FAQ ACCORDION SECTION GENERATOR
  function generateFaqSection(options) {
    var opt = options || {};
    var sectionTitle = opt.title || "Frequently Asked Questions";
    var sectionSubtitle = opt.subtitle || "Everything you need to know about local sovereign web generation.";

    var faqs = [
      { q: "What makes Zoth Studio 100% sovereign?", a: "Unlike cloud generators, Zoth runs entirely on client-side JavaScript, Web Workers, and local IndexedDB/AES vaults. No user prompts or source code are ever transmitted to third-party servers." },
      { q: "How does the AST validation engine work?", a: "Every generated HTML, CSS, and JS node is checked against 14 security and semantic vectors including OWASP CSP rules, semantic tags, and broken attribute references before rendering." },
      { q: "Can I deploy the generated sites to Netlify?", a: "Yes! Zoth generates complete netlify.toml configurations with pre-configured immutable caching, security headers, and single-click webhook triggers." },
      { q: "Is the Web Audio synthesizer accessible?", a: "Yes. All audio feedback is non-blocking, fail-soft, and respects user audio preferences with visual log mirrors in the sandbox console." },
      { q: "How do I export and customize the code?", a: "You can inspect the live generated markup, export single-file HTML5 bundles, or copy individual Bento section components directly into React, Vue, or vanilla projects." }
    ];

    var faqsHtml = faqs.map(function (item, idx) {
      var isOpen = idx === 0 ? " open" : "";
      return `
        <details class="zoth-faq-item" name="zoth-faq-group"${isOpen}>
          <summary class="zoth-faq-summary">
            <span class="zoth-faq-question">${item.q}</span>
            <span class="zoth-faq-chevron" aria-hidden="true">▾</span>
          </summary>
          <div class="zoth-faq-answer">
            <p>${item.a}</p>
          </div>
        </details>`;
    }).join("");

    return `
      <!-- Zoth FAQ Accordion (Accessible & Smooth CSS Height) -->
      <section class="zoth-section zoth-faq-section" id="faq">
        <div class="zoth-section-header">
          <span class="zoth-badge">❓ Knowledge Base</span>
          <h2 class="zoth-section-title">${sectionTitle}</h2>
          <p class="zoth-section-desc">${sectionSubtitle}</p>
        </div>
        <div class="zoth-faq-container">
          ${faqsHtml}
        </div>
      </section>`;
  }

  // 7. LEAD CAPTURE WAITLIST MODAL GENERATOR
  function generateWaitlistModal(options) {
    var opt = options || {};
    var modalTitle = opt.title || "Join the Sovereign Waitlist";
    var modalSubtitle = opt.subtitle || "Get priority access to the autonomous multi-agent foundry and early release builds.";

    return `
      <!-- Zoth Lead Capture Waitlist Modal -->
      <dialog id="zothWaitlistModal" class="zoth-modal" aria-labelledby="zothModalTitle">
        <div class="zoth-modal-backdrop" onclick="zothCloseWaitlistModal()"></div>
        <div class="zoth-modal-card">
          <button class="zoth-modal-close" onclick="zothCloseWaitlistModal()" aria-label="Close dialog">×</button>
          <div class="zoth-modal-header">
            <span class="zoth-badge">⚡ VIP Access</span>
            <h3 id="zothModalTitle" class="zoth-modal-title">${modalTitle}</h3>
            <p class="zoth-modal-desc">${modalSubtitle}</p>
          </div>
          <form id="zothWaitlistForm" class="zoth-modal-form" onsubmit="zothHandleWaitlistSubmit(event)">
            <div class="zoth-form-group">
              <label for="zothLeadName">Full Name</label>
              <input type="text" id="zothLeadName" class="zoth-input" placeholder="e.g. Satoshi Nakamoto" required />
            </div>
            <div class="zoth-form-group">
              <label for="zothLeadEmail">Work Email</label>
              <input type="email" id="zothLeadEmail" class="zoth-input" placeholder="you@domain.com" required />
              <span class="zoth-field-error" id="zothEmailError"></span>
            </div>
            <div class="zoth-form-group">
              <label for="zothLeadRole">Primary Use Case</label>
              <select id="zothLeadRole" class="zoth-select">
                <option value="solo_builder">Solo Indie Builder / Creator</option>
                <option value="agency_studio">Agency &amp; Web Design Studio</option>
                <option value="enterprise_eng">Enterprise Engineering Team</option>
                <option value="ai_researcher">AI &amp; Autonomous Agent Researcher</option>
              </select>
            </div>
            <button type="submit" class="zoth-btn zoth-btn-primary zoth-btn-full" id="zothWaitlistSubmitBtn">
              <span>🚀 Claim Priority Access</span>
            </button>
          </form>
          <div class="zoth-modal-success" id="zothWaitlistSuccess" style="display:none;">
            <div class="zoth-success-icon">✓</div>
            <h4 class="zoth-success-title">You're on the Sovereign List!</h4>
            <p class="zoth-success-desc">Position: <strong id="zothQueuePosition">#1,482</strong>. We have cached your sovereign key locally.</p>
            <button class="zoth-btn zoth-btn-ghost zoth-btn-full" onclick="zothCloseWaitlistModal()">Close</button>
          </div>
        </div>
      </dialog>`;
  }

  // ===========================================================================
  // COMPLETE CSS STYLESHEET GENERATOR
  // ===========================================================================
  function getAllStyles(customTheme) {
    var t = Object.assign({}, DEFAULT_THEME, customTheme || {});

    return `
    /* ==========================================================================
       ZOTH STUDIO — MODULAR SECTION & BENTO COMPONENT STYLES
       ========================================================================== */
    :root {
      --zoth-bg: ${t.bg};
      --zoth-surface: ${t.surface};
      --zoth-card: ${t.card};
      --zoth-border: ${t.border};
      --zoth-border-hover: ${t.borderHover};
      --zoth-accent: ${t.accent};
      --zoth-accent-glow: ${t.accentGlow};
      --zoth-gold: ${t.gold};
      --zoth-green: ${t.green};
      --zoth-purple: ${t.purple};
      --zoth-text: ${t.text};
      --zoth-text-muted: ${t.textMuted};
      --zoth-badge-bg: ${t.badgeBg};
      --zoth-font-display: ${t.fontDisplay};
      --zoth-font-sans: ${t.fontSans};
      --zoth-font-mono: ${t.fontMono};
    }

    * { box-sizing: border-box; }

    .zoth-section {
      position: relative;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 70px 20px;
    }

    /* Common Typography & Buttons */
    .zoth-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 999px;
      background: var(--zoth-badge-bg);
      border: 1px solid var(--zoth-border);
      color: var(--zoth-accent);
      font-family: var(--zoth-font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .zoth-badge-pulse {
      box-shadow: 0 0 16px var(--zoth-accent-glow);
    }

    .zoth-badge-glow {
      box-shadow: 0 0 12px rgba(0, 240, 255, 0.25);
    }

    .zoth-pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--zoth-accent);
      box-shadow: 0 0 8px var(--zoth-accent);
      animation: zothPulse 1.8s infinite ease-in-out;
    }

    @keyframes zothPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }

    .zoth-gradient-text {
      background: linear-gradient(135deg, var(--zoth-accent) 0%, #ffffff 50%, var(--zoth-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .zoth-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-family: var(--zoth-font-display);
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      border: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .zoth-btn-primary {
      background: var(--zoth-accent);
      color: #040711;
      box-shadow: 0 0 20px var(--zoth-accent-glow);
    }

    .zoth-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px var(--zoth-accent-glow);
    }

    .zoth-btn-ghost {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--zoth-border);
      color: #ffffff;
      backdrop-filter: blur(8px);
    }

    .zoth-btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--zoth-border-hover);
      transform: translateY(-2px);
    }

    .zoth-btn-full { width: 100%; }
    .zoth-btn-lg { padding: 14px 30px; font-size: 1.05rem; }

    .zoth-section-header {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 48px;
    }

    .zoth-section-title {
      font-family: var(--zoth-font-display);
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px;
      letter-spacing: -0.02em;
    }

    .zoth-section-desc {
      color: var(--zoth-text-muted);
      font-size: 1.02rem;
      line-height: 1.6;
    }

    .zoth-center { justify-content: center; text-align: center; }

    /* ---- 1. HERO VARIANTS CSS --------------------------------------------- */
    .zoth-hero {
      text-align: center;
      padding-top: 90px;
      padding-bottom: 70px;
    }

    .zoth-hero-title {
      font-family: var(--zoth-font-display);
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 800;
      line-height: 1.1;
      color: #ffffff;
      margin: 0 0 20px;
      letter-spacing: -0.03em;
    }

    .zoth-hero-title-lg {
      font-size: clamp(2.8rem, 6vw, 4.8rem);
    }

    .zoth-hero-desc {
      font-size: 1.15rem;
      color: var(--zoth-text-muted);
      max-width: 680px;
      line-height: 1.65;
      margin: 0 0 32px;
    }

    .zoth-hero-desc-center { margin-left: auto; margin-right: auto; }

    .zoth-hero-cta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .zoth-hero-particle {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid var(--zoth-border);
      background: radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.08) 0%, rgba(5, 7, 17, 0.95) 75%);
    }

    .zoth-particle-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .zoth-hero-content {
      position: relative;
      z-index: 2;
      padding: 40px 20px;
    }

    /* Hero Tilt Card */
    .zoth-hero-tilt-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 40px;
      align-items: center;
      text-align: left;
    }

    @media (max-width: 900px) {
      .zoth-hero-tilt-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .zoth-hero-tilt-grid .zoth-hero-cta { justify-content: center; }
      .zoth-hero-tilt-grid .zoth-trust-row { justify-content: center; }
    }

    .zoth-trust-row {
      display: flex;
      gap: 18px;
      margin-top: 28px;
      flex-wrap: wrap;
    }

    .zoth-trust-item {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--zoth-text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .zoth-check { color: var(--zoth-green); font-weight: 800; }

    .zoth-tilt-container {
      perspective: 1000px;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }

    .zoth-tilt-card-body {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 20px;
      padding: 24px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out, border-color 0.3s ease;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(16px);
    }

    .zoth-tilt-card-body:hover {
      border-color: var(--zoth-border-hover);
    }

    .zoth-tilt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--zoth-border);
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .zoth-tilt-chips { display: flex; gap: 6px; }
    .zoth-dot-red { width: 9px; height: 9px; border-radius: 50%; background: #ef4444; }
    .zoth-dot-yellow { width: 9px; height: 9px; border-radius: 50%; background: #eab308; }
    .zoth-dot-green { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; }

    .zoth-tilt-status {
      font-family: var(--zoth-font-mono);
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--zoth-accent);
    }

    .zoth-3d-hologram {
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 600px;
    }

    .zoth-holo-cube {
      width: 70px;
      height: 70px;
      position: relative;
      transform-style: preserve-3d;
      animation: zothSpinCube 12s infinite linear;
    }

    @keyframes zothSpinCube {
      0% { transform: rotateX(20deg) rotateY(0deg); }
      100% { transform: rotateX(20deg) rotateY(360deg); }
    }

    .zoth-cube-face {
      position: absolute;
      width: 70px;
      height: 70px;
      border: 1.5px solid var(--zoth-accent);
      background: rgba(0, 240, 255, 0.12);
      color: var(--zoth-accent);
      font-family: var(--zoth-font-mono);
      font-size: 0.72rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }

    .zoth-cube-front  { transform: rotateY(0deg) translateZ(35px); }
    .zoth-cube-back   { transform: rotateY(180deg) translateZ(35px); }
    .zoth-cube-right  { transform: rotateY(90deg) translateZ(35px); }
    .zoth-cube-left   { transform: rotateY(-90deg) translateZ(35px); }
    .zoth-cube-top    { transform: rotateX(90deg) translateZ(35px); }
    .zoth-cube-bottom { transform: rotateX(-90deg) translateZ(35px); }

    .zoth-tilt-floating-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(14, 20, 38, 0.95);
      border: 1px solid var(--zoth-border);
      border-radius: 12px;
      padding: 10px 14px;
      margin-top: 12px;
      transform: translateZ(30px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }

    .zoth-float-icon { font-size: 1.2rem; }
    .zoth-float-label { font-size: 0.75rem; color: var(--zoth-text-muted); }
    .zoth-float-val { font-size: 0.85rem; font-weight: 700; color: #fff; }

    /* Minimalist Hero */
    .zoth-hero-minimalist {
      position: relative;
    }

    .zoth-minimalist-ambient-glow {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 350px;
      background: radial-gradient(circle, var(--zoth-accent-glow) 0%, transparent 70%);
      pointer-events: none;
      filter: blur(60px);
      z-index: 0;
    }

    .zoth-metrics-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 60px;
    }

    .zoth-metric-card {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(8px);
    }

    .zoth-metric-val {
      font-family: var(--zoth-font-display);
      font-size: 2rem;
      font-weight: 800;
      color: var(--zoth-accent);
      margin-bottom: 4px;
    }

    .zoth-metric-lbl {
      font-size: 0.85rem;
      color: var(--zoth-text-muted);
    }

    /* ---- 2. BENTO GRID CSS ------------------------------------------------ */
    .zoth-bento-grid {
      display: grid;
      gap: 20px;
    }

    .zoth-bento-4 {
      grid-template-columns: repeat(3, 1fr);
    }

    .zoth-bento-span-2 {
      grid-column: span 2;
    }

    @media (max-width: 860px) {
      .zoth-bento-4 { grid-template-columns: 1fr; }
      .zoth-bento-span-2 { grid-column: span 1; }
    }

    .zoth-bento-6 {
      grid-template-columns: repeat(3, 1fr);
    }

    .zoth-bento-col-2 { grid-column: span 2; }
    .zoth-bento-row-2 { grid-row: span 2; }
    .zoth-bento-span-full { grid-column: 1 / -1; }

    @media (max-width: 900px) {
      .zoth-bento-6 { grid-template-columns: 1fr; }
      .zoth-bento-col-2 { grid-column: span 1; }
      .zoth-bento-row-2 { grid-row: span 1; }
    }

    .zoth-bento-card {
      position: relative;
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 20px;
      padding: 28px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(12px);
    }

    .zoth-bento-card:hover {
      border-color: var(--zoth-border-hover);
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    }

    .zoth-card-glow-track {
      position: absolute;
      top: var(--mouse-y, -100px);
      left: var(--mouse-x, -100px);
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, var(--zoth-accent-glow) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      filter: blur(20px);
    }

    .zoth-bento-card:hover .zoth-card-glow-track { opacity: 0.6; }

    .zoth-bento-card-inner { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }
    .zoth-card-badge {
      font-family: var(--zoth-font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--zoth-accent);
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }

    .zoth-card-icon { font-size: 2rem; margin-bottom: 14px; }
    .zoth-card-title {
      font-family: var(--zoth-font-display);
      font-size: 1.35rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px;
    }

    .zoth-card-desc {
      font-size: 0.92rem;
      color: var(--zoth-text-muted);
      line-height: 1.55;
      margin: 0 0 18px;
      flex-grow: 1;
    }

    .zoth-nodes-visual { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
    .zoth-node-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid var(--zoth-border);
      border-radius: 8px;
      padding: 6px 10px;
      font-family: var(--zoth-font-mono);
      font-size: 0.74rem;
      color: var(--zoth-text);
    }

    .zoth-node-dot.active { width: 6px; height: 6px; border-radius: 50%; background: var(--zoth-green); box-shadow: 0 0 6px var(--zoth-green); }
    .zoth-mini-badge-code code {
      font-family: var(--zoth-font-mono);
      font-size: 0.78rem;
      color: var(--zoth-accent);
      background: rgba(0,0,0,0.5);
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--zoth-border);
    }

    .zoth-deploy-bar {
      margin-top: auto;
      background: rgba(0,0,0,0.5);
      border: 1px solid var(--zoth-border);
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .zoth-deploy-stat { font-family: var(--zoth-font-mono); font-size: 0.8rem; color: var(--zoth-green); font-weight: 700; }
    .zoth-bento-swarm-monitor {
      margin-top: auto;
      background: rgba(0,0,0,0.4);
      border: 1px solid var(--zoth-border);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .zoth-monitor-row {
      display: flex;
      justify-content: space-between;
      font-family: var(--zoth-font-mono);
      font-size: 0.78rem;
      color: var(--zoth-text-muted);
    }

    .zoth-status-green { color: var(--zoth-green); font-weight: 700; }
    .zoth-status-cyan { color: var(--zoth-accent); font-weight: 700; }
    .zoth-flex-row { flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; }
    @media (max-width: 600px) { .zoth-flex-row { flex-direction: column; align-items: flex-start; } }

    /* ---- 3. PRICING MATRIX CSS -------------------------------------------- */
    .zoth-pricing-toggle-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 48px;
      flex-wrap: wrap;
    }

    .zoth-billing-toggle {
      position: relative;
      display: inline-flex;
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 999px;
      padding: 4px;
    }

    .zoth-toggle-btn {
      position: relative;
      z-index: 2;
      background: transparent;
      border: none;
      color: var(--zoth-text-muted);
      font-family: var(--zoth-font-display);
      font-size: 0.88rem;
      font-weight: 700;
      padding: 8px 20px;
      border-radius: 999px;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .zoth-toggle-btn.active {
      color: #040711;
      background: var(--zoth-accent);
      box-shadow: 0 0 14px var(--zoth-accent-glow);
    }

    .zoth-discount-pill {
      font-family: var(--zoth-font-mono);
      font-size: 0.74rem;
      font-weight: 700;
      color: var(--zoth-gold);
      background: rgba(232, 200, 114, 0.12);
      border: 1px solid rgba(232, 200, 114, 0.4);
      padding: 6px 12px;
      border-radius: 999px;
    }

    .zoth-pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      align-items: stretch;
    }

    .zoth-pricing-card {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      position: relative;
      backdrop-filter: blur(12px);
      transition: transform 0.25s ease, border-color 0.25s ease;
    }

    .zoth-pricing-card:hover {
      transform: translateY(-4px);
      border-color: var(--zoth-border-hover);
    }

    .zoth-pricing-featured {
      border: 2px solid var(--zoth-accent);
      box-shadow: 0 12px 40px var(--zoth-accent-glow);
      background: linear-gradient(180deg, rgba(0, 240, 255, 0.08) 0%, var(--zoth-surface) 100%);
    }

    .zoth-featured-badge {
      position: absolute;
      top: -13px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--zoth-accent);
      color: #040711;
      font-family: var(--zoth-font-mono);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      padding: 4px 14px;
      border-radius: 999px;
      box-shadow: 0 0 16px var(--zoth-accent-glow);
    }

    .zoth-tier-name {
      font-family: var(--zoth-font-display);
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px;
    }

    .zoth-tier-desc {
      font-size: 0.88rem;
      color: var(--zoth-text-muted);
      margin: 0 0 20px;
      min-height: 42px;
    }

    .zoth-price-box {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 6px;
    }

    .zoth-currency { font-size: 1.5rem; font-weight: 700; color: var(--zoth-accent); }
    .zoth-price-number {
      font-family: var(--zoth-font-display);
      font-size: 3.2rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .zoth-period { font-size: 0.9rem; color: var(--zoth-text-muted); }
    .zoth-annual-note {
      font-family: var(--zoth-font-mono);
      font-size: 0.75rem;
      color: var(--zoth-gold);
      margin-bottom: 24px;
      min-height: 18px;
    }

    .zoth-feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex-grow: 1;
    }

    .zoth-feature-list li {
      font-size: 0.9rem;
      color: #cbd5e1;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .zoth-feature-disabled { opacity: 0.35; }

    /* ---- 4. TESTIMONIALS CSS ---------------------------------------------- */
    .zoth-marquee-viewport {
      width: 100%;
      overflow: hidden;
      position: relative;
      padding: 20px 0;
      mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    }

    .zoth-marquee-track {
      display: flex;
      gap: 20px;
      width: max-content;
      animation: zothMarquee 28s linear infinite;
    }

    .zoth-marquee-track:hover { animation-play-state: paused; }

    @keyframes zothMarquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .zoth-marquee-card, .zoth-review-card {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 18px;
      padding: 24px;
      width: 340px;
      flex-shrink: 0;
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .zoth-review-stars { color: var(--zoth-gold); font-size: 1.1rem; letter-spacing: 2px; margin-bottom: 12px; }
    .zoth-marquee-quote, .zoth-review-quote {
      font-size: 0.92rem;
      color: #e2e8f0;
      line-height: 1.55;
      margin: 0 0 18px;
      font-style: italic;
    }

    .zoth-review-author { display: flex; align-items: center; gap: 12px; }
    .zoth-author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--zoth-accent) 0%, var(--zoth-purple) 100%);
      color: #040711;
      font-weight: 800;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .zoth-author-name { font-weight: 700; color: #fff; font-size: 0.9rem; }
    .zoth-author-role { font-size: 0.78rem; color: var(--zoth-text-muted); }

    .zoth-reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    /* ---- 5. INTERACTIVE LIVE SANDBOX CSS ---------------------------------- */
    .zoth-sandbox-card {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(16px);
    }

    .zoth-sandbox-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--zoth-border);
      flex-wrap: wrap;
      gap: 10px;
    }

    .zoth-sandbox-title-wrap { display: flex; align-items: center; gap: 10px; }
    .zoth-sandbox-title {
      font-family: var(--zoth-font-display);
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
    }

    .zoth-sandbox-status-chip {
      font-family: var(--zoth-font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--zoth-accent);
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid var(--zoth-border);
      padding: 4px 10px;
      border-radius: 6px;
    }

    .zoth-sandbox-body {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 24px;
    }

    @media (max-width: 800px) {
      .zoth-sandbox-body { grid-template-columns: 1fr; }
    }

    .zoth-controls-desc {
      font-size: 0.92rem;
      color: var(--zoth-text-muted);
      margin: 0 0 16px;
      line-height: 1.5;
    }

    .zoth-sandbox-btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }

    .zoth-sandbox-audio-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--zoth-text-muted);
    }

    .zoth-audio-badge {
      font-family: var(--zoth-font-mono);
      font-size: 0.72rem;
      color: var(--zoth-green);
      font-weight: 700;
    }

    .zoth-console {
      background: #020409;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px;
      font-family: var(--zoth-font-mono);
      font-size: 0.8rem;
      height: 200px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .zoth-log-row { word-break: break-all; }
    .zoth-log-info { color: var(--zoth-accent); }
    .zoth-log-success { color: var(--zoth-green); }
    .zoth-log-warn { color: var(--zoth-gold); }

    /* ---- 6. FAQ ACCORDION CSS --------------------------------------------- */
    .zoth-faq-container {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .zoth-faq-item {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 14px;
      overflow: hidden;
      transition: border-color 0.2s ease;
      backdrop-filter: blur(8px);
    }

    .zoth-faq-item[open] {
      border-color: var(--zoth-border-hover);
    }

    .zoth-faq-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 24px;
      cursor: pointer;
      list-style: none;
      font-family: var(--zoth-font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      user-select: none;
    }

    .zoth-faq-summary::-webkit-details-marker { display: none; }

    .zoth-faq-chevron {
      font-size: 1.1rem;
      color: var(--zoth-accent);
      transition: transform 0.25s ease;
    }

    .zoth-faq-item[open] .zoth-faq-chevron {
      transform: rotate(180deg);
    }

    .zoth-faq-answer {
      padding: 0 24px 20px;
      color: var(--zoth-text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* ---- 7. LEAD CAPTURE WAITLIST MODAL CSS ------------------------------- */
    .zoth-modal {
      border: none;
      background: transparent;
      padding: 0;
      margin: auto;
      max-width: 480px;
      width: 90%;
      position: fixed;
      inset: 0;
      z-index: 10000;
    }

    .zoth-modal::backdrop {
      background: rgba(2, 4, 10, 0.85);
      backdrop-filter: blur(10px);
    }

    .zoth-modal-card {
      background: var(--zoth-surface);
      border: 1px solid var(--zoth-border);
      border-radius: 24px;
      padding: 32px;
      position: relative;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
    }

    .zoth-modal-close {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--zoth-border);
      color: #fff;
      font-size: 1.2rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .zoth-modal-close:hover { background: rgba(255, 255, 255, 0.15); }

    .zoth-modal-title {
      font-family: var(--zoth-font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 8px 0 6px;
    }

    .zoth-modal-desc {
      font-size: 0.9rem;
      color: var(--zoth-text-muted);
      margin: 0 0 20px;
      line-height: 1.5;
    }

    .zoth-modal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .zoth-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
    }

    .zoth-form-group label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .zoth-input, .zoth-select {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--zoth-border);
      border-radius: 10px;
      padding: 12px 14px;
      color: #fff;
      font-family: var(--zoth-font-sans);
      font-size: 0.92rem;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .zoth-input:focus, .zoth-select:focus {
      border-color: var(--zoth-accent);
      box-shadow: 0 0 10px var(--zoth-accent-glow);
    }

    .zoth-select option { background: #070a14; color: #fff; }
    .zoth-field-error { font-size: 0.75rem; color: #ef4444; }

    .zoth-modal-success {
      text-align: center;
      padding: 20px 0;
    }

    .zoth-success-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(52, 211, 153, 0.15);
      border: 2px solid var(--zoth-green);
      color: var(--zoth-green);
      font-size: 1.8rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .zoth-success-title {
      font-family: var(--zoth-font-display);
      font-size: 1.3rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }

    .zoth-success-desc {
      font-size: 0.92rem;
      color: var(--zoth-text-muted);
      margin-bottom: 20px;
    }
    `;
  }

  // ===========================================================================
  // COMPLETE CLIENT RUNTIME JAVASCRIPT
  // ===========================================================================
  function getAllScripts() {
    return `
    /* ==========================================================================
       ZOTH STUDIO — CLIENT INTERACTIVE RUNTIME
       ========================================================================== */
    (function() {
      // 1. Web Audio Synthesizer Engine
      var zothAudioCtx = null;
      function zothPlayTone(freq, type, duration, gainVal) {
        try {
          if (!zothAudioCtx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) zothAudioCtx = new AudioContextClass();
          }
          if (!zothAudioCtx) return;
          if (zothAudioCtx.state === 'suspended') zothAudioCtx.resume();

          var osc = zothAudioCtx.createOscillator();
          var gain = zothAudioCtx.createGain();
          osc.type = type || 'sine';
          osc.frequency.setValueAtTime(freq || 440, zothAudioCtx.currentTime);
          gain.gain.setValueAtTime(gainVal || 0.08, zothAudioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, zothAudioCtx.currentTime + (duration || 0.15));
          osc.connect(gain);
          gain.connect(zothAudioCtx.destination);
          osc.start();
          osc.stop(zothAudioCtx.currentTime + (duration || 0.15));
        } catch (err) {
          // fail soft
        }
      }

      window.zothTriggerAction = function(act) {
        zothPlayTone(580, 'sine', 0.12);
        console.log('[ZOTH ACTION]', act);
      };

      // 2. Interactive Live Sandbox Runner
      window.zothRunSandbox = function(action) {
        var log = document.getElementById('zothSimLog');
        var now = new Date().toTimeString().split(' ')[0];
        var row = document.createElement('div');
        row.className = 'zoth-log-row';

        if (action === 'pulse') {
          zothPlayTone(660, 'sine', 0.14);
          row.className += ' zoth-log-info';
          row.textContent = '[' + now + '] [PULSE] Broadcasted heartbeat to 21 sovereign agent nodes (12ms).';
        } else if (action === 'verify') {
          zothPlayTone(880, 'triangle', 0.22);
          row.className += ' zoth-log-success';
          row.textContent = '[' + now + '] [AST AUDIT] 14 vectors checked: 14 PASS, 0 WARN. CSP Hash intact.';
        } else if (action === 'compile') {
          zothPlayTone(523, 'sine', 0.08);
          setTimeout(function() { zothPlayTone(659, 'sine', 0.08); }, 70);
          setTimeout(function() { zothPlayTone(784, 'sine', 0.12); }, 140);
          row.className += ' zoth-log-warn';
          row.textContent = '[' + now + '] [NETLIFY AX] Compiled netlify.toml, security headers, & redirects.';
        } else if (action === 'clear') {
          zothPlayTone(330, 'sine', 0.08);
          if (log) log.innerHTML = '<div class="zoth-log-row zoth-log-info">[' + now + '] [SYSTEM] Console cleared.</div>';
          return;
        }

        if (log) {
          log.appendChild(row);
          log.scrollTop = log.scrollHeight;
        }
      };

      // 3. Interactive Pricing Toggle Engine
      window.zothSetBilling = function(period) {
        var monthlyBtn = document.getElementById('zothMonthlyBtn');
        var annualBtn = document.getElementById('zothAnnualBtn');
        var priceNums = document.querySelectorAll('.zoth-price-number');
        var proPeriod = document.getElementById('zothProPeriod');
        var entPeriod = document.getElementById('zothEntPeriod');
        var proAnnualNote = document.getElementById('zothProAnnualNote');
        var entAnnualNote = document.getElementById('zothEntAnnualNote');

        zothPlayTone(period === 'annual' ? 720 : 480, 'sine', 0.1);

        if (period === 'annual') {
          if (monthlyBtn) monthlyBtn.classList.remove('active');
          if (annualBtn) annualBtn.classList.add('active');
          priceNums.forEach(function(el) {
            var val = el.getAttribute('data-annual');
            if (val !== null) el.textContent = val;
          });
          if (proPeriod) proPeriod.textContent = '/ month';
          if (entPeriod) entPeriod.textContent = '/ month';
          if (proAnnualNote) proAnnualNote.style.display = 'block';
          if (entAnnualNote) entAnnualNote.style.display = 'block';
        } else {
          if (annualBtn) annualBtn.classList.remove('active');
          if (monthlyBtn) monthlyBtn.classList.add('active');
          priceNums.forEach(function(el) {
            var val = el.getAttribute('data-monthly');
            if (val !== null) el.textContent = val;
          });
          if (proPeriod) proPeriod.textContent = '/ month';
          if (entPeriod) entPeriod.textContent = '/ month';
          if (proAnnualNote) proAnnualNote.style.display = 'none';
          if (entAnnualNote) entAnnualNote.style.display = 'none';
        }
      };

      // 4. Lead Capture Waitlist Modal Controller
      window.zothOpenWaitlistModal = function() {
        zothPlayTone(520, 'sine', 0.1);
        var modal = document.getElementById('zothWaitlistModal');
        if (modal) {
          if (typeof modal.showModal === 'function') modal.showModal();
          else modal.setAttribute('open', 'true');
        }
      };

      window.zothCloseWaitlistModal = function() {
        zothPlayTone(380, 'sine', 0.08);
        var modal = document.getElementById('zothWaitlistModal');
        if (modal) {
          if (typeof modal.close === 'function') modal.close();
          else modal.removeAttribute('open');
        }
      };

      window.zothHandleWaitlistSubmit = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        var emailInput = document.getElementById('zothLeadEmail');
        var nameInput = document.getElementById('zothLeadName');
        var roleSelect = document.getElementById('zothLeadRole');
        var errEl = document.getElementById('zothEmailError');

        if (!emailInput || !emailInput.value) return;
        var email = emailInput.value.trim();
        var emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email)) {
          if (errEl) errEl.textContent = 'Please enter a valid work email.';
          return;
        }
        if (errEl) errEl.textContent = '';

        // Simulate local-first queue assignment
        var queuePos = Math.floor(1200 + Math.random() * 800);
        var record = {
          name: nameInput ? nameInput.value.trim() : '',
          email: email,
          role: roleSelect ? roleSelect.value : '',
          queue: queuePos,
          ts: new Date().toISOString()
        };

        try {
          var waitlist = JSON.parse(localStorage.getItem('zoth_waitlist') || '[]');
          waitlist.push(record);
          localStorage.setItem('zoth_waitlist', JSON.stringify(waitlist));
        } catch (err) {}

        zothPlayTone(880, 'triangle', 0.25);
        var form = document.getElementById('zothWaitlistForm');
        var success = document.getElementById('zothWaitlistSuccess');
        var queueEl = document.getElementById('zothQueuePosition');
        if (queueEl) queueEl.textContent = '#' + queuePos.toLocaleString();
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';
      };

      // 5. Bento Card Mouse-Track Gradient Shader
      document.addEventListener('mousemove', function(e) {
        var cards = document.querySelectorAll('.zoth-bento-card');
        cards.forEach(function(card) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', x + 'px');
          card.style.setProperty('--mouse-y', y + 'px');
        });
      });

      // 6. 3D Tilt Card Motion Controller
      var tiltCard = document.getElementById('zothTiltCard');
      if (tiltCard) {
        var cardBody = tiltCard.querySelector('.zoth-tilt-card-body');
        tiltCard.addEventListener('mousemove', function(e) {
          if (!cardBody) return;
          var rect = tiltCard.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          var rotX = -(y / (rect.height / 2)) * 14;
          var rotY = (x / (rect.width / 2)) * 14;
          cardBody.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        });
        tiltCard.addEventListener('mouseleave', function() {
          if (cardBody) cardBody.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
      }

      // 7. Particle Mesh Canvas Engine
      var canvas = document.getElementById('zothParticleCanvas');
      if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var numParticles = 48;
        var animId = null;

        function resizeCanvas() {
          var rect = canvas.parentElement.getBoundingClientRect();
          var dpr = window.devicePixelRatio || 1;
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        var rect = canvas.parentElement.getBoundingClientRect();
        for (var i = 0; i < numParticles; i++) {
          particles.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: Math.random() * 2 + 1
          });
        }

        function renderParticles() {
          var r = canvas.parentElement.getBoundingClientRect();
          ctx.clearRect(0, 0, r.width, r.height);

          for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > r.width) p.vx *= -1;
            if (p.y < 0 || p.y > r.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
            ctx.fill();

            for (var j = i + 1; j < particles.length; j++) {
              var p2 = particles[j];
              var dx = p.x - p2.x;
              var dy = p.y - p2.y;
              var dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 110) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = 'rgba(0, 240, 255, ' + (1 - dist / 110) * 0.25 + ')';
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }
          animId = requestAnimationFrame(renderParticles);
        }
        renderParticles();
      }
    })();
    `;
  }

  // ===========================================================================
  // FULL COMPOSITE PAGE GENERATOR
  // ===========================================================================
  function generateFullPage(options) {
    var opt = options || {};
    var siteName = opt.siteName || "Apex Sovereign";
    var tagline = opt.tagline || "Autonomous Multi-Agent Web Foundry";
    var heroVariant = opt.heroVariant || HERO_VARIANTS.PARTICLE_MESH;
    var bentoVariant = opt.bentoVariant || BENTO_VARIANTS.BENTO_6_BOX;
    var testimonialVariant = opt.testimonialVariant || TESTIMONIAL_VARIANTS.INFINITE_MARQUEE;

    var heroHtml = generateHeroSection(heroVariant, opt.hero || {});
    var bentoHtml = generateBentoSection(bentoVariant, opt.bento || {});
    var pricingHtml = generatePricingSection(opt.pricing || {});
    var testimonialsHtml = generateTestimonialsSection(testimonialVariant, opt.testimonials || {});
    var sandboxHtml = generateSandboxSection(opt.sandbox || {});
    var faqHtml = generateFaqSection(opt.faq || {});
    var modalHtml = generateWaitlistModal(opt.modal || {});
    var cssStyles = getAllStyles(opt.theme || {});
    var jsScripts = getAllScripts();

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${siteName} — ${tagline}</title>
    <meta name="description" content="${siteName}: High-conversion sovereign web application built with Zoth Studio.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
      body {
        background: #050711;
        color: #f1f5f9;
        font-family: 'Figtree', sans-serif;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        overflow-x: hidden;
      }
      .zoth-site-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        max-width: 1200px;
        margin: 0 auto;
        border-bottom: 1px solid rgba(0, 240, 255, 0.15);
      }
      .zoth-site-brand {
        font-family: 'Syne', sans-serif;
        font-size: 1.3rem;
        font-weight: 800;
        color: #ffffff;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .zoth-nav-links {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .zoth-nav-links a {
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 600;
        transition: color 0.2s ease;
      }
      .zoth-nav-links a:hover { color: #ffffff; }
      .zoth-site-footer {
        border-top: 1px solid rgba(0, 240, 255, 0.15);
        padding: 40px 20px;
        text-align: center;
        font-size: 0.85rem;
        color: #94a3b8;
      }
      ${cssStyles}
    </style>
  </head>
  <body>
    <header class="zoth-site-header">
      <a href="#" class="zoth-site-brand">
        <span class="zoth-pulse-dot"></span>
        <span>${siteName}</span>
      </a>
      <nav class="zoth-nav-links">
        <a href="#features">Features</a>
        <a href="#sandbox">Sandbox</a>
        <a href="#pricing">Pricing</a>
        <a href="#testimonials">Reviews</a>
        <a href="#faq">FAQ</a>
        <button class="zoth-btn zoth-btn-primary" onclick="zothOpenWaitlistModal()">⚡ Get Access</button>
      </nav>
    </header>

    <main>
      ${heroHtml}
      ${sandboxHtml}
      ${bentoHtml}
      ${pricingHtml}
      ${testimonialsHtml}
      ${faqHtml}
    </main>

    ${modalHtml}

    <footer class="zoth-site-footer">
      <p>© 2026 ${siteName}. Sovereign, local-first web architecture generated by Zoth Studio.</p>
    </footer>

    <script>
      ${jsScripts}
    </script>
  </body>
</html>`;
  }

  // ===========================================================================
  // MUTATION HELPER (Prompt to Section Transformer)
  // ===========================================================================
  function mutateSiteSection(currentHtml, instruction, options) {
    if (!currentHtml || typeof currentHtml !== "string" || currentHtml.trim().length === 0) {
      return generateFullPage(options);
    }

    var inst = (instruction || "").toLowerCase();
    var opt = options || {};
    var html = currentHtml;

    // Helper: Ensure Stylesheet and Scripts are injected
    function ensureStylesAndScripts(srcHtml) {
      var out = srcHtml;
      var hasStyles = out.indexOf("/* ==========================================================================\n       ZOTH STUDIO — MODULAR SECTION & BENTO COMPONENT STYLES") !== -1 || out.indexOf(".zoth-section") !== -1;
      var hasScripts = out.indexOf("zothPlayTone") !== -1;

      if (!hasStyles) {
        var styles = "<style>\n" + getAllStyles(opt.theme || {}) + "\n</style>";
        if (out.indexOf("</head>") !== -1) {
          out = out.replace("</head>", styles + "\n</head>");
        } else {
          out = styles + "\n" + out;
        }
      }

      if (!hasScripts) {
        var scripts = "<script>\n" + getAllScripts() + "\n</script>";
        if (out.indexOf("</body>") !== -1) {
          out = out.replace("</body>", scripts + "\n</body>");
        } else {
          out = out + "\n" + scripts;
        }
      }
      return out;
    }

    html = ensureStylesAndScripts(html);

    // 1. HERO MUTATIONS
    if (inst.indexOf("particle") !== -1 && inst.indexOf("hero") !== -1 || inst.indexOf("switch hero to particle") !== -1) {
      var newHero = generateHeroSection(HERO_VARIANTS.PARTICLE_MESH, opt.hero || {});
      html = replaceOrInsertSection(html, "hero", newHero, "top");
    } else if (inst.indexOf("3d") !== -1 || inst.indexOf("tilt") !== -1 || inst.indexOf("figurine") !== -1) {
      var newHeroTilt = generateHeroSection(HERO_VARIANTS.TILT_CARD_3D, opt.hero || {});
      html = replaceOrInsertSection(html, "hero", newHeroTilt, "top");
    } else if (inst.indexOf("minimalist") !== -1 || inst.indexOf("minimal") !== -1) {
      var newHeroMin = generateHeroSection(HERO_VARIANTS.MINIMALIST_GLOW, opt.hero || {});
      html = replaceOrInsertSection(html, "hero", newHeroMin, "top");
    }

    // 2. BENTO GRID MUTATIONS
    if (inst.indexOf("4-box") !== -1 || inst.indexOf("4 box") !== -1 || (inst.indexOf("bento") !== -1 && inst.indexOf("4") !== -1)) {
      var newBento4 = generateBentoSection(BENTO_VARIANTS.BENTO_4_BOX, opt.bento || {});
      html = replaceOrInsertSection(html, "features", newBento4, "after-hero");
    } else if (inst.indexOf("6-box") !== -1 || inst.indexOf("6 box") !== -1 || inst.indexOf("bento") !== -1 || inst.indexOf("feature grid") !== -1) {
      var newBento6 = generateBentoSection(BENTO_VARIANTS.BENTO_6_BOX, opt.bento || {});
      html = replaceOrInsertSection(html, "features", newBento6, "after-hero");
    }

    // 3. PRICING MUTATIONS
    if (inst.indexOf("pricing") !== -1 || inst.indexOf("discount") !== -1 || inst.indexOf("annual") !== -1 || inst.indexOf("billing") !== -1) {
      var newPricing = generatePricingSection(opt.pricing || {});
      html = replaceOrInsertSection(html, "pricing", newPricing, "after-features");
    }

    // 4. TESTIMONIAL MUTATIONS
    if (inst.indexOf("marquee") !== -1 || inst.indexOf("ticker") !== -1) {
      var newMarquee = generateTestimonialsSection(TESTIMONIAL_VARIANTS.INFINITE_MARQUEE, opt.testimonials || {});
      html = replaceOrInsertSection(html, "testimonials", newMarquee, "after-pricing");
    } else if (inst.indexOf("review") !== -1 || inst.indexOf("testimonial") !== -1 || inst.indexOf("carousel") !== -1 || inst.indexOf("social proof") !== -1) {
      var newReviews = generateTestimonialsSection(TESTIMONIAL_VARIANTS.INTERACTIVE_CARDS, opt.testimonials || {});
      html = replaceOrInsertSection(html, "testimonials", newReviews, "after-pricing");
    }

    // 5. SANDBOX MUTATIONS
    if (inst.indexOf("sandbox") !== -1 || inst.indexOf("code execution") !== -1 || inst.indexOf("audio feedback") !== -1 || inst.indexOf("simulator") !== -1) {
      var newSandbox = generateSandboxSection(opt.sandbox || {});
      html = replaceOrInsertSection(html, "sandbox", newSandbox, "after-hero");
    }

    // 6. FAQ ACCORDION MUTATIONS
    if (inst.indexOf("faq") !== -1 || inst.indexOf("accordion") !== -1 || inst.indexOf("question") !== -1) {
      var newFaq = generateFaqSection(opt.faq || {});
      html = replaceOrInsertSection(html, "faq", newFaq, "before-footer");
    }

    // 7. WAITLIST MODAL MUTATIONS
    if (inst.indexOf("waitlist") !== -1 || inst.indexOf("modal") !== -1 || inst.indexOf("lead capture") !== -1) {
      if (html.indexOf('id="zothWaitlistModal"') === -1) {
        var newModal = generateWaitlistModal(opt.modal || {});
        if (html.indexOf("</body>") !== -1) {
          html = html.replace("</body>", newModal + "\n</body>");
        } else {
          html = html + "\n" + newModal;
        }
      }
    }

    return html;
  }

  // Helper: Section replacer / injector using regex boundaries
  function replaceOrInsertSection(srcHtml, sectionId, newSectionMarkup, fallbackPos) {
    // Regex looking for <section ... id="sectionId" ...>...</section>
    var sectionRegex = new RegExp('<section[^>]*id=["\']' + sectionId + '["\'][^>]*>[\\s\\S]*?<\\/section>', 'i');
    if (sectionRegex.test(srcHtml)) {
      return srcHtml.replace(sectionRegex, newSectionMarkup);
    }

    // Also check for class name fallback
    var classRegex = new RegExp('<section[^>]*class=["\'][^"\']*zoth-' + sectionId + '[^"\']*["\'][^>]*>[\\s\\S]*?<\\/section>', 'i');
    if (classRegex.test(srcHtml)) {
      return srcHtml.replace(classRegex, newSectionMarkup);
    }

    // Otherwise insert at appropriate position
    if (srcHtml.indexOf("<main>") !== -1) {
      if (fallbackPos === "top") {
        return srcHtml.replace("<main>", "<main>\n" + newSectionMarkup);
      }
      if (fallbackPos === "before-footer" && srcHtml.indexOf("</main>") !== -1) {
        return srcHtml.replace("</main>", newSectionMarkup + "\n</main>");
      }
      return srcHtml.replace("</main>", newSectionMarkup + "\n</main>");
    }

    if (srcHtml.indexOf("</body>") !== -1) {
      return srcHtml.replace("</body>", newSectionMarkup + "\n</body>");
    }

    return srcHtml + "\n" + newSectionMarkup;
  }

  // ===========================================================================
  // TOOL CONTRACT & ACTION DISPATCHER
  // ===========================================================================
  var ACTIONS = {
    "sections.list": true,
    "sections.generate": true,
    "sections.mutate": true,
    "sections.full_page": true
  };

  function validate(request) {
    if (!request || typeof request !== "object") {
      return { ok: false, error: { code: "validation_error", message: "request must be an object" } };
    }
    if (!request.action || !ACTIONS[request.action]) {
      return { ok: false, error: { code: "validation_error", message: "invalid action: " + request.action } };
    }
    return { ok: true };
  }

  function run(request) {
    var check = validate(request);
    if (!check.ok) return check;

    var action = request.action;
    var params = request.params || {};
    var meta = request.meta || {};
    var now = new Date().toISOString();

    if (action === "sections.list") {
      return {
        ok: true,
        data: {
          version: VERSION,
          hero_variants: Object.values(HERO_VARIANTS),
          bento_variants: Object.values(BENTO_VARIANTS),
          pricing_variants: Object.values(PRICING_VARIANTS),
          testimonial_variants: Object.values(TESTIMONIAL_VARIANTS),
          sandbox_variants: Object.values(SANDBOX_VARIANTS),
          faq_variants: Object.values(FAQ_VARIANTS),
          modal_variants: Object.values(MODAL_VARIANTS)
        },
        meta: { request_id: meta.request_id || "req_sections_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "sections.generate") {
      var type = params.type || "hero";
      var variant = params.variant;
      var options = params.options || {};
      var output = "";

      if (type === "hero") output = generateHeroSection(variant, options);
      else if (type === "bento") output = generateBentoSection(variant, options);
      else if (type === "pricing") output = generatePricingSection(options);
      else if (type === "testimonials") output = generateTestimonialsSection(variant, options);
      else if (type === "sandbox") output = generateSandboxSection(options);
      else if (type === "faq") output = generateFaqSection(options);
      else if (type === "modal" || type === "waitlist") output = generateWaitlistModal(options);
      else output = generateHeroSection(variant, options);

      return {
        ok: true,
        data: { type: type, variant: variant, html: output },
        meta: { request_id: meta.request_id || "req_gen_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "sections.mutate") {
      var currentHtml = params.currentHtml || "";
      var instruction = params.instruction || "";
      var mutatedHtml = mutateSiteSection(currentHtml, instruction, params.options || {});

      return {
        ok: true,
        data: { instruction: instruction, html: mutatedHtml },
        meta: { request_id: meta.request_id || "req_mut_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    if (action === "sections.full_page") {
      var fullPageHtml = generateFullPage(params);
      return {
        ok: true,
        data: { html: fullPageHtml },
        meta: { request_id: meta.request_id || "req_full_" + Math.random().toString(36).slice(2, 9), ts: now }
      };
    }

    return { ok: false, error: { code: "unhandled_action", message: "unhandled action: " + action } };
  }

  // ===========================================================================
  // PUBLIC EXPORTS
  // ===========================================================================
  return {
    VERSION: VERSION,
    HERO_VARIANTS: HERO_VARIANTS,
    BENTO_VARIANTS: BENTO_VARIANTS,
    PRICING_VARIANTS: PRICING_VARIANTS,
    TESTIMONIAL_VARIANTS: TESTIMONIAL_VARIANTS,
    SANDBOX_VARIANTS: SANDBOX_VARIANTS,
    FAQ_VARIANTS: FAQ_VARIANTS,
    MODAL_VARIANTS: MODAL_VARIANTS,
    DEFAULT_THEME: DEFAULT_THEME,
    generateHeroSection: generateHeroSection,
    generateBentoSection: generateBentoSection,
    generatePricingSection: generatePricingSection,
    generateTestimonialsSection: generateTestimonialsSection,
    generateSandboxSection: generateSandboxSection,
    generateFaqSection: generateFaqSection,
    generateWaitlistModal: generateWaitlistModal,
    generateFullPage: generateFullPage,
    mutateSiteSection: mutateSiteSection,
    getAllStyles: getAllStyles,
    getAllScripts: getAllScripts,
    validate: validate,
    run: run
  };
});
