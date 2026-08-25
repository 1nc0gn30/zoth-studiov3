const test = require('node:test');
const assert = require('node:assert');
const ZothTemplatesCatalog = require('./site-templates-catalog.js');

test('ZothTemplatesCatalog has valid version and metadata', (t) => {
  assert.strictEqual(typeof ZothTemplatesCatalog.VERSION, 'string');
  assert.ok(ZothTemplatesCatalog.getCount() >= 300, 'Must have at least 300 templates');
});

test('getAll returns complete list of templates', (t) => {
  const all = ZothTemplatesCatalog.getAll();
  assert.ok(Array.isArray(all));
  assert.strictEqual(all.length, ZothTemplatesCatalog.getCount());
  
  // Verify structure of first template
  const first = all[0];
  assert.ok(first.id, 'Template must have id');
  assert.ok(first.title, 'Template must have title');
  assert.ok(first.category, 'Template must have category');
  assert.ok(first.categoryLabel, 'Template must have categoryLabel');
  assert.ok(first.description, 'Template must have description');
  assert.ok(Array.isArray(first.stack), 'Template must have stack array');
});

test('getById retrieves specific template case-insensitively', (t) => {
  const t1 = ZothTemplatesCatalog.getById('Hampton-Roads-Lawn-Care');
  assert.ok(t1, 'Must find Hampton-Roads-Lawn-Care');
  assert.strictEqual(t1.id, 'Hampton-Roads-Lawn-Care');
  assert.strictEqual(t1.category, '01-clients-services');

  const t2 = ZothTemplatesCatalog.getById('hampton-roads-lawn-care');
  assert.ok(t2, 'Case-insensitive lookup');
  assert.strictEqual(t2.id, 'Hampton-Roads-Lawn-Care');
});

test('getCategories returns category breakdown with counts', (t) => {
  const cats = ZothTemplatesCatalog.getCategories();
  assert.ok(Array.isArray(cats));
  assert.ok(cats.length >= 8);
  
  const clientServices = cats.find(c => c.id === '01-clients-services');
  assert.ok(clientServices);
  assert.ok(clientServices.count >= 40);
  assert.ok(clientServices.label.includes('Business'));
});

test('getFrameworks returns sorted framework distribution', (t) => {
  const fws = ZothTemplatesCatalog.getFrameworks();
  assert.ok(Array.isArray(fws));
  assert.ok(fws.length > 0);
  assert.ok(fws[0].count >= fws[fws.length - 1].count, 'Should be sorted descending');
});

test('search filters by query, category, and framework', (t) => {
  // Query search
  const qRes = ZothTemplatesCatalog.search({ query: 'lawn' });
  assert.ok(qRes.total > 0);
  assert.ok(qRes.items.some(i => i.title.toLowerCase().includes('lawn')));

  // Category search
  const catRes = ZothTemplatesCatalog.search({ category: '01-clients-services', limit: 100 });
  assert.strictEqual(catRes.items.every(i => i.category === '01-clients-services'), true);

  // Combined search
  const comboRes = ZothTemplatesCatalog.search({ query: 'python', category: '06-learning-courses' });
  assert.ok(comboRes.total > 0);
  assert.ok(comboRes.items.some(i => i.id.includes('Python')));
});

test('getFeatured returns curated cross-discipline templates', (t) => {
  const featured = ZothTemplatesCatalog.getFeatured();
  assert.ok(Array.isArray(featured));
  assert.ok(featured.length >= 8);
  assert.ok(featured.some(f => f.id === 'Hampton-Roads-Lawn-Care'));
  assert.ok(featured.some(f => f.id === 'SignalBridge-AI'));
});

test('getTemplateSite hydrates template into authentic renderable site model', (t) => {
  const lawnSite = ZothTemplatesCatalog.getTemplateSite('Hampton-Roads-Lawn-Care');
  assert.ok(lawnSite);
  assert.strictEqual(lawnSite.name, 'Hampton Roads Lawn Care');
  assert.strictEqual(lawnSite.icon, '🌱');
  assert.ok(lawnSite.theme);
  assert.strictEqual(lawnSite.theme.accent, '#34d399');
  assert.ok(lawnSite.itemsCatalog.length >= 3);
  assert.ok(lawnSite.hero.title.includes('Hampton Roads'));
});

