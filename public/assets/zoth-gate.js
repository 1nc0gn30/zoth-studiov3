/**
 * Zoth public gate — this website is a preview.
 * Full tools need the local binary on this machine (:8484).
 * On https://zoth.nullai.tech mixed-content blocks a localhost probe,
 * so we treat any non-loopback host as "not running locally".
 */
(function () {
  var DECK = "http://127.0.0.1:8484";
  var HEALTH = DECK + "/api/health";
  var INSTALL = {
    linux:
      "curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.sh | bash",
    mac:
      "curl -fsSL https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.sh | bash",
    windows:
      "irm https://raw.githubusercontent.com/NullAITech/zoth-studio/main/scripts/install.ps1 | iex",
    appimage:
      "chmod +x Zoth_Studio-v2.6.0-x86_64.AppImage && ./Zoth_Studio-v2.6.0-x86_64.AppImage",
  };
  var BINS = [
    { id: "linux", label: "Linux / macOS", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/Zoth_Studio-v2.6.0-x86_64.AppImage" },
    { id: "deb", label: "Debian .deb", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-linux/zoth-studio_2.6.0_all.deb" },
    { id: "exe", label: "Windows .exe", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-windows/zoth-windows-x86_64.exe" },
    { id: "zip", label: "Windows .zip", href: "https://github.com/NullAITech/zoth-studio/raw/main/dist-windows/zoth-studio-v2.6.0-windows-x86_64.zip" },
  ];

  var TOOL_PATH = /\/(vault|registry|blueprints)(\/|$)|\/studio\/.+\.html|\/studio\/nexus-3d|\/studio\/swarm/;

  function loopback() {
    var h = location.hostname;
    return h === "127.0.0.1" || h === "localhost" || h === "[::1]";
  }
  function onDeck() {
    return location.port === "8484";
  }
  function forcePreview() {
    return /(?:\?|&)preview=1(?:&|$)/.test(location.search);
  }
  function detectOs() {
    var ua = (navigator.userAgent || "").toLowerCase();
    var plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    plat = String(plat).toLowerCase();
    if (/win/.test(plat) || /windows/.test(ua)) return "windows";
    if (/mac/.test(plat) || /macintosh/.test(ua)) return "mac";
    return "linux";
  }
  function isLocalHref(href) {
    if (!href) return false;
    if (/127\.0\.0\.1:8484|localhost:8484/.test(href)) return true;
    if (href === DECK || href === DECK + "/") return true;
    return false;
  }
  function isToolPath(path) {
    return TOOL_PATH.test(path || location.pathname);
  }

  var aliveCache = null;
  function deckAlive() {
    if (forcePreview()) return Promise.resolve(false);
    if (onDeck()) return Promise.resolve(true);
    if (!loopback()) return Promise.resolve(false);
    if (aliveCache) return aliveCache;
    aliveCache = new Promise(function (resolve) {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, 1100);
      fetch(HEALTH, { cache: "no-store", signal: ctrl.signal, mode: "cors" })
        .then(function (r) { clearTimeout(t); resolve(!!r.ok); })
        .catch(function () { clearTimeout(t); resolve(false); });
    });
    return aliveCache;
  }

  function css() {
    return [
      ":root{--zoth-ribbon:0px}",
      "html.zoth-preview{--zoth-ribbon:36px;scroll-padding-top:36px}",
      "html.zoth-preview body{padding-top:36px!important}",
      "#zoth-ribbon{position:fixed;top:0;left:0;right:0;z-index:80;display:none;align-items:center;justify-content:center;gap:10px;",
      "height:36px;padding:0 12px;background:#14110a;color:#f7f4ee;border-bottom:1px solid rgba(232,200,114,.35);",
      "font-family:Inter,system-ui,sans-serif;font-size:.78rem;line-height:1;white-space:nowrap;overflow:hidden}",
      "#zoth-ribbon.on{display:flex}",
      "#zoth-ribbon .zoth-r-copy{overflow:hidden;text-overflow:ellipsis;min-width:0}",
      "html.zoth-preview header.bar,html.zoth-preview .zoth-bar,html.zoth-preview .site-header,html.zoth-preview .reg-bar,",
      "html.zoth-preview .deck-page .site-header,html.zoth-preview .fixed.top-0{top:36px!important}",
      "@media (max-width:760px){html.zoth-preview{--zoth-ribbon:40px}html.zoth-preview body{padding-top:40px!important}",
      "#zoth-ribbon{height:40px;font-size:.72rem}",
      "html.zoth-preview header.bar,html.zoth-preview .zoth-bar,html.zoth-preview .site-header,html.zoth-preview .reg-bar,",
      "html.zoth-preview .deck-page .site-header{top:40px!important}",
      "html.zoth-preview .oracle-shell{overflow-y:auto!important;overflow-x:hidden!important;",
      "justify-content:flex-start!important;height:auto!important;min-height:calc(100dvh - 40px)!important;padding-left:16px!important;padding-right:16px!important;padding-bottom:28px!important}}",
      "#zoth-ribbon strong{color:#e8c872;font-weight:600}",
      "#zoth-ribbon button,#zoth-ribbon a.zoth-r-go{background:none;border:1px solid rgba(232,200,114,.45);color:#e8c872;",
      "font-family:JetBrains Mono,ui-monospace,monospace;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;",
      "padding:5px 10px;border-radius:999px;cursor:pointer;text-decoration:none}",
      "#zoth-modal{position:fixed;inset:0;z-index:90;display:none;align-items:center;justify-content:center;padding:20px;",
      "background:rgba(5,5,8,.72)}",
      "#zoth-modal.on{display:flex}",
      "#zoth-modal .sheet{width:min(34rem,100%);background:#09090f;color:#f7f4ee;border:1px solid rgba(232,200,114,.28);",
      "border-radius:18px;padding:26px 24px 22px;font-family:Inter,system-ui,sans-serif}",
      "#zoth-modal .k{font-family:JetBrains Mono,ui-monospace,monospace;font-size:.66rem;letter-spacing:.16em;",
      "text-transform:uppercase;color:#e8c872;margin:0 0 10px}",
      "#zoth-modal h2{font-family:Fraunces,Palatino,serif;font-weight:600;letter-spacing:-.03em;font-size:1.7rem;",
      "line-height:1.1;margin:0 0 10px}",
      "#zoth-modal p{color:#a8a4c2;line-height:1.6;margin:0 0 14px;font-size:.98rem}",
      "#zoth-modal p strong{color:#f7f4ee}",
      "#zoth-modal .box{border:1px solid rgba(247,244,238,.1);border-radius:12px;overflow:hidden;background:#050508;margin:0 0 14px}",
      "#zoth-modal .tabs{display:flex;gap:4px;padding:6px;overflow-x:auto;border-bottom:1px solid rgba(247,244,238,.1)}",
      "#zoth-modal .tab{background:none;border:0;color:#a8a4c2;cursor:pointer;font-family:JetBrains Mono,ui-monospace,monospace;",
      "font-size:.7rem;padding:6px 10px;border-radius:8px}",
      "#zoth-modal .tab.on{color:#f7f4ee;background:rgba(232,200,114,.12)}",
      "#zoth-modal .row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px}",
      "#zoth-modal code{font-family:JetBrains Mono,ui-monospace,monospace;font-size:.76rem;color:#e8c872;word-break:break-all}",
      "#zoth-modal .copy{background:none;border:1px solid rgba(247,244,238,.14);color:#f7f4ee;border-radius:999px;",
      "font-family:JetBrains Mono,ui-monospace,monospace;font-size:.68rem;padding:5px 10px;cursor:pointer;white-space:nowrap}",
      "#zoth-modal .bins{display:flex;flex-wrap:wrap;gap:8px 14px;margin:0 0 16px}",
      "#zoth-modal .bins a{color:#a8a4c2;font-size:.78rem;text-decoration:none;border-bottom:1px solid transparent}",
      "#zoth-modal .bins a:hover{color:#e8c872;border-bottom-color:#e8c872}",
      "#zoth-modal .acts{display:flex;flex-wrap:wrap;gap:8px}",
      "#zoth-modal .btn{display:inline-flex;align-items:center;text-decoration:none;border-radius:999px;padding:10px 16px;",
      "font-family:JetBrains Mono,ui-monospace,monospace;font-size:.76rem;font-weight:600;cursor:pointer;border:0}",
      "#zoth-modal .btn-on{background:#e8c872;color:#14110a}",
      "#zoth-modal .btn-off{background:transparent;color:#f7f4ee;border:1px solid rgba(247,244,238,.14)}",
    ].join("");
  }

  function ensureUi() {
    if (document.getElementById("zoth-modal")) return;
    var st = document.createElement("style");
    st.textContent = css();
    document.head.appendChild(st);

    var ribbon = document.createElement("div");
    ribbon.id = "zoth-ribbon";
    ribbon.innerHTML =
      "<span class='zoth-r-copy'>Preview. Install the binary for full tools on this device.</span>" +
      "<button type='button' data-zoth-open>Install</button>";
    document.body.appendChild(ribbon);

    var os = detectOs();
    var cmd = INSTALL[os] || INSTALL.linux;
    var modal = document.createElement("div");
    modal.id = "zoth-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "zoth-modal-title");
    modal.innerHTML =
      '<div class="sheet">' +
        '<p class="k">Zoth Studio · zoth.nullai.tech</p>' +
        '<h2 id="zoth-modal-title">Are you running this locally?</h2>' +
        '<p>The website is a showcase. Chat, Vault, Swarm, and Studio tools need the <strong>local binary</strong> for your device. If it is not running on this machine, install it, then open the deck at <strong>127.0.0.1:8484</strong>.</p>' +
        '<div class="box">' +
          '<div class="tabs" role="tablist">' +
            '<button class="tab' + (os === "linux" ? " on" : "") + '" type="button" data-cmd="' + INSTALL.linux + '">Linux</button>' +
            '<button class="tab' + (os === "mac" ? " on" : "") + '" type="button" data-cmd="' + INSTALL.mac + '">macOS</button>' +
            '<button class="tab' + (os === "windows" ? " on" : "") + '" type="button" data-cmd="' + INSTALL.windows + '">Windows</button>' +
            '<button class="tab" type="button" data-cmd="' + INSTALL.appimage + '">AppImage</button>' +
          "</div>" +
          '<div class="row"><code id="zoth-cmd">' + cmd + "</code>" +
          '<button class="copy" type="button" id="zoth-copy">Copy</button></div>' +
        "</div>" +
        '<div class="bins">' +
          BINS.map(function (b) {
            return '<a href="' + b.href + '">' + b.label + "</a>";
          }).join("") +
        "</div>" +
        '<div class="acts">' +
          '<a class="btn btn-on" href="#install" data-zoth-close>See install</a>' +
          '<button class="btn btn-off" type="button" data-zoth-close>Stay on the preview</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) hide();
    });
    modal.querySelectorAll("[data-zoth-close]").forEach(function (el) {
      el.addEventListener("click", hide);
    });
    ribbon.querySelector("[data-zoth-open]").addEventListener("click", function () {
      show();
    });
    modal.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        modal.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("on"); });
        tab.classList.add("on");
        document.getElementById("zoth-cmd").textContent = tab.getAttribute("data-cmd");
      });
    });
    document.getElementById("zoth-copy").addEventListener("click", function () {
      var t = document.getElementById("zoth-cmd").textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(t);
      this.textContent = "Copied";
      var btn = this;
      setTimeout(function () { btn.textContent = "Copy"; }, 1400);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hide();
    });
  }

  function show() {
    ensureUi();
    document.getElementById("zoth-modal").classList.add("on");
  }
  function hide() {
    var m = document.getElementById("zoth-modal");
    if (m) m.classList.remove("on");
  }
  function ribbon(on) {
    ensureUi();
    document.getElementById("zoth-ribbon").classList.toggle("on", !!on);
    document.documentElement.classList.toggle("zoth-preview", !!on);
  }

  function intercept(e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var local = isLocalHref(href) || a.classList.contains("js-deck");
    if (!local) return;
    if (onDeck() && !forcePreview()) return;
    e.preventDefault();
    e.stopPropagation();
    deckAlive().then(function (ok) {
      if (ok) {
        location.href = onDeck() ? "/" : DECK + "/";
        return;
      }
      show();
    });
  }

  function rewriteHubLinks() {
    document.querySelectorAll("a.js-hub, a[href='/hub/'], a[href='/hub'], a[href^='/hub/#']").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var hash = href.indexOf("#") >= 0 ? href.slice(href.indexOf("#")) : "";
      a.setAttribute("href", onDeck() ? "/hub/" + hash : (hash || "/"));
    });
  }

  function boot() {
    rewriteHubLinks();
    ensureUi();
    document.addEventListener("click", intercept, true);
    deckAlive().then(function (ok) {
      if (!ok) {
        ribbon(true);
        if (isToolPath(location.pathname)) show();
      }
    });
  }

  window.ZothGate = {
    show: show,
    hide: hide,
    deckAlive: deckAlive,
    detectOs: detectOs,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
