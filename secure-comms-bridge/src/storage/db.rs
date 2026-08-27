use rusqlite::{params, Connection, Result};
use std::sync::{Arc, Mutex};
use tracing::info;

#[derive(Clone)]
pub struct BridgeStore {
    conn: Arc<Mutex<Connection>>,
}

impl BridgeStore {
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        
        // Initialize schema for Matrix Room <-> SimpleX Connection mapping & Ghost User credentials
        conn.execute(
            "CREATE TABLE IF NOT EXISTS room_mappings (
                matrix_room_id TEXT PRIMARY KEY,
                simplex_connection_id TEXT NOT NULL UNIQUE,
                simplex_contact_name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS ghost_users (
                simplex_contact_id TEXT PRIMARY KEY,
                matrix_user_id TEXT NOT NULL UNIQUE,
                display_name TEXT,
                avatar_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS message_dedup (
                event_id TEXT PRIMARY KEY,
                source_protocol TEXT NOT NULL,
                processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            [],
        )?;

        info!("[🔐 BridgeStore] SQLite schema initialized at {}", db_path);
        Ok(Self {
            conn: Arc::new(Mutex::new(conn)),
        })
    }

    pub fn map_room(&self, matrix_room_id: &str, simplex_connection_id: &str, contact_name: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO room_mappings (matrix_room_id, simplex_connection_id, simplex_contact_name)
             VALUES (?1, ?2, ?3)",
            params![matrix_room_id, simplex_connection_id, contact_name],
        )?;
        Ok(())
    }

    pub fn get_simplex_conn(&self, matrix_room_id: &str) -> Result<Option<String>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT simplex_connection_id FROM room_mappings WHERE matrix_room_id = ?1")?;
        let mut rows = stmt.query(params![matrix_room_id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(row.get(0)?))
        } else {
            Ok(None)
        }
    }

    pub fn get_matrix_room(&self, simplex_connection_id: &str) -> Result<Option<String>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT matrix_room_id FROM room_mappings WHERE simplex_connection_id = ?1")?;
        let mut rows = stmt.query(params![simplex_connection_id])?;
        if let Some(row) = rows.next()? {
            Ok(Some(row.get(0)?))
        } else {
            Ok(None)
        }
    }
}
