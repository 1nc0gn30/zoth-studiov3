/**
 * ZOTH STUDIO — KINETIC PROGRESSIVE DISCLOSURE ENGINE (v1.0 Master)
 * Provides progressive disclosure, animated 1-4 word interactive triggers,
 * master state toggles (Expand All / Focused View), and URL hash deep linking.
 */
(function () {
  "use strict";

  function initDisclosure() {
    // 1. Bind main section wrappers
    var wrappers = document.querySelectorAll(".zoth-disclosure-wrapper");
    wrappers.forEach(function (wrapper) {
      var trigger = wrapper.querySelector(".zoth-disclosure-trigger");
      if (!trigger) return;

      // Ensure proper ARIA attributes
      var content = wrapper.querySelector(".zoth-disclosure-content");
      if (content) {
        if (!content.id) content.id = "zoth-disc-" + Math.random().toString(36).substring(2, 9);
        trigger.setAttribute("aria-controls", content.id);
        trigger.setAttribute("aria-expanded", wrapper.classList.contains("is-expanded") ? "true" : "false");
      }

      var parentStage = wrapper.closest(".travel-scene-stage");
      if (parentStage) {
        if (!wrapper.classList.contains("is-expanded")) {
          parentStage.classList.add("stage-collapsed");
        } else {
          parentStage.classList.remove("stage-collapsed");
        }
      }

      trigger.onclick = function (e) {
        e.preventDefault();
        toggleWrapper(wrapper);
      };

      trigger.onkeydown = function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleWrapper(wrapper);
        }
      };
    });

    // 2. Bind inline tool panels
    var toolPanels = document.querySelectorAll(".zoth-tool-panel-collapsible");
    toolPanels.forEach(function (panel) {
      var btn = panel.querySelector(".zoth-tool-toggle-btn");
      if (!btn) return;

      btn.onclick = function (e) {
        e.preventDefault();
        panel.classList.toggle("is-open");
        var isOpen = panel.classList.contains("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        var badge = btn.querySelector(".zoth-tool-badge");
        if (badge) {
          badge.textContent = isOpen ? "− HIDE DETAILS" : "+ EXPAND DETAILS";
        }
      };
    });

    // 2.1 Bind HUD Card Collapsibles (In-Tool Secondary Panels)
    var hudCards = document.querySelectorAll(".hud-card.hud-card-collapsible");
    hudCards.forEach(function (card) {
      var header = card.querySelector(".hud-card-header");
      if (!header) return;
      var icon = header.querySelector(".hud-card-toggle-icon");
      if (!icon) {
        icon = document.createElement("span");
        icon.className = "hud-card-toggle-icon";
        icon.innerHTML = card.classList.contains("is-collapsed") ? "▶" : "▼";
        header.appendChild(icon);
      }
      header.onclick = function () {
        card.classList.toggle("is-collapsed");
        var ic = header.querySelector(".hud-card-toggle-icon");
        if (ic) {
          ic.innerHTML = card.classList.contains("is-collapsed") ? "▶" : "▼";
        }
        window.dispatchEvent(new Event("resize"));
      };
    });

    // 3. Bind Master HUD buttons if present
    var expandAllBtn = document.querySelector("[data-zoth-action='expand-all']");
    var collapseAllBtn = document.querySelector("[data-zoth-action='collapse-all']");

    if (expandAllBtn) {
      expandAllBtn.onclick = function () {
        setAllDisclosureState(true);
        updateMasterButtons(true);
      };
    }
    if (collapseAllBtn) {
      collapseAllBtn.onclick = function () {
        setAllDisclosureState(false);
        updateMasterButtons(false);
      };
    }

    // 4. Handle URL deep-linking hashes (e.g. #agents, #how-it-works, #trust)
    function expandTargetHash(hash) {
      if (!hash) return;
      try {
        var target = document.querySelector(hash);
        if (target) {
          var parentWrapper = target.closest(".zoth-disclosure-wrapper") || target;
          if (parentWrapper && parentWrapper.classList.contains("zoth-disclosure-wrapper")) {
            expandWrapper(parentWrapper);
            setTimeout(function () {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 250);
          }
        }
      } catch (e) {}
    }

    if (window.location.hash) {
      expandTargetHash(window.location.hash);
    }

    window.addEventListener("hashchange", function () {
      expandTargetHash(window.location.hash);
    });

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[href*='#']");
      if (!link) return;
      var href = link.getAttribute("href") || "";
      var hashIdx = href.indexOf("#");
      if (hashIdx !== -1) {
        var hash = href.substring(hashIdx);
        if (hash.length > 1) {
          expandTargetHash(hash);
        }
      }
    });

    updateCounter();
  }

  function toggleWrapper(wrapper) {
    var isExpanded = wrapper.classList.contains("is-expanded");
    if (isExpanded) {
      collapseWrapper(wrapper);
    } else {
      expandWrapper(wrapper);
    }
    updateCounter();
  }

  function expandWrapper(wrapper) {
    wrapper.classList.add("is-expanded");
    var parentStage = wrapper.closest(".travel-scene-stage");
    if (parentStage) parentStage.classList.remove("stage-collapsed");
    var trigger = wrapper.querySelector(".zoth-disclosure-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    var badge = wrapper.querySelector(".zoth-toggle-badge .badge-text");
    if (badge) badge.textContent = "MINIMIZE";

    // Trigger window resize event so embedded 3D WebGL canvases / graphs re-layout properly
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 150);
  }

  function collapseWrapper(wrapper) {
    wrapper.classList.remove("is-expanded");
    var parentStage = wrapper.closest(".travel-scene-stage");
    if (parentStage) parentStage.classList.add("stage-collapsed");
    var trigger = wrapper.querySelector(".zoth-disclosure-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    var badge = wrapper.querySelector(".zoth-toggle-badge .badge-text");
    if (badge) badge.textContent = "EXPAND";

    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 150);
  }

  function setAllDisclosureState(expanded) {
    var wrappers = document.querySelectorAll(".zoth-disclosure-wrapper");
    wrappers.forEach(function (wrapper) {
      if (expanded) {
        expandWrapper(wrapper);
      } else {
        collapseWrapper(wrapper);
      }
    });
    updateCounter();
  }

  function updateMasterButtons(allExpanded) {
    var expandBtn = document.querySelector("[data-zoth-action='expand-all']");
    var collapseBtn = document.querySelector("[data-zoth-action='collapse-all']");
    if (expandBtn && collapseBtn) {
      if (allExpanded) {
        expandBtn.classList.add("active");
        collapseBtn.classList.remove("active");
      } else {
        collapseBtn.classList.add("active");
        expandBtn.classList.remove("active");
      }
    }
  }

  function updateCounter() {
    var counter = document.getElementById("zoth-disclosure-active-counter");
    if (!counter) return;
    var total = document.querySelectorAll(".zoth-disclosure-wrapper").length;
    var openCount = document.querySelectorAll(".zoth-disclosure-wrapper.is-expanded").length;
    counter.textContent = openCount + " / " + total + " DOMAINS EXPANDED";
  }

  // Auto-init on DOMContentLoaded or immediate if already ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDisclosure);
  } else {
    initDisclosure();
  }

  // Expose global controller
  window.ZothDisclosure = {
    init: initDisclosure,
    expandAll: function () { setAllDisclosureState(true); updateMasterButtons(true); },
    collapseAll: function () { setAllDisclosureState(false); updateMasterButtons(false); },
    toggle: toggleWrapper,
    expand: expandWrapper,
    collapse: collapseWrapper
  };
})();
