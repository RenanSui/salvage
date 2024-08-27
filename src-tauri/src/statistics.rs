pub mod statistics {
    use crate::{
        backup::backup::{self as Backup},
        file::path_have_exclusions,
    };
    use serde::{Deserialize, Serialize};
    use std::path::Path;
    use tokio::fs;
    use walkdir::WalkDir;

    #[derive(Serialize, Deserialize, Debug)]
    enum Unit {
        Tb,
        Gb,
        Mb,
        Kb,
    }

    #[derive(Serialize, Deserialize, Debug)]
    pub struct StatisticsItem {
        source: String,
        file: String,
        size: String,
        unit: Unit,
    }

    async fn get_file_size_readable(file_path: &Path) -> Option<(String, Unit)> {
        let file_size = fs::metadata(file_path).await.ok()?.len();
        if file_size >= 1_099_511_627_776 {
            Some((
                format!("{:.2}", file_size as f64 / 1_099_511_627_776.0),
                Unit::Tb,
            )) // 1 TB = 1024^4 bytes
        } else if file_size >= 1_073_741_824 {
            Some((
                format!("{:.2}", file_size as f64 / 1_073_741_824.0),
                Unit::Gb,
            )) // 1 GB = 1024^3 bytes
        } else if file_size >= 1_048_576 {
            Some((format!("{:.2}", file_size as f64 / 1_048_576.0), Unit::Mb)) // 1 MB = 1024^2 bytes
        } else {
            Some((format!("{:.2}", file_size as f64 / 1024.0), Unit::Kb)) // 1 KB = 1024 bytes
        }
    }

    // pub async fn fetch_file_sizes_by_id(
    //     window: tauri::Window,
    //     id: &str,
    // ) -> Option<Vec<StatisticsItem>> {
    //     let backup = Backup::fetch_backup_by_id(id)?;
    //     let mut statistics = Vec::new();

    //     let walker = WalkDir::new(&backup.source)
    //         .into_iter()
    //         .filter_map(Result::ok)
    //         .filter(|e| e.path().is_file());

    //     for entry in walker {
    //         let path = entry.path();

    //         if !path_have_exclusions(
    //             window.clone(),
    //             &path.to_path_buf(),
    //             backup.exclusions.to_owned(),
    //             backup.id.clone(),
    //             None,
    //         ) {
    //             if let Some(file_name) = path.file_name().and_then(|f| f.to_str()) {
    //                 if let Some((size, unit)) = get_file_size_readable(path).await {
    //                     println!("{:?} {:?}", &size, &unit);
    //                     statistics.push(StatisticsItem {
    //                         source: backup.source.clone(),
    //                         file: file_name.to_string(),
    //                         size,
    //                         unit,
    //                     });
    //                 }
    //             }
    //         }
    //     }

    //     Some(statistics)
    // }
}
