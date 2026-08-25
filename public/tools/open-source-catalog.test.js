const { describe, it } = require('node:test');
const assert = require('node:assert');
const OpenSourceCatalog = require('./open-source-catalog.js');

describe('Zoth Open Source Library Archive Catalog v2.0.0', () => {
  it('has valid VERSION string', () => {
    assert.strictEqual(typeof OpenSourceCatalog.VERSION, 'string');
    assert.strictEqual(OpenSourceCatalog.VERSION, '2.0.0');
  });

  it('getAll returns curated open source templates (30+ templates)', () => {
    const all = OpenSourceCatalog.getAll();
    assert.ok(Array.isArray(all));
    assert.ok(all.length >= 30, `Expected at least 30 open source templates, got ${all.length}`);
    all.forEach(t => {
      assert.ok(t.id, 'Template missing id');
      assert.ok(t.title, 'Template missing title');
      assert.ok(t.license, 'Template missing license');
      assert.ok(t.repoUrl, 'Template missing repoUrl');
      assert.ok(t.framework, 'Template missing framework');
    });
  });

  it('getById retrieves specific open source template case-insensitively', () => {
    const astroPaper = OpenSourceCatalog.getById('ASTRO-PAPER');
    assert.ok(astroPaper);
    assert.strictEqual(astroPaper.author, 'Sat Naing');

    const scaffoldEth = OpenSourceCatalog.getById('scaffold-eth-2');
    assert.ok(scaffoldEth);
    assert.strictEqual(scaffoldEth.author, 'BuidlGuidl');

    const solanaDapp = OpenSourceCatalog.getById('SOLANA-DAPP-SCAFFOLD');
    assert.ok(solanaDapp);
    assert.strictEqual(solanaDapp.author, 'Solana Labs');

    const r3f = OpenSourceCatalog.getById('r3f-starter');
    assert.ok(r3f);
    assert.strictEqual(r3f.author, 'Poimandres');
  });

  it('getCategories returns category groupings with counts', () => {
    const cats = OpenSourceCatalog.getCategories();
    assert.ok(Array.isArray(cats));
    assert.ok(cats.length >= 5);
    cats.forEach(c => {
      assert.ok(c.id);
      assert.ok(c.label);
      assert.ok(c.count > 0);
    });
  });

  it('search filters by keyword, category, and framework', () => {
    const astroResults = OpenSourceCatalog.search({ query: 'astro' });
    assert.ok(astroResults.length >= 4);

    const web3Results = OpenSourceCatalog.search({ category: '08-crypto-web3' });
    assert.ok(web3Results.length >= 2);

    const saasResults = OpenSourceCatalog.search({ category: '03-fullstack-saas' });
    assert.ok(saasResults.length >= 5);
  });
});
