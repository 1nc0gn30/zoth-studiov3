const test = require('node:test');
const assert = require('node:assert');
const ZothDomainSynthesizer = require('./zoth-domain-synthesizer.js');

test('ZothDomainSynthesizer has version 4.0.0', () => {
  assert.strictEqual(ZothDomainSynthesizer.VERSION, '4.0.0');
});

test('Domain detection accurately classifies 20+ diverse industries', () => {
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Next-gen AI code copilot and neural devtools'), 'ai_saas');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Zero-trust cybersecurity and penetration testing SOC'), 'cybersecurity');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Solana DeFi DEX with concentrated liquidity vaults'), 'web3_crypto');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Luxury creative design studio and branding agency'), 'creative_agency');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('60fps WebGL indie browser game and 3D metaverse'), 'gaming_webgl');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Haute horlogerie luxury watch and jewelry boutique'), 'ecommerce_fashion');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Artisan sourdough bakery and specialty coffee roastery'), 'restaurant_cafe');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Town center courier delivery and live GPS logistics'), 'delivery_logistics');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Modern architectural penthouse and luxury real estate listings'), 'real_estate');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Integrative medical clinic and telehealth biomarker doctor'), 'healthcare_medical');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('High-performance CrossFit athletic club and powerlifting gym'), 'fitness_athletics');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Fullstack AI coding bootcamp and interactive edtech academy'), 'education_edtech');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Corporate patent litigation law firm and IP attorneys'), 'legal_ip');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Fiduciary wealth management and venture capital hedge fund'), 'finance_wealth');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Licensed electrical, HVAC heating and precision lawn care'), 'local_services');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Ultra-fast 350kW EV charging network and ceramic auto detailing'), 'automotive_ev');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Dolby Atmos recording studio and analog sound mastering'), 'music_audio');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Cyber anime manga comic series and 60fps motion video'), 'media_entertainment');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Luxury alpine chalet resort and private yacht travel booking'), 'hospitality_travel');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Commercial solar microgrid and smart battery energy storage'), 'clean_energy');
  assert.strictEqual(ZothDomainSynthesizer.detectDomain('Quantum teleportation probe research observatory'), 'universal_adaptive');
});

test('Brand extraction recognizes custom names in quotes or derives from prompt', () => {
  assert.strictEqual(ZothDomainSynthesizer.extractBrandName('A luxury site for "Chronos Atelier"', 'ecommerce_fashion'), 'Chronos Atelier');
  assert.strictEqual(ZothDomainSynthesizer.extractBrandName('DeepMind AI copilot platform', 'ai_saas'), 'Deepmind Ai');
  assert.strictEqual(ZothDomainSynthesizer.extractBrandName('', 'ai_saas'), 'Nexus Studio');
});

test('Synthesize generates complete, rich data structures across all domains', () => {
  const domains = [
    'AI compute platform',
    'Zero trust cybersecurity',
    'Solana DeFi DEX',
    'Creative design studio',
    'WebGL 3D game',
    'Luxury watch boutique',
    'Artisan coffee bakery',
    'Local courier delivery',
    'Skyline penthouse properties',
    'Longevity telehealth clinic',
    'CrossFit gym fitness club',
    'Fullstack coding bootcamp',
    'Patent law firm',
    'Fiduciary wealth management',
    'Emergency plumbing & HVAC',
    'Ultra-fast EV charging station',
    'Dolby Atmos recording studio',
    'Anime comic manga series',
    'Luxury hotel resort',
    'Commercial solar energy'
  ];

  for (const prompt of domains) {
    const site = ZothDomainSynthesizer.synthesize(prompt, 'antigravity');
    assert.ok(site.name, `Missing name for ${prompt}`);
    assert.ok(site.tagline, `Missing tagline for ${prompt}`);
    assert.ok(site.badge, `Missing badge for ${prompt}`);
    assert.ok(site.theme && site.theme.bg && site.theme.accent, `Missing theme for ${prompt}`);
    assert.ok(site.hero && site.hero.title && site.hero.cta, `Missing hero for ${prompt}`);
    assert.ok(Array.isArray(site.bentoFeatures) && site.bentoFeatures.length >= 3, `Bento features too short for ${prompt}`);
    assert.ok(Array.isArray(site.itemsCatalog) && site.itemsCatalog.length >= 3, `Catalog items too short for ${prompt}`);
    assert.ok(Array.isArray(site.pricing) && site.pricing.length >= 2, `Pricing tiers too short for ${prompt}`);
    assert.ok(Array.isArray(site.faq) && site.faq.length >= 1, `FAQ too short for ${prompt}`);
  }
});

test('Universal adaptive synthesizer handles completely unlisted arbitrary prompts with rich tailored copy', () => {
  const site = ZothDomainSynthesizer.synthesize('Handmade artisanal wooden surfboards crafted from reclaimed cedar', 'hermes');
  assert.strictEqual(site.domain, 'universal_adaptive');
  assert.ok(site.name);
  assert.ok(site.hero.title.includes(site.name));
  assert.ok(site.hero.sub.includes('Handmade artisanal wooden surfboards'));
  assert.ok(site.bentoFeatures.length >= 4);
  assert.ok(site.itemsCatalog.length >= 4);
  assert.ok(site.pricing.length === 3);
});
