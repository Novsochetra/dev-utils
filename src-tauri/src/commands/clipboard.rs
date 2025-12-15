use enigo::{
    Direction::{Click, Press, Release},
    Enigo, Key, Keyboard, Settings,
};

/// Simulates the system-specific "Paste" key combination (Ctrl+V or Cmd+V).
#[tauri::command]
pub fn auto_paste(window: tauri::Window) -> Result<(), String> {
    let mut enigo = Enigo::new(&Settings::default())
        .map_err(|e| format!("Enigo Initialization Error (Permission Issue?): {}", e))?;

    window
        .hide()
        .map_err(|e| format!("Failed to hide window: {}", e))?;
    std::thread::sleep(std::time::Duration::from_millis(50));

    #[cfg(target_os = "macos")]
    {
        enigo
            .key(Key::Meta, Press)
            .map_err(|e: enigo::InputError| format!("key press (cmd) error. Error {}", e))?;
        enigo
            .key(Key::Unicode('v'), Click)
            .map_err(|e| format!("key press (v) error. Error: {}", e))?;

        enigo
            .key(Key::Unicode('v'), Release)
            .map_err(|e| format!("key release (v) error. Error: {}", e))?;
        enigo
            .key(Key::Meta, Release)
            .map_err(|e| format!("key release (cmd) error. Error: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        enigo
            .key(Key::Control, Press)
            .map_err(|e: enigo::InputError| format!("key press (control) error. Error {}", e))?;
        enigo
            .key(Key::Unicode('v'), Click)
            .map_err(|e| format!("key press (v) error. Error: {}", e))?;

        enigo
            .key(Key::Unicode('v'), Release)
            .map_err(|e| format!("key release (v) error. Error: {}", e))?;
        enigo
            .key(Key::Control, Release)
            .map_err(|e| format!("key release (control) error. Error: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        // Linux (most X11 environments) uses Control (Control) + V
        enigo
            .key(Key::Control, Press)
            .map_err(|e: enigo::InputError| format!("key press (control) error. Error {}", e))?;
        enigo
            .key(Key::Unicode('v'), Click)
            .map_err(|e| format!("key press (v) error. Error: {}", e))?;

        enigo
            .key(Key::Unicode('v'), Release)
            .map_err(|e| format!("key release (v) error. Error: {}", e))?;
        enigo
            .key(Key::Control, Release)
            .map_err(|e| format!("key release (control) error. Error: {}", e))?;
    }

    Ok(())
}
