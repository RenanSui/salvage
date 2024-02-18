// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use std::process::Command;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // println!("Opening");

            // Command::new("explorer")
            //     .arg("-C") // <- Specify the directory you'd like to open.
            //     .arg("/Games")
            //     .spawn()
            //     .unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
