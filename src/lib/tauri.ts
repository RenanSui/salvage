import { InvokeArgs } from '@tauri-apps/api/tauri'

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

export async function tauriWindow() {
  if (typeof window !== 'undefined') {
    const appWindow = await import('@tauri-apps/api/window')
    return appWindow
  }
  return null
}

export async function tauriInvoke<T>(
  cmd: tauriInvokeCmdArgs,
  args?: InvokeArgs | undefined,
): Promise<T | null> {
  if (typeof window !== 'undefined') {
    const tauriAppsApi = await import('@tauri-apps/api')
    const tauriInvoke = tauriAppsApi.invoke
    return tauriInvoke(cmd, args)
  }
  return null
}
