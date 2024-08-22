// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod backup;
mod commands;
mod debouncer;
mod file;
mod watcher;

use crate::backup::backup::{self as Backup};
use file::initial_copy_files;
use std::collections::HashMap;
use std::sync::Arc;
use tauri::Result as TauriResult;
use tokio::sync::Mutex;

#[tokio::main]
async fn main() -> TauriResult<()> {
    let backups = Backup::fetch_all_backups("./data.json")?;
    for backup in backups {
        let _ = initial_copy_files(backup.source, backup.destination, &backup.exclusions);
    }

    tauri::Builder::default()
        .manage(watcher::AppState {
            watcher_state: Arc::new(Mutex::new(HashMap::new())),
            tx: Arc::new(Mutex::new(HashMap::new())),
        })
        .invoke_handler(tauri::generate_handler![
            commands::select_file,
            commands::select_folder,
            commands::fetch_all_backups,
            commands::fetch_backup_by_id,
            commands::create_backup,
            commands::rename_backup,
            commands::change_backup_source,
            commands::change_backup_destination,
            commands::modify_backup_exclusions,
            commands::delete_backup,
            // Watcher
            commands::load_backups,
            commands::start_watching,
            commands::stop_watching,
            commands::restart_backups,
            commands::start_individual_backup,
            commands::stop_individual_backup,
            commands::restart_individual_backup,
        ])
        .run(tauri::generate_context!())
        .expect("# Error while running tauri application");

    Ok(())
}
