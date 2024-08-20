pub mod backup {
    use serde::{Deserialize, Serialize};
    use std::fs;
    use std::io::{BufReader, Write};
    use std::path::Path;

    #[derive(Serialize, Deserialize, Debug)]
    pub struct BackupItem {
        pub id: String,
        pub name: String,
        pub source: String,
        pub destination: String,
        pub exclusions: Vec<String>,
        pub is_file: bool,
    }

    pub fn fetch_all_backups<P: AsRef<Path>>(path: P) -> std::io::Result<Vec<BackupItem>> {
        let path = path.as_ref();

        if !path.exists() {
            let mut file = fs::File::create(path)?;
            let _ = fs::File::write(&mut file, b"[]");
        }

        let file = fs::File::open(path)?;
        let reader = BufReader::new(file);
        let json: Vec<BackupItem> = serde_json::from_reader(reader)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e.to_string()))?;

        Ok(json)
    }

    pub fn fetch_backup_by_id(id: &str) -> Option<BackupItem> {
        let json_data = fetch_all_backups("./data.json").ok()?;

        json_data.into_iter().find(|data| {
            if data.id == id {
                println!("# Get {:?} item", data.name);
                true
            } else {
                false
            }
        })
    }

    pub fn create_backup(mut backup_item: BackupItem) -> std::io::Result<bool> {
        let mut backups_list = fetch_all_backups("./data.json")?;

        backup_item.is_file = Path::new(&backup_item.source).is_file();
        backups_list.push(backup_item);

        fs::write("./data.json", serde_json::to_string(&backups_list)?)?;
        Ok(true)
    }

    pub fn rename_backup(id: &str, name: &str) -> std::io::Result<bool> {
        let backups_json = fetch_all_backups("./data.json")?;
        let mut backups_list: Vec<BackupItem> = Vec::new();

        for mut backup in backups_json {
            if backup.id == id {
                println!("# Update {:?} name to {:?}", backup.name, name);
                backup.name = name.to_string();
            }
            backups_list.push(backup);
        }

        fs::write("./data.json", serde_json::to_string(&backups_list)?)?;
        Ok(true)
    }

    pub fn change_backup_source(id: &str, source: &str) -> std::io::Result<bool> {
        let mut backups_json = fetch_all_backups("./data.json")?;

        backups_json.iter_mut().for_each(|backup| {
            if backup.id == id {
                println!("# Update {:?} source", backup.name);
                backup.source = source.to_string();
                backup.is_file = Path::new(&backup.source).is_file();
            }
        });

        fs::write("./data.json", serde_json::to_string(&backups_json)?)?;
        Ok(true)
    }

    pub fn change_backup_destination(id: &str, dest: &str) -> std::io::Result<bool> {
        let mut backups_json = fetch_all_backups("./data.json")?;

        backups_json.iter_mut().for_each(|backup| {
            if backup.id == id {
                println!("# Update {:?} dest", backup.name);
                backup.destination = dest.to_string();
            }
        });

        fs::write("./data.json", serde_json::to_string(&backups_json)?)?;
        Ok(true)
    }

    pub fn modify_backup_exclusions(id: &str, exclusions: &[String]) -> std::io::Result<bool> {
        let mut backups_json = fetch_all_backups("./data.json")?;

        backups_json.iter_mut().for_each(|backup| {
            if backup.id == id {
                println!("# Update {:?} exclusions", backup.name);
                backup.exclusions = exclusions.to_owned();
            }
        });

        fs::write("./data.json", serde_json::to_string(&backups_json)?)?;
        Ok(true)
    }

    pub fn delete_backup(id: &str) -> std::io::Result<bool> {
        let backups_list = fetch_all_backups("./data.json")?;

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

        fs::write("./data.json", serde_json::to_string(&new_backups_list)?)?;
        Ok(true)
    }
}
