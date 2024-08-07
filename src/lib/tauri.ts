export async function tauriWindow() {
  if (typeof window !== 'undefined') {
    const appWindow = await import('@tauri-apps/api/window')
    return appWindow
  }
  return null
}
