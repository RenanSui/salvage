import type { EventCallback, EventName } from '@tauri-apps/api/event'
import type { InvokeArgs } from '@tauri-apps/api/tauri'

const isNode = (): boolean =>
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0,
  ) === '[object process]'

export async function invoke<T>(
  cmd: string,
  args?: InvokeArgs | undefined,
): Promise<T> {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown as T)
  }
  const tauriAppsApi = await import('@tauri-apps/api')
  const tauriInvoke = tauriAppsApi.invoke
  return tauriInvoke(cmd, args)
}

export async function emit(event: string, payload?: unknown): Promise<void> {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown as void)
  }
  const tauriAppsApi = await import('@tauri-apps/api')
  const tauriEventEmit = tauriAppsApi.event.emit
  return tauriEventEmit(event, payload)
}

export async function listen<T>(event: EventName, handler: EventCallback<T>) {
  if (isNode()) {
    // This shouldn't ever happen when React fully loads
    return Promise.resolve(undefined as unknown)
  }
  const tauriAppsApi = await import('@tauri-apps/api')
  const tauriEventListen = tauriAppsApi.event.listen
  return tauriEventListen(event, handler)
}

export async function window() {
  const window = await import('@tauri-apps/api/window')
  return window
}
