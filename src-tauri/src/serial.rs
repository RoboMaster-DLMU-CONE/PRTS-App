use std::time::Duration;
use thiserror::Error;
#[derive(Error, Debug)]
pub enum SerialError {
    #[error("读取串口列表失败：{0}")]
    ListError(#[from] serialport::Error),

    #[error("打开串口 {port} 失败：{source}")]
    OpenError {
        port: String,
        #[source]
        source: serialport::Error,
    },
}

#[tauri::command]
pub fn get_available_serial_port() -> Result<Vec<String>, String> {
    let ports = serialport::available_ports();
    match ports {
        Ok(ports) => Ok(ports.iter().map(|port| port.port_name.clone()).collect()),
        Err(e) => Err(SerialError::ListError(e).to_string()),
    }
}

#[tauri::command]
pub fn open_serial_port(port: String, baud: u32) -> Result<(), String> {
    match serialport::new(&port, baud)
        .timeout(Duration::from_millis(100))
        .open()
    {
        Ok(_) => Ok(()),
        Err(e) => Err(SerialError::OpenError { port, source: e }.to_string()),
    }
}
