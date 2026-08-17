//! In-memory unlock sessions. Passphrase held only while unlocked; zeroized on lock.
//! Session tokens are high-entropy; compared in constant time.

use crate::crypto::new_session_token;
use crate::store::VaultPayload;
use chrono::{DateTime, Duration, Utc};
use std::sync::Mutex;
use subtle::ConstantTimeEq;
use zeroize::Zeroize;

#[derive(Clone)]
pub struct SessionConfig {
    pub ttl_secs: i64,
    pub idle_secs: i64,
    pub max_failed_unlocks: u32,
    pub lockout_secs: i64,
}

impl Default for SessionConfig {
    fn default() -> Self {
        Self {
            ttl_secs: 15 * 60,
            idle_secs: 15 * 60,
            max_failed_unlocks: 5,
            lockout_secs: 60,
        }
    }
}

struct LiveSession {
    token: String,
    /// Master passphrase kept only for re-encrypt on save. Zeroized on lock.
    passphrase: String,
    payload: VaultPayload,
    created: DateTime<Utc>,
    last_active: DateTime<Utc>,
}

impl Drop for LiveSession {
    fn drop(&mut self) {
        self.passphrase.zeroize();
        self.token.zeroize();
        // Best-effort clear secrets in payload
        for k in &mut self.payload.keys {
            k.secret.zeroize();
        }
    }
}

pub struct SessionManager {
    cfg: SessionConfig,
    inner: Mutex<Inner>,
}

struct Inner {
    session: Option<LiveSession>,
    failed_unlocks: u32,
    lockout_until: Option<DateTime<Utc>>,
}

impl SessionManager {
    pub fn new(cfg: SessionConfig) -> Self {
        Self {
            cfg,
            inner: Mutex::new(Inner {
                session: None,
                failed_unlocks: 0,
                lockout_until: None,
            }),
        }
    }

    pub fn is_locked_out(&self) -> Option<i64> {
        let g = self.inner.lock().unwrap();
        if let Some(until) = g.lockout_until {
            let now = Utc::now();
            if until > now {
                return Some((until - now).num_seconds());
            }
        }
        None
    }

    pub fn record_failed_unlock(&self) {
        let mut g = self.inner.lock().unwrap();
        g.failed_unlocks += 1;
        if g.failed_unlocks >= self.cfg.max_failed_unlocks {
            g.lockout_until = Some(Utc::now() + Duration::seconds(self.cfg.lockout_secs));
            g.failed_unlocks = 0;
        }
    }

    pub fn clear_failures(&self) {
        let mut g = self.inner.lock().unwrap();
        g.failed_unlocks = 0;
        g.lockout_until = None;
    }

    pub fn unlock(&self, passphrase: String, payload: VaultPayload) -> String {
        let token = new_session_token();
        let now = Utc::now();
        let mut g = self.inner.lock().unwrap();
        // Drop previous session first (zeroizes)
        g.session = None;
        g.session = Some(LiveSession {
            token: token.clone(),
            passphrase,
            payload,
            created: now,
            last_active: now,
        });
        g.failed_unlocks = 0;
        g.lockout_until = None;
        token
    }

    pub fn lock(&self) {
        let mut g = self.inner.lock().unwrap();
        g.session = None;
    }

    pub fn is_unlocked(&self) -> bool {
        self.with_valid_session(|_| ()).is_some()
    }

    pub fn key_count(&self) -> Option<usize> {
        self.with_valid_session(|s| s.payload.keys.len())
    }

    pub fn expires_at(&self) -> Option<DateTime<Utc>> {
        self.with_valid_session(|s| {
            let hard = s.created + Duration::seconds(self.cfg.ttl_secs);
            let idle = s.last_active + Duration::seconds(self.cfg.idle_secs);
            hard.min(idle)
        })
    }

    pub fn remaining_secs(&self) -> Option<i64> {
        self.expires_at().map(|e| (e - Utc::now()).num_seconds().max(0))
    }

    pub fn config_snapshot(&self) -> SessionConfig {
        self.cfg.clone()
    }

    pub fn failed_unlock_count(&self) -> u32 {
        self.inner.lock().unwrap().failed_unlocks
    }

    /// Touch idle timer (explicit keep-alive).
    pub fn touch(&self, token: &str) -> Result<DateTime<Utc>, SessionError> {
        self.with_session_mut(token, |_, _| ())?;
        self.expires_at().ok_or(SessionError::Locked)
    }

    /// Replace passphrase held in session after rotation.
    pub fn replace_passphrase(&self, token: &str, new_pass: String) -> Result<(), SessionError> {
        let mut g = self.inner.lock().unwrap();
        Self::expire_if_needed(&mut g, &self.cfg);
        let sess = g.session.as_mut().ok_or(SessionError::Locked)?;
        if !ct_eq(&sess.token, token) {
            return Err(SessionError::InvalidToken);
        }
        sess.passphrase.zeroize();
        sess.passphrase = new_pass;
        sess.last_active = Utc::now();
        Ok(())
    }

    pub fn stats_from_payload(payload: &VaultPayload) -> (usize, usize, usize) {
        let keys = payload.keys.len();
        let providers: std::collections::HashSet<_> =
            payload.keys.iter().map(|k| k.provider.as_str()).collect();
        let favs = payload.keys.iter().filter(|k| k.favorite).count();
        (keys, providers.len(), favs)
    }

    /// Validate bearer token, refresh idle timer, run callback with session data.
    pub fn with_session_mut<F, T>(&self, token: &str, f: F) -> Result<T, SessionError>
    where
        F: FnOnce(&mut VaultPayload, &str) -> T,
    {
        let mut g = self.inner.lock().unwrap();
        Self::expire_if_needed(&mut g, &self.cfg);
        let sess = g.session.as_mut().ok_or(SessionError::Locked)?;
        if !ct_eq(&sess.token, token) {
            return Err(SessionError::InvalidToken);
        }
        sess.last_active = Utc::now();
        Ok(f(&mut sess.payload, &sess.passphrase))
    }

    pub fn with_session<F, T>(&self, token: &str, f: F) -> Result<T, SessionError>
    where
        F: FnOnce(&VaultPayload) -> T,
    {
        self.with_session_mut(token, |payload, _| f(payload))
    }

    fn with_valid_session<F, T>(&self, f: F) -> Option<T>
    where
        F: FnOnce(&LiveSession) -> T,
    {
        let mut g = self.inner.lock().unwrap();
        Self::expire_if_needed(&mut g, &self.cfg);
        g.session.as_ref().map(f)
    }

    fn expire_if_needed(inner: &mut Inner, cfg: &SessionConfig) {
        let now = Utc::now();
        let expired = match &inner.session {
            Some(s) => {
                let hard = s.created + Duration::seconds(cfg.ttl_secs);
                let idle = s.last_active + Duration::seconds(cfg.idle_secs);
                now >= hard || now >= idle
            }
            None => false,
        };
        if expired {
            inner.session = None;
        }
        if let Some(until) = inner.lockout_until {
            if now >= until {
                inner.lockout_until = None;
            }
        }
    }
}

fn ct_eq(a: &str, b: &str) -> bool {
    if a.len() != b.len() {
        return false;
    }
    a.as_bytes().ct_eq(b.as_bytes()).into()
}

#[derive(Debug, thiserror::Error)]
pub enum SessionError {
    #[error("vault is locked")]
    Locked,
    #[error("invalid session token")]
    InvalidToken,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::store::VaultPayload;

    fn mgr_with_lockout(max_fails: u32, lockout_secs: i64) -> SessionManager {
        SessionManager::new(SessionConfig {
            ttl_secs: 900,
            idle_secs: 900,
            max_failed_unlocks: max_fails,
            lockout_secs,
        })
    }

    #[test]
    fn lockout_after_max_failed_unlocks() {
        let mgr = mgr_with_lockout(3, 60);
        assert!(mgr.is_locked_out().is_none());
        assert_eq!(mgr.failed_unlock_count(), 0);

        mgr.record_failed_unlock();
        mgr.record_failed_unlock();
        assert!(mgr.is_locked_out().is_none());
        assert_eq!(mgr.failed_unlock_count(), 2);

        mgr.record_failed_unlock(); // 3rd → lockout, counter resets
        let secs = mgr.is_locked_out().expect("should be locked out");
        assert!(secs > 0 && secs <= 60);
        assert_eq!(mgr.failed_unlock_count(), 0);
    }

    #[test]
    fn clear_failures_removes_lockout() {
        let mgr = mgr_with_lockout(2, 120);
        mgr.record_failed_unlock();
        mgr.record_failed_unlock();
        assert!(mgr.is_locked_out().is_some());
        mgr.clear_failures();
        assert!(mgr.is_locked_out().is_none());
        assert_eq!(mgr.failed_unlock_count(), 0);
    }

    #[test]
    fn unlock_and_token_auth() {
        let mgr = SessionManager::new(SessionConfig::default());
        let token = mgr.unlock("test-passphrase!!".into(), VaultPayload::default());
        assert!(mgr.is_unlocked());
        assert_eq!(mgr.key_count(), Some(0));
        assert!(mgr.with_session(&token, |p| p.keys.is_empty()).unwrap());
        assert!(matches!(
            mgr.with_session("deadbeef", |_| ()),
            Err(SessionError::InvalidToken)
        ));
        mgr.lock();
        assert!(!mgr.is_unlocked());
        assert!(matches!(
            mgr.with_session(&token, |_| ()),
            Err(SessionError::Locked)
        ));
    }

    #[test]
    fn invalid_token_does_not_leak_session() {
        let mgr = SessionManager::new(SessionConfig::default());
        let _good = mgr.unlock("passphrase-here".into(), VaultPayload::default());
        // Wrong token of different length
        assert!(matches!(
            mgr.with_session("short", |_| "x"),
            Err(SessionError::InvalidToken)
        ));
    }
}
