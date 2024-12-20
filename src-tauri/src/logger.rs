pub mod logger {
    use chrono::{DateTime, Local};
    use serde::Serialize;
    use tauri::Emitter;

    #[derive(Clone, Debug, Serialize)]
    pub enum LogEventType {
        Copy,
        Create,
        Update,
        Excluded,
        Modified,
        NotModified,
        // Watcher
        Start,
        Stop,
        // Errors
        Error,
    }

    #[derive(Clone, Debug, Serialize)]
    pub struct LogMessage {
        id: String,
        message: String,
        month: String,
        day: String,
        timestamp: String,
        event_type: LogEventType,
    }

    pub fn log_event<S: Into<String>>(
        window: &tauri::WebviewWindow,
        id: String,
        message: S,
        event_type: LogEventType,
        show_logs: Option<bool>,
    ) {
        match show_logs {
            Some(_) => {
                let now: DateTime<Local> = Local::now();
                let timestamp = now.format("%H:%M:%S").to_string();
                let milliseconds = now.timestamp_subsec_millis();

                let log_message = LogMessage {
                    id,
                    message: message.into(),
                    month: now.format("%b").to_string(),
                    day: now.format("%d").to_string(),
                    timestamp: format!("{}.{:03}", timestamp, milliseconds),
                    event_type,
                };

                if let Err(e) = window.emit_to("main", "log-message", log_message) {
                    eprintln!("Failed to emit log message: {:?}", e);
                }
                // if let Err(e) = window.emit_to("log-message", log_message) {
                //     eprintln!("Failed to emit log message: {:?}", e);
                // }
                // if let Err(e) = window.emit("log-message", log_message) {
                //     eprintln!("Failed to emit log message: {:?}", e);
                // }
            }
            None => (),
        }
    }
}
