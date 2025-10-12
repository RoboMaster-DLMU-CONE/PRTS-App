mod packet;
mod serial;
mod settings;

use settings::{get_settings, set_settings};

use packet::{
    generate_packet_code, load_packet_config, save_packet_config, save_temp_packet_config,
    validate_packet_config,
};
use serial::{close_serial_port, get_available_serial_port, open_serial_port, SerialPortManager};
use std::sync::Mutex;
use tauri::Manager;
#[derive(Default)]
struct AppState {
    port_manager: SerialPortManager,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            get_settings,
            set_settings,
            get_available_serial_port,
            open_serial_port,
            close_serial_port,
            save_packet_config,
            load_packet_config,
            generate_packet_code,
            validate_packet_config,
            save_temp_packet_config
        ])
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
