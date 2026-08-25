const test = require('node:test');
const assert = require('node:assert');
const ZothTemplateRebrander = require('./site-template-rebrander.js');
const ZothTemplatesCatalog = require('./site-templates-catalog.js');

test('ZothTemplateRebrander has version 4.0.0', (t) => {
  assert.strictEqual(ZothTemplateRebrander.VERSION, '4.0.0');
});

test('extractBrandIdentity extracts brand name, owner, location, and theme', (t) => {
  const tpl = ZothTemplatesCatalog.getById('Hampton-Roads-Lawn-Care');
  const prompt = 'Rebrand for "Apex Green Landscaping" in Virginia Beach, VA by Ian Davis with emerald theme';
  
  const identity = ZothTemplateRebrander.extractBrandIdentity(tpl, prompt);
  assert.strictEqual(identity.name, 'Apex Green Landscaping');
  assert.strictEqual(identity.owner, 'Ian Davis');
  assert.strictEqual(identity.location, 'Virginia Beach, VA');
  assert.strictEqual(identity.paletteKey, 'emerald');
  assert.strictEqual(identity.theme.accent, '#34d399');
});

test('generateInlineLogoSvg generates SVG markup with initials and accent color', (t) => {
  const svg = ZothTemplateRebrander.generateInlineLogoSvg('Apex Green Landscaping', '#34d399');
  assert.ok(svg.includes('<svg'));
  assert.ok(svg.includes('AG'));
  assert.ok(svg.includes('#34d399'));
  assert.ok(svg.includes('</svg>'));
});

test('rebrand transforms template into full rebranded site with all 6 routes', (t) => {
  const prompt = 'Rebrand this for "Quantum Neural Copilot" by Elena Rostova in San Francisco with obsidian cyan palette';
  const result = ZothTemplateRebrander.rebrand('100-websites-in-30-days', prompt, {
    framework: 'nextjs',
    hosting: 'netlify'
  });

  assert.ok(result);
  assert.strictEqual(result.identity.name, 'Quantum Neural Copilot');
  assert.strictEqual(result.identity.owner, 'Elena Rostova');
  assert.ok(result.site);
  assert.strictEqual(result.site.name, 'Quantum Neural Copilot');
  
  // Verify all 6 routes exist
  assert.ok(result.routes);
  const routeKeys = Object.keys(result.routes);
  assert.ok(routeKeys.includes('index.html'));
  assert.ok(routeKeys.includes('features.html'));
  assert.ok(routeKeys.includes('pricing.html'));
  assert.ok(routeKeys.includes('docs.html'));
  assert.ok(routeKeys.includes('about.html'));
  assert.ok(routeKeys.includes('contact.html'));

  // Verify index.html contains rebranded name
  assert.ok(result.routes['index.html'].includes('Quantum Neural Copilot'));
});
