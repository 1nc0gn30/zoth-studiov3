// Zoth Studio — Tool Bench -> Swarm Bus Mirror (Local-First BroadcastChannel + Optional :8989)
//
// Broadcasts zoth:tool-bench events across tabs via native BroadcastChannel('zoth_swarm_bus')
// and optionally mirrors to http://127.0.0.1:8989 when enabled. 100% fail-soft & local-first.

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
  var TO = "all";
  var ENABLED = false; // local-first broadcast channel by default
  var LAST_OK = null;
  var FAILS = 0;
  var busChannel = null;

  if (typeof BroadcastChannel !== "undefined") {
    try {
      busChannel = new BroadcastChannel("zoth_swarm_bus");
    } catch (e) {}
  }

  function setEnabled(v) { ENABLED = !!v; }
  function status() { return { enabled: ENABLED, last_ok: LAST_OK, fails: FAILS, target: SWARM_URL }; }

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

  async function post(detail) {
    var body = toMessage(detail);
    if (busChannel) {
      try {
        busChannel.postMessage(body);
      } catch (err) {}
    }
    if (!ENABLED) return { ok: true, channel: "broadcast_channel", status: 200 };
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
      return { ok: false, reason: "offline" };
    }
  }

  function attach() {
    if (typeof window === "undefined" || !window.addEventListener) return false;
    window.addEventListener("zoth:tool-bench", function (e) {
      post((e && e.detail) || {});
    });
    return true;
  }

  async function heartbeat(toolCount, assertionCount) {
    return post({
      event: "heartbeat",
      id: "tool-bench",
      code: "sync",
      ts: new Date().toISOString(),
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
