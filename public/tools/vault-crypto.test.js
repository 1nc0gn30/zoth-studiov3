// Node test harness for Zoth Vault Crypto Tool. Run: node vault-crypto.test.js
const VaultCrypto = require("./vault-crypto.js");

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("PASS  " + name); }
  else { fail++; console.log("FAIL  " + name); }
}

(async function () {
  // 1. Validate rejects unsupported action
  let v = VaultCrypto.validate({ action: "unknown.action", params: { secret: "test" } });
  check("rejects unknown action", v.ok === false && v.error.code === "action_not_found");

  // 2. Validate rejects missing secret
  v = VaultCrypto.validate({ action: "vault.derive", params: {} });
  check("rejects missing secret param", v.ok === false && v.error.code === "validation_error");

  // 3. Vault derive with Argon2id parameters
  let out = await VaultCrypto.run({
    action: "vault.derive",
    params: { secret: "master_sovereign_passphrase", iterations: 3, memory_cost: 65536 },
    meta: { request_id: "vault_test_1", ts: new Date().toISOString() }
  });
  check("vault.derive returns Argon2id descriptor", out.ok === true && out.data.algorithm.includes("Argon2id"));
  check("vault.derive descriptor has parameters", out.ok === true && out.data.parameters.iterations === 3 && out.data.parameters.memory_kib === 65536);
  check("vault.derive provides zero cloud guarantee", out.ok === true && typeof out.data.zero_cloud_guarantee === "string");

  // 4. Vault encrypt mock
  out = await VaultCrypto.run({
    action: "vault.encrypt_mock",
    params: { secret: "sk_live_nullai_token_123", salt: "custom_salt" },
    meta: { request_id: "vault_test_2", ts: new Date().toISOString() }
  });
  check("vault.encrypt_mock derives key fingerprint", out.ok === true && typeof out.data.derived_key_fingerprint === "string");

  // 5. Vault Shannon Entropy
  out = await VaultCrypto.run({
    action: "vault.entropy",
    params: { secret: "MasterP@ssphrase2026!#" }
  });
  check("vault.entropy calculates Shannon metric and keyspace", out.ok === true && out.data.entropy.shannon > 3.5 && out.data.entropy.bits > 100);

  // 6. Vault Argon2id Telemetry
  out = await VaultCrypto.run({
    action: "vault.argon2_telemetry",
    params: { memory_cost: 65536, iterations: 3, parallelism: 4 }
  });
  check("vault.argon2_telemetry returns 4-lane breakdown", out.ok === true && out.data.lanes.length === 4 && out.data.parameters.memory_cost_mib === 64);

  // 7. Vault Zeroize Buffer
  out = await VaultCrypto.run({
    action: "vault.zeroize_buffer",
    params: { memory_kib: 65536, passes: 4 }
  });
  check("vault.zeroize_buffer verifies 4-pass sanitization", out.ok === true && out.data.passes_executed.length === 4 && out.data.zeroization_verified === true);

  // 8. Vault Alchemical Seal
  out = await VaultCrypto.run({
    action: "vault.alchemical_seal",
    params: {}
  });
  check("vault.alchemical_seal returns Tria Prima & Planetary metals", out.ok === true && out.data.tria_prima.salt.symbol === "🜔" && out.data.planetary_ciphers.length === 7);

  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
