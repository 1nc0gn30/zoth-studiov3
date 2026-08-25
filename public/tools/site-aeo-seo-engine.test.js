const test = require('node:test');
const assert = require('node:assert');
const ZothAeoSeoEngine = require('./site-aeo-seo-engine.js');

test('ZothAeoSeoEngine has version 4.0.0 and verified standards', () => {
  assert.strictEqual(ZothAeoSeoEngine.VERSION, '4.0.0');
  const standards = ZothAeoSeoEngine.getLatestStandards();
  assert.ok(standards.google);
  assert.ok(standards.bing);
  assert.ok(standards.aeo);
  assert.ok(standards.ax);
});

test('getSyncTelemetry returns health and rule counts', () => {
  const telemetry = ZothAeoSeoEngine.getSyncTelemetry();
  assert.strictEqual(telemetry.health, 'sovereign_active');
  assert.ok(telemetry.activeRulesCount >= 15);
  assert.ok(telemetry.lastSync);
  assert.ok(telemetry.nextScheduledSync);
});

test('selfHealAndSync triggers rule refresh and returns success report', () => {
  const result = ZothAeoSeoEngine.selfHealAndSync();
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.healed, true);
  assert.ok(result.lastSync);
  assert.ok(result.updatedRulesCount >= 15);
});

test('generateSchemaJsonLd creates valid Schema.org graph for local and tech sites', () => {
  const localSite = {
    name: 'Apex Green Landscaping',
    categoryShort: 'Services',
    location: 'Virginia Beach, VA',
    faq: [{ q: 'Do you offer aeration?', a: 'Yes, full core aeration & overseeding.' }]
  };

  const schemaStr = ZothAeoSeoEngine.generateSchemaJsonLd(localSite);
  const parsed = JSON.parse(schemaStr);
  assert.strictEqual(parsed['@context'], 'https://schema.org');
  assert.ok(Array.isArray(parsed['@graph']));
  assert.ok(parsed['@graph'].some(e => e['@type'] === 'LocalBusiness'));
  assert.ok(parsed['@graph'].some(e => e['@type'] === 'FAQPage'));
});

test('generateLlmsTxt creates standardized /llms.txt manifest', () => {
  const site = {
    name: 'Apex Green Landscaping',
    domain: 'apexgreen.nullai.tech',
    tagline: 'Premier Lawn Care & Grounds Maintenance'
  };

  const llmsTxt = ZothAeoSeoEngine.generateLlmsTxt(site);
  assert.ok(llmsTxt.includes('# Apex Green Landscaping'));
  assert.ok(llmsTxt.includes('Canonical Documentation Routes'));
  assert.ok(llmsTxt.includes('features.html'));
  assert.ok(llmsTxt.includes('pricing.html'));
});

test('auditSiteAeoSeo audits HTML against Google and Bing 2026 guidelines', () => {
  const completeHtml = '<!DOCTYPE html><html><head><title>Apex Green</title><meta name="description" content="Premier Lawn Care"><meta name="viewport" content="width=device-width"><script type="application/ld+json">{}</script><meta property="og:title" content="Apex"></head><body><h1>Welcome</h1></body></html>';
  const report = ZothAeoSeoEngine.auditSiteAeoSeo(completeHtml);
  assert.strictEqual(report.score, 100);
  assert.strictEqual(report.grade, 'A+');
  assert.strictEqual(report.findings.length, 0);

  const incompleteHtml = '<html><body><p>Hello world</p></body></html>';
  const badReport = ZothAeoSeoEngine.auditSiteAeoSeo(incompleteHtml);
  assert.ok(badReport.score < 70);
  assert.ok(badReport.findings.length >= 3);
});
