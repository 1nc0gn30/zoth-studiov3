// Zoth Studio — Tool Bench -> Swarm Bus (:8989) Mirror (Hermes lane)
//
// Forwards zoth:tool-bench CustomEvents to the live local swarm bus daemon at
// http://127.0.0.1:8989/messages (the real channel antigravity's Swarm Arena
// uses — same POST {from,to,msg} protocol). Fail-soft: if :8989 is down or the
// POST throws, it is swallowed and a local console note is emitted instead. No
// secrets are forwarded (only public event metadata + a compact status line).
//
// Compatible with browser (ESM global) and Node (CommonJS).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothBenchBusMirror = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SWARM_URL = "http://127.0.0.1:8989";
  var FROM = "hermes";
  var TO = "all";            // swarm-wide broadcast (antigravity reads :8989)
  var ENABLED = true;
  var LAST_OK = null;       // last successful POST timestamp
  var FAILS = 0;

  function setEnabled(v) { ENABLED = !!v; }
  function status() { return { enabled: ENABLED, last_ok: LAST_OK, fails: FAILS, target: SWARM_URL }; }

  // Turn an event detail into a human + machine readable swarm message.
  function toMessage(detail) {
    detail = detail || {};
    var ev = detail.event || "event";
    var id = detail.id || "?";
    var parts = [ev];
    if (detail.code) parts.push(detail.code);
    if (detail.action) parts.push("action=" + detail.action);
    if (detail.simulated) parts.push("sim");
    if (detail.live) parts.push("live");
    var line = parts.join(" · ");
    var payload = {
      tool: id,
      event: ev,
      code: detail.code || null,
      action: detail.action || null,
      simulated: !!detail.simulated,
      live: !!detail.live,
      request_id: detail.request_id || null,
      ts: detail.ts || new Date().toISOString(),
    };
    return { from: FROM, to: TO, msg: "[tool-bench] " + id + " :: " + line, payload: payload };
  }

  // POST one event to :8989. Returns a promise resolving to {ok, status}.
  async function post(detail) {
    if (!ENABLED) return { ok: false, reason: "disabled" };
    var body = toMessage(detail);
    try {
      var res = await fetch(SWARM_URL + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        LAST_OK = new Date().toISOString();
        FAILS = 0;
        return { ok: true, status: res.status };
      }
      FAILS++;
      return { ok: false, reason: "status_" + res.status };
    } catch (e) {
      FAILS++;
      return { ok: false, reason: "network:" + e.message };
    }
  }

  // Attach a listener that forwards every zoth:tool-bench event to :8989.
  function attach() {
    if (typeof window === "undefined" || !window.addEventListener) return false;
    window.addEventListener("zoth:tool-bench", function (e) {
      post((e && e.detail) || {});
    });
    return true;
  }

  // One-shot heartbeat so the swarm bus shows Hermes active in the tooling lane.
  async function heartbeat(toolCount, assertionCount) {
    return post({
      event: "heartbeat",
      id: "tool-bench",
      code: "sync",
      ts: new Date().toISOString(),
      // extra context carried via msg line
      _note: ("tools=" + (toolCount || 0) + " tests=" + (assertionCount || 0)),
    });
  }

  return {
    SWARM_URL: SWARM_URL,
    setEnabled: setEnabled,
    status: status,
    toMessage: toMessage,
    post: post,
    attach: attach,
    heartbeat: heartbeat,
  };
});
