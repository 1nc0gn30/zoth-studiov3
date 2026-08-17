//! Zoth Vault Daemon — local-only secure BYOK backend.
//!
//! Security defaults (non-negotiable):
//! - Bind loopback only (127.0.0.1 / ::1) — never 0.0.0.0 unless --i-understand-network-risk
//! - Argon2id + XChaCha20-Poly1305 at rest
//! - Vault file mode 0600, data dir 0700
//! - Session tokens; auto-lock on idle/TTL
//! - Unlock rate limit / lockout
//! - Secrets never logged; list endpoints return masks only
//! - CORS restricted to localhost origins

mod api;
mod crypto;
mod session;
mod store;

use api::{router, AppState};
use clap::{Parser, Subcommand};
use session::{SessionConfig, SessionManager};
use store::VaultStore;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::path::PathBuf;
use std::sync::Arc;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{info, warn};
use tracing_subscriber::EnvFilter;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Parser, Debug)]
#[command(
    name = "zoth-vault-daemon",
    about = "Local-only secure BYOK vault for Zoth Studio",
    version = VERSION
)]
struct Cli {
    /// Listen port (loopback only)
    #[arg(long, env = "ZOTH_VAULT_PORT", default_value = "8787")]
    port: u16,

    /// Data directory for vault.zoth + audit.jsonl
    #[arg(long, env = "ZOTH_VAULT_DATA")]
    data_dir: Option<PathBuf>,

    /// Session hard TTL seconds
    #[arg(long, default_value = "900")]
    session_ttl: i64,

    /// Idle auto-lock seconds
    #[arg(long, default_value = "900")]
    idle_secs: i64,

    /// DANGEROUS: allow binding non-loopback. Off by default.
    #[arg(long, default_value_t = false)]
    i_understand_network_risk: bool,

    /// Bind address (only 127.0.0.1 / ::1 unless risk flag set)
    #[arg(long, default_value = "127.0.0.1")]
    bind: String,

    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand, Debug)]
enum Command {
    /// Offline check of vault file existence, size, and mode (no server, no secrets)
    Status {
        /// Data directory (defaults same as daemon)
        #[arg(long, env = "ZOTH_VAULT_DATA")]
        data_dir: Option<PathBuf>,
    },
}

fn default_data_dir() -> PathBuf {
    if let Some(proj) = directories::ProjectDirs::from("tech", "Zoth", "vault-daemon") {
        return proj.data_dir().to_path_buf();
    }
    PathBuf::from("./zoth-vault-data")
}

fn assert_loopback(bind: &str, allow_risk: bool) -> anyhow::Result<IpAddr> {
    let ip: IpAddr = bind.parse()?;
    if ip.is_loopback() {
        return Ok(ip);
    }
    if allow_risk {
        warn!("SECURITY: binding non-loopback {ip} — vault will be network-reachable");
        return Ok(ip);
    }
    anyhow::bail!(
        "refusing to bind non-loopback address {ip}. \
         Vault must stay on localhost. Pass --i-understand-network-risk only if you know what you are doing."
    );
}

fn localhost_cors() -> CorsLayer {
    // Browser vault on :8088 talking to daemon on :8787
    let origins = [
        "http://127.0.0.1:8088",
        "http://localhost:8088",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "null", // file:// sometimes
    ];
    CorsLayer::new()
        .allow_origin(AllowOrigin::predicate(move |origin, _| {
            let o = origin.as_bytes();
            origins.iter().any(|ok| o == ok.as_bytes())
                || o.starts_with(b"http://127.0.0.1:")
                || o.starts_with(b"http://localhost:")
                || o.starts_with(b"http://[::1]:")
        }))
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::PUT,
            axum::http::Method::DELETE,
            axum::http::Method::OPTIONS,
        ])
        .allow_headers([
            axum::http::header::AUTHORIZATION,
            axum::http::header::CONTENT_TYPE,
            axum::http::header::ACCEPT,
        ])
        .allow_credentials(false)
}

fn offline_status(data_dir: PathBuf) -> anyhow::Result<()> {
    let store = VaultStore::new(&data_dir)?;
    let exists = store.exists();
    let mode = store.vault_mode_octal();
    let dir_mode = store.data_dir_mode_octal();
    let bytes = store.vault_size_bytes();
    let report = serde_json::json!({
        "ok": true,
        "offline": true,
        "version": VERSION,
        "data_dir": data_dir.display().to_string(),
        "vault_path": store.path().display().to_string(),
        "exists": exists,
        "vault_mode": mode,
        "data_dir_mode": dir_mode,
        "vault_bytes": bytes,
        "audit_path": store.audit_path().display().to_string(),
        "mode_ok": mode.as_deref() == Some("600") || !exists,
        "dir_mode_ok": dir_mode.as_deref() == Some("700"),
    });
    println!("{}", serde_json::to_string_pretty(&report)?);
    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    // Offline subcommand — no tracing/server needed
    if let Some(Command::Status { data_dir }) = &cli.command {
        let dir = data_dir.clone().unwrap_or_else(default_data_dir);
        return offline_status(dir);
    }

    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info,tower_http=info")),
        )
        .with_target(true)
        .init();

    let ip = assert_loopback(&cli.bind, cli.i_understand_network_risk)?;
    let data_dir = cli.data_dir.unwrap_or_else(default_data_dir);

    let store = Arc::new(VaultStore::new(&data_dir)?);
    let sessions = Arc::new(SessionManager::new(SessionConfig {
        ttl_secs: cli.session_ttl,
        idle_secs: cli.idle_secs,
        ..SessionConfig::default()
    }));

    let state = AppState {
        store: store.clone(),
        sessions,
        version: VERSION,
    };

    let security_headers = axum::middleware::from_fn(
        |req: axum::extract::Request, next: axum::middleware::Next| async move {
            let mut res = next.run(req).await;
            let h = res.headers_mut();
            h.insert("X-Content-Type-Options", "nosniff".parse().unwrap());
            h.insert("X-Frame-Options", "DENY".parse().unwrap());
            h.insert("Referrer-Policy", "no-referrer".parse().unwrap());
            h.insert("Cache-Control", "no-store".parse().unwrap());
            h.insert(
                "X-Zoth-Vault",
                "local-only; argon2id; xchacha20poly1305".parse().unwrap(),
            );
            // Never cache secrets
            h.insert("Pragma", "no-cache".parse().unwrap());
            res
        },
    );

    let app = router(state)
        .layer(security_headers)
        .layer(TraceLayer::new_for_http())
        .layer(localhost_cors());

    let addr = SocketAddr::new(ip, cli.port);
    // Extra belt: if someone passes 0.0.0.0 via weird parse, force v4 loopback
    let addr = if addr.ip().is_unspecified() && !cli.i_understand_network_risk {
        SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), cli.port)
    } else {
        addr
    };

    info!(
        %addr,
        data = %data_dir.display(),
        vault_exists = store.exists(),
        "zoth-vault-daemon starting (loopback-only secure BYOK)"
    );
    info!("health: http://{addr}/health");
    info!("API base: http://{addr}/v1/");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    info!("shutdown complete — sessions zeroized on drop");
    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    info!("signal received — locking vault and exiting");
}
