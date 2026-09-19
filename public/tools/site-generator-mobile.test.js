const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const HTML_PATH = fs.existsSync(path.join(__dirname, '..', 'studio', 'webgen.html'))
  ? path.join(__dirname, '..', 'studio', 'webgen.html')
  : path.join(__dirname, '..', 'studio', 'site-generator.html');

test('Website Generator mobile dual-mode DOM structure is valid', (t) => {
  assert.ok(fs.existsSync(HTML_PATH), 'webgen.html / site-generator.html must exist');
  const html = fs.readFileSync(HTML_PATH, 'utf-8');

  // Verify Mobile / Device View Switcher
  assert.ok(
    html.includes('id="webgenDeviceFrame"') || html.includes('id="mobileViewSwitcher"'),
    'Must contain #webgenDeviceFrame or #mobileViewSwitcher'
  );
  assert.ok(
    html.includes('id="btnViewMobile"') || html.includes('id="btnMobileChat"'),
    'Must contain #btnViewMobile or #btnMobileChat'
  );
  assert.ok(
    html.includes('id="btnViewDesktop"') || html.includes('id="btnMobilePreview"'),
    'Must contain #btnViewDesktop or #btnMobilePreview'
  );

  // Verify Preview Iframe & Device Viewport
  assert.ok(
    html.includes('id="webgenPreviewIframe"') || html.includes('id="previewIframe"'),
    'Must contain preview iframe'
  );
  assert.ok(
    html.includes('class="device-frame-viewport"') || html.includes('stage-panel'),
    'Must contain device viewport wrapper'
  );

  // Verify Mobile Chassis / Bezel Elements
  assert.ok(
    html.includes('device-frame-bezel-top') || html.includes('mobile-stage-nav-row'),
    'Must contain mobile bezel or stage navigation'
  );

  // Verify Prompt & Template Controls
  assert.ok(
    html.includes('id="promptInput"') || html.includes('assistant-chat-bubble'),
    'Must contain prompt input or assistant chat'
  );
  assert.ok(
    html.includes('webgen-chip') || html.includes('mobileStepIndicator'),
    'Must contain quick starter chips or step indicator'
  );
});

test('Website Generator mobile responsive CSS and layout rules are valid', (t) => {
  const html = fs.readFileSync(HTML_PATH, 'utf-8');

  // Verify CSS Media Queries & Breakpoints
  assert.ok(
    html.includes('@media (max-width: 768px)') ||
    html.includes('@media (max-width: 960px)') ||
    html.includes('@media (max-width: 1024px)'),
    'Must contain mobile/tablet media query breakpoint'
  );
  assert.ok(
    html.includes('.device-mode-mobile') || html.includes('.mode-chat'),
    'Must support mobile mode CSS styling'
  );
  assert.ok(
    html.includes('.device-frame-viewport') || html.includes('.mobile-view-switcher'),
    'Must define device viewport or view switcher CSS'
  );
  assert.ok(
    html.includes('min-height: 44px'),
    'Must enforce minimum 44px touch targets for mobile accessibility'
  );
});

test('Website Generator mobile JavaScript view controller functions operate correctly', (t) => {
  const html = fs.readFileSync(HTML_PATH, 'utf-8');

  // Verify JS Controller Functions
  assert.ok(
    html.includes('function setDeviceMode') || html.includes('function setMobileLayoutMode'),
    'Must define setDeviceMode() or setMobileLayoutMode()'
  );

  // Verify Mobile device mode handling
  assert.ok(
    html.includes("setDeviceMode('mobile')") || html.includes('setMobileLayoutMode("preview")'),
    'Must support mobile mode switching'
  );

  // Verify Mobile dimensions or indicator handling
  assert.ok(
    html.includes('mobile: { w: 390, h: 844 }') || html.includes('mobileStepIndicator'),
    'Must configure mobile dimensions or step indicators'
  );

  // Verify Mobile button active state or hotkey handling
  assert.ok(
    html.includes('btnMobile') || html.includes('toggleMobileLayoutMode'),
    'Must manage mobile button state or toggles'
  );
});
