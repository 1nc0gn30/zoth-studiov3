// Node test harness for Zoth Subsweep Recon Tool. Run: node subsweep-recon.test.js
const Subsweep = require("./subsweep-recon.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(async function () {
  // 1. Validate rejects unsupported action
  let v = Subsweep.validate({ action: "unknown.action", params: { target: "127.0.0.1" } });
  check("rejects unknown action", v.ok === false && v.error.code === "action_not_found");

  // 2. Validate rejects missing target
  v = Subsweep.validate({ action: "recon.scan", params: {} });
  check("rejects missing target param", v.ok === false && v.error.code === "validation_error");

  // 3. Recon scan on loopback
  let out = await Subsweep.run({
    action: "recon.scan",
    params: { target: "127.0.0.1" },
    meta: { request_id: "recon_test_1", ts: new Date().toISOString() }
  });
  check("recon.scan loopback returns scan_type LOOPBACK_SOVEREIGN", out.ok === true && out.data.scan_type === "LOOPBACK_SOVEREIGN");
  check("recon.scan returns open ports list", out.ok === true && Array.isArray(out.data.ports) && out.data.ports.length >= 5);
  check("recon.scan returns DNS A record 127.0.0.1", out.ok === true && out.data.dns.a_records[0] === "127.0.0.1");

  // 4. Recon ports on public domain
  out = await Subsweep.run({
    action: "recon.ports",
    params: { target: "zoth.nullai.tech" },
    meta: { request_id: "recon_test_2", ts: new Date().toISOString() }
  });
  check("recon.ports returns subdomains discovered", out.ok === true && out.data.subdomains_discovered.length >= 5);
  check("recon.ports returns PUBLIC_RECON scan type", out.ok === true && out.data.scan_type === "PUBLIC_RECON");

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
