// Zoth Studio — Blueprint Validator Tool (Hermes lane: planner/tool-schemas)
//
// A second validated tool for the Tool Bench. Validates a Zoth Blueprint Foundry
// manifest (zoth-blueprint.json) against the canonical shape used across the
// project, returning a structured report (errors + warnings). Runs client-side;
// no network. Demonstrates the reusable harness with a non-GitHub tool.
//
// Compatible with browser (ESM global) and Node (CommonJS).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothBlueprintValidator = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SCHEMA_VERSION = "2026-08-17";

  var REQUIRED_TOP = ["id", "name", "version", "archetype", "category", "description"];
  var OPTIONAL_TOP = ["ai_composable_modules", "technical_hooks", "seo_aeo_schemas", "tags", "owner", "lane", "tests", "deployment", "contract"];
  var MODULE_REQUIRED = ["name", "file", "type", "purpose"]; // purpose optional but recommended

  // ---- Contract validation (the harness calls this) ---------------------------
  function validate(request) {
    if (!request || typeof request !== "object")
      return { ok: false, error: { code: "validation_error", message: "request is not an object" } };
    if (!request.params || typeof request.params !== "object")
      return { ok: false, error: { code: "validation_error", message: "params.required" } };
    var p = request.params;
    if (typeof p.source !== "string" && !p.blueprint)
      return { ok: false, error: { code: "validation_error", message: "params.source (raw JSON/text) or params.blueprint (object) required" } };
    if (request.meta && (!request.meta.request_id || !request.meta.ts))
      return { ok: false, error: { code: "validation_error", message: "meta.request_id and meta.ts required" } };
    return { ok: true };
  }

  // Parse + run the actual validation report.
  function run(request, opts) {
    opts = opts || {};
    var p = request.params;
    var raw = p.source;
    var bp = p.blueprint || null;
    if (!bp) {
      try {
        bp = JSON.parse(raw);
      } catch (e) {
        return { ok: true, data: { valid: false, errors: ["JSON parse failure: " + e.message], warnings: [], score: 0 }, meta: { request_id: (request.meta && request.meta.request_id) || "bpv", ts: new Date().toISOString(), simulated: false } };
      }
    }
    var report = analyze(bp);
    return {
      ok: true,
      data: report,
      meta: { request_id: (request.meta && request.meta.request_id) || "bpv", ts: new Date().toISOString(), simulated: false },
    };
  }

  function analyze(bp) {
    var errors = [], warnings = [];
    if (typeof bp !== "object" || bp === null) { return { valid: false, errors: ["blueprint is not an object"], warnings: [], score: 0 }; }
    REQUIRED_TOP.forEach(function (k) {
      if (bp[k] === undefined || bp[k] === null || bp[k] === "")
        errors.push("missing required top-level field: " + k);
    });
    Object.keys(bp).forEach(function (k) {
      if (REQUIRED_TOP.indexOf(k) === -1 && OPTIONAL_TOP.indexOf(k) === -1)
        warnings.push("unknown top-level field (ignored): " + k);
    });
    if (bp.id !== undefined && typeof bp.id !== "string") errors.push("id must be string");
    if (bp.version !== undefined && typeof bp.version !== "string") errors.push("version must be string");
    if (bp.tags !== undefined) {
      if (!Array.isArray(bp.tags) || !bp.tags.every(function (t) { return typeof t === "string"; }))
        errors.push("tags must be string[]");
    }
    if (bp.ai_composable_modules !== undefined) {
      if (!Array.isArray(bp.ai_composable_modules)) {
        errors.push("ai_composable_modules must be array");
      } else {
        bp.ai_composable_modules.forEach(function (m, i) {
          MODULE_REQUIRED.forEach(function (rk) {
            if (!m[rk]) warnings.push("module[" + i + "] (" + (m.name || "?") + ") missing recommended field: " + rk);
          });
        });
      }
    } else {
      warnings.push("no ai_composable_modules (recommended for composability)");
    }
    if (bp.seo_aeo_schemas === undefined) warnings.push("no seo_aeo_schemas (AEO-native recommended)");
    if (bp.technical_hooks === undefined) warnings.push("no technical_hooks (recommended)");

    var score = 100 - errors.length * 20 - warnings.length * 5;
    if (score < 0) score = 0;
    return { valid: errors.length === 0, errors: errors, warnings: warnings, score: score };
  }

  function meta(request_id, ts) {
    return { request_id: request_id, ts: ts || new Date().toISOString() };
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    ACTIONS: { "blueprint.validate": true },
    validate: validate,
    run: run,
    analyze: analyze,
    meta: meta,
  };
});
