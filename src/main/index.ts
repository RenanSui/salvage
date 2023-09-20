import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, Tray, app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { getDialogPath, handleOpenPath, unwatchPath, watchPath } from './paths'
import { createWindowAndTray } from './createWindow'
import { getStore, setStore } from './store'
import {
  handleAddFile,
  handleChangeFile,
  watcher,
  handleDeleteFile,
} from './watcher'

let mainWindow: BrowserWindow
let tray: Tray
let updateInterval: NodeJS.Timer | null = null

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  const { windowInstance, trayInstance } = createWindowAndTray()

  mainWindow = windowInstance
  tray = trayInstance

  mainWindow.hide()

  // check for updates
  updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 1000 * 600) // every 10 minutes
})

app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    tray.destroy()
  }
})

app.on('activate', () => mainWindow === null && createWindowAndTray())

// Close and Minimize
ipcMain.on('close-app', () => mainWindow.close())
ipcMain.on('min-app', () => mainWindow.hide())

// store
ipcMain.on('electron-store-get', (event, val) => getStore(event, val))
ipcMain.on('electron-store-set', (_, key, val) => setStore(key, val))

// path handlers
ipcMain.on('open-path', (_event, folderPath) => handleOpenPath(folderPath))
ipcMain.on('dialog-path-get', (event) => getDialogPath(event))
ipcMain.on('watch-path', (_, path, id) => watchPath(path, id))
ipcMain.on('unwatch-path', (_, path, id) => unwatchPath(path, id))

// watcher
ipcMain.on('observe-watch', () => console.log(watcher.getWatched()))
watcher
  .on('add', (filePath) => handleAddFile(filePath))
  .on('change', (filePath) => handleChangeFile(filePath))
  .on('unlink', (filePath) => handleDeleteFile(filePath))

// is environment dev
ipcMain.on('env', (event) => (event.returnValue = is.dev))

// Auto Updater Handler
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available')
  updateInterval = null
  console.log(updateInterval)
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})

ipcMain.on('install-update', () => autoUpdater.quitAndInstall())

ipcMain.on('get-app-version', (event) => {
  event.returnValue = { version: app.getVersion() }
})
