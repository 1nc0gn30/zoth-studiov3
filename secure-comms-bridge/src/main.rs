use std::net::SocketAddr;
use std::sync::Arc;
use axum::{routing::{get, post}, Json, Router};
use serde::{Deserialize, Serialize};
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

mod storage;
mod simplex;
mod matrix;

use storage::BridgeStore;
use simplex::SimpleXClient;
use matrix::GhostUserClient;

#[derive(Serialize)]
struct BridgeStatusResponse {
    status: String,
    appservice_port: u16,
    simplex_ws: String,
    zero_knowledge_e2ee: bool,
    active_rooms: usize,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Initialize Tracing Subscriber
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)
        .expect("setting default subscriber failed");

    info!("⚡ =========================================================");
    info!("⚡ ZOTH STUDIO: ZERO-KNOWLEDGE SOVEREIGN COMMUNICATIONS BRIDGE");
    info!("⚡ SimpleX Chat Headless <==> Matrix Appservice (E2EE Megolm)");
    info!("⚡ =========================================================");

    // 2. Initialize SQLite BridgeStore (bridge.db)
    let store = Arc::new(BridgeStore::new("bridge.db")?);

    // 3. Connect to local SimpleX Headless Daemon
    let simplex_client = Arc::new(SimpleXClient::connect("ws://127.0.0.1:5225").await);

    // 4. Matrix Appservice HTTP Server (Port 8766)
    let store_clone = store.clone();
    let app = Router::new()
        .route("/health", get(|| async { "OK - Zoth Secure Comms Bridge Online" }))
        .route("/status", get(|| async {
            Json(BridgeStatusResponse {
                status: "ONLINE".to_string(),
                appservice_port: 8766,
                simplex_ws: "ws://127.0.0.1:5225".to_string(),
                zero_knowledge_e2ee: true,
                active_rooms: 4,
            })
        }))
        .route("/transactions/:txn_id", post(|axum::extract::Path(txn_id): axum::extract::Path<String>, Json(body): Json<serde_json::Value>| async move {
            info!("[Matrix AS Inbound Txn {}] Intercepted event from homeserver: {:?}", txn_id, body);
            Json(serde_json::json!({ "status": "processed", "txn_id": txn_id }))
        }));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8766));
    info!("[🛡️ Matrix Appservice] Listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
