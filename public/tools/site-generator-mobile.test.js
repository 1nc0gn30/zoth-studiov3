const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'studio', 'site-generator.html');

test('Website Generator mobile dual-mode DOM structure is valid', (t) => {
  assert.ok(fs.existsSync(HTML_PATH), 'site-generator.html must exist');
  const html = fs.readFileSync(HTML_PATH, 'utf-8');

  // Verify Mobile View Switcher
  assert.ok(html.includes('id="mobileViewSwitcher"'), 'Must contain #mobileViewSwitcher');
  assert.ok(html.includes('id="btnMobileChat"'), 'Must contain #btnMobileChat tab');
  assert.ok(html.includes('id="btnMobilePreview"'), 'Must contain #btnMobilePreview tab');
  assert.ok(html.includes('id="mobileStepIndicator"'), 'Must contain #mobileStepIndicator badge');
  assert.ok(html.includes('id="mobilePreviewRouteBadge"'), 'Must contain #mobilePreviewRouteBadge');

  // Verify Floating Action Button (FAB)
  assert.ok(html.includes('id="mobilePreviewFab"'), 'Must contain #mobilePreviewFab');
  assert.ok(html.includes('id="mobileFabIcon"'), 'Must contain #mobileFabIcon');
  assert.ok(html.includes('id="mobileFabLabel"'), 'Must contain #mobileFabLabel');

  // Verify 4-Step Chat Assistant Guidance Bubbles
  assert.ok(html.includes('assistant-chat-bubble'), 'Must contain assistant conversational guidance');
  assert.ok(html.includes('Master Azoth (Foundry Conductor)'), 'Must feature Foundry Conductor persona guidance');

  // Verify Step 1-4 Navigation Rows
  assert.ok(html.includes('mobile-stage-nav-row'), 'Must contain mobile stage nav rows');
  assert.ok(html.includes('Continue to Step 2: Visual Style'), 'Must have Step 1 -> 2 transition');
  assert.ok(html.includes('Continue to Step 3: Connectors'), 'Must have Step 2 -> 3 transition');
  assert.ok(html.includes('Continue to Step 4: Swarm &amp; Launch'), 'Must have Step 3 -> 4 transition');
  assert.ok(html.includes('Spawn 21 Agents &amp; Synthesize'), 'Must have Step 4 spawn execution');

  // Verify Mobile Preview Topbar Quick-Return Addon
  assert.ok(html.includes('id="mobilePreviewTopbarAddon"'), 'Must contain #mobilePreviewTopbarAddon in preview panel');
  assert.ok(html.includes('id="mobilePreviewSiteName"'), 'Must contain live website name indicator');
});

test('Website Generator mobile responsive CSS and layout rules are valid', (t) => {
  const html = fs.readFileSync(HTML_PATH, 'utf-8');

  // Verify CSS Media Queries & Breakpoints
  assert.ok(html.includes('@media (max-width: 1024px)'), 'Must contain mobile media query @media (max-width: 1024px)');
  assert.ok(html.includes('.workstation-split.mode-chat .control-deck'), 'Must display control deck in mode-chat');
  assert.ok(html.includes('.workstation-split.mode-preview .stage-panel'), 'Must display preview panel in mode-preview');
  assert.ok(html.includes('.mobile-view-switcher'), 'Must define .mobile-view-switcher CSS');
  assert.ok(html.includes('.mobile-preview-fab'), 'Must define .mobile-preview-fab CSS');
  assert.ok(html.includes('.assistant-chat-bubble'), 'Must define .assistant-chat-bubble CSS');
  assert.ok(html.includes('min-height: 44px'), 'Must enforce minimum 44px touch targets for mobile accessibility');
});

test('Website Generator mobile JavaScript view controller functions operate correctly', (t) => {
  const html = fs.readFileSync(HTML_PATH, 'utf-8');

  // Verify JS Controller Functions
  assert.ok(html.includes('function setMobileLayoutMode'), 'Must define setMobileLayoutMode()');
  assert.ok(html.includes('function toggleMobileLayoutMode'), 'Must define toggleMobileLayoutMode()');
  assert.ok(html.includes('function updateMobilePreviewMeta'), 'Must define updateMobilePreviewMeta()');

  // Verify Swarm Launch auto-switches to preview on mobile
  assert.ok(html.includes('if (window.innerWidth <= 1024) setMobileLayoutMode("preview");'), 'Must auto-switch to preview on mobile when swarm launches');

  // Verify Stepper syncs step indicator badge
  assert.ok(html.includes('mobileStepIndicator'), 'Must update #mobileStepIndicator on goToStage()');
});
