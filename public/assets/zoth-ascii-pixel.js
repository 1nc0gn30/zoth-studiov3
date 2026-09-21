/**
 * 👾 ZOTH STUDIO — AAA RETRO CYBERPUNK ASCII PIXEL SUITE (v2.0)
 * Monospace Vector Pixel Banners · CRT Scanline Shaders · Mascot Art
 */

(function (window, document) {
  'use strict';

  var ZOTH_ASCII_LOGO = 
"  ______ ____ _____ _   _   _____ _____ _   _ ____  ___ ___  \n" +
" |___  / __ |_   _| | | | /  ___|_   _| | | |  _ \\|_ _/ _ \\ \n" +
"    / / |  | || | | |_| | \\ `--.  | | | | | | | | || | | | |\n" +
"   / /| |  | || | |  _  |  `--. \\ | | | | | | |_| || | |_| |\n" +
"  / /_| |__| || | | | | | /\\__/ / | | | |_| | ____/| |\\___/ \n" +
" /____\\____/  |_| |_| |_| \\____/  \_/  \\___/|_|   |___|   \n" +
" ═════════════════════════════════════════════════════════════";

  var MASCOT_ASCII = {
    azoth:
"    /\\____/\\\n" +
"   (  o.o  )  [AZOTH SOVEREIGN MESH]\n" +
"    >  ^  <   Stake: 50% · Truth Anchor\n" +
"   /       \\  Zero-Egress Quarantine",
    grok:
"   [▓▓▓▓▓▓▓▓]\n" +
"  <[ 👁️ 🗲 👁️ ]> [GROK 4.5 CYBER FUZZER]\n" +
"   [░░░░░░░░]  Stake: 30% · Adversarial Stress\n" +
"   /|      |\\",
    hermes:
"     /\\/\\\n" +
"    ( ⚡⚡ )  [HERMES 3 AST KERNEL]\n" +
"    /|  |\\   Stake: 20% · Canonical Tree\n" +
"   /_|__|_\\"
  };

  var ZothASCII = {
    getLogoBanner: function () {
      return ZOTH_ASCII_LOGO;
    },

    getMascotArt: function (mascotKey) {
      return MASCOT_ASCII[mascotKey] || MASCOT_ASCII.azoth;
    },

    toggleAsciiMode: function () {
      var htmlEl = document.documentElement;
      var current = htmlEl.getAttribute('data-ascii-mode') === 'true';
      var nextState = !current;
      htmlEl.setAttribute('data-ascii-mode', String(nextState));
      try {
        if (window.localStorage) {
          window.localStorage.setItem('zoth_ascii_mode', String(nextState));
        }
      } catch (e) {}
      console.log('[ZothASCII] ASCII Pixel Mode toggled:', nextState);
      return nextState;
    },

    init: function () {
      try {
        var pref = window.localStorage && window.localStorage.getItem('zoth_ascii_mode');
        if (pref === 'true') {
          document.documentElement.setAttribute('data-ascii-mode', 'true');
        }
      } catch (e) {}
    }
  };

  window.ZothASCII = ZothASCII;
  ZothASCII.init();

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : this);
