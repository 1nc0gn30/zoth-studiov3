const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const BRAND_DIR = path.join(__dirname, '..', 'assets', 'brand');
const PUBLIC_DIR = path.join(__dirname, '..');

test('Zoth Golden Z brand assets exist and are valid', (t) => {
  const svgBadge = path.join(BRAND_DIR, 'zoth-golden-z.svg');
  const svgTrans = path.join(BRAND_DIR, 'zoth-golden-z-transparent.svg');
  const svgCard = path.join(BRAND_DIR, 'zoth-golden-z-social-card.svg');
  const png512 = path.join(BRAND_DIR, 'zoth-golden-z-512.png');
  const png192 = path.join(BRAND_DIR, 'zoth-golden-z-192.png');
  const png64 = path.join(BRAND_DIR, 'zoth-golden-z-64.png');
  const pngCard = path.join(BRAND_DIR, 'zoth-golden-z-social-card.png');
  const favicon = path.join(PUBLIC_DIR, 'favicon.svg');

  assert.ok(fs.existsSync(svgBadge), 'zoth-golden-z.svg must exist');
  assert.ok(fs.existsSync(svgTrans), 'zoth-golden-z-transparent.svg must exist');
  assert.ok(fs.existsSync(svgCard), 'zoth-golden-z-social-card.svg must exist');
  assert.ok(fs.existsSync(png512), 'zoth-golden-z-512.png must exist');
  assert.ok(fs.existsSync(png192), 'zoth-golden-z-192.png must exist');
  assert.ok(fs.existsSync(png64), 'zoth-golden-z-64.png must exist');
  assert.ok(fs.existsSync(pngCard), 'zoth-golden-z-social-card.png must exist');
  assert.ok(fs.existsSync(favicon), 'favicon.svg must exist');

  // Verify SVG vector structure & hermetic gold details
  const svgContent = fs.readFileSync(svgBadge, 'utf-8');
  assert.ok(svgContent.includes('<svg'), 'Must be valid SVG');
  assert.ok(svgContent.includes('goldTop') || svgContent.includes('goldSpine'), 'Must have gold gradient definitions');
  assert.ok(svgContent.includes('circle cx="256" cy="256"'), 'Must have subtle hermetic orbital circle');
  assert.ok(svgContent.includes('viewBox="0 0 512 512"'), 'Must have 512x512 square viewBox');

  // Verify Social Card contains brand typography & high-res dimensions
  const cardContent = fs.readFileSync(svgCard, 'utf-8');
  assert.ok(cardContent.includes('viewBox="0 0 1200 630"'), 'Social card must be 1200x630');
  assert.ok(cardContent.includes('ZOTH'), 'Social card must include ZOTH brand title');

  const masterJpg = path.join(BRAND_DIR, 'zoth-golden-z-master.jpg');
  const emblemPng = path.join(BRAND_DIR, 'zoth-golden-z-emblem.png');
  const bannerPng = path.join(BRAND_DIR, 'zoth-golden-z-social-banner.png');

  assert.ok(fs.existsSync(masterJpg), 'zoth-golden-z-master.jpg must exist');
  assert.ok(fs.existsSync(emblemPng), 'zoth-golden-z-emblem.png must exist');
  assert.ok(fs.existsSync(bannerPng), 'zoth-golden-z-social-banner.png must exist');

  // Verify PNG headers (89 50 4E 47)
  const png512Header = fs.readFileSync(png512).subarray(0, 4);
  assert.deepStrictEqual(Array.from(png512Header), [0x89, 0x50, 0x4E, 0x47], 'Must be a valid PNG binary');
});

test('Universal Topbar branding links to new Golden Z mark', (t) => {
  const indexHtml = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf-8');
  const studioHtml = fs.readFileSync(path.join(PUBLIC_DIR, 'studio', 'site-generator.html'), 'utf-8');
  const zothHtml = fs.readFileSync(path.join(PUBLIC_DIR, 'zoth', 'index.html'), 'utf-8');
  const brandHtml = fs.readFileSync(path.join(PUBLIC_DIR, 'studio', 'brand.html'), 'utf-8');

  assert.ok(indexHtml.includes('/assets/brand/zoth-golden-z-192.png'), 'index.html topbar must use Golden Z PNG');
  assert.ok(studioHtml.includes('/assets/brand/zoth-golden-z-192.png'), 'site-generator.html topbar must use Golden Z PNG');
  assert.ok(zothHtml.includes('/assets/brand/zoth-golden-z-192.png'), 'zoth/index.html topbar must use Golden Z PNG');
  assert.ok(brandHtml.includes('/assets/brand/zoth-golden-z-master.jpg'), 'brand.html must feature AI master render');
});

