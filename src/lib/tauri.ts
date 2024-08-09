import { InvokeArgs } from '@tauri-apps/api/tauri'

type tauriInvokeCmdArgs =
  | 'get_salvage_items'
  | 'add_salvage_item'
  | 'get_file'
  | 'get_folder'
  | 'update_salvage_item_name'
  | 'update_salvage_item_source'
  | 'update_salvage_item_destination'
  | 'update_salvage_item_exclusions'
  | 'remove_salvage_item'

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
