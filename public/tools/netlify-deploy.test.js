// Node test harness for Zoth Netlify Deploy Tool. Run: node netlify-deploy.test.js
const Nf = require("./netlify-deploy.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(async () => {
  // 1. valid simulated
  let out = await Nf.run({ params: { site: "zoth", build_dir: "public" }, meta: { request_id: "r1", ts: new Date().toISOString() } });
  check("simulated deploy ok", out.ok === true && out.data.simulated === true && out.data.deploy_id);

  // 2. missing site
  let v = Nf.validate({ params: { build_dir: "public" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("missing site rejected", v.ok === false);

  // 3. missing build_dir
  v = Nf.validate({ params: { site: "zoth" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("missing build_dir rejected", v.ok === false);

  // 4. bad hook_url
  v = Nf.validate({ params: { site: "zoth", build_dir: "public", hook_url: "http://evil.com/x" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("bad hook_url rejected", v.ok === false && /api\.netlify\.com\/build_hooks/.test(v.error.message));

  // 5. good hook_url accepted
  v = Nf.validate({ params: { site: "zoth", build_dir: "public", hook_url: "https://api.netlify.com/build_hooks/abc123" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("good hook_url accepted", v.ok === true);

  // 6. draft must be boolean
  v = Nf.validate({ params: { site: "zoth", build_dir: "public", draft: "yes" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("draft non-boolean rejected", v.ok === false);

  // 7. message too long
  v = Nf.validate({ params: { site: "zoth", build_dir: "public", message: "x".repeat(600) }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("message 600 chars rejected", v.ok === false);

  // 8. live mode without hook_url -> validation error from run
  out = await Nf.run({ params: { site: "zoth", build_dir: "public" }, meta: { request_id: "r2", ts: new Date().toISOString() } }, { token: "x" });
  check("live without hook_url -> error", out.ok === false && out.error.code === "validation_error");

  // 9. draft flag reflected in simulated output
  out = await Nf.run({ params: { site: "zoth", build_dir: "public", draft: true }, meta: { request_id: "r3", ts: new Date().toISOString() } });
  check("draft flag reflected", out.ok === true && out.data.draft === true);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
