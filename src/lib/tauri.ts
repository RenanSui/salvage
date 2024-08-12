import { InvokeArgs } from '@tauri-apps/api/tauri'

type tauriInvokeCmdArgs =
  | 'get_file'
  | 'get_folder'
  | 'get_all_backups'
  | 'get_backup_by_id'
  | 'add_backup'
  | 'update_backup_name'
  | 'update_backup_source'
  | 'update_backup_destination'
  | 'update_backup_exclusions'
  | 'remove_backup'

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
