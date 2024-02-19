// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, Manager};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![])
        .setup(setup_window)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_window(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let Some(window) = app.get_window("main") else {
        return Ok(());
    };

    let _ = window.set_decorations(false);

    #[cfg(target_os = "macos")]
    apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    #[cfg(target_os = "windows")]
    apply_blur(&window, Some((13, 13, 13, 200)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

    // println!("Opening");

    // Command::new("explorer")
    //     .arg("-C") // <- Specify the directory you'd like to open.
    //     .arg("/Games")
    //     .spawn()
    //     .unwrap();

    Ok(())
}
