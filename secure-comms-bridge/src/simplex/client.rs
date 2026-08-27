use crate::simplex::protocol::{SimpleXCommand, SimpleXEvent};
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::net::TcpStream;
use tokio::sync::{mpsc, Mutex};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message, MaybeTlsStream, WebSocketStream};
use tracing::{error, info, warn};
use uuid::Uuid;

pub struct SimpleXClient {
    ws_url: String,
    outbound_tx: mpsc::UnboundedSender<String>,
    inbound_rx: Arc<Mutex<mpsc::UnboundedReceiver<SimpleXEvent>>>,
}

impl SimpleXClient {
    pub async fn connect(ws_url: &str) -> Self {
        let (out_tx, mut out_rx) = mpsc::unbounded_channel::<String>();
        let (in_tx, in_rx) = mpsc::unbounded_channel::<SimpleXEvent>();
        let url_clone = ws_url.to_string();

        tokio::spawn(async move {
            loop {
                info!("[⚡ SimpleX WS] Connecting to headless daemon at {}", url_clone);
                match connect_async(&url_clone).await {
                    Ok((ws_stream, _)) => {
                        info!("[⚡ SimpleX WS] WebSocket connected successfully!");
                        let (mut write, mut read) = ws_stream.split();

                        // Write loop
                        let mut write_task = tokio::spawn(async move {
                            while let Some(msg) = out_rx.recv().await {
                                if let Err(e) = write.send(Message::Text(msg)).await {
                                    error!("[SimpleX WS] Write error: {}", e);
                                    break;
                                }
                            }
                        });

                        // Read loop
                        while let Some(msg_result) = read.next().await {
                            match msg_result {
                                Ok(Message::Text(text)) => {
                                    if let Ok(event) = serde_json::from_str::<SimpleXEvent>(&text) {
                                        let _ = in_tx.send(event);
                                    }
                                }
                                Ok(Message::Close(_)) => {
                                    warn!("[SimpleX WS] Daemon closed connection");
                                    break;
                                }
                                Err(e) => {
                                    error!("[SimpleX WS] Stream read error: {}", e);
                                    break;
                                }
                                _ => {}
                            }
                        }
                        write_task.abort();
                    }
                    Err(e) => {
                        warn!("[SimpleX WS] Failed to connect: {}. Retrying in 3s...", e);
                    }
                }
                tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
            }
        });

        Self {
            ws_url: ws_url.to_string(),
            outbound_tx: out_tx,
            inbound_rx: Arc::new(Mutex::new(in_rx)),
        }
    }

    pub async fn send_msg(&self, contact_id: &str, text: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let corr_id = Uuid::new_v4().to_string();
        let cmd = SimpleXCommand {
            corr_id,
            cmd: format!("@{} {}", contact_id, text),
        };
        let json_str = serde_json::to_string(&cmd)?;
        self.outbound_tx.send(json_str)?;
        Ok(())
    }

    pub fn get_inbound_receiver(&self) -> Arc<Mutex<mpsc::UnboundedReceiver<SimpleXEvent>>> {
        self.inbound_rx.clone()
    }
}
