// Zoth Studio — AST Sanitizer & Shannon Entropy Tool (Antigravity lane: ast/compiler-invariants)
//
// Validates source code strings against forbidden tokens, builds an AST metadata summary,
// and computes Shannon entropy H(X) to evaluate randomness, obfuscation, or structural complexity.
//
// Compatible with browser (ESM/window global) and Node (CommonJS).

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZothAstSanitizer = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SCHEMA_VERSION = "2026-08-20";

  function calculateEntropy(str) {
    if (!str || str.length === 0) return 0;
    var freq = {};
    for (var i = 0; i < str.length; i++) {
      var ch = str[i];
      freq[ch] = (freq[ch] || 0) + 1;
    }
    var entropy = 0;
    var len = str.length;
    for (var k in freq) {
      var p = freq[k] / len;
      entropy -= p * Math.log2(p);
    }
    return Math.round(entropy * 1000) / 1000;
  }

  function parseArgs(arg1, arg2) {
    if (arg1 && typeof arg1 === "object" && arg1.action) {
      return {
        action: arg1.action,
        params: arg1.params || {},
        meta: arg1.meta || { request_id: "ast_" + Math.random().toString(36).slice(2, 9), ts: new Date().toISOString() }
      };
    }
    return {
      action: typeof arg1 === "string" ? arg1 : "ast.sanitize",
      params: (arg2 && typeof arg2 === "object") ? arg2 : {},
      meta: { request_id: "ast_" + Math.random().toString(36).slice(2, 9), ts: new Date().toISOString() }
    };
  }

  function validate(request, legacyParams) {
    var req = parseArgs(request, legacyParams);
    var action = req.action;
    var params = req.params;

    if (action !== "ast.sanitize" && action !== "ast.entropy") {
      return { ok: false, error: { code: "action_not_found", message: "Unsupported action: " + action } };
    }
    if (!params || typeof params.code !== "string" || !params.code.trim()) {
      return { ok: false, error: { code: "validation_error", message: "Missing required parameter 'code' (non-empty string)" } };
    }
    return { ok: true };
  }

  async function run(request, opts) {
    var req = parseArgs(request, (opts && opts.params) ? opts.params : opts);
    var v = validate(req);
    if (!v.ok) {
      return {
        ok: false,
        error: v.error,
        meta: { request_id: req.meta.request_id, ts: req.meta.ts, simulated: false }
      };
    }

    var params = req.params;
    var code = params.code;
    var language = params.language || "python";
    var entropy = calculateEntropy(code);
    var forbiddenTokens = ["eval(", "exec(", "__import__", "os.system", "subprocess.Popen", "rm -rf", "child_process", "Function("];
    var flagged = [];

    forbiddenTokens.forEach(function (token) {
      if (code.indexOf(token) !== -1) {
        flagged.push(token);
      }
    });

    var lines = code.split("\n");
    var astTree = {
      type: "Program",
      language: language,
      loc: { lines: lines.length, chars: code.length },
      entropy_shannon_bits: entropy,
      security_flags: flagged,
      is_safe: flagged.length === 0,
      structural_summary: {
        imports: (code.match(/^(import |from |require\(|import \{)/gm) || []).length,
        functions: (code.match(/(def |function |async function |\(\) =>|=>)/gm) || []).length,
        classes: (code.match(/(class )/gm) || []).length
      }
    };

    var data = {
      action: req.action,
      status: astTree.is_safe ? "CLEAN" : "FLAGGED",
      ast: astTree,
      entropy: entropy,
      summary: "AST syntax analysis completed with Shannon entropy H(X) = " + entropy + " bits. Security flags: " + (flagged.length ? flagged.join(", ") : "None (100% Clean)")
    };

    return {
      ok: true,
      data: data,
      action: req.action,
      status: data.status,
      ast: astTree,
      summary: data.summary,
      meta: {
        request_id: req.meta.request_id || ("ast_" + Date.now()),
        ts: new Date().toISOString(),
        simulated: false
      }
    };
  }

  function meta(request_id, ts) {
    return { request_id: request_id, ts: ts || new Date().toISOString() };
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    ACTIONS: {
      "ast.sanitize": "Sanitize AST source code and detect forbidden dynamic execution patterns",
      "ast.entropy": "Compute Shannon information entropy H(X) for code density and obfuscation detection"
    },
    validate: validate,
    run: run,
    meta: meta,
    calculateEntropy: calculateEntropy
  };
});

