/**
 * Inject a film hero on preview tool pages.
 * body[data-film] data-poster data-kicker data-title data-lede
 */
(function () {
  var body = document.body;
  var src = body.getAttribute("data-film");
  if (!src) return;
  var poster = body.getAttribute("data-poster") || "";
  var kicker = body.getAttribute("data-kicker") || "Preview";
  var title = body.getAttribute("data-title") || document.title.split("—")[0].trim();
  var lede = body.getAttribute("data-lede") || "This page is a preview. Full tools run on the local deck.";
  var href = body.getAttribute("data-cta") || "http://127.0.0.1:8484/";

  var wrap = document.createElement("section");
  wrap.className = "zoth-film";
  wrap.setAttribute("aria-label", title);
  wrap.innerHTML =
    '<video class="media" muted loop playsinline preload="metadata"' +
    (poster ? ' poster="' + poster + '"' : "") +
    "><source src=\"" + src + "\" type=\"video/mp4\" /></video>" +
    '<div class="zoth-film-shade"></div>' +
    '<div class="zoth-film-copy">' +
    '<p class="kicker">' + kicker + "</p>" +
    '<p class="zoth-film-title">' + title + "</p>" +
    "<p>" + lede + "</p>" +
    '<a class="go js-deck" href="' + href + '">Open on the deck →</a>' +
    "</div>";

  var header =
    document.querySelector("header") ||
    document.querySelector(".site-header") ||
    document.querySelector(".header") ||
    document.querySelector(".topbar");
  if (header && header.parentNode) {
    header.insertAdjacentElement("afterend", wrap);
  } else {
    body.insertBefore(wrap, body.firstChild);
  }

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

  if (location.port === "8484") {
    wrap.querySelectorAll(".js-deck").forEach(function (a) { a.setAttribute("href", "/"); });
  }
})();
