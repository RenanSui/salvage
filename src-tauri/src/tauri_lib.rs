use tauri::{App, Manager};

pub fn setup_window(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let Some(window) = app.get_window("main") else {
        return Ok(());
    };

    // let _ = window.set_decorations(false);
    // let _ = window.set_size(PhysicalSize {
    //     width: 384,
    //     height: 300,
    // });

    #[cfg(target_os = "macos")]
    window_vibrancy::apply_vibrancy(
        &window,
        window_vibrancy::NSVisualEffectMaterial::HudWindow,
        None,
        None,
    )
    .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    #[cfg(target_os = "windows")]
    window_vibrancy::apply_blur(&window, Some((13, 13, 13, 200)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

    #[cfg(any(windows, target_os = "macos"))]
    window_shadows::set_shadow(&window, true).unwrap();

    Ok(())
}
