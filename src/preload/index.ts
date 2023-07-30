// eslint-disable-next-line prettier/prettier
import { electronAPI } from '@electron-toolkit/preload';
// eslint-disable-next-line prettier/prettier
import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const api = {
  copyFiles: (dir: { srcDir: string; destDir: string }) =>
    ipcRenderer.send('copyFiles', dir),
  updatePathJson: () => ipcRenderer.send('write-path-to-json'),
  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('min-app'),
  get: (key) => ipcRenderer.sendSync('electron-store-get', key),
  set: (key, val) => ipcRenderer.send('electron-store-set', key, val),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
