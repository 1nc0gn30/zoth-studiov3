//! HTTP API — localhost only. Secrets never appear in list endpoints or logs.

use crate::session::{SessionError, SessionManager};
use crate::store::{
    delete_key, export_env, upsert_key, KeyMeta, StoreError, VaultKey, VaultStore,
};
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::info;

#[derive(Clone)]
pub struct AppState {
    pub store: Arc<VaultStore>,
    pub sessions: Arc<SessionManager>,
    pub version: &'static str,
}

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health))
        .route("/v1/status", get(status))
        .route("/v1/security", get(security_posture))
        .route("/v1/session", get(session_info).post(session_touch))
        .route("/v1/audit", get(audit_tail))
        .route("/v1/vault/init", post(vault_init))
        .route("/v1/vault/unlock", post(vault_unlock))
        .route("/v1/vault/lock", post(vault_lock))
        .route("/v1/vault/wipe", post(vault_wipe))
        .route("/v1/vault/change-passphrase", post(change_passphrase))
        .route("/v1/keys", get(list_keys).post(create_key))
        .route("/v1/keys/bulk-delete", post(bulk_delete))
        .route("/v1/keys/{id}", get(get_key).put(update_key).delete(remove_key))
        .route("/v1/export/env", post(export_env_route))
        .route("/v1/export/json", post(export_json_route))
        .route("/v1/import/env", post(import_env_route))
        .with_state(state)
}

// ── responses ──────────────────────────────────────────────

#[derive(Serialize)]
struct ErrorBody {
    error: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    lockout_secs: Option<i64>,
}

enum ApiError {
    Status(StatusCode, String),
    Lockout(i64),
    Store(StoreError),
    Session(SessionError),
}

impl From<StoreError> for ApiError {
    fn from(e: StoreError) -> Self {
        Self::Store(e)
    }
}

impl From<SessionError> for ApiError {
    fn from(e: SessionError) -> Self {
        Self::Session(e)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (code, msg, lockout) = match self {
            ApiError::Status(c, m) => (c, m, None),
            ApiError::Lockout(s) => (
                StatusCode::TOO_MANY_REQUESTS,
                format!("too many failed unlocks — try again in {s}s"),
                Some(s),
            ),
            ApiError::Store(StoreError::NotFound) => (StatusCode::NOT_FOUND, "vault not found".into(), None),
            ApiError::Store(StoreError::AlreadyExists) => {
                (StatusCode::CONFLICT, "vault already exists".into(), None)
            }
            ApiError::Store(StoreError::KeyNotFound) => {
                (StatusCode::NOT_FOUND, "key not found".into(), None)
            }
            ApiError::Store(StoreError::InvalidKey) => {
                (StatusCode::BAD_REQUEST, "label and secret required".into(), None)
            }
            ApiError::Store(StoreError::PassphraseTooWeak) => {
                (StatusCode::BAD_REQUEST, "passphrase must be at least 12 characters".into(), None)
            }
            ApiError::Store(StoreError::Crypto(_)) => {
                (StatusCode::UNAUTHORIZED, "wrong passphrase or corrupted vault".into(), None)
            }
            ApiError::Store(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string(), None),
            ApiError::Session(SessionError::Locked) => {
                (StatusCode::UNAUTHORIZED, "vault is locked".into(), None)
            }
            ApiError::Session(SessionError::InvalidToken) => {
                (StatusCode::UNAUTHORIZED, "invalid session".into(), None)
            }
        };
        // Never put secrets in error bodies
        (
            code,
            Json(ErrorBody {
                error: msg,
                lockout_secs: lockout,
            }),
        )
            .into_response()
    }
}

type ApiResult<T> = Result<T, ApiError>;

fn bearer(headers: &HeaderMap) -> Result<&str, ApiError> {
    let auth = headers
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| ApiError::Status(StatusCode::UNAUTHORIZED, "missing Authorization".into()))?;
    auth.strip_prefix("Bearer ")
        .ok_or_else(|| ApiError::Status(StatusCode::UNAUTHORIZED, "expected Bearer token".into()))
}

// ── handlers ───────────────────────────────────────────────

async fn health(State(st): State<AppState>) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "ok": true,
        "service": "zoth-vault-daemon",
        "version": st.version,
        "bind": "loopback-only",
    }))
}

async fn status(State(st): State<AppState>) -> Json<serde_json::Value> {
    let unlocked = st.sessions.is_unlocked();
    let cfg = st.sessions.config_snapshot();
    Json(serde_json::json!({
        "exists": st.store.exists(),
        "unlocked": unlocked,
        "key_count": st.sessions.key_count(),
        "expires_at": st.sessions.expires_at().map(|t| t.to_rfc3339()),
        "remaining_secs": st.sessions.remaining_secs(),
        "vault_path": st.store.path().display().to_string(),
        "vault_mode": st.store.vault_mode_octal(),
        "vault_bytes": st.store.vault_size_bytes(),
        "backend": "rust-argon2id-xchacha20poly1305",
        "session_ttl_secs": cfg.ttl_secs,
        "idle_secs": cfg.idle_secs,
        "version": st.version,
        "secure": true,
    }))
}

async fn security_posture(State(st): State<AppState>) -> Json<serde_json::Value> {
    let cfg = st.sessions.config_snapshot();
    let mode = st.store.vault_mode_octal();
    let dir_mode = st.store.data_dir_mode_octal();
    let mode_ok = mode.as_deref() == Some("600") || !st.store.exists();
    let dir_ok = dir_mode.as_deref() == Some("700");
    let checks = serde_json::json!([
        { "id": "loopback", "ok": true, "label": "Loopback bind only", "detail": "127.0.0.1 / ::1" },
        { "id": "kdf", "ok": true, "label": "Argon2id KDF", "detail": "m=64MiB t=3 p=1" },
        { "id": "aead", "ok": true, "label": "XChaCha20-Poly1305", "detail": "AAD-bound blob v1" },
        { "id": "file_mode", "ok": mode_ok, "label": "Vault file mode 0600", "detail": mode.clone().unwrap_or_else(|| "n/a".into()) },
        { "id": "dir_mode", "ok": dir_ok, "label": "Data dir mode 0700", "detail": dir_mode.clone().unwrap_or_else(|| "n/a".into()) },
        { "id": "zeroize", "ok": true, "label": "Secret zeroize on drop", "detail": "passphrase + key material" },
        { "id": "list_mask", "ok": true, "label": "List never returns secrets", "detail": "reveal is explicit + audited" },
        { "id": "lockout", "ok": true, "label": "Unlock rate limit", "detail": format!("{} fails → {}s lockout", cfg.max_failed_unlocks, cfg.lockout_secs) },
        { "id": "session", "ok": true, "label": "Session TTL + idle lock", "detail": format!("ttl={}s idle={}s", cfg.ttl_secs, cfg.idle_secs) },
        { "id": "audit", "ok": true, "label": "Append-only audit log", "detail": st.store.audit_path().display().to_string() },
    ]);
    let passed = checks
        .as_array()
        .map(|a| a.iter().filter(|c| c["ok"].as_bool() == Some(true)).count())
        .unwrap_or(0);
    let total = checks.as_array().map(|a| a.len()).unwrap_or(0);
    let score = (passed * 100).checked_div(total).unwrap_or(0);
    Json(serde_json::json!({
        "score": score,
        "grade": if score >= 90 { "A" } else if score >= 75 { "B" } else if score >= 60 { "C" } else { "D" },
        "checks": checks,
        "unlocked": st.sessions.is_unlocked(),
        "exists": st.store.exists(),
        "failed_unlocks": st.sessions.failed_unlock_count(),
        "lockout_secs": st.sessions.is_locked_out(),
        "backend": "rust-argon2id-xchacha20poly1305",
        "version": st.version,
    }))
}

async fn session_info(State(st): State<AppState>, headers: HeaderMap) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    // validate token
    let (keys, providers, favs) = st.sessions.with_session(token, |p| {
        crate::session::SessionManager::stats_from_payload(p)
    })?;
    Ok(Json(serde_json::json!({
        "ok": true,
        "expires_at": st.sessions.expires_at().map(|t| t.to_rfc3339()),
        "remaining_secs": st.sessions.remaining_secs(),
        "key_count": keys,
        "provider_count": providers,
        "favorite_count": favs,
    })))
}

async fn session_touch(State(st): State<AppState>, headers: HeaderMap) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    let exp = st.sessions.touch(token)?;
    Ok(Json(serde_json::json!({
        "ok": true,
        "expires_at": exp.to_rfc3339(),
        "remaining_secs": st.sessions.remaining_secs(),
    })))
}

async fn audit_tail(
    State(st): State<AppState>,
    headers: HeaderMap,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    st.sessions.with_session(token, |_| ())?;
    let events = st.store.audit_tail(50);
    Ok(Json(serde_json::json!({ "ok": true, "events": events })))
}

#[derive(Deserialize)]
struct ChangePassBody {
    current_passphrase: String,
    new_passphrase: String,
}

async fn change_passphrase(
    State(st): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<ChangePassBody>,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    let new_pass = body.new_passphrase.trim().to_string();
    let old = body.current_passphrase.trim().to_string();
    if new_pass.len() < 12 {
        return Err(ApiError::Status(
            StatusCode::BAD_REQUEST,
            "new passphrase must be at least 12 characters".into(),
        ));
    }
    // Verify current passphrase matches session-held material, then re-encrypt.
    let ok = st.sessions.with_session_mut(token, |payload, pass| {
        if pass != old.as_str() {
            return Ok(false);
        }
        st.store.change_passphrase(&old, &new_pass, payload)?;
        Ok::<_, StoreError>(true)
    })??;
    if !ok {
        return Err(ApiError::Status(
            StatusCode::UNAUTHORIZED,
            "current passphrase incorrect".into(),
        ));
    }
    st.sessions.replace_passphrase(token, new_pass)?;
    info!(target: "zoth_vault", "passphrase rotated");
    Ok(Json(serde_json::json!({ "ok": true, "message": "passphrase updated" })))
}

#[derive(Deserialize)]
struct BulkDeleteBody {
    ids: Vec<String>,
}

async fn bulk_delete(
    State(st): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<BulkDeleteBody>,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    let mut removed = 0u32;
    st.sessions.with_session_mut(token, |payload, pass| {
        for id in &body.ids {
            if delete_key(payload, id).is_ok() {
                removed += 1;
                st.store.audit("key.delete", Some(id), "bulk");
            }
        }
        st.store.save(pass, payload)?;
        Ok::<_, StoreError>(removed)
    })??;
    Ok(Json(serde_json::json!({ "ok": true, "removed": removed })))
}

#[derive(Deserialize)]
struct PassBody {
    passphrase: String,
}

async fn vault_init(State(st): State<AppState>, Json(body): Json<PassBody>) -> ApiResult<Json<serde_json::Value>> {
    let pass = body.passphrase.trim();
    if pass.len() < 12 {
        return Err(ApiError::Status(
            StatusCode::BAD_REQUEST,
            "passphrase must be at least 12 characters".into(),
        ));
    }
    st.store.init(pass)?;
    info!(target: "zoth_vault", "vault initialized");
    Ok(Json(serde_json::json!({ "ok": true, "message": "vault created" })))
}

#[derive(Serialize)]
struct UnlockResp {
    ok: bool,
    session_token: String,
    expires_at: String,
    key_count: usize,
}

async fn vault_unlock(
    State(st): State<AppState>,
    Json(body): Json<PassBody>,
) -> ApiResult<Json<UnlockResp>> {
    if let Some(secs) = st.sessions.is_locked_out() {
        return Err(ApiError::Lockout(secs));
    }
    let pass = body.passphrase.trim().to_string();
    if pass.is_empty() {
        return Err(ApiError::Status(
            StatusCode::BAD_REQUEST,
            "passphrase required".into(),
        ));
    }
    match st.store.unlock(&pass) {
        Ok(payload) => {
            st.sessions.clear_failures();
            let count = payload.keys.len();
            let token = st.sessions.unlock(pass, payload);
            let exp = st
                .sessions
                .expires_at()
                .map(|t| t.to_rfc3339())
                .unwrap_or_default();
            info!(target: "zoth_vault", key_count = count, "vault unlocked");
            Ok(Json(UnlockResp {
                ok: true,
                session_token: token,
                expires_at: exp,
                key_count: count,
            }))
        }
        Err(e) => {
            st.sessions.record_failed_unlock();
            st.store.audit("vault.unlock_failed", None, "auth failed");
            Err(e.into())
        }
    }
}

async fn vault_lock(State(st): State<AppState>, headers: HeaderMap) -> ApiResult<Json<serde_json::Value>> {
    // Accept lock even with bad token — still clears if valid; always attempt lock
    if let Ok(token) = bearer(&headers) {
        let _ = st.sessions.with_session(token, |_| ());
    }
    st.sessions.lock();
    st.store.audit("vault.lock", None, "locked");
    info!(target: "zoth_vault", "vault locked");
    Ok(Json(serde_json::json!({ "ok": true })))
}

#[derive(Deserialize)]
struct WipeBody {
    passphrase: String,
    confirm: String,
}

async fn vault_wipe(State(st): State<AppState>, Json(body): Json<WipeBody>) -> ApiResult<Json<serde_json::Value>> {
    if body.confirm != "WIPE" {
        return Err(ApiError::Status(
            StatusCode::BAD_REQUEST,
            "confirm must be exactly WIPE".into(),
        ));
    }
    // Verify passphrase before destroy
    let _ = st.store.unlock(body.passphrase.trim())?;
    st.sessions.lock();
    st.store.wipe()?;
    info!(target: "zoth_vault", "vault wiped");
    Ok(Json(serde_json::json!({ "ok": true, "message": "vault destroyed" })))
}

async fn list_keys(State(st): State<AppState>, headers: HeaderMap) -> ApiResult<Json<Vec<KeyMeta>>> {
    let token = bearer(&headers)?;
    let list = st.sessions.with_session(token, |payload| {
        payload.keys.iter().map(KeyMeta::from).collect::<Vec<_>>()
    })?;
    Ok(Json(list))
}

#[derive(Serialize)]
struct KeyReveal {
    #[serde(flatten)]
    meta: KeyMeta,
    secret: String,
}

async fn get_key(
    State(st): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<String>,
) -> ApiResult<Json<KeyReveal>> {
    let token = bearer(&headers)?;
    let out = st.sessions.with_session_mut(token, |payload, _| {
        payload
            .keys
            .iter_mut()
            .find(|k| k.id == id)
            .map(|k| {
                k.last_used = Some(chrono::Utc::now().timestamp_millis());
                KeyReveal {
                    meta: KeyMeta::from(&*k),
                    secret: k.secret.clone(),
                }
            })
    })?;
    match out {
        Some(k) => {
            st.store.audit("key.reveal", Some(&id), "secret revealed");
            // Persist last_used — need passphrase via another call; deferred on next save
            Ok(Json(k))
        }
        None => Err(StoreError::KeyNotFound.into()),
    }
}

#[derive(Deserialize)]
struct KeyIn {
    #[serde(default)]
    id: Option<String>,
    provider: String,
    label: String,
    secret: String,
    #[serde(default)]
    tags: Vec<String>,
    #[serde(default)]
    favorite: bool,
    #[serde(default)]
    env: Option<String>,
    #[serde(default)]
    endpoint: Option<String>,
    #[serde(default)]
    notes: Option<String>,
}

async fn create_key(
    State(st): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<KeyIn>,
) -> ApiResult<(StatusCode, Json<KeyMeta>)> {
    let token = bearer(&headers)?;
    let had_id = body.id.as_ref().map(|s| !s.is_empty()).unwrap_or(false);
    let key = VaultKey {
        id: body.id.unwrap_or_default(),
        provider: body.provider,
        label: body.label,
        secret: body.secret,
        created: 0,
        tags: body.tags,
        favorite: body.favorite,
        env: body.env,
        endpoint: body.endpoint,
        notes: body.notes,
        last_used: None,
    };
    let saved = st.sessions.with_session_mut(token, |payload, pass| {
        let existed = had_id && payload.keys.iter().any(|k| k.id == key.id);
        let k = upsert_key(payload, key)?;
        st.store.save(pass, payload)?;
        st.store.audit(
            if existed { "key.update" } else { "key.create" },
            Some(&k.id),
            &k.label,
        );
        Ok::<_, StoreError>((k, existed))
    })??;
    let code = if saved.1 {
        StatusCode::OK
    } else {
        StatusCode::CREATED
    };
    Ok((code, Json(KeyMeta::from(&saved.0))))
}

async fn update_key(
    State(st): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<String>,
    Json(body): Json<KeyIn>,
) -> ApiResult<Json<KeyMeta>> {
    let token = bearer(&headers)?;
    let key = VaultKey {
        id,
        provider: body.provider,
        label: body.label,
        secret: body.secret,
        created: 0,
        tags: body.tags,
        favorite: body.favorite,
        env: body.env,
        endpoint: body.endpoint,
        notes: body.notes,
        last_used: None,
    };
    let saved = st.sessions.with_session_mut(token, |payload, pass| {
        if !payload.keys.iter().any(|k| k.id == key.id) {
            return Err(StoreError::KeyNotFound);
        }
        let k = upsert_key(payload, key)?;
        st.store.save(pass, payload)?;
        st.store.audit("key.update", Some(&k.id), &k.label);
        Ok(k)
    })??;
    Ok(Json(KeyMeta::from(&saved)))
}

async fn remove_key(
    State(st): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<String>,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    st.sessions.with_session_mut(token, |payload, pass| {
        delete_key(payload, &id)?;
        st.store.save(pass, payload)?;
        st.store.audit("key.delete", Some(&id), "removed");
        Ok::<_, StoreError>(())
    })??;
    Ok(Json(serde_json::json!({ "ok": true })))
}

async fn export_env_route(
    State(st): State<AppState>,
    headers: HeaderMap,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    let text = st.sessions.with_session(token, export_env)?;
    st.store.audit("export.env", None, "env exported");
    info!(target: "zoth_vault", "env export");
    Ok(Json(serde_json::json!({ "ok": true, "env": text })))
}

/// Portable encrypted backup. Body supplies a *new* export passphrase so the
/// backup can be restored on another machine without sharing the master vault
/// passphrase. Requires an unlocked session (Bearer). Response is a VaultBlob
/// (Argon2id + XChaCha20-Poly1305) re-encrypted via `crypto::encrypt_blob`.
#[derive(Deserialize)]
struct ExportJsonBody {
    export_passphrase: String,
}

async fn export_json_route(
    State(st): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<ExportJsonBody>,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    let export_pass = body.export_passphrase.trim().to_string();
    if export_pass.len() < 12 {
        return Err(ApiError::Status(
            StatusCode::BAD_REQUEST,
            "export_passphrase must be at least 12 characters".into(),
        ));
    }
    let blob = st.sessions.with_session_mut(token, |payload, _| {
        st.store.export_encrypted_blob(&export_pass, payload)
    })??;
    // Never log passphrase or ciphertext contents
    info!(target: "zoth_vault", "json portable export");
    Ok(Json(serde_json::json!({
        "ok": true,
        "format": "zoth-vault-blob-v1",
        "encrypted_under": "export_passphrase",
        "blob": blob,
    })))
}

#[derive(Deserialize)]
struct ImportBody {
    text: String,
}

async fn import_env_route(
    State(st): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<ImportBody>,
) -> ApiResult<Json<serde_json::Value>> {
    let token = bearer(&headers)?;
    let mut added = 0u32;
    st.sessions.with_session_mut(token, |payload, pass| {
        for line in body.text.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let Some((name, secret)) = line.split_once('=') else {
                continue;
            };
            let name = name.trim().trim_start_matches("export ");
            let secret = secret.trim().trim_matches('"').trim_matches('\'');
            if secret.is_empty() {
                continue;
            }
            let provider = guess_provider(name, secret);
            let label = name
                .to_lowercase()
                .trim_end_matches("_api_key")
                .trim_end_matches("_token")
                .trim_end_matches("_secret")
                .trim_end_matches("_key")
                .to_string();
            let key = VaultKey {
                id: String::new(),
                provider,
                label,
                secret: secret.to_string(),
                created: 0,
                tags: vec!["imported".into()],
                favorite: false,
                env: Some(name.to_uppercase()),
                endpoint: None,
                notes: None,
                last_used: None,
            };
            let _ = upsert_key(payload, key)?;
            added += 1;
        }
        st.store.save(pass, payload)?;
        st.store
            .audit("import.env", None, &format!("added={added}"));
        Ok::<_, StoreError>(added)
    })??;
    Ok(Json(serde_json::json!({ "ok": true, "added": added })))
}

fn guess_provider(env: &str, secret: &str) -> String {
    let e = env.to_uppercase();
    let s = secret;
    if s.starts_with("sk-ant-") {
        return "anthropic".into();
    }
    if s.starts_with("sk-or-") {
        return "openrouter".into();
    }
    if s.starts_with("gsk_") {
        return "groq".into();
    }
    if s.starts_with("sk_live_") || s.starts_with("sk_test_") {
        return "stripe".into();
    }
    if s.starts_with("hf_") {
        return "huggingface".into();
    }
    if s.starts_with("tvly-") {
        return "tavily".into();
    }
    if e.contains("OPENAI") {
        return "openai".into();
    }
    if e.contains("ANTHROPIC") {
        return "anthropic".into();
    }
    if e.contains("XAI") || e.contains("GROK") {
        return "xai".into();
    }
    if e.contains("GITHUB") {
        return "github".into();
    }
    "custom".into()
}
