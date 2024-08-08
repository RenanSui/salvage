// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod salvage;

use rfd::FileDialog;
use salvage::salvage as Salvage;
use uuid::Uuid;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_file,
            get_folder,
            add_salvage_item,
        ])
        .run(tauri::generate_context!())
        .expect("# Error while running tauri application");
}

#[tauri::command]
fn get_file() -> String {
    if let Some(file) = FileDialog::new().pick_file() {
        println!("# Selected file: {:?}", file);
        file.display().to_string()
    } else {
        println!("# No file selected.");
        "".to_owned()
    }
}

#[tauri::command]
fn get_folder() -> String {
    if let Some(folder) = FileDialog::new().pick_folder() {
        println!("# Selected folder: {:?}", folder);
        folder.display().to_string()
    } else {
        println!("# No folder selected.");
        "".to_owned()
    }
}

#[tauri::command(rename_all = "snake_case")]
fn add_salvage_item(mut salvage_item: Salvage::SalvageItem) {
    salvage_item.id = Uuid::new_v4().to_string();
    let _ = Salvage::add(salvage_item);
}

