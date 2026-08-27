//! Encrypted vault persistence. File mode 0600. Never logs secrets.

use crate::crypto::{decrypt_blob, encrypt_blob, VaultBlob};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::fs::{self, OpenOptions};
use std::io::Write;
#[cfg(unix)]
use std::os::unix::fs::{OpenOptionsExt, PermissionsExt};
use std::path::{Path, PathBuf};
use thiserror::Error;
use uuid::Uuid;
use zeroize::Zeroize;

#[derive(Debug, Error)]
pub enum StoreError {
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
    #[error("crypto: {0}")]
    Crypto(#[from] crate::crypto::CryptoError),
    #[error("json: {0}")]
    Json(#[from] serde_json::Error),
    #[error("vault does not exist — call init first")]
    NotFound,
    #[error("vault already exists")]
    AlreadyExists,
    #[error("key not found")]
    KeyNotFound,
    #[error("label and secret required")]
    InvalidKey,
    #[error("passphrase must be at least 12 characters")]
    PassphraseTooWeak,
}

/// One sealed credential. `secret` is only present while vault is unlocked in memory.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VaultKey {
    pub id: String,
    pub provider: String,
    pub label: String,
    pub secret: String,
    pub created: i64,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub favorite: bool,
    #[serde(default)]
    pub env: Option<String>,
    #[serde(default)]
    pub endpoint: Option<String>,
    #[serde(default)]
    pub notes: Option<String>,
    #[serde(default)]
    pub last_used: Option<i64>,
}

/// Metadata returned to clients without secret material.
#[derive(Debug, Clone, Serialize)]
pub struct KeyMeta {
    pub id: String,
    pub provider: String,
    pub label: String,
    pub created: i64,
    pub tags: Vec<String>,
    pub favorite: bool,
    pub env: Option<String>,
    pub endpoint: Option<String>,
    pub notes: Option<String>,
    pub last_used: Option<i64>,
    pub secret_preview: String,
}

impl From<&VaultKey> for KeyMeta {
    fn from(k: &VaultKey) -> Self {
        Self {
            id: k.id.clone(),
            provider: k.provider.clone(),
            label: k.label.clone(),
            created: k.created,
            tags: k.tags.clone(),
            favorite: k.favorite,
            env: k.env.clone(),
            endpoint: k.endpoint.clone(),
            notes: k.notes.clone(),
            last_used: k.last_used,
            secret_preview: mask_secret(&k.secret),
        }
    }
}

/// Mask a secret for list/meta responses. Never returns full secret material.
pub fn mask_secret(s: &str) -> String {
    if s.len() <= 8 {
        return "••••••••".into();
    }
    format!("{}••••{}", &s[..4.min(s.len())], &s[s.len().saturating_sub(4)..])
}

/// Derive a coarse audit category from a dotted action name (e.g. `key.create` → `key`).
pub fn audit_category(action: &str) -> &str {
    action.split('.').next().filter(|s| !s.is_empty()).unwrap_or("misc")
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct VaultPayload {
    pub keys: Vec<VaultKey>,
    #[serde(default)]
    pub meta: VaultMeta,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct VaultMeta {
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

pub struct VaultStore {
    path: PathBuf,
    audit_path: PathBuf,
}

impl VaultStore {
    pub fn new(data_dir: &Path) -> Result<Self, StoreError> {
        fs::create_dir_all(data_dir)?;
        // Restrict directory permissions on Unix
        #[cfg(unix)]
        {
            let mut perms = fs::metadata(data_dir)?.permissions();
            perms.set_mode(0o700);
            fs::set_permissions(data_dir, perms)?;
        }

        Ok(Self {
            path: data_dir.join("vault.zoth"),
            audit_path: data_dir.join("audit.jsonl"),
        })
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn exists(&self) -> bool {
        self.path.exists()
    }

    pub fn init(&self, passphrase: &str) -> Result<(), StoreError> {
        if self.exists() {
            return Err(StoreError::AlreadyExists);
        }
        let payload = VaultPayload {
            keys: vec![],
            meta: VaultMeta {
                created_at: Some(Utc::now()),
                updated_at: Some(Utc::now()),
            },
        };
        self.write_encrypted(passphrase, &payload)?;
        self.audit("vault.init", None, "created empty vault");
        Ok(())
    }

    pub fn unlock(&self, passphrase: &str) -> Result<VaultPayload, StoreError> {
        if !self.exists() {
            return Err(StoreError::NotFound);
        }
        let raw = fs::read_to_string(&self.path)?;
        let blob: VaultBlob = serde_json::from_str(&raw)?;
        let plain = decrypt_blob(passphrase, &blob)?;
        let payload: VaultPayload = serde_json::from_slice(&plain)?;
        // zeroize plaintext buffer
        let mut plain = plain;
        plain.zeroize();
        self.audit("vault.unlock", None, "ok");
        Ok(payload)
    }

    pub fn save(&self, passphrase: &str, payload: &VaultPayload) -> Result<(), StoreError> {
        let mut p = payload.clone();
        p.meta.updated_at = Some(Utc::now());
        self.write_encrypted(passphrase, &p)?;
        self.audit("vault.save", None, &format!("keys={}", p.keys.len()));
        Ok(())
    }

    fn write_encrypted(&self, passphrase: &str, payload: &VaultPayload) -> Result<(), StoreError> {
        let mut plain = serde_json::to_vec(payload)?;
        let blob = encrypt_blob(passphrase, &plain)?;
        plain.zeroize();

        let json = serde_json::to_vec_pretty(&blob)?;
        // Atomic-ish write: temp then rename
        let tmp = self.path.with_extension("tmp");
        {
            let mut opts = OpenOptions::new();
            opts.write(true).create(true).truncate(true);
            #[cfg(unix)]
            opts.mode(0o600);
            let mut f = opts.open(&tmp)?;
            f.write_all(&json)?;
            f.sync_all()?;
        }
        fs::rename(&tmp, &self.path)?;
        #[cfg(unix)]
        {
            let mut perms = fs::metadata(&self.path)?.permissions();
            perms.set_mode(0o600);
            fs::set_permissions(&self.path, perms)?;
        }
        Ok(())
    }

    pub fn wipe(&self) -> Result<(), StoreError> {
        if self.path.exists() {
            // Overwrite with zeros before unlink (best-effort)
            if let Ok(meta) = fs::metadata(&self.path) {
                let len = meta.len() as usize;
                let zeros = vec![0u8; len.min(1024 * 1024)];
                let _ = OpenOptions::new()
                    .write(true)
                    .open(&self.path)
                    .and_then(|mut f| f.write_all(&zeros));
            }
            fs::remove_file(&self.path)?;
        }
        self.audit("vault.wipe", None, "destroyed");
        Ok(())
    }

    /// Append-only audit log. Never includes secret values.
    /// Each event has a `category` derived from the action prefix (`vault.*`, `key.*`, `export.*`, …).
    pub fn audit(&self, action: &str, key_id: Option<&str>, detail: &str) {
        // Hard guard: refuse to write anything that looks like a secret payload.
        debug_assert!(
            !detail.contains("sk-") && !detail.contains("secret="),
            "audit detail must never contain secret material"
        );
        let line = serde_json::json!({
            "ts": Utc::now().to_rfc3339(),
            "category": audit_category(action),
            "action": action,
            "key_id": key_id,
            "detail": detail,
        });
        let mut opts = OpenOptions::new();
        opts.create(true).append(true);
        #[cfg(unix)]
        opts.mode(0o600);
        let _ = opts.open(&self.audit_path).and_then(|mut f| writeln!(f, "{line}"));
    }

    /// Export the unlocked payload as a portable encrypted VaultBlob under a
    /// *new* export passphrase (independent of the master vault passphrase).
    pub fn export_encrypted_blob(
        &self,
        export_passphrase: &str,
        payload: &VaultPayload,
    ) -> Result<VaultBlob, StoreError> {
        if export_passphrase.len() < 12 {
            return Err(StoreError::PassphraseTooWeak);
        }
        let mut plain = serde_json::to_vec(payload)?;
        let blob = encrypt_blob(export_passphrase, &plain)?;
        plain.zeroize();
        self.audit(
            "export.json",
            None,
            &format!("portable backup keys={}", payload.keys.len()),
        );
        Ok(blob)
    }

    pub fn audit_path(&self) -> &Path {
        &self.audit_path
    }

    /// Last N audit events (newest last). Never contains secrets.
    pub fn audit_tail(&self, limit: usize) -> Vec<serde_json::Value> {
        let Ok(raw) = fs::read_to_string(&self.audit_path) else {
            return vec![];
        };
        let lines: Vec<_> = raw.lines().filter(|l| !l.trim().is_empty()).collect();
        let start = lines.len().saturating_sub(limit.min(200));
        lines[start..]
            .iter()
            .filter_map(|l| serde_json::from_str(l).ok())
            .collect()
    }

    #[cfg(unix)]
    pub fn vault_mode_octal(&self) -> Option<String> {
        fs::metadata(&self.path)
            .ok()
            .map(|m| format!("{:o}", m.permissions().mode() & 0o777))
    }

    #[cfg(not(unix))]
    pub fn vault_mode_octal(&self) -> Option<String> {
        if self.path.exists() {
            Some("0600".to_string())
        } else {
            None
        }
    }

    #[cfg(unix)]
    pub fn data_dir_mode_octal(&self) -> Option<String> {
        self.path
            .parent()
            .and_then(|p| fs::metadata(p).ok())
            .map(|m| format!("{:o}", m.permissions().mode() & 0o777))
    }

    #[cfg(not(unix))]
    pub fn data_dir_mode_octal(&self) -> Option<String> {
        if self.path.parent().map(|p| p.exists()).unwrap_or(false) {
            Some("0700".to_string())
        } else {
            None
        }
    }

    pub fn vault_size_bytes(&self) -> Option<u64> {
        fs::metadata(&self.path).ok().map(|m| m.len())
    }

    /// Re-encrypt vault under a new passphrase (must be unlocked with old).
    pub fn change_passphrase(
        &self,
        old_pass: &str,
        new_pass: &str,
        payload: &VaultPayload,
    ) -> Result<(), StoreError> {
        // Verify old can still open
        let _ = self.unlock(old_pass)?;
        if new_pass.len() < 12 {
            return Err(StoreError::PassphraseTooWeak);
        }
        self.write_encrypted(new_pass, payload)?;
        self.audit("vault.change_passphrase", None, "master passphrase rotated");
        Ok(())
    }
}

pub fn new_key_id() -> String {
    Uuid::new_v4().to_string()
}

pub fn upsert_key(payload: &mut VaultPayload, mut key: VaultKey) -> Result<VaultKey, StoreError> {
    if key.label.trim().is_empty() || key.secret.trim().is_empty() {
        return Err(StoreError::InvalidKey);
    }
    if key.id.is_empty() {
        key.id = new_key_id();
        key.created = Utc::now().timestamp_millis();
        payload.keys.push(key.clone());
    } else if let Some(existing) = payload.keys.iter_mut().find(|k| k.id == key.id) {
        key.created = existing.created;
        *existing = key.clone();
    } else {
        if key.created == 0 {
            key.created = Utc::now().timestamp_millis();
        }
        payload.keys.push(key.clone());
    }
    Ok(key)
}

pub fn delete_key(payload: &mut VaultPayload, id: &str) -> Result<(), StoreError> {
    let before = payload.keys.len();
    payload.keys.retain(|k| k.id != id);
    if payload.keys.len() == before {
        return Err(StoreError::KeyNotFound);
    }
    Ok(())
}

pub fn export_env(payload: &VaultPayload) -> String {
    payload
        .keys
        .iter()
        .map(|k| {
            let env = k
                .env
                .clone()
                .unwrap_or_else(|| {
                    format!(
                        "{}_API_KEY",
                        k.label
                            .replace(|c: char| !c.is_ascii_alphanumeric(), "_")
                            .to_uppercase()
                    )
                });
            let mut block = format!("# {} ({})\n{}={}", k.label, k.provider, env, k.secret);
            if let Some(ep) = &k.endpoint {
                if !ep.is_empty() {
                    block.push_str(&format!(
                        "\n{}_BASE_URL={}",
                        env.trim_end_matches("_API_KEY").trim_end_matches("_TOKEN"),
                        ep
                    ));
                }
            }
            block
        })
        .collect::<Vec<_>>()
        .join("\n\n")
        + "\n"
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::crypto::decrypt_blob;

    fn temp_store() -> (PathBuf, VaultStore) {
        let dir = std::env::temp_dir().join(format!("zoth-vault-test-{}", Uuid::new_v4()));
        let store = VaultStore::new(&dir).expect("create store");
        (dir, store)
    }

    fn cleanup(dir: &Path) {
        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn mask_secret_short_and_long() {
        assert_eq!(mask_secret("short"), "••••••••");
        assert_eq!(mask_secret("12345678"), "••••••••");
        assert_eq!(mask_secret("sk-abcdefghijklmnop"), "sk-a••••mnop");
        // Never leaks middle of a long secret
        let masked = mask_secret("sk-live-super-secret-value-zzzz");
        assert!(masked.contains("••••"));
        assert!(!masked.contains("super-secret"));
        assert!(!masked.contains("live-super"));
    }

    #[test]
    fn audit_category_from_action() {
        assert_eq!(audit_category("vault.unlock"), "vault");
        assert_eq!(audit_category("key.reveal"), "key");
        assert_eq!(audit_category("export.json"), "export");
        assert_eq!(audit_category("import.env"), "import");
        assert_eq!(audit_category(""), "misc");
    }

    #[test]
    fn store_roundtrip_via_temp_dir() {
        let (dir, store) = temp_store();
        let pass = "correct horse battery staple!!";
        store.init(pass).expect("init");
        assert!(store.exists());
        assert_eq!(store.vault_mode_octal().as_deref(), Some("600"));

        let mut payload = store.unlock(pass).expect("unlock empty");
        assert!(payload.keys.is_empty());

        let key = VaultKey {
            id: String::new(),
            provider: "openai".into(),
            label: "demo".into(),
            secret: "sk-test-not-a-real-secret-xyz".into(),
            created: 0,
            tags: vec!["unit".into()],
            favorite: true,
            env: Some("OPENAI_API_KEY".into()),
            endpoint: None,
            notes: Some("test note".into()),
            last_used: None,
        };
        let saved = upsert_key(&mut payload, key).expect("upsert");
        store.save(pass, &payload).expect("save");

        let reopened = store.unlock(pass).expect("re-unlock");
        assert_eq!(reopened.keys.len(), 1);
        assert_eq!(reopened.keys[0].id, saved.id);
        assert_eq!(reopened.keys[0].secret, "sk-test-not-a-real-secret-xyz");
        assert_eq!(reopened.keys[0].provider, "openai");
        assert!(reopened.keys[0].favorite);

        // Wrong passphrase fails without leaking
        assert!(store.unlock("wrong passphrase!!").is_err());

        // Portable export under a different passphrase
        let export_pass = "export backup pass!!";
        let blob = store
            .export_encrypted_blob(export_pass, &reopened)
            .expect("export blob");
        let plain = decrypt_blob(export_pass, &blob).expect("decrypt export");
        let restored: VaultPayload = serde_json::from_slice(&plain).expect("json");
        assert_eq!(restored.keys[0].secret, "sk-test-not-a-real-secret-xyz");
        assert!(decrypt_blob(pass, &blob).is_err()); // master pass must not open export

        // Audit must not contain secret material
        let events = store.audit_tail(50);
        assert!(!events.is_empty());
        for ev in &events {
            let s = ev.to_string();
            assert!(!s.contains("sk-test-not-a-real-secret-xyz"), "audit leaked secret: {s}");
            assert!(ev.get("category").is_some(), "missing category: {s}");
        }

        store.wipe().expect("wipe");
        assert!(!store.exists());
        cleanup(&dir);
    }
}
