use crate::file::handle_file_modified;
use notify::{Config, Event, RecommendedWatcher, Result, Watcher};
use std::collections::HashMap;
use std::path::Path;
use std::sync::Arc;
use tokio::sync::mpsc::{self, Receiver, Sender};
use tokio::sync::Mutex;

pub type WatcherState = Arc<Mutex<HashMap<String, RecommendedWatcher>>>;
pub type TxState = Arc<Mutex<HashMap<String, Arc<Mutex<Sender<notify::Result<Event>>>>>>>;

pub struct AppState {
    pub watcher_state: WatcherState,
    pub tx: TxState,
}

pub async fn async_watcher() -> Result<(
    RecommendedWatcher,
    Receiver<notify::Result<Event>>,
    Arc<Mutex<Sender<notify::Result<Event>>>>,
)> {
    let handle = tokio::runtime::Handle::current();

    let (tx, rx) = mpsc::channel(1);
    let tx = Arc::new(Mutex::new(tx)); // Use tokio::sync::Mutex

    let watcher = RecommendedWatcher::new(
        {
            let tx = Arc::clone(&tx); // Clone the Arc<Mutex<Sender>>
            move |res| {
                let tx = Arc::clone(&tx); // Clone the Arc<Mutex<Sender>> again for the closure
                handle.spawn(async move {
                    let tx = tx.lock().await; // Use async lock
                    tx.send(res).await.unwrap();
                });
            }
        },
        Config::default(),
    )?;

    // println!("# Watcher initialized.");

    Ok((watcher, rx, tx))
}

pub async fn handle_events<P: AsRef<Path>, Q: AsRef<Path>>(
    src: P,
    dst: Q,
    exclusions: Vec<String>,
    mut rx: Receiver<notify::Result<Event>>,
    window: tauri::Window,
    id: String,
) -> notify::Result<()> {
    let src = Arc::new(src.as_ref().to_path_buf());
    let dst = Arc::new(dst.as_ref().to_path_buf());
    let exclusions = Arc::new(exclusions);
    let window = Arc::new(window);
    let id = Arc::new(id);

    while let Some(res) = rx.recv().await {
        match res {
            Ok(event) => {
                for path in event.paths {
                    let path = Arc::new(path);
                    let src = Arc::clone(&src);
                    let dst = Arc::clone(&dst);
                    let exclusions = Arc::clone(&exclusions);
                    let window = (*Arc::clone(&window)).clone();
                    let id = (*Arc::clone(&id)).clone();

                    tokio::spawn(async move {
                        let _ = handle_file_modified(
                            path.to_path_buf(),
                            src.to_path_buf(),
                            dst.to_path_buf(),
                            exclusions.to_vec(),
                            id.clone().to_string(),
                            window.clone(),
                        )
                        .await;
                    });
                }
            }
            Err(error) => eprintln!("# Watch error: {:?}", error),
        }
    }

    Ok(())
}
