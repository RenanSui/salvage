import { InvokeArgs } from '@tauri-apps/api/tauri'

export async function tauriWindow() {
  if (typeof window !== 'undefined') {
    const appWindow = await import('@tauri-apps/api/window')
    return appWindow
  }
  return null
}

export async function tauriInvoke<T>(
  cmd: string,
  args?: InvokeArgs | undefined,
): Promise<T | null> {
  if (typeof window !== 'undefined') {
    const tauriAppsApi = await import('@tauri-apps/api')
    const tauriInvoke = tauriAppsApi.invoke
    return tauriInvoke(cmd, args)
  }
  return null
}
