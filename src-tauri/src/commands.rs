#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::backup::backup::{self as Backup};
use crate::logger::logger::{self as Logger};
use crate::watcher::{async_watcher, handle_events, AppState};
use anyhow::Result;
use notify::{RecursiveMode, Watcher};
use rfd::FileDialog;
use std::path::PathBuf;
use tauri::Result as TauriResult;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn select_file() -> String {
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
pub fn select_folder() -> String {
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
pub fn fetch_all_backups() -> Option<Vec<Backup::BackupItem>> {
    Backup::fetch_all_backups("./data.json").ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn fetch_backup_by_id(id: String) -> Option<Backup::BackupItem> {
    Backup::fetch_backup_by_id(&id)
}

#[tauri::command(rename_all = "snake_case")]
pub fn create_backup(mut backup: Backup::BackupItem) -> bool {
    backup.id = Uuid::new_v4().to_string();
    Backup::create_backup(backup).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn rename_backup(window: tauri::Window, id: String, name: String) -> bool {
    Backup::rename_backup(window, &id, &name).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn change_backup_source(window: tauri::Window, id: String, source: String) -> bool {
    Backup::change_backup_source(window, &id, &source).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn change_backup_destination(window: tauri::Window, id: String, destination: String) -> bool {
    Backup::change_backup_destination(window, &id, &destination).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn modify_backup_exclusions(
    window: tauri::Window,
    id: String,
    exclusions: Vec<String>,
) -> bool {
    Backup::modify_backup_exclusions(window, &id, &exclusions).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_backup(id: String) -> bool {
    Backup::delete_backup(&id).is_ok()
}

#[tauri::command(rename_all = "snake_case")]
pub async fn load_backups() -> Result<Vec<Backup::BackupItem>, tauri::Error> {
    let backups = Backup::fetch_all_backups("./data.json");
    Ok(backups?)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn start_watching(state: State<'_, AppState>, window: tauri::Window) -> TauriResult<()> {
    let backups = Backup::fetch_all_backups("./data.json")?;

    for backup in backups {
        // println!("# Start watching: {}", backup.name);
        Logger::log_event(
            &window,
            backup.id.clone(),
            // format!("Start watching: {:?}", backup.name),
            format!("{:?}", backup.name),
            Logger::LogEventType::Start,
        );
        let src = backup.source;
        let dst = backup.destination;
        let exclusions = backup.exclusions;

        if let Ok((mut watcher, rx, tx)) = async_watcher().await {
            let _ = watcher.watch(&src.as_ref(), RecursiveMode::Recursive);

            {
                let mut watcher_state = state.watcher_state.lock().await;
                watcher_state.insert(backup.id.clone(), watcher);
            }

            {
                let mut tx_state = state.tx.lock().await;
                tx_state.insert(backup.id.clone(), tx);
            }

            tokio::spawn(handle_events(
                src,
                dst,
                exclusions,
                rx,
                window.clone(),
                backup.id,
            ));
        }
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn stop_watching(state: State<'_, AppState>, window: tauri::Window) -> TauriResult<()> {
    let backups = Backup::fetch_all_backups("./data.json")?;

    for backup in backups {
        // println!("# Stop watching: {}", backup.name);
        Logger::log_event(
            &window,
            backup.id.clone(),
            // format!("Stop watching: {:?}", backup.name),
            format!("{:?}", backup.name),
            Logger::LogEventType::Stop,
        );
        let path = PathBuf::from(backup.source);

        {
            let mut watcher_state = state.watcher_state.lock().await;
            if let Some(ref mut watcher) = watcher_state.remove(&backup.id) {
                watcher.unwatch(&path).unwrap();
            }
        }

        {
            let mut tx_state = state.tx.lock().await;
            tx_state.remove(&backup.id);
        }
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn restart_backups(state: State<'_, AppState>, window: tauri::Window) -> TauriResult<()> {
    let _ = stop_watching(state.clone(), window.clone()).await;
    let _ = start_watching(state, window).await;
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn start_individual_backup(
    state: State<'_, AppState>,
    window: tauri::Window,
    id: String,
) -> TauriResult<()> {
    if let Some(backup) = Backup::fetch_backup_by_id(&id) {
        // println!("# Start watching: {}", backup.name);
        Logger::log_event(
            &window,
            backup.id.clone(),
            // format!("Start watching: {:?}", backup.name),
            format!("{:?}", backup.name),
            Logger::LogEventType::Start,
        );
        let src = backup.source;
        let dst = backup.destination;
        let exclusions = backup.exclusions;

        if let Ok((mut watcher, rx, tx)) = async_watcher().await {
            let _ = watcher.watch(&src.as_ref(), RecursiveMode::Recursive);

            {
                let mut watcher_state = state.watcher_state.lock().await;
                watcher_state.insert(id.clone(), watcher);
            }

            {
                let mut tx_state = state.tx.lock().await;
                tx_state.insert(id.clone(), tx); // Store Arc<Mutex<Sender>>
            }

            tokio::spawn(handle_events(src, dst, exclusions, rx, window, backup.id));
        }
    } else {
        println!("Backup with ID {} not found.", id);
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn stop_individual_backup(
    state: State<'_, AppState>,
    window: tauri::Window,
    id: String,
) -> TauriResult<()> {
    if let Some(backup) = Backup::fetch_backup_by_id(&id) {
        // println!("# Stop watching: {}", backup.name);
        Logger::log_event(
            &window,
            backup.id,
            // format!("Stop watching: {:?}", backup.name),
            format!("{:?}", backup.name),
            Logger::LogEventType::Stop,
        );
        let path = PathBuf::from(backup.source);

        {
            let mut watcher_state = state.watcher_state.lock().await;
            if let Some(mut watcher) = watcher_state.remove(&id) {
                // Remove watcher by ID
                let _ = watcher.unwatch(&path);
            }
        }

        {
            let mut tx_state = state.tx.lock().await;
            tx_state.remove(&id); // Remove Sender by ID
        }
    } else {
        println!("Backup with ID {} not found.", id);
    }

    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn restart_individual_backup(
    state: State<'_, AppState>,
    window: tauri::Window,
    id: String,
) -> TauriResult<()> {
    let _ = stop_individual_backup(state.clone(), window.clone(), id.clone()).await;
    start_individual_backup(state, window.clone(), id).await
}
