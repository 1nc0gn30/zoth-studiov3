/**
 * Zoth Studio — Deep Domain Intelligence & Content Synthesizer (v3.0)
 * Replaces generic placeholder copy with realistic, context-aware,
 * industry-specific copywriting, bento components, menus, and color palettes.
 */

(function(global) {
  'use strict';

  const ZothDomainSynthesizer = {
    VERSION: '3.0.0',

    // Detect industry domain from natural language prompt
    detectDomain(prompt = '') {
      const p = prompt.toLowerCase();
      
      if (p.includes('delivery') || p.includes('food') || p.includes('restaurant') || p.includes('courier') || p.includes('grocery') || p.includes('dish') || p.includes('town center') || p.includes('pizza') || p.includes('burger') || p.includes('meal') || p.includes('cafe')) {
        return 'delivery';
      }
      if (p.includes('lawn') || p.includes('electric') || p.includes('plumb') || p.includes('clean') || p.includes('valet') || p.includes('service') || p.includes('repair') || p.includes('hvac') || p.includes('contractor') || p.includes('moving')) {
        return 'local_service';
      }
      if (p.includes('real estate') || p.includes('property') || p.includes('apartment') || p.includes('housing') || p.includes('mortgage') || p.includes('listing') || p.includes('realtor') || p.includes('condo') || p.includes('floorplan')) {
        return 'real_estate';
      }
      if (p.includes('health') || p.includes('doctor') || p.includes('dental') || p.includes('clinic') || p.includes('hospital') || p.includes('therapy') || p.includes('medical') || p.includes('pharma') || p.includes('wellness')) {
        return 'healthcare';
      }
      if (p.includes('shop') || p.includes('store') || p.includes('cloth') || p.includes('fashion') || p.includes('apparel') || p.includes('boutique') || p.includes('merch') || p.includes('shoe') || p.includes('product') || p.includes('ecommerce')) {
        return 'ecommerce';
      }
      if (p.includes('crypto') || p.includes('defi') || p.includes('bank') || p.includes('invest') || p.includes('stock') || p.includes('trading') || p.includes('fintech') || p.includes('wallet') || p.includes('token') || p.includes('pay')) {
        return 'fintech';
      }
      if (p.includes('fitness') || p.includes('gym') || p.includes('workout') || p.includes('training') || p.includes('athletic') || p.includes('crossfit') || p.includes('yoga') || p.includes('coach')) {
        return 'fitness';
      }
      if (p.includes('course') || p.includes('learn') || p.includes('school') || p.includes('academy') || p.includes('tutor') || p.includes('class') || p.includes('education') || p.includes('curriculum')) {
        return 'education';
      }
      if (p.includes('agency') || p.includes('portfolio') || p.includes('design') || p.includes('creative') || p.includes('branding') || p.includes('freelance') || p.includes('marketing studio')) {
        return 'agency';
      }
      if (p.includes('hotel') || p.includes('travel') || p.includes('resort') || p.includes('vacation') || p.includes('flight') || p.includes('tour') || p.includes('airbnb') || p.includes('booking')) {
        return 'hospitality';
      }
      return 'saas_tech';
    },

    // Synthesize tailored website data
    synthesize(prompt = '', agent = 'antigravity') {
      const domain = this.detectDomain(prompt);
      const name = this.extractBrandName(prompt, domain);
      
      switch(domain) {
        case 'delivery':
          return this.generateDeliverySite(prompt, name, agent);
        case 'local_service':
          return this.generateLocalServiceSite(prompt, name, agent);
        case 'real_estate':
          return this.generateRealEstateSite(prompt, name, agent);
        case 'healthcare':
          return this.generateHealthcareSite(prompt, name, agent);
        case 'ecommerce':
          return this.generateEcommerceSite(prompt, name, agent);
        case 'fintech':
          return this.generateFintechSite(prompt, name, agent);
        case 'fitness':
          return this.generateFitnessSite(prompt, name, agent);
        case 'education':
          return this.generateEducationSite(prompt, name, agent);
        case 'agency':
          return this.generateAgencySite(prompt, name, agent);
        case 'hospitality':
          return this.generateHospitalitySite(prompt, name, agent);
        default:
          return this.generateTechSaasSite(prompt, name, agent);
      }
    },

    extractBrandName(prompt, domain) {
      const p = prompt.trim();
      if (!p) return 'Town Center Express';
      
      // Look for explicit names in quotes
      const quoted = p.match(/["']([^"']+)["']/);
      if (quoted) return quoted[1];

      if (domain === 'delivery') {
        if (p.toLowerCase().includes('town center')) return 'Town Center Direct';
        return 'SwiftDrop Local';
      }
      if (domain === 'local_service') return 'Apex Pro Services';
      if (domain === 'real_estate') return 'Skyline Haven Properties';
      if (domain === 'healthcare') return 'Lumina Health Clinic';
      if (domain === 'ecommerce') return 'Aura Artisan Goods';
      if (domain === 'fintech') return 'Nexus Capital Exchange';
      if (domain === 'fitness') return 'IronPulse Athletic Club';
      if (domain === 'education') return 'Quantum Mind Academy';
      if (domain === 'agency') return 'Vanguard Design Atelier';
      if (domain === 'hospitality') return 'Solstice Retreat & Suites';
      
      const words = p.split(' ').slice(0, 2);
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    },

    // 1. DELIVERY & TOWN CENTER APP GENERATOR
    generateDeliverySite(prompt, name, agent) {
      return {
        domain: 'delivery',
        name: name,
        tagline: 'Hyper-Local Town Center Delivery in Under 20 Minutes',
        badge: '🛵 Live Courier Dispatch Active',
        theme: {
          bg: '#080a10',
          surface: 'rgba(18, 24, 38, 0.85)',
          border: 'rgba(249, 115, 22, 0.25)',
          accent: '#f97316',
          accentSecondary: '#fbbf24',
          text: '#ffffff',
          textMuted: '#94a3b8'
        },
        hero: {
          title: `Craving Town Center's Best? Delivered in Minutes.`,
          sub: `From artisan bistros and craft coffee to fresh groceries and local pharmacy essentials. Order directly from Town Center merchants with zero surge pricing and real-time live GPS courier tracking.`,
          cta: '🛵 Order Now & Track Live',
          ctaSecondary: '🏬 Partner Your Restaurant'
        },
        bentoFeatures: [
          { icon: '⚡', title: '18-Minute Average ETA', desc: 'Dedicated hyper-local couriers stationed right at Town Center plazas for lightning dispatch.' },
          { icon: '🥗', title: 'Local Artisan Dining', desc: 'Handpicked local restaurants, wood-fired pizzerias, poke bars, and craft bakeries.' },
          { icon: '📍', title: 'Real-Time Courier Radar', desc: 'Watch your order travel on live radar from kitchen stove to your apartment or office lobby.' },
          { icon: '💳', title: 'Zero Surge Fee Guarantee', desc: 'Predictable flat delivery. No predatory fees, no surge markups, supporting local merchants.' },
          { icon: '🛍️', title: 'Multi-Store Bundle Orders', desc: 'Combine gourmet lunch from Bistro 9 with groceries from Town Center Market in one delivery.' },
          { icon: '🔒', title: 'Contactless Doorstep Drop', desc: 'Photo-verified delivery drop-offs with instant SMS chime and optional thermal seal verification.' }
        ],
        itemsCatalog: [
          { name: 'Truffle Mushroom Artisan Pizza', place: 'Bella Italia Trattoria', time: '15-20 min', price: '$18.50', rating: '4.9 ★' },
          { name: 'Matcha Oat Latte & Croissant', place: 'The Daily Bean Café', time: '10-15 min', price: '$8.25', rating: '4.8 ★' },
          { name: 'Wild Salmon Teriyaki Bowl', place: 'Green & Grain Kitchen', time: '15-20 min', price: '$16.00', rating: '4.9 ★' },
          { name: 'Fresh Organic Grocery Basket', place: 'Town Center Provisions', time: '20-25 min', price: '$34.00', rating: '4.9 ★' }
        ],
        pricing: [
          { tier: 'Single Order', price: '$1.99', desc: 'Flat fee per order', perks: ['Live GPS tracking', 'Contactless drop', 'SMS dispatch alerts'] },
          { tier: 'Town Center Club', price: '$9.99/mo', desc: 'Unlimited $0 delivery', popular: true, perks: ['Unlimited free deliveries', 'Priority 15-min rush dispatch', '10% off all merchant menus', 'Multi-store bundle free'] },
          { tier: 'Office & Corporate', price: '$49/mo', desc: 'Team catering pass', perks: ['Group order splitting', 'Scheduled recurring lunch', 'Dedicated courier lead', 'Monthly billing invoice'] }
        ],
        faq: [
          { q: 'What areas in Town Center do you deliver to?', a: 'We service all residential apartments, high-rise office suites, retail corridors, and surrounding residential communities within a 3-mile radius of Town Center.' },
          { q: 'Can I order from multiple Town Center restaurants in one cart?', a: 'Yes! Our Multi-Store Bundle technology allows you to add coffee from one café and lunch from a grill in a single checkout with one unified courier.' },
          { q: 'How do merchant payouts work?', a: 'Unlike legacy national aggregators charging 30% commissions, our platform takes only 8%, keeping profits in the hands of local business owners.' }
        ]
      };
    },

    // 2. LOCAL FIELD SERVICE (LAWN, ELECTRICAL, VALET) GENERATOR
    generateLocalServiceSite(prompt, name, agent) {
      return {
        domain: 'local_service',
        name: name,
        tagline: 'Licensed & Insured Local Craftsmen Serving Your Neighborhood',
        badge: '⚡ Same-Day Service Available',
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
          title: `Precision Workmanship Done Right the First Time.`,
          sub: `Transparent flat-rate pricing, 5-star certified technicians, and 100% satisfaction guarantee. Instant online booking in under 60 seconds.`,
          cta: '⚡ Get Instant Estimate',
          ctaSecondary: '📞 Call (757) 555-0199'
        },
        bentoFeatures: [
          { icon: '🛡️', title: 'Fully Licensed & Insured', desc: '$2M liability coverage and background-checked technicians for total peace of mind.' },
          { icon: '⏱️', title: '60-Minute Arrival Window', desc: 'Live on-the-way GPS tracking with text updates so you never sit waiting around all day.' },
          { icon: '💰', title: 'Upfront Flat Pricing', desc: 'Exact price quotes before work begins. Zero hidden diagnostic surprises or travel surcharges.' },
          { icon: '⭐', title: '500+ Verified 5-Star Reviews', desc: 'Voted #1 neighborhood contractor with 99.4% first-visit resolution rate.' }
        ],
        pricing: [
          { tier: 'Standard Visit', price: '$89', desc: 'Full diagnostic & service estimate' },
          { tier: 'Annual Protection', price: '$199/yr', popular: true, desc: 'Priority booking + 2 maintenance visits' }
        ],
        faq: [
          { q: 'Are your technicians background checked?', a: 'Yes, 100% of our team undergoes rigorous annual criminal background checks and drug screenings.' }
        ]
      };
    },

    // 3. REAL ESTATE & HOUSING
    generateRealEstateSite(prompt, name, agent) {
      return {
        domain: 'real_estate',
        name: name,
        tagline: 'Architectural Excellence & Luxury Urban Living',
        badge: '🏡 VIP Private Showings Active',
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
          title: `Discover Elevated Living in Premier Town Center Residences.`,
          sub: `Floor-to-ceiling panoramic views, bespoke Italian finishes, private rooftop lounges, and concierge service at your fingertips.`,
          cta: '🏡 Schedule Private Tour',
          ctaSecondary: '📐 Explore 3D Floorplans'
        },
        bentoFeatures: [
          { icon: '🌆', title: 'Panoramic Skyline Views', desc: 'Expansive private terraces overlooking the heart of the city.' },
          { icon: '🏊', title: 'Resort-Style Amenities', desc: 'Heated infinity rooftop pool, sauna, 24/7 fitness club, and pet spa.' },
          { icon: '🔑', title: 'Smart Keyless Access', desc: 'Smartphone and biometric entry with encrypted guest pass provisioning.' }
        ],
        pricing: [
          { tier: '1 Bedroom Suite', price: '$1,850/mo', desc: '780 sq ft · High Ceilings' },
          { tier: '2 Bedroom Terrace', price: '$2,650/mo', popular: true, desc: '1,240 sq ft · Corner Balcony' },
          { tier: 'Penthouse Collection', price: '$4,500/mo', desc: '2,100 sq ft · Private Elevator' }
        ],
        faq: [
          { q: 'What lease terms are offered?', a: 'We offer flexible 6, 12, and 18-month lease terms with corporate housing options available.' }
        ]
      };
    },

    // 4. TECH SAAS FALLBACK
    generateTechSaasSite(prompt, name, agent) {
      return {
        domain: 'saas_tech',
        name: name,
        tagline: 'Autonomous Computing & High-Velocity Infrastructure',
        badge: '⚡ Zero Cloud Egress Sovereign Core',
        theme: {
          bg: '#040711',
          surface: 'rgba(10, 18, 38, 0.85)',
          border: 'rgba(0, 240, 255, 0.25)',
          accent: '#00f0ff',
          accentSecondary: '#38bdf8',
          text: '#ffffff',
          textMuted: '#8ea5d0'
        },
        hero: {
          title: `Accelerate Your Autonomous Workflows with Precision.`,
          sub: `Hardware-isolated compute, AST self-healing verification, and sub-millisecond execution with zero cloud latency.`,
          cta: '⚡ Launch Workstation',
          ctaSecondary: '📖 Read Architecture Docs'
        },
        bentoFeatures: [
          { icon: '⚡', title: 'Sub-Millisecond Loopback', desc: 'Hardware-isolated local compute with zero cloud egress.' },
          { icon: '🛡️', title: 'Netlify AX Self-Healing', desc: 'Automated build triage, HSTS headers, and zero redirect loops.' }
        ],
        pricing: [
          { tier: 'Starter Node', price: '$0', desc: 'Local dev workflows' },
          { tier: 'Pro Swarm', price: '$29/mo', popular: true, desc: 'Unlimited autonomous agent nodes' }
        ],
        faq: [
          { q: 'Is my data stored off-grid?', a: 'Yes, 100% of compute and keys remain isolated on your local hardware loopback.' }
        ]
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = ZothDomainSynthesizer;
  else global.ZothDomainSynthesizer = ZothDomainSynthesizer;
})(typeof window !== 'undefined' ? window : globalThis);
