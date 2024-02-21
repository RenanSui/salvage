use tauri::{App, Manager};
use window_shadows::set_shadow;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};


pub fn setup_window(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
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

    #[cfg(any(windows, target_os = "macos"))]
    set_shadow(&window, true).unwrap();

    Ok(())
}