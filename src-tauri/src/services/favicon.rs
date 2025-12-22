use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

use reqwest::Client;
use scraper::{Html, Selector};
use sha2::{Digest, Sha256};
use url::Url;

use crate::services::app_dirs::ensure_app_dirs;
use tauri::AppHandle;

/// Fetch favicon for a URL and save locally.
/// Returns Some(path) if successful, None otherwise.
pub async fn fetch_and_store_favicon(app: &AppHandle, raw_url: &str) -> Option<PathBuf> {
    // Normalize URL
    let url = if raw_url.starts_with("http") {
        raw_url.to_string()
    } else {
        format!("https://{}", raw_url)
    };
    let parsed_url = Url::parse(&url).ok()?;
    let base_url = format!("{}://{}", parsed_url.scheme(), parsed_url.host_str()?);

    // Ensure app directories
    let app_dir = ensure_app_dirs(app).ok()?;

    let icons_dir = app_dir
        .join("mini-apps")
        .join("clipboard-manager")
        .join("assets")
        .join("cache")
        .join("icons");

    std::fs::create_dir_all(&icons_dir).ok()?;

    // 1️⃣ Try /favicon.ico first
    let mut favicon_paths = vec![parsed_url.join("/favicon.ico").ok()?];

    // 2️⃣ Fetch HTML and parse <link rel="icon"> as fallback
    let client = Client::new();
    if let Ok(resp) = client
        .get(base_url.clone())
        .header("User-Agent", "Mozilla/5.0 (Tauri)")
        .send()
        .await
    {
        if let Ok(html) = resp.text().await {
            let document = Html::parse_document(&html);
            let selector =
                Selector::parse(r#"link[rel="icon"], link[rel="shortcut icon"]"#).unwrap();

            for element in document.select(&selector) {
                if let Some(href) = element.value().attr("href") {
                    if let Ok(full_url) = parsed_url.join(href) {
                        favicon_paths.push(full_url);
                    }
                }
            }
        }
    }

    // 3️⃣ Try each candidate until successful
    for icon_url in favicon_paths {
        let icon_url_str = icon_url.as_str();
        let hash = format!("{:x}", Sha256::digest(icon_url_str.as_bytes()));
        let icon_path = icons_dir.join(format!("{}.ico", hash));

        if icon_path.exists() {
            return Some(icon_path);
        }

        if let Ok(resp) = client
            .get(icon_url_str)
            .header("User-Agent", "Mozilla/5.0 (Tauri)")
            .send()
            .await
        {
            if resp.status().is_success() {
                if let Ok(bytes) = resp.bytes().await {
                    if let Ok(mut file) = File::create(&icon_path) {
                        let _ = file.write_all(&bytes);
                        return Some(icon_path);
                    }
                }
            }
        }
    }

    // Failed to fetch any favicon
    None
}
