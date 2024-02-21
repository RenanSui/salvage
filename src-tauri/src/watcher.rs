use notify::{
    event::{CreateKind, ModifyKind, RemoveKind},
    Error, EventKind, ReadDirectoryChangesWatcher, RecursiveMode, Watcher,
};
use notify_debouncer_full::{
    new_debouncer, DebounceEventResult, DebouncedEvent, Debouncer, FileIdMap,
};
use std::{path::Path, time::Duration};
use tokio::{runtime::Handle, sync::mpsc::Receiver};

use crate::salvage;

pub struct NotifyHandler {
    pub notify_watcher: Option<Debouncer<ReadDirectoryChangesWatcher, FileIdMap>>,
    pub receiver: Option<Receiver<Result<Vec<DebouncedEvent>, Vec<Error>>>>,
}

impl NotifyHandler {
    pub async fn initialize_notify_scheduler(&mut self) {
        let (tx, rx) = tokio::sync::mpsc::channel(1);
        let rt = Handle::current();

        let debouncer = new_debouncer(
            Duration::from_secs(3),
            None,
            move |result: DebounceEventResult| {
                let tx = tx.clone();

                println!("calling by notify -> {:?}", &result);
                rt.spawn(async move {
                    if let Err(e) = tx.send(result).await {
                        println!("Error sending event result: {:?}", e);
                    }
                });
            },
        );

        match debouncer {
            Ok(watcher) => {
                println!("Initialize notify watcher success");
                self.notify_watcher = Some(watcher);

                self.receiver = Some(rx);
            }
            Err(error) => {
                println!("{:?}", error);
            }
        }
    }

    pub async fn watch(&mut self, source: String, dest: String) -> notify::Result<()> {
        let watch_path = Path::new(&source);

        if watch_path.exists() {
            let is_file = watch_path.is_file();
            println!("Valid path {} is file {}", &source, is_file);
        } else {
            println!("watch path {:?} not exists", watch_path);
        }

        if let Some(watcher) = self.notify_watcher.as_mut() {
            watcher
                .watcher()
                .watch(watch_path, RecursiveMode::Recursive)?;

            watcher
                .cache()
                .add_root(watch_path, RecursiveMode::Recursive);

            if let Some(mut rx) = self.receiver.take() {
                tokio::spawn(async move {
                    while let Some(res) = rx.recv().await {
                        match res {
                            Ok(events) => {
                                // ERROR WAS IN ORDER
                                // for event in events.into_iter().rev().into_iter() {
                                for event in events.iter().rev() {
                                    let kind = event.event.kind;
                                    let paths = event.event.paths.clone();

                                    match kind {
                                        EventKind::Create(CreateKind::Any) => {
                                            // println!("Create: {:?}", paths);
                                            salvage::copy_file(paths, &dest)
                                        }
                                        EventKind::Modify(ModifyKind::Any) => {
                                            // println!("Modify: {:?}", paths);
                                            salvage::copy_file(paths, &dest)
                                        }
                                        EventKind::Remove(RemoveKind::Any) => {
                                            // println!("Remove: {:?}", paths);
                                            salvage::delete_file(paths, &source, &dest);
                                        }
                                        _ => println!("Ain't special"),
                                    }
                                }
                            }
                            Err(errors) => {
                                println!("errors: {:?}", errors)
                            }
                        };
                    }
                });
            }
        }

        Ok(())
    }
}
