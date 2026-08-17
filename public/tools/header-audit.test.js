// Node test harness for Zoth Header Audit Tool. Run: node header-audit.test.js
const Ha = require("./header-audit.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(async () => {
  // 1. contract: missing target
  let v = Ha.validate({ params: {}, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("missing target rejected", v.ok === false);

  // 2. contract: non-http target
  v = Ha.validate({ params: { target: "ftp://x" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("non-http target rejected", v.ok === false);

  // 3. contract: valid
  v = Ha.validate({ params: { target: "https://example.com/" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("valid target accepted", v.ok === true);

  // 4. checks must be array
  v = Ha.validate({ params: { target: "https://x", checks: "owasp" }, meta: { request_id: "r", ts: new Date().toISOString() } });
  check("checks non-array rejected", v.ok === false);

  // 5. analyze: supplied shields present -> ok (only the 4 supplied are checked)
  let r = Ha.analyze({
    "content-security-policy": "default-src 'self'",
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "strict-transport-security": "max-age=31536000",
  });
  var supplied = r.filter(function (f) { return ["Content-Security-Policy","X-Frame-Options","X-Content-Type-Options","Strict-Transport-Security"].indexOf(f.check) > -1; });
  check("present shields -> ok", supplied.length === 4 && supplied.every(function (f) { return f.present && f.severity === "ok"; }));

  // 6. analyze: missing required -> MISSING required shield
  r = Ha.analyze({});
  check("empty headers -> required missing", r.some(function (f) { return f.required && !f.present; }));

  // 7. analyze: bad X-Frame value
  r = Ha.analyze({ "x-frame-options": "ALLOW" });
  let xf = r.find(function (f) { return f.check === "X-Frame-Options"; });
  check("bad X-Frame value flagged", xf.present === true && xf.severity !== "ok");

  // 8. run live against :8088 (no shields) -> fetched, required missing
  let out = await Ha.run({ params: { target: "http://127.0.0.1:8088/", checks: ["owasp"] }, meta: { request_id: "h1", ts: new Date().toISOString() } });
  check("live run fetched", out.ok === true && out.data.fetched === true);
  check("live run finds missing shields", out.data.owasp.some(function (f) { return f.required && !f.present; }));
  check("live run score < 100", out.data.score < 100);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
