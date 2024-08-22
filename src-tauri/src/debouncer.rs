use debounce::EventDebouncer;
use std::sync::Arc;
use std::time::Duration;

pub struct Debouncer {
    pub id: u64, // Unique identifier for comparison
    pub function: Arc<dyn Fn() + Send + Sync + 'static>,
}

// Manual implementation of PartialEq, excluding the closure comparison
impl PartialEq for Debouncer {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

pub fn debouncer() -> EventDebouncer<Debouncer> {
    let delay = Duration::from_millis(300);
    let debouncer = EventDebouncer::new(delay, move |props: Debouncer| {
        (props.function)();
    });
    debouncer
}
