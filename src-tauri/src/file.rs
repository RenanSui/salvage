use crate::logger::logger::{self as Logger};
use std::path::{Path, PathBuf};
use tokio::fs;
use walkdir::WalkDir;

pub async fn initial_copy_files<P: AsRef<Path>, Q: AsRef<Path>>(
    source: P,
    dest: Q,
    exclusions: &Vec<String>,
    id: String,
    window: tauri::Window,
    show_logs: Option<bool>,
) -> std::io::Result<()> {
    let source_path = source.as_ref();
    let dest_path = dest.as_ref();

    if source_path.is_file() {
        let file_name = source_path.file_name().unwrap();
        let dest_file_path = dest_path.join(file_name).display().to_string();
        copy_modified_file(
            window,
            source_path.to_path_buf(),
            &dest_file_path,
            id,
            show_logs,
        )
        .await;
        return Ok(());
    }

    // if source is directory
    for entry in WalkDir::new(source_path) {
        let path = entry?.into_path();
        if !path.is_dir()
            && !path_have_exclusions(
                window.clone(),
                &path,
                exclusions.to_owned(),
                id.clone(),
                show_logs,
            )
            .await
        {
            // if let Ok(relative_path) = path.strip_prefix(source_path) {
            //     let dest_file_path = dest_path.join(relative_path);
            //     copy_modified_file(
            //         window.clone(),
            //         path,
            //         &dest_file_path.display().to_string(),
            //         id.clone(),
            //         show_logs,
            //     )
            //     .await;
            // }
        }
    }

    Ok(())
}

pub async fn handle_file_modified<P: AsRef<Path>, Q: AsRef<Path>>(
    path: P,
    source: P,
    dest: Q,
    exclusions: Vec<String>,
    id: String,
    window: tauri::Window,
) -> std::io::Result<()> {
    let path = path.as_ref();
    let source = source.as_ref();
    let dest = dest.as_ref();

    // Check if the path should be excluded
    if path_have_exclusions(
        window.clone(),
        &path.to_path_buf(),
        exclusions,
        id.clone(),
        Some(true),
    )
    .await
    {
        return Ok(());
    }

    // Handle directories first
    if path.is_dir() {
        if let Ok(relative_path) = path.strip_prefix(source) {
            let dest_dir_path = dest.join(relative_path);
            // Ensure the directory exists at the destination
            let dir_creation_result = std::fs::create_dir_all(&dest_dir_path);
            match dir_creation_result {
                Ok(_) => {
                    println!("log: {:?}", &dest_dir_path);
                    Logger::log_event(
                        &window,
                        id.clone(),
                        // format!("Directory created: ...{:?}", dest_dir_path),
                        format!("{:?}", dest_dir_path),
                        Logger::LogEventType::Create,
                        Some(true),
                    );
                    // println!("# Directory created: {:?}", dest_dir_path);
                }
                Err(error) => {
                    Logger::log_event(
                        &window,
                        id.clone(),
                        // format!("Error creating directory: ...{:?}", error),
                        format!("{:?}", error),
                        Logger::LogEventType::Error,
                        Some(true),
                    );
                    // println!("# Error creating directory: {:?}", error)
                }
            }
        }
    }

    // Handle files
    if path.is_file() {
        let relative_path = match path.strip_prefix(source) {
            Ok(relative) => {
                if relative.as_os_str().is_empty() {
                    // If relative path is empty, use the file name
                    path.file_name().unwrap().as_ref()
                } else {
                    relative
                }
            }
            Err(_) => path.file_name().unwrap().as_ref(),
        };

        let dest_file_path = dest.join(relative_path);

        // Ensure the parent directory exists before copying the file
        if let Some(parent_dir) = dest_file_path.parent() {
            let dir_creation_result = std::fs::create_dir_all(parent_dir);
            match dir_creation_result {
                Ok(_) => {
                    // Logger::log_event(
                    //     &window,
                    //     id.clone(),
                    //     format!("Directory created: {:?}", parent_dir),
                    // );
                    // println!("# Directory created: {:?}", parent_dir);
                }
                Err(error) => {
                    Logger::log_event(
                        &window,
                        id.clone(),
                        // format!("Error creating directory: ...{:?}", error),
                        format!("{:?}", error),
                        Logger::LogEventType::Error,
                        Some(true),
                    );
                    // println!("# Error creating directory: {:?}", error);
                }
            }
        }

        // Copy the file and handle any errors
        copy_modified_file(
            window,
            path.to_path_buf(),
            &dest_file_path.display().to_string(),
            id,
            Some(true),
        )
        .await;
    }

    Ok(())
}

pub async fn path_have_exclusions(
    window: tauri::Window,
    path: &PathBuf,
    exclusions: Vec<String>,
    id: String,
    show_logs: Option<bool>,
) -> bool {
    let mut contain_exclusion = false;

    if exclusions.is_empty() {
        return false;
    }

    let path_string = match path.display().to_string().replace("/", "\\") {
        s => s,
    };

    for exclusion in exclusions {
        if path_string.contains(&exclusion) {
            if show_logs.unwrap_or(false) {
                // Uncomment and ensure that Logger does not panic
                Logger::log_event(
                    &window,
                    id.clone(),
                    format!("{:?}", path),
                    Logger::LogEventType::Excluded,
                    show_logs,
                );
            }
            contain_exclusion = true;
            break;
        }
    }
    // for exclusion in exclusions {
    //     let result = path
    //         .display()
    //         .to_string()
    //         .contains(&exclusion.replace("/", "\\"));
    //     if result {
    //         if let Some(_) = show_logs {
    //             // Logger::log_event(
    //             //     &window,
    //             //     id.clone(),
    //             //     format!("{:?}", path),
    //             //     Logger::LogEventType::Excluded,
    //             //     show_logs,
    //             // );
    //         }
    //         contain_exclusion = result
    //     }
    // }

    contain_exclusion
}

pub async fn is_file_modified<P: AsRef<Path>, Q: AsRef<Path>>(
    src: P,
    dir: Q,
) -> std::io::Result<bool> {
    let src_modified_time = src.as_ref().metadata()?.modified()?;
    let dir_modified_time = dir.as_ref().metadata()?.modified()?;

    let is_modified = src_modified_time > dir_modified_time;
    Ok(is_modified)
}

pub async fn copy_modified_file(
    window: tauri::Window,
    path: PathBuf,
    copy_to: &String,
    id: String,
    show_logs: Option<bool>,
) {
    match path.exists() && Path::new(&copy_to).exists() {
        true => match is_file_modified(&path, &copy_to).await {
            Ok(is_modified) => {
                if is_modified {
                    if let Some(_) = show_logs {
                        Logger::log_event(
                            &window,
                            id.clone(),
                            format!("{:?}", path),
                            Logger::LogEventType::Modified,
                            show_logs,
                        );
                    }
                    create_file_dir(&copy_to, id.clone(), window.clone(), show_logs).await;
                    copy_file_to_dir(path, copy_to, id, window, show_logs).await;
                } else {
                    Logger::log_event(
                        &window,
                        id.clone(),
                        format!("{:?}", path),
                        Logger::LogEventType::NotModified,
                        show_logs,
                    );
                }
            }
            Err(error) => {
                if let Some(_) = show_logs {
                    Logger::log_event(
                        &window,
                        id.clone(),
                        format!("{:?}", error),
                        Logger::LogEventType::Error,
                        show_logs,
                    );
                }
            }
        },
        false => {
            create_file_dir(&copy_to, id.clone(), window.clone(), show_logs).await;
            copy_file_to_dir(path, copy_to, id, window, show_logs).await;
        }
    }
}

pub async fn create_file_dir<P: AsRef<Path>>(
    dir: P,
    id: String,
    window: tauri::Window,
    show_logs: Option<bool>,
) -> Option<()> {
    let dir_parent = dir.as_ref().parent()?;

    match !dir_parent.exists() {
        true => match fs::create_dir_all(dir_parent).await {
            Ok(_) => {
                if let Some(_) = show_logs {
                    Logger::log_event(
                        &window,
                        id.clone(),
                        format!("{:?}", dir_parent),
                        Logger::LogEventType::Create,
                        show_logs,
                    );
                }
            }
            Err(error) => {
                if let Some(_) = show_logs {
                    Logger::log_event(
                        &window,
                        id.clone(),
                        format!("{:?}", error),
                        Logger::LogEventType::Error,
                        show_logs,
                    );
                }
            }
        },
        false => (),
    }

    Some(())
}

pub async fn copy_file_to_dir<P: AsRef<Path>, Q: AsRef<Path>>(
    src: P,
    dir: Q,
    id: String,
    window: tauri::Window,
    show_logs: Option<bool>,
) -> Option<()> {
    match fs::copy(src.as_ref(), dir.as_ref()).await {
        Ok(_) => {
            if let Some(_) = show_logs {
                Logger::log_event(
                    &window,
                    id.clone(),
                    format!("{:?}", dir.as_ref()),
                    Logger::LogEventType::Copy,
                    show_logs,
                );
            }
        }
        Err(error) => {
            if let Some(_) = show_logs {
                Logger::log_event(
                    &window,
                    id.clone(),
                    format!("{:?}", error),
                    Logger::LogEventType::Error,
                    show_logs,
                );
            }
        }
    }

    Some(())
}
