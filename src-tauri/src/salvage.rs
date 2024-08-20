pub mod salvage {
    use serde::{Deserialize, Serialize};
    use std::fs;
    use std::io::{BufReader, Error, ErrorKind, Write};
    use std::path::Path;

    #[derive(Serialize, Deserialize, Debug)]
    pub struct SalvageItem {
        pub id: String,
        pub name: String,
        pub source: String,
        pub destination: String,
        pub exclusions: Vec<String>,
        pub is_file: bool,
    }

    pub fn get_all<P: AsRef<Path>>(
        path: P,
    ) -> Result<Vec<SalvageItem>, Box<dyn std::error::Error>> {
        let path = path.as_ref();

        if !path.exists() {
            let mut file = fs::File::create(path)?;
            let _ = fs::File::write(&mut file, b"[]");
        }

        let file = fs::File::open(path)?;
        let reader = BufReader::new(file);
        let json: Vec<SalvageItem> = serde_json::from_reader(reader)?;

        Ok(json)
    }

    pub fn get_by_id(id: &str) -> std::option::Option<SalvageItem> {
        let json = get_all("./data.json");

        match json {
            Ok(json_data) => {
                for data in json_data {
                    if data.id == id {
                        println!("# Get {:?} item", data.name);
                        return Some(data);
                    }
                }
                None
            }
            Err(error) => {
                println!("# Error getting app data: {:#?}", error);
                None
            }
        }
    }

    pub fn add(mut backup_item: SalvageItem) -> std::io::Result<bool> {
        let mut backups_list = get_all("./data.json")
            .map_err(|e| Error::new(ErrorKind::Other, format!("# Error reading data: {}", e)))?;

        backup_item.is_file = Path::new(&backup_item.source).is_file();
        backups_list.push(backup_item);

        let backup_string = serde_json::to_string(&backups_list);
        let backup_added = fs::write("./data.json", backup_string?);

        match backup_added {
            Ok(_) => Ok(true),
            Err(error) => {
                println!("# Error adding backup: {:?}", error);
                Ok(false)
            }
        }
    }

    pub fn update_name(id: &str, name: &str) -> std::io::Result<bool> {
        let mut backups_list: Vec<SalvageItem> = Vec::new();
        let backups_json = get_all("./data.json");

        match backups_json {
            Ok(backups) => {
                for mut backup in backups {
                    if backup.id == id {
                        println!("# Update {:?} name to {:?}", backup.name, name);
                        backup.name = String::from(name);
                    }
                    backups_list.push(SalvageItem { ..backup })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let backup_string = serde_json::to_string(&backups_list);
        let backup_updated = fs::write("./data.json", backup_string?);

        match backup_updated {
            Ok(_) => Ok(true),
            Err(error) => {
                println!("# Error updating backup: {:?}", error);
                Ok(false)
            }
        }
    }

    pub fn update_source(id: &str, source: &str) -> std::io::Result<bool> {
        let mut backups_list: Vec<SalvageItem> = Vec::new();
        let backups_json = get_all("./data.json");

        match backups_json {
            Ok(backups) => {
                for mut backup in backups {
                    if backup.id == id {
                        println!("# Update {:?} source", backup.name);
                        backup.source = String::from(source);
                        backup.is_file = Path::new(&backup.source).is_file();
                    }
                    backups_list.push(SalvageItem { ..backup })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let backup_string = serde_json::to_string(&backups_list);
        let backup_updated = fs::write("./data.json", backup_string?);

        match backup_updated {
            Ok(_) => Ok(true),
            Err(error) => {
                println!("# Error updating backup: {:?}", error);
                Ok(false)
            }
        }
    }

    pub fn update_destination(id: &str, dest: &str) -> std::io::Result<bool> {
        let mut backups_list: Vec<SalvageItem> = Vec::new();
        let backups_json = get_all("./data.json");

        match backups_json {
            Ok(backups) => {
                for mut backup in backups {
                    if backup.id == id {
                        println!("# Update {:?} dest", backup.name);
                        backup.destination = String::from(dest);
                    }
                    backups_list.push(SalvageItem { ..backup })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let backup_string = serde_json::to_string(&backups_list);
        let backup_updated = fs::write("./data.json", backup_string?);

        match backup_updated {
            Ok(_) => Ok(true),
            Err(error) => {
                println!("# Error updating backup: {:?}", error);
                Ok(false)
            }
        }
    }

    pub fn update_exclusions(id: &str, exclusions: &Vec<String>) -> std::io::Result<bool> {
        let mut backups_list: Vec<SalvageItem> = Vec::new();
        let backups_json = get_all("./data.json");

        match backups_json {
            Ok(backups) => {
                for mut backup in backups {
                    if backup.id == id {
                        println!("# Update {:?} exclusions", backup.name);
                        backup.exclusions = exclusions.to_owned();
                    }
                    backups_list.push(SalvageItem { ..backup })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let backup_string = serde_json::to_string(&backups_list);
        let backup_updated = fs::write("./data.json", backup_string?);

        match backup_updated {
            Ok(_) => Ok(true),
            Err(error) => {
                println!("# Error updating backup: {:?}", error);
                Ok(false)
            }
        }
    }

    pub fn remove(id: &str) -> std::io::Result<bool> {
        let backups_list = get_all("./data.json")
            .map_err(|e| Error::new(ErrorKind::Other, format!("# Error reading data: {}", e)))?;
        let mut new_backups_list: Vec<&SalvageItem> = Vec::new();

        for item in &backups_list {
            if item.id != id {
                new_backups_list.push(item);
            } else {
                println!("# Remove {:?}", item.name);
            }
        }

        let backup_string = serde_json::to_string(&new_backups_list);
        let backup_deleted = fs::write("./data.json", backup_string?);

        match backup_deleted {
            Ok(_) => Ok(true),
            Err(error) => {
                println!("# Error deleting backup: {:?}", error);
                Ok(false)
            }
        }
    }
}
