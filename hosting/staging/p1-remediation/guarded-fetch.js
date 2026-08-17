/**
 * guardedFetch — production-safe conditional fetch wrapper
 *
 * In production (Hostinger), do NOT call loopback daemons.
 * In local dev (localhost / 127.0.0.1), use the live local URL.
 * Otherwise use a same-origin relative path or a provided public API base.
 */

const DEV_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

/**
 * Resolve the correct URL based on the current hostname.
 *
 * @param {string} localUrl  - The hard-coded localhost URL (e.g. "http://127.0.0.1:8484/api/pets")
 * @param {string} publicPath - The production-safe relative or absolute public path (e.g. "/api/pets")
 * @returns {string} The URL to fetch
 */
export function resolveGuardedUrl(localUrl, publicPath) {
  const isDev = DEV_HOSTS.has(window.location.hostname);
  return isDev ? localUrl : (publicPath || '/');
}

/**
 * Perform a fetch that automatically falls back to a public path when not on localhost.
 *
 * @param {string} localUrl
 * @param {string} publicPath
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function guardedFetch(localUrl, publicPath, options = {}) {
  const url = resolveGuardedUrl(localUrl, publicPath);
  return fetch(url, options);
}

// ---------------------------------------------------------------------------
// Usage examples (drop into site.js, pets/pets.js, registry/registry.js, etc.)
// ---------------------------------------------------------------------------

// pets/pets.js
// const live = await guardedFetch("http://127.0.0.1:8484/api/pets", "/api/pets", { cache: "no-store", signal: ctrl.signal });

// registry/registry.js
// const r = await guardedFetch("http://127.0.0.1:8484/api/tools", "/api/tools", { cache: "no-store", signal: ctrl.signal });

// site.js probes
// const data = await guardedFetch("http://127.0.0.1:8787/health", "/api/health");
// const data = await guardedFetch("http://127.0.0.1:8484/api/dashboard", "/api/dashboard");
// const data = await guardedFetch("http://127.0.0.1:8765/health", "/api/health");
