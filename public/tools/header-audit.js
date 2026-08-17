// Zoth Studio — Header Audit Tool (Hermes lane: planner/tool-schemas)
//
// A 4th validated tool for the Tool Bench. Audits a target URL's HTTP response
// headers against Zoth Studio's documented OWASP shield (CSP, X-Frame-Options,
// X-Content-Type-Options, HSTS, X-XSS-Protection, Referrer-Policy,
// Permissions-Policy) plus AEO discovery files (llms.txt, robots.txt). The
// contract validates the request; the run fetches live headers (CORS: only
// works against the local :8088/:8484 hubs or any CORS-enabled host) and
// returns a structured report. Fail-soft on network/CORS errors.
//
// Compatible with browser (ESM global) and Node (CommonJS).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothHeaderAudit = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SCHEMA_VERSION = "2026-08-17";

  // The shields Zoth Studio's architecture promises (see architecture doc).
  var OWASP_SHIELDS = [
    { key: "content-security-policy", label: "Content-Security-Policy", required: true, severity: "p1" },
    { key: "x-frame-options", label: "X-Frame-Options", required: true, severity: "p1", expect: /DENY|ALLOW-FROM|SAMEORIGIN/i },
    { key: "x-content-type-options", label: "X-Content-Type-Options", required: true, severity: "p2", expect: /nosniff/i },
    { key: "strict-transport-security", label: "Strict-Transport-Security", required: true, severity: "p1" },
    { key: "x-xss-protection", label: "X-XSS-Protection", required: false, severity: "p3", expect: /[01]/ },
    { key: "referrer-policy", label: "Referrer-Policy", required: false, severity: "p3" },
    { key: "permissions-policy", label: "Permissions-Policy", required: false, severity: "p3" },
  ];

  var AEO_FILES = [
    { path: "/llms.txt", label: "llms.txt" },
    { path: "/llms-full.txt", label: "llms-full.txt" },
    { path: "/robots.txt", label: "robots.txt" },
  ];

  function validate(request) {
    if (!request || typeof request !== "object")
      return { ok: false, error: { code: "validation_error", message: "request is not an object" } };
    if (!request.params || typeof request.params !== "object")
      return { ok: false, error: { code: "validation_error", message: "params.required" } };
    var p = request.params;
    if (typeof p.target !== "string" || p.target.length < 1)
      return { ok: false, error: { code: "validation_error", message: "params.target required non-empty string" } };
    if (!/^https?:\/\//.test(p.target))
      return { ok: false, error: { code: "validation_error", message: "params.target must be http(s)://" } };
    if (p.checks && !Array.isArray(p.checks))
      return { ok: false, error: { code: "validation_error", message: "params.checks must be array" } };
    if (request.meta && (!request.meta.request_id || !request.meta.ts))
      return { ok: false, error: { code: "validation_error", message: "meta.request_id and meta.ts required" } };
    return { ok: true };
  }

  // Build the header map (lowercased keys) from a Headers object or plain object.
  function normalizeHeaders(hdrs) {
    var map = {};
    if (hdrs && typeof hdrs.forEach === "function") {
      hdrs.forEach(function (v, k) { map[String(k).toLowerCase()] = v; });
    } else if (hdrs && typeof hdrs.get === "function") {
      hdrs.forEach && hdrs.forEach(function (v, k) { map[String(k).toLowerCase()] = v; });
    } else if (hdrs && typeof hdrs === "object") {
      Object.keys(hdrs).forEach(function (k) { map[String(k).toLowerCase()] = hdrs[k]; });
    }
    return map;
  }

  function analyzeHeaders(headerMap) {
    var findings = [];
    OWASP_SHIELDS.forEach(function (s) {
      var present = headerMap[s.key];
      if (!present) {
        findings.push({
          check: s.label, type: "owasp", present: false, required: s.required,
          severity: s.required ? s.severity : "p3",
          message: s.required ? "MISSING required shield" : "missing (optional)",
        });
      } else if (s.expect && !s.expect.test(present)) {
        findings.push({ check: s.label, type: "owasp", present: true, required: s.required, severity: s.severity, message: "present but unexpected value: " + present });
      } else {
        findings.push({ check: s.label, type: "owasp", present: true, required: s.required, severity: "ok", message: "ok" });
      }
    });
    return findings;
  }

  async function run(request, opts) {
    opts = opts || {};
    var p = request.params;
    var target = p.target;
    var checks = p.checks || ["owasp", "aeo"];

    var report = { target: target, checks: checks, headers: {}, owasp: [], aeo: [], score: 0, fetched: false, error: null };

    if (checks.indexOf("owasp") > -1) {
      try {
        var res = await fetch(target, { method: "GET", redirect: "follow" });
        report.fetched = true;
        var hmap = normalizeHeaders(res.headers);
        // Also capture a few informational headers
        ["server", "content-type", "x-powered-by"].forEach(function (k) {
          if (hmap[k]) report.headers[k] = hmap[k];
        });
        report.owasp = analyzeHeaders(hmap);
      } catch (e) {
        report.error = "header fetch failed (network/CORS): " + e.message;
        report.owasp = OWASP_SHIELDS.map(function (s) { return { check: s.label, type: "owasp", present: false, required: s.required, severity: s.required ? s.severity : "p3", message: "unreachable" }; });
      }
    }

    if (checks.indexOf("aeo") > -1) {
      for (var i = 0; i < AEO_FILES.length; i++) {
        var f = AEO_FILES[i];
        var url = target.replace(/\/$/, "") + f.path;
        try {
          var r = await fetch(url, { method: "GET", redirect: "follow" });
          report.aeo.push({ file: f.label, url: url, status: r.status, present: r.ok || r.status === 200 });
        } catch (e) {
          report.aeo.push({ file: f.label, url: url, status: null, present: false, error: e.message });
        }
      }
    }

    // Score: start 100, -15 per required missing shield, -3 per optional missing, -5 per bad value.
    var score = 100;
    report.owasp.forEach(function (f) {
      if (!f.present && f.required) score -= 15;
      else if (!f.present && !f.required) score -= 3;
      else if (f.present && f.severity !== "ok") score -= 5;
    });
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    report.score = score;

    return { ok: true, data: report, meta: { request_id: (request.meta && request.meta.request_id) || "ha", ts: new Date().toISOString() } };
  }

  function meta(request_id, ts) {
    return { request_id: request_id, ts: ts || new Date().toISOString() };
  }

  // Pure analyzer (no fetch) — used by tests.
  function analyze(headerMap) {
    return analyzeHeaders(normalizeHeaders(headerMap));
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    ACTIONS: { "header.audit": true },
    OWASP_SHIELDS: OWASP_SHIELDS,
    validate: validate,
    run: run,
    analyze: analyze,
    meta: meta,
  };
});
