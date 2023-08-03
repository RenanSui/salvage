import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import chokidar from 'chokidar'
import { BrowserWindow, Tray, app, dialog, ipcMain } from 'electron'
import log from 'electron-log'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import fse from 'fs-extra'
import path from 'path'
import { CopyFiles, ISalvageItem } from '../preload/types'
import { compareTwoStrings } from './utils'

const watcher = chokidar.watch(process.resourcesPath, {
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 5000,
  },
  ignoreInitial: true,
})

// LOGGER
// const logger = console.log.bind(console)
// watcher
//   .on('add', (path) => logger(`File ${path} has been added`))
//   .on('change', (path) => logger(`File ${path} has been changed`))
//   .on('unlink', (path) => logger(`File ${path} has been removed`))

let mainWindow: BrowserWindow, tray: Tray

const store = new Store({})

const windowURL =
  is.dev && process.env.ELECTRON_RENDERER_URL
    ? process.env.ELECTRON_RENDERER_URL
    : path.join('file://', __dirname, '../renderer/index.html')

const iconPath = is.dev
  ? path.join(__dirname, '../../resources/tray.png')
  : path.join(process.resourcesPath, 'app.asar.unpacked/resources/tray.png')

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  createWindow()
  createTray()

  // remove menu to stop the window being closed on Ctrl+W. See #121
  mainWindow.setMenu(null)
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

app.on('activate', () => mainWindow === null && createWindow())

ipcMain.on('observe-watch', () => console.log(watcher.getWatched()))

ipcMain.on('close-app', () => mainWindow.close())

ipcMain.on('min-app', () => mainWindow.hide())

ipcMain.on('env', async (event) => {
  event.returnValue = is.dev
})

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val)
})

ipcMain.on('electron-store-set', async (_, key, val) => {
  store.set(key, val)
})

ipcMain.on('watch-path', (_, srcDir) => {
  if (fse.existsSync(srcDir) === true) {
    watcher.add(srcDir)
    // console.log('watching', srcDir)
    // console.log('watching', path.join(srcDir))
  }
})

ipcMain.on('copy-files', (_, args: CopyFiles) => {
  const { srcDir, destDir } = args

  watcher.on('change', (filePath) => {
    if (filePath.includes(path.join(srcDir)) === true) {
      // console.log('changed item', path)
      copyDir(srcDir, destDir)
    }
  })
})

ipcMain.on('dialog-path-get', async (event) => {
  try {
    const dialogPath = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    event.returnValue = dialogPath
  } catch (error) {
    log.error(error)
  }
})

ipcMain.on('unwatch-path', (_, globalPaths, id) => {
  const globalStoragePaths = store.get(globalPaths) as ISalvageItem[]

  const newWatchedPaths = globalStoragePaths
    .filter((pathItem) => pathItem.id !== id && pathItem.srcDir)
    .map((pathItem) => pathItem.srcDir)

  watcher.close()

  watcher.add(newWatchedPaths)

  // console.log('unwatching', id)
  // console.log(newWatchedPaths)
})

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 360,
    height: 576,
    // height: 480,
    // height: 768,
    frame: false,
    resizable: false,
    fullscreenable: false,
    transparent: true,
    alwaysOnTop: true,
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

  mainWindow.loadURL(windowURL)

  mainWindow.on('close', () => tray.destroy())

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // remove menu if mainWindow.setMenu(null) fails
  const WM_INITMENU = 0x0116
  mainWindow.hookWindowMessage(WM_INITMENU, () => {
    mainWindow.setEnabled(false)
    mainWindow.setEnabled(true)
  })
}

const createTray = () => {
  tray = new Tray(iconPath)

  tray.setToolTip('Salvage\nClick to Restore')

  tray.on('click', () => {
    if (mainWindow.isVisible() === true) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

const getSimilarity = async (srcDir: string, destDir: string) => {
  try {
    const srcFile = await fse.readFile(srcDir, 'utf-8')
    const destDirFile = await fse.readFile(destDir, 'utf-8')

    const similarity = await compareTwoStrings(srcFile, destDirFile)
    const isSimilar = similarity === 1

    return isSimilar
  } catch (error) {
    log.error(error)
    return false
  }
}

const filterFunc = async (srcDir: string, destDir: string) => {
  try {
    const isSrcDir = fse.lstatSync(srcDir).isDirectory()

    if (isSrcDir) {
      if (!fse.existsSync(destDir)) fse.mkdirSync(destDir, { recursive: true })
      // console.log('is a Dir')
      return true
    }

    if (fse.existsSync(destDir) === false) {
      // console.log('do not exist')
      return true
    }

    const isSimilar = await getSimilarity(srcDir, destDir)

    if (isSimilar === false) {
      // console.log(srcDir)
      // console.log('Not a dir, and exist, and is not similar')
      return true
    }

    return false
  } catch (error) {
    log.error(error)
    return false
  }
}

const copyDir = async (srcDir: string, destDir: string) => {
  // console.log(`File has been changed`)

  if (fse.existsSync(destDir) === false) {
    fse.mkdirSync(destDir, { recursive: true })
  }

  try {
    await fse.copy(srcDir, destDir, { filter: filterFunc, overwrite: true })
    // console.log('success!')
  } catch (err) {
    // console.log('error!')
    log.error(err)
  }
}

let updateInterval: NodeJS.Timer | null = null

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available')
  updateInterval = null
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})

ipcMain.on('install-update', () => autoUpdater.quitAndInstall())

ipcMain.on('get-app-version', (event) => {
  event.returnValue = { version: app.getVersion() }
})

app.on('ready', () => {
  // check for updates
  if (import.meta.env.PROD) {
    autoUpdater.checkForUpdates()
    // updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 600000)
    console.log(updateInterval)
  }
})
