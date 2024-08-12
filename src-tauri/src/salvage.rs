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

    pub fn add(mut salvage_item: SalvageItem) -> std::io::Result<()> {
        let mut salvage_data = get_all("./data.json")
            .map_err(|e| Error::new(ErrorKind::Other, format!("# Error reading data: {}", e)))?;

        salvage_item.is_file = Path::new(&salvage_item.source).is_file();
        salvage_data.push(salvage_item);

        let json = serde_json::to_string(&salvage_data);
        if let Err(error) = fs::write("./data.json", json?) {
            println!("# Error writing json: {:?}", error)
        }

        Ok(())
    }

    pub fn update_name(id: &str, name: &str) -> std::io::Result<()> {
        let mut salvage_data: Vec<SalvageItem> = Vec::new();
        let json = get_all("./data.json");

        match json {
            Ok(json_data) => {
                for mut data in json_data {
                    if data.id == id {
                        println!("# Update {:?} name to {:?}", data.name, name);
                        data.name = String::from(name);
                    }
                    salvage_data.push(SalvageItem { ..data })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let json = serde_json::to_string(&salvage_data);
        if let Err(error) = fs::write("./data.json", json?) {
            println!("# Error writing json: {:?}", error)
        }

        Ok(())
    }

    pub fn update_source(id: &str, source: &str) -> std::io::Result<()> {
        let mut salvage_data: Vec<SalvageItem> = Vec::new();
        let json = get_all("./data.json");

        match json {
            Ok(json_data) => {
                for mut data in json_data {
                    if data.id == id {
                        println!("# Update {:?} source", data.name);
                        data.source = String::from(source);
                        data.is_file = Path::new(&data.source).is_file();
                    }
                    salvage_data.push(SalvageItem { ..data })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let json = serde_json::to_string(&salvage_data);
        if let Err(error) = fs::write("./data.json", json?) {
            println!("# Error writing json: {:?}", error)
        }

        Ok(())
    }

    pub fn update_destination(id: &str, dest: &str) -> std::io::Result<()> {
        let mut salvage_data: Vec<SalvageItem> = Vec::new();
        let json = get_all("./data.json");

        match json {
            Ok(json_data) => {
                for mut data in json_data {
                    if data.id == id {
                        println!("# Update {:?} dest", data.name);
                        data.destination = String::from(dest);
                    }
                    salvage_data.push(SalvageItem { ..data })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let json = serde_json::to_string(&salvage_data);
        if let Err(error) = fs::write("./data.json", json?) {
            println!("# Error writing json: {:?}", error)
        }

        Ok(())
    }

    pub fn update_exclusions(id: &str, exclusions: &Vec<String>) -> std::io::Result<()> {
        let mut salvage_data: Vec<SalvageItem> = Vec::new();
        let json = get_all("./data.json");

        match json {
            Ok(json_data) => {
                for mut data in json_data {
                    if data.id == id {
                        println!("# Update {:?} exclusions", data.name);
                        data.exclusions = exclusions.to_owned();
                    }
                    salvage_data.push(SalvageItem { ..data })
                }
            }
            Err(error) => println!("# Error getting app data: {:#?}", error),
        }

        let json = serde_json::to_string(&salvage_data);
        if let Err(error) = fs::write("./data.json", json?) {
            println!("# Error writing json: {:?}", error)
        }

        Ok(())
    }

    pub fn remove(id: &str) -> std::io::Result<()> {
        let salvage_data = get_all("./data.json")
            .map_err(|e| Error::new(ErrorKind::Other, format!("# Error reading data: {}", e)))?;
        let mut new_salvage_data: Vec<&SalvageItem> = Vec::new();

        for item in &salvage_data {
            if item.id != id {
                new_salvage_data.push(item);
            } else {
                println!("# Remove {:?}", item.name);
            }
        }

        let json = serde_json::to_string(&new_salvage_data);
        if let Err(error) = fs::write("./data.json", json?) {
            println!("# Error writing json: {:?}", error)
        }

        Ok(())
    }
}
