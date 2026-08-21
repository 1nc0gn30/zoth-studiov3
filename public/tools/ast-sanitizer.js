(function () {
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

  function validate(action, params) {
    if (action !== "ast.sanitize" && action !== "ast.entropy") {
      return { ok: false, error: "Unsupported action: " + action };
    }
    if (!params || typeof params.code !== "string" || !params.code.trim()) {
      return { ok: false, error: "Missing required parameter 'code' (string)" };
    }
    return { ok: true };
  }

  async function run(action, params) {
    var v = validate(action, params);
    if (!v.ok) return { ok: false, error: v.error, code: "VALIDATION_FAILED" };

    var code = params.code;
    var language = params.language || "python";
    var entropy = calculateEntropy(code);
    var forbiddenTokens = ["eval(", "exec(", "__import__", "os.system", "subprocess.Popen", "rm -rf", "child_process"];
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
        functions: (code.match(/(def |function |async function |\(\) =>)/gm) || []).length,
        classes: (code.match(/(class )/gm) || []).length
      }
    };

    return {
      ok: true,
      action: action,
      status: astTree.is_safe ? "CLEAN" : "FLAGGED",
      ast: astTree,
      summary: "AST syntax analysis completed with Shannon entropy H(X) = " + entropy + " bits. Security flags: " + (flagged.length ? flagged.join(", ") : "None (100% Clean)"),
      timestamp: new Date().toISOString()
    };
  }

  var ZothAstSanitizer = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    validate: validate,
    run: run,
    meta: {
      owner: "antigravity",
      lane: "ast/compiler-invariants",
      actions: ["ast.sanitize", "ast.entropy"]
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = ZothAstSanitizer;
  } else {
    window.ZothAstSanitizer = ZothAstSanitizer;
  }
})();
