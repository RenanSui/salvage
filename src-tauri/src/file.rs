use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub fn initial_copy_files<P: AsRef<Path>, Q: AsRef<Path>>(
    source: P,
    dest: Q,
    exclusions: &Vec<String>,
) -> std::io::Result<()> {
    if source.as_ref().is_file() {
        let source = source.as_ref().to_path_buf();
        let dest = dest.as_ref().to_path_buf().display().to_string();
        let source_display = source.display().to_string();
        let source_path = Path::new(&source_display);
        let source_parent = source_path.parent();

        match source_parent {
            Some(source_parent) => {
                let source_parent_display = source_parent.display().to_string();
                let copy_to = source_display.replace(&source_parent_display, &dest);
                copy_modified_file(source, &copy_to);
            }
            None => (),
        }

        return Ok(());
    }

    // if source is directory
    let mut paths: Vec<PathBuf> = Vec::new();

    for entry in WalkDir::new(&source) {
        let path = entry?.into_path();
        if !path.is_dir() && !path_have_exclusions(&path, exclusions.to_owned()) {
            paths.push(path);
        }
    }

    for path in paths {
        if let Some(source_parent) = source.as_ref().parent() {
            let source = &source_parent.display().to_string();
            let dest = &dest.as_ref().display().to_string();
            let copy_to = path.display().to_string().replace(source, dest);
            copy_modified_file(path, &copy_to);
        }
    }

    Ok(())
}

pub fn handle_file_modified(
    path: PathBuf,
    source: PathBuf,
    dest: PathBuf,
    exclusions: Vec<String>,
) -> Option<()> {
    if path_have_exclusions(&path, exclusions) {
        return Some(());
    }

    if !path.exists() {
        return Some(());
    }

    let copy_to: String;

    if path.is_dir() {
        copy_to = path.to_str()?.replace(source.to_str()?, dest.to_str()?);
    } else {
        copy_to = path
            .to_str()?
            .replace(source.parent()?.to_str()?, dest.to_str()?);
    }

    copy_modified_file(path, &copy_to);

    Some(())
}

pub fn path_have_exclusions(path: &PathBuf, exclusions: Vec<String>) -> bool {
    let mut contain_exclusion = false;

    for exclusion in exclusions {
        let result = path.display().to_string().contains(&exclusion.replace("/", "\\"));
        if result {
            println!("# Path Excluded: {:?}", path);
            contain_exclusion = result
        }
    }

    contain_exclusion
}

pub fn is_file_modified<P: AsRef<Path>, Q: AsRef<Path>>(src: P, dir: Q) -> std::io::Result<bool> {
    let src_modified_time = src.as_ref().metadata()?.modified()?;
    let dir_modified_time = dir.as_ref().metadata()?.modified()?;

    let is_modified = src_modified_time > dir_modified_time;
    Ok(is_modified)
}

pub fn copy_modified_file(path: PathBuf, copy_to: &String) {
    match path.exists() && Path::new(&copy_to).exists() {
        true => match is_file_modified(&path, &copy_to) {
            Ok(is_modified) => {
                if is_modified {
                    println!("# Path modified: {:?}", path);
                    create_file_dir(&copy_to);
                    copy_file_to_dir(path, copy_to);
                } else {
                    println!("# Path NOT modified: {:?}", path);
                }
            }
            Err(error) => println!("# Error file modified: {:?}", error),
        },
        false => {
            create_file_dir(&copy_to);
            copy_file_to_dir(path, copy_to);
        }
    }
}

pub fn create_file_dir<P: AsRef<Path>>(dir: P) -> Option<()> {
    let dir_parent = dir.as_ref().parent()?;

    match !dir_parent.exists() {
        true => match fs::create_dir_all(dir_parent) {
            Ok(_) => println!("# Dir created: {:?}", dir_parent),
            Err(error) => println!("# Error creating Dir: {:?}", error),
        },
        false => (),
    }

    Some(())
}

pub fn copy_file_to_dir<P: AsRef<Path>, Q: AsRef<Path>>(src: P, dir: Q) -> Option<()> {
    let copy_result = fs::copy(src.as_ref(), dir.as_ref());

    match copy_result {
        Ok(_) => println!("# File copied: {:?}", dir.as_ref()),
        Err(error) => println!("# Error copying file: {:?}", error),
    }

    Some(())
}
