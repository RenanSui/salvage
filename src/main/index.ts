import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import * as chokidar from 'chokidar'
import { BrowserWindow, Tray, app, ipcMain } from 'electron'
import log from 'electron-log'
import Store from 'electron-store'
import fs from 'fs'
import fse from 'fs-extra'
import path, { join } from 'path'
import { CopyFiles, ISalvageItem } from '../preload/types'
import { compareTwoStrings } from './utils'

const watcher = chokidar.watch(process.resourcesPath, {
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 5000,
  },
})

// LOGGER
// const log = console.log.bind(console)
// watcher
//   .on('add', (path) => log(`File ${path} has been added`))
//   .on('change', (path) => log(`File ${path} has been changed`))
//   .on('unlink', (path) => log(`File ${path} has been removed`))

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
  if (fs.existsSync(srcDir) === true) {
    watcher.add(srcDir)
    // console.log('watching', srcDir)
  }
})

ipcMain.on('copy-files', (_, args: CopyFiles) => {
  const { srcDir, destDir } = args

  watcher.on('change', (path) => {
    if (path.includes(join(srcDir)) === true) {
      // console.log('changed item', path)
      copyDir(srcDir, destDir)
    }
  })
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
    const isSrcDir = fs.lstatSync(srcDir).isDirectory()

    if (isSrcDir) {
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
      // console.log('is a Dir')
      return true
    }

    if (fs.existsSync(destDir) === false) {
      // console.log('do not exist')
      return true
    }

    const isSimilar = await getSimilarity(srcDir, destDir)

    if (isSimilar === false) {
      console.log(srcDir)
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

  if (fs.existsSync(destDir) === false) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  try {
    await fse.copy(srcDir, destDir, { filter: filterFunc, overwrite: true })
    // console.log('success!')
  } catch (err) {
    // console.log('error!')
    log.error(err)
  }
}
