import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      copyFiles: (dir: { srcDir: string; destDir: string }) => void
      closeApp: () => void
      minimizeApp: () => void
    }
    // ipcRenderer: {
    //   send: (channel: string, data: string[]) => void
    // }
  }
}
