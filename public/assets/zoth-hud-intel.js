/**
 * HUD intelligence: dashboard home, per-tool acclimation, learned recents,
 * iframe/port self-heal. Wraps ZothHUD after it boots.
 */
(function (window, document) {
  'use strict';
  if (window.ZothHudIntel && window.ZothHudIntel.ready) return;

  var LEARN_KEY = 'zoth-hud-learn-v1';
  var AGENT_FOR_TOOL = {
    omnipost: 'azoth',
    '3d-editor': 'azoth',
    'nexus-3d': 'azoth',
    pets: 'azoth',
    webgen: 'hermes',
    'vos-sandbox': 'hermes',
    'edge-forge': 'hermes',
    'tool-bench': 'hermes',
    'tool-nexus': 'hermes',
    vault: 'lycan',
    adytum: 'lycan',
    subsweep: 'onyx',
    'netrunner-memory': 'leviathan',
    consensus: 'draco',
    'fusion-arena': 'draco',
    'math-pillars': 'grok',
    'signal-bridge': 'aether',
    'web3-hub': 'kitsune',
    swarm: 'azoth',
    'bus-monitor': 'aether',
    'agent-composer': 'antigravity',
    'vision-link': 'kai'
  };

  function loadLearn() {
    try {
      var raw = window.localStorage.getItem(LEARN_KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (data && data.v === 1) return data;
    } catch (e) {}
    return { v: 1, tools: {}, recents: [], lastTool: '', lastAgent: 'azoth' };
  }

  function saveLearn(data) {
    try { window.localStorage.setItem(LEARN_KEY, JSON.stringify(data)); } catch (e) {}
  }

  var LEARN = loadLearn();
  var dwellStarted = 0;
  var dwellTool = '';
  var healTimers = {};
  var iframeAlive = false;

  function recordOpen(toolId) {
    if (!toolId || toolId === 'dashboard') return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.opens += 1;
    rec.last = Date.now();
    LEARN.tools[toolId] = rec;
    LEARN.recents = [toolId].concat(LEARN.recents.filter(function (id) { return id !== toolId; })).slice(0, 10);
    LEARN.lastTool = toolId;
    saveLearn(LEARN);
  }

  function recordDwell(toolId) {
    if (!toolId || !dwellStarted) return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.dwellMs += Math.max(0, Date.now() - dwellStarted);
    LEARN.tools[toolId] = rec;
    saveLearn(LEARN);
  }

  function recordError(toolId) {
    if (!toolId) return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.errors += 1;
    LEARN.tools[toolId] = rec;
    saveLearn(LEARN);
  }

  function savePref(toolId, patch) {
    if (!toolId) return;
    var rec = LEARN.tools[toolId] || { opens: 0, last: 0, dwellMs: 0, errors: 0, prefs: {} };
    rec.prefs = rec.prefs || {};
    Object.keys(patch || {}).forEach(function (k) { rec.prefs[k] = patch[k]; });
    LEARN.tools[toolId] = rec;
    saveLearn(LEARN);
  }

  function prefsFor(toolId) {
    return (LEARN.tools[toolId] && LEARN.tools[toolId].prefs) || {};
  }

  function relatedTools(toolId) {
    var hud = window.ZothHUD;
    var list = (hud && hud.getState && window.ZothHUD) ? null : null;
    var stations = [];
    try {
      stations = window.ZothHUD.getState ? [] : [];
    } catch (e) {}
    var all = document.querySelectorAll('.hud-dock-tab[data-tool]');
    var ids = [];
    all.forEach(function (el) { ids.push(el.getAttribute('data-tool')); });
    var recents = LEARN.recents.filter(function (id) { return id !== toolId; });
    return recents.slice(0, 4);
  }

  function setMode(mode, tool) {
    var shell = document.querySelector('.hud-app-shell');
    if (!shell) return;
    shell.setAttribute('data-hud-mode', mode);
    if (tool && tool.id) {
      shell.setAttribute('data-hud-tool', tool.id);
      shell.setAttribute('data-hud-cat', (tool.catSlug || tool.category || 'workstation').toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    } else {
      shell.setAttribute('data-hud-tool', 'dashboard');
      shell.setAttribute('data-hud-cat', 'dashboard');
    }
    document.body.setAttribute('data-hud-mode', mode);
  }

  function ensureDashboard() {
    var viewport = document.getElementById('hud-stage-viewport') || document.getElementById('hudStageViewport');
    if (!viewport) return null;
    var el = document.getElementById('hud-dashboard');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'hud-dashboard';
    el.className = 'hud-dashboard';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'HUD dashboard');
    viewport.appendChild(el);
    return el;
  }

  function ensureHeal() {
    var pane = document.getElementById('hud-stage-pri-pane');
    if (!pane) return null;
    var el = document.getElementById('hud-stage-heal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'hud-stage-heal';
    el.className = 'hud-stage-heal';
    el.hidden = true;
    el.innerHTML = '<div class="hud-heal-card">' +
      '<div class="hud-heal-title">STAGE SELF-HEAL</div>' +
      '<p class="hud-heal-copy" id="hud-heal-copy">Workstation did not mount. Retrying…</p>' +
      '<div class="hud-heal-actions">' +
      '<button type="button" class="hud-stage-btn" id="hud-heal-retry">RETRY</button>' +
      '<button type="button" class="hud-stage-btn" id="hud-heal-dash">DASHBOARD</button>' +
      '</div></div>';
    pane.appendChild(el);
    var retry = el.querySelector('#hud-heal-retry');
    var dash = el.querySelector('#hud-heal-dash');
    if (retry) retry.addEventListener('click', function () { window.ZothHudIntel.retryStage(); });
    if (dash) dash.addEventListener('click', function () { window.ZothHudIntel.showDashboard(); });
    return el;
  }

  function renderDashboard() {
    var el = ensureDashboard();
    if (!el) return;
    var tiles = [];
    PRIMARY_FALLBACK().forEach(function (t) {
      tiles.push(t);
    });
    var recents = LEARN.recents.slice(0, 6);
    var health = window.ZothHudIntel.health || {};
    var healthHtml = ['8484', '8788', '8088', '11434'].map(function (p) {
      var ok = health[p];
      var cls = ok === true ? 'ok' : (ok === false ? 'down' : 'unk');
      return '<span class="hud-health-chip ' + cls + '">:' + p + '</span>';
    }).join('');
    var recentHtml = recents.length
      ? recents.map(function (id) {
          var t = findTool(id);
          var n = t ? t.shortName || t.name : id;
          return '<button type="button" class="hud-dash-tile" data-open="' + id + '"><span>' + n + '</span><small>' + ((LEARN.tools[id] && LEARN.tools[id].opens) || 0) + ' opens</small></button>';
        }).join('')
      : '<p class="hud-dash-empty">No recents yet. Open a workstation from the dock or All Tools.</p>';
    var allHtml = tiles.slice(0, 16).map(function (t) {
      return '<button type="button" class="hud-dash-tile" data-open="' + t.id + '"><strong>' + (t.shortName || t.name) + '</strong><small>' + (t.category || '') + '</small></button>';
    }).join('');
    el.innerHTML =
      '<div class="hud-dash-head">' +
        '<div><div class="hud-dash-kicker">COMMAND SURFACE</div><h2>Dashboard</h2><p>Pick a tool. The HUD acclimates around it — deck, agent, and recents learn as you work.</p></div>' +
        '<div class="hud-dash-health">' + healthHtml + '<button type="button" class="hud-stage-btn" id="hud-dash-heal">HEAL</button></div>' +
      '</div>' +
      '<div class="hud-dash-section"><div class="hud-dash-label">LEARNED RECENTS</div><div class="hud-dash-grid">' + recentHtml + '</div></div>' +
      '<div class="hud-dash-section"><div class="hud-dash-label">WORKSTATIONS & TOOLS</div><div class="hud-dash-grid">' + allHtml + '</div></div>';
    el.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-open');
        if (window.ZothHUD && window.ZothHUD.loadTool) window.ZothHUD.loadTool(id);
      });
    });
    var healBtn = el.querySelector('#hud-dash-heal');
    if (healBtn) healBtn.addEventListener('click', function () { window.ZothHudIntel.healNow(); });
  }

  function PRIMARY_FALLBACK() {
    var names = [
      { id: 'omnipost', name: 'OmniPost', shortName: 'OmniPost', category: 'Creative' },
      { id: 'webgen', name: 'WebGen Studio', shortName: 'WebGen', category: 'Web' },
      { id: 'netrunner-memory', name: 'Lucy Memory', shortName: 'Memory', category: 'AI' },
      { id: 'vault', name: 'Keyring Vault', shortName: 'Vault', category: 'Security' },
      { id: '3d-editor', name: '3D CAD Studio', shortName: '3D CAD', category: 'Creative' },
      { id: 'nexus-3d', name: 'Cyber Nexus 3D', shortName: 'Nexus 3D', category: 'Creative' },
      { id: 'consensus', name: 'Consensus Arena', shortName: 'Consensus', category: 'AI' },
      { id: 'swarm', name: 'Swarm Commander', shortName: 'Swarm', category: 'AI' },
      { id: 'pets', name: 'Pet Sanctuary', shortName: 'Pets', category: 'Familiars' },
      { id: 'tool-bench', name: 'Tool Bench', shortName: 'Bench', category: 'Tools' },
      { id: 'signal-bridge', name: 'Signal Bridge', shortName: 'Signal', category: 'Comms' },
      { id: 'math-pillars', name: '6-Pillar Calculus', shortName: 'Math', category: 'Learning' },
      { id: 'vos-sandbox', name: 'vOS Sandbox', shortName: 'vOS', category: 'Web' },
      { id: 'agent-composer', name: 'Agent Composer', shortName: 'Composer', category: 'AI' },
      { id: 'subsweep', name: 'Subsweep OSINT', shortName: 'Subsweep', category: 'SecOps' },
      { id: 'edge-forge', name: 'Edge Forge', shortName: 'Forge', category: 'Dev' }
    ];
    return names;
  }

  function findTool(id) {
    var tiles = PRIMARY_FALLBACK();
    for (var i = 0; i < tiles.length; i++) if (tiles[i].id === id) return tiles[i];
    try {
      var hud = window.ZothHUD;
      if (hud && hud.getState) {
        var st = hud.getState();
        if (st && st.activeTool && st.activeTool.id === id) return st.activeTool;
      }
    } catch (e) {}
    return { id: id, name: id, shortName: id, category: 'Tool' };
  }

  function showDashboard() {
    if (healTimers.iframe) {
      clearTimeout(healTimers.iframe);
      healTimers.iframe = null;
    }
    setMode('dashboard', null);
    var dash = ensureDashboard();
    if (dash) {
      dash.hidden = false;
      dash.classList.add('is-open');
    }
    hideHeal();
    renderDashboard();
    var tabs = document.querySelectorAll('.hud-dock-tab');
    tabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tool') === 'dashboard');
    });
    var title = document.getElementById('hud-stage-tool-name');
    if (title) title.innerHTML = '<span>⌂</span> DASHBOARD';
    if (window.ZothHUD && window.ZothHUD.addLog) {
      window.ZothHUD.addLog('HUD', 'Dashboard surface armed. Tools remain one click away.', 'system');
    }
  }

  function hideDashboard() {
    var dash = document.getElementById('hud-dashboard');
    if (dash) {
      dash.hidden = true;
      dash.classList.remove('is-open');
    }
  }

  function hideHeal() {
    var el = document.getElementById('hud-stage-heal');
    if (el) el.hidden = true;
  }

  function showHeal(msg) {
    var el = ensureHeal();
    if (!el) return;
    var copy = document.getElementById('hud-heal-copy');
    if (copy) copy.textContent = msg || 'Workstation failed to mount.';
    el.hidden = false;
  }

  function acclimate(toolId) {
    var hud = window.ZothHUD;
    if (!hud) return;
    var st = hud.getState ? hud.getState() : {};
    var tool = st.activeTool || findTool(toolId);
    setMode('tool', tool);
    hideDashboard();
    hideHeal();

    var wantAgent = AGENT_FOR_TOOL[toolId];
    if (wantAgent && st.activeAgent !== wantAgent && hud.setAgent) {
      hud.setAgent(wantAgent, true);
      LEARN.lastAgent = wantAgent;
      saveLearn(LEARN);
    }

    var prefs = prefsFor(toolId);
    if (prefs.aspect && hud.setAspectRatio) hud.setAspectRatio(prefs.aspect);

    var ctx = document.getElementById('hud-tool-context-card');
    if (ctx) ctx.classList.add('is-acclimated');

    rebuildLearnedDock();
    if (hud.addLog) {
      hud.addLog('HUD', 'Acclimated to ' + (tool.name || toolId) + '. Agent ' + (wantAgent || st.activeAgent || 'azoth') + '.', 'system');
    }
  }

  function rebuildLearnedDock() {
    var host = document.getElementById('hud-dock-learned');
    if (!host) return;
    var recents = LEARN.recents.slice(0, 5);
    if (!recents.length) {
      host.innerHTML = '';
      return;
    }
    host.innerHTML = recents.map(function (id) {
      var t = findTool(id);
      return '<button type="button" class="hud-dock-tab learned" data-tool="' + id + '" title="Learned recent">' + (t.shortName || t.name) + '</button>';
    }).join('');
    host.querySelectorAll('[data-tool]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (window.ZothHUD) window.ZothHUD.loadTool(btn.getAttribute('data-tool'));
      });
    });
  }

  function watchIframe() {
    var frame = document.getElementById('hud-stage-frame');
    if (!frame || frame._hudHealBound) return;
    frame._hudHealBound = true;
    frame.addEventListener('load', function () {
      iframeAlive = true;
      hideHeal();
      if (healTimers.iframe) {
        clearTimeout(healTimers.iframe);
        healTimers.iframe = null;
      }
    });
    frame.addEventListener('error', function () {
      iframeAlive = false;
      var id = LEARN.lastTool;
      recordError(id);
      showHeal('Iframe error. Self-heal can retry the workstation or return to dashboard.');
    });
  }

  function armIframeWatch(toolId) {
    iframeAlive = false;
    if (healTimers.iframe) clearTimeout(healTimers.iframe);
    healTimers.iframe = setTimeout(function () {
      if (!iframeAlive) {
        recordError(toolId);
        showHeal('No mount handshake in 8s. Retry or open dashboard.');
        if (window.ZothHUD && window.ZothHUD.addLog) {
          window.ZothHUD.addLog('HEAL', 'Stage watchdog tripped for ' + toolId, 'warn');
        }
      }
    }, 8000);
  }

  function retryStage() {
    var hud = window.ZothHUD;
    if (!hud || !hud.getState) return;
    var st = hud.getState();
    var id = st.activeTool && st.activeTool.id;
    if (!id) return;
    var frame = document.getElementById('hud-stage-frame');
    if (frame) {
      var src = frame.getAttribute('src') || frame.src;
      frame.src = src;
    }
    hideHeal();
    armIframeWatch(id);
    if (hud.addLog) hud.addLog('HEAL', 'Retrying stage mount for ' + id, 'system');
  }

  function pingHealth() {
    var checks = [
      { port: '8088', url: '/studio/cyberpunk-hud.html' },
      { port: '8484', url: 'http://127.0.0.1:8484/api/health' },
      { port: '8788', url: 'http://127.0.0.1:8788/v1/memories?limit=1' },
      { port: '11434', url: 'http://127.0.0.1:11434/api/tags' }
    ];
    window.ZothHudIntel.health = window.ZothHudIntel.health || {};
    checks.forEach(function (c) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 1600);
      fetch(c.url, { signal: ctrl ? ctrl.signal : undefined, mode: c.port === '8088' ? 'same-origin' : 'cors' })
        .then(function (r) {
          window.ZothHudIntel.health[c.port] = !!r.ok;
        })
        .catch(function () {
          window.ZothHudIntel.health[c.port] = c.port === '8088' ? true : false;
        })
        .then(function () {
          clearTimeout(t);
          paintHealth();
        });
    });
  }

  function paintHealth() {
    var host = document.getElementById('hud-dock-health');
    if (!host) return;
    var h = window.ZothHudIntel.health || {};
    host.innerHTML = ['8484', '8788', '11434'].map(function (p) {
      var ok = h[p];
      var cls = ok === true ? 'ok' : (ok === false ? 'down' : 'unk');
      return '<span class="hud-health-chip ' + cls + '" title=":' + p + '">' + p + '</span>';
    }).join('');
    var dash = document.getElementById('hud-dashboard');
    if (dash && !dash.hidden) renderDashboard();
  }

  function healNow() {
    pingHealth();
    retryStage();
    if (window.ZothHUD && window.ZothHUD.addLog) {
      window.ZothHUD.addLog('HEAL', 'Self-heal sweep: ports + stage watchdog.', 'system');
    }
  }

  function wrapHud() {
    var hud = window.ZothHUD;
    if (!hud || hud._intelWrapped) return;
    hud._intelWrapped = true;

    var origLoad = hud.loadTool.bind(hud);
    hud.loadTool = function (toolId, isInitial) {
      if (toolId === 'dashboard' || toolId === 'home') {
        if (dwellTool) recordDwell(dwellTool);
        dwellTool = '';
        dwellStarted = 0;
        showDashboard();
        return;
      }
      var bootParams = new URLSearchParams(window.__HUD_LANDING_SEARCH || '');
      if (isInitial && !bootParams.get('tool')) {
        showDashboard();
        return;
      }
      if (dwellTool && dwellTool !== toolId) recordDwell(dwellTool);
      origLoad(toolId, isInitial);
      dwellTool = toolId;
      dwellStarted = Date.now();
      recordOpen(toolId);
      acclimate(toolId);
      watchIframe();
      armIframeWatch(toolId);
    };

    var origAspect = hud.setAspectRatio && hud.setAspectRatio.bind(hud);
    if (origAspect) {
      hud.setAspectRatio = function (ratio) {
        origAspect(ratio);
        if (dwellTool) savePref(dwellTool, { aspect: ratio });
      };
    }

    var origInit = hud.init.bind(hud);
    hud.init = function () {
      origInit();
      afterInit();
    };
  }

  function afterInit() {
    try {
      ensureDashboard();
      ensureHeal();
      watchIframe();
      rebuildLearnedDock();
      pingHealth();
      if (!window._hudHealPulse) {
        window._hudHealPulse = setInterval(pingHealth, 20000);
      }
      var landing = window.__HUD_LANDING_SEARCH || '';
      var params = new URLSearchParams(landing);
      if (!params.get('tool')) {
        showDashboard();
      } else {
        acclimate(params.get('tool'));
      }
      window.addEventListener('beforeunload', function () {
        if (dwellTool) recordDwell(dwellTool);
      });
    } catch (err) {
      console.warn('[HUD intel]', err);
      try { showDashboard(); } catch (e2) {}
    }
  }

  window.ZothHudIntel = {
    ready: true,
    health: {},
    showDashboard: showDashboard,
    hideDashboard: hideDashboard,
    acclimate: acclimate,
    retryStage: retryStage,
    healNow: healNow,
    learn: function () { return LEARN; }
  };

  function bootIntel() {
    wrapHud();
    afterInit();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootIntel);
  } else {
    bootIntel();
  }
})(window, document);
