use tauri::Manager;

#[tauri::command]
pub fn close_splashscreen(window: tauri::Window) {
  // Close splashscreen
  if let Some(splashscreen) = window.get_webview_window("splash") {
    splashscreen.close().unwrap();
  }
  // Show main window
  window.get_webview_window("main").unwrap().show().unwrap();
}