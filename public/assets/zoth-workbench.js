/**
 * ⚡ Zoth Workbench & Interactive Tool Control Engine (v2.0)
 * Auto-mounts floating action docks, sidebar drawers, desktop app prompts, and config modals.
 */
(function () {
  'use strict';

  function isMobile() {
    return window.innerWidth <= 880;
  }

  // Toggle Sidebar Menu
  function toggleToolSidebar(id) {
    var sidebar = document.getElementById(id || 'zothToolSidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('open');
  }

  function closeToolSidebar(id) {
    var sidebar = document.getElementById(id || 'zothToolSidebar');
    if (!sidebar) return;
    sidebar.classList.remove('open');
  }

  function openToolSidebar(id) {
    var sidebar = document.getElementById(id || 'zothToolSidebar');
    if (!sidebar) return;
    sidebar.classList.add('open');
  }

  // Generic Dynamic Config Modal
  function openConfigModal(title, desc, formHtml, onApplyCallback) {
    var backdrop = document.getElementById('zothConfigModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'zothConfigModalBackdrop';
      backdrop.className = 'zoth-config-modal-backdrop';
      backdrop.innerHTML = [
        '<div class="zoth-config-modal-card">',
        '  <div class="zoth-config-modal-header">',
        '    <h3 class="zoth-config-modal-title" id="zothConfigModalTitle">⚙️ Configuration</h3>',
        '    <button type="button" class="zoth-sidebar-close" id="zothConfigModalClose" aria-label="Close modal">✕</button>',
        '  </div>',
        '  <p class="zoth-config-modal-desc" id="zothConfigModalDesc"></p>',
        '  <div id="zothConfigModalForm"></div>',
        '  <div class="zoth-desktop-unlock-card">',
        '    <div class="zoth-desktop-unlock-title">🖥️ Unlock Full Uncapped Desktop Engine</div>',
        '    <div class="zoth-desktop-unlock-text">Run GPU shaders, multi-threaded subagent workers, and local hardware keystores offline on your machine with zero limits.</div>',
        '    <button type="button" class="zoth-pill-cta" style="width:fit-content;margin-top:4px;" onclick="if(window.ZothGate)window.ZothGate.show()">🚀 Get Desktop App</button>',
        '  </div>',
        '  <div class="zoth-modal-actions">',
        '    <button type="button" class="zoth-fab-btn" id="zothConfigModalCancel" style="padding:8px 16px;">Cancel</button>',
        '    <button type="button" class="zoth-fab-btn primary" id="zothConfigModalApply" style="padding:8px 18px;">Apply Settings ✓</button>',
        '  </div>',
        '</div>'
      ].join('\n');
      document.body.appendChild(backdrop);

      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeConfigModal();
      });
      document.getElementById('zothConfigModalClose').addEventListener('click', closeConfigModal);
      document.getElementById('zothConfigModalCancel').addEventListener('click', closeConfigModal);
    }

    document.getElementById('zothConfigModalTitle').innerHTML = title || '⚙️ Tool Configuration';
    document.getElementById('zothConfigModalDesc').innerHTML = desc || 'Customize parameters and runtime bindings for this workstation.';
    document.getElementById('zothConfigModalForm').innerHTML = formHtml || '';

    var applyBtn = document.getElementById('zothConfigModalApply');
    var newApply = applyBtn.cloneNode(true);
    applyBtn.parentNode.replaceChild(newApply, applyBtn);
    newApply.addEventListener('click', function () {
      if (typeof onApplyCallback === 'function') {
        onApplyCallback();
      }
      closeConfigModal();
    });

    backdrop.classList.add('open');
    backdrop.style.display = 'flex';
  }

  function closeConfigModal() {
    var backdrop = document.getElementById('zothConfigModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    setTimeout(function () {
      backdrop.style.display = 'none';
    }, 220);
  }

  // Auto-inject Floating Workbench Controls & Drawer on 3D & Site Generator pages
  function autoInjectWorkbenchElements() {
    var pathname = window.location.pathname || '';
    var isToolPage = pathname.includes('nexus-3d') || pathname.includes('swarm') || pathname.includes('site-generator') || pathname.includes('pet-studio');
    if (!isToolPage) return;

    // 1. Floating Desktop App Incentive Pill at bottom
    if (!document.getElementById('zothDesktopPromptPill')) {
      var pill = document.createElement('div');
      pill.id = 'zothDesktopPromptPill';
      pill.className = 'zoth-desktop-prompt-pill';
      pill.innerHTML = [
        '<span class="zoth-pill-badge">BETA PREVIEW</span>',
        '<span class="zoth-pill-text">Open on Desktop for Full Hardware & GPU Engine</span>',
        '<button type="button" class="zoth-pill-cta" onclick="if(window.ZothGate)window.ZothGate.show()">Get Desktop App ↗</button>'
      ].join('');
      document.body.appendChild(pill);
    }

    // 2. Floating Action Dock (Top Right)
    if (!document.getElementById('zothFabDock')) {
      var dock = document.createElement('div');
      dock.id = 'zothFabDock';
      dock.className = 'zoth-fab-dock';
      dock.innerHTML = [
        '<button type="button" class="zoth-fab-btn primary" onclick="ZothWorkbench.toggleSidebar()" title="Toggle Tool Settings Drawer">⚙️ <span style="font-size:0.78rem;font-weight:700;">Tool Menu</span></button>',
        '<button type="button" class="zoth-fab-btn gold" onclick="if(window.ZothGate)window.ZothGate.show()" title="Get Desktop Version">🖥️ <span style="font-size:0.78rem;font-weight:700;">Desktop App</span></button>'
      ].join('');
      document.body.appendChild(dock);
    }

    // 3. Slide-out Tool Sidebar Drawer
    if (!document.getElementById('zothToolSidebar')) {
      var sidebar = document.createElement('aside');
      sidebar.id = 'zothToolSidebar';
      sidebar.className = 'zoth-tool-sidebar';
      
      var toolTitle = '🛠️ Workstation Controls';
      var toolOptionsHtml = '';

      if (pathname.includes('site-generator')) {
        toolTitle = '⚡ Web Foundry Tools';
        toolOptionsHtml = [
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Workflow Stages</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(1);ZothWorkbench.closeSidebar();">1️⃣ Idea & Foundation</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(2);ZothWorkbench.closeSidebar();">2️⃣ Generative Synthesis</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(3);ZothWorkbench.closeSidebar();">3️⃣ In-House Engines</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.goToStage)goToStage(4);ZothWorkbench.closeSidebar();">4️⃣ 20-Agent Swarm</button>',
          '  </div>',
          '</div>',
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Foundry Configuration</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="ZothWorkbench.openConfig(\'🎨 Palette & Design Tokens\', \'Customize CSS variables, brand gradients, and font families.\', \'<input type=text value=\\\'#00f0ff\\\' class=\\\'prompt-box\\\' style=\\\'margin-bottom:8px;\\\'/><select class=\\\'prompt-box\\\'><option>Syne & Figtree</option><option>Space Grotesk</option></select>\')">🎨 Palette & Typography</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="ZothWorkbench.openConfig(\'🚀 Hosting & Serverless Adapter\', \'Configure Netlify Functions, Astro SSR endpoints, or static SPA exports.\', \'<select class=\\\'prompt-box\\\'><option>Netlify Serverless</option><option>Vercel Edge</option><option>Cloudflare Pages</option><option>Static HTML5 / GitHub Pages</option></select>\')">🚀 Hosting & Deployment</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="ZothWorkbench.openConfig(\'🔍 SEO & AEO Triples\', \'Configure Schema.org LocalBusiness, FAQ triples, and llms.txt context.\', \'<textarea class=\\\'prompt-box\\\' rows=3>llms.txt context layer enabled with JSON-LD breadcrumbs</textarea>\')">🔍 SEO / AEO / llms.txt</button>',
          '  </div>',
          '</div>'
        ].join('\n');
      } else if (pathname.includes('nexus-3d')) {
        toolTitle = '📐 Nexus 3D Viewport Controls';
        toolOptionsHtml = [
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">3D Scene Presets</span>',
          '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'cyberpunk_megacity\')">🌆 Cyber City</button>',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'deep_space_station\')">🌌 Deep Space</button>',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'alchemical_sanctum\')">🏛️ Sanctum</button>',
          '    <button class="zoth-fab-btn" onclick="if(window.loadScenePreset)loadScenePreset(\'matrix_holodeck\')">🟩 Matrix</button>',
          '  </div>',
          '</div>',
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Viewport Tools</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.resetCamera)resetCamera();ZothWorkbench.closeSidebar();">🎯 Recenter Camera</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.toggleAutoRotate)toggleAutoRotate();ZothWorkbench.closeSidebar();">🔄 Toggle Orbit Turntable</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.burstParticles)burstParticles();">💥 Particle Burst</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.exportSnapshotPNG)exportSnapshotPNG();">📸 High-Res Snapshot</button>',
          '  </div>',
          '</div>'
        ].join('\n');
      } else if (pathname.includes('swarm')) {
        toolTitle = '🌐 Swarm Command Controls';
        toolOptionsHtml = [
          '<div class="zoth-sidebar-group">',
          '  <span class="zoth-sidebar-label">Swarm Node Matrix</span>',
          '  <div style="display:flex;flex-direction:column;gap:6px;">',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.pingAllSwarmAgents)pingAllSwarmAgents();">⚡ Ping 21 Sovereign Agents</button>',
          '    <button class="zoth-fab-btn" style="width:100%;justify-content:flex-start;" onclick="if(window.clearDialogueFeed)clearDialogueFeed();">🧹 Clear Swarm Log Feed</button>',
          '  </div>',
          '</div>'
        ].join('\n');
      }

      sidebar.innerHTML = [
        '<div class="zoth-sidebar-head">',
        '  <h3 class="zoth-sidebar-title">' + toolTitle + '</h3>',
        '  <button type="button" class="zoth-sidebar-close" onclick="ZothWorkbench.closeSidebar()" aria-label="Close sidebar">✕</button>',
        '</div>',
        '<div class="zoth-sidebar-body">',
        toolOptionsHtml,
        '  <div class="zoth-desktop-unlock-card" style="margin-top:auto;">',
        '    <div class="zoth-desktop-unlock-title">🖥️ Desktop App Available</div>',
        '    <div class="zoth-desktop-unlock-text">Launch native hardware orchestration on :8484 with zero web sandbox limits.</div>',
        '    <button type="button" class="zoth-pill-cta" style="width:100%;justify-content:center;margin-top:6px;" onclick="if(window.ZothGate)window.ZothGate.show()">Get Desktop App ↗</button>',
        '  </div>',
        '</div>'
      ].join('\n');

      document.body.appendChild(sidebar);
    }
  }

  window.ZothWorkbench = {
    toggleSidebar: toggleToolSidebar,
    openSidebar: openToolSidebar,
    closeSidebar: closeToolSidebar,
    openConfig: openConfigModal,
    closeConfig: closeConfigModal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInjectWorkbenchElements);
  } else {
    autoInjectWorkbenchElements();
  }
})();
