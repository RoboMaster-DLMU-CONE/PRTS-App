use std::fs;
use std::path::PathBuf;

fn main() {
    // 获取目标平台的 triplet
    let target = std::env::var("TARGET").unwrap();

    // 根据平台复制二进制文件
    if target.contains("linux") {
        let src = PathBuf::from("binaries/linux/rplc");
        let dst = PathBuf::from(format!("binaries/linux/rplc-{}", target));
        if src.exists() && !dst.exists() {
            fs::copy(&src, &dst).unwrap_or_else(|e| {
                eprintln!(
                    "Warning: Failed to copy {} to {}: {}",
                    src.display(),
                    dst.display(),
                    e
                );
                0
            });
        }
    } else if target.contains("windows") {
        let src = PathBuf::from("binaries/windows/rplc.exe");
        let dst = PathBuf::from(format!("binaries/windows/rplc-{}.exe", target));
        if src.exists() && !dst.exists() {
            fs::copy(&src, &dst).unwrap_or_else(|e| {
                eprintln!(
                    "Warning: Failed to copy {} to {}: {}",
                    src.display(),
                    dst.display(),
                    e
                );
                0
            });
        }
    }

    tauri_build::build()
}
