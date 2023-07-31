// eslint-disable-next-line prettier/prettier
import { electronAPI } from '@electron-toolkit/preload';
// eslint-disable-next-line prettier/prettier
import { contextBridge, ipcRenderer } from 'electron';
// eslint-disable-next-line prettier/prettier
import { CopyFiles } from './types';

// Custom APIs for renderer
const api = {
  copyFiles: (dir: CopyFiles) => ipcRenderer.send('copy-files', dir),

  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('min-app'),

  watchPath: (srcDir) => ipcRenderer.send('watch-path', srcDir),
  unwatchPath: (path, id) => ipcRenderer.send('unwatch-path', path, id),
  observeWatch: () => ipcRenderer.send('observe-watch'),

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
