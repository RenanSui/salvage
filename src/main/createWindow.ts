import { BrowserWindow, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import { iconPath, windowURL } from './utils'

let windowInstance: BrowserWindow, trayInstance: Tray

export const createWindowAndTray = () => {
  createWindow()
  createTray()
  return { windowInstance, trayInstance }
}

export const createTray = () => {
  trayInstance = new Tray(iconPath)

  trayInstance.setToolTip('Salvage\nClick to Restore')

  trayInstance.on('click', () => {
    if (windowInstance.isVisible() === true) {
      windowInstance.hide()
    } else {
      windowInstance.show()
    }
  })
}

export const createWindow = () => {
  windowInstance = new BrowserWindow({
    width: 360,
    height: 576,
    frame: false,
    resizable: false,
    fullscreenable: false,
    transparent: true,
    show: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false,
      nodeIntegration: true,
      devTools: true,
    },
  })

  windowInstance.loadURL(windowURL)

  // remove menu to stop the window being closed on Ctrl+W. See #121
  windowInstance.setMenu(null)

  // remove menu if windowInstance.setMenu(null) fails
  const WM_INITMENU = 0x0116
  windowInstance.hookWindowMessage(WM_INITMENU, () => {
    windowInstance.setEnabled(false)
    windowInstance.setEnabled(true)
  })

  windowInstance.on('ready-to-show', () => {
    windowInstance.show()
    autoUpdater.checkForUpdatesAndNotify()
  })

  windowInstance.on('close', () => trayInstance.destroy())
}
