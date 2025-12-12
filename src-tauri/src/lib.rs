use sha2::{Sha256, Digest};
use enigo::{
    Direction::{Click, Press, Release},
    Enigo, Key, Keyboard, Settings,
};
use std::process::Command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(
            tauri::generate_handler![get_content_hash, auto_paste, open_system_settings]
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



/// Simulates the system-specific "Paste" key combination (Ctrl+V or Cmd+V).
#[tauri::command]
fn auto_paste(window: tauri::Window) -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default())
        .map_err(|e| format!("Enigo Initialization Error (Permission Issue?): {}", e))?;

    window.hide().map_err(|e| format!("Failed to hide window: {}", e))?;
    std::thread::sleep(std::time::Duration::from_millis(50));

    #[cfg(target_os = "macos")]
    {
        enigo.key(Key::Meta, Press).map_err(|e: enigo::InputError| format!("key press (cmd) error. Error {}", e))?;
        enigo.key(Key::Unicode('v'), Click).map_err(|e| format!("key press (v) error. Error: {}", e))?;
        
        enigo.key(Key::Unicode('v'), Release).map_err(|e| format!("key release (v) error. Error: {}", e))?;
        enigo.key(Key::Meta, Release).map_err(|e| format!("key release (cmd) error. Error: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        enigo.key(Key::Control, Press).map_err(|e: enigo::InputError| format!("key press (control) error. Error {}", e))?;
        enigo.key(Key::Unicode('v'), Click).map_err(|e| format!("key press (v) error. Error: {}", e))?;
        
        enigo.key(Key::Unicode('v'), Release).map_err(|e| format!("key release (v) error. Error: {}", e))?;
        enigo.key(Key::Control, Release).map_err(|e| format!("key release (control) error. Error: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        // Linux (most X11 environments) uses Control (Control) + V
        enigo.key(Key::Control, Press).map_err(|e: enigo::InputError| format!("key press (control) error. Error {}", e))?;
        enigo.key(Key::Unicode('v'), Click).map_err(|e| format!("key press (v) error. Error: {}", e))?;
        
        enigo.key(Key::Unicode('v'), Release).map_err(|e| format!("key release (v) error. Error: {}", e))?;
        enigo.key(Key::Control, Release).map_err(|e| format!("key release (control) error. Error: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
fn open_system_settings() -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let url = "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility";

        Command::new("open")
            .arg(url)
            .spawn()
            .map_err(|e| format!("Failed to open System Settings: {}", e))?;
    }

    // MARK: need to be test on window
    // Windows: Ease of Access Settings
    #[cfg(target_os = "windows")]
    {
        // This opens: Settings > Ease of Access
        Command::new("cmd")
            .args(&["/C", "start", "ms-settings:easeofaccess-display"])
            .spawn()
            .map_err(|e| format!("Failed to open Windows Settings: {}", e))?;
    }

    // MARK: need to be test on window
    // Linux (GNOME & others): best-effort settings deep link
    #[cfg(target_os = "linux")]
    {
        // Try opening GNOME accessibility settings
        let result = Command::new("sh")
            .arg("-c")
            .arg("xdg-open gnome-control-center universal-access || xdg-open settings://privacy || xdg-open settings://")
            .spawn();

        result.map_err(|e| format!("Failed to open Linux Settings: {}", e))?;
    }
    
    Ok(())
}