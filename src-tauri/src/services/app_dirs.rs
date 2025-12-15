use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[allow(dead_code)]
pub fn ensure_app_dirs(app: &AppHandle) -> Result<PathBuf, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|_e| format!("Failed to resolve app data dir"))?;

    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

    let icons_dir = app_dir.join("icons");
    fs::create_dir_all(&icons_dir).map_err(|e| e.to_string())?;

    Ok(app_dir)
}
