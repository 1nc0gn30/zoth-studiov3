/**
 * Zoth Studio — Universal Semantic Domain & Content Synthesizer (v4.0)
 * Completely universal generative engine for ALL industries, niches, and prompts.
 * Generates bespoke copywriting, dynamic color palettes, bento components,
 * multi-page catalogs, pricing models, and APIs with zero hardcoded single-app bias.
 */

(function(global) {
  'use strict';

  const ZothDomainSynthesizer = {
    VERSION: '4.0.0',

    // Detect industry domain from natural language prompt
    detectDomain(prompt = '') {
      const p = prompt.toLowerCase();
      const hasWord = (word) => new RegExp('\\b' + word + '\\b', 'i').test(p);
      const hasAny = (list) => list.some(w => hasWord(w) || p.includes(w));

      // 0. Skateboarding, Action Sports & Street Culture
      if (hasAny(['skate', 'skateboard', 'skateboarding', 'skateshop', 'skatepark', 'surfboard', 'snowboard', 'bmx', 'streetwear'])) {
        return 'action_sports_skate';
      }

      // 1. Education & EdTech (check before AI if it mentions bootcamp/school/academy/curriculum)
      if (hasAny(['bootcamp', 'curriculum', 'tutoring', 'tutor', 'course', 'academy', 'school', 'university', 'edtech', 'learn to code', 'masterclass'])) {
        return 'education_edtech';
      }

      // 2. AI, Machine Learning & SaaS
      if (hasWord('ai') || hasWord('llm') || hasWord('rag') || hasWord('agent') || hasWord('agents') || hasAny(['artificial intelligence', 'machine learning', 'neural', 'devtools', 'api gateway', 'vector database', 'copilot', 'saas platform', 'cloud compute', 'subagent', 'ast compiler'])) {
        return 'ai_saas';
      }

      // 3. Cybersecurity & Cryptography
      if (hasAny(['cybersecurity', 'zero-trust', 'zero trust', 'pentest', 'firewall', 'encryption', 'threat intelligence', 'soc2', 'malware', 'vulnerability', 'exploit', 'cryptographic', 'argon2'])) {
        return 'cybersecurity';
      }

      // 4. Web3, DeFi & Crypto
      if (hasWord('dex') || hasWord('dao') || hasWord('nft') || hasAny(['crypto', 'defi', 'solana', 'ethereum', 'blockchain', 'staking', 'liquidity pool', 'tokenomics', 'smart contract', 'web3 wallet', 'amm swap'])) {
        return 'web3_crypto';
      }

      // 5. Creative Agency & Design Studio
      if (hasAny(['design studio', 'branding agency', 'creative agency', 'marketing agency', 'ui/ux', 'typography', 'brand identity', 'creative direction', 'atelier', 'graphic design'])) {
        return 'creative_agency';
      }

      // 6. Gaming & WebGL 3D
      if (hasWord('rpg') || hasWord('fps') || hasAny(['game engine', 'indie game', 'webgl', '3d physics', 'shader', 'unity', 'unreal', 'metaverse', 'gaming platform', 'steam game', 'arcade'])) {
        return 'gaming_webgl';
      }

      // 7. E-Commerce, Fashion & Luxury Goods
      if (hasAny(['watch', 'jewelry', 'boutique', 'fashion brand', 'streetwear', 'apparel', 'luxury goods', 'e-commerce', 'ecommerce', 'perfume', 'clothing line', 'retail store'])) {
        return 'ecommerce_fashion';
      }

      // 8. Restaurants, Cafes & Bakeries
      if (hasAny(['restaurant', 'cafe', 'coffee', 'bakery', 'sourdough', 'pizza', 'bistro', 'dining', 'burger', 'sushi', 'tasting menu', 'brewery', 'cocktail bar', 'barista', 'pastry'])) {
        return 'restaurant_cafe';
      }

      // 9. Delivery & Courier Logistics
      if (hasAny(['courier', 'delivery app', 'dispatch', 'freight', 'last-mile', 'fleet tracking', 'logistics platform', 'package drop', 'courier service'])) {
        return 'delivery_logistics';
      }

      // 10. Real Estate & Architecture
      if (hasAny(['real estate', 'penthouse', 'apartment', 'realtor', 'property listing', 'villa', 'condo', 'luxury residential', '3d floorplan', 'housing development'])) {
        return 'real_estate';
      }

      // 11. Healthcare & Wellness
      if (hasAny(['telehealth', 'biomarker', 'medical clinic', 'doctor', 'dental', 'physician', 'longevity', 'wellness clinic', 'therapy', 'healthcare', 'pharmacy'])) {
        return 'healthcare_medical';
      }

      // 12. Fitness, Athletics, Skateboarding & Action Sports
      if (hasAny(['skateboard', 'skateboarding', 'skate', 'skateshop', 'skatepark', 'surf', 'snowboard', 'bmx', 'streetwear', 'fitness', 'crossfit', 'gym', 'workout', 'personal training', 'powerlifting', 'athletic club', 'boxing club'])) {
        return 'action_sports_skate';
      }

      // 13. Legal & Intellectual Property
      if (hasAny(['law firm', 'legal counsel', 'attorney', 'patent litigation', 'trademark', 'corporate lawyer', 'intellectual property', 'nda review', 'c-corp formation'])) {
        return 'legal_ip';
      }

      // 14. Finance & Wealth Management
      if (hasAny(['wealth management', 'fiduciary', 'hedge fund', 'venture capital', 'financial advisor', 'tax-loss harvesting', 'asset management', 'estate planning'])) {
        return 'finance_wealth';
      }

      // 15. Local Home Services (Plumbing, HVAC, Lawn)
      if (hasAny(['plumbing', 'electrician', 'hvac', 'lawn care', 'handyman', 'home repair', 'roofing', 'landscaping contractor', 'field service'])) {
        return 'local_services';
      }

      // 16. Automotive & EV
      if (hasAny(['ev charging', 'detailing', 'supercar', 'auto repair', 'dealership', 'fleet maintenance', 'ceramic coating', 'automotive'])) {
        return 'automotive_ev';
      }

      // 17. Music & Audio Production
      if (hasAny(['recording studio', 'dolby atmos', 'audio mastering', 'record label', 'music producer', 'podcast network', 'analog console', 'sound engineer'])) {
        return 'music_audio';
      }

      // 18. Media & Entertainment
      if (hasAny(['manga', 'anime', 'comic series', 'webtoon', 'motion video', 'film production', 'streaming series', 'graphic novel'])) {
        return 'media_entertainment';
      }

      // 19. Hospitality & Travel
      if (hasAny(['luxury hotel', 'resort', 'chalet', 'yacht charter', 'vacation rental', 'glamping', 'safari lodge', 'travel booking', 'overwater villa'])) {
        return 'hospitality_travel';
      }

      // 20. Clean Energy & Sustainability
      if (hasAny(['solar microgrid', 'solar panel', 'clean energy', 'battery storage', 'renewable power', 'sustainability tech', 'carbon capture'])) {
        return 'clean_energy';
      }

      // Universal Adaptive Fallback
      return 'universal_adaptive';
    },

    // Extract dynamic brand name from prompt
    extractBrandName(prompt, domain) {
      const p = prompt.trim();
      if (!p) return 'Nexus Studio';

      // Look for explicit names in quotes
      const quoted = p.match(/["']([^"']+)["']/);
      if (quoted) return quoted[1];

      // Strip command verbs & common fluff prefixes
      var cleaned = p.replace(/^(make|create|build|design|generate|produce|code|craft)\s+(a|an|the|me\s+a)?\s+/i, '');
      cleaned = cleaned.replace(/\b(website|web\s*app|landing\s*page|platform|site)\b/gi, '').trim();

      const stopWords = new Set(['a', 'an', 'the', 'for', 'with', 'and', 'or', 'in', 'on', 'at', 'to', 'of', 'is', 'app', 'website', 'made', 'built', 'dope', 'cool', 'super', 'awesome', 'fresh', 'my', 'our', 'your']);
      const words = cleaned.split(/\s+/).filter(w => w && !stopWords.has(w.toLowerCase()));
      
      if (words.length >= 2) {
        return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
      if (words.length === 1) {
        var baseWord = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        if (p.toLowerCase().includes('skate')) return baseWord + ' Skateboards';
        return baseWord + ' Studio';
      }
      if (words.length === 1) {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() + ' Studio';
      }

      const domainNames = {
        ai_saas: 'Lumina Compute',
        cybersecurity: 'Aegis Zero-Trust',
        web3_crypto: 'Apex Liquidity Exchange',
        creative_agency: 'Vanguard Atelier',
        gaming_webgl: 'Vortex Game Engine',
        ecommerce_fashion: 'Aura Luxury House',
        restaurant_cafe: 'Solstice Artisan Bistro',
        delivery_logistics: 'SwiftRoute Dispatch',
        real_estate: 'Skyline Penthouse Collection',
        healthcare_medical: 'Prism Health Institute',
        fitness_athletics: 'IronPulse Performance Club',
        education_edtech: 'Quantum Mind Academy',
        legal_ip: 'Vanguard Legal Partners',
        finance_wealth: 'Apex Capital Advisors',
        local_services: 'Green Horizon Precision Care',
        automotive_ev: 'VoltDrive EV Network',
        music_audio: 'Aura Sound Lab',
        media_entertainment: 'Kurogane Cyber Comic Studios',
        hospitality_travel: 'Solstice Grand Suites',
        clean_energy: 'Helios Microgrid Energy',
        universal_adaptive: 'Zoth Vanguard'
      };

      return domainNames[domain] || 'Vanguard Sovereign Core';
    },

    // Synthesize tailored website data
    synthesize(prompt = '', agent = 'antigravity') {
      const domain = this.detectDomain(prompt);
      const name = this.extractBrandName(prompt, domain);

      switch(domain) {
        case 'action_sports_skate':
          return this.generateActionSportsSite(prompt, name, agent);
        case 'ai_saas':
          return this.generateAiSaasSite(prompt, name, agent);
        case 'cybersecurity':
          return this.generateCybersecuritySite(prompt, name, agent);
        case 'web3_crypto':
          return this.generateWeb3Site(prompt, name, agent);
        case 'creative_agency':
          return this.generateCreativeAgencySite(prompt, name, agent);
        case 'gaming_webgl':
          return this.generateGamingSite(prompt, name, agent);
        case 'ecommerce_fashion':
          return this.generateEcommerceSite(prompt, name, agent);
        case 'restaurant_cafe':
          return this.generateRestaurantCafeSite(prompt, name, agent);
        case 'delivery_logistics':
          return this.generateDeliverySite(prompt, name, agent);
        case 'real_estate':
          return this.generateRealEstateSite(prompt, name, agent);
        case 'healthcare_medical':
          return this.generateHealthcareSite(prompt, name, agent);
        case 'fitness_athletics':
          return this.generateFitnessSite(prompt, name, agent);
        case 'education_edtech':
          return this.generateEducationSite(prompt, name, agent);
        case 'legal_ip':
          return this.generateLegalSite(prompt, name, agent);
        case 'finance_wealth':
          return this.generateFinanceSite(prompt, name, agent);
        case 'local_services':
          return this.generateLocalServiceSite(prompt, name, agent);
        case 'automotive_ev':
          return this.generateAutomotiveSite(prompt, name, agent);
        case 'music_audio':
          return this.generateMusicSite(prompt, name, agent);
        case 'media_entertainment':
          return this.generateMediaSite(prompt, name, agent);
        case 'hospitality_travel':
          return this.generateHospitalitySite(prompt, name, agent);
        case 'clean_energy':
          return this.generateCleanEnergySite(prompt, name, agent);
        default:
          return this.generateAdaptiveSite(prompt, name, agent);
      }
    },

    // 1. AI, MACHINE LEARNING & SAAS
    generateAiSaasSite(prompt, name, agent) {
      return {
        domain: 'ai_saas',
        name: name,
        tagline: 'Autonomous AI Compute & Neural Engine Infrastructure',
        badge: '⚡ 20-Agent Cluster Online · Sub-Millisecond AST Engine',
        icon: '⚡',
        theme: {
          bg: '#040711',
          surface: 'rgba(10, 18, 38, 0.85)',
          border: 'rgba(0, 240, 255, 0.25)',
          accent: '#00f0ff',
          accentSecondary: '#38bdf8',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Build & Deploy Autonomous AI Workflows at Lightning Velocity.',
          sub: 'Zero-cloud-egress local execution, AST self-healing code compilation, and sub-second model orchestration for production engineering teams.',
          cta: '⚡ Launch Free Workspace',
          ctaSecondary: '📖 Read API Reference'
        },
        bentoFeatures: [
          { icon: '🧠', title: 'Sub-Millisecond Neural Routing', desc: 'Hardware-isolated local inference nodes executing without cloud latency or third-party token leaks.' },
          { icon: '🛡️', title: 'Deterministic AST Self-Healer', desc: 'Continuous code validation against schema contracts with automated syntax and type repair.' },
          { icon: '🌐', title: 'Multi-Framework Transpiler', desc: '1-click export to Next.js 15 App Router, Astro 5, Vite+React, and standalone HTML bundles.' },
          { icon: '📊', title: 'Zero-Egress Privacy Telemetry', desc: 'Cryptographic event logging and real-time execution graphs stored entirely on local NVMe.' }
        ],
        itemsCatalog: [
          { name: 'GPU Cloud Worker Node', place: 'Isolated NVMe Sandboxes', time: 'Instant Boot', price: '$0.008/hr', rating: '99.99% Uptime' },
          { name: 'Model Distillation Pipeline', place: 'Quantized LoRA Tuning', time: '< 45 min', price: '$49.00', rating: '5.0 ★' },
          { name: 'AST Code Repair Swarm', place: 'Automated CI/CD Fixes', time: 'Real-Time', price: '$19.00/mo', rating: 'Zero Drift' },
          { name: 'Enterprise Private Gateway', place: 'Dedicated Air-Gapped Rack', time: '24/7 SLA', price: '$499.00', rating: 'SOC2 Ready' }
        ],
        pricing: [
          { tier: 'Developer', price: '$0', desc: 'Free forever for local development', perks: ['1 local compute node', 'Basic AST validation', 'Community Discord support'] },
          { tier: 'Pro Swarm', price: '$29/mo', popular: true, desc: 'For fast-moving AI engineering teams', perks: ['Unlimited parallel subagents', 'Priority GPU queueing', 'Zero-cloud egress guarantee', 'Automated AST self-repair'] },
          { tier: 'Enterprise Sovereign', price: '$249/mo', desc: 'Air-gapped on-premise infrastructure', perks: ['Dedicated bare-metal instances', 'Custom model fine-tuning', 'Custom SLA & 24/7 hotline', 'SSO & Audit logging'] }
        ],
        faq: [
          { q: 'Is user code and prompt data private?', a: 'Yes, 100% of execution runs locally or in encrypted dedicated enclaves with zero cloud logging.' },
          { q: 'Which model providers are supported?', a: 'Supports DeepMind Antigravity, xAI Grok, Anthropic Claude, OpenAI, and local llama.cpp / vLLM weights.' },
          { q: 'Can I export to production repositories?', a: 'Yes! Instant 1-click ZIP export bundles clean, dependency-locked Next.js, Astro, or Vite apps.' }
        ]
      };
    },

    // 2. CYBERSECURITY & CRYPTOGRAPHY
    generateCybersecuritySite(prompt, name, agent) {
      return {
        domain: 'cybersecurity',
        name: name,
        tagline: 'Zero-Trust Defense & Sovereign Cryptographic Fortress',
        badge: '🛡️ Argon2id Encryption Active · Zero Cloud Footprint',
        icon: '🛡️',
        theme: {
          bg: '#05070e',
          surface: 'rgba(12, 17, 30, 0.9)',
          border: 'rgba(52, 211, 153, 0.25)',
          accent: '#34d399',
          accentSecondary: '#00f0ff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Impenetrable Zero-Trust Defense for Modern Infrastructure.',
          sub: 'Continuous attack surface discovery, post-quantum cryptography, and real-time threat neutralization across private networks and edge endpoints.',
          cta: '🛡️ Start Security Audit',
          ctaSecondary: '🔐 Explore Cryptographic Specs'
        },
        bentoFeatures: [
          { icon: '🔐', title: 'XChaCha20-Poly1305 Vault', desc: 'Hardware-isolated memory encryption with automatic Zeroize wiping on process termination.' },
          { icon: '📡', title: 'Subdomain & Port Recon', desc: 'Active and passive network perimeter mapping detecting dangling DNS records and exposed endpoints.' },
          { icon: '⚔️', title: 'Autonomous Pentest Engine', desc: 'Automated fuzzing and AST vulnerability auditing against OWASP Top 10 exploits.' },
          { icon: '📑', title: 'Cryptographic Proof of Solvency', desc: 'Verifiable Merkle-tree state attestations with zero knowledge leakage.' }
        ],
        itemsCatalog: [
          { name: 'External Attack Surface Scan', place: 'Subdomain Recon Engine', time: '10 min', price: '$99.00', rating: 'Full Report' },
          { name: 'Zero-Trust Bastion Gateway', place: 'Hardware Wireguard Host', time: 'Instant', price: '$35.00/mo', rating: 'Zero Log' },
          { name: 'Smart Contract Formal Audit', place: 'Symbolic AST Verification', time: '24 Hours', price: '$850.00', rating: '100% Manifold' },
          { name: '24/7 SOC Threat Sentinel', place: 'Continuous Endpoint Watch', time: 'Real-Time', price: '$299.00/mo', rating: '99.99% SLA' }
        ],
        pricing: [
          { tier: 'Starter Audit', price: '$49', desc: 'One-time security vulnerability scan', perks: ['Port & DNS vulnerability scan', 'Header & SSL grade report', 'PDF remediation roadmap'] },
          { tier: 'Sentinel Pro', price: '$149/mo', popular: true, desc: 'Continuous automated defense suite', perks: ['24/7 active perimeter monitoring', 'Automated CVE alerts & auto-patching', 'Argon2id BYOK encrypted vault', 'Direct Slack/Signal SOC bridge'] },
          { tier: 'Fortress Enterprise', price: '$890/mo', desc: 'Complete dedicated air-gapped protection', perks: ['Custom red-team adversary simulation', 'Dedicated security architect', 'Guaranteed 15-minute incident SLA', 'Custom on-prem compliance certs'] }
        ],
        faq: [
          { q: 'How does your encryption protect against memory inspection?', a: 'We employ Argon2id key derivation combined with Zeroize Rust intrinsics to wipe all encryption keys from RAM upon drop.' },
          { q: 'Does this interfere with existing firewalls?', a: 'No, our sentinels operate transparently via non-invasive eBPF hooks and DNS verification.' }
        ]
      };
    },

    // 3. WEB3, DEFI & SOLANA
    generateWeb3Site(prompt, name, agent) {
      return {
        domain: 'web3_crypto',
        name: name,
        tagline: 'High-Throughput Liquidity & Sovereign On-Chain Protocol',
        badge: '🪐 Sub-Second Finality · 100% Non-Custodial Liquidity',
        icon: '🪐',
        theme: {
          bg: '#070512',
          surface: 'rgba(18, 12, 36, 0.85)',
          border: 'rgba(192, 132, 252, 0.25)',
          accent: '#c084fc',
          accentSecondary: '#00f0ff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Next-Generation Web3 Liquidity Engine & Yield Protocol.',
          sub: 'Instant cross-chain swaps, automated concentrated liquidity pools, and algorithmic arbitrage vaults with zero custody risk and ultra-low slippage.',
          cta: '🪐 Launch Protocol App',
          ctaSecondary: '📄 Read Whitepaper & Audits'
        },
        bentoFeatures: [
          { icon: '⚡', title: '65,000 TPS Execution', desc: 'Engineered for high-frequency sub-second settlement on modern high-speed L1 chains.' },
          { icon: '💧', title: 'Concentrated Liquidity AMM', desc: 'Dynamic tick ranges maximizing capital efficiency and earning top-tier LP fee yields.' },
          { icon: '🔒', title: 'Audited Non-Custodial Contracts', desc: 'Battle-tested smart contracts formally verified by independent security researchers.' },
          { icon: '📈', title: 'Real-Time Orderbook Depth', desc: 'Institutional WebSockets streaming millisecond depth charts and trading volumes.' }
        ],
        itemsCatalog: [
          { name: 'SOL-USDC Concentrated Vault', place: '0.05% Dynamic Tier', time: 'Instant LP', price: '28.4% APY', rating: '$14.2M TVL' },
          { name: 'Algorithmic Arbitrage Index', place: 'Auto-Rebalancing Vault', time: 'Auto-Compound', price: '34.8% APY', rating: '$8.9M TVL' },
          { name: 'Cross-Chain Bridge Pass', place: 'Zero Gas Subsidized', time: '< 2.5s', price: '$0.00 Fee', rating: 'Instant' },
          { name: 'Liquid Staking Derivative', place: 'Uncapped Validator Mesh', time: 'Live Rewards', price: '7.8% APY', rating: 'Non-Custodial' }
        ],
        pricing: [
          { tier: 'Community Trader', price: '$0', desc: 'Zero protocol platform fees', perks: ['Unlimited DEX swaps', 'Standard routing algorithms', 'Public analytics dashboard'] },
          { tier: 'Pro Trader & LP', price: '$49/mo', popular: true, desc: 'Advanced analytics & MEV protection', perks: ['Private RPC endpoint access', 'Zero-slippage MEV shield', 'Automated limit orders & DCA', 'Priority liquidity pool routing'] },
          { tier: 'Institutional API', price: '$499/mo', desc: 'Dedicated order execution gateways', perks: ['Dedicated sub-millisecond RPC node', 'Custom liquidity market making API', 'Dedicated quant account manager', 'Custom smart contract deployments'] }
        ],
        faq: [
          { q: 'Is this protocol non-custodial?', a: 'Yes, 100% of funds remain under your private wallet keys. The protocol never takes custody of assets.' },
          { q: 'How are smart contract vulnerabilities prevented?', a: 'All contracts undergo multi-firm formal verification, time-locked upgrades, and continuous bug bounty rewards.' }
        ]
      };
    },

    // 4. CREATIVE AGENCY & DESIGN STUDIO
    generateCreativeAgencySite(prompt, name, agent) {
      return {
        domain: 'creative_agency',
        name: name,
        tagline: 'Brand Identity, Digital Experiences & Kinetic Direction',
        badge: '🎨 Cannes & Awwwards Recognized · Bespoke Digital Atelier',
        icon: '🎨',
        theme: {
          bg: '#08080a',
          surface: 'rgba(18, 18, 22, 0.85)',
          border: 'rgba(232, 200, 114, 0.25)',
          accent: '#e8c872',
          accentSecondary: '#ffffff',
          text: '#ffffff',
          textMuted: '#a1a1aa'
        },
        hero: {
          title: 'We Craft Magnetic Brands & Award-Winning Digital Artifacts.',
          sub: 'Bridging the gap between high art and high technology. We design distinctive brand identities, immersive 3D web experiences, and scalable design systems.',
          cta: '✨ Start a Project',
          ctaSecondary: '👁️ Explore Selected Works'
        },
        bentoFeatures: [
          { icon: '📐', title: 'Architectural Brand Systems', desc: 'Distinctive visual identities, bespoke typography, and comprehensive design tokens.' },
          { icon: '🌐', title: 'Immersive WebGL & Motion', desc: 'Fluid, 60 FPS interactive web experiences that captivate attention and elevate prestige.' },
          { icon: '📱', title: 'Multi-Platform Product UI', desc: 'Intuitive, pixel-perfect digital product interfaces engineered for frictionless engagement.' },
          { icon: '🎬', title: 'Cinematic 3D Video & CG', desc: 'High-impact product visualizers and promotional films designed for viral reach.' }
        ],
        itemsCatalog: [
          { name: 'Comprehensive Brand Identity', place: 'Identity & Guidelines', time: '3-4 Weeks', price: '$4,500', rating: 'Full Suite' },
          { name: 'Cinematic 3D Landing Page', place: 'WebGL + React + Motion', time: '2-3 Weeks', price: '$6,800', rating: 'Awwwards Caliber' },
          { name: 'Design System & Component Kit', place: 'Figma + Tailwind Tokens', time: '2 Weeks', price: '$3,200', rating: 'Production Ready' },
          { name: 'Product Motion Teaser Video', place: '60 FPS 4K Motion CG', time: '1-2 Weeks', price: '$2,400', rating: 'Social Ready' }
        ],
        pricing: [
          { tier: 'Brand Sprint', price: '$4,500', desc: 'Complete brand identity & visual kit', perks: ['Logo suite & typography spec', 'Color palette & art direction', 'Social media kit & stationary', 'Interactive brand guidelines'] },
          { tier: 'Full Experience', price: '$9,800', popular: true, desc: 'Brand + Custom 3D Web Application', perks: ['Complete brand identity', 'Custom WebGL / 3D web application', 'Figma to React / Astro development', 'SEO, speed & analytics optimization'] },
          { tier: 'Quarterly Atelier', price: '$6,500/mo', desc: 'Dedicated senior design team on retainer', perks: ['Continuous design & feature rollouts', 'Dedicated design lead & developer', 'Weekly sprint reviews & iterations', 'Unlimited design requests'] }
        ],
        faq: [
          { q: 'How long does a standard web project take?', a: 'Most bespoke brand and website projects are completed within 3 to 5 weeks from initial discovery.' },
          { q: 'Do you provide full development?', a: 'Yes! We deliver turnkey, production-ready code in Next.js, Astro, or React with Netlify/Vercel deployment.' }
        ]
      };
    },

    // 5. GAMING & WEBGL 3D
    generateGamingSite(prompt, name, agent) {
      return {
        domain: 'gaming_webgl',
        name: name,
        tagline: 'Immersive WebGL 3D Worlds & Next-Gen Indie Gaming',
        badge: '🎮 60 FPS WebGL Engine Active · Real-Time Physics',
        icon: '🎮',
        theme: {
          bg: '#05040a',
          surface: 'rgba(16, 12, 28, 0.85)',
          border: 'rgba(236, 72, 153, 0.25)',
          accent: '#ec4899',
          accentSecondary: '#00f0ff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Dive Into Next-Generation 3D Browser Gaming Experiences.',
          sub: 'Zero-install instantaneous gameplay powered by custom WebGL shaders, volumetric particle physics, and multiplayer WebSocket synchronization.',
          cta: '🎮 Play Live Demo',
          ctaSecondary: '👾 Join Community Discord'
        },
        bentoFeatures: [
          { icon: '🕹️', title: 'Zero-Install WebGL 3D', desc: 'Direct-to-browser rendering hitting 60 FPS on desktop and mobile devices.' },
          { icon: '⚡', title: 'Sub-20ms Multiplayer Netcode', desc: 'Authoritative server physics with client prediction and smooth interpolation.' },
          { icon: '⚔️', title: 'Dynamic Procedural Dungeons', desc: 'Infinite mathematical level generation with evolving loot, traps, and boss encounters.' },
          { icon: '🎧', title: 'Spatial 3D Web Audio', desc: 'Synthesized Solfeggio sound effects and adaptive procedural soundtracks.' }
        ],
        itemsCatalog: [
          { name: 'Early Access Founder Pass', place: 'Lifetime Game Access', time: 'Instant Key', price: '$24.99', rating: 'VIP Title' },
          { name: 'Cosmetic Cyber Mech Skin', place: 'PBR Chrome Finish', time: 'In-Game Item', price: '$4.99', rating: 'Legendary' },
          { name: 'Custom Guild Server Host', place: 'Dedicated 64-Player Node', time: 'Instant Deploy', price: '$14.99/mo', rating: 'Low Latency' },
          { name: 'Original Soundtrack Vinyl + MP3', place: 'Spatial Audio Suite', time: 'Immediate DL', price: '$9.99', rating: '18 Tracks' }
        ],
        pricing: [
          { tier: 'Free Player', price: '$0', desc: 'Full access to standard casual modes', perks: ['Access to main campaign', 'Public multiplayer matchmaking', 'Daily community challenges'] },
          { tier: 'Season Battle Pass', price: '$9.99', popular: true, desc: 'Unlock 100+ exclusive cosmetic tiers', perks: ['100 cosmetic reward tiers', 'Exclusive legendary mech avatars', 'Double XP progression boosts', 'Private lobby creation rights'] },
          { tier: 'Founder Patron', price: '$49.99', desc: 'Lifetime VIP status & name in credits', perks: ['All future DLCs included free', 'Exclusive golden alchemical skin', 'Discord developer channel access', 'Your name featured in the main credits'] }
        ],
        faq: [
          { q: 'Do I need to download or install anything to play?', a: 'No! The game runs completely inside any modern web browser with zero installation needed.' },
          { q: 'Is controller support available?', a: 'Yes, full plug-and-play support for Xbox, PlayStation, and generic Bluetooth gamepads.' }
        ]
      };
    },

    // 6. E-COMMERCE & LUXURY FASHION
    generateEcommerceSite(prompt, name, agent) {
      return {
        domain: 'ecommerce_fashion',
        name: name,
        tagline: 'Haute Horlogerie, Bespoke Jewelry & Luxury Goods',
        badge: '💎 Certified Handcrafted Artisanship · Worldwide Concierge',
        icon: '💎',
        theme: {
          bg: '#070709',
          surface: 'rgba(18, 18, 22, 0.85)',
          border: 'rgba(232, 200, 114, 0.3)',
          accent: '#e8c872',
          accentSecondary: '#fbbf24',
          text: '#ffffff',
          textMuted: '#a1a1aa'
        },
        hero: {
          title: 'Timeless Elegance Engineered with Uncompromising Precision.',
          sub: 'Hand-assembled timepieces, bespoke jewelry, and limited artisanal drops crafted from ethical precious metals and sapphire crystal.',
          cta: '💎 Explore Collection',
          ctaSecondary: '🏛️ Book Private Atelier Visit'
        },
        bentoFeatures: [
          { icon: '✨', title: 'Hand-Crafted Mastery', desc: 'Every piece assembled by master horologists with certified individual serial engraving.' },
          { icon: '🛡️', title: '5-Year International Warranty', desc: 'Comprehensive global concierge protection with annual ultrasonic cleaning.' },
          { icon: '📦', title: 'Insured Armored Courier', desc: 'Discreet, signature-verified international shipping delivered to your doorstep.' },
          { icon: '🌿', title: '100% Conflict-Free Materials', desc: 'Fairmined gold, ethically sourced gemstones, and sustainable recycled titanium.' }
        ],
        itemsCatalog: [
          { name: 'Nocturne Chronograph Obsidian', place: 'Automatic Calibre 880', time: 'Limited 100 pcs', price: '$2,850', rating: '5.0 ★' },
          { name: 'Solstice Solar Dial Titanium', place: 'Aerospace Grade Titanium', time: 'In Stock', price: '$1,950', rating: '4.9 ★' },
          { name: 'Pavé Diamond Eternity Ring', place: '18k Champagne Gold', time: 'Custom Sizing', price: '$3,400', rating: '5.0 ★' },
          { name: 'Heritage Leather Travel Roll', place: 'Full-Grain Tuscan Calf', time: 'In Stock', price: '$380', rating: '4.9 ★' }
        ],
        pricing: [
          { tier: 'Atelier Collector', price: '$0', desc: 'VIP access to private release drops', perks: ['48-hour early access to new drops', 'Complimentary sizing & engraving', 'Invitations to seasonal preview galas'] },
          { tier: 'Vault Custody', price: '$290/yr', popular: true, desc: 'Insured storage & annual servicing', perks: ['Climate-controlled Swiss vault storage', 'Annual comprehensive movement overhaul', 'Complimentary replacement strap/year', '24/7 personal concierge access'] },
          { tier: 'Bespoke Commission', price: 'Custom Quote', desc: 'One-of-a-kind personalized creation', perks: ['Private consultation with master designer', 'Custom dial material & jewel selection', 'Unique 1-of-1 serial & documentation', 'Hand-delivered anywhere in the world'] }
        ],
        faq: [
          { q: 'How is authenticity verified?', a: 'Every timepiece includes an embedded NFC tag linking directly to a tamper-proof cryptographic certificate of origin.' },
          { q: 'What is your return and exchange policy?', a: 'We provide a 30-day complimentary return window with white-glove courier pickup.' }
        ]
      };
    },

    // 7. RESTAURANTS, CAFES & BAKERIES
    generateRestaurantCafeSite(prompt, name, agent) {
      return {
        domain: 'restaurant_cafe',
        name: name,
        tagline: 'Artisan Sourdough, Specialty Roasts & Farm-to-Table Dining',
        badge: '☕ Wood-Fired & Fresh Daily · Local Organic Harvest',
        icon: '☕',
        theme: {
          bg: '#080605',
          surface: 'rgba(22, 16, 14, 0.85)',
          border: 'rgba(249, 115, 22, 0.25)',
          accent: '#f97316',
          accentSecondary: '#fbbf24',
          text: '#ffffff',
          textMuted: '#a8a29e'
        },
        hero: {
          title: 'Artisanal Flavors Crafted Daily with Honest Local Ingredients.',
          sub: 'Slow-fermented wild sourdough, single-origin pour-overs, and seasonal chef tasting menus celebrating regional agriculture and timeless culinary tradition.',
          cta: '☕ Reserve a Table',
          ctaSecondary: '🥖 View Today’s Fresh Menu'
        },
        bentoFeatures: [
          { icon: '🌾', title: '36-Hour Wild Fermentation', desc: 'Naturally leavened sourdough bread baked every morning in our custom stone hearth oven.' },
          { icon: '☕', title: 'Direct-Trade Specialty Beans', desc: 'Ethically sourced microlots roasted weekly in-house for peak aroma and balanced sweetness.' },
          { icon: '🥗', title: '100% Local Organic Produce', desc: 'Partnered with regional family farms within 50 miles for vibrant seasonal dining.' },
          { icon: '🍷', title: 'Curated Natural Wine Cellar', desc: 'Low-intervention biodynamic wines and seasonal botanical craft cocktails.' }
        ],
        itemsCatalog: [
          { name: 'Wild Sourdough Country Loaf', place: 'Stoneground Heritage Wheat', time: 'Baked at 6:00 AM', price: '$9.50', rating: 'Signature' },
          { name: 'Cardamom Pistachio Morning Bun', place: 'Flaky Laminated Dough', time: 'Fresh Daily', price: '$5.75', rating: 'Best Seller' },
          { name: 'Single-Origin Ethiopian Pour-Over', place: 'Heirloom Yirgacheffe Notes', time: 'Brewed to Order', price: '$6.50', rating: 'Floral & Citrus' },
          { name: 'Truffle Burrata & Heirloom Salad', place: 'Local Organic Harvest', time: 'Dinner Menu', price: '$18.00', rating: 'Chef Special' }
        ],
        pricing: [
          { tier: 'Daily Guest', price: '$0', desc: 'Walk-in dining and counter service', perks: ['Open seating counter & patio', 'Online takeaway ordering', 'Loyalty bean points on every sip'] },
          { tier: 'Bread & Coffee Club', price: '$38/mo', popular: true, desc: 'Weekly bread loaf + bag of roasted beans', perks: ['2 fresh sourdough loaves/month', '1 12oz bag single-origin beans/month', 'Free specialty coffee on pickup days', '10% discount on all café orders'] },
          { tier: 'Chef Tasting Society', price: '$95/mo', desc: 'Monthly 5-course private tasting dinner', perks: ['Monthly private chef tasting seat', 'Natural wine pairing included', 'First access to seasonal masterclasses', 'Private event room booking privileges'] }
        ],
        faq: [
          { q: 'Do you offer gluten-free or vegan options?', a: 'Yes! We have a dedicated seasonal menu of vegan pastries, plant-based milks, and gluten-friendly dishes.' },
          { q: 'Can I place bulk orders for events?', a: 'Yes, our bakery catering team handles corporate breakfasts and celebrations with 48 hours notice.' }
        ]
      };
    },

    // 8. DELIVERY & LOGISTICS
    generateDeliverySite(prompt, name, agent) {
      return {
        domain: 'delivery_logistics',
        name: name,
        tagline: 'Hyper-Local Dispatch, Live Courier Radar & Last-Mile Logistics',
        badge: '🛵 18-Minute Average ETA · Real-Time GPS Tracking',
        icon: '🛵',
        theme: {
          bg: '#060a12',
          surface: 'rgba(14, 22, 38, 0.85)',
          border: 'rgba(56, 189, 248, 0.25)',
          accent: '#38bdf8',
          accentSecondary: '#34d399',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Lightning-Fast Local Delivery & Intelligent Dispatch Routing.',
          sub: 'Connecting neighborhood merchants and customers with sub-20 minute delivery, live GPS tracking, and predictable flat-rate dispatch.',
          cta: '🛵 Order Now & Track Live',
          ctaSecondary: '🏬 Partner Your Business'
        },
        bentoFeatures: [
          { icon: '⏱️', title: '18-Minute Average ETA', desc: 'Dedicated hyper-local couriers stationed right at commercial hubs for instant dispatch.' },
          { icon: '📍', title: 'Real-Time Courier Radar', desc: 'Watch your order travel on live radar from store counter to your doorstep.' },
          { icon: '💳', title: 'Zero Surge Fee Guarantee', desc: 'Predictable flat delivery pricing with no predatory fee spikes during peak hours.' },
          { icon: '🔒', title: 'Contactless Photo Drop', desc: 'Photo-verified delivery drop-offs with instant SMS alerts and thermal seal protection.' }
        ],
        itemsCatalog: [
          { name: 'Local Restaurant Express Drop', place: 'Under 3 Miles', time: '15-20 min', price: '$2.99', rating: '99.8% On Time' },
          { name: 'Pharmacy & Essentials Run', place: 'Priority Medical', time: '12-15 min', price: '$3.49', rating: 'Tamper Sealed' },
          { name: 'Multi-Store Bundle Pickup', place: '2 Stores In 1 Trip', time: '20-25 min', price: '$4.99', rating: 'Best Value' },
          { name: 'Heavy Freight Courier Drop', place: 'Up to 50 lbs', time: 'Same-Day', price: '$12.50', rating: 'Handled With Care' }
        ],
        pricing: [
          { tier: 'Single Drop', price: '$2.99', desc: 'Flat fee per individual delivery', perks: ['Live GPS tracking link', 'Contactless photo confirmation', 'Real-time SMS status updates'] },
          { tier: 'Unlimited Pass', price: '$9.99/mo', popular: true, desc: 'Zero delivery fees on all orders', perks: ['Unlimited free deliveries', 'Priority rush dispatch', '10% off partner merchant menus', 'Multi-store bundle included free'] },
          { tier: 'Merchant Fleet', price: '$49/mo', desc: 'For local restaurants & shops', perks: ['Dedicated store dispatch portal', 'Integrated POS webhooks', '8% flat merchant commission', 'Direct courier management'] }
        ],
        faq: [
          { q: 'What is the delivery radius?', a: 'We service all residential and business addresses within a 5-mile radius of the commercial center.' },
          { q: 'How does multi-store bundling work?', a: 'You can order from two neighboring shops in one checkout and receive both from a single unified courier.' }
        ]
      };
    },

    // 9. REAL ESTATE & LUXURY HOUSING
    generateRealEstateSite(prompt, name, agent) {
      return {
        domain: 'real_estate',
        name: name,
        tagline: 'Architectural Excellence & Luxury Urban Living',
        badge: '🏡 VIP Private Showings Active · 3D Interactive Floorplans',
        icon: '🏡',
        theme: {
          bg: '#07080b',
          surface: 'rgba(18, 20, 28, 0.85)',
          border: 'rgba(232, 200, 114, 0.25)',
          accent: '#e8c872',
          accentSecondary: '#f59e0b',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Discover Elevated Living in Premier Architectural Residences.',
          sub: 'Floor-to-ceiling panoramic skyline views, bespoke European finishes, private rooftop infinity pools, and 24/7 concierge service at your fingertips.',
          cta: '🏡 Schedule Private Tour',
          ctaSecondary: '📐 Explore 3D Floorplans'
        },
        bentoFeatures: [
          { icon: '🌆', title: 'Panoramic Skyline Views', desc: 'Expansive private terraces overlooking the heart of the city skyline.' },
          { icon: '🏊', title: 'Resort-Style Amenities', desc: 'Heated infinity rooftop pool, Finnish sauna, 24/7 wellness club, and pet spa.' },
          { icon: '🔑', title: 'Smart Keyless Access', desc: 'Smartphone and biometric entry with encrypted guest pass provisioning.' },
          { icon: '🚗', title: 'Private Valet & EV Charging', desc: 'Underground climate-controlled parking with high-speed DC charging stalls.' }
        ],
        itemsCatalog: [
          { name: '1 Bedroom Designer Suite', place: 'Level 14 · City Views', time: '820 sq ft', price: '$2,150/mo', rating: 'Available Now' },
          { name: '2 Bedroom Corner Terrace', place: 'Level 22 · Sunset Horizon', time: '1,350 sq ft', price: '$3,200/mo', rating: 'Popular' },
          { name: '3 Bedroom Penthouse Collection', place: 'Level 35 · Private Elevator', time: '2,400 sq ft', price: '$5,800/mo', rating: 'VIP Floor' },
          { name: 'Ground Floor Commercial Studio', place: 'High Foot Traffic Plaza', time: '1,800 sq ft', price: '$4,200/mo', rating: 'Retail Ready' }
        ],
        pricing: [
          { tier: 'Standard Lease', price: '$2,150/mo', desc: '12-month lease with all amenities', perks: ['24/7 fitness & pool access', 'High-speed gigabit fiber internet', 'Smart building app integration', 'Complimentary package concierge'] },
          { tier: 'Executive Suite', price: '$3,200/mo', popular: true, desc: 'Furnished corner residence', perks: ['Designer Italian furniture package', 'Dedicated covered parking space', 'Weekly housekeeping option', 'Priority rooftop lounge booking'] },
          { tier: 'Penthouse Ownership', price: '$1.45M', desc: 'Fee-simple luxury condominium', perks: ['Private deeded elevator access', 'Sub-Zero & Wolf appliance suite', '2 private parking stalls included', 'Lifetime homeowners concierge'] }
        ],
        faq: [
          { q: 'Are pets allowed in the building?', a: 'Yes! We are proud to be fully pet-friendly with an on-site grooming spa and private dog park.' },
          { q: 'What utilities are included?', a: 'Water, sewer, gas, trash removal, and high-speed gigabit internet are included in the monthly amenity fee.' }
        ]
      };
    },

    // 10. HEALTHCARE & WELLNESS
    generateHealthcareSite(prompt, name, agent) {
      return {
        domain: 'healthcare_medical',
        name: name,
        tagline: 'Modern Integrative Medicine, Longevity & Telehealth',
        badge: '🩺 Board-Certified Physicians · Same-Day Telehealth',
        icon: '🩺',
        theme: {
          bg: '#050a0e',
          surface: 'rgba(12, 24, 34, 0.85)',
          border: 'rgba(14, 165, 233, 0.25)',
          accent: '#0ea5e9',
          accentSecondary: '#34d399',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Empowering Your Health with Precision & Compassionate Care.',
          sub: 'Comprehensive preventive medicine, advanced biomarker testing, and seamless virtual consultations with leading board-certified specialists.',
          cta: '🩺 Book Appointment',
          ctaSecondary: '🧬 View Health Programs'
        },
        bentoFeatures: [
          { icon: '🧬', title: 'Advanced Biomarker Diagnostics', desc: 'Comprehensive metabolic, genetic, and cardiovascular blood panels with personalized action plans.' },
          { icon: '📱', title: '24/7 Virtual Telehealth', desc: 'Direct encrypted video consultations and messaging with your personal physician.' },
          { icon: '💊', title: 'Personalized Longevity Protocol', desc: 'Evidence-based nutrition, sleep optimization, and supplementation tailored to your cellular data.' },
          { icon: '🛡️', title: '100% HIPAA-Compliant Privacy', desc: 'Military-grade encryption protecting your medical history and test records.' }
        ],
        itemsCatalog: [
          { name: 'Comprehensive Health Biomarker Panel', place: 'Full Lab Diagnostic', time: '45 min', price: '$249', rating: '60+ Markers' },
          { name: 'Same-Day Virtual Telehealth Visit', place: 'Encrypted HD Video', time: '20 min', price: '$75', rating: 'Immediate' },
          { name: 'Metabolic & Longevity Consultation', place: 'Physician Review', time: '60 min', price: '$190', rating: 'Custom Plan' },
          { name: 'IV Nutrient & Hydration Therapy', place: 'In-Clinic Lounge', time: '30 min', price: '$135', rating: 'Physician Formulated' }
        ],
        pricing: [
          { tier: 'Pay As You Go', price: '$75/visit', desc: 'Direct per-consultation pricing', perks: ['Same-day appointment availability', 'Digital prescription routing', 'Lab order requisition', 'Post-visit summary notes'] },
          { tier: 'Membership Health', price: '$99/mo', popular: true, desc: 'Complete proactive wellness partnership', perks: ['Unlimited virtual primary care visits', 'Annual comprehensive biomarker panel', 'Direct messaging with doctor', '20% discount on specialty therapies'] },
          { tier: 'Executive Longevity', price: '$350/mo', desc: 'High-touch concierge medical team', perks: ['Dedicated personal physician & dietitian', 'Quarterly advanced blood & hormone panels', 'Wearable continuous health monitoring', 'Home visit options & priority 24/7 access'] }
        ],
        faq: [
          { q: 'Do you accept major health insurance?', a: 'We accept all major PPO insurance plans for lab tests and clinic visits, with transparent upfront pricing for direct-pay patients.' },
          { q: 'How quickly can I see a doctor?', a: 'Telehealth appointments are typically available within 15 minutes, 7 days a week.' }
        ]
      };
    },

    // 11. FITNESS & ATHLETICS
    generateFitnessSite(prompt, name, agent) {
      return {
        domain: 'fitness_athletics',
        name: name,
        tagline: 'High-Performance Athletic Club, Strength & Recovery',
        badge: '💪 Elite Coaching · 24/7 Facility Access',
        icon: '💪',
        theme: {
          bg: '#080507',
          surface: 'rgba(22, 14, 18, 0.85)',
          border: 'rgba(244, 63, 94, 0.25)',
          accent: '#f43f5e',
          accentSecondary: '#fbbf24',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },

    // 12. ACTION SPORTS, SKATEBOARDING & STREET CULTURE
    generateActionSportsSite(prompt, name, agent) {
      const p = prompt.toLowerCase();
      const isSkate = p.includes('skate') || p.includes('board');
      const brand = isSkate ? (name.includes('Skate') ? name : (name + ' Skate Co.')) : (name + ' Athletics');

      return {
        domain: 'action_sports_skate',
        name: brand,
        tagline: isSkate ? 'Uncompromising Street Skateboarding Decks, Completes & Apparel' : 'High-Performance Athletics & Action Sports Equipment',
        badge: isSkate ? '🛹 100% Hard Rock Canadian Maple' : '⚡ Pro-Grade Performance Gear',
        icon: isSkate ? '🛹' : '⚡',
        theme: {
          bg: '#07090e',
          surface: '#10141f',
          border: 'rgba(244, 63, 94, 0.3)',
          accent: '#f43f5e',
          accentSecondary: '#fbbf24',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: isSkate ? 'Built for the Streets. Unbreakable Pop & Pure Precision.' : 'Engineered for High-Velocity Action & Unmatched Durability.',
          sub: isSkate 
            ? 'Cold-pressed 7-ply Canadian hard rock maple decks, hollow titanium trucks, conical street urethane, and limited-edition underground artist graphics.'
            : 'Pro-tested athletic and extreme action sports equipment built to withstand maximum impact with zero compromises.',
          cta: isSkate ? '🛹 Shop Decks & Completes' : '⚡ Explore Gear Lineup',
          ctaSecondary: isSkate ? '🎬 Watch Team Street Video' : '📖 View Technical Specs'
        },
        bentoFeatures: [
          { icon: '🛹', title: 'Cold-Pressed Epoxy 7-Ply', desc: 'Precision hydraulic pressed Canadian hard rock maple for long-lasting pop and snap.' },
          { icon: '⚙️', title: 'Hollow Titanium Trucks', desc: '40% lighter hollow kingpins and axles with aircraft-grade aluminum hangers.' },
          { icon: '🌀', title: '101A Conical Street Wheels', desc: 'Anti-flatspot urethane formula engineered for smooth street ledges, stairs, and bowls.' },
          { icon: '🎨', title: 'Underground Artist Drops', desc: 'Limited edition screenprinted graphic runs in collaboration with street artists.' }
        ],
        itemsCatalog: [
          { name: brand + ' Pro 8.25" Street Deck', place: 'Hard Maple', time: 'In Stock', price: '$65.00', rating: '5.0 ★' },
          { name: brand + ' Titanium Hollow Trucks (Pair)', place: 'Lightweight', time: 'In Stock', price: '$58.00', rating: 'Team Pick' },
          { name: '54mm 101A Conical Street Wheels', place: 'Street Urethane', time: 'In Stock', price: '$38.00', rating: 'Best Seller' },
          { name: 'Ceramic Swiss High-Speed Bearings', place: 'Low Friction', time: 'In Stock', price: '$45.00', rating: '5.0 ★' }
        ],
        pricing: [
          { tier: 'Street Setup', price: '$129', desc: 'Complete custom setup ready to skate out of the box', perks: ['7-Ply Hard Rock Maple Deck', 'Hollow Kingpin Trucks', '52mm 99A Street Wheels', 'ABEC-7 Speed Bearings', 'Free Pro Grip Tape Applied'] },
          { tier: 'Pro Grade Complete', price: '$189', popular: true, desc: 'Team-tested professional competition spec', perks: ['Signature Series Deck', 'Titanium Hollow Axle Trucks', '54mm Conical Wheels', 'Swiss Ceramic Bearings', 'Skate T-Tool & Spare Bushings'] },
          { tier: 'Atelier Collector Edition', price: '$269', desc: 'Hand-screenprinted limited edition artist run', perks: ['Custom Numbered Deck (1 of 100)', 'Signed Certificate of Authenticity', 'Matching Graphic Streetwear Tee', 'Wood Wall Display Mount Included', 'Lifetime Snap Guarantee'] }
        ],
        faq: [
          { q: 'What deck width should I pick for street skating?', a: '8.0" to 8.25" is the gold standard for technical street flip tricks. For transition, pools, or cruising, 8.38" to 8.75" provides extra stability.' },
          { q: 'Do completes come pre-assembled with grip tape?', a: 'Yes! Every complete is assembled by hand by skaters, gripped with bubble-free perforated grip tape, and tuned ready to roll.' },
          { q: 'What is your warranty on snapped boards?', a: 'All decks are covered against manufacturer delamination and structural defects with easy replacement.' }
        ]
      };
    },
        hero: {
          title: 'Unleash Your Full Athletic Potential with World-Class Training.',
          sub: 'State-of-the-art strength equipment, expert Olympic coaching, functional HIIT classes, and contrast therapy recovery suites.',
          cta: '💪 Claim Free 7-Day Pass',
          ctaSecondary: '📅 View Class Schedule'
        },
        bentoFeatures: [
          { icon: '🏋️', title: 'Elite Strength & Conditioning', desc: 'Eleiko calibrated plates, custom power racks, and Olympic lifting platforms.' },
          { icon: '🔥', title: 'High-Intensity Group HIIT', desc: 'Heart-rate tracked group sessions engineered to torch calories and build lean muscle.' },
          { icon: '🧊', title: 'Contrast Recovery Suites', desc: 'Cold plunge tubs, infrared saunas, and pneumatic compression boots for accelerated recovery.' },
          { icon: '📈', title: 'Body Composition Scans', desc: 'Monthly InBody 3D body scans and nutritional guidance to track real physiological progress.' }
        ],
        itemsCatalog: [
          { name: '1-on-1 Personal Training Session', place: 'Certified Master Coach', time: '60 min', price: '$85.00', rating: 'Custom Plan' },
          { name: 'Contrast Therapy Recovery Pass', place: 'Cold Plunge + Sauna', time: '45 min', price: '$35.00', rating: 'Post-Workout' },
          { name: 'Metabolic InBody 3D Scan', place: 'Body Composition Lab', time: '15 min', price: '$25.00', rating: 'Full Report' },
          { name: 'Custom Nutrition Meal Strategy', place: 'Sports Dietitian Review', time: 'Consultation', price: '$95.00', rating: 'Macro Targets' }
        ],
        pricing: [
          { tier: 'Standard Access', price: '$69/mo', desc: '24/7 gym & open floor access', perks: ['24/7 facility access with smart card', 'Full locker room & towel service', 'Initial fitness assessment & goal session', 'Member mobile tracking app'] },
          { tier: 'All-Inclusive Pro', price: '$129/mo', popular: true, desc: 'Unlimited classes + recovery access', perks: ['Unlimited group fitness & HIIT classes', 'Full access to cold plunge & sauna suites', 'Monthly 3D body composition scan', '2 guest passes per month'] },
          { tier: 'Elite Coaching Club', price: '$299/mo', desc: 'Dedicated personal coaching package', perks: ['4 private 1-on-1 personal training sessions/mo', 'Custom nutrition & macro coaching', 'Unlimited classes & recovery suites', 'Complimentary workout gear package'] }
        ],
        faq: [
          { q: 'Is there a long-term contract?', a: 'No, all memberships are month-to-month with flexible cancellation options.' },
          { q: 'Are classes suitable for beginners?', a: 'Yes! Our coaches provide scale options for every fitness level from beginner to competitive athlete.' }
        ]
      };
    },

    // 12B. ACTION SPORTS, SKATEBOARDING & STREET CULTURE
    generateActionSportsSite(prompt, name, agent) {
      const p = prompt.toLowerCase();
      const isSkate = p.includes('skate') || p.includes('board') || p.includes('dope');
      const brand = isSkate ? (name.includes('Skate') ? name : (name + ' Skate Co.')) : (name + ' Athletics');

      return {
        domain: 'action_sports_skate',
        name: brand,
        tagline: isSkate ? 'Uncompromising Street Skateboarding Decks, Completes & Streetwear' : 'High-Performance Athletics & Action Sports Equipment',
        badge: isSkate ? '🛹 100% Hard Rock Canadian Maple · Pro Spec' : '⚡ Pro-Grade Performance Gear',
        icon: isSkate ? '🛹' : '⚡',
        theme: {
          bg: '#07090e',
          surface: 'rgba(16, 20, 31, 0.9)',
          border: 'rgba(244, 63, 94, 0.3)',
          accent: '#f43f5e',
          accentSecondary: '#fbbf24',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: isSkate ? 'Built for the Streets. Unbreakable Pop & Pure Precision.' : 'Engineered for High-Velocity Action & Unmatched Durability.',
          sub: isSkate 
            ? 'Cold-pressed 7-ply Canadian hard rock maple decks, hollow titanium trucks, 101A conical street urethane, and limited-edition underground artist drops.'
            : 'Pro-tested athletic and extreme action sports equipment built to withstand maximum impact with zero compromises.',
          cta: isSkate ? '🛹 Shop Decks & Completes' : '⚡ Explore Gear Lineup',
          ctaSecondary: isSkate ? '🎬 Watch Team Street Video' : '📖 View Technical Specs'
        },
        bentoFeatures: [
          { icon: '🛹', title: 'Cold-Pressed Epoxy 7-Ply', desc: 'Precision hydraulic pressed Canadian hard rock maple for long-lasting pop, snap, and stiffness.' },
          { icon: '⚙️', title: 'Hollow Titanium Trucks', desc: '40% lighter hollow kingpins and axles with aircraft-grade aluminum alloy hangers.' },
          { icon: '🌀', title: '101A Conical Street Wheels', desc: 'Anti-flatspot street urethane formula engineered for high-speed ledges, stairs, and concrete parks.' },
          { icon: '🎨', title: 'Underground Artist Drops', desc: 'Limited edition screenprinted graphic runs in collaboration with underground street artists.' }
        ],
        itemsCatalog: [
          { name: brand + ' Pro 8.25" Street Deck', place: 'Hard Maple', time: 'In Stock', price: '$65.00', rating: '5.0 ★' },
          { name: brand + ' Titanium Hollow Trucks (Pair)', place: 'Lightweight', time: 'In Stock', price: '$58.00', rating: 'Team Pick' },
          { name: '54mm 101A Conical Street Wheels', place: 'Street Urethane', time: 'In Stock', price: '$38.00', rating: 'Best Seller' },
          { name: 'Ceramic Swiss High-Speed Bearings', place: 'Low Friction', time: 'In Stock', price: '$45.00', rating: '5.0 ★' }
        ],
        pricing: [
          { tier: 'Street Setup', price: '$129', desc: 'Complete custom setup ready to skate out of the box', perks: ['7-Ply Hard Rock Maple Deck', 'Hollow Kingpin Trucks', '52mm 99A Street Wheels', 'ABEC-7 Speed Bearings', 'Free Pro Grip Tape Applied'] },
          { tier: 'Pro Grade Complete', price: '$189', popular: true, desc: 'Team-tested professional competition spec', perks: ['Signature Series Deck', 'Titanium Hollow Axle Trucks', '54mm Conical Wheels', 'Swiss Ceramic Bearings', 'Skate T-Tool & Spare Bushings'] },
          { tier: 'Atelier Collector Edition', price: '$269', desc: 'Hand-screenprinted limited edition artist run', perks: ['Custom Numbered Deck (1 of 100)', 'Signed Certificate of Authenticity', 'Matching Graphic Streetwear Tee', 'Wood Wall Display Mount Included', 'Lifetime Snap Guarantee'] }
        ],
        faq: [
          { q: 'What deck width should I pick for street skating?', a: '8.0" to 8.25" is the gold standard for technical street flip tricks. For transition, pools, or cruising, 8.38" to 8.75" provides extra stability.' },
          { q: 'Do completes come pre-assembled with grip tape?', a: 'Yes! Every complete is assembled by hand by skaters, gripped with bubble-free perforated grip tape, and tuned ready to roll.' },
          { q: 'What is your warranty on snapped boards?', a: 'All decks are covered against manufacturer delamination and structural defects with easy replacement.' }
        ]
      };
    },

    // 12. EDUCATION & EDTECH
    generateEducationSite(prompt, name, agent) {
      return {
        domain: 'education_edtech',
        name: name,
        tagline: 'Interactive Bootcamps, Masterclasses & Skill Mastery',
        badge: '🎓 Project-Based Curriculum · Industry Mentor Reviews',
        icon: '🎓',
        theme: {
          bg: '#050711',
          surface: 'rgba(12, 18, 36, 0.85)',
          border: 'rgba(99, 102, 241, 0.25)',
          accent: '#6366f1',
          accentSecondary: '#00f0ff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Master High-Income Skills Through Hands-On Real-World Projects.',
          sub: 'Interactive coding sandboxes, expert mentor code reviews, and structured career pathways designed to land top-tier technology roles.',
          cta: '🎓 Start Learning for Free',
          ctaSecondary: '📚 Browse Full Curriculum'
        },
        bentoFeatures: [
          { icon: '💻', title: 'In-Browser Interactive Labs', desc: 'Write, debug, and execute code directly in your browser with instant automated feedback.' },
          { icon: '👥', title: '1-on-1 Senior Mentor Reviews', desc: 'Get line-by-line feedback on your GitHub pull requests from working industry engineers.' },
          { icon: '🚀', title: 'Real Production Portfolios', desc: 'Build 8+ production-ready fullstack applications that hiring managers actually respect.' },
          { icon: '📜', title: 'Verifiable On-Chain Credentials', desc: 'Cryptographically signed certificates showcasing your verified project completions.' }
        ],
        itemsCatalog: [
          { name: 'Fullstack AI Engineering Bootcamp', place: '12 Weeks · 8 Projects', time: 'Part-Time', price: '$890', rating: 'Top Rated' },
          { name: 'Autonomous Agent Architecture', place: '4 Weeks Intensive', time: 'Self-Paced', price: '$290', rating: 'Advanced' },
          { name: '1-on-1 Code Review & Portfolio Prep', place: 'Senior Staff Engineer', time: '60 min', price: '$95', rating: 'Live Video' },
          { name: 'System Design Interview Sprint', place: 'Distributed Systems', time: '2 Weeks', price: '$190', rating: 'FAANG Ready' }
        ],
        pricing: [
          { tier: 'Community Access', price: '$0', desc: 'Free access to introductory modules', perks: ['Access to 10+ starter courses', 'Community Discord discussion channels', 'Standard sandbox code runner'] },
          { tier: 'Academy Pro', price: '$29/mo', popular: true, desc: 'Unlimited access to all courses & labs', perks: ['Unlimited access to 50+ masterclasses', 'Interactive coding playgrounds & quizzes', 'Automated homework grading & solutions', 'Private alumni job board access'] },
          { tier: 'Mentorship Bootcamp', price: '$890', desc: 'Complete 12-week career accelerator', perks: ['Weekly 1-on-1 mentor code reviews', 'Custom capstone project development', 'Resume & portfolio overhaul', 'Guaranteed interview referrals'] }
        ],
        faq: [
          { q: 'Do I need prior experience?', a: 'We offer specialized pathways ranging from complete beginners to advanced senior engineers.' },
          { q: 'Is the schedule flexible?', a: 'Yes, all modules and recorded lectures are self-paced with weekly live office hours.' }
        ]
      };
    },

    // 13. LEGAL & IP
    generateLegalSite(prompt, name, agent) {
      return {
        domain: 'legal_ip',
        name: name,
        tagline: 'Strategic Intellectual Property, Corporate Law & Litigation',
        badge: '⚖️ AV-Preeminent Rated · Over $500M in Transactions',
        icon: '⚖️',
        theme: {
          bg: '#070709',
          surface: 'rgba(18, 18, 24, 0.85)',
          border: 'rgba(232, 200, 114, 0.25)',
          accent: '#e8c872',
          accentSecondary: '#ffffff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Protecting Your Innovation with Fierce Legal Precision.',
          sub: 'Comprehensive patent prosecution, venture capital financing, cross-border intellectual property protection, and high-stakes commercial litigation.',
          cta: '⚖️ Request Confidential Consultation',
          ctaSecondary: '📖 Explore Practice Areas'
        },
        bentoFeatures: [
          { icon: '📜', title: 'Global Patent Prosecution', desc: 'Securing defensive patent portfolios and utility claims across USPTO, EPO, and WIPO.' },
          { icon: '💼', title: 'Venture & Corporate Formation', desc: 'Safeguarding founders through Series A-D financing rounds, SAFE notes, and M&A structuring.' },
          { icon: '🛡️', title: 'Trade Secret & IP Defense', desc: 'Aggressive enforcement against non-compete violations, copyright theft, and patent infringement.' },
          { icon: '⚖️', title: 'Commercial Trial Advocacy', desc: 'Proven courtroom trial record with multi-million dollar defense and plaintiff verdicts.' }
        ],
        itemsCatalog: [
          { name: 'Provisional Patent Application Filing', place: 'USPTO Registered Spec', time: '1-2 Weeks', price: '$2,500', rating: 'Full Draft' },
          { name: 'Delaware C-Corp Founder Formation', place: 'Incorporation & Stock', time: '48 Hours', price: '$1,200', rating: 'Turnkey' },
          { name: 'Comprehensive IP Trademark Search', place: 'Federal & State Audit', time: '3-5 Days', price: '$650', rating: 'Clearance' },
          { name: 'Commercial Contract & NDA Review', place: 'Partner Level Review', time: '24 Hours', price: '$450', rating: 'Fast Turn' }
        ],
        pricing: [
          { tier: 'Strategic Review', price: '$450', desc: '1-hour partner consultation & audit', perks: ['Full confidential case assessment', 'Risk exposure analysis', 'Clear written legal recommendation'] },
          { tier: 'Startup Legal Retainer', price: '$1,800/mo', popular: true, desc: 'Dedicated outside general counsel', perks: ['Up to 8 hours legal counsel monthly', 'Unlimited contract & NDA reviews', 'Board meeting representation', 'Cap table & equity governance'] },
          { tier: 'Full Patent Filing', price: '$5,500', desc: 'Non-provisional patent prosecution', perks: ['Complete technical patent specification', 'Formal engineering drawings & claims', 'Filing with USPTO & docketing', 'Response to first office action'] }
        ],
        faq: [
          { q: 'Is our initial consultation confidential?', a: 'Yes, all communications are strictly protected by attorney-client privilege.' },
          { q: 'Do you offer fixed-fee arrangements?', a: 'Yes, we provide transparent flat-rate pricing for formations, patent filings, and contract drafting.' }
        ]
      };
    },

    // 14. FINANCE & WEALTH MANAGEMENT
    generateFinanceSite(prompt, name, agent) {
      return {
        domain: 'finance_wealth',
        name: name,
        tagline: 'Fiduciary Wealth Management, Tax Optimization & Growth',
        badge: '📈 Fee-Only Fiduciary · $1.2B Assets Under Management',
        icon: '📈',
        theme: {
          bg: '#050907',
          surface: 'rgba(12, 22, 16, 0.85)',
          border: 'rgba(52, 211, 153, 0.25)',
          accent: '#34d399',
          accentSecondary: '#e8c872',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Preserving & Multiplying Generational Wealth with Integrity.',
          sub: 'Independent fiduciary financial planning, bespoke multi-asset investment portfolios, tax-loss harvesting, and comprehensive estate structuring.',
          cta: '📈 Schedule Discovery Call',
          ctaSecondary: '📊 View Investment Philosophy'
        },
        bentoFeatures: [
          { icon: '🛡️', title: '100% Fee-Only Fiduciary', desc: 'Zero commissions, zero hidden markups. We are legally and ethically bound to act solely in your interest.' },
          { icon: '📊', title: 'Quantitative Portfolio Allocation', desc: 'Diversified global portfolios optimizing risk-adjusted returns through evidence-based factor investing.' },
          { icon: '💰', title: 'Strategic Tax Optimization', desc: 'Proactive annual tax-loss harvesting, Roth conversions, and tax-efficient charitable giving strategies.' },
          { icon: '🏛️', title: 'Estate & Trust Governance', desc: 'Protecting your legacy with structured family trusts, wills, and generational succession plans.' }
        ],
        itemsCatalog: [
          { name: 'Comprehensive Financial Blueprint', place: 'Holistic Wealth Review', time: '2 Weeks', price: '$1,500', rating: 'Full Audit' },
          { name: 'Custom Investment Portfolio Strategy', place: 'Multi-Asset Model', time: '1 Week', price: '0.65% AUM', rating: 'Fiduciary' },
          { name: 'Tax-Loss Harvesting Audit', place: 'Tax Efficiency Review', time: '3 Days', price: '$490', rating: 'Save Taxes' },
          { name: 'Executive Stock Option Plan', place: 'RSU & ISO Strategy', time: '1 Week', price: '$850', rating: 'Equity Plan' }
        ],
        pricing: [
          { tier: 'Financial Planning', price: '$2,500', desc: 'One-time comprehensive roadmap', perks: ['Complete net worth & cash flow audit', 'Retirement milestone simulations', 'Insurance & estate gap analysis', '1-year implementation support'] },
          { tier: 'Wealth Management', price: '0.75% AUM', popular: true, desc: 'Continuous active portfolio management', perks: ['Automated daily tax-loss harvesting', 'Quarterly rebalancing & reviews', 'Direct access to your dedicated advisor', 'Tax preparation & filing included'] },
          { tier: 'Family Office', price: '0.50% AUM', desc: 'For accounts above $5M in assets', perks: ['Multi-generational wealth structuring', 'Private equity & real estate syndication', 'Dedicated CPA & trust attorney team', 'Bespoke philanthropic foundation setup'] }
        ],
        faq: [
          { q: 'What does fee-only fiduciary mean?', a: 'It means we never accept kickbacks, referral commissions, or third-party product incentives. We work exclusively for you.' },
          { q: 'Where are client funds held?', a: 'All client assets are safely held at top independent custodians like Charles Schwab and Fidelity.' }
        ]
      };
    },

    // 15. LOCAL SERVICES (PLUMBING, ELECTRICAL, LAWN)
    generateLocalServiceSite(prompt, name, agent) {
      return {
        domain: 'local_services',
        name: name,
        tagline: 'Licensed, Bonded & Insured Craftsmen in Your Neighborhood',
        badge: '⚡ Same-Day Service Guarantee · 100% Upfront Pricing',
        icon: '⚡',
        theme: {
          bg: '#060a0f',
          surface: 'rgba(14, 24, 38, 0.85)',
          border: 'rgba(56, 189, 248, 0.25)',
          accent: '#38bdf8',
          accentSecondary: '#34d399',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Precision Workmanship Done Right the First Time.',
          sub: 'Transparent flat-rate pricing, 5-star background-checked technicians, and a 100% satisfaction guarantee. Book online in 60 seconds.',
          cta: '⚡ Get Instant Estimate',
          ctaSecondary: '📞 Call Dispatch Line'
        },
        bentoFeatures: [
          { icon: '🛡️', title: 'Fully Licensed & Insured', desc: '$2M liability insurance and background-checked technicians for total peace of mind.' },
          { icon: '⏱️', title: '60-Minute Arrival Window', desc: 'Live on-the-way GPS tracking so you never sit waiting around all day.' },
          { icon: '💰', title: 'Upfront Flat-Rate Quotes', desc: 'Exact price before work begins. Zero hidden travel surcharges or surprise fees.' },
          { icon: '⭐', title: '500+ Verified 5-Star Reviews', desc: 'Voted #1 neighborhood service team with a 99.4% first-visit resolution rate.' }
        ],
        itemsCatalog: [
          { name: 'Diagnostic & Comprehensive Inspection', place: 'On-Site Evaluation', time: '30 min', price: '$49.00', rating: 'Applies to Job' },
          { name: 'Standard Emergency Repair', place: 'Immediate Service', time: '1-2 Hours', price: '$180.00', rating: 'Guaranteed' },
          { name: 'Full System Maintenance Tune-Up', place: '24-Point Checklist', time: '60 min', price: '$89.00', rating: 'Prolongs Life' },
          { name: 'Complete Installation & Warranty', place: 'New System Install', time: 'Same-Day', price: '$850.00', rating: '5-Yr Warranty' }
        ],
        pricing: [
          { tier: 'Single Service Visit', price: '$89', desc: 'Standard diagnostic & service call', perks: ['Complete system diagnostic inspection', 'Exact upfront written quote', 'Same-day repair capability', '1-year labor warranty'] },
          { tier: 'Annual Home Care Pass', price: '$189/yr', popular: true, desc: 'Total peace-of-mind protection', perks: ['2 comprehensive seasonal tune-ups/yr', '15% discount on all repairs & parts', 'Zero dispatch diagnostic fees', 'Priority same-day emergency queue'] },
          { tier: 'Commercial Property', price: '$499/mo', desc: 'Dedicated facilities maintenance', perks: ['Monthly comprehensive multi-unit check', '24/7 dedicated account manager', 'Guaranteed 2-hour response window', 'Detailed monthly compliance logging'] }
        ],
        faq: [
          { q: 'Are your technicians licensed and drug tested?', a: 'Yes, 100% of our staff undergoes annual background checks, drug screenings, and state certification.' },
          { q: 'What happens if a repair fails?', a: 'We back all repairs with our 100% Money-Back Satisfaction Guarantee and a 1-year parts/labor warranty.' }
        ]
      };
    },

    // 16. AUTOMOTIVE & EV
    generateAutomotiveSite(prompt, name, agent) {
      return {
        domain: 'automotive_ev',
        name: name,
        tagline: 'High-Speed EV Charging, Precision Detailing & Performance',
        badge: '🚗 Ultra-Fast 350kW DC Stalls · Master Ceramic Certified',
        icon: '🚗',
        theme: {
          bg: '#05070a',
          surface: 'rgba(14, 20, 28, 0.85)',
          border: 'rgba(0, 240, 255, 0.25)',
          accent: '#00f0ff',
          accentSecondary: '#e8c872',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Elevate Your Driving Experience with Next-Gen Automotive Care.',
          sub: 'Ultra-fast 350kW EV charging hubs, master ceramic paint protection, precision mechanical diagnostics, and luxury concierge detailing.',
          cta: '🚗 Book Service Slot',
          ctaSecondary: '⚡ Find Nearest EV Stall'
        },
        bentoFeatures: [
          { icon: '⚡', title: '350kW Ultra-Fast EV Stalls', desc: 'Charge from 10% to 80% in under 15 minutes with 100% renewable solar-backed power.' },
          { icon: '💎', title: '9H Multi-Layer Ceramic Coating', desc: 'Military-grade hydrophobic paint protection resisting swirl marks, UV rays, and road salt.' },
          { icon: '🔧', title: 'Certified Master Technicians', desc: 'Specialized tooling for Tesla, Porsche, BMW, Audi, and exotic hypercars.' },
          { icon: '🛋️', title: 'VIP Lounge & Workstations', desc: 'Enjoy high-speed Wi-Fi, artisan espresso, and private meeting pods while your car is serviced.' }
        ],
        itemsCatalog: [
          { name: 'Ultra-Fast 350kW EV Session', place: 'Plug & Charge Stalls', time: '15 min', price: '$0.32/kWh', rating: '100% Green' },
          { name: 'Full Signature Paint Correction', place: '2-Stage Machine Polish', time: '1 Day', price: '$450', rating: 'Flawless' },
          { name: '9H Ceramic Shield Package', place: '5-Year Warranty', time: '2 Days', price: '$950', rating: 'Self-Healing' },
          { name: 'Precision Wheel Alignment & Check', place: 'Laser 3D System', time: '45 min', price: '$120', rating: 'Exact Spec' }
        ],
        pricing: [
          { tier: 'Pay-Per-Charge', price: '$0.32/kWh', desc: 'Standard ultra-fast charging access', perks: ['Access to all 350kW DC fast stalls', 'Automated Plug & Charge billing', 'Complimentary windshield wash & air'] },
          { tier: 'Unlimited EV Club', price: '$39/mo', popular: true, desc: 'Discounted charging + monthly wash', perks: ['20% discount on all kWh charging', '2 exterior hand washes per month', 'Complimentary espresso lounge access', 'Priority stall reservations via app'] },
          { tier: 'Concierge Fleet Care', price: '$199/mo', desc: 'Complete monthly maintenance & detailing', perks: ['Bi-weekly full interior/exterior detail', 'Free unlimited charging sessions', 'Annual ceramic booster application', 'Valet pickup & return service'] }
        ],
        faq: [
          { q: 'Which EV connectors are supported?', a: 'All stalls support NACS (Tesla), CCS1, and CHAdeMO with universal adapters available on site.' }
        ]
      };
    },

    // 17. MUSIC & AUDIO PRODUCTION
    generateMusicSite(prompt, name, agent) {
      return {
        domain: 'music_audio',
        name: name,
        tagline: 'World-Class Recording Studios, Dolby Atmos & Mastering',
        badge: '🎧 SSL Duality Console · Dolby Atmos 7.1.4 Certified',
        icon: '🎧',
        theme: {
          bg: '#07050d',
          surface: 'rgba(20, 14, 34, 0.85)',
          border: 'rgba(168, 85, 247, 0.25)',
          accent: '#a855f7',
          accentSecondary: '#00f0ff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Capture Pure Sonic Perfection in World-Class Acoustic Spaces.',
          sub: 'Legendary analog outboard gear, Dolby Atmos 7.1.4 spatial mixing suites, vintage microphones, and Grammy-winning recording engineers.',
          cta: '🎧 Book Studio Session',
          ctaSecondary: '🎵 Listen to Selected Masters'
        },
        bentoFeatures: [
          { icon: '🎛️', title: 'SSL & Neve Analog Consoles', desc: 'Pristine analog warmth with vintage Teletronix LA-2A, Pultec EQs, and 1176 compressors.' },
          { icon: '🔊', title: 'Dolby Atmos 7.1.4 Spatial Suite', desc: 'Immersive 3D audio mixing calibrated with Genelec SAM smart active studio monitors.' },
          { icon: '🎙️', title: 'Vintage Microphone Locker', desc: 'Neumann U47, U87, Sony C800G, and Coles 4038 ribbon microphones in pristine condition.' },
          { icon: '🎹', title: 'Live Room & Grand Piano', desc: 'Floating-floor live room with a Steinway Model D concert grand and Hammond B3 organ.' }
        ],
        itemsCatalog: [
          { name: 'Studio A Full Day Recording (10h)', place: 'SSL Console + Engineer', time: '10 Hours', price: '$850', rating: 'Flagship' },
          { name: 'Dolby Atmos Spatial Mix (Per Track)', place: '7.1.4 Master Stem Suite', time: '3-4 Days', price: '$450', rating: 'Apple Music Spec' },
          { name: 'Analog Stereo Mastering', place: 'Pultec + Manley Chain', time: '48 Hours', price: '$120', rating: 'Radio Ready' },
          { name: 'Vocal Production & Tuning Session', place: 'Melodyne & Auto-Tune', time: '2 Hours', price: '$200', rating: 'Pristine' }
        ],
        pricing: [
          { tier: 'Single Track Master', price: '$120', desc: 'Analog mastering for digital streaming', perks: ['Analog hardware mastering chain', 'DDP and high-res 24-bit/96kHz WAVs', '2 revision passes included', 'Apple Digital Masters certified'] },
          { tier: 'EP Production Package', price: '$1,800', popular: true, desc: 'Complete 4-track recording & mixing', perks: ['2 full days in Studio A with engineer', 'Full multi-track mixing & tuning', 'Analog stereo mastering included', 'Dolby Atmos spatial mix upgrade option'] },
          { tier: 'Full Album Producer', price: '$4,500', desc: 'Turnkey 10-track album creation', perks: ['5 full studio recording days', 'Executive mixing engineer guidance', 'Session musician booking assistance', 'Full commercial release prep & stems'] }
        ],
        faq: [
          { q: 'Can I bring my own producer/engineer?', a: 'Yes! Our in-house assistant will handle all patchbay routing so your team can work smoothly.' }
        ]
      };
    },

    // 18. MEDIA & ENTERTAINMENT
    generateMediaSite(prompt, name, agent) {
      return {
        domain: 'media_entertainment',
        name: name,
        tagline: 'Cyber Graphic Novels, Manga Series & 60fps Motion Video',
        badge: '🎨 Official Anime Release · Season 1 Live',
        icon: '🎨',
        theme: {
          bg: '#050409',
          surface: 'rgba(16, 12, 26, 0.85)',
          border: 'rgba(236, 72, 153, 0.25)',
          accent: '#ec4899',
          accentSecondary: '#00f0ff',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Immerse Yourself in the Cyber Anime Universe.',
          sub: 'High-fidelity webtoon chapters, 60 FPS motion video episodes, interactive character dossiers, and original spatial soundtracks.',
          cta: '🎨 Read Episode 1 Free',
          ctaSecondary: '🎬 Watch Motion Trailer'
        },
        bentoFeatures: [
          { icon: '📖', title: 'Infinite Webtoon Reader', desc: 'Frictionless vertical scroll optimized with fluid gestures and instant image caching.' },
          { icon: '🎬', title: '60 FPS Motion Comic Videos', desc: 'Dynamic camera pans, particle visual effects, and synchronized voice acting.' },
          { icon: '👥', title: '21-Character Lore Matrix', desc: 'Interactive dossiers, backstory timelines, and animated sprite models.' },
          { icon: '🔊', title: 'Original Spatial OST', desc: 'Synthesized cyber-electronic score accompanying every chapter.' }
        ],
        itemsCatalog: [
          { name: 'Season 1 Collector Edition Book', place: 'Hardcover + Gold Foil', time: 'Ships Worldwide', price: '$34.99', rating: '240 Pages' },
          { name: 'Digital Season Pass (S01)', place: 'Instant 4K Access', time: 'Immediate', price: '$9.99', rating: 'All Episodes' },
          { name: 'Signed Holographic Art Print', place: 'Limited 250 Units', time: 'Numbered', price: '$24.99', rating: 'Foil Finish' },
          { name: 'Original Soundtrack Vinyl (2xLP)', place: 'Neon Violet Colored Vinyl', time: 'Ships Today', price: '$39.99', rating: '22 Tracks' }
        ],
        pricing: [
          { tier: 'Free Reader', price: '$0', desc: 'Access to first 3 manga chapters', perks: ['Read episodes 1-3 for free', 'Standard webtoon reader mode', 'Community discussion access'] },
          { tier: 'Series VIP Pass', price: '$4.99/mo', popular: true, desc: 'Early access to weekly chapters', perks: ['Read all chapters 2 weeks before release', 'Full access to 60 FPS motion videos', 'Download high-res wallpapers & OST', 'Exclusive behind-the-scenes concept art'] },
          { tier: 'Patron Archon', price: '$25/mo', desc: 'Producer tier with credits attribution', perks: ['Your name featured in episode credits', 'Monthly physical collector art print', 'Private creator Discord & live streams', 'Signed physical volume on release'] }
        ],
        faq: [
          { q: 'How often are new episodes released?', a: 'New comic chapters and motion video episodes release bi-weekly on Fridays.' }
        ]
      };
    },

    // 19. HOSPITALITY & TRAVEL
    generateHospitalitySite(prompt, name, agent) {
      return {
        domain: 'hospitality_travel',
        name: name,
        tagline: 'Luxury Boutique Escapes, Alpine Chalets & Yacht Charters',
        badge: '✨ Michelin Guide Recommended · 5-Star Private Concierge',
        icon: '✨',
        theme: {
          bg: '#070809',
          surface: 'rgba(18, 20, 24, 0.85)',
          border: 'rgba(232, 200, 114, 0.25)',
          accent: '#e8c872',
          accentSecondary: '#38bdf8',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Unforgettable Sanctuaries Crafted for Serenity and Wonder.',
          sub: 'Secluded oceanfront villas, private helicopter charters, Michelin-starred culinary dining, and tailored bespoke excursions in breathtaking destinations.',
          cta: '✨ Reserve Your Stay',
          ctaSecondary: '🏝️ Explore Destinations'
        },
        bentoFeatures: [
          { icon: '🏝️', title: 'Secluded Private Villas', desc: 'Infinity plunge pools, panoramic ocean views, and dedicated 24/7 private butler service.' },
          { icon: '🚁', title: 'Private Aviation & Transfers', desc: 'Seamless helicopter transfers from international hubs directly to your retreat.' },
          { icon: '🍽️', title: 'Michelin-Starred Dining', desc: 'Private chef multi-course tasting menus featuring freshly harvested organic ingredients.' },
          { icon: '🧘', title: 'Holistic Alpine Wellness', desc: 'Thermal hot springs, Ayurvedic spa rituals, and daily oceanfront guided meditation.' }
        ],
        itemsCatalog: [
          { name: 'Overwater Sunset Villa', place: 'Private Ocean Infinity Pool', time: 'Per Night', price: '$1,250', rating: '5.0 ★' },
          { name: 'Alpine Panoramic Chalet', place: 'Ski-In / Ski-Out Access', time: 'Per Night', price: '$980', rating: '5.0 ★' },
          { name: 'Private Yacht Island Charter', place: '72ft Catamaran + Crew', time: 'Full Day', price: '$2,800', rating: 'All-Inclusive' },
          { name: 'Helicopter Glacier Tour & Picnic', place: 'Champagne Summit Landing', time: '3 Hours', price: '$650', rating: 'Unforgettable' }
        ],
        pricing: [
          { tier: 'Deluxe Sanctuary', price: '$650/night', desc: 'Spacious suite with garden plunge pool', perks: ['Gourmet farm-to-table breakfast', 'Complimentary airport luxury transfer', 'Access to thermal spa & pools', '24/7 concierge assistance'] },
          { tier: 'Signature Ocean Villa', price: '$1,250/night', popular: true, desc: 'Overwater villa with private infinity pool', perks: ['Dedicated 24/7 private butler service', 'Daily private chef dinner in-villa', 'Complimentary sunset catamaran sail', 'Unlimited spa & massage treatments'] },
          { tier: 'Grand Estate Buyout', price: '$8,500/night', desc: 'Complete private island estate for 16 guests', perks: ['All 8 luxury villas included', 'Dedicated team of 14 staff & 3 chefs', 'Private yacht & helicopter at disposal', 'Customized bespoke itinerary & events'] }
        ],
        faq: [
          { q: 'What is the cancellation policy?', a: 'Full refunds are provided up to 14 days prior to arrival with flexible date rescheduling.' }
        ]
      };
    },

    // 20. CLEAN ENERGY & SUSTAINABILITY
    generateCleanEnergySite(prompt, name, agent) {
      return {
        domain: 'clean_energy',
        name: name,
        tagline: 'Solar Microgrids, Energy Storage & Zero-Carbon Innovation',
        badge: '🌿 100% Renewable Microgrid · Over 50MW Deployed',
        icon: '🌿',
        theme: {
          bg: '#040907',
          surface: 'rgba(10, 22, 16, 0.85)',
          border: 'rgba(52, 211, 153, 0.25)',
          accent: '#34d399',
          accentSecondary: '#38bdf8',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Power Your Future with Sovereign Solar & Microgrid Energy.',
          sub: 'High-efficiency commercial solar arrays, smart lithium battery storage, and AI-driven grid optimization delivering complete energy independence.',
          cta: '🌿 Calculate Solar Savings',
          ctaSecondary: '⚡ Explore Microgrid Tech'
        },
        bentoFeatures: [
          { icon: '☀️', title: '23.4% High-Efficiency Panels', desc: 'Next-gen N-type monocrystalline solar cells maximizing output in all weather conditions.' },
          { icon: '🔋', title: 'Continuous Battery Backup', desc: 'Seamless millisecond grid failover keeping critical appliances running 24/7.' },
          { icon: '📈', title: 'AI Energy Arbitrage', desc: 'Intelligent software charging batteries during low rates and selling to grid at peak prices.' },
          { icon: '🛡️', title: '25-Year Production Warranty', desc: 'Full manufacturer power and labor warranty guaranteed with 24/7 telemetry monitoring.' }
        ],
        itemsCatalog: [
          { name: 'Residential 10kW Solar Array', place: 'Tier 1 Monocrystalline', time: '1-Day Install', price: '$14,500', rating: 'Zero Electric Bill' },
          { name: '15kWh Smart Home Battery', place: 'LFP Safe Chemistry', time: 'Seamless Backup', price: '$8,200', rating: '10-Yr Warranty' },
          { name: 'Commercial 50kW Microgrid', place: 'Offices & Warehouses', time: 'Turnkey', price: '$48,000', rating: '3.2 Yr Payback' },
          { name: 'EV Supercharging Station Tie-In', place: 'Solar-Direct DC Feed', time: 'Plug & Play', price: '$3,800', rating: '100% Green' }
        ],
        pricing: [
          { tier: 'Solar Starter', price: '$129/mo', desc: 'Zero down payment solar lease', perks: ['Complete 8kW system installation', '25-year full warranty & monitoring', 'Immediate 40% reduction in utility bill', 'Zero maintenance or repair fees'] },
          { tier: 'Complete Energy Independence', price: '$249/mo', popular: true, desc: 'Solar array + 15kWh battery storage', perks: ['12kW high-efficiency solar array', '15kWh smart battery storage unit', 'Whole-home backup during grid blackouts', 'Mobile app energy management dashboard'] },
          { tier: 'Commercial Sovereign', price: 'Custom Quote', desc: 'For businesses, farms & industrial facilities', perks: ['50kW to 2MW scalable microgrid array', 'Demand charge peak shaving software', 'Federal tax credit guidance & paperwork', 'Dedicated commercial engineer lead'] }
        ],
        faq: [
          { q: 'How much can I save on my electric bill?', a: 'Most residential and commercial clients eliminate 85% to 100% of their monthly electric bills from day one.' },
          { q: 'What happens during a utility blackout?', a: 'Our smart battery system switches over in under 10 milliseconds, keeping your power running continuously.' }
        ]
      };
    },

    // 21. UNIVERSAL ADAPTIVE GENERATOR (FOR ANY NICHE OR UNIQUE PROMPT)
    generateAdaptiveSite(prompt, name, agent) {
      const cleanPrompt = prompt.trim() || 'Modern Next-Gen Platform';
      
      return {
        domain: 'universal_adaptive',
        name: name,
        tagline: 'Bespoke Digital Experience for ' + cleanPrompt,
        badge: '✨ AI Synthesized Foundry · Production Ready',
        icon: '✨',
        theme: {
          bg: '#05060a',
          surface: 'rgba(14, 18, 28, 0.85)',
          border: 'rgba(0, 240, 255, 0.25)',
          accent: '#00f0ff',
          accentSecondary: '#e8c872',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: 'Empowering ' + name + ' with Unprecedented Speed & Precision.',
          sub: 'Engineered specifically to solve "' + cleanPrompt + '". Beautiful modern design, frictionless workflows, and production-grade performance.',
          cta: '✨ Get Started Now',
          ctaSecondary: '📖 Learn More'
        },
        bentoFeatures: [
          { icon: '⚡', title: 'High-Velocity Performance', desc: 'Tailored architecture optimized specifically for ' + cleanPrompt + ' with sub-second responsiveness.' },
          { icon: '🛡️', title: 'Rock-Solid Reliability', desc: 'Engineered with strict zero-downtime architecture and enterprise-grade data security.' },
          { icon: '💎', title: 'Modern Bespoke UI/UX', desc: 'Dynamic responsive design that delights users across desktop, tablet, and mobile.' },
          { icon: '📊', title: 'Transparent Insights', desc: 'Real-time telemetry and actionable analytics to track growth and engagement.' }
        ],
        itemsCatalog: [
          { name: name + ' Standard Edition', place: 'Core Features', time: 'Instant Access', price: '$29.00', rating: '5.0 ★' },
          { name: name + ' Professional Suite', place: 'Advanced Toolkit', time: 'Full Access', price: '$79.00', rating: 'Best Value' },
          { name: name + ' Custom Add-on', place: 'Specialized Module', time: 'Optional', price: '$19.00', rating: 'Top Choice' },
          { name: name + ' Enterprise License', place: 'Dedicated Solution', time: 'Turnkey', price: '$299.00', rating: 'Complete' }
        ],
        pricing: [
          { tier: 'Starter', price: '$19/mo', desc: 'Essential tools for individuals', perks: ['Full access to core features', 'Standard customer support', 'Regular feature updates'] },
          { tier: 'Professional', price: '$49/mo', popular: true, desc: 'Ideal for growing teams & power users', perks: ['Unlimited usage & priority workflows', 'Advanced analytics & export tools', 'Priority 24/7 support hotline', 'Custom branding options'] },
          { tier: 'Enterprise', price: '$199/mo', desc: 'Dedicated solutions for organizations', perks: ['Custom feature development', 'Dedicated account manager', 'SLA guarantee & audit logs', 'Unlimited team members'] }
        ],
        faq: [
          { q: 'How does ' + name + ' work?', a: 'Our platform is designed specifically to streamline ' + cleanPrompt + ' through intuitive workflows and high performance.' },
          { q: 'Can I cancel anytime?', a: 'Yes, all plans are month-to-month with no hidden fees and easy one-click cancellation.' }
        ]
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = ZothDomainSynthesizer;
  else global.ZothDomainSynthesizer = ZothDomainSynthesizer;
})(typeof window !== 'undefined' ? window : globalThis);
