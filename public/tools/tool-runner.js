// Zoth Studio — Validated Tool Harness (Hermes lane: planner/tool-schemas)
//
// A small, reusable runtime that turns any contract-validated tool module into a
// uniformly-addressable, bus-telemetered unit. Agents register tools; the harness
// validates the request against the tool's own validate(), runs it, records an
// execution log, and emits zoth:tool-bench CustomEvents (the file bus remains
// authoritative; these events are a non-authoritative live mirror).
//
// The GitHub Tool is registered automatically on load. New tools drop in by calling
// ZothToolBench.register({ id, version, actions, validate, run, meta }).
//
// Compatible with browser (ESM global) and Node (CommonJS) for tests.

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothToolBench = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var MAX_LOG = 100;
  var tools = {};        // id -> tool definition
  var execLog = [];      // capped execution records

  function emit(detail) {
    try {
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("zoth:tool-bench", { detail: detail }));
      }
    } catch (e) { /* no-op */ }
  }

  function record(rec) {
    execLog.push(rec);
    if (execLog.length > MAX_LOG) execLog.shift();
  }

  function register(tool) {
    if (!tool || !tool.id) throw new Error("tool.id required");
    if (typeof tool.validate !== "function") throw new Error("tool.validate required");
    if (typeof tool.run !== "function") throw new Error("tool.run required");
    tools[tool.id] = tool;
    emit({ event: "registered", id: tool.id, version: tool.version, ts: new Date().toISOString() });
    return tool.id;
  }

  function list() {
    return Object.keys(tools).map(function (id) {
      var t = tools[id];
      return { id: id, version: t.version, actions: t.actions || [], owner: t.owner || null, schemaHref: t.schemaHref || null };
    });
  }

  function get(id) { return tools[id] || null; }

  function nowIso() { return new Date().toISOString(); }

  // Uniform dispatch. request = { action, params, meta } (meta optional; filled if absent).
  async function run(id, request, opts) {
    opts = opts || {};
    var tool = tools[id];
    if (!tool) {
      var nf = { ok: false, error: { code: "action_not_found", message: "tool not registered: " + id } };
      record({ id: id, ok: false, code: "action_not_found", ts: nowIso() });
      emit({ event: "error", id: id, code: "action_not_found", ts: nowIso() });
      return nf;
    }
    // Ensure meta exists for correlation.
    var req = request;
    if (!req.meta) {
      var fallbackMeta = (tool.meta && typeof tool.meta === "function")
        ? tool.meta("bench_" + Math.random().toString(36).slice(2, 8))
        : { request_id: "bench_" + Date.now(), ts: nowIso() };
      req = Object.assign({}, request, { meta: fallbackMeta });
    }
    // Validate via the tool's own contract validator.
    var v = tool.validate(req);
    if (!v.ok) {
      record({ id: id, ok: false, code: v.error.code, message: v.error.message, ts: nowIso() });
      emit({ event: "validation_error", id: id, code: v.error.code, message: v.error.message, request_id: req.meta && req.meta.request_id, ts: nowIso() });
      return v;
    }
    try {
      var out = await tool.run(req, opts);
      var ok = !!(out && out.ok);
      record({ id: id, ok: ok, code: ok ? "executed" : (out.error && out.error.code), simulated: !!(out.meta && out.meta.simulated), ts: nowIso() });
      emit({ event: ok ? "executed" : "error", id: id, code: ok ? "executed" : (out.error && out.error.code), simulated: !!(out.meta && out.meta.simulated), request_id: req.meta && req.meta.request_id, ts: nowIso() });
      return out;
    } catch (err) {
      record({ id: id, ok: false, code: "internal_error", message: err.message, ts: nowIso() });
      emit({ event: "error", id: id, code: "internal_error", message: err.message, ts: nowIso() });
      return { ok: false, error: { code: "internal_error", message: err.message } };
    }
  }

  function log() { return execLog.slice(); }

  // ---- Auto-register the GitHub Tool if its module is present ------------------
  function autoRegisterGitHub() {
    try {
      var Gh = (typeof window !== "undefined" && window.ZothGitHubTool) || (typeof require !== "undefined" && require("./github-tool.js"));
      if (Gh && typeof Gh.validate === "function") {
        register({
          id: "github-tool",
          version: Gh.SCHEMA_VERSION,
          owner: "hermes",
          actions: Object.keys(Gh.ACTIONS),
          schemaHref: "/tools/github-tool.schema.json",
          validate: Gh.validate,
          run: Gh.run,
          meta: Gh.meta,
        });
      }
    } catch (e) { /* github-tool not present; skip */ }
  }
  autoRegisterGitHub();

  return {
    register: register,
    list: list,
    get: get,
    run: run,
    log: log,
    _tools: tools,
    _execLog: execLog,
  };
});
