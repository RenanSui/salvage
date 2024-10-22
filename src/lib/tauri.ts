import { type InvokeArgs } from '@tauri-apps/api/tauri'

type tauriInvokeCmdArgs =
  | 'select_file'
  | 'select_folder'
  | 'fetch_all_backups'
  | 'fetch_backup_by_id'
  | 'create_backup'
  | 'rename_backup'
  | 'change_backup_source'
  | 'change_backup_destination'
  | 'modify_backup_exclusions'
  | 'delete_backup'
  | 'open_in_explorer'
  // Watcher
  | 'load_backups'
  | 'start_watching'
  | 'stop_watching'
  | 'restart_backups'
  | 'start_individual_backup'
  | 'stop_individual_backup'
  | 'restart_individual_backup'
  // Statistics
  | 'fetch_file_sizes_by_id'

export async function tauriWindow() {
  if (typeof window !== 'undefined') {
    const appWindow = await import('@tauri-apps/api/window')
    return appWindow
  }
  return null
}

export async function tauriInvoke<T>(cmd: tauriInvokeCmdArgs, args?: InvokeArgs | undefined): Promise<T | null> {
  if (typeof window !== 'undefined') {
    const tauriAppsApi = await import('@tauri-apps/api')
    const tauriInvoke = tauriAppsApi.invoke
    return tauriInvoke(cmd, args)
  }
  return null
}
