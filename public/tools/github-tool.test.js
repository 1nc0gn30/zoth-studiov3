// Node test harness for Zoth GitHub Tool (no network). Run: node github-tool.test.js
const Tool = require("./github-tool.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

const mid = () => "req_" + Math.random().toString(36).slice(2, 10);
const meta = (req_id) => ({ request_id: req_id, ts: new Date().toISOString() });

(async () => {
  // 1. Valid issues.list validates
  let r = Tool.validate({ action: "issues.list", params: { owner: "neo", repo: "zoth" }, meta: meta(mid()) });
  check("issues.list valid", r.ok === true);

  // 2. Unknown action rejected
  r = Tool.validate({ action: "bogus", params: {}, meta: meta(mid()) });
  check("unknown action -> action_not_found", r.ok === false && r.error.code === "action_not_found");

  // 3. Missing required param rejected
  r = Tool.validate({ action: "issues.create", params: { owner: "neo", repo: "zoth" }, meta: meta(mid()) });
  check("issues.create missing title -> validation_error", r.ok === false && r.error.code === "validation_error");

  // 4. Extra param rejected (additionalProperties false)
  r = Tool.validate({ action: "repos.list", params: { owner: "neo", bogusKey: 1 }, meta: meta(mid()) });
  check("extra param rejected", r.ok === false && /not allowed/.test(r.error.message));

  // 5. per_page out of range
  r = Tool.validate({ action: "issues.list", params: { owner: "neo", repo: "zoth", per_page: 999 }, meta: meta(mid()) });
  check("per_page 999 rejected", r.ok === false);

  // 6. bad meta.ts (not ISO)
  r = Tool.validate({ action: "repos.list", params: { owner: "neo" }, meta: { request_id: mid(), ts: "today" } });
  check("bad ts rejected", r.ok === false);

  // 7. prs.create head whitespace rejected
  r = Tool.validate({ action: "prs.create", params: { owner: "neo", repo: "zoth", title: "t", head: "a b", base: "main" }, meta: meta(mid()) });
  check("prs.create head whitespace rejected", r.ok === false);

  // 8. Title too long rejected
  r = Tool.validate({ action: "issues.create", params: { owner: "neo", repo: "zoth", title: "x".repeat(300) }, meta: meta(mid()) });
  check("title 300 chars rejected", r.ok === false);

  // 9. buildRequest produces correct URL for issues.list with query
  let br = Tool.buildRequest("issues.list", { owner: "NealFrazierTech", repo: "zoth", state: "open", per_page: 5, labels: ["bug", "urgent"] });
  check("issues.list URL", br.method === "GET" && br.url.includes("/repos/NealFrazierTech/zoth/issues?") && br.url.includes("state=open") && br.url.includes("labels=bug%2Curgent"));
  check("issues.list no body", br.body === null);

  // 10. buildRequest POST body for prs.create
  br = Tool.buildRequest("prs.create", { owner: "neo", repo: "zoth", title: "T", head: "feat", base: "main", draft: true });
  check("prs.create POST", br.method === "POST" && br.body.title === "T" && br.body.head === "feat" && br.body.draft === true);

  // 11. buildRequest repos.list
  br = Tool.buildRequest("repos.list", { owner: "neo", type: "owner", sort: "pushed", direction: "desc" });
  check("repos.list URL", br.url.includes("/users/neo/repos?") && br.url.includes("type=owner"));

  // 12. Missing meta.request_id
  r = Tool.validate({ action: "repos.list", params: { owner: "neo" }, meta: { ts: new Date().toISOString() } });
  check("missing meta.request_id rejected", r.ok === false);

  // 13. Simulated run returns ok envelope
  let out = await Tool.run({ action: "issues.list", params: { owner: "neo", repo: "zoth", state: "all" }, meta: meta(mid()) }, {});
  check("simulated run ok", out.ok === true && out.data.items.length > 0 && out.meta.simulated === true);

  // 14. Simulated run with invalid input returns error (no throw)
  out = await Tool.run({ action: "issues.create", params: { owner: "neo" }, meta: meta(mid()) }, {});
  check("simulated run invalid -> error envelope", out.ok === false && out.error.code === "validation_error");

  // 15. run with token but simulate:true forces simulated
  out = await Tool.run({ action: "repos.list", params: { owner: "neo" }, meta: meta(mid()) }, { token: "ghp_fake", simulate: true });
  check("force simulate with token", out.ok === true && out.meta.simulated === true);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
