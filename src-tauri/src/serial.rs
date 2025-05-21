use std::time::Duration;
use thiserror::Error;

use crate::serial::SerialError::MutexError;
use crate::AppState;
use serialport::SerialPort;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::State;

pub struct SerialPortManager {
    ports: HashMap<String, Box<dyn SerialPort + Send>>,
}

impl SerialPortManager {
    pub fn new() -> Self {
        Self {
            ports: HashMap::new(),
        }
    }
    pub fn add_port(&mut self, name: String, port: Box<dyn SerialPort + Send>) {
        self.ports.insert(name, port);
    }

    pub fn remove_port(&mut self, name: &str) {
        self.ports.remove(name);
    }

    pub fn has_port(&self, name: &str) -> bool {
        self.ports.contains_key(name)
    }
}

impl Default for SerialPortManager {
    fn default() -> Self {
        Self::new()
    }
}

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

    #[error("无法获取串口管理器锁")]
    MutexError(String),

    #[error("无法找到指定的串口")]
    FindPortError,
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
pub fn open_serial_port(
    state: State<'_, Mutex<AppState>>,
    name: String,
    baud: u32,
) -> Result<(), String> {
    let serial_port = match serialport::new(&name, baud)
        .timeout(Duration::from_millis(100))
        .open()
    {
        Ok(port) => port,
        Err(e) => {
            return Err(SerialError::OpenError {
                port: name,
                source: e,
            }
            .to_string())
        }
    };
    let manager = &mut state.lock().map_err(|e| e.to_string())?.port_manager;
    manager.add_port(name, serial_port);
    Ok(())
}

#[tauri::command]
pub fn close_serial_port(state: State<'_, Mutex<AppState>>, name: String) -> Result<(), String> {
    let manager = &mut state
        .lock()
        .map_err(|e| MutexError(e.to_string()).to_string())?
        .port_manager;
    if manager.has_port(&name) {
        manager.remove_port(&name);
        Ok(())
    } else {
        Err(SerialError::FindPortError.to_string())
    }
}
