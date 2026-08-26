/**
 * ⚡ Zoth Workbench & Interactive Tool Control Engine (v1.0)
 * Manages mobile beta workbench views, side toggle menus, config popups, and desktop app promotion gates.
 */
(function () {
  'use strict';

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
    // replace listener
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

  window.ZothWorkbench = {
    toggleSidebar: toggleToolSidebar,
    openSidebar: openToolSidebar,
    closeSidebar: closeToolSidebar,
    openConfig: openConfigModal,
    closeConfig: closeConfigModal
  };
})();
