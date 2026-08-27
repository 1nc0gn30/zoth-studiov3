use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SimpleXCommand {
    #[serde(rename = "corrId")]
    pub corr_id: String,
    pub cmd: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum SimpleXEvent {
    #[serde(rename = "NewChatItems")]
    NewChatItems {
        chat: SimpleXChatInfo,
        items: Vec<SimpleXChatItem>,
    },
    #[serde(rename = "ContactConnected")]
    ContactConnected {
        contact: SimpleXContactInfo,
    },
    #[serde(other)]
    Unknown,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SimpleXChatInfo {
    #[serde(rename = "chatId")]
    pub chat_id: Option<i64>,
    #[serde(rename = "contactId")]
    pub contact_id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SimpleXChatItem {
    #[serde(rename = "itemId")]
    pub item_id: Option<i64>,
    pub text: Option<String>,
    #[serde(rename = "fileContent")]
    pub file_content: Option<String>,
    #[serde(rename = "chatDir")]
    pub chat_dir: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SimpleXContactInfo {
    #[serde(rename = "contactId")]
    pub contact_id: String,
    #[serde(rename = "localAlias")]
    pub local_alias: Option<String>,
    #[serde(rename = "connReqContact")]
    pub conn_req_contact: Option<String>,
}
