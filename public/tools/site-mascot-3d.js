/**
 * Zoth Studio — Procedural 3D Companion Mascot Studio (v2.0)
 */
(function(global) {
  'use strict';
  const ZothMascot3D = {
    VERSION: '2.0.0',
    renderMascotWidget(containerId, mascot = 'azoth') {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = `<div class="mascot-badge" style="position:fixed;bottom:20px;right:20px;width:64px;height:64px;border-radius:50%;border:2px solid #e8c872;box-shadow:0 0 20px rgba(232,200,114,0.4);overflow:hidden;background:#050811;cursor:pointer;z-index:9999;"><img src="/assets/mascot/azoth-mask.jpg" alt="Companion Mascot" style="width:100%;height:100%;object-fit:cover;" /></div>`;
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ZothMascot3D;
  else global.ZothMascot3D = ZothMascot3D;
})(typeof window !== 'undefined' ? window : globalThis);
