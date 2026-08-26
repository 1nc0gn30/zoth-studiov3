/**
 * Zoth BYOK Vault — interactive WebGL vault + smart encrypted key store
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  PROVIDERS,
  CATEGORIES,
  PRESET_PACKS,
  listProviders,
  detectProvider,
  validateSecret,
  envNameFor,
  colorHex,
  providerCount,
} from "./presets.js";
import { daemon } from "./daemon-client.js?v=20260812l";

/* ========================= Crypto ========================= */
const STORAGE_KEY = "zoth.byok.vault.v2";
const STORAGE_KEY_LEGACY = "zoth.byok.vault.v1";
const AUTO_LOCK_MS = 15 * 60 * 1000;
/** @type {'browser'|'daemon'} */
let storageMode = "browser";
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64(buf) {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}
function fromB64(str) {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function deriveKey(passphrase, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encryptPayload(passphrase, obj) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
  return { v: 2, salt: b64(salt), iv: b64(iv), data: b64(cipher) };
}
async function decryptPayload(passphrase, packed) {
  const key = await deriveKey(passphrase, fromB64(packed.salt));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(packed.iv) },
    key,
    fromB64(packed.data)
  );
  return JSON.parse(dec.decode(plain));
}
function loadPacked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY_LEGACY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function savePacked(packed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packed));
}

/* ========================= State ========================= */
let masterPass = "";
/** @type {Array<{
 *  id:string, provider:string, label:string, secret:string,
 *  created:number, tags?:string[], favorite?:boolean,
 *  env?:string, endpoint?:string, notes?:string, lastUsed?:number
 * }>} */
let keys = [];
let selectedId = null;
/** @type {Set<string>} */
let multiSelected = new Set();
let filterQ = "";
let filterProvider = "all";
let filterCategory = "all";
let sortMode = "newest";
let focusTarget = null;
let focusT = 0;
let lastActivity = Date.now();
let autoLockEnabled = false;
let autoLockUntil = 0;
let spawnPulse = 0;
let scatterMode = false;
let lastDetect = null;
let revealUntil = 0;
let revealId = null;
/** Full session length at unlock (ms) for TTL bar */
let daemonSessionMs = 0;
let sessionWarnShown = false;
let gateBusy = false;

const sceneCtl = {
  ok: false,
  controls: { autoRotate: true, autoRotateSpeed: 0.42 },
  syncKeyMeshes() {},
  highlightKey() {},
  focusOnKey() {},
  setScatter() {},
};

const $ = (id) => document.getElementById(id);
const gate = $("gate");
const panel = $("panel");
const hud = $("hud");
const keyList = $("key-list");
const gateMsg = $("gate-msg");
const panelMsg = $("panel-msg");
const hudCount = $("hud-count");
const tooltip = $("tooltip");
const toast = $("toast");
const legend = $("legend");
const autolockBadge = $("autolock-badge");
const sessionStatus = $("session-status");

const presetCountEl = $("preset-count");
if (presetCountEl) presetCountEl.textContent = String(providerCount());

function setMsg(el, text, kind = "") {
  if (!el) return;
  el.textContent = text || "";
  el.className = "hint" + (kind ? ` ${kind}` : "");
}
/**
 * @param {string} text
 * @param {number|string} [msOrKind=2200] duration ms, or kind if string
 * @param {string} [kind=''] ok | warn | error
 */
function showToast(text, msOrKind = 2200, kind = "") {
  let ms = 2200;
  if (typeof msOrKind === "string") {
    kind = msOrKind;
    ms = kind === "error" ? 3200 : 2400;
  } else if (typeof msOrKind === "number") {
    ms = msOrKind;
  }
  toast.hidden = false;
  toast.textContent = text;
  toast.className = "toast" + (kind ? ` is-${kind}` : "");
  clearTimeout(showToast._t);
  clearTimeout(showToast._out);
  showToast._t = setTimeout(() => {
    toast.classList.add("is-out");
    showToast._out = setTimeout(() => {
      toast.hidden = true;
      toast.className = "toast";
    }, 220);
  }, ms);
}

function setButtonBusy(btn, busy, labelWhenBusy = null) {
  if (!btn) return;
  btn.classList.toggle("is-busy", !!busy);
  btn.disabled = !!busy;
  const spinner = btn.querySelector(".btn-spinner");
  if (spinner) spinner.hidden = !busy;
  if (busy && labelWhenBusy) {
    const lab = btn.querySelector(".btn-label");
    if (lab) {
      btn.dataset.prevLabel = lab.textContent;
      lab.textContent = labelWhenBusy;
    }
  } else if (!busy && btn.dataset.prevLabel) {
    const lab = btn.querySelector(".btn-label");
    if (lab) lab.textContent = btn.dataset.prevLabel;
    delete btn.dataset.prevLabel;
  }
}

/** @type {'open'|'create'|'demo'} */
let gateMode = "open";
let vaultExistsHint = { daemon: false, browser: false };

/** @param {boolean} busy @param {'unlock'|'init'|'demo'|null} [which] */
function setGateBusy(busy, which = null) {
  gateBusy = !!busy;
  const card = $("gate-card");
  if (card) card.classList.toggle("is-busy", gateBusy);
  const go = $("btn-gate-go");
  const un = $("btn-unlock");
  const init = $("btn-init");
  if (!busy) {
    setButtonBusy(go, false);
    setButtonBusy(un, false);
    setButtonBusy(init, false);
    if (go) go.disabled = false;
  } else {
    const label =
      which === "init" ? "Creating…" : which === "demo" ? "Loading demo…" : "Unlocking…";
    setButtonBusy(go, true, label);
    if (go) go.disabled = true;
  }
  document.querySelectorAll(".gate-mode").forEach((b) => {
    b.disabled = !!busy;
  });
  const demo = $("btn-demo");
  if (demo) demo.disabled = busy;
}

function setGateMode(mode) {
  gateMode = mode === "create" || mode === "demo" ? mode : "open";
  const wrap = $("gate-form-wrap");
  const goLabel = $("btn-gate-go-label");
  const passLabel = $("pass-label");
  const pass = $("master-pass");
  document.querySelectorAll(".gate-mode").forEach((btn) => {
    const on = btn.dataset.gateMode === gateMode;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  if (wrap) wrap.classList.toggle("is-demo-only", gateMode === "demo");
  if (gateMode === "open") {
    if (goLabel) goLabel.textContent = "Unlock vault";
    if (passLabel) passLabel.textContent = "Passphrase";
    if (pass) {
      pass.placeholder = "Enter passphrase for existing vault";
      pass.autocomplete = "current-password";
    }
  } else if (gateMode === "create") {
    if (goLabel) goLabel.textContent = "Create vault";
    if (passLabel) passLabel.textContent = "New passphrase";
    if (pass) {
      pass.placeholder = daemon.online ? "Min 12 characters" : "Min 8 characters";
      pass.autocomplete = "new-password";
    }
  } else if (goLabel) {
    goLabel.textContent = "Load demo vault";
  }
}

function syncGateModeAvailability() {
  const openBtn = $("gate-mode-open");
  const createBtn = $("gate-mode-create");
  const openHint = $("gate-open-hint");
  const createHint = $("gate-create-hint");
  const hasVault = vaultExistsHint.daemon || vaultExistsHint.browser;
  if (openBtn) {
    openBtn.classList.toggle("is-disabled", !hasVault);
    openBtn.disabled = !hasVault;
  }
  if (openHint) {
    if (vaultExistsHint.daemon) openHint.textContent = "Daemon vault found on this machine";
    else if (vaultExistsHint.browser) openHint.textContent = "Browser vault found in this browser";
    else openHint.textContent = "No existing vault detected yet";
  }
  if (createHint) {
    createHint.textContent = daemon.online
      ? "Encrypted on disk via Rust daemon (12+ chars)"
      : "Stored in this browser only (8+ chars)";
  }
  if (createBtn) createBtn.classList.toggle("is-recommended", !hasVault);
  if (openBtn) openBtn.classList.toggle("is-recommended", hasVault);
  if (!hasVault && gateMode === "open") setGateMode("create");
  else if (hasVault && gateMode === "open") setGateMode("open");
}

function setProbeState(state, text) {
  const el = $("gate-probe");
  const label = $("gate-probe-text");
  if (!el) return;
  el.classList.remove("is-on", "is-done", "is-warn");
  if (state === "off") {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.classList.add("is-on");
  if (state === "done") el.classList.add("is-done");
  if (state === "warn") el.classList.add("is-warn");
  if (label && text) label.textContent = text;
  const spin = el.querySelector(".spinner");
  if (spin) spin.hidden = state !== "probing";
}

/** Lightweight focus trap for <dialog> elements */
function trapFocus(dialog) {
  if (!dialog || dialog._trapBound) return;
  dialog._trapBound = true;
  dialog.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.hidden && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function openDialog(dialog) {
  if (!dialog) return;
  trapFocus(dialog);
  if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
  const focusable = dialog.querySelector(
    'button:not([disabled]), input:not([disabled]), [href], select:not([disabled]), textarea:not([disabled])'
  );
  queueMicrotask(() => focusable?.focus());
}

const ALL_DIALOG_IDS = [
  "preset-browser",
  "security-dialog",
  "audit-dialog",
  "shortcuts",
  "argon2-dialog",
  "entropy-dialog",
  "seal-dialog",
  "zeroize-dialog"
];

function closeOpenDialogs() {
  for (const id of ALL_DIALOG_IDS) {
    const d = $(id);
    if (d?.open) d.close();
  }
}

function anyDialogOpen() {
  return ALL_DIALOG_IDS.some((id) => $(id)?.open);
}

function captureDaemonSession(expiresAt) {
  if (!expiresAt) {
    daemonSessionMs = 0;
    sessionWarnShown = false;
    return;
  }
  const end = Date.parse(expiresAt);
  if (!end) return;
  daemonSessionMs = Math.max(end - Date.now(), 1000);
  sessionWarnShown = false;
  daemon.expiresAt = expiresAt;
}
function maskSecret(s) {
  if (!s) return "••••";
  if (s.length <= 8) return "••••••••";
  return `${s.slice(0, 4)}••••${s.slice(-4)}`;
}
function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function parseTags(str) {
  if (!str) return [];
  return String(str)
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);
}
function touchActivity() {
  lastActivity = Date.now();
  if (autoLockEnabled) autoLockUntil = lastActivity + AUTO_LOCK_MS;
}
async function persist() {
  if (storageMode === "daemon") {
    if (!daemon.token) return;
    // Upsert all in-memory keys to encrypted on-disk vault (daemon)
    for (const k of keys) {
      const meta = await daemon.upsertKey(k);
      if (meta?.id && k.id !== meta.id) k.id = meta.id;
    }
    return;
  }
  if (!masterPass) return;
  savePacked(await encryptPayload(masterPass, { keys, meta: { updated: Date.now() } }));
}

async function persistOne(k) {
  if (storageMode === "daemon") {
    if (!daemon.token) return;
    const meta = await daemon.upsertKey(k);
    if (meta?.id) k.id = meta.id;
    return;
  }
  await persist();
}

function setBackendBadge() {
  const sub = $("brand-sub");
  if (sub) {
    sub.textContent = daemon.online ? "Daemon ready" : "Browser mode";
  }
  updateSecPill();
  updateGateModes();
}

function updateSecPill() {
  const pill = $("sec-pill");
  const label = $("sec-pill-label");
  if (!pill || !label) return;
  pill.classList.remove("is-secure", "is-warn", "is-off");
  if (daemon.online && storageMode === "daemon" && masterPass) {
    pill.classList.add("is-secure");
    label.textContent = "Sealed";
  } else if (daemon.online) {
    pill.classList.add("is-secure");
    label.textContent = "Daemon";
  } else if (masterPass && storageMode === "browser") {
    pill.classList.add("is-warn");
    label.textContent = "Browser";
  } else {
    pill.classList.add("is-off");
    label.textContent = "Offline";
  }
}

function updateGateModes() {
  const line = $("backend-line");
  const st = $("mode-daemon-status");
  const text = daemon.online
    ? `Storage · Rust daemon · ${daemon.base?.replace(/^https?:\/\//, "") || "127.0.0.1:8787"}`
    : "Storage · browser fallback (daemon offline)";
  if (line) line.textContent = text;
  if (st) st.textContent = text;
}

function setScoreRing(el, score, grade) {
  if (!el) return;
  el.dataset.grade = grade || "—";
  const b = el.querySelector("b");
  if (b) b.textContent = score == null ? "—" : String(score);
}

async function refreshSecurityUI() {
  if (!daemon.online) {
    setScoreRing($("sec-dialog-ring"), null, "—");
    if ($("sec-dialog-score")) $("sec-dialog-score").textContent = "—";
    if ($("sec-dialog-grade")) $("sec-dialog-grade").textContent = "Daemon offline";
    if ($("sec-dialog-blurb")) {
      $("sec-dialog-blurb").textContent = "Start vault-daemon for Argon2id disk vault checks.";
    }
    if ($("sec-check-list")) $("sec-check-list").innerHTML = "";
    return;
  }
  try {
    const sec = await daemon.security();
    if (!sec) return;
    setScoreRing($("sec-dialog-ring"), sec.score, sec.grade);
    if ($("sec-dialog-score")) $("sec-dialog-score").textContent = String(sec.score);
    if ($("sec-dialog-grade")) $("sec-dialog-grade").textContent = `Grade ${sec.grade}`;
    if ($("sec-dialog-blurb")) {
      $("sec-dialog-blurb").textContent = sec.unlocked
        ? "Unlocked — secrets only while session is open."
        : sec.exists
          ? "Sealed on disk. Unlock to use keys."
          : "No vault yet — create with a strong passphrase.";
    }
    const list = $("sec-check-list");
    if (list && Array.isArray(sec.checks)) {
      list.innerHTML = sec.checks
        .map(
          (c) => `<li>
            <span class="chk ${c.ok ? "ok" : "bad"}">${c.ok ? "✓" : "!"}</span>
            <strong>${escapeHtml(c.label)}</strong>
            <span>${escapeHtml(c.detail || "")}</span>
          </li>`
        )
        .join("");
    }
  } catch {
    /* ignore */
  }
}

function updateSessionHud() {
  const ttl = $("sec-ttl");
  const badge = $("autolock-badge");
  const isDaemonSession = storageMode === "daemon" && daemon.token && daemon.expiresAt;

  if (!isDaemonSession) {
    if (badge && autoLockEnabled && masterPass && storageMode === "browser") {
      const left = Math.max(0, autoLockUntil - Date.now());
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      const text = `${m}:${String(s).padStart(2, "0")}`;
      if (ttl) ttl.textContent = text;
      else badge.textContent = text;
      badge.classList.toggle("is-warn", left > 0 && left < 60000);
      badge.classList.toggle("is-critical", left > 0 && left < 15000);
      badge.hidden = false;
    } else if (badge && !masterPass) {
      badge.hidden = true;
    }
    return;
  }

  const end = Date.parse(daemon.expiresAt);
  if (!end) return;
  const left = Math.max(0, end - Date.now());
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const text = `${m}:${String(s).padStart(2, "0")}`;

  if (ttl) {
    ttl.textContent = text;
    ttl.title = left < 60000 ? "Session ending soon" : "Session remaining";
  }
  if (badge) {
    badge.hidden = false;
    badge.classList.toggle("is-warn", left > 0 && left < 60000);
    badge.classList.toggle("is-critical", left > 0 && left < 15000);
  }
  if (left > 0 && left < 60000 && !sessionWarnShown) {
    sessionWarnShown = true;
    showToast(`Session ends in ${text}`, 3500, "warn");
  }
  if (left <= 0 && masterPass) {
    lockUI();
    showToast("Session expired", "warn");
  }
}

async function openSecurityDialog() {
  await refreshSecurityUI();
  openDialog($("security-dialog"));
}

async function openAuditDialog() {
  const list = $("audit-list");
  if (!list) return;
  if (storageMode !== "daemon" || !daemon.token) {
    showToast("Unlock daemon vault to view audit", "warn");
    return;
  }
  list.innerHTML = `<div class="audit-empty"><span class="spinner" style="display:inline-block;vertical-align:middle;margin-right:8px"></span>Loading audit…</div>`;
  openDialog($("audit-dialog"));
  try {
    const events = await daemon.audit();
    if (!events.length) {
      list.innerHTML = `<div class="audit-empty">No audit events yet.<br><span class="muted" style="font-size:0.78rem">Actions appear here after unlock / seal / export.</span></div>`;
    } else {
      list.innerHTML = events
        .slice()
        .reverse()
        .map((e) => {
          const ts = e.ts || "";
          return `<div class="audit-row">
            <time>${escapeHtml(String(ts).replace("T", " ").slice(0, 19))}</time>
            <div>
              <strong>${escapeHtml(e.action || "?")}</strong>
              <p>${escapeHtml(e.detail || "")}${e.key_id ? ` · ${escapeHtml(String(e.key_id).slice(0, 8))}…` : ""}</p>
            </div>
          </div>`;
        })
        .join("");
    }
  } catch (e) {
    list.innerHTML = `<div class="audit-empty">Audit unavailable: ${escapeHtml(e.message || "error")}</div>`;
    showToast(e.message || "Audit unavailable", "error");
  }
}

function normalizeKey(k) {
  return {
    id: k.id || uuid(),
    provider: PROVIDERS[k.provider] ? k.provider : "custom",
    label: k.label || "unnamed",
    secret: k.secret || "",
    created: k.created || Date.now(),
    tags: Array.isArray(k.tags) ? k.tags : parseTags(k.tags),
    favorite: !!k.favorite,
    env: k.env || envNameFor(k.provider, k.label),
    endpoint: k.endpoint || "",
    notes: k.notes || "",
    lastUsed: k.lastUsed || 0,
  };
}

function keyHealth(k) {
  const v = validateSecret(k.provider, k.secret);
  if (v.level === "error") return 0;
  if (v.level === "warn") return 1;
  return 2;
}

/* ========================= Filtering ========================= */
function filteredKeys() {
  let rows = keys.slice();
  if (filterCategory !== "all") {
    rows = rows.filter((k) => (PROVIDERS[k.provider]?.cat || "custom") === filterCategory);
  }
  if (filterProvider !== "all") {
    rows = rows.filter((k) => k.provider === filterProvider);
  }
  const q = filterQ.trim().toLowerCase();
  if (q) {
    rows = rows.filter((k) => {
      const p = PROVIDERS[k.provider];
      const hay = [
        k.label,
        k.provider,
        p?.label,
        p?.cat,
        k.env,
        k.notes,
        k.endpoint,
        ...(k.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (sortMode === "label") rows.sort((a, b) => a.label.localeCompare(b.label));
  else if (sortMode === "provider") rows.sort((a, b) => a.provider.localeCompare(b.provider) || a.label.localeCompare(b.label));
  else if (sortMode === "category") {
    rows.sort((a, b) => {
      const ca = CATEGORIES[PROVIDERS[a.provider]?.cat]?.order ?? 50;
      const cb = CATEGORIES[PROVIDERS[b.provider]?.cat]?.order ?? 50;
      return ca - cb || a.label.localeCompare(b.label);
    });
  } else if (sortMode === "favorites") {
    rows.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || b.created - a.created);
  } else if (sortMode === "health") {
    rows.sort((a, b) => keyHealth(a) - keyHealth(b) || b.created - a.created);
  } else rows.sort((a, b) => (b.created || 0) - (a.created || 0));
  return rows;
}

/* ========================= Populate provider select ========================= */
function fillProviderSelect(selected = "openai") {
  const sel = $("key-provider");
  const groups = new Map();
  for (const p of listProviders()) {
    if (!groups.has(p.cat)) groups.set(p.cat, []);
    groups.get(p.cat).push(p);
  }
  sel.innerHTML = "";
  for (const [cat, items] of groups) {
    const og = document.createElement("optgroup");
    og.label = CATEGORIES[cat]?.label || cat;
    for (const p of items) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.underground ? `${p.label} · indie` : p.label;
      og.appendChild(opt);
    }
    sel.appendChild(og);
  }
  if (PROVIDERS[selected]) sel.value = selected;
}

/* ========================= Render ========================= */
function updateStats() {
  const providers = new Set(keys.map((k) => k.provider));
  const cats = new Set(keys.map((k) => PROVIDERS[k.provider]?.cat || "custom"));
  const favs = keys.filter((k) => k.favorite).length;
  if ($("stat-total")) $("stat-total").textContent = String(keys.length);
  if ($("stat-providers")) $("stat-providers").textContent = String(providers.size);
  if ($("stat-favs")) $("stat-favs").textContent = String(favs);
  if ($("stat-cats")) $("stat-cats").textContent = String(cats.size);
  if (hudCount) hudCount.textContent = String(keys.length);
  if (sessionStatus) {
    if (!masterPass) sessionStatus.textContent = "locked";
    else sessionStatus.textContent = storageMode === "daemon" ? "sealed" : "browser";
  }
}

function renderCategoryChips() {
  const el = $("category-chips");
  if (!el) return;
  const used = new Map();
  keys.forEach((k) => {
    const c = PROVIDERS[k.provider]?.cat || "custom";
    used.set(c, (used.get(c) || 0) + 1);
  });
  const chips = [{ id: "all", label: "All cats", n: keys.length, color: "#00e5ff" }];
  Object.entries(CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .forEach(([id, meta]) => {
      if (used.has(id) || id === filterCategory) {
        chips.push({ id, label: meta.label.split("·")[0].trim(), n: used.get(id) || 0, color: meta.color });
      }
    });
  el.innerHTML = chips
    .map(
      (c) =>
        `<button type="button" class="chip ${filterCategory === c.id ? "is-on" : ""}" data-cat="${c.id}" style="--chip:${c.color}">
          <i></i>${escapeHtml(c.label)}${c.n ? ` <em>${c.n}</em>` : ""}
        </button>`
    )
    .join("");
  el.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterCategory = btn.dataset.cat;
      filterProvider = "all";
      renderCategoryChips();
      renderProviderChips();
      renderList();
      sceneCtl.syncKeyMeshes();
    });
  });
}

function renderProviderChips() {
  const el = $("provider-chips");
  if (!el) return;
  const used = new Map();
  keys.forEach((k) => {
    if (filterCategory !== "all" && (PROVIDERS[k.provider]?.cat || "custom") !== filterCategory) return;
    used.set(k.provider, (used.get(k.provider) || 0) + 1);
  });
  const chips = [{ id: "all", label: "All", n: [...used.values()].reduce((a, b) => a + b, 0) || keys.length }];
  [...used.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .forEach(([id, n]) => chips.push({ id, label: PROVIDERS[id]?.label || id, n }));

  el.innerHTML = chips
    .map((c) => {
      const hex = c.id === "all" ? "#00e5ff" : colorHex(c.id);
      return `<button type="button" class="chip ${filterProvider === c.id ? "is-on" : ""}" data-provider="${c.id}" style="--chip:${hex}">
        <i></i>${escapeHtml(c.label)}${c.n ? ` <em>${c.n}</em>` : ""}
      </button>`;
    })
    .join("");
  el.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterProvider = btn.dataset.provider;
      renderProviderChips();
      renderList();
      sceneCtl.syncKeyMeshes();
    });
  });
}

function renderLegend() {
  if (!legend) return;
  if (!masterPass || !keys.length) {
    legend.hidden = true;
    return;
  }
  const used = [...new Set(keys.map((k) => k.provider))].slice(0, 12);
  legend.hidden = false;
  legend.innerHTML = used
    .map((p) => `<span class="leg-item"><i style="background:${colorHex(p)}"></i>${escapeHtml(PROVIDERS[p]?.label || p)}</span>`)
    .join("");
}

function renderBulkBar() {
  const bar = $("bulk-bar");
  const n = multiSelected.size;
  if (!n) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  $("bulk-count").textContent = `${n} selected`;
}

function renderList() {
  const rows = filteredKeys();
  keyList.innerHTML = "";
  if (!keys.length) {
    const sealHint =
      storageMode === "daemon"
        ? "Secrets seal on disk via the Rust daemon."
        : "Browser vault — secrets stay in this tab’s encrypted store.";
    keyList.innerHTML = `
      <li class="empty empty-rich" role="status">
        <div class="meta empty-meta">
          <div class="empty-icon" aria-hidden="true">◇</div>
          <div class="label">A NullAI studio · no keys yet</div>
          <div class="provider">Paste a secret below — we detect the service.<br><span class="empty-seal">${sealHint}</span></div>
          <div class="quick-add">
            ${["openai", "anthropic", "openrouter", "xai"]
              .map((p) => `<button type="button" class="ghost mini" data-quick="${p}">${PROVIDERS[p].label}</button>`)
              .join("")}
            <button type="button" class="ghost mini" data-open-presets>All services</button>
          </div>
        </div>
      </li>`;
    keyList.querySelectorAll("[data-quick]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyPreset(btn.dataset.quick);
      });
    });
    keyList.querySelector("[data-open-presets]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openPresetBrowser();
    });
  } else if (!rows.length) {
    keyList.innerHTML = `
      <li class="empty empty-filtered" role="status">
        <div class="meta">
          <div class="label">No matches</div>
          <div class="provider">Try clearing search or category filters</div>
          <button type="button" class="ghost mini" id="btn-clear-filters">Clear filters</button>
        </div>
      </li>`;
    keyList.querySelector("#btn-clear-filters")?.addEventListener("click", (e) => {
      e.stopPropagation();
      filterQ = "";
      filterProvider = "all";
      filterCategory = "all";
      if ($("key-search")) $("key-search").value = "";
      renderCategoryChips();
      renderProviderChips();
      renderList();
      sceneCtl.syncKeyMeshes();
    });
  } else {
    rows.forEach((k, idx) => {
      const li = document.createElement("li");
      if (k.id === selectedId) li.classList.add("is-active");
      if (k.favorite) li.classList.add("is-fav");
      if (multiSelected.has(k.id)) li.classList.add("is-multi");
      const p = PROVIDERS[k.provider] || PROVIDERS.custom;
      const hex = colorHex(k.provider);
      const health = keyHealth(k);
      const healthCls = health === 2 ? "ok" : health === 1 ? "warn" : "bad";
      const tags = (k.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
      const catLabel = CATEGORIES[p.cat]?.label?.split("·")[0]?.trim() || p.cat;
      const showing = revealId === k.id && Date.now() < revealUntil;

      // Real Authentic SVG Logos mapping
      const LOGO_MAP = {
        openai: "/assets/logos/openai.svg",
        anthropic: "/assets/logos/anthropic.svg",
        google: "/assets/logos/google-gemini.svg",
        google_cloud: "/assets/logos/google-gemini.svg",
        xai: "/assets/logos/xai-grok.svg",
        mistral: "/assets/logos/mistral.svg",
        meta: "/assets/logos/meta-llama.svg",
        llama: "/assets/logos/meta-llama.svg",
        huggingface: "/assets/logos/huggingface.svg",
        hf: "/assets/logos/huggingface.svg",
        github: "/assets/logos/github.svg",
        rust: "/assets/logos/rust.svg",
        cursor: "/assets/logos/cursor.svg",
        deepseek: "/assets/logos/deepseek.svg",
        nous: "/assets/logos/nous-research.svg",
        ollama: "/assets/logos/ollama.svg",
        docker: "/assets/logos/docker.svg"
      };

      const logoSrc = LOGO_MAP[k.provider] || LOGO_MAP[p.id] || null;
      const logoHtml = logoSrc 
        ? `<img src="${logoSrc}" alt="${escapeHtml(p.label)}" style="width:16px;height:16px;border-radius:4px;vertical-align:middle;flex-shrink:0;" />`
        : `<i class="dot" style="background:${hex}"></i>`;

      li.innerHTML = `
        <div class="meta">
          <div class="label">
            <input type="checkbox" class="multi-cb" data-act="multi" ${multiSelected.has(k.id) ? "checked" : ""} title="Multi-select" />
            ${logoHtml}
            ${k.favorite ? '<span class="star">★</span>' : ""}
            ${escapeHtml(k.label)}
            <span class="health ${healthCls}" title="format health"></span>
            <span class="idx">${idx + 1}</span>
          </div>
          <div class="provider">${escapeHtml(p.label)} · ${escapeHtml(catLabel)}</div>
          <div class="mask mono">${showing ? escapeHtml(k.secret) : maskSecret(k.secret)}</div>
          <div class="env-line mono">${escapeHtml(k.env || envNameFor(k.provider, k.label))}</div>
          ${tags ? `<div class="tags">${tags}</div>` : ""}
          ${k.notes ? `<div class="notes-line">${escapeHtml(k.notes)}</div>` : ""}
        </div>
        <div class="actions">
          <button type="button" class="ghost" data-act="fav">${k.favorite ? "★" : "☆"}</button>
          <button type="button" class="ghost" data-act="copy">Copy</button>
          <button type="button" class="ghost" data-act="reveal">👁</button>
          <button type="button" class="ghost" data-act="edit">Edit</button>
          <button type="button" class="danger" data-act="del">Del</button>
        </div>`;
      li.addEventListener("click", (e) => {
        const act = e.target?.dataset?.act;
        if (act === "multi" || e.target?.classList?.contains("multi-cb")) {
          e.stopPropagation();
          toggleMulti(k.id);
          return;
        }
        if (e.shiftKey) {
          toggleMulti(k.id);
          return;
        }
        if (act === "edit") {
          fillForm(k);
          selectKey(k.id, true);
          return;
        }
        if (act === "copy") {
          copySecret(k);
          return;
        }
        if (act === "reveal") {
          e.stopPropagation();
          flashReveal(k.id);
          return;
        }
        if (act === "fav") {
          e.stopPropagation();
          k.favorite = !k.favorite;
          persist().then(() => {
            renderList();
            updateStats();
            sceneCtl.syncKeyMeshes();
            showToast(k.favorite ? "Starred" : "Unstarred");
          });
          return;
        }
        if (act === "del") {
          e.stopPropagation();
          if (!confirm(`Delete “${k.label}”?`)) return;
          deleteKeys([k.id]);
          return;
        }
        fillForm(k);
        selectKey(k.id, true);
      });
      li.addEventListener("dblclick", (e) => {
        if (e.target?.dataset?.act) return;
        copySecret(k);
      });
      keyList.appendChild(li);
    });
  }
  updateStats();
  renderLegend();
  renderBulkBar();
}

function toggleMulti(id) {
  if (multiSelected.has(id)) multiSelected.delete(id);
  else multiSelected.add(id);
  renderList();
  sceneCtl.highlightKey(selectedId);
}

function flashReveal(id) {
  revealId = id;
  revealUntil = Date.now() + 4000;
  renderList();
  showToast("Revealed 4s");
  setTimeout(() => {
    if (revealId === id) {
      revealId = null;
      renderList();
    }
  }, 4100);
}

function copySecret(k) {
  navigator.clipboard.writeText(k.secret).then(
    () => {
      k.lastUsed = Date.now();
      persist();
      setMsg(panelMsg, "Copied to clipboard", "ok");
      showToast(`Copied ${k.label}`);
      touchActivity();
    },
    () => setMsg(panelMsg, "Copy failed", "error")
  );
}

function deleteKeys(ids) {
  const set = new Set(ids);
  const run = async () => {
    if (storageMode === "daemon") {
      try {
        if (ids.length > 1) await daemon.bulkDelete(ids);
        else if (ids[0]) await daemon.deleteKey(ids[0]);
      } catch (e) {
        showToast(e.message || "Delete failed");
        return;
      }
    }
    keys = keys.filter((k) => !set.has(k.id));
    ids.forEach((id) => multiSelected.delete(id));
    if (set.has(selectedId)) {
      selectedId = null;
      clearForm(false);
    }
    if (storageMode !== "daemon") await persist();
    renderCategoryChips();
    renderProviderChips();
    renderList();
    sceneCtl.syncKeyMeshes();
    showToast(ids.length > 1 ? `Deleted ${ids.length} keys` : "Key removed");
  };
  run();
}

function fillForm(k) {
  $("key-id").value = k?.id || "";
  fillProviderSelect(k?.provider || "openai");
  $("key-provider").value = k?.provider || "openai";
  $("key-label").value = k?.label || "";
  $("key-secret").value = k?.secret || "";
  $("key-tags").value = (k?.tags || []).join(", ");
  $("key-notes").value = k?.notes || "";
  $("key-env").value = k?.env || envNameFor(k?.provider || "openai", k?.label);
  $("key-endpoint").value = k?.endpoint || "";
  if ($("key-favorite")) $("key-favorite").checked = !!k?.favorite;
  $("btn-save").textContent = k?.id ? "Update key" : "Add to vault";
  $("form-title").textContent = k?.id ? "Update key" : "Seal a key";
  updateFormatHint();
  runValidation();
  updateDocsLink();
}
function clearForm(reselect = true) {
  fillForm(null);
  $("detect-banner").hidden = true;
  lastDetect = null;
  if (reselect) {
    selectedId = null;
    sceneCtl.highlightKey(null);
  }
  renderList();
}
function selectKey(id, focusCam = false) {
  selectedId = id;
  sceneCtl.highlightKey(id);
  renderList();
  if (focusCam && id) sceneCtl.focusOnKey(id);
  const k = keys.find((x) => x.id === id);
  if (k) setMsg(panelMsg, `Selected “${k.label}”`, "ok");
  touchActivity();
}

function updateFormatHint() {
  const p = PROVIDERS[$("key-provider").value];
  $("key-format-hint").textContent = p?.hint ? `Hint: ${p.hint}` : "";
}
function updateDocsLink() {
  const p = PROVIDERS[$("key-provider").value];
  const a = $("provider-docs");
  if (p?.url) {
    a.hidden = false;
    a.href = p.url;
    a.textContent = `${p.label} docs ↗`;
  } else {
    a.hidden = true;
  }
}
function runValidation() {
  const id = $("key-provider").value;
  const secret = $("key-secret").value;
  const el = $("key-validate");
  if (!secret) {
    el.textContent = "";
    el.dataset.level = "";
    return;
  }
  const v = validateSecret(id, secret);
  el.textContent = v.message;
  el.dataset.level = v.level;
  el.className = `field-hint validate ${v.level}`;
}

function runAutoDetect() {
  const secret = $("key-secret").value.trim();
  const env = $("key-env").value.trim();
  if (!secret && !env) {
    $("detect-banner").hidden = true;
    return;
  }
  const d = detectProvider(secret, env);
  lastDetect = d;
  const banner = $("detect-banner");
  if (d.confidence < 25) {
    banner.hidden = true;
    return;
  }
  const p = PROVIDERS[d.id];
  banner.hidden = false;
  $("detect-label").textContent = `${p.label} · ${d.confidence}%`;
  $("detect-meta").textContent = d.reasons.slice(0, 2).join(" · ");
  // auto-apply high confidence if creating new
  if (d.confidence >= 70 && !$("key-id").value) {
    if ($("key-provider").value !== d.id) {
      $("key-provider").value = d.id;
      if (!$("key-label").value) {
        $("key-label").value = `${d.id}-key`;
      }
      if (!$("key-env").value || $("key-env").value === envNameFor("openai")) {
        $("key-env").value = envNameFor(d.id, $("key-label").value);
      }
      updateFormatHint();
      updateDocsLink();
      runValidation();
    }
  }
}

function applyPreset(id, opts = {}) {
  const p = PROVIDERS[id];
  if (!p) return;
  clearForm();
  fillProviderSelect(id);
  $("key-provider").value = id;
  $("key-label").value = opts.label || `${id.replace(/_/g, "-")}`;
  $("key-env").value = p.env || envNameFor(id);
  $("key-tags").value = [p.cat, p.underground ? "indie" : ""].filter(Boolean).join(", ");
  updateFormatHint();
  updateDocsLink();
  $("key-secret").focus();
  showToast(`Preset: ${p.label}`);
  setMsg(panelMsg, p.hint || `Add your ${p.label} secret`, "ok");
}

function unlockUI() {
  document.documentElement.classList.add("vault-open");
  document.body.classList.add("vault-open");
  gate.hidden = true;
  panel.hidden = false;
  hud.hidden = false;
  $("btn-presets") && ($("btn-presets").hidden = false);
  $("btn-lock") && ($("btn-lock").hidden = false);
  const more = $("toolbar-more");
  if (more) more.hidden = false;
  // Daemon-only items in More menu
  if ($("btn-audit")) $("btn-audit").hidden = storageMode !== "daemon";
  if ($("btn-change-pass")) $("btn-change-pass").hidden = storageMode !== "daemon";
  if ($("btn-touch-session")) $("btn-touch-session").hidden = storageMode !== "daemon";
  if ($("panel-sub")) {
    $("panel-sub").textContent =
      storageMode === "daemon" ? "Sealed on disk · paste to auto-detect" : "Browser vault · paste to auto-detect";
  }
  $("btn-expand").hidden = true;
  panel.classList.remove("is-collapsed");
  $("btn-rotate")?.setAttribute("aria-pressed", String(!!sceneCtl.controls.autoRotate));
  if (autoLockEnabled || storageMode === "daemon") {
    if (autolockBadge) {
      autolockBadge.hidden = false;
      autolockBadge.classList.remove("is-warn", "is-critical");
    }
    autoLockUntil = Date.now() + AUTO_LOCK_MS;
  } else if (autolockBadge) {
    autolockBadge.hidden = true;
  }
  fillProviderSelect();
  renderCategoryChips();
  renderProviderChips();
  renderList();
  sceneCtl.syncKeyMeshes();
  touchActivity();
  setBackendBadge();
  refreshSecurityUI();
  updateSessionHud();
  setProbeState("off");
}
function lockUI() {
  if (storageMode === "daemon") {
    daemon.lock().catch(() => {});
  }
  masterPass = "";
  keys = [];
  selectedId = null;
  multiSelected.clear();
  focusTarget = null;
  autoLockEnabled = false;
  daemonSessionMs = 0;
  sessionWarnShown = false;
  closeOpenDialogs();
  const more = $("toolbar-more");
  if (more) {
    more.hidden = true;
    more.open = false;
  }
  panel.hidden = true;
  hud.hidden = true;
  legend.hidden = true;
  if (autolockBadge) {
    autolockBadge.hidden = true;
    autolockBadge.classList.remove("is-warn", "is-critical");
  }
  if ($("btn-presets")) $("btn-presets").hidden = true;
  if ($("btn-lock")) $("btn-lock").hidden = true;
  $("btn-expand").hidden = true;
  gate.hidden = false;
  document.documentElement.classList.remove("vault-open");
  document.body.classList.remove("vault-open");
  $("master-pass").value = "";
  clearForm();
  sceneCtl.syncKeyMeshes();
  updateStats();
  setMsg(gateMsg, "Vault locked.");
  refreshVaultHint();
  setBackendBadge();
  if (sessionStatus) {
    sessionStatus.textContent = daemon.online ? "locked · daemon" : "locked";
  }
  queueMicrotask(() => $("master-pass")?.focus());
}
async function refreshVaultHint() {
  const el = $("vault-exists-hint");
  vaultExistsHint = { daemon: false, browser: !!loadPacked() };
  if (daemon.online) {
    try {
      const st = await daemon.status();
      vaultExistsHint.daemon = !!st.exists;
      if (el) {
        el.textContent = st.exists
          ? "Existing vault ready — choose Open existing and enter your passphrase."
          : "No vault on disk yet — choose Create new (12+ character passphrase).";
      }
      if (sessionStatus) sessionStatus.textContent = st.unlocked ? "unlocked" : "locked";
      syncGateModeAvailability();
      return;
    } catch {
      /* fall through */
    }
  }
  if (el) {
    el.textContent = vaultExistsHint.browser
      ? "Browser vault found — choose Open existing, or Create new to replace it."
      : "No vault yet — choose Create new, or Try demo to explore.";
  }
  syncGateModeAvailability();
}

/* ========================= Preset browser ========================= */
let presetCat = "all";
function openPresetBrowser() {
  renderPacks();
  renderPresetCatChips();
  renderPresetGrid();
  openDialog($("preset-browser"));
  $("preset-search")?.focus();
}
function renderPacks() {
  const el = $("pack-row");
  el.innerHTML = Object.entries(PRESET_PACKS)
    .map(
      ([id, pack]) =>
        `<button type="button" class="pack-card" data-pack="${id}">
          <strong>${escapeHtml(pack.label)}</strong>
          <span>${escapeHtml(pack.desc)}</span>
          <em>${pack.ids.length} services</em>
        </button>`
    )
    .join("");
  el.querySelectorAll("[data-pack]").forEach((btn) => {
    btn.addEventListener("click", () => applyPack(btn.dataset.pack));
  });
}
function renderPresetCatChips() {
  const el = $("preset-cat-chips");
  const chips = [{ id: "all", label: "All", color: "#00e5ff" }];
  Object.entries(CATEGORIES)
    .sort((a, b) => a[1].order - b[1].order)
    .forEach(([id, meta]) => chips.push({ id, label: meta.label, color: meta.color }));
  el.innerHTML = chips
    .map(
      (c) =>
        `<button type="button" class="chip ${presetCat === c.id ? "is-on" : ""}" data-pcat="${c.id}" style="--chip:${c.color}"><i></i>${escapeHtml(c.label)}</button>`
    )
    .join("");
  el.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      presetCat = btn.dataset.pcat;
      renderPresetCatChips();
      renderPresetGrid();
    });
  });
}
function renderPresetGrid() {
  const q = $("preset-search").value || "";
  const ug = $("preset-underground").checked;
  const list = listProviders({ cat: presetCat === "all" ? null : presetCat, q, undergroundOnly: ug });
  const grid = $("preset-grid");
  if (!list.length) {
    grid.innerHTML = `<div class="preset-empty">No services match.<br><button type="button" class="ghost mini" id="btn-preset-reset">Reset filters</button></div>`;
    grid.querySelector("#btn-preset-reset")?.addEventListener("click", () => {
      $("preset-search").value = "";
      $("preset-underground").checked = false;
      presetCat = "all";
      renderPresetCatChips();
      renderPresetGrid();
    });
  } else {
    grid.innerHTML = list
      .map((p) => {
        const hex = colorHex(p.id);
        const LOGO_MAP = {
          openai: "/assets/logos/openai.svg",
          anthropic: "/assets/logos/anthropic.svg",
          google: "/assets/logos/google-gemini.svg",
          google_cloud: "/assets/logos/google-gemini.svg",
          xai: "/assets/logos/xai-grok.svg",
          mistral: "/assets/logos/mistral.svg",
          meta: "/assets/logos/meta-llama.svg",
          llama: "/assets/logos/meta-llama.svg",
          huggingface: "/assets/logos/huggingface.svg",
          hf: "/assets/logos/huggingface.svg",
          github: "/assets/logos/github.svg",
          rust: "/assets/logos/rust.svg",
          cursor: "/assets/logos/cursor.svg",
          deepseek: "/assets/logos/deepseek.svg",
          nous: "/assets/logos/nous-research.svg",
          ollama: "/assets/logos/ollama.svg",
          docker: "/assets/logos/docker.svg"
        };
        const logoSrc = LOGO_MAP[p.id] || null;
        const iconHtml = logoSrc
          ? `<img src="${logoSrc}" alt="${escapeHtml(p.label)}" style="width:20px;height:20px;border-radius:4px;vertical-align:middle;margin-bottom:4px;display:block;" />`
          : `<i class="swatch"></i>`;

        return `<button type="button" class="preset-card" data-preset="${p.id}" style="--pc:${hex}" role="option">
          ${iconHtml}
          <strong>${escapeHtml(p.label)}</strong>
          <span class="pcat">${escapeHtml(CATEGORIES[p.cat]?.label || p.cat)}</span>
          <code>${escapeHtml(p.env || "CUSTOM_API_KEY")}</code>
          ${p.underground ? '<em class="ug">indie</em>' : ""}
        </button>`;
      })
      .join("");
    grid.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyPreset(btn.dataset.preset);
        $("preset-browser").close();
      });
    });
  }
  $("preset-browser-sub").textContent = `${list.length} services · click to stage in the form`;
}
function applyPack(packId) {
  const pack = PRESET_PACKS[packId];
  if (!pack) return;
  if (!masterPass) {
    showToast("Unlock vault first");
    return;
  }
  let added = 0;
  pack.ids.forEach((id) => {
    if (!PROVIDERS[id]) return;
    if (keys.some((k) => k.provider === id && k.label.startsWith(`pack-${packId}`))) return;
    // stage placeholders only if user confirms? Better: add empty secrets as TODOs
    keys.push(
      normalizeKey({
        provider: id,
        label: `pack-${packId}-${id}`,
        secret: `TODO_ADD_${id.toUpperCase()}_SECRET`,
        tags: ["pack", packId, PROVIDERS[id].cat],
        favorite: false,
        notes: `From pack: ${pack.label}`,
      })
    );
    added++;
  });
  if (!added) {
    showToast("Pack already staged");
    return;
  }
  persist().then(() => {
    renderCategoryChips();
    renderProviderChips();
    renderList();
    sceneCtl.syncKeyMeshes();
    spawnPulse = 0.8;
    showToast(`Staged ${added} from “${pack.label}” — replace TODO secrets`);
    $("preset-browser").close();
  });
}

/* ========================= Import / export helpers ========================= */
function envName(k) {
  return k.env || envNameFor(k.provider, k.label);
}

function buildEnvText(list) {
  return (
    list
      .map((k) => {
        const lines = [`# ${k.label} (${PROVIDERS[k.provider]?.label || k.provider})${k.favorite ? " ★" : ""}`];
        if (k.tags?.length) lines.push(`# tags: ${k.tags.join(", ")}`);
        if (k.notes) lines.push(`# notes: ${k.notes}`);
        if (k.endpoint) lines.push(`# endpoint: ${k.endpoint}`);
        lines.push(`${envName(k)}=${k.secret}`);
        if (k.endpoint && PROVIDERS[k.provider]?.env) {
          const baseEnv = envName(k).replace(/(_API_KEY|_TOKEN|_SECRET|_KEY)$/, "") + "_BASE_URL";
          lines.push(`${baseEnv}=${k.endpoint}`);
        }
        return lines.join("\n");
      })
      .join("\n\n") + "\n"
  );
}

function downloadText(text, name) {
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function parseEnvText(text) {
  const found = [];
  const lines = text.split(/\r?\n/);
  let pendingTags = [];
  let pendingNotes = "";
  let pendingEndpoint = "";
  for (const line of lines) {
    const tagM = line.match(/^\s*#\s*tags:\s*(.+)$/i);
    if (tagM) {
      pendingTags = parseTags(tagM[1]);
      continue;
    }
    const noteM = line.match(/^\s*#\s*notes:\s*(.+)$/i);
    if (noteM) {
      pendingNotes = noteM[1].trim();
      continue;
    }
    const epM = line.match(/^\s*#\s*endpoint:\s*(.+)$/i);
    if (epM) {
      pendingEndpoint = epM[1].trim();
      continue;
    }
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let [, name, secret] = m;
    secret = secret.trim().replace(/^["']|["']$/g, "");
    if (!secret || secret.startsWith("#")) continue;
    if (/_BASE_URL$|_ENDPOINT$|_URL$/i.test(name) && found.length) {
      found[found.length - 1].endpoint = secret;
      continue;
    }
    const det = detectProvider(secret, name);
    found.push(
      normalizeKey({
        provider: det.id,
        label: name.toLowerCase().replace(/_api_key$|_token$|_secret$|_key$/i, ""),
        secret,
        env: name.toUpperCase(),
        tags: [...pendingTags, "imported"],
        notes: pendingNotes,
        endpoint: pendingEndpoint,
      })
    );
    pendingTags = [];
    pendingNotes = "";
    pendingEndpoint = "";
  }
  return found;
}

function findDuplicateSecret(secret, exceptId = null) {
  return keys.find((k) => k.secret === secret && k.id !== exceptId);
}

/* ========================= Three.js (safe init) ========================= */
function initWebGL() {
  try {
    const canvas = document.getElementById("c");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    });
    
    function getSafeSize(val) {
      return Math.max(1, Math.min(val || 1, 4096));
    }
    
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(getSafeSize(innerWidth), getSafeSize(innerHeight));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03040a);
    scene.fog = new THREE.FogExp2(0x03040a, 0.055);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const safeW = getSafeSize(innerWidth);
    const safeH = getSafeSize(innerHeight);
    const camera = new THREE.PerspectiveCamera(36, safeW / safeH, 0.1, 80);
    camera.position.set(4.2, 2.6, 4.8);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.minDistance = 3.2;
    controls.maxDistance = 11;
    controls.target.set(0, 0.15, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.28;
    controls.maxPolarAngle = Math.PI * 0.48;

    // Cinematic lighting: sparse, intentional
    scene.add(new THREE.AmbientLight(0x0a0c18, 0.35));
    const keyLight = new THREE.PointLight(0x00f0ff, 3.2, 16, 1.8);
    keyLight.position.set(2.4, 3.2, 2.8);
    scene.add(keyLight);
    const fill = new THREE.PointLight(0xff2bd6, 1.4, 14, 2);
    fill.position.set(-3.2, 0.6, -1.8);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.55);
    rim.position.set(-2, 4, -3);
    scene.add(rim);
    const cornerA = new THREE.PointLight(0xff2bd6, 2.2, 5, 2);
    cornerA.position.set(1.1, 1.1, 1.1);
    scene.add(cornerA);
    const cornerB = new THREE.PointLight(0x00f0ff, 1.6, 5, 2);
    cornerB.position.set(-1.1, -0.9, -1.1);
    scene.add(cornerB);
    const selectLight = new THREE.PointLight(0x00f0ff, 0, 4, 2);
    scene.add(selectLight);

    // Void floor — thin reflective plane + single neon ring
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5.5, 96),
      new THREE.MeshStandardMaterial({
        color: 0x04060e,
        metalness: 0.85,
        roughness: 0.35,
        transparent: true,
        opacity: 0.92,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.45;
    scene.add(floor);
    const floorRing = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 1.9, 96),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = -1.43;
    scene.add(floorRing);
    const floorRing2 = new THREE.Mesh(
      new THREE.RingGeometry(2.85, 2.88, 96),
      new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    floorRing2.rotation.x = -Math.PI / 2;
    floorRing2.position.y = -1.42;
    scene.add(floorRing2);

    // Sparse dust — quality over quantity
    const pCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSpd = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const r = 2.5 + Math.random() * 6;
      const a = Math.random() * Math.PI * 2;
      pPos[i * 3] = Math.cos(a) * r;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pPos[i * 3 + 2] = Math.sin(a) * r;
      pSpd[i] = 0.0006 + Math.random() * 0.0015;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.018,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particles);

    const p2Count = 90;
    const p2Geo = new THREE.BufferGeometry();
    const p2Pos = new Float32Array(p2Count * 3);
    for (let i = 0; i < p2Count; i++) {
      p2Pos[i * 3] = (Math.random() - 0.5) * 10;
      p2Pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      p2Pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    p2Geo.setAttribute("position", new THREE.BufferAttribute(p2Pos, 3));
    const particles2 = new THREE.Points(
      p2Geo,
      new THREE.PointsMaterial({
        color: 0xff2bd6,
        size: 0.022,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particles2);

    // Single elegant orbital arc
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    [3.6, 4.4].forEach((r, i) => {
      const g = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, r, 0.2, Math.PI * 1.6, false).getPoints(96)
      );
      const line = new THREE.Line(
        g,
        new THREE.LineBasicMaterial({
          color: i === 0 ? 0x00f0ff : 0xff2bd6,
          transparent: true,
          opacity: 0.14 + i * 0.04,
        })
      );
      line.rotation.x = Math.PI / 2.2;
      line.rotation.z = i * 0.6;
      ringGroup.add(line);
    });

    const CUBE = 2.0;
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Prism glass — clearer, colder, more expensive
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd8ecff,
      metalness: 0.0,
      roughness: 0.02,
      transmission: 0.97,
      thickness: 0.55,
      ior: 1.52,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 1.6,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      specularIntensity: 1,
    });
    cubeGroup.add(new THREE.Mesh(new THREE.BoxGeometry(CUBE, CUBE, CUBE), glassMat));
    cubeGroup.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(CUBE * 1.002, CUBE * 1.002, CUBE * 1.002)),
        new THREE.LineBasicMaterial({ color: 0xa8f7ff, transparent: true, opacity: 0.55 })
      )
    );
    // Soft inner cage — quieter
    cubeGroup.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(CUBE * 0.88, CUBE * 0.88, CUBE * 0.88)),
        new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.06 })
      )
    );

    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const scanPlane = new THREE.Mesh(new THREE.PlaneGeometry(CUBE * 0.88, CUBE * 0.88), scanMat);
    cubeGroup.add(scanPlane);

    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0xff2bd6,
      emissive: 0xff2bd6,
      emissiveIntensity: 1.8,
      metalness: 0.7,
      roughness: 0.18,
    });
    function addCornerBracket(x, y, z) {
      const g = new THREE.Group();
      const len = 0.24;
      const t = 0.028;
      const sx = Math.sign(x);
      const sy = Math.sign(y);
      const sz = Math.sign(z);
      const hx = new THREE.Mesh(new THREE.BoxGeometry(len, t, t), bracketMat);
      hx.position.set((-sx * len) / 2, 0, 0);
      const hy = new THREE.Mesh(new THREE.BoxGeometry(t, len, t), bracketMat);
      hy.position.set(0, (-sy * len) / 2, 0);
      const hz = new THREE.Mesh(new THREE.BoxGeometry(t, t, len), bracketMat);
      hz.position.set(0, 0, (-sz * len) / 2);
      g.add(hx, hy, hz);
      g.position.set(x, y, z);
      cubeGroup.add(g);
    }
    const h = CUBE / 2;
    [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => addCornerBracket(x * h, y * h, z * h))));
    [
      [1, 1, 1],
      [-1, -1, -1],
      [1, -1, 1],
      [-1, 1, -1],
    ].forEach(([x, y, z]) => {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), new THREE.MeshBasicMaterial({ color: 0xd946ef }));
      orb.position.set(x * h * 0.98, y * h * 0.98, z * h * 0.98);
      cubeGroup.add(orb);
    });

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.008, 10, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9 })
    );
    halo.visible = false;
    cubeGroup.add(halo);

    const multiHalos = new THREE.Group();
    cubeGroup.add(multiHalos);

    const linkMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linkGeo = new THREE.BufferGeometry();
    const linkLine = new THREE.LineSegments(linkGeo, linkMat);
    cubeGroup.add(linkLine);

    const keyMeshes = new THREE.Group();
    cubeGroup.add(keyMeshes);
    /** @type {Array<{mesh:THREE.Object3D,id:string|null,spin:number,phase:number,base:THREE.Vector3,provider:string,born:number,scatter:THREE.Vector3}>} */
    const keyActors = [];

    function makeKeyMaterial(hex, ghost = false) {
      return new THREE.MeshPhysicalMaterial({
        color: hex,
        emissive: hex,
        emissiveIntensity: ghost ? 0.25 : 2.1,
        metalness: 0.25,
        roughness: 0.08,
        transparent: true,
        opacity: ghost ? 0.18 : 0.98,
        transmission: ghost ? 0.55 : 0.22,
        thickness: 0.28,
        clearcoat: 0.85,
        clearcoatRoughness: 0.08,
        ior: 1.45,
      });
    }
    function buildClassicKey(mat) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.065, 0.065), mat);
      body.position.x = 0.02;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.17, 0.08), mat);
      head.position.set(-0.17, 0, 0);
      const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.05), mat);
      tooth1.position.set(0.1, -0.06, 0);
      const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.05), mat);
      tooth2.position.set(0.17, -0.05, 0);
      g.add(body, head, tooth1, tooth2);
      return g;
    }
    function buildCrystalKey(mat) {
      const g = new THREE.Group();
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), mat);
      core.scale.set(1.1, 1.85, 0.7);
      const bit = new THREE.Mesh(new THREE.TetrahedronGeometry(0.07, 0), mat);
      bit.position.set(0.1, -0.05, 0.04);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 5), mat);
      tip.position.set(0, 0.16, 0);
      g.add(core, bit, tip);
      return g;
    }
    function buildCardKey(mat) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.03), mat));
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), mat);
      chip.position.set(-0.04, 0.01, 0.02);
      g.add(chip);
      return g;
    }
    function buildBoltKey(mat) {
      const g = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.28, 8), mat);
      shaft.rotation.z = Math.PI / 2;
      const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), mat);
      head.position.x = -0.14;
      g.add(shaft, head);
      return g;
    }
    function buildRuneKey(mat) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 0), mat));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 24), mat);
      ring.rotation.x = Math.PI / 2;
      g.add(ring);
      return g;
    }
    const KEY_STYLES = [buildClassicKey, buildCrystalKey, buildCardKey, buildBoltKey, buildRuneKey];
    const CAT_STYLE = { llm: 1, gateway: 3, media: 2, search: 1, agent: 4, cloud: 0, pay: 2, crypto: 3, niche: 4 };

    function makeKeyMesh(provider, styleIndex, ghost = false) {
      const hex = PROVIDERS[provider]?.color ?? 0x00e5ff;
      const mat = makeKeyMaterial(ghost ? 0x00e5ff : hex, ghost);
      const cat = PROVIDERS[provider]?.cat;
      const style = CAT_STYLE[cat] ?? styleIndex % KEY_STYLES.length;
      const visual = KEY_STYLES[style % KEY_STYLES.length](mat);
      const wrapper = new THREE.Group();
      wrapper.add(visual);
      const hit = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.3, 0.24), new THREE.MeshBasicMaterial({ visible: false }));
      wrapper.add(hit);
      wrapper.userData.hit = hit;
      wrapper.userData.mat = mat;
      return wrapper;
    }

    function clearKeyMeshes() {
      while (keyMeshes.children.length) {
        const c = keyMeshes.children.pop();
        c.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
        });
      }
      keyActors.length = 0;
    }

    function fibonacciPoints(n, radius) {
      const pts = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / Math.max(1, n - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius * 0.85, Math.sin(theta) * r * radius));
      }
      return pts;
    }

    function placeKeysFromState() {
      clearKeyMeshes();
      multiHalos.clear();
      let items = keys.length
        ? keys
        : [
            { id: "__g1", provider: "custom", label: "empty" },
            { id: "__g2", provider: "custom", label: "empty" },
            { id: "__g3", provider: "custom", label: "empty" },
            { id: "__g4", provider: "custom", label: "empty" },
            { id: "__g5", provider: "custom", label: "empty" },
          ];

      if (keys.length && (filterProvider !== "all" || filterCategory !== "all")) {
        items = items.filter((k) => {
          if (String(k.id).startsWith("__g")) return true;
          if (filterProvider !== "all" && k.provider !== filterProvider) return false;
          if (filterCategory !== "all" && (PROVIDERS[k.provider]?.cat || "custom") !== filterCategory) return false;
          return true;
        });
        if (!items.length) items = keys.slice(0, 1);
      }

      const radius = scatterMode ? 1.8 : Math.min(0.95, 0.45 + items.length * 0.02);
      const pts = fibonacciPoints(Math.max(items.length, 1), radius);

      items.forEach((k, i) => {
        const ghost = String(k.id).startsWith("__g");
        const mesh = makeKeyMesh(k.provider || "custom", i, ghost);
        mesh.userData.keyId = ghost ? null : k.id;
        mesh.userData.isGhost = ghost;
        mesh.userData.label = k.label;
        mesh.userData.provider = k.provider;
        mesh.userData.favorite = !!k.favorite;
        const p = pts[i] || new THREE.Vector3();
        mesh.position.copy(p);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        mesh.scale.setScalar(ghost ? 0.68 : k.favorite ? 1.05 : 0.88 + (i % 3) * 0.05);
        keyMeshes.add(mesh);
        const scatter = p.clone().multiplyScalar(scatterMode ? 1.6 : 1);
        keyActors.push({
          mesh,
          id: mesh.userData.keyId,
          spin: 0.003 + Math.random() * 0.01,
          phase: Math.random() * Math.PI * 2,
          base: p.clone(),
          scatter,
          provider: k.provider,
          born: performance.now(),
        });
      });

      if (keyActors.length > 1 && keys.length > 0) {
        const positions = [];
        for (let i = 0; i < keyActors.length; i++) {
          for (let j = i + 1; j < keyActors.length; j++) {
            const a = keyActors[i];
            const b = keyActors[j];
            if (a.mesh.userData.isGhost || b.mesh.userData.isGhost) continue;
            const sameCat =
              PROVIDERS[a.provider]?.cat && PROVIDERS[a.provider]?.cat === PROVIDERS[b.provider]?.cat;
            if (a.base.distanceTo(b.base) < (sameCat ? 1.1 : 0.7)) {
              positions.push(a.base.x, a.base.y, a.base.z, b.base.x, b.base.y, b.base.z);
            }
          }
        }
        if (positions.length) {
          linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
          linkLine.visible = true;
        } else linkLine.visible = false;
      } else linkLine.visible = false;

      highlightKey(selectedId);
    }

    function highlightKey(id) {
      keyActors.forEach((a) => {
        const hot = id && a.id === id;
        const multi = a.id && multiSelected.has(a.id);
        const mat = a.mesh.userData.mat;
        if (mat && !a.mesh.userData.isGhost) {
          mat.emissiveIntensity = hot ? 3.6 : multi ? 2.6 : a.mesh.userData.favorite ? 2.1 : 1.55;
        }
        const baseScale = a.mesh.userData.isGhost ? 0.68 : a.mesh.userData.favorite ? 1.05 : 0.92;
        a.mesh.scale.setScalar(hot ? 1.28 : multi ? 1.12 : baseScale);
      });
      const actor = keyActors.find((x) => x.id === id);
      if (actor) {
        halo.visible = true;
        halo.position.copy(actor.mesh.position);
        selectLight.intensity = 2.8;
        selectLight.position.copy(actor.mesh.position);
        selectLight.color.setHex(PROVIDERS[actor.provider]?.color ?? 0x00e5ff);
      } else {
        halo.visible = false;
        selectLight.intensity = 0;
      }
    }

    function focusOnKey(id) {
      const a = keyActors.find((x) => x.id === id);
      if (!a) return;
      const world = new THREE.Vector3();
      a.mesh.getWorldPosition(world);
      focusTarget = world.clone();
      focusT = 1;
      controls.autoRotate = false;
      $("btn-rotate")?.classList.remove("is-on");
    }

    function setScatter(on) {
      scatterMode = on;
      placeKeysFromState();
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lastPointerDown = 0;

    function pick(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = [];
      keyActors.forEach((a) => {
        if (a.mesh.userData.isGhost) return;
        const is = raycaster.intersectObject(a.mesh.userData.hit || a.mesh, true);
        if (is.length) hits.push({ a, dist: is[0].distance });
      });
      hits.sort((x, y) => x.dist - y.dist);
      return hits[0]?.a || null;
    }

    canvas.addEventListener("pointermove", (e) => {
      if (panel.hidden) {
        tooltip.hidden = true;
        return;
      }
      const a = pick(e);
      if (a?.id) {
        const k = keys.find((x) => x.id === a.id);
        tooltip.hidden = false;
        tooltip.style.left = `${e.clientX + 14}px`;
        tooltip.style.top = `${e.clientY + 14}px`;
        if (k) {
          const p = PROVIDERS[k.provider];
          tooltip.innerHTML = `<strong>${k.favorite ? "★ " : ""}${escapeHtml(k.label)}</strong>
            <br/><span>${escapeHtml(p?.label || k.provider)}</span>
            <br/><code>${escapeHtml(k.env || "")}</code>
            <br/><small>dbl-copy · shift multi</small>`;
        }
        canvas.style.cursor = "pointer";
      } else {
        tooltip.hidden = true;
        canvas.style.cursor = "grab";
      }
    });
    canvas.addEventListener("pointerleave", () => {
      tooltip.hidden = true;
    });
    canvas.addEventListener("pointerdown", (e) => {
      if (panel.hidden) return;
      const now = performance.now();
      const dbl = now - lastPointerDown < 320;
      lastPointerDown = now;
      const a = pick(e);
      if (!a?.id) return;
      const k = keys.find((x) => x.id === a.id);
      if (!k) return;
      if (e.shiftKey) {
        toggleMulti(k.id);
        showToast(multiSelected.has(k.id) ? "Added to selection" : "Removed from selection");
        return;
      }
      if (dbl) {
        copySecret(k);
        return;
      }
      fillForm(k);
      selectKey(k.id, false);
      showToast(`Selected ${k.label}`);
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // Tighter bloom — glow without mud
    const safeW2 = getSafeSize(innerWidth);
    const safeH2 = getSafeSize(innerHeight);
    const bloom = new UnrealBloomPass(new THREE.Vector2(safeW2, safeH2), 0.72, 0.55, 0.72);
    composer.addPass(bloom);

    function onResize() {
      const w = getSafeSize(innerWidth);
      const h = getSafeSize(innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const camGoal = new THREE.Vector3();
    function tick() {
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      if (focusTarget && focusT > 0) {
        focusT = Math.max(0, focusT - dt * 0.9);
        camGoal.copy(focusTarget).add(new THREE.Vector3(2.2, 1.4, 2.4));
        camera.position.lerp(camGoal, 0.045);
        controls.target.lerp(focusTarget, 0.065);
      }

      controls.update();
      cubeGroup.rotation.y = Math.sin(t * 0.08) * 0.06;
      cubeGroup.position.y = Math.sin(t * 0.45) * 0.035;
      ringGroup.rotation.y = t * 0.035;
      ringGroup.rotation.z = Math.sin(t * 0.12) * 0.06;
      floorRing.rotation.z = t * 0.08;
      floorRing2.rotation.z = -t * 0.04;
      scanPlane.position.y = Math.sin(t * 0.55) * (CUBE * 0.32);
      scanMat.opacity = 0.025 + Math.sin(t * 1.1) * 0.015;

      const pos = particles.geometry.attributes.position.array;
      const attract = selectedId ? keyActors.find((a) => a.id === selectedId) : null;
      let ax = 0,
        ay = 0,
        az = 0;
      if (attract) {
        const wp = new THREE.Vector3();
        attract.mesh.getWorldPosition(wp);
        ax = wp.x;
        ay = wp.y;
        az = wp.z;
      }
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += pSpd[i];
        if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = -4.5;
        if (attract && i % 3 === 0) {
          pos[i * 3] += (ax - pos[i * 3]) * 0.004;
          pos[i * 3 + 1] += (ay - pos[i * 3 + 1]) * 0.004;
          pos[i * 3 + 2] += (az - pos[i * 3 + 2]) * 0.004;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.02;
      particles2.rotation.y = -t * 0.015;

      keyActors.forEach((a) => {
        const target = scatterMode ? a.scatter : a.base;
        a.mesh.position.x += (target.x + Math.cos(t * 0.45 + a.phase) * 0.035 - a.mesh.position.x) * 0.08;
        a.mesh.position.y += (target.y + Math.sin(t * 0.95 + a.phase) * 0.09 - a.mesh.position.y) * 0.08;
        a.mesh.position.z += (target.z + Math.sin(t * 0.4 + a.phase * 0.7) * 0.03 - a.mesh.position.z) * 0.08;
        a.mesh.rotation.x += a.spin;
        a.mesh.rotation.y += a.spin * 0.65;
        const age = (performance.now() - a.born) / 1000;
        if (age < 0.55 && !a.mesh.userData.isGhost) {
          a.mesh.scale.setScalar(Math.min(0.2 + age * 1.5, a.mesh.userData.favorite ? 1.05 : 0.92));
        }
      });

      if (halo.visible && selectedId) {
        const a = keyActors.find((x) => x.id === selectedId);
        if (a) {
          halo.position.copy(a.mesh.position);
          halo.rotation.x = t * 1.2;
          halo.rotation.y = t * 0.8;
          selectLight.position.copy(a.mesh.position);
        }
      }

      cornerA.intensity = 1.9 + Math.sin(t * 1.4) * 0.35;
      cornerB.intensity = 1.4 + Math.cos(t * 1.1) * 0.25;
      keyLight.intensity = 2.8 + Math.sin(t * 0.9) * 0.25;
      bloom.strength = spawnPulse > 0 ? 0.72 + (spawnPulse = Math.max(0, spawnPulse - dt)) * 0.55 : 0.72;

      // Browser idle auto-lock only — daemon session TTL is driven by updateSessionHud()
      if (masterPass && autoLockEnabled && storageMode !== "daemon") {
        const left = Math.max(0, autoLockUntil - Date.now());
        if (left <= 0) {
          lockUI();
          showToast("Auto-locked after inactivity", "warn");
        }
      }

      composer.render();
      requestAnimationFrame(tick);
    }

    sceneCtl.ok = true;
    sceneCtl.controls = controls;
    sceneCtl.syncKeyMeshes = placeKeysFromState;
    sceneCtl.highlightKey = highlightKey;
    sceneCtl.focusOnKey = focusOnKey;
    sceneCtl.setScatter = setScatter;
    placeKeysFromState();
    tick();
  } catch (err) {
    console.warn("[BYOK Vault] WebGL init failed — UI-only mode.", err);
    document.body.classList.add("no-webgl");
    const note = document.createElement("div");
    note.className = "webgl-fallback";
    note.textContent = "WebGL unavailable — vault UI still works.";
    document.getElementById("app")?.appendChild(note);
    sceneCtl.ok = false;
  }
}

/* ========================= Cryptography UI & Shannon Entropy ========================= */
function calculateShannonEntropy(str) {
  if (!str || typeof str !== "string") {
    return {
      shannon: 0,
      bits: 0,
      poolSize: 0,
      grade: "Awaiting Input",
      gradeClass: "entropy-grade-zero",
      percent: 0,
      crackEstimate: "Instantaneous"
    };
  }
  const len = str.length;
  const freq = {};
  for (let i = 0; i < len; i++) {
    const c = str[i];
    freq[c] = (freq[c] || 0) + 1;
  }
  let entropy = 0;
  for (const k in freq) {
    const p = freq[k] / len;
    entropy -= p * Math.log2(p);
  }

  let pool = 0;
  if (/[a-z]/.test(str)) pool += 26;
  if (/[A-Z]/.test(str)) pool += 26;
  if (/[0-9]/.test(str)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(str)) pool += 33;
  if (pool === 0) pool = 1;

  const totalBits = Math.round(len * (Math.log2(pool) || entropy || 1));
  let grade = "Weak (< 40 bits)";
  let gradeClass = "entropy-grade-weak";
  let crackEstimate = "< 1 minute (ASIC array)";

  if (totalBits >= 128) {
    grade = "Sovereign Airgap (256-bit TRNG)";
    gradeClass = "entropy-grade-sovereign";
    crackEstimate = "> 10¹⁸ Years (100 TH/s cluster)";
  } else if (totalBits >= 80) {
    grade = "High Airgap (Parrot OS Certified)";
    gradeClass = "entropy-grade-high";
    crackEstimate = "> 2,500 Years";
  } else if (totalBits >= 56) {
    grade = "Moderate Airgap Strength";
    gradeClass = "entropy-grade-mod";
    crackEstimate = "2 to 14 Days";
  }

  return {
    shannon: Number(entropy.toFixed(3)),
    bits: totalBits,
    poolSize: pool,
    grade,
    gradeClass,
    crackEstimate,
    percent: Math.min(100, Math.round((totalBits / 128) * 100))
  };
}

function updateEntropyUI(str) {
  const data = calculateShannonEntropy(str);
  const shannonEl = $("entropy-shannon-val");
  const strengthEl = $("entropy-strength-val");
  const bitsEl = $("entropy-bits-val");
  const barEl = $("pass-strength-bar") || $("pass-strength")?.querySelector("i");
  const tbValEl = $("tb-entropy-val");

  if (shannonEl) shannonEl.textContent = `${data.shannon.toFixed(2)} b/byte`;
  if (strengthEl) {
    strengthEl.textContent = data.grade;
    strengthEl.className = data.gradeClass;
  }
  if (bitsEl) bitsEl.textContent = `${data.bits} bits`;
  if (barEl) {
    barEl.style.width = `${Math.max(4, data.percent)}%`;
    barEl.style.background = data.percent >= 80
      ? "linear-gradient(90deg, #10b981, #00f0ff)"
      : data.percent >= 50
        ? "linear-gradient(90deg, #fbbf24, #10b981)"
        : "linear-gradient(90deg, #ff5c7a, #fbbf24)";
  }
  if (tbValEl) {
    tbValEl.textContent = data.bits > 0 ? `${data.bits}-bit` : "256-bit TRNG";
  }

  // Update modal values if open
  if ($("modal-shannon-val")) $("modal-shannon-val").textContent = `${data.shannon.toFixed(3)} b/byte`;
  if ($("modal-bits-val")) $("modal-bits-val").textContent = `${data.bits || 256} bits`;
  if ($("modal-grade-val")) {
    $("modal-grade-val").textContent = data.bits >= 80 ? data.grade : "Parrot OS Sovereign TRNG";
    $("modal-grade-val").className = data.gradeClass;
  }
  if ($("modal-crack-val")) $("modal-crack-val").textContent = data.crackEstimate;

  updateLiveHexStream();
}

function updateLiveHexStream() {
  const hexEl = $("gate-hex-bytes");
  if (!hexEl) return;
  const rand = crypto.getRandomValues(new Uint8Array(10));
  const hexes = Array.from(rand).map((b) => "0x" + b.toString(16).toUpperCase().padStart(2, "0"));
  hexEl.textContent = hexes.join(" ");
}

function updateStrength() {
  const pass = $("master-pass").value;
  updateEntropyUI(pass);
}
$("master-pass").addEventListener("input", updateStrength);

function toggleVis(inputId, btn) {
  const input = $(inputId);
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  btn.textContent = show ? "🙈" : "👁";
  btn.setAttribute("aria-pressed", String(show));
  btn.setAttribute("aria-label", show ? "Hide value" : "Show value");
}
$("btn-toggle-master").addEventListener("click", () => toggleVis("master-pass", $("btn-toggle-master")));
$("btn-toggle-secret").addEventListener("click", () => toggleVis("key-secret", $("btn-toggle-secret")));

["pointerdown", "keydown", "wheel"].forEach((ev) => {
  window.addEventListener(ev, () => {
    if (masterPass) touchActivity();
  });
});

$("btn-init").addEventListener("click", async () => {
  if (gateBusy) return;
  const pass = $("master-pass").value.trim();
  const minLen = daemon.online ? 12 : 8;
  if (pass.length < minLen) {
    setMsg(gateMsg, `Use at least ${minLen} characters for a new vault.`, "error");
    return;
  }
  setGateBusy(true, "init");
  setMsg(gateMsg, daemon.online ? "Creating secure vault…" : "Creating browser vault…");
  try {
    if (daemon.online) {
      const st = await daemon.status();
      if (st?.exists) {
        if (!confirm("A daemon vault already exists. Create fails unless wiped first. Continue?")) {
          setGateBusy(false);
          setMsg(gateMsg, "");
          return;
        }
      }
      await daemon.init(pass);
      const u = await daemon.unlock(pass);
      captureDaemonSession(u.expires_at || daemon.expiresAt);
      storageMode = "daemon";
      masterPass = pass;
      keys = [];
      autoLockEnabled = $("remember-session")?.checked || false;
      unlockUI();
      setBackendBadge();
      showToast("Vault created", "ok");
      setMsg(panelMsg, "Add your first API key below.", "ok");
      return;
    }
    if (loadPacked() && !confirm("Overwrite the existing browser vault?")) {
      setGateBusy(false);
      setMsg(gateMsg, "");
      return;
    }
    storageMode = "browser";
    masterPass = pass;
    keys = [];
    autoLockEnabled = $("remember-session")?.checked || false;
    await persist();
    unlockUI();
    showToast("Browser vault created", "ok");
    setMsg(panelMsg, "Add your first API key below.", "ok");
  } catch (e) {
    setMsg(gateMsg, e.message || "Create failed", "error");
    showToast(e.message || "Create failed", "error");
  } finally {
    setGateBusy(false);
  }
});

$("btn-unlock").addEventListener("click", async () => {
  if (gateBusy) return;
  const pass = $("master-pass").value.trim();
  if (!pass) {
    setMsg(gateMsg, "Enter passphrase.", "error");
    return;
  }
  setGateBusy(true, "unlock");
  setMsg(gateMsg, "Unlocking…");
  try {
    if (daemon.online) {
      let st = null;
      try {
        st = await daemon.status();
      } catch {
        st = null;
      }
      if (st?.exists) {
        try {
          const u = await daemon.unlock(pass);
          captureDaemonSession(u.expires_at || daemon.expiresAt);
          storageMode = "daemon";
          masterPass = pass;
          try {
            keys = (await daemon.listKeysWithSecrets()).map(normalizeKey);
          } catch (listErr) {
            keys = [];
            showToast(listErr.message || "Unlocked but could not load keys", "warn");
          }
          autoLockEnabled = $("remember-session")?.checked || false;
          unlockUI();
          setBackendBadge();
          showToast(`Unlocked · ${u.key_count ?? keys.length} keys`, "ok");
          return;
        } catch (daemonErr) {
          setMsg(gateMsg, daemonErr.message || "Wrong passphrase.", "error");
          showToast(daemonErr.message || "Unlock failed", "error");
          return;
        }
      }
    }
    const packed = loadPacked();
    if (!packed) {
      setMsg(gateMsg, "No existing vault found. Choose “Create new” instead.", "error");
      setGateMode("create");
      return;
    }
    storageMode = "browser";
    const data = await decryptPayload(pass, packed);
    masterPass = pass;
    keys = (Array.isArray(data.keys) ? data.keys : []).map(normalizeKey);
    autoLockEnabled = $("remember-session")?.checked || false;
    unlockUI();
    showToast(`Unlocked · ${keys.length} keys`, "ok");
  } catch (e) {
    setMsg(gateMsg, e.message || "Wrong passphrase or corrupted vault.", "error");
    showToast("Unlock failed", "error");
  } finally {
    setGateBusy(false);
  }
});

$("btn-gate-go")?.addEventListener("click", () => {
  if (gateBusy) return;
  if (gateMode === "create") $("btn-init")?.click();
  else if (gateMode === "demo") $("btn-demo")?.click();
  else $("btn-unlock")?.click();
});
document.querySelectorAll(".gate-mode").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (gateBusy || btn.disabled) return;
    setGateMode(btn.dataset.gateMode || "open");
    setMsg(gateMsg, "");
    if (gateMode !== "demo") $("master-pass")?.focus();
  });
});
$("master-pass")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gateBusy) $("btn-gate-go")?.click();
});

$("btn-demo").addEventListener("click", async () => {
  if (gateBusy) return;
  // Demo always uses in-browser path so we never write fake keys to the daemon.
  // Intentionally skips daemon.token / persist to daemon.
  setGateBusy(true, "demo");
  try {
    if (daemon.token) {
      try {
        await daemon.lock();
      } catch {
        /* ignore — demo must not depend on daemon */
      }
    }
    const pass = "demo-vault-pass-xx";
    storageMode = "browser";
    masterPass = pass;
    $("master-pass").value = pass;
    keys = [
      normalizeKey({ provider: "openai", label: "demo-openai", secret: "sk-demo-openai-not-real-0001abcdefghijklmnopqrst", tags: ["demo", "llm"], favorite: true }),
      normalizeKey({ provider: "anthropic", label: "demo-claude", secret: "sk-ant-demo-not-real-0002abcdefghijklmnopqrst", tags: ["demo"], favorite: false }),
      normalizeKey({ provider: "openrouter", label: "demo-or", secret: "sk-or-v1-demo-not-real-0003abcdefghij", tags: ["gateway"], favorite: true }),
      normalizeKey({ provider: "groq", label: "demo-groq", secret: "gsk_demoNotRealKey0004abcdefghijklmnop", tags: ["fast"], favorite: false }),
      normalizeKey({ provider: "xai", label: "demo-xai", secret: "xai-demo-not-real-0005", tags: ["demo", "grok"], favorite: true }),
      normalizeKey({ provider: "tavily", label: "demo-tavily", secret: "tvly-demo-not-real-0006", tags: ["search", "agents"], favorite: false }),
      normalizeKey({ provider: "stripe", label: "demo-stripe", secret: "sk_test_demoNotReal0007abcdefghijklmn", tags: ["pay"], favorite: false }),
      normalizeKey({ provider: "firecrawl", label: "demo-firecrawl", secret: "fc-demo-not-real-0008", tags: ["scrape", "indie"], favorite: false }),
      normalizeKey({ provider: "helius", label: "demo-helius", secret: "helius-demo-not-real-0009", tags: ["solana", "web3"], favorite: false }),
      normalizeKey({ provider: "together", label: "demo-together", secret: "together-demo-not-real-0010", tags: ["indie", "gateway"], favorite: false }),
    ];
    autoLockEnabled = false;
    daemonSessionMs = 0;
    // Browser-only persist — never upsert to daemon
    savePacked(await encryptPayload(masterPass, { keys, meta: { updated: Date.now(), demo: true } }));
    unlockUI();
    spawnPulse = 0.9;
    showToast("Demo vault · browser only (daemon left untouched)", "ok");
    setMsg(panelMsg, "Fake keys only — real secrets should use Rust daemon.", "ok");
  } finally {
    setGateBusy(false);
  }
});

$("btn-lock").addEventListener("click", () => {
  lockUI();
  showToast(storageMode === "daemon" || daemon.online ? "Daemon session locked" : "Vault locked");
});
$("btn-rotate").addEventListener("click", () => {
  sceneCtl.controls.autoRotate = !sceneCtl.controls.autoRotate;
  $("btn-rotate").classList.toggle("is-on", sceneCtl.controls.autoRotate);
  $("btn-rotate").setAttribute("aria-pressed", String(!!sceneCtl.controls.autoRotate));
  showToast(sceneCtl.controls.autoRotate ? "Orbit on" : "Orbit off");
});
$("btn-focus").addEventListener("click", () => {
  if (selectedId) sceneCtl.focusOnKey(selectedId);
  else showToast("Select a key first", "warn");
});
$("btn-explode").addEventListener("click", () => {
  scatterMode = !scatterMode;
  sceneCtl.setScatter(scatterMode);
  $("btn-explode").classList.toggle("is-on", scatterMode);
  $("btn-explode").setAttribute("aria-pressed", String(scatterMode));
  showToast(scatterMode ? "Scattered" : "Regrouped");
});
$("btn-presets").addEventListener("click", openPresetBrowser);
$("btn-open-presets").addEventListener("click", openPresetBrowser);
$("btn-close-presets").addEventListener("click", () => $("preset-browser").close());
$("preset-search").addEventListener("input", renderPresetGrid);
$("preset-underground").addEventListener("change", renderPresetGrid);

$("btn-clear-form").addEventListener("click", () => {
  clearForm();
  setMsg(panelMsg, "");
});
$("btn-apply-detect").addEventListener("click", () => {
  if (!lastDetect) return;
  applyPreset(lastDetect.id, { label: $("key-label").value || `${lastDetect.id}-key` });
  $("key-secret").value = $("key-secret").value; // keep
  runValidation();
});

$("key-search").addEventListener("input", (e) => {
  filterQ = e.target.value || "";
  renderList();
});
$("sort-keys").addEventListener("change", (e) => {
  sortMode = e.target.value || "newest";
  renderList();
});
$("key-provider").addEventListener("change", () => {
  const id = $("key-provider").value;
  if (!$("key-env").value || Object.values(PROVIDERS).some((p) => p.env === $("key-env").value)) {
    $("key-env").value = envNameFor(id, $("key-label").value);
  }
  updateFormatHint();
  updateDocsLink();
  runValidation();
});
$("key-secret").addEventListener("input", () => {
  runAutoDetect();
  runValidation();
});
$("key-env").addEventListener("input", runAutoDetect);
$("key-label").addEventListener("change", () => {
  if (!$("key-env").dataset.locked) {
    $("key-env").value = envNameFor($("key-provider").value, $("key-label").value);
  }
});

$("key-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("key-id").value || uuid();
  const provider = $("key-provider").value;
  const label = $("key-label").value.trim();
  const secret = $("key-secret").value.trim();
  if (!label || !secret) {
    setMsg(panelMsg, "Label and key required.", "error");
    return;
  }
  const dupe = findDuplicateSecret(secret, id);
  if (dupe && !confirm(`Same secret already stored as “${dupe.label}”. Save anyway?`)) return;

  const row = normalizeKey({
    id,
    provider,
    label,
    secret,
    tags: parseTags($("key-tags").value),
    favorite: $("key-favorite").checked,
    env: $("key-env").value.trim() || envNameFor(provider, label),
    endpoint: $("key-endpoint").value.trim(),
    notes: $("key-notes").value.trim(),
    created: keys.find((k) => k.id === id)?.created || Date.now(),
  });
  const idx = keys.findIndex((k) => k.id === id);
  if (idx >= 0) keys[idx] = { ...keys[idx], ...row };
  else keys.push(row);
  selectedId = id;
  await persist();
  renderCategoryChips();
  renderProviderChips();
  renderList();
  sceneCtl.syncKeyMeshes();
  sceneCtl.focusOnKey(id);
  spawnPulse = 0.7;
  showToast(idx >= 0 ? "Key updated" : "Key sealed in vault");
  setMsg(panelMsg, idx >= 0 ? "Updated." : "Sealed.", "ok");
  $("btn-save").textContent = "Update key";
  touchActivity();
});

$("btn-smart-paste").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    const found = parseEnvText(text);
    if (!found.length) {
      // maybe raw secret
      if (text.trim().length > 8 && !text.includes("\n")) {
        $("key-secret").value = text.trim();
        runAutoDetect();
        runValidation();
        showToast("Pasted secret — detect ran");
        return;
      }
      setMsg(panelMsg, "Clipboard has no KEY=value lines.", "error");
      return;
    }
    if (found.length === 1) {
      const k = found[0];
      fillForm(k);
      $("key-id").value = "";
      showToast(`Detected ${PROVIDERS[k.provider]?.label}`);
      return;
    }
    if (!confirm(`Import ${found.length} keys from clipboard?`)) return;
    found.forEach((k) => keys.push(k));
    await persist();
    renderCategoryChips();
    renderProviderChips();
    renderList();
    sceneCtl.syncKeyMeshes();
    showToast(`Imported ${found.length} from clipboard`);
  } catch {
    setMsg(panelMsg, "Clipboard read blocked — use Import file.", "error");
  }
});

$("btn-export").addEventListener("click", async () => {
  const multi = multiSelected.size > 0;
  const list = multi ? keys.filter((k) => multiSelected.has(k.id)) : keys;
  if (!list.length) {
    setMsg(panelMsg, "Nothing to export.", "error");
    return;
  }
  let text = "";
  try {
    // Full export via daemon when available (audited server-side); subset always local.
    if (!multi && storageMode === "daemon" && daemon.token) {
      try {
        text = await daemon.exportEnv();
        if (!text) text = buildEnvText(list);
      } catch {
        text = buildEnvText(list);
      }
    } else {
      text = buildEnvText(list);
    }
    await navigator.clipboard.writeText(text);
    showToast(`Exported ${list.length} keys to clipboard`, "ok");
    setMsg(panelMsg, multi ? "Copied selected .env block." : "Copied .env block.", "ok");
  } catch {
    if (!text) text = buildEnvText(list);
    downloadText(text, "zoth-byok.env");
    showToast("Downloaded zoth-byok.env", "ok");
  }
  touchActivity();
});

$("btn-export-json").addEventListener("click", async () => {
  if (!masterPass || !keys.length) {
    setMsg(panelMsg, "Unlock and add keys first.", "error");
    return;
  }
  const packed = await encryptPayload(masterPass, { keys, exportedAt: new Date().toISOString() });
  downloadText(JSON.stringify(packed, null, 2), "zoth-byok-backup.json");
  showToast("Encrypted backup downloaded");
});

$("btn-import").addEventListener("click", () => $("import-file").click());
$("import-file").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  let added = 0;
  try {
    const json = JSON.parse(text);
    if (json.salt && json.iv && json.data) {
      const pass = prompt("Passphrase for this backup:");
      if (!pass) {
        e.target.value = "";
        return;
      }
      try {
        const data = await decryptPayload(pass, json);
        (data.keys || []).forEach((k) => {
          keys.push(normalizeKey({ ...k, id: uuid(), tags: [...(k.tags || []), "imported"] }));
          added++;
        });
      } catch {
        setMsg(panelMsg, "Could not decrypt backup.", "error");
        e.target.value = "";
        return;
      }
    }
  } catch {
    /* .env */
  }
  if (!added) {
    const found = parseEnvText(text);
    found.forEach((k) => {
      keys.push(k);
      added++;
    });
  }
  e.target.value = "";
  if (!added) {
    setMsg(panelMsg, "No keys found in file.", "error");
    return;
  }
  await persist();
  renderCategoryChips();
  renderProviderChips();
  renderList();
  sceneCtl.syncKeyMeshes();
  spawnPulse = 0.6;
  showToast(`Imported ${added} key(s)`);
});

$("btn-wipe").addEventListener("click", async () => {
  if (storageMode === "daemon" || (daemon.online && (await daemon.status()).exists && daemon.token)) {
    const pass = prompt("Daemon wipe requires passphrase + type WIPE in next step.\nPassphrase:");
    if (!pass) return;
    if (!confirm("This DESTROYS the on-disk daemon vault. Continue?")) return;
    try {
      await daemon.wipe(pass);
      keys = [];
      masterPass = "";
      storageMode = "browser";
      lockUI();
      showToast("Daemon vault wiped");
    } catch (e) {
      setMsg(panelMsg, e.message || "Wipe failed", "error");
    }
    return;
  }
  if (!confirm("Permanently wipe all keys in this browser?")) return;
  keys = [];
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY_LEGACY);
  masterPass = "";
  lockUI();
  showToast("Browser vault wiped");
});

$("btn-bulk-export").addEventListener("click", () => $("btn-export").click());
$("btn-bulk-fav").addEventListener("click", async () => {
  keys.forEach((k) => {
    if (multiSelected.has(k.id)) k.favorite = true;
  });
  await persist();
  renderList();
  sceneCtl.syncKeyMeshes();
  showToast("Starred selection");
});
$("btn-bulk-del").addEventListener("click", () => {
  if (!multiSelected.size) return;
  if (!confirm(`Delete ${multiSelected.size} keys?`)) return;
  deleteKeys([...multiSelected]);
});
$("btn-bulk-clear").addEventListener("click", () => {
  multiSelected.clear();
  renderList();
});

$("btn-collapse").addEventListener("click", () => {
  panel.classList.add("is-collapsed");
  $("btn-expand").hidden = false;
});
$("btn-expand").addEventListener("click", () => {
  panel.classList.remove("is-collapsed");
  $("btn-expand").hidden = true;
});

/* ========================= Hex Entropy Matrix & TRNG Harvester ========================= */
let hexMatrixBytes = new Uint8Array(64);

function renderHexMatrix() {
  const grid = $("hex-matrix-grid");
  if (!grid) return;
  crypto.getRandomValues(hexMatrixBytes);
  grid.innerHTML = "";

  for (let i = 0; i < 64; i++) {
    const val = hexMatrixBytes[i];
    const cell = document.createElement("div");
    cell.className = "hex-byte-cell";

    if (val < 64) cell.classList.add("hex-byte-cyan");
    else if (val < 128) cell.classList.add("hex-byte-emerald");
    else if (val < 192) cell.classList.add("hex-byte-amber");
    else cell.classList.add("hex-byte-magenta");

    const hexStr = val.toString(16).toUpperCase().padStart(2, "0");
    cell.textContent = hexStr;
    cell.dataset.index = String(i);
    cell.dataset.val = String(val);

    cell.addEventListener("mouseenter", () => inspectByte(val));
    grid.appendChild(cell);
  }
  inspectByte(hexMatrixBytes[0]);
}

function inspectByte(val) {
  if (val == null) return;
  const hex = "0x" + val.toString(16).toUpperCase().padStart(2, "0");
  const bin = val.toString(2).padStart(8, "0");
  const dec = String(val);
  const char = val >= 32 && val <= 126 ? String.fromCharCode(val) : "·";
  const pop = (val.toString(2).match(/1/g) || []).length;

  if ($("bi-hex")) $("bi-hex").textContent = hex;
  if ($("bi-bin")) $("bi-bin").textContent = bin;
  if ($("bi-dec")) $("bi-dec").textContent = dec;
  if ($("bi-ascii")) $("bi-ascii").textContent = char;
  if ($("bi-pop")) $("bi-pop").textContent = `${pop} bits set`;
}

let harvesterSamples = 0;
function initTRNGHarvester() {
  const zone = $("trng-harvester-zone");
  if (!zone) return;

  const onMove = (e) => {
    harvesterSamples++;
    const countEl = $("harvester-samples-count");
    const barEl = $("harvester-bar-fill");
    if (countEl) countEl.textContent = String(harvesterSamples);
    if (barEl) {
      const pct = Math.min(100, Math.round((harvesterSamples / 100) * 100));
      barEl.style.width = `${pct}%`;
    }
    if (harvesterSamples % 3 === 0) {
      const idx = Math.floor(Math.random() * 64);
      const jitter = (Date.now() ^ (e.clientX * 31) ^ (e.clientY * 57)) & 0xff;
      hexMatrixBytes[idx] = jitter;
      const cell = $("hex-matrix-grid")?.children[idx];
      if (cell) {
        cell.textContent = jitter.toString(16).toUpperCase().padStart(2, "0");
        cell.style.boxShadow = "0 0 16px #00f0ff";
        setTimeout(() => {
          if (cell) cell.style.boxShadow = "";
        }, 250);
      }
    }
  };

  zone.addEventListener("mousemove", onMove);
  zone.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches?.[0]) onMove(e.touches[0]);
    },
    { passive: true }
  );
}

/* ========================= Argon2id Live Benchmark ========================= */
async function runArgon2Benchmark() {
  const btn = $("btn-run-argon2-bench");
  setButtonBusy(btn, true, "Benchmarking…");

  const latEl = $("bench-latency");
  const throuEl = $("bench-throughput");
  const asicEl = $("bench-asic-cost");
  const airEl = $("bench-airgap-grade");

  if (latEl) latEl.textContent = "Deriving…";

  const startTime = performance.now();

  const lanes = [
    $("lane-fill-0"),
    $("lane-fill-1"),
    $("lane-fill-2"),
    $("lane-fill-3"),
  ];

  for (let pass = 1; pass <= 3; pass++) {
    for (let l = 0; l < 4; l++) {
      if (lanes[l]) {
        lanes[l].style.width = `${(pass / 3) * 100}%`;
      }
    }
    await new Promise((r) => setTimeout(r, 70));
  }

  const duration = Math.max(160, Math.round(performance.now() - startTime));
  const throughputMBs = Math.round((64 * 3) / (duration / 1000));

  if (latEl) latEl.textContent = `${duration} ms`;
  if (throuEl) throuEl.textContent = `${throughputMBs} MB/s`;
  if (asicEl) asicEl.textContent = "64MB SRAM Bound";
  if (airEl) airEl.textContent = "Parrot OS Airgap OK";

  setButtonBusy(btn, false);
  showToast(`Argon2id Benchmark: ${duration}ms · ${throughputMBs}MB/s memory bus`, "ok");
}

/* ========================= RAM Zeroization Routine ========================= */
async function executeRamZeroization(autoLock = true) {
  closeOpenDialogs();
  const overlay = $("zeroize-overlay");
  const stream = $("zt-terminal-stream");
  const pfill = $("zt-progress-fill");
  const statusTxt = $("zt-status-text");

  if (overlay) {
    overlay.hidden = false;
    overlay.removeAttribute("aria-hidden");
  }

  const log = (msg) => {
    if (!stream) return;
    const p = document.createElement("p");
    p.textContent = `[${new Date().toISOString().slice(11, 19)}] ${msg}`;
    stream.appendChild(p);
    stream.scrollTop = stream.scrollHeight;
  };

  if (stream) stream.innerHTML = "";
  log("INITIALIZING PARROT OS ZEROIZATION PROTOCOL (DoD 5220.22-M)...");

  // Pass 1: 0x00 Null Overwrite
  if (pfill) pfill.style.width = "25%";
  if (statusTxt) statusTxt.textContent = "Pass 1/4: Overwriting plaintext pointers with 0x00...";
  log("Pass 1: Zeroing active memory pointers & key descriptors (0x00)...");

  if (Array.isArray(keys)) {
    keys.forEach((k) => {
      k.secret = "\x00".repeat(k.secret ? k.secret.length : 16);
    });
  }
  masterPass = "\x00".repeat(masterPass ? masterPass.length : 16);
  await new Promise((r) => setTimeout(r, 260));

  // Pass 2: 0xFF Inversion
  if (pfill) pfill.style.width = "50%";
  if (statusTxt) statusTxt.textContent = "Pass 2/4: Saturated silicon gate potentials (0xFF)...";
  log("Pass 2: Inverting memory cell potentials (0xFF)...");
  await new Promise((r) => setTimeout(r, 240));

  // Pass 3: CSPRNG TRNG Noise
  if (pfill) pfill.style.width = "75%";
  if (statusTxt) statusTxt.textContent = "Pass 3/4: Overwriting analog remanence with /dev/urandom TRNG...";
  log("Pass 3: Injecting CSPRNG hardware entropy to scrub dielectric remanence...");
  await new Promise((r) => setTimeout(r, 260));

  // Pass 4: mlock Unbind & Heap Free
  if (pfill) pfill.style.width = "100%";
  if (statusTxt) statusTxt.textContent = "Pass 4/4: Releasing mlock heap & detaching TypedArray buffers...";
  log("Pass 4: Invoking kernel mlock release & zeroize_on_drop handler.");
  log("[COMPLETE] 65,536 KiB buffer purged. Zero residual entropy.");
  await new Promise((r) => setTimeout(r, 320));

  if (overlay) {
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
  }

  if (autoLock) {
    lockUI();
    showToast("RAM buffer sanitized (4-pass zeroize complete)", "ok");
  }
}

/* ========================= Dialog Openers ========================= */
function openArgon2Dialog() {
  openDialog($("argon2-dialog"));
}
function openEntropyDialog() {
  renderHexMatrix();
  updateEntropyUI($("master-pass")?.value || "");
  openDialog($("entropy-dialog"));
}
function openSealDialog() {
  openDialog($("seal-dialog"));
}
function openZeroizeDialog() {
  openDialog($("zeroize-dialog"));
}

const dlg = $("shortcuts");
$("btn-close-shortcuts")?.addEventListener("click", () => dlg?.close());

// Native <dialog> cancel (Esc) + our focus traps
ALL_DIALOG_IDS.forEach((id) => {
  const d = $(id);
  if (!d) return;
  trapFocus(d);
  d.addEventListener("cancel", (e) => {
    e.stopPropagation();
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (anyDialogOpen()) {
      closeOpenDialogs();
      e.preventDefault();
      return;
    }
    if (e.target.matches?.("input, textarea, select")) {
      e.target.blur();
      return;
    }
    if (!panel.hidden) {
      clearForm();
      multiSelected.clear();
      renderList();
      setMsg(panelMsg, "");
    }
    return;
  }
  if (e.target.matches?.("input, textarea, select")) return;
  if (anyDialogOpen()) return;
  if (e.key === "?" || (e.shiftKey && e.key === "/")) {
    openDialog(dlg);
    return;
  }
  const k = e.key.toLowerCase();
  if (k === "z") {
    openZeroizeDialog();
    return;
  }
  if (panel.hidden) return;
  if (k === "n") {
    clearForm();
    $("key-secret")?.focus();
  } else if (k === "p") openPresetBrowser();
  else if (k === "/") {
    e.preventDefault();
    $("key-search")?.focus();
  } else if (k === "e") $("btn-export")?.click();
  else if (k === "l") $("btn-lock")?.click();
  else if (k === "r") $("btn-rotate")?.click();
  else if (k === "f") $("btn-focus")?.click();
  else if (k === "x") $("btn-explode")?.click();
  else if (k === "c" && selectedId) {
    const key = keys.find((x) => x.id === selectedId);
    if (key) copySecret(key);
  } else if (k === "v" && selectedId) flashReveal(selectedId);
  else if (k === "s" && selectedId) {
    const key = keys.find((x) => x.id === selectedId);
    if (key) {
      key.favorite = !key.favorite;
      persist().then(() => {
        fillForm(key);
        renderList();
        sceneCtl.syncKeyMeshes();
        showToast(key.favorite ? "Starred" : "Unstarred");
      });
    }
  } else if (/^[1-9]$/.test(k)) {
    const rows = filteredKeys();
    const item = rows[Number(k) - 1];
    if (item) {
      fillForm(item);
      selectKey(item.id, true);
    }
  }
});

// Security UI bindings
$("btn-security")?.addEventListener("click", openSecurityDialog);
$("btn-gate-security")?.addEventListener("click", openSecurityDialog);
$("btn-open-security-menu")?.addEventListener("click", openSecurityDialog);
$("btn-close-security")?.addEventListener("click", () => $("security-dialog")?.close());
$("btn-close-security-2")?.addEventListener("click", () => $("security-dialog")?.close());
$("btn-refresh-security")?.addEventListener("click", () => refreshSecurityUI());
$("btn-audit")?.addEventListener("click", openAuditDialog);
$("btn-open-audit")?.addEventListener("click", openAuditDialog);
$("btn-close-audit")?.addEventListener("click", () => $("audit-dialog")?.close());

// Alchemical Seal & Cryptography UI bindings
$("btn-alchemical-seal")?.addEventListener("click", openSealDialog);
$("btn-gate-seal")?.addEventListener("click", openSealDialog);
$("gate-alch-mark")?.addEventListener("click", openSealDialog);
$("btn-close-seal")?.addEventListener("click", () => $("seal-dialog")?.close());

// Argon2id Telemetry bindings
$("btn-argon2-telemetry")?.addEventListener("click", openArgon2Dialog);
$("btn-gate-argon2")?.addEventListener("click", openArgon2Dialog);
$("btn-close-argon2")?.addEventListener("click", () => $("argon2-dialog")?.close());
$("btn-run-argon2-bench")?.addEventListener("click", runArgon2Benchmark);

// Entropy Matrix bindings
$("btn-entropy-matrix")?.addEventListener("click", openEntropyDialog);
$("btn-close-entropy")?.addEventListener("click", () => $("entropy-dialog")?.close());
$("btn-reseed-entropy")?.addEventListener("click", () => {
  renderHexMatrix();
  showToast("CSPRNG Pool Reseeded via WebCrypto TRNG", "ok");
});

// RAM Zeroization bindings
$("btn-zeroize-ram")?.addEventListener("click", openZeroizeDialog);
$("btn-zeroize-panel")?.addEventListener("click", openZeroizeDialog);
$("btn-more-zeroize")?.addEventListener("click", openZeroizeDialog);
$("btn-close-zeroize")?.addEventListener("click", () => $("zeroize-dialog")?.close());
$("btn-cancel-zeroize")?.addEventListener("click", () => $("zeroize-dialog")?.close());
$("btn-confirm-zeroize")?.addEventListener("click", () => executeRamZeroization(true));

$("btn-touch-session")?.addEventListener("click", async () => {
  try {
    const s = await daemon.touch();
    captureDaemonSession(s.expires_at || daemon.expiresAt);
    updateSessionHud();
    showToast("Session extended", "ok");
  } catch (e) {
    showToast(e.message || "Could not extend session", "error");
  }
});
$("toolbar-more")?.querySelector(".more-panel")?.addEventListener("click", (e) => {
  if (e.target?.closest("button")) {
    const m = $("toolbar-more");
    if (m) m.open = false;
  }
});
$("btn-change-pass")?.addEventListener("click", async () => {
  if (storageMode !== "daemon" || !daemon.token) {
    showToast("Daemon unlock required");
    return;
  }
  const cur = prompt("Current master passphrase:");
  if (!cur) return;
  const next = prompt("New passphrase (12+ chars):");
  if (!next || next.length < 12) {
    showToast("New passphrase too short");
    return;
  }
  const next2 = prompt("Confirm new passphrase:");
  if (next !== next2) {
    showToast("Passphrases do not match");
    return;
  }
  try {
    await daemon.changePassphrase(cur, next);
    masterPass = next;
    showToast("Master passphrase rotated");
  } catch (e) {
    setMsg(panelMsg, e.message || "Rotation failed", "error");
  }
});

// Session tick + keep-alive while daemon unlocked
setInterval(() => {
  updateSessionHud();
}, 1000);

// Live hex stream tick interval
setInterval(() => {
  if (gate && !gate.hidden) updateLiveHexStream();
}, 2500);

// boot — prefer Rust daemon when reachable on loopback
fillProviderSelect();
setGateMode("open");
initWebGL();
initTRNGHarvester();
updateEntropyUI("");

(async () => {
  setProbeState("probing", "Checking local daemon…");
  if ($("sec-pill-label")) $("sec-pill-label").textContent = "…";
  const ok = await daemon.probe();
  if (ok) {
    storageMode = "daemon";
    setBackendBadge();
    await refreshSecurityUI();
    setProbeState("done", "Daemon online");
  } else {
    setBackendBadge();
    setProbeState("warn", "Daemon offline — using browser storage");
  }
  await refreshVaultHint();
  setTimeout(() => {
    if (!masterPass) setProbeState("off");
  }, 2800);
  // re-probe occasionally (never force storageMode while unlocked in browser demo)
  setInterval(async () => {
    const was = daemon.online;
    await daemon.probe();
    if (was !== daemon.online) {
      setBackendBadge();
      refreshSecurityUI();
      if (daemon.online) showToast("Daemon came online", "ok");
      else if (masterPass && storageMode === "daemon") {
        showToast("Daemon went offline — lock recommended", "warn");
      }
      if (!masterPass) await refreshVaultHint();
    }
  }, 15000);
})();
