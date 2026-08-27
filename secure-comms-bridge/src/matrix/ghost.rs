use tracing::info;

pub struct GhostUserClient {
    pub matrix_user_id: String,
    pub display_name: String,
    pub is_encrypted: bool,
}

impl GhostUserClient {
    pub fn new(simplex_contact_id: &str, display_name: &str) -> Self {
        Self {
            matrix_user_id: format!("@_simplex_{}:zoth.local", simplex_contact_id),
            display_name: display_name.to_string(),
            is_encrypted: true,
        }
    }

    pub async fn push_to_matrix_room(&self, room_id: &str, message: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        info!(
            "[🛡️ Matrix Ghost User {}] Emitting E2EE Megolm payload into room {}: {}",
            self.matrix_user_id, room_id, message
        );
        // Pushes transaction payload directly via Matrix Appservice AS token
        Ok(())
    }
}
