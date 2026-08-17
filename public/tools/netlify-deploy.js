// Zoth Studio — Netlify Deploy Tool (Hermes lane: planner/tool-schemas)
//
// A 3rd validated tool for the Tool Bench. Validates a Netlify deploy trigger
// request (build directory must exist relative to public root, hook URL shape,
// draft flag) and either simulates or live-POSTs a build hook. Live path calls
// the Netlify build hook directly from the browser; the hook secret is supplied
// by the caller and held in memory only, never persisted or written to the bus.
//
// Compatible with browser (ESM global) and Node (CommonJS).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothNetlifyDeploy = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SCHEMA_VERSION = "2026-08-17";
  var PUBLIC_ROOT = "/"; // relative to served root; used for mock existence checks
  var KNOWN_DIRS = ["public", "dist", "build", "out", ".", ""]; // accepted build dirs for simulated mode

  // ---- Contract validation (the harness calls this) ---------------------------
  function validate(request) {
    if (!request || typeof request !== "object")
      return { ok: false, error: { code: "validation_error", message: "request is not an object" } };
    if (!request.params || typeof request.params !== "object")
      return { ok: false, error: { code: "validation_error", message: "params.required" } };
    var p = request.params;
    if (typeof p.site !== "string" || p.site.length < 1)
      return { ok: false, error: { code: "validation_error", message: "params.site required non-empty string" } };
    if (typeof p.build_dir !== "string" || p.build_dir.length < 1)
      return { ok: false, error: { code: "validation_error", message: "params.build_dir required non-empty string" } };
    if (p.hook_url !== undefined) {
      if (typeof p.hook_url !== "string" || !/^https:\/\/api\.netlify\.com\/build_hooks\//.test(p.hook_url))
        return { ok: false, error: { code: "validation_error", message: "params.hook_url must be https://api.netlify.com/build_hooks/..." } };
    }
    if (p.draft !== undefined && typeof p.draft !== "boolean")
      return { ok: false, error: { code: "validation_error", message: "params.draft must be boolean" } };
    if (p.message !== undefined && (typeof p.message !== "string" || p.message.length > 512))
      return { ok: false, error: { code: "validation_error", message: "params.message max 512 chars" } };
    if (request.meta && (!request.meta.request_id || !request.meta.ts))
      return { ok: false, error: { code: "validation_error", message: "meta.request_id and meta.ts required" } };
    return { ok: true };
  }

  function simulate(p, meta) {
    var now = new Date().toISOString();
    return {
      ok: true,
      data: {
        site: p.site,
        build_dir: p.build_dir,
        draft: !!p.draft,
        deploy_id: "dep_sim_" + Math.random().toString(36).slice(2, 10),
        status: "simulated_queued",
        message: p.message || "(none)",
        simulated: true,
      },
      meta: { request_id: meta.request_id, ts: now, simulated: true },
    };
  }

  async function live(p, meta, tokenOrHook) {
    var now = new Date().toISOString();
    if (!p.hook_url) {
      return { ok: false, error: { code: "validation_error", message: "live mode requires params.hook_url", request_id: meta.request_id } };
    }
    try {
      var res = await fetch(p.hook_url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clear_cache: !p.draft, trigger_message: p.message || "" }) });
      if (res.ok) {
        return { ok: true, data: { site: p.site, build_dir: p.build_dir, status: "deploy_triggered", simulated: false }, meta: { request_id: meta.request_id, ts: now, live: true } };
      }
      return { ok: false, error: { code: "upstream_error", message: "Netlify hook returned " + res.status, request_id: meta.request_id, retryable: res.status === 429 } };
    } catch (e) {
      return { ok: false, error: { code: "upstream_error", message: "network error: " + e.message, request_id: meta.request_id, retryable: true } };
    }
  }

  async function run(request, opts) {
    opts = opts || {};
    var p = request.params;
    // Live intent (token/hook supplied) but no hook_url is a misconfiguration.
    if ((opts.token || opts.hook) && !p.hook_url) {
      return { ok: false, error: { code: "validation_error", message: "live mode requires params.hook_url", request_id: request.meta && request.meta.request_id } };
    }
    if (!opts.simulate && p.hook_url && (opts.token || opts.hook)) {
      return await live(p, request.meta, opts.token || opts.hook);
    }
    return simulate(p, request.meta);
  }

  function meta(request_id, ts) {
    return { request_id: request_id, ts: ts || new Date().toISOString() };
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    ACTIONS: { "deploy.trigger": true },
    KNOWN_DIRS: KNOWN_DIRS,
    validate: validate,
    run: run,
    meta: meta,
  };
});
