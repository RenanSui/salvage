pub mod backup {
    use crate::logger::logger::{self as Logger};
    use serde::{Deserialize, Serialize};
    use std::path::Path;
    use tokio::fs;
    use tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader};

    #[derive(Serialize, Deserialize, Debug)]
    pub struct BackupItem {
        pub id: String,
        pub name: String,
        pub source: String,
        pub destination: String,
        pub exclusions: Vec<String>,
        pub is_file: bool,
    }

    pub async fn fetch_all_backups<P: AsRef<Path>>(path: P) -> std::io::Result<Vec<BackupItem>> {
        let path = path.as_ref();

        if !path.exists() {
            let mut file = fs::File::create(path).await?;
            file.write_all(b"[]").await?;
        }

        let file = fs::File::open(path).await?;
        let mut reader = BufReader::new(file);
        let mut content = String::new();
        reader.read_to_string(&mut content).await?;

        let json: Vec<BackupItem> = serde_json::from_str(&content)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e.to_string()))?;

        Ok(json)
    }

    pub async fn fetch_backup_by_id(id: &str) -> Option<BackupItem> {
        let json_data = fetch_all_backups("./data.json").await.ok()?;

        json_data
            .into_iter()
            .find(|data| if data.id == id { true } else { false })
    }

    pub async fn create_backup(mut backup_item: BackupItem) -> std::io::Result<bool> {
        let mut backups_list = fetch_all_backups("./data.json").await?;

        backup_item.is_file = Path::new(&backup_item.source).is_file();
        backups_list.push(backup_item);

        fs::write("./data.json", serde_json::to_string(&backups_list)?).await?;
        Ok(true)
    }

    pub async fn rename_backup(
        window: tauri::Window,
        id: &str,
        name: &str,
    ) -> std::io::Result<bool> {
        let backups_json = fetch_all_backups("./data.json").await?;
        let mut backups_list: Vec<BackupItem> = Vec::new();

        for mut backup in backups_json {
            if backup.id == id {
                Logger::log_event(
                    &window,
                    backup.id.clone(),
                    format!("Name: {:?} > {:?}", backup.name, name),
                    Logger::LogEventType::Update,
                );
                backup.name = name.to_string();
            }
            backups_list.push(backup);
        }

        fs::write("./data.json", serde_json::to_string(&backups_list)?).await?;
        Ok(true)
    }

    pub async fn change_backup_source(
        window: tauri::Window,
        id: &str,
        source: &str,
    ) -> std::io::Result<bool> {
        let mut backups_json = fetch_all_backups("./data.json").await?;

        for backup in backups_json.iter_mut() {
            if backup.id == id {
                Logger::log_event(
                    &window,
                    backup.id.clone(),
                    format!("Source: {:?}", source),
                    Logger::LogEventType::Update,
                );
                backup.source = source.to_string();
                backup.is_file = Path::new(&backup.source).is_file();
            }
        }

        fs::write("./data.json", serde_json::to_string(&backups_json)?).await?;
        Ok(true)
    }

    pub async fn change_backup_destination(
        window: tauri::Window,
        id: &str,
        dest: &str,
    ) -> std::io::Result<bool> {
        let mut backups_json = fetch_all_backups("./data.json").await?;

        for backup in backups_json.iter_mut() {
            if backup.id == id {
                Logger::log_event(
                    &window,
                    backup.id.clone(),
                    format!("Destination: {:?}", dest),
                    Logger::LogEventType::Update,
                );
                backup.destination = dest.to_string();
            }
        }

        fs::write("./data.json", serde_json::to_string(&backups_json)?).await?;
        Ok(true)
    }

    pub async fn modify_backup_exclusions(
        window: tauri::Window,
        id: &str,
        exclusions: &[String],
    ) -> std::io::Result<bool> {
        let mut backups_json = fetch_all_backups("./data.json").await?;

        for backup in backups_json.iter_mut() {
            if backup.id == id {
                Logger::log_event(
                    &window,
                    backup.id.clone(),
                    format!("Exclusions: {:#?}", exclusions.join(", ")),
                    Logger::LogEventType::Update,
                );
                backup.exclusions = exclusions.to_owned();
            }
        }

        fs::write("./data.json", serde_json::to_string(&backups_json)?).await?;
        Ok(true)
    }

    pub async fn delete_backup(id: &str) -> std::io::Result<bool> {
        let backups_list = fetch_all_backups("./data.json").await?;

        let new_backups_list: Vec<_> = backups_list
            .into_iter()
            .filter(|item| {
                if item.id == id {
                    println!("# Remove {:?}", item.name);
                    false
                } else {
                    true
                }
            })
            .collect();

        fs::write("./data.json", serde_json::to_string(&new_backups_list)?).await?;
        Ok(true)
    }
}
