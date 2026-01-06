mod commands;
mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::crypto::get_content_hash,
            commands::clipboard::auto_paste,
            commands::system_setting::open_system_settings,
            commands::bookmark::save_favicon,
            commands::bookmark::get_favicon_base64,
            commands::splashscreen::close_splashscreen
        ])
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
