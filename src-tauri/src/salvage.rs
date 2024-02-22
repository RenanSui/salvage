use fs_extra::TransitProcess;
use std::borrow::Borrow;
use std::fs;
use std::path::Path;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

pub fn copy_file(app: AppHandle, paths: Vec<PathBuf>, source: &String, dest: &String) {
    for path in paths.iter() {
        println!("path: {:?}", path);
        copy(app.clone(), path, dest, &filter)
    }

    remove_nonexistent_files(source, dest)
}

pub fn copy(app: AppHandle, path: &PathBuf, dest: &String, filter: &dyn Fn(&PathBuf) -> bool) {
    if filter(path) {
        let options = fs_extra::dir::CopyOptions::new().overwrite(true);

        let dest_path = Path::new(&dest);

        let from_paths = vec![path];

        println!("copy: {:?}", from_paths);
        println!("to dest: {:?}", dest_path);

        let handle = |process_info: TransitProcess| {
            let copied_bytes = process_info.copied_bytes;
            let total_bytes = process_info.total_bytes;

            let percentage = (copied_bytes * 100) / total_bytes;

            let progresses = vec![10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

            for progress in progresses {
                if percentage == progress {
                    // println!("progress: {}", percentage);
                    app.emit_all(
                        "progress",
                        Payload {
                            message: percentage.to_string(),
                        },
                    )
                    .unwrap();
                }
            }

            fs_extra::dir::TransitProcessResult::ContinueOrAbort
        };

        let _ = fs_extra::copy_items_with_progress(&from_paths, &dest_path, &options, handle);
    }
}

pub fn delete_file(paths: Vec<PathBuf>, source: &String, dest: &String) {
    for path in paths.iter() {
        let file_path = path.to_str().expect("");

        let dest = str::replace(file_path, source, dest);

        let dest_path = Path::new(dest.as_str()).to_path_buf();

        let from_paths = vec![dest_path];

        println!("delete: {:?}", from_paths);

        let _ = fs_extra::remove_items(&from_paths);

        remove_nonexistent_files(source, &dest)
    }
}

pub fn remove_nonexistent_files(source: &String, dest: &String) {
    let paths = fs::read_dir(Path::new(dest));

    match paths {
        Ok(paths) => {
            for path in paths {
                match path {
                    Ok(path) => {
                        let dest_path = path.borrow().path().display().to_string();
                        let replace_dest_to_source = str::replace(&dest_path, dest, source);
                        let source_path = Path::new(&replace_dest_to_source);

                        // println!("dest path: {:?}", dest_path);

                        if source_path.exists() {
                            // println!("path exist: {:?}", source_path.exists());
                        } else {
                            let from_paths = vec![dest_path];
                            // println!("path dont exist, delete: {:?}", from_paths);
                            let _ = fs_extra::remove_items(&from_paths);
                        }
                    }
                    Err(error) => println!("Error: {}", error),
                }
            }
        }
        Err(error) => println!("Error: {}", error),
    }
}

pub fn filter(path: &PathBuf) -> bool {
    // if is_greater_than(path, 10) {
    //     return true;
    // }
        println!("filter path: {:?}", path);
    true
}

// pub fn is_greater_than(path: &PathBuf, megabytes: u64) -> bool {
//     let max_bytes: u64 = 1048576 * megabytes; // 10MB

//     let metadata = std::fs::metadata(path);

//     let result = match metadata {
//         Ok(file) => file.len() > max_bytes,
//         _ => false,
//     };

//     result
// }
