// eslint-disable-next-line prettier/prettier
import { ElectronAPI } from '@electron-toolkit/preload';
import { OpenDialogReturnValue } from 'electron'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      copyFiles: (dir: { srcDir: string; destDir: string }) => void

      closeApp: () => void
      minimizeApp: () => void
      getIsDev: () => boolean

      getDialogPath: () => OpenDialogReturnValue

      watchPath: (srcDir: string) => void
      unwatchPath: (path: string, id: unknown) => void
      observeWatch: () => void

      getStore: <T>(key: string) => T
      setStore: (key: string, val: unknown) => void
    }
  }
}
