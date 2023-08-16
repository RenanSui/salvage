import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import chokidar from 'chokidar'
import console from 'console'
import { BrowserWindow, Tray, app, dialog, ipcMain, shell } from 'electron'
import log from 'electron-log'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import fse from 'fs-extra'
import path from 'path'
import { ISalvageItem } from '../preload/types'
import { compareTwoStrings } from './utils'

// const placeholderPath = path.join(process.resourcesPath, 'placeholder.txt')

// fse.writeFile(placeholderPath, 'placeholder')

const watcher = chokidar.watch(process.resourcesPath, {
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 5000,
  },
  ignoreInitial: true,
})

// LOGGER
const logger = console.log.bind(console)
watcher
  .on('add', (path) => logger(`File ${path} has been added`))
  .on('change', (path) => logger(`File ${path} has been changed`))
  .on('unlink', (path) => logger(`File ${path} has been removed`))
  .on('add', (filePath) => {
    console.log({ filePath })

    const pathItems = store.get('pathItems') as ISalvageItem[]

    const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))
    const { destDir, srcDir } = pathItem[0]

    if (filePath.includes(path.join(srcDir)) === true) {
      copyDir(srcDir, destDir)
    }
  })
  .on('change', (filePath) => {
    const pathItems = store.get('pathItems') as ISalvageItem[]

    const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

    const { destDir, srcDir } = pathItem[0]

    console.log({ filePath })
    console.log({ srcDir })
    console.log({ destDir })

    if (filePath.includes(path.join(srcDir)) === true) {
      copyDir(srcDir, destDir)
    }
  })
  .on('unlink', (filePath) => {
    console.log({ filePath })

    const pathItems = store.get('pathItems') as ISalvageItem[]

    const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

    const { destDir, srcDir } = pathItem[0]

    console.log({ srcDir })
    console.log({ destDir })

    fse.removeSync(destDir)
    fse.copy(srcDir, destDir)
  })
// .on('addDir', (path) => logger(`Directory ${path} has been added`))
// .on('unlinkDir', (path) => logger(`Directory ${path} has been removed`))
// .on('error', (error) => logger(`Watcher error: ${error}`))
// .on('ready', () => logger('Initial scan complete. Ready for changes'))
// .on('raw', (event, path, details) => {
//   // internal
//   logger('Raw event info:', event, path, details)
// })

let mainWindow: BrowserWindow, tray: Tray

let updateInterval: NodeJS.Timer | null = null

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

  // check for updates
  updateInterval = setInterval(() => autoUpdater.checkForUpdates(), 600000)
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

ipcMain.on('env', (event) => {
  event.returnValue = is.dev
})

ipcMain.on('electron-store-get', (event, val) => {
  event.returnValue = store.get(val)
})

ipcMain.on('electron-store-set', (_, key, val) => {
  store.set(key, val)
})

ipcMain.on('open-path', (_event, folderPath) => {
  const exist = !fse.existsSync(folderPath)

  if (exist) fse.mkdirSync(folderPath, { recursive: true })

  shell.openPath(path.join(folderPath))
})

let unwatchPaths: string[] = []

ipcMain.on('watch-path', (_, globalPaths, id: string) => {
  if (unwatchPaths.includes(id)) {
    unwatchPaths = unwatchPaths.filter((pathId: string) => pathId !== id)
  }

  const globalStoragePaths = store.get(globalPaths) as ISalvageItem[]

  const newWatchedPaths = globalStoragePaths
    .filter((pathItem) => !unwatchPaths.includes(pathItem.id))
    .map((pathItem) => pathItem.srcDir)

  newWatchedPaths.map((path) => {
    if (fse.existsSync(path)) {
      watcher.add(path)
    }

    return null
  })

  console.log(watcher.getWatched())
})

ipcMain.on('unwatch-path', async (_, globalPaths, id: string) => {
  if (!unwatchPaths.includes(id)) {
    unwatchPaths.push(id)
  }

  const globalStoragePaths = store.get(globalPaths) as ISalvageItem[]

  const newWatchedPaths = globalStoragePaths
    .filter((pathItem) => pathItem.id === id)
    .map((pathItem) => pathItem.srcDir)

  newWatchedPaths.map((pathItem) => {
    watcher.unwatch(path.join(pathItem, '**'))

    return null
  })

  console.log(watcher.getWatched())
})

// watcher.on('change', (filePath) => {
//   const pathItems = store.get('pathItems') as ISalvageItem[]

//   const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

//   const { destDir, srcDir } = pathItem[0]

//   console.log({ filePath })
//   console.log({ srcDir })
//   console.log({ destDir })

//   if (filePath.includes(path.join(srcDir)) === true) {
//     copyDir(srcDir, destDir)
//   }
// })

// watcher.on('add', (filePath) => {
//   console.log({ filePath })

//   const pathItems = store.get('pathItems') as ISalvageItem[]

//   const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))
//   const { destDir, srcDir } = pathItem[0]

//   if (filePath.includes(path.join(srcDir)) === true) {
//     copyDir(srcDir, destDir)
//   }
// })

ipcMain.on('copy-files', () => {
  console.log('copy-files')
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

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify()
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
