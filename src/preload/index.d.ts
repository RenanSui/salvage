// eslint-disable-next-line prettier/prettier
import { ElectronAPI } from '@electron-toolkit/preload';
// eslint-disable-next-line prettier/prettier
import { OpenDialogReturnValue } from 'electron';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      closeApp: () => void
      minimizeApp: () => void

      getDialogPath: () => OpenDialogReturnValue
      getIsDev: () => boolean

      watchPath: (path: string, id: unknown) => void
      unwatchPath: (path: string, id: unknown) => void
      observeWatch: () => void
      openPath: (folderPath: string) => void

      getStore: <T>(key: string) => T
      setStore: (key: string, val: unknown) => void

      installUpdate: () => void
      getAppVersion: () => { version: string }
    }
  }
}
