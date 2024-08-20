// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod backup;

use rfd::FileDialog;
use backup::backup::{self as Backup};
use uuid::Uuid;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            select_file,
            select_folder,
            fetch_all_backups,
            fetch_backup_by_id,
            create_backup,
            rename_backup,
            change_backup_source,
            change_backup_destination,
            modify_backup_exclusions,
            delete_backup,
        ])
        .run(tauri::generate_context!())
        .expect("# Error while running tauri application");
}

#[tauri::command]
fn select_file() -> String {
    FileDialog::new().pick_file().map_or_else(
        || {
            println!("# No file selected.");
            String::new()
        },
        |file| {
            println!("# Selected file: {:?}", file);
            file.display().to_string()
        },
    )
}

#[tauri::command]
fn select_folder() -> String {
    FileDialog::new().pick_folder().map_or_else(
        || {
            println!("# No folder selected.");
            String::new()
        },
        |folder| {
            println!("# Selected folder: {:?}", folder);
            folder.display().to_string()
        },
    )
}

#[tauri::command(rename_all = "snake_case")]
fn fetch_all_backups() -> Option<Vec<Backup::BackupItem>> {
    Backup::fetch_all_backups("./data.json").ok()
}

#[tauri::command(rename_all = "snake_case")]
fn fetch_backup_by_id(id: String) -> Option<Backup::BackupItem> {
    Backup::fetch_backup_by_id(&id)
}

#[tauri::command(rename_all = "snake_case")]
fn create_backup(mut backup: Backup::BackupItem) -> bool {
    backup.id = Uuid::new_v4().to_string();
    Backup::create_backup(backup).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
fn rename_backup(id: String, name: String) -> bool {
    Backup::rename_backup(&id, &name).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
fn change_backup_source(id: String, source: String) -> bool {
    Backup::change_backup_source(&id, &source).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
fn change_backup_destination(id: String, destination: String) -> bool {
    Backup::change_backup_destination(&id, &destination).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
fn modify_backup_exclusions(id: String, exclusions: Vec<String>) -> bool {
    Backup::modify_backup_exclusions(&id, &exclusions).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
fn delete_backup(id: String) -> bool {
    Backup::delete_backup(&id).is_ok()
}
