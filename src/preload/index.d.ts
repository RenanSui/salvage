// eslint-disable-next-line prettier/prettier
import { ElectronAPI } from '@electron-toolkit/preload';
// eslint-disable-next-line prettier/prettier
import { OpenDialogReturnValue } from 'electron';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      copyFiles: () => void

      closeApp: () => void
      minimizeApp: () => void

      getDialogPath: () => OpenDialogReturnValue
      getIsDev: () => boolean

      watchPath: (globalPaths: string, id: unknown) => void
      unwatchPath: (globalPaths: string, id: unknown) => void
      observeWatch: () => void
      openPath: (folderPath: string) => void

      getStore: <T>(key: string) => T
      setStore: (key: string, val: unknown) => void

      installUpdate: () => void
      getAppVersion: () => { version: string }
    }
  }
}
