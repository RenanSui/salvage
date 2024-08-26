pub mod logger {
    use chrono::{DateTime, Local};
    use serde::Serialize;

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
        window: &tauri::Window,
        id: String,
        message: S,
        event_type: LogEventType,
    ) {
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

        if let Err(e) = window.emit("log-message", log_message) {
            eprintln!("Failed to emit log message: {:?}", e);
        }
    }
}
