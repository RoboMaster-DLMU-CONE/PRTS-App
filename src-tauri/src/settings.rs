use serde::{Deserialize, Serialize};
use confy;

#[derive(Serialize, Deserialize, Debug)]
pub struct Settings {
    pub theme: String,
    pub show_hero: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            theme: "nord".into(),
            show_hero: true,
        }
    }
}
#[tauri::command]
pub fn get_settings()-> Result<Settings, String>{
    confy::load("prts_app",None).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_settings(new: Settings) -> Result<(), String>{
    confy::store("prts_app",None, &new).map_err(|e| e.to_string())
}