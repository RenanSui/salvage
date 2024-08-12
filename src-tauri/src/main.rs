// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod salvage;

use rfd::FileDialog;
use salvage::salvage::{self as Salvage};
use uuid::Uuid;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_file,
            get_folder,
            get_all_backups,
            get_backup_by_id,
            add_backup,
            update_backup_name,
            update_backup_source,
            update_backup_destination,
            update_backup_exclusions,
            remove_backup,
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
fn get_all_backups() -> Option<Vec<Salvage::SalvageItem>> {
    let salvage_data = Salvage::get_all("./data.json");

    match salvage_data {
        Ok(salvage_data) => Some(salvage_data),
        Err(_) => None,
    }
}

#[tauri::command(rename_all = "snake_case")]
fn get_backup_by_id(id: String) -> Option<Salvage::SalvageItem> {
    let salvage_data = Salvage::get_by_id(&id);

    match salvage_data {
        Some(backup) => Some(backup),
        None => None,
    }
}

#[tauri::command(rename_all = "snake_case")]
fn add_backup(mut salvage_item: Salvage::SalvageItem) {
    salvage_item.id = Uuid::new_v4().to_string();
    let _ = Salvage::add(salvage_item);
}

#[tauri::command(rename_all = "snake_case")]
fn update_backup_name(id: String, name: String) {
    let _ = Salvage::update_name(&id, &name);
}

#[tauri::command(rename_all = "snake_case")]
fn update_backup_source(id: String, source: String) {
    let _ = Salvage::update_source(&id, &source);
}

#[tauri::command(rename_all = "snake_case")]
fn update_backup_destination(id: String, destination: String) {
    let _ = Salvage::update_destination(&id, &destination);
}

#[tauri::command(rename_all = "snake_case")]
fn update_backup_exclusions(id: String, exclusions: Vec<String>) {
    let _ = Salvage::update_exclusions(&id, &exclusions);
}

#[tauri::command(rename_all = "snake_case")]
fn remove_backup(id: String) {
    let _ = Salvage::remove(&id);
}
