// Node test harness for Zoth AST Sanitizer. Run: node ast-sanitizer.test.js
const AstSanitizer = require("./ast-sanitizer.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(async function () {
  // 1. Calculate entropy
  let eZero = AstSanitizer.calculateEntropy("");
  check("entropy of empty string is 0", eZero === 0);
  let eLow = AstSanitizer.calculateEntropy("aaaaaa");
  check("entropy of uniform string is 0", eLow === 0);
  let eHigh = AstSanitizer.calculateEntropy("abcdef123456!@#$%^&*()_+");
  check("entropy of diverse string is > 3.0", eHigh > 3.0);

  // 2. Validate rejects unsupported action
  let v = AstSanitizer.validate({ action: "unknown.action", params: { code: "x = 1" } });
  check("rejects unknown action", v.ok === false && v.error.code === "action_not_found");

  // 3. Validate rejects missing code
  v = AstSanitizer.validate({ action: "ast.sanitize", params: {} });
  check("rejects missing code param", v.ok === false && v.error.code === "validation_error");

  // 4. Clean code run
  let out = await AstSanitizer.run({
    action: "ast.sanitize",
    params: { language: "python", code: "def add(a, b):\n    return a + b\n" },
    meta: { request_id: "ast_test_1", ts: new Date().toISOString() }
  });
  check("clean code status is CLEAN", out.ok === true && out.data.status === "CLEAN" && out.data.ast.is_safe === true);

  // 5. Flagged code with eval()
  out = await AstSanitizer.run({
    action: "ast.sanitize",
    params: { language: "javascript", code: "const res = eval('2 + 2');" },
    meta: { request_id: "ast_test_2", ts: new Date().toISOString() }
  });
  check("flagged code detects eval()", out.ok === true && out.data.status === "FLAGGED" && out.data.ast.security_flags.includes("eval("));

  // 6. Entropy action run
  out = await AstSanitizer.run({
    action: "ast.entropy",
    params: { language: "python", code: "import os\nx = 42\n" },
    meta: { request_id: "ast_test_3", ts: new Date().toISOString() }
  });
  check("ast.entropy returns valid Shannon entropy metric", out.ok === true && typeof out.data.entropy === "number" && out.data.entropy > 0);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
