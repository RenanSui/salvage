// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod salvage;
pub mod tauri_lib;
pub mod watcher;

use crate::{tauri_lib::setup_window, watcher::NotifyHandler};
use chrono::prelude::{DateTime, Local};
use std::env;
use std::{path::Path, process::Command, time::Duration};
use tauri::{AppHandle, Manager};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![salvage_watching, open_path])
        .setup(setup_window)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn salvage_watching(app_handle: AppHandle, source: String, dest: String) {
    let mut notifier: NotifyHandler = NotifyHandler {
        notify_watcher: None,
        receiver: None,
    };

    notifier.initialize_notify_scheduler().await;
    notifier.watch(source, dest, app_handle).await.unwrap();

    loop {
        tokio::time::sleep(Duration::from_secs(3)).await;

        let time: DateTime<Local> = Local::now();

        println!(
            "{}: Hello, world!",
            time.format("%Y-%m-%d %H:%M:%S").to_string()
        );
    }
}

#[tauri::command]
fn open_path(path: String) {
    if cfg!(windows) {
        println!("this is windows");
        Command::new("explorer")
            .args([Path::new(&path)])
            .spawn()
            .unwrap();
    }

    if cfg!(target_os = "macos") {
        println!("this is macos");
        Command::new("open")
            .args([Path::new(&path)])
            .spawn()
            .unwrap();
    }

    // if cfg!(unix) {
    //     println!("this is unix alike");
    // }
}
