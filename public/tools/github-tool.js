// Zoth Studio — GitHub Tool (Hermes lane: planner/tool-schemas)
//
// A runnable, schema-validated GitHub tool. Every request is validated against the
// contract in github-tool.schema.json BEFORE any network call. Live execution calls
// the GitHub REST API directly from the browser; the token is held only in memory
// (never persisted, never written to the bus). No token => simulated/dry-run mode.
//
// Exposed on window.ZothGitHubTool for the /studio/ UI and for other agents that
// want to script it. Compatible with both browser (ESM) and Node (CommonJS) for tests.

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothGitHubTool = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SCHEMA_VERSION = "2026-08-17";
  var API_BASE = "https://api.github.com";

  // ---- Contract metadata: the 5 supported actions + per-action rules ----------
  var ACTIONS = {
    "issues.list": {
      method: "GET",
      required: ["owner", "repo"],
      optional: ["state", "per_page", "page", "labels", "since"],
      list: true,
    },
    "issues.create": {
      method: "POST",
      required: ["owner", "repo", "title"],
      optional: ["body", "labels", "assignees"],
      list: false,
    },
    "prs.list": {
      method: "GET",
      required: ["owner", "repo"],
      optional: ["state", "per_page", "page", "head", "base", "sort", "direction"],
      list: true,
    },
    "prs.create": {
      method: "POST",
      required: ["owner", "repo", "title", "head", "base"],
      optional: ["body", "draft", "maintainer_can_modify"],
      list: false,
    },
    "repos.list": {
      method: "GET",
      required: ["owner"],
      optional: ["per_page", "page", "type", "sort", "direction"],
      list: true,
    },
  };

  var ERROR_CODES = [
    "validation_error",
    "action_not_found",
    "not_found",
    "conflict",
    "rate_limited",
    "auth_failed",
    "upstream_error",
    "internal_error",
  ];

  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }
  function isString(v) {
    return typeof v === "string";
  }
  function isInteger(v) {
    return typeof v === "number" && Number.isInteger(v);
  }
  function isArrayOfStrings(v) {
    return Array.isArray(v) && v.every(function (x) { return isString(x); });
  }
  function isIsoDate(v) {
    if (!isString(v)) return false;
    var d = new Date(v);
    return !isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(v);
  }

  // Per-field validators keyed by "action.field".
  function validateField(action, field, value, errors) {
    switch (action + "." + field) {
      case "issues.list.per_page":
      case "prs.list.per_page":
      case "repos.list.per_page":
        if (!isInteger(value) || value < 1 || value > 100)
          errors.push(field + ": must be integer 1..100");
        break;
      case "issues.list.page":
      case "prs.list.page":
      case "repos.list.page":
        if (!isInteger(value) || value < 1) errors.push(field + ": must be integer >= 1");
        break;
      case "issues.list.state":
      case "prs.list.state":
        if (!["open", "closed", "all"].includes(value))
          errors.push(field + ": must be open|closed|all");
        break;
      case "issues.list.labels":
        if (!isArrayOfStrings(value)) errors.push(field + ": must be string[]");
        break;
      case "issues.list.since":
        if (!isIsoDate(value)) errors.push(field + ": must be ISO-8601 date-time");
        break;
      case "issues.create.title":
        if (value.length > 256) errors.push(field + ": max 256 chars");
        if (value.length < 1) errors.push(field + ": required non-empty");
        break;
      case "issues.create.body":
        if (!isString(value) || value.length > 65536) errors.push(field + ": max 65536 chars");
        break;
      case "issues.create.labels":
        if (!isArrayOfStrings(value) || value.length > 100)
          errors.push(field + ": string[] (max 100)");
        break;
      case "issues.create.assignees":
        if (!isArrayOfStrings(value) || value.length > 50)
          errors.push(field + ": string[] (max 50)");
        break;
      case "prs.list.head":
      case "prs.create.head":
        if (!/^\S+$/.test(value)) errors.push(field + ": no whitespace allowed");
        break;
      case "prs.create.title":
        if (value.length > 256 || value.length < 1)
          errors.push(field + ": 1..256 chars");
        break;
      case "prs.create.body":
        if (!isString(value) || value.length > 65536) errors.push(field + ": max 65536 chars");
        break;
      case "prs.create.draft":
      case "prs.create.maintainer_can_modify":
        if (typeof value !== "boolean") errors.push(field + ": must be boolean");
        break;
      case "repos.list.type":
        if (!["all", "owner", "member"].includes(value))
          errors.push(field + ": must be all|owner|member");
        break;
      case "repos.list.sort":
        if (!["created", "updated", "pushed", "full_name"].includes(value))
          errors.push(field + ": invalid sort");
        break;
      case "repos.list.direction":
        if (!["asc", "desc"].includes(value)) errors.push(field + ": must be asc|desc");
        break;
      default:
        // owner / repo / title / head / base: non-empty strings
        if (!isString(value) || value.length < 1) errors.push(field + ": required non-empty string");
    }
  }

  // ---- Contract validation: mirror of github-tool.schema.json ------------------
  function validate(request) {
    var errors = [];
    if (!isObject(request)) {
      return { ok: false, error: { code: "validation_error", message: "request is not an object", details: {} } };
    }
    if (!request.action || !ACTIONS[request.action]) {
      return {
        ok: false,
        error: {
          code: "action_not_found",
          message: "action must be one of: " + Object.keys(ACTIONS).join(", "),
          details: { got: request && request.action },
        },
      };
    }
    if (!isObject(request.params)) {
      errors.push("params: required object");
    } else {
      var spec = ACTIONS[request.action];
      var keys = Object.keys(request.params);
      // additionalProperties:false
      var allowed = spec.required.concat(spec.optional);
      keys.forEach(function (k) {
        if (allowed.indexOf(k) === -1)
          errors.push("params." + k + ": not allowed for " + request.action);
      });
      spec.required.forEach(function (req) {
        if (request.params[req] === undefined || request.params[req] === null)
          errors.push("params." + req + ": required");
      });
      keys.forEach(function (k) {
        if (request.params[k] !== undefined) validateField(request.action, k, request.params[k], errors);
      });
    }
    if (!isObject(request.meta)) {
      errors.push("meta: required object");
    } else {
      if (!isString(request.meta.request_id) || request.meta.request_id.length < 1)
        errors.push("meta.request_id: required non-empty string");
      if (!isIsoDate(request.meta.ts))
        errors.push("meta.ts: required ISO-8601 date-time");
      if (request.meta.token_ref !== undefined && !isString(request.meta.token_ref))
        errors.push("meta.token_ref: must be string");
    }
    if (errors.length) {
      return {
        ok: false,
        error: { code: "validation_error", message: errors.join("; "), details: { errors: errors } },
      };
    }
    return { ok: true };
  }

  // ---- URL + body builders -----------------------------------------------------
  function buildRequest(action, params) {
    var method = ACTIONS[action].method;
    var url, query = {}, body = null;
    switch (action) {
      case "issues.list":
        url = API_BASE + "/repos/" + params.owner + "/" + params.repo + "/issues";
        if (params.state) query.state = params.state;
        if (params.per_page) query.per_page = params.per_page;
        if (params.page) query.page = params.page;
        if (params.labels) query.labels = params.labels.join(",");
        if (params.since) query.since = params.since;
        break;
      case "issues.create":
        url = API_BASE + "/repos/" + params.owner + "/" + params.repo + "/issues";
        body = { title: params.title };
        if (params.body) body.body = params.body;
        if (params.labels) body.labels = params.labels;
        if (params.assignees) body.assignees = params.assignees;
        break;
      case "prs.list":
        url = API_BASE + "/repos/" + params.owner + "/" + params.repo + "/pulls";
        if (params.state) query.state = params.state;
        if (params.per_page) query.per_page = params.per_page;
        if (params.page) query.page = params.page;
        if (params.head) query.head = params.head;
        if (params.base) query.base = params.base;
        if (params.sort) query.sort = params.sort;
        if (params.direction) query.direction = params.direction;
        break;
      case "prs.create":
        url = API_BASE + "/repos/" + params.owner + "/" + params.repo + "/pulls";
        body = {
          title: params.title,
          head: params.head,
          base: params.base,
        };
        if (params.body) body.body = params.body;
        if (params.draft !== undefined) body.draft = params.draft;
        if (params.maintainer_can_modify !== undefined)
          body.maintainer_can_modify = params.maintainer_can_modify;
        break;
      case "repos.list":
        url = API_BASE + "/users/" + params.owner + "/repos";
        if (params.type) query.type = params.type;
        if (params.sort) query.sort = params.sort;
        if (params.direction) query.direction = params.direction;
        if (params.per_page) query.per_page = params.per_page;
        if (params.page) query.page = params.page;
        break;
    }
    var qs = Object.keys(query)
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(query[k]); })
      .join("&");
    if (qs) url += "?" + qs;
    return { method: method, url: url, body: body };
  }

  // ---- Bus telemetry (non-authoritative; file bus is authoritative) ------------
  function emitBusEvent(detail) {
    try {
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("zoth:github-tool", { detail: detail }));
      }
    } catch (e) {
      /* no-op */
    }
  }

  // ---- Simulated responses (no token / offline) ------------------------------
  function simulate(action, params, meta) {
    var now = new Date().toISOString();
    var data;
    switch (action) {
      case "issues.list":
        data = {
          items: [
            { number: 1, title: "Example issue (simulated)", state: params.state || "open", url: "https://github.com/" + params.owner + "/" + params.repo + "/issues/1" },
            { number: 2, title: "Another tracked item (simulated)", state: params.state || "open", url: "https://github.com/" + params.owner + "/" + params.repo + "/issues/2" },
          ],
          page: params.page || 1,
          per_page: params.per_page || 30,
          simulated: true,
        };
        break;
      case "issues.create":
        data = {
          number: 100 + Math.floor(Math.random() * 900),
          title: params.title,
          labels: params.labels || ["zoth-agent"],
          url: "https://github.com/" + params.owner + "/" + params.repo + "/issues/100",
          simulated: true,
        };
        break;
      case "prs.list":
        data = {
          items: [
            { number: 7, title: "Feature branch (simulated)", state: params.state || "open", head: "feature-x", base: "main" },
          ],
          simulated: true,
        };
        break;
      case "prs.create":
        data = {
          number: 42,
          title: params.title,
          head: params.head,
          base: params.base,
          url: "https://github.com/" + params.owner + "/" + params.repo + "/pull/42",
          simulated: true,
        };
        break;
      case "repos.list":
        data = {
          items: [
            { name: params.owner + "/zoth", private: false, stars: 12, url: "https://github.com/" + params.owner + "/zoth" },
            { name: params.owner + "/vault", private: true, stars: 3, url: "https://github.com/" + params.owner + "/vault" },
          ],
          simulated: true,
        };
        break;
    }
    emitBusEvent({ event: "executed", mode: "simulated", action: action, request_id: meta.request_id, ts: now });
    return { ok: true, data: data, meta: { request_id: meta.request_id, ts: now, simulated: true } };
  }

  // ---- Live execution against GitHub REST API ---------------------------------
  async function executeLive(action, params, meta, token) {
    var req = buildRequest(action, params);
    var headers = {
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: "Bearer " + token,
    };
    var now = new Date().toISOString();
    var res;
    try {
      res = await fetch(req.url, {
        method: req.method,
        headers: headers,
        body: req.body ? JSON.stringify(req.body) : undefined,
      });
    } catch (networkErr) {
      emitBusEvent({ event: "error", action: action, request_id: meta.request_id, code: "upstream_error", ts: now });
      return {
        ok: false,
        error: { code: "upstream_error", message: "network error: " + networkErr.message, request_id: meta.request_id, retryable: true },
      };
    }
    var rateRemaining = res.headers.get("x-ratelimit-remaining");
    if (res.status === 401 || res.status === 403) {
      emitBusEvent({ event: "error", action: action, request_id: meta.request_id, code: "auth_failed", ts: now });
      return {
        ok: false,
        error: { code: "auth_failed", message: "GitHub rejected the token (401/403).", request_id: meta.request_id, retryable: false },
      };
    }
    if (res.status === 404) {
      return {
        ok: false,
        error: { code: "not_found", message: "Resource not found (404). Check owner/repo.", request_id: meta.request_id },
      };
    }
    if (res.status === 422) {
      return {
        ok: false,
        error: { code: "conflict", message: "Unprocessable (422): " + (await safeText(res)), request_id: meta.request_id },
      };
    }
    if (res.status === 429) {
      return {
        ok: false,
        error: { code: "rate_limited", message: "GitHub rate limit hit.", request_id: meta.request_id, retryable: true, details: { remaining: rateRemaining } },
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: { code: "upstream_error", message: "GitHub error " + res.status + ": " + (await safeText(res)), request_id: meta.request_id },
      };
    }
    var json;
    try {
      json = await res.json();
    } catch (e) {
      json = null;
    }
    var data = normalize(action, json);
    emitBusEvent({ event: "executed", mode: "live", action: action, request_id: meta.request_id, ts: now, remaining: rateRemaining });
    return { ok: true, data: data, meta: { request_id: meta.request_id, ts: now, live: true } };
  }

  async function safeText(res) {
    try { return (await res.text()).slice(0, 300); } catch (e) { return ""; }
  }

  // Normalize GitHub's rich payload down to contract-stable fields.
  function normalize(action, json) {
    if (action === "issues.list" || action === "prs.list" || action === "repos.list") {
      var arr = Array.isArray(json) ? json : (json && json.items ? json.items : []);
      return {
        items: arr.map(function (it) {
          return {
            id: it.id,
            number: it.number,
            title: it.title,
            state: it.state,
            url: it.html_url || it.url,
            user: it.user && it.user.login,
            created_at: it.created_at,
            updated_at: it.updated_at,
          };
        }),
        count: arr.length,
      };
    }
    if (action === "issues.create" || action === "prs.create") {
      return {
        id: json && json.id,
        number: json && json.number,
        title: json && json.title,
        url: json && (json.html_url || json.url),
        state: json && json.state,
        created_at: json && json.created_at,
      };
    }
    return json;
  }

  // ---- Public entrypoint ------------------------------------------------------
  // opts.token: GitHub PAT held in memory only. If absent => simulated mode.
  // opts.simulate: force simulated mode even if a token exists.
  async function run(request, opts) {
    opts = opts || {};
    var v = validate(request);
    if (!v.ok) {
      emitBusEvent({ event: "validation_error", action: request && request.action, request_id: request && request.meta && request.meta.request_id, message: v.error.message });
      return v; // { ok:false, error }
    }
    var token = opts.token;
    if (!opts.simulate && token) {
      return await executeLive(request.action, request.params, request.meta, token);
    }
    return simulate(request.action, request.params, request.meta);
  }

  function meta(request_id, ts) {
    return { request_id: request_id, ts: ts || new Date().toISOString() };
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    ACTIONS: ACTIONS,
    ERROR_CODES: ERROR_CODES,
    validate: validate,
    buildRequest: buildRequest,
    run: run,
    meta: meta,
  };
});
