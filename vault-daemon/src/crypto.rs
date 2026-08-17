//! Cryptographic primitives for the vault.
//!
//! - KDF: Argon2id (memory-hard, OWASP-recommended parameters)
//! - AEAD: XChaCha20-Poly1305 (256-bit key, 192-bit nonce — safe random nonces)
//! - Secrets zeroized on drop

use argon2::{
    password_hash::{PasswordHasher, SaltString},
    Algorithm, Argon2, Params, Version,
};
use base64::{engine::general_purpose::STANDARD as B64, Engine};
use chacha20poly1305::{
    aead::{Aead, KeyInit, Payload},
    XChaCha20Poly1305, XNonce,
};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use zeroize::{Zeroize, ZeroizeOnDrop};

/// OWASP 2023-ish interactive Argon2id baseline (tunable via config later).
/// m=64 MiB, t=3, p=1 — slow enough to punish brute force on a laptop.
const ARGON2_M_KIB: u32 = 64 * 1024;
const ARGON2_T: u32 = 3;
const ARGON2_P: u32 = 1;
const SALT_LEN: usize = 16;
const NONCE_LEN: usize = 24;
const KEY_LEN: usize = 32;

#[derive(Debug, Error)]
pub enum CryptoError {
    #[error("argon2 failed: {0}")]
    Argon2(String),
    #[error("encryption failed")]
    Encrypt,
    #[error("decryption failed (wrong passphrase or corrupted data)")]
    Decrypt,
    #[error("invalid packed vault blob")]
    InvalidBlob,
}

/// In-memory master key material — zeroized on drop.
#[derive(Clone, Zeroize, ZeroizeOnDrop)]
pub struct MasterKey {
    bytes: [u8; KEY_LEN],
}

impl MasterKey {
    pub fn as_bytes(&self) -> &[u8; KEY_LEN] {
        &self.bytes
    }
}

/// On-disk envelope (public JSON). Secrets only live inside `ciphertext`.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VaultBlob {
    pub v: u8,
    pub kdf: String,
    pub aead: String,
    pub salt_b64: String,
    pub nonce_b64: String,
    pub ciphertext_b64: String,
    /// Argon2 params for reproducibility / future upgrades.
    pub argon2_m_kib: u32,
    pub argon2_t: u32,
    pub argon2_p: u32,
}

fn argon2_instance(m_kib: u32, t: u32, p: u32) -> Result<Argon2<'static>, CryptoError> {
    let params = Params::new(m_kib, t, p, Some(KEY_LEN))
        .map_err(|e| CryptoError::Argon2(e.to_string()))?;
    Ok(Argon2::new(Algorithm::Argon2id, Version::V0x13, params))
}

/// Derive a 32-byte master key from passphrase + salt.
pub fn derive_key(
    passphrase: &str,
    salt: &[u8],
    m_kib: u32,
    t: u32,
    p: u32,
) -> Result<MasterKey, CryptoError> {
    let argon2 = argon2_instance(m_kib, t, p)?;
    let mut bytes = [0u8; KEY_LEN];
    argon2
        .hash_password_into(passphrase.as_bytes(), salt, &mut bytes)
        .map_err(|e| CryptoError::Argon2(e.to_string()))?;
    Ok(MasterKey { bytes })
}

/// Hash passphrase for verifier storage (PHC string) — optional secondary check.
/// We primarily rely on AEAD open failure for auth.
#[allow(dead_code)]
pub fn hash_passphrase_phc(passphrase: &str) -> Result<String, CryptoError> {
    let salt = SaltString::generate(&mut rand::thread_rng());
    let argon2 = argon2_instance(ARGON2_M_KIB, ARGON2_T, ARGON2_P)?;
    let hash = argon2
        .hash_password(passphrase.as_bytes(), &salt)
        .map_err(|e| CryptoError::Argon2(e.to_string()))?;
    Ok(hash.to_string())
}

pub fn encrypt_blob(passphrase: &str, plaintext: &[u8]) -> Result<VaultBlob, CryptoError> {
    let mut salt = [0u8; SALT_LEN];
    let mut nonce = [0u8; NONCE_LEN];
    rand::thread_rng().fill_bytes(&mut salt);
    rand::thread_rng().fill_bytes(&mut nonce);

    let key = derive_key(passphrase, &salt, ARGON2_M_KIB, ARGON2_T, ARGON2_P)?;
    let cipher = XChaCha20Poly1305::new_from_slice(key.as_bytes()).map_err(|_| CryptoError::Encrypt)?;
    let xnonce = XNonce::from_slice(&nonce);
    // AAD binds version/alg so blob can't be silently re-labeled
    let aad = b"zoth-vault-v1|xchacha20poly1305|argon2id";
    let ciphertext = cipher
        .encrypt(
            xnonce,
            Payload {
                msg: plaintext,
                aad,
            },
        )
        .map_err(|_| CryptoError::Encrypt)?;

    Ok(VaultBlob {
        v: 1,
        kdf: "argon2id".into(),
        aead: "xchacha20poly1305".into(),
        salt_b64: B64.encode(salt),
        nonce_b64: B64.encode(nonce),
        ciphertext_b64: B64.encode(ciphertext),
        argon2_m_kib: ARGON2_M_KIB,
        argon2_t: ARGON2_T,
        argon2_p: ARGON2_P,
    })
}

pub fn decrypt_blob(passphrase: &str, blob: &VaultBlob) -> Result<Vec<u8>, CryptoError> {
    if blob.v != 1 || blob.kdf != "argon2id" || blob.aead != "xchacha20poly1305" {
        return Err(CryptoError::InvalidBlob);
    }
    let salt = B64
        .decode(&blob.salt_b64)
        .map_err(|_| CryptoError::InvalidBlob)?;
    let nonce = B64
        .decode(&blob.nonce_b64)
        .map_err(|_| CryptoError::InvalidBlob)?;
    let ciphertext = B64
        .decode(&blob.ciphertext_b64)
        .map_err(|_| CryptoError::InvalidBlob)?;
    if nonce.len() != NONCE_LEN {
        return Err(CryptoError::InvalidBlob);
    }

    let key = derive_key(
        passphrase,
        &salt,
        blob.argon2_m_kib,
        blob.argon2_t,
        blob.argon2_p,
    )?;
    let cipher = XChaCha20Poly1305::new_from_slice(key.as_bytes()).map_err(|_| CryptoError::Decrypt)?;
    let xnonce = XNonce::from_slice(&nonce);
    let aad = b"zoth-vault-v1|xchacha20poly1305|argon2id";
    cipher
        .decrypt(
            xnonce,
            Payload {
                msg: &ciphertext,
                aad,
            },
        )
        .map_err(|_| CryptoError::Decrypt)
}

/// Constant-time-ish random session token (32 bytes → hex).
pub fn new_session_token() -> String {
    let mut buf = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut buf);
    let s = hex::encode(buf);
    buf.zeroize();
    s
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn roundtrip() {
        let plain = br#"{"keys":[{"id":"1","secret":"sk-test"}]}"#;
        let blob = encrypt_blob("correct horse battery staple!!", plain).unwrap();
        let out = decrypt_blob("correct horse battery staple!!", &blob).unwrap();
        assert_eq!(out, plain);
        assert!(decrypt_blob("wrong passphrase!!!!!!", &blob).is_err());
    }
}
