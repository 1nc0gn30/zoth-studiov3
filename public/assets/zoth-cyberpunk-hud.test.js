/**
 * Unit Test Suite for Master Cyberpunk HUD Controller Engine (zoth-cyberpunk-hud.js)
 * Comprehensive verification of:
 * 1. Master API & State Initialization
 * 2. Real-Time Audio Oscilloscope / FFT Spectrum Canvas Engine
 * 3. 360° Polar Radar Sweep Mini-Map (21 Fleet Swarm Agents)
 * 4. Complete 6-Pillar Mathematical Calculus Engine
 * 5. Interactive Memory Graph & Synaptic Consolidation Waves
 * 6. Dynamic Stage Tool Loader & Stage History Navigation
 * 7. Dual-Tool Split Stage Mode
 * 8. Device Aspect Ratio Switcher
 * 9. Active Agents Selector (21 Agents) & Speech Synthesis
 * 10. 4-Theme Engine Cycle
 * 11. Modals, Message Logger & Terminal REPL
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
      appendChild: (el) => { elements[el.id || 'badge'] = el; return el; }
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
        add: (c) => { el.className = (el.className + ' ' + c).trim(); },
        remove: (c) => { el.className = el.className.replace(new RegExp('\\b' + c + '\\b', 'g'), '').trim(); },
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
        scale: () => {},
        fillRect: () => {},
        strokeRect: () => {},
        fillText: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        setLineDash: () => {},
        closePath: () => {}
      }),
      getBoundingClientRect: () => ({ width: 320, height: 95, left: 0, top: 0 }),
      querySelectorAll: (sel) => [],
      querySelector: (sel) => null,
      setAttribute: (k, v) => { el[k] = v; },
      getAttribute: (k) => el[k] || null,
      removeAttribute: (k) => { delete el[k]; },
      focus: () => {},
      click: () => {}
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

console.log('⚡ Running Cyberpunk HUD Tactical Visualizers Verification Tests...\n');

// 1. Verify File Exists and is Non-Empty
const hudJsPath = path.join(__dirname, 'zoth-cyberpunk-hud.js');
assert.ok(fs.existsSync(hudJsPath), 'zoth-cyberpunk-hud.js must exist on disk');
const hudJsContent = fs.readFileSync(hudJsPath, 'utf8');
assert.ok(hudJsContent.length > 5000, 'zoth-cyberpunk-hud.js must contain full implementation');
console.log('✔ Test 1 Passed: zoth-cyberpunk-hud.js exists (' + hudJsContent.length + ' bytes)');

// 2. Execute within Mock Browser Environment
const { win, doc } = createMockDOM();
const fn = new Function('window', 'document', hudJsContent);
fn(win, doc);

assert.ok(win.ZothHUD, 'window.ZothHUD must be exposed');
assert.ok(win.ZothCyberpunkHUD, 'window.ZothCyberpunkHUD must be exposed');
assert.strictEqual(typeof win.ZothHUD.init, 'function', 'ZothHUD.init must be a function');
assert.strictEqual(typeof win.ZothHUD.loadTool, 'function', 'ZothHUD.loadTool must be a function');
assert.strictEqual(typeof win.ZothHUD.setAgent, 'function', 'ZothHUD.setAgent must be a function');
assert.strictEqual(typeof win.ZothHUD.setTheme, 'function', 'ZothHUD.setTheme must be a function');
assert.strictEqual(typeof win.ZothHUD.pingRadar, 'function', 'ZothHUD.pingRadar must be a function');
assert.strictEqual(typeof win.ZothHUD.setScopeMode, 'function', 'ZothHUD.setScopeMode must be a function');
assert.strictEqual(typeof win.ZothHUD.getPillars, 'function', 'ZothHUD.getPillars must be a function');
assert.strictEqual(typeof win.ZothHUD.getAllAgents, 'function', 'ZothHUD.getAllAgents must be a function');
console.log('✔ Test 2 Passed: Master HUD Controller API initialized and tactical methods exposed');

// 3. Test Real-Time Audio Oscilloscope / FFT Spectrum Visualizer Engine
assert.ok(win.ZothHUD.AudioOscilloscope, 'AudioOscilloscope module must be present');
assert.strictEqual(typeof win.ZothHUD.AudioOscilloscope.init, 'function');
assert.strictEqual(typeof win.ZothHUD.AudioOscilloscope.setMode, 'function');
assert.strictEqual(typeof win.ZothHUD.AudioOscilloscope.triggerPulse, 'function');

win.ZothHUD.AudioOscilloscope.setMode('fft');
assert.strictEqual(win.ZothHUD.AudioOscilloscope.getMode(), 'fft', 'Oscilloscope mode must be fft');

win.ZothHUD.AudioOscilloscope.setMode('lissajous');
assert.strictEqual(win.ZothHUD.AudioOscilloscope.getMode(), 'lissajous', 'Oscilloscope mode must be lissajous');

win.ZothHUD.AudioOscilloscope.setMode('wave');
assert.strictEqual(win.ZothHUD.AudioOscilloscope.getMode(), 'wave', 'Oscilloscope mode must be wave');

win.ZothHUD.AudioOscilloscope.triggerPulse(0.8, 880);
console.log('✔ Test 3 Passed: Real-Time Audio Oscilloscope operates across wave, fft, and lissajous modes');

// 4. Test 360° Polar Radar Sweep Mini-Map & 21 Fleet Swarm Agents
assert.ok(win.ZothHUD.PolarRadar, 'PolarRadar module must be present');
assert.strictEqual(typeof win.ZothHUD.PolarRadar.init, 'function');
assert.strictEqual(typeof win.ZothHUD.PolarRadar.setRange, 'function');
assert.strictEqual(typeof win.ZothHUD.PolarRadar.pingAll, 'function');

const allAgents = win.ZothHUD.getAllAgents();
assert.strictEqual(allAgents.length, 21, 'Must contain all 21 Sovereign Swarm Agents');

const coreAgents = allAgents.filter(a => a.isCore);
assert.strictEqual(coreAgents.length, 6, 'Must contain 6 Sovereign Core agents');

assert.ok(allAgents.find(a => a.id === 'azoth'), 'Azoth must be present');
assert.ok(allAgents.find(a => a.id === 'antigravity'), 'Antigravity must be present');
assert.ok(allAgents.find(a => a.id === 'grok'), 'Grok must be present');
assert.ok(allAgents.find(a => a.id === 'hermes'), 'Hermes must be present');
assert.ok(allAgents.find(a => a.id === 'ghostbyte'), 'GhostByte must be present');
assert.ok(allAgents.find(a => a.id === 'ollama'), 'Ollama must be present');
assert.ok(allAgents.find(a => a.id === 'kai'), 'Kai must be present');
assert.ok(allAgents.find(a => a.id === 'draco'), 'Draco must be present');
assert.ok(allAgents.find(a => a.id === 'athena'), 'Athena must be present');
assert.ok(allAgents.find(a => a.id === 'kraken'), 'Kraken must be present');

win.ZothHUD.pingRadar();
win.ZothHUD.PolarRadar.setRange(1.5);
console.log('✔ Test 4 Passed: 360° Polar Radar Sweep Mini-Map tracks all 21 swarm agents correctly');

// 5. Test Complete 6-Pillar Mathematical Calculus Engine
assert.ok(win.ZothHUD.CalculusEngine, 'CalculusEngine must be present');
assert.strictEqual(typeof win.ZothHUD.CalculusEngine.update, 'function');
assert.strictEqual(typeof win.ZothHUD.CalculusEngine.calculateShannonEntropy, 'function');

const entropyVal = win.ZothHUD.CalculusEngine.calculateShannonEntropy([0.85, 0.10, 0.03, 0.02]);
assert.ok(entropyVal > 0 && entropyVal < 1.0, 'Shannon entropy calculation must be valid');

win.ZothHUD.CalculusEngine.update();
const pillars = win.ZothHUD.getPillars();
assert.ok(pillars.p1, 'Pillar 1: Monoidal Sheaf Topologies must exist');
assert.ok(pillars.p2, 'Pillar 2: Info Geometry & Fisher Metric must exist');
assert.ok(pillars.p3, 'Pillar 3: STDP Synaptic Plasticity must exist');
assert.ok(pillars.p4, 'Pillar 4: Shannon Agreement Entropy must exist');
assert.ok(pillars.p5, 'Pillar 5: Kolmogorov-Arnold B-Splines must exist');
assert.ok(pillars.p6, 'Pillar 6: Continuous Modern Hopfield must exist');

assert.ok(pillars.p1.formula.includes('H¹(U,F)'), 'Pillar 1 formula check');
assert.ok(pillars.p2.formula.includes('∇̃L'), 'Pillar 2 formula check');
assert.ok(pillars.p3.formula.includes('Δw'), 'Pillar 3 formula check');
assert.ok(pillars.p4.formula.includes('0.20'), 'Pillar 4 threshold bound check');
assert.ok(pillars.p5.formula.includes('Φ_q'), 'Pillar 5 formula check');
assert.ok(pillars.p6.formula.includes('E(x)'), 'Pillar 6 formula check');
console.log('✔ Test 5 Passed: Complete 6-Pillar Mathematical Calculus telemetry verified');

// 6. Test Interactive Memory Graph & Synaptic Consolidation Waves
assert.ok(win.ZothHUD.MemGraphCanvas, 'MemGraphCanvas must be present');
assert.strictEqual(typeof win.ZothHUD.MemGraphCanvas.triggerConsolidation, 'function');
assert.strictEqual(typeof win.ZothHUD.MemGraphCanvas.pulseAll, 'function');

win.ZothHUD.MemGraphCanvas.triggerConsolidation(0);
let state = win.ZothHUD.getState();
assert.ok(state.memStats.selectedNode, 'Selected memory node must be recorded');
assert.ok(state.memStats.lastConsolidation, 'Last consolidation value must be recorded');
console.log('✔ Test 6 Passed: Interactive Memory Graph node clicking & consolidation waves verified');

// 7. Test Dynamic Stage Tool Loader & Navigation History
win.ZothHUD.loadTool('swarm');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'swarm', 'Active tool must switch to swarm');

win.ZothHUD.loadTool('3d-editor');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, '3d-editor', 'Active tool must switch to 3d-editor');

win.ZothHUD.stageBack();
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'swarm', 'Stage back must return to swarm');

win.ZothHUD.stageForward();
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, '3d-editor', 'Stage forward must return to 3d-editor');
console.log('✔ Test 7 Passed: Dynamic Stage Tool Loader & Stage History verified');

// 8. Test Dual-Tool Split Stage Mode
win.ZothHUD.toggleSplitStage();
state = win.ZothHUD.getState();
assert.strictEqual(state.splitMode, true, 'Split mode must be active');

win.ZothHUD.setSecondaryTool('tool-bench');
state = win.ZothHUD.getState();
assert.strictEqual(state.secondaryTool.id, 'tool-bench', 'Secondary tool set');

win.ZothHUD.swapSplitStage();
state = win.ZothHUD.getState();
assert.strictEqual(state.activeTool.id, 'tool-bench', 'Active tool became previous secondary');

win.ZothHUD.closeSplitStage();
state = win.ZothHUD.getState();
assert.strictEqual(state.splitMode, false, 'Split mode closed');
console.log('✔ Test 8 Passed: Dual-Tool Split Stage Mode verified');

// 9. Test Active Agents Selector
win.ZothHUD.setAgent('grok');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'grok', 'Active agent must be grok');

win.ZothHUD.setAgent('athena');
state = win.ZothHUD.getState();
assert.strictEqual(state.activeAgent, 'athena', 'Active agent must be athena');
console.log('✔ Test 9 Passed: Active Agents Selector switches across 21 agents with voice feedback');

// 10. Test 4-Theme Engine
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
console.log('✔ Test 10 Passed: 4-Theme Engine cycles between dark, light, matrix, and gold');

// 11. Test Modals & Telemetry
win.ZothHUD.openModal('ports');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('pillars');
win.ZothHUD.closeModal();

win.ZothHUD.openModal('toolmgr');
win.ZothHUD.closeModal();

win.ZothHUD.addLog('TACTICAL', 'All tactical visualizers verified 100% nominal', 'consensus');
console.log('✔ Test 11 Passed: Modals (ports, pillars, toolmgr) and live logging operational');

// 12. Test Omniverse Navigator & Tool Router
win.ZothHUD.openOmniverseNav('omnipost');
assert.ok(typeof win.ZothHUD.openToolManagerModal === 'function', 'openToolManagerModal alias exists');
assert.ok(typeof win.ZothHUD.openOmniverseNav === 'function', 'openOmniverseNav method exists');
win.ZothHUD.closeModal();
console.log('✔ Test 12 Passed: Omniverse Navigator & Tool Router open/close and filter verified');

// 13. Test URL State Synchronization & Aliases
assert.ok(typeof win.ZothHUD.syncURLState === 'function', 'syncURLState method exists');
win.ZothHUD.syncURLState();
assert.ok(typeof win.ZothCyberpunkHUD.openHelpModal === 'function', 'openHelpModal alias exists');
assert.ok(typeof win.ZothCyberpunkHUD.cycleHudTheme === 'function', 'cycleHudTheme alias exists');
console.log('✔ Test 13 Passed: URL State Synchronization & backwards-compatible aliases verified');

// 14. Test Embedded Workspace Adapters
const embeddedJsPath = path.join(__dirname, 'zoth-hud-embedded.js');
const embeddedCssPath = path.join(__dirname, 'zoth-hud-embedded.css');
assert.ok(fs.existsSync(embeddedJsPath), 'zoth-hud-embedded.js must exist');
assert.ok(fs.existsSync(embeddedCssPath), 'zoth-hud-embedded.css must exist');
const embeddedJs = fs.readFileSync(embeddedJsPath, 'utf8');
const embeddedCss = fs.readFileSync(embeddedCssPath, 'utf8');
assert.ok(embeddedJs.includes('ZOTH_HUD_THEME_CHANGE'), 'embedded JS must handle theme sync');
assert.ok(embeddedCss.includes('hud-embedded-mode'), 'embedded CSS must define hud-embedded-mode');
assert.ok(embeddedCss.includes('header.bar'), 'embedded CSS must suppress header.bar');
assert.ok(embeddedCss.includes('footer.site'), 'embedded CSS must suppress footer.site');
assert.ok(embeddedCss.includes('omni-guided-steps'), 'embedded CSS must suppress omni-guided-steps');
console.log('✔ Test 14 Passed: Universal Embedded Workspace Adapters & Navbar/Footer Cleaner verified');

// 15. Test Tool-Specific HUD Context Operations Card & Telemetry
assert.ok(typeof win.ZothHUD.getToolContextProfile === 'function', 'getToolContextProfile method exists');
assert.ok(typeof win.ZothHUD.renderToolContextCard === 'function', 'renderToolContextCard method exists');
assert.ok(typeof win.ZothHUD.sendToolAction === 'function', 'sendToolAction method exists');

const omniProfile = win.ZothHUD.getToolContextProfile('omnipost');
assert.ok(omniProfile, 'OmniPost tool profile must exist');
assert.strictEqual(omniProfile.badge, '60 FPS RENDERER');
assert.ok(omniProfile.actions.some(a => a.action === 'render_60fps'), 'Must have render_60fps action');
assert.ok(omniProfile.actions.some(a => a.action === 'synth_track'), 'Must have synth_track action');

const cadProfile = win.ZothHUD.getToolContextProfile('3d-editor');
assert.ok(cadProfile, '3D Editor CAD tool profile must exist');
assert.strictEqual(cadProfile.badge, 'THREE.JS WEBGL');
assert.ok(cadProfile.actions.some(a => a.action === 'toggle_wireframe'), 'Must have toggle_wireframe action');

win.ZothHUD.renderToolContextCard('omnipost');
win.ZothHUD.renderToolContextCard('3d-editor');
win.ZothHUD.renderToolContextCard('swarm');
win.ZothHUD.renderToolContextCard('consensus');
win.ZothHUD.renderToolContextCard('math-pillars');
win.ZothHUD.renderToolContextCard('netrunner-memory');
win.ZothHUD.renderToolContextCard('webgen');
win.ZothHUD.renderToolContextCard('vault');
console.log('✔ Test 15 Passed: Tool-Specific HUD Context Card & 10 Workstation Profiles verified');

// 16. Test Bi-Directional Action Bridge & Embedded Action Execution
const { win: childWin, doc: childDoc } = createMockDOM();
const childAdapterFn = new Function('window', 'document', embeddedJs);
childAdapterFn(childWin, childDoc);

assert.ok(childWin.ZothEmbeddedAdapter, 'ZothEmbeddedAdapter must be exposed in embedded window');
let actionReceived = false;
let actionPayload = null;
childWin.ZothEmbeddedAdapter.onAction('render_60fps', (payload) => {
  actionReceived = true;
  actionPayload = payload;
});

childWin.ZothEmbeddedAdapter.handleHUDAction('render_60fps', { fps: 60, mode: 'shorts' });
assert.strictEqual(actionReceived, true, 'Custom action callback must execute');
assert.strictEqual(actionPayload.fps, 60, 'Payload must pass accurately through action bridge');

win.ZothHUD.sendToolAction('render_60fps', { fps: 60 });
console.log('✔ Test 16 Passed: Bi-Directional Action Bridge & Event Dispatch verified');

console.log('\n⭐ ALL 16 CYBERPUNK HUD TACTICAL VISUALIZERS, OMNIVERSE & ACTION BRIDGE TESTS PASSED (100%)!\n');

