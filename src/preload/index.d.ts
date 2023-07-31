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

      get: <T>(key: string) => T
      set: (key: string, val: unknown) => void
    }
  }
}
