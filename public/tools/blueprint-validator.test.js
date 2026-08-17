// Node test harness for Zoth Blueprint Validator. Run: node blueprint-validator.test.js
const Bpv = require("./blueprint-validator.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(function () {
  // 1. valid blueprint scores 100
  let r = Bpv.analyze({ id: "x", name: "X", version: "1.0", archetype: "a", category: "c", description: "d", ai_composable_modules: [{ name: "m", file: "f", type: "t", purpose: "p" }], seo_aeo_schemas: ["WebApplication"], technical_hooks: {}, tags: ["t"] });
  check("valid blueprint score 100 + valid", r.valid === true && r.score === 100);

  // 2. missing required fields -> errors + invalid
  r = Bpv.analyze({ id: "x" });
  check("missing required -> invalid + errors", r.valid === false && r.errors.length > 0);

  // 3. unknown field -> warning
  r = Bpv.analyze({ id: "x", name: "X", version: "1.0", archetype: "a", category: "c", description: "d", weirdField: 1 });
  check("unknown field -> warning", r.warnings.some(function (w){return /weirdField/.test(w);}));

  // 4. tags wrong type -> error
  r = Bpv.analyze({ id: "x", name: "X", version: "1.0", archetype: "a", category: "c", description: "d", tags: "notarray" });
  check("tags wrong type -> error", r.errors.some(function (e){return /tags/.test(e);}));

  // 5. contract validate rejects missing params
  let v = Bpv.validate({ meta: { request_id: "r", ts: new Date().toISOString() } });
  check("contract validate missing params", v.ok === false);

  // 6. contract validate passes with source
  v = Bpv.validate({ params: { source: "{}" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("contract validate ok with source", v.ok === true);

  // 7. run parses bad JSON -> valid:false report (no throw)
  let out = Bpv.run({ params: { source: "{bad" }, meta: "r", ts: new Date().toISOString() });
  check("run bad json -> report valid:false", out.ok === true && out.data.valid === false);

  // 8. run valid raw -> report valid:true
  out = Bpv.run({ params: { source: JSON.stringify({ id: "x", name: "X", version: "1.0", archetype: "a", category: "c", description: "d" }) }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("run valid raw -> report valid:true", out.ok === true && out.data.valid === true);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
