use sha2::{Sha256, Digest};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(
            tauri::generate_handler![get_content_hash]
        )
        .plugin(tauri_plugin_clipboard::init())
        // .plugin(tauri_plugin_prevent_default::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn get_content_hash(content: String) -> String {
    // 1. Create a new hasher instance.
    let mut hasher = Sha256::new();

    // 2. Feed the content data to the hasher.
    // We convert the String content into a byte array slice.
    hasher.update(content.as_bytes());

    // 3. Finalize the hash computation.
    // `finalize()` consumes the hasher and produces the result (a 32-byte array for SHA-256).
    let hash_result = hasher.finalize();

    // 4. Convert the binary hash result into a hexadecimal string.
    // This is the clean, readable, fixed-length string (64 characters) we'll use as the key.
    hex::encode(hash_result)
}
