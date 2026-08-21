/**
 * Zoth Tool Screenrecording Showcase & Preview Subsystem (v2.0)
 * On public domains (e.g., zoth.nullai.tech), tool pages display a 60 FPS screenrecording
 * showcase with clear local execution guidance rather than broken localhost socket attempts.
 * Strictly avoids loading dev-only annotator on production domains.
 */
(function () {
  var body = document.body;
  var src = body.getAttribute("data-film");
  if (!src) return;

  var poster = body.getAttribute("data-poster") || "";
  var kicker = body.getAttribute("data-kicker") || "Workstation Showcase";
  var title = body.getAttribute("data-title") || document.title.split("—")[0].trim();
  var lede = body.getAttribute("data-lede") || "This tool executes directly on your local machine. On the public web, watch the 60 FPS live showcase demo below.";
  var guide = body.getAttribute("data-guide") || "Local-first workstation.|Requires native desktop daemon on :8484.|Watch the 60 FPS recording below.";
  var mode = body.getAttribute("data-film-mode") || "hero";

  function isLoopback() {
    var h = (location.hostname || "").toLowerCase();
    return h === "127.0.0.1" || h === "localhost" || h === "[::1]" || h === "0.0.0.0";
  }

  document.documentElement.classList.add("zoth-film-on");

  var wrap = document.createElement("section");
  wrap.className = "zoth-film" + (mode === "under" ? " zoth-film-under" : mode === "banner" ? " zoth-film-banner" : "");
  wrap.setAttribute("aria-label", title);
  wrap.setAttribute("data-guide", guide);
  wrap.innerHTML =
    '<div class="stage" data-face="east" style="position:absolute;inset:0;overflow:hidden;background:#020408;">' +
      '<video class="media" muted loop playsinline preload="metadata" controls' +
        (poster ? ' poster="' + poster + '"' : "") +
        ' style="width:100%;height:100%;object-fit:cover;">' +
        '<source src="' + src + '" type="video/mp4" />' +
      '</video>' +
    '</div>' +
    '<div class="zoth-film-shade"></div>' +
    '<div class="zoth-film-copy">' +
      '<div class="hair" aria-hidden="true"></div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
        '<span style="background:rgba(0,240,255,0.15);color:#00f0ff;border:1px solid rgba(0,240,255,0.4);font-family:IBM Plex Mono,monospace;font-size:0.68rem;padding:2px 8px;border-radius:4px;font-weight:700;letter-spacing:0.06em;">🎬 60 FPS LIVE DEMO</span>' +
        '<span style="color:#e8c872;font-family:IBM Plex Mono,monospace;font-size:0.7rem;">' + kicker + '</span>' +
      '</div>' +
      '<p class="zoth-film-title" style="font-family:Syne,sans-serif;font-weight:800;font-size:1.6rem;margin:0 0 6px;color:#fff;">' + title + '</p>' +
      '<p style="color:#cbd5e1;font-size:0.92rem;line-height:1.55;max-width:38rem;margin:0 0 16px;">' + lede + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button type="button" onclick="if(window.ZothGate)window.ZothGate.show();" style="background:linear-gradient(135deg,#00f0ff,#38bdf8);color:#040711;font-family:Syne,sans-serif;font-weight:800;font-size:0.85rem;padding:9px 18px;border-radius:999px;border:none;cursor:pointer;box-shadow:0 0 16px rgba(0,240,255,0.35);">🚀 Install to Run Locally</button>' +
        '<a href="/social/" style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#f1f5f9;font-family:IBM Plex Mono,monospace;font-size:0.78rem;padding:9px 16px;border-radius:999px;text-decoration:none;">🎬 All 46 Showcases →</a>' +
      '</div>' +
    '</div>';

  body.insertBefore(wrap, body.firstChild);

  var v = wrap.querySelector("video");
  if (v && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.play().catch(function () {});
          else e.target.pause();
        });
      }, { threshold: 0.2 });
      io.observe(v);
    } else {
      v.setAttribute("autoplay", "");
    }
  }

  function addScript(srcPath) {
    if (document.querySelector('script[src="' + srcPath + '"]')) return;
    var s = document.createElement("script");
    s.src = srcPath;
    s.defer = true;
    document.body.appendChild(s);
  }

  addScript("/assets/zoth-guide.js");
  addScript("/assets/celestial-trail.js");

  // Strictly inject annotation tool ONLY on local loopback environments
  if (isLoopback()) {
    addScript("/assets/zoth-annotator.js");
  }
})();
