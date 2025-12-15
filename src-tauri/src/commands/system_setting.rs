use std::process::Command;

#[tauri::command]
pub fn open_system_settings() -> Result<(), String> {
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
