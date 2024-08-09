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
        pub is_file: bool
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
        println!("{:?}", json);

        Ok(json)
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
}
