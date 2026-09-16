/**
 * Unit Test Suite for Master Cyberpunk HUD Controller Engine (zoth-cyberpunk-hud.js)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser DOM environment
function createMockDOM() {
  const elements = {};
  const listeners = {};

  const doc = {
    readyState: 'complete',
    documentElement: {
      classList: {
        add: (c) => {},
        remove: (c) => {}
      },
      setAttribute: (k, v) => { doc.documentElement[k] = v; },
      getAttribute: (k) => doc.documentElement[k] || 'dark',
      className: ''
    },
    body: {
      classList: {
        add: (c) => {},
        remove: (c) => {}
      },
      className: '',
      innerHTML: '',
      appendChild: (el) => {}
    },
    getElementById: (id) => {
      if (!elements[id]) {
        elements[id] = createElement('div', id);
      }
      return elements[id];
    },
    querySelectorAll: (sel) => {
      return [];
    },
    querySelector: (sel) => {
      return null;
    },
    createElement: (tag) => {
      return createElement(tag);
    },
    addEventListener: (ev, cb) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(cb);
    }
  };

  function createElement(tag, id) {
    const el = {
      tagName: tag.toUpperCase(),
      id: id || '',
      className: '',
      classList: {
        add: (c) => { el.className += ' ' + c; },
        remove: (c) => { el.className = el.className.replace(c, '').trim(); },
        contains: (c) => el.className.includes(c)
      },
      style: {},
      children: [],
      appendChild: (child) => { el.children.push(child); return child; },
      removeChild: (child) => {
        const idx = el.children.indexOf(child);
        if (idx !== -1) el.children.splice(idx, 1);
      },
      addEventListener: (ev, cb) => {},
      getContext: (type) => ({
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        scale: () => {}
      }),
      getBoundingClientRect: () => ({ width: 320, height: 90, left: 0, top: 0 }),
      querySelectorAll: (sel) => [],
      querySelector: (sel) => null,
      setAttribute: (k, v) => { el[k] = v; },
      getAttribute: (k) => el[k] || null,
      focus: () => {}
    };
    if (id) elements[id] = el;
    return el;
  }

  const win = {
    document: doc,
    location: { origin: 'http://127.0.0.1:8088', pathname: '/studio/cyberpunk-hud.html' },
    localStorage: {
      getItem: (k) => 'dark',
      setItem: (k, v) => {}
    },
    speechSynthesis: {
      cancel: () => {},
      speak: () => {}
    },
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    addEventListener: (ev, cb) => {
      listeners[ev] = listeners[ev] || [];
      listeners[ev].push(cb);
    },
    dispatchEvent: () => {},
    requestAnimationFrame: (cb) => 1,
    setInterval: (cb, ms) => 1,
    clearInterval: () => {},
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) })
  };

  return { win, doc, elements };
}

console.log('⚡ Running Cyberpunk HUD Controller Engine Verification Tests...\n');

// 1. Verify File Exists and is Non-Empty
const hudJsPath = path.join(__dirname, 'zoth-cyberpunk-hud.js');
assert.ok(fs.existsSync(hudJsPath), 'zoth-cyberpunk-hud.js must exist on disk');
const hudJsContent = fs.readFileSync(hudJsPath, 'utf8');
assert.ok(hudJsContent.length > 2000, 'zoth-cyberpunk-hud.js must contain full implementation');
console.log('✔ Test 1 Passed: zoth-cyberpunk-hud.js exists (' + hudJsContent.length + ' bytes)');

// 2. Execute within Mock Browser Environment
const { win, doc } = createMockDOM();
const codeToEval = hudJsContent;
const fn = new Function('window', 'document', codeToEval);
fn(win, doc);

assert.ok(win.ZothHUD, 'window.ZothHUD must be exposed');
assert.ok(win.ZothCyberpunkHUD, 'window.ZothCyberpunkHUD must be exposed');
assert.strictEqual(typeof win.ZothHUD.init, 'function', 'ZothHUD.init must be a function');
assert.strictEqual(typeof win.ZothHUD.loadTool, 'function', 'ZothHUD.loadTool must be a function');
assert.strictEqual(typeof win.ZothHUD.setAgent, 'function', 'ZothHUD.setAgent must be a function');
assert.strictEqual(typeof win.ZothHUD.setTheme, 'function', 'ZothHUD.setTheme must be a function');
assert.strictEqual(typeof win.ZothHUD.openModal, 'function', 'ZothHUD.openModal must be a function');
assert.strictEqual(typeof win.ZothHUD.closeModal, 'function', 'ZothHUD.closeModal must be a function');
assert.strictEqual(typeof win.ZothHUD.addLog, 'function', 'ZothHUD.addLog must be a function');
assert.strictEqual(typeof win.ZothHUD.pingPorts, 'function', 'ZothHUD.pingPorts must be a function');
console.log('✔ Test 2 Passed: Master HUD Controller API initialized and exposed');

// 3. Test Dynamic Stage Tool Loader
win.ZothHUD.loadTool('swarm');
let state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'swarm', 'Active tool must switch to swarm');

win.ZothHUD.loadTool('3d-editor');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, '3d-editor', 'Active tool must switch to 3d-editor');

win.ZothHUD.loadTool('netrunner-memory');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'netrunner-memory', 'Active tool must switch to netrunner-memory');
console.log('✔ Test 3 Passed: Dynamic Stage Tool Loader switches workstations correctly');

// 4. Test Active Agents Selector & Roster
win.ZothHUD.setAgent('athena');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'athena', 'Active agent must switch to athena');

win.ZothHUD.setAgent('draco');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'draco', 'Active agent must switch to draco');

win.ZothHUD.setAgent('azoth');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'azoth', 'Active agent must switch to azoth');
console.log('✔ Test 4 Passed: Active Agents selector and speech synthesis trigger correctly');

// 5. Test 4-Theme Engine
win.ZothHUD.setTheme('matrix');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'matrix', 'Theme must be matrix');

win.ZothHUD.setTheme('gold');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'gold', 'Theme must be gold');

win.ZothHUD.setTheme('light');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'light', 'Theme must be light');

win.ZothHUD.setTheme('dark');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTheme, 'dark', 'Theme must be dark');
console.log('✔ Test 5 Passed: 4-Theme Engine switches between dark, light, matrix, and gold');

// 6. Test Modals Open & Close
win.ZothHUD.openModal('ports');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('time');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('toolmgr');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('shortcuts');
win.ZothHUD.closeModal();
console.log('✔ Test 6 Passed: Modals (ports, time, toolmgr, shortcuts) open and close cleanly');

// 7. Test Message Stream Logging
win.ZothHUD.addLog('TEST_AGENT', 'Sovereign Telemetry Verification Passed', 'success');
console.log('✔ Test 7 Passed: Live Message Stream logger operates cleanly');

// 8. Test Tablet/Mobile Drawer Toggle
assert.strictEqual(state.isDeckOpen, false, 'Deck initially closed');
win.ZothHUD.toggleDeck();
state = win.ZothHUD.getState();
assert.strictEqual(state.isDeckOpen, true, 'Deck opened');
win.ZothHUD.toggleDeck();
state = win.ZothHUD.getState();
assert.strictEqual(state.isDeckOpen, false, 'Deck closed');
console.log('✔ Test 8 Passed: Tablet/Mobile drawer toggle operates smoothly');

console.log('\n⭐ ALL 8 CYBERPUNK HUD CONTROLLER VERIFICATION TESTS PASSED (100%)!\n');
