use std::path::Path;
use std::path::PathBuf;


pub fn create_file(mut paths: Vec<PathBuf>, dest: &String) {
      for path in paths.iter() {
        // println!("path: {:?}", path);
        let max_bytes = 1048576 * 10; // 10MB
        let metadata = std::fs::metadata(path);

        match metadata {
          Ok(file) => {
            println!("is Dir: {:?}", file.is_dir());
            println!("is File: {:?}", file.is_file());
            println!("Length: {:?}", file.len());
          },
          Err(error) => println!("Error: {:?}", error)
        }
        // println!("max bytes: {}", max_bytes)
    }
}

pub fn copy_file(mut paths: Vec<PathBuf>, dest: &String) {
      for path in paths.iter() {
        // println!("path: {:?}", path);
        let max_bytes = 1048576 * 10; // 10MB
        let metadata = std::fs::metadata(path);

        match metadata {
          Ok(file) => {
            println!("is Dir: {:?}", file.is_dir());
            println!("is File: {:?}", file.is_file());
            println!("Length: {:?}", file.len());
            println!("Exist?: {}", path.exists());
          },
          Err(error) => println!("Error: {:?}", error)
        }
        // println!("max bytes: {}", max_bytes)
    }


    let dest_path = Path::new(&dest);

    let options = fs_extra::dir::CopyOptions::new();

    let mut from_paths: Vec<PathBuf> = Vec::new();

    from_paths.append(&mut paths);

    println!("copy: {:?}", from_paths);

    let _ = fs_extra::copy_items(&from_paths, &dest_path, &options);
}

pub fn delete_file(paths: Vec<PathBuf>, source: &String, dest: &String) {
    for path in paths.iter() {
        let file_path = path.to_str().expect("");

        let dest = str::replace(file_path, source, dest);

        let dest_path = Path::new(dest.as_str()).to_path_buf();

        let from_paths = vec![dest_path];

        println!("delete: {:?}", from_paths);

        let _ = fs_extra::remove_items(&from_paths);
    }
}
