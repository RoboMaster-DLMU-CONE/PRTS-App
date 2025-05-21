mod serial;
mod settings;

use settings::{get_settings, set_settings};

use serial::{get_available_serial_port, open_serial_port};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_settings, set_settings])
        .invoke_handler(tauri::generate_handler![
            get_available_serial_port,
            open_serial_port
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
