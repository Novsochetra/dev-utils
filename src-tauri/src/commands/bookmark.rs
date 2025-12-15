use tauri::AppHandle;

#[tauri::command]
pub async fn save_favicon(app: AppHandle, url: String) -> Result<String, String> {
    let url = if url.starts_with("http") {
        url
    } else {
        format!("https://{}", url)
    };
    let icon_path = crate::services::favicon::fetch_and_store_favicon(&app, &url)
        .await
        .ok_or("Failed to fetch favicon")?;

    Ok(icon_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn get_favicon_base64(path: String) -> Result<String, String> {
    let bytes: Vec<u8> = std::fs::read(&path).map_err(|e| e.to_string())?;
    Ok(base64::encode(&bytes))
}
