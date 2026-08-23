// Node test harness for Zoth Bench Bus Mirror. Run: node bench-bus-mirror.test.js
const Mirror = require("./bench-bus-mirror.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

async function main() {
  // 1. message shape
  let m = Mirror.toMessage({ event: "executed", id: "github-tool", code: "executed", simulated: true, ts: "2026-08-17T00:00:00Z" });
  check("msg has from=hermes", m.from === "hermes");
  check("from hermes", m.from === "hermes");
  check("msg has to=all", m.to === "all");
  check("msg has msg string", typeof m.msg === "string" && m.msg.indexOf("github-tool") > -1);
  check("msg payload tool", m.payload && m.payload.tool === "github-tool");
  check("msg payload simulated", m.payload.simulated === true);

  // 2. status() reports target
  check("status target :8989", Mirror.status().target.indexOf("8989") > -1);

  // 3. POST to :8989. Returns result or graceful failure object when offline.
  let r = await Mirror.post({ event: "heartbeat", id: "tool-bench", code: "sync", ts: new Date().toISOString() });
  check("live :8989 POST handled gracefully", r.ok === true || typeof r.reason === "string");
  console.log("    live :8989 post ->", JSON.stringify(r));

  // 4. disabled -> not attempted
  Mirror.setEnabled(false);
  let r2 = await Mirror.post({ event: "executed", id: "x", code: "executed" });
  check("disabled -> reason disabled", r2.ok === false && r2.reason === "disabled");
  Mirror.setEnabled(true);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
}
main();
