// Node test harness for Zoth Tool Bench harness. Run: node tool-runner.test.js
const Bench = require("./tool-runner.js");
const Gh = require("./github-tool.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(async () => {
  // 1. GitHub auto-registered on load
  let l = Bench.list();
  check("github-tool auto-registered", l.some(t => t.id === "github-tool"));

  // 2. register rejects missing validate
  let threw = false;
  try { Bench.register({ id: "bad" }); } catch (e) { threw = true; }
  check("register rejects missing validate", threw);

  // 3. run valid via bench dispatches to github-tool
  let out = await Bench.run("github-tool", { action: "repos.list", params: { owner: "neo" } }, {});
  check("bench run simulated ok", out.ok === true && out.meta.simulated === true);

  // 4. bench enforces contract (invalid request)
  out = await Bench.run("github-tool", { action: "issues.create", params: { owner: "neo" } }, {});
  check("bench run invalid -> error envelope", out.ok === false && out.error.code === "validation_error");

  // 5. unknown tool -> action_not_found
  out = await Bench.run("does-not-exist", { action: "x", params: {} }, {});
  check("bench unknown tool -> action_not_found", out.ok === false && out.error.code === "action_not_found");

  // 6. execution log recorded
  check("exec log has entries", Bench.log().length >= 1);

  // 7. manual register + run a custom tool
  Bench.register({
    id: "echo-tool",
    version: "1.0",
    actions: ["echo"],
    validate: (req) => (req.params && req.params.msg ? { ok: true } : { ok: false, error: { code: "validation_error", message: "msg required" } }),
    run: (req) => ({ ok: true, data: { echo: req.params.msg }, meta: { request_id: (req.meta && req.meta.request_id) || "x", ts: new Date().toISOString() } }),
  });
  out = await Bench.run("echo-tool", { action: "echo", params: { msg: "hi" } });
  check("custom tool runs via bench", out.ok === true && out.data.echo === "hi");

  // 8. custom tool validation enforced
  out = await Bench.run("echo-tool", { action: "echo", params: {} });
  check("custom tool invalid -> error", out.ok === false && out.error.code === "validation_error");

  // 9. get() returns definition
  check("get() returns tool", !!Bench.get("github-tool"));

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
