const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..');

test('Zoth Universal Navbar CSS & JS assets exist and are valid', (t) => {
  const cssPath = path.join(PUBLIC_DIR, 'assets', 'zoth-nav.css');
  const jsPath = path.join(PUBLIC_DIR, 'assets', 'zoth-nav.js');

  assert.ok(fs.existsSync(cssPath), 'zoth-nav.css must exist');
  assert.ok(fs.existsSync(jsPath), 'zoth-nav.js must exist');

  const css = fs.readFileSync(cssPath, 'utf-8');
  const js = fs.readFileSync(jsPath, 'utf-8');

  // Verify dropdown rules in CSS
  assert.ok(css.includes('.nav-dropdown'), 'Must contain .nav-dropdown container class');
  assert.ok(css.includes('.nav-dropdown-btn'), 'Must contain .nav-dropdown-btn class');
  assert.ok(css.includes('.nav-dropdown-menu'), 'Must contain .nav-dropdown-menu class');
  assert.ok(css.includes('.nav-dropdown-menu::before'), 'Must contain hover bridge ::before');
  assert.ok(css.includes('z-index: 100000'), 'Must have high z-index stacking context');
  assert.ok(css.includes('opacity: 1 !important'), 'Must force visibility on open/hover');

  // Verify dropdown handlers in JS
  assert.ok(js.includes('initNav'), 'Must have initNav function');
  assert.ok(js.includes('mouseenter'), 'Must have hover listener');
  assert.ok(js.includes('mouseleave'), 'Must have leave listener with grace timer');
  assert.ok(js.includes('aria-expanded'), 'Must manage aria-expanded accessibility');
  assert.ok(js.includes('Escape'), 'Must support Escape key dismiss');
});

test('Master Azoth flagship page (/zoth/index.html) has full dropdown navigation', (t) => {
  const htmlPath = path.join(PUBLIC_DIR, 'zoth', 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'zoth/index.html must exist');

  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Must link zoth-nav.css and zoth-nav.js
  assert.ok(html.includes('/assets/zoth-nav.css'), 'Must link zoth-nav.css');
  assert.ok(html.includes('/assets/zoth-nav.js'), 'Must link zoth-nav.js');

  // Must contain all 4 dropdown menus
  assert.ok(html.includes('<span>Core</span>'), 'Must contain Core dropdown');
  assert.ok(html.includes('<span>Studio</span>'), 'Must contain Studio dropdown');
  assert.ok(html.includes('<span>Universe</span>'), 'Must contain Universe dropdown');
  assert.ok(html.includes('<span>Docs &amp; Vault</span>') || html.includes('<span>Docs & Vault</span>'), 'Must contain Docs dropdown');

  // Must contain key navigation destination links
  assert.ok(html.includes('href="/zoth/"'), 'Must link to Master Azoth');
  assert.ok(html.includes('href="/agents/"'), 'Must link to Agents Pantheon');
  assert.ok(html.includes('href="/studio/"'), 'Must link to Studio Directory');
  assert.ok(html.includes('href="/studio/nexus-3d.html"'), 'Must link to Nexus 3D');
  assert.ok(html.includes('href="/studio/site-generator.html"'), 'Must link to Website Generator');
  assert.ok(html.includes('href="/comic/"'), 'Must link to Comic series');
  assert.ok(html.includes('href="/docs/"'), 'Must link to Docs');
  assert.ok(html.includes('href="/vault/"'), 'Must link to Vault');

  // Must NOT have overriding legacy nav styles
  assert.ok(!html.includes('z-index: 40;\n        display: flex; align-items: center; gap: var(--fib-21);'), 'Must not have legacy header.bar z-index 40');
});

test('Master Azoth Agent Codex page (/agents/azoth.html) has full dropdown navigation', (t) => {
  const htmlPath = path.join(PUBLIC_DIR, 'agents', 'azoth.html');
  assert.ok(fs.existsSync(htmlPath), 'agents/azoth.html must exist');

  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('/assets/zoth-nav.css'), 'Must link zoth-nav.css');
  assert.ok(html.includes('/assets/zoth-nav.js'), 'Must link zoth-nav.js');
  assert.ok(html.includes('<span>Core</span>'), 'Must contain Core dropdown');
  assert.ok(html.includes('<span>Studio</span>'), 'Must contain Studio dropdown');
});

test('Hub Master Home page (/index.html) has full dropdown navigation', (t) => {
  const htmlPath = path.join(PUBLIC_DIR, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');

  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('/assets/zoth-nav.css'), 'Must link zoth-nav.css');
  assert.ok(html.includes('/assets/zoth-nav.js'), 'Must link zoth-nav.js');
  assert.ok(html.includes('<span>Core</span>'), 'Must contain Core dropdown');
  assert.ok(html.includes('<span>Studio</span>'), 'Must contain Studio dropdown');
  assert.ok(html.includes('<span>Universe</span>'), 'Must contain Universe dropdown');
});
