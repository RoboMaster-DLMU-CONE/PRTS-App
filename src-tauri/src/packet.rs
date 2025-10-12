use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PacketField {
    pub name: String,
    #[serde(rename = "type")]
    pub field_type: String,
    pub comment: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PacketConfig {
    pub packet_name: String,
    pub command_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub namespace: Option<String>,
    #[serde(default = "default_packed")]
    pub packed: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub header_guard: Option<String>,
    pub fields: Vec<PacketField>,
}

#[derive(Debug, Deserialize)]
pub struct GenerateArgs {
    #[serde(alias = "configPath")]
    pub config_path: String,
    #[serde(alias = "outputDir")]
    pub output_dir: Option<String>,
    #[serde(alias = "targetFile")]
    pub target_file: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ValidateArgs {
    #[serde(alias = "configPath")]
    pub config_path: String,
}

#[derive(Debug, Deserialize)]
pub struct FilePathArg {
    #[serde(alias = "filePath")]
    pub file_path: String,
}

fn default_packed() -> bool {
    true
}

#[tauri::command]
pub async fn save_packet_config(config: PacketConfig, file: FilePathArg) -> Result<String, String> {
    let json = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    fs::write(&file.file_path, json).map_err(|e| format!("Failed to write config file: {}", e))?;

    Ok(format!("Config saved to: {}", file.file_path))
}

#[tauri::command]
pub async fn load_packet_config(file: FilePathArg) -> Result<PacketConfig, String> {
    let content = fs::read_to_string(&file.file_path)
        .map_err(|e| format!("Failed to read config file: {}", e))?;

    let config: PacketConfig =
        serde_json::from_str(&content).map_err(|e| format!("Failed to parse config: {}", e))?;

    Ok(config)
}

// Save to a temp directory and return the temp file path
#[tauri::command]
pub async fn save_temp_packet_config(config: PacketConfig) -> Result<String, String> {
    // base temp dir: <system tmp>/prts/rplc_configs
    let mut base = std::env::temp_dir();
    base.push("prts");
    base.push("rplc_configs");

    fs::create_dir_all(&base)
        .map_err(|e| format!("Failed to create temp directory {}: {}", base.display(), e))?;

    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| format!("Clock error: {}", e))?
        .as_secs();

    // sanitize packet name to be filesystem friendly
    let raw_name = if config.packet_name.trim().is_empty() {
        "packet"
    } else {
        &config.packet_name
    };
    let safe_name: String = raw_name
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '_' })
        .collect();

    let file_name = format!("{}-{}.json", safe_name, ts);
    let file_path = base.join(file_name);

    let json = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;

    fs::write(&file_path, json).map_err(|e| format!("Failed to write temp config: {}", e))?;

    Ok(file_path.to_string_lossy().to_string())
}

fn find_hpp_files(root: &Path, acc: &mut Vec<PathBuf>) -> std::io::Result<()> {
    for entry in fs::read_dir(root)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            find_hpp_files(&path, acc)?;
        } else if let Some(ext) = path.extension() {
            if ext == "hpp" || ext == "h" {
                acc.push(path);
            }
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn generate_packet_code(args: GenerateArgs) -> Result<String, String> {
    // Determine the rplc executable path based on the platform
    let os = std::env::consts::OS;

    let rplc_path = if os == "windows" {
        PathBuf::from("binaries/windows/rplc.exe")
    } else if os == "linux" {
        PathBuf::from("binaries/linux/rplc")
    } else {
        return Err(format!("Unsupported platform: {}", os));
    };

    if !rplc_path.exists() {
        return Err(format!(
            "RPLC executable not found at: {}",
            rplc_path.display()
        ));
    }

    // If a concrete target file is requested, we will generate into a temp dir and then move the file.
    if let Some(target) = args.target_file.clone() {
        // Prepare a unique temp dir
        let mut gen_dir = std::env::temp_dir();
        gen_dir.push("prts");
        gen_dir.push("rplc_gen");
        let ts = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| format!("Clock error: {}", e))?
            .as_millis();
        gen_dir.push(format!("gen-{}", ts));
        fs::create_dir_all(&gen_dir)
            .map_err(|e| format!("Failed to create temp gen dir {}: {}", gen_dir.display(), e))?;

        // Build command
        let output = Command::new(&rplc_path)
            .arg("generate")
            .arg(&args.config_path)
            .arg("--output")
            .arg(&gen_dir)
            .output()
            .map_err(|e| format!("Failed to execute rplc: {}", e))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            let stdout = String::from_utf8_lossy(&output.stdout);
            let detail = if !stderr.trim().is_empty() {
                stderr
            } else {
                stdout
            };
            return Err(format!("RPLC execution failed:\n{}", detail));
        }

        // Find generated header(s)
        let mut files = Vec::new();
        find_hpp_files(&gen_dir, &mut files)
            .map_err(|e| format!("Failed to scan generated files: {}", e))?;

        if files.is_empty() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            return Err(format!(
                "No header generated under {}. rplc output: {}",
                gen_dir.display(),
                stdout
            ));
        }

        // Prefer a file named after the packet_name if possible
        let preferred_name = {
            let content = fs::read_to_string(&args.config_path).unwrap_or_default();
            let mut name: Option<String> = None;
            if let Ok(val) = serde_json::from_str::<serde_json::Value>(&content) {
                name = val
                    .get("packet_name")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
            }
            name.map(|n| format!("{}.hpp", n))
        };

        let picked = if let Some(pref) = preferred_name {
            files
                .iter()
                .find(|p| p.file_name().map(|f| f == pref.as_str()).unwrap_or(false))
                .cloned()
                .unwrap_or_else(|| files[0].clone())
        } else {
            files[0].clone()
        };

        // Ensure target dir exists
        let target_path = PathBuf::from(&target);
        if let Some(parent) = target_path.parent() {
            fs::create_dir_all(parent).map_err(|e| {
                format!(
                    "Failed to create target directory {}: {}",
                    parent.display(),
                    e
                )
            })?;
        }

        if target_path.exists() {
            let _ = fs::remove_file(&target_path);
        }

        match fs::rename(&picked, &target_path) {
            Ok(_) => {}
            Err(_) => {
                fs::copy(&picked, &target_path)
                    .map_err(|e| format!("Failed to copy header to target: {}", e))?;
            }
        }

        return Ok(format!("Header saved to: {}", target_path.display()));
    }

    // Legacy behavior: allow specifying only an output directory
    let mut cmd = Command::new(&rplc_path);
    cmd.arg("generate").arg(&args.config_path);

    if let Some(dir) = args.output_dir {
        cmd.arg("--output").arg(dir);
    } else {
        return Err("Missing output: please provide either target_file or output_dir".to_string());
    }

    let output = cmd
        .output()
        .map_err(|e| format!("Failed to execute rplc: {}", e))?;

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        Ok(stdout.to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        let detail = if !stderr.trim().is_empty() {
            stderr
        } else {
            stdout
        };
        Err(format!("RPLC execution failed: {}", detail))
    }
}

#[tauri::command]
pub async fn validate_packet_config(args: ValidateArgs) -> Result<String, String> {
    let os = std::env::consts::OS;

    let rplc_path = if os == "windows" {
        PathBuf::from("binaries/windows/rplc.exe")
    } else if os == "linux" {
        PathBuf::from("binaries/linux/rplc")
    } else {
        return Err(format!("Unsupported platform: {}", os));
    };

    if !rplc_path.exists() {
        return Err(format!(
            "RPLC executable not found at: {}",
            rplc_path.display()
        ));
    }

    let output = Command::new(&rplc_path)
        .arg("validate")
        .arg(&args.config_path)
        .output()
        .map_err(|e| format!("Failed to execute rplc: {}", e))?;

    if output.status.success() {
        Ok("Configuration is valid".to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        let detail = if !stderr.trim().is_empty() {
            stderr
        } else {
            stdout
        };
        Err(format!("Validation failed:\n{}", detail))
    }
}
