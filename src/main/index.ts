import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import * as chokidar from 'chokidar'
import { BrowserWindow, Tray, app, ipcMain } from 'electron'
import Store from 'electron-store'
import fs from 'fs'
import fse from 'fs-extra'
import path, { join } from 'path'
import { compareTwoStrings } from 'string-similarity'

export interface ISalvageItem {
  id: number
  title: string
  srcDir: string
  destDir: string
}

// watchet test
const watcher = chokidar.watch(process.resourcesPath, {
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100,
  },
  atomic: true,
})

watcher.close()

// LOGGER
const log = console.log.bind(console)
watcher
  .on('add', (path) => log(`File ${path} has been added`))
  .on('change', (path) => log(`File ${path} has been changed`))
  .on('unlink', (path) => log(`File ${path} has been removed`))

let mainWindow: BrowserWindow, tray: Tray

const store = new Store({})

const winURL =
  is.dev && process.env.ELECTRON_RENDERER_URL
    ? process.env.ELECTRON_RENDERER_URL
    : path.join('file://', __dirname, '../renderer/index.html')

const devIconPath = path.join(__dirname, '../../resources/tray.png')

const prodIconPath = path.join(
  process.resourcesPath,
  'app.asar.unpacked/resources/tray.png',
)

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  createWindow()
  createTray()
  // mainWindow.webContents.openDevTools()

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

ipcMain.on('observe-watch', () => {
  const watchedPaths = watcher.getWatched()
  console.log(watchedPaths)
})

ipcMain.on('watch-path', (_, srcDir) => {
  if (fs.existsSync(srcDir)) {
    // console.log('watching', srcDir)

    watcher.add(srcDir)
  }

  // const watchedPaths = Object.keys(watcher.getWatched())
  // console.log(watchedPaths)
})

ipcMain.on('unwatch-path', (_, globalPaths, id) => {
  const globalStoragePaths = store.get(globalPaths) as ISalvageItem[]

  // console.log('unwatching', id)

  const newWatchedPaths = globalStoragePaths
    .filter((pathItem) => pathItem.id !== id && pathItem.srcDir)
    .map((pathItem) => pathItem.srcDir)

  watcher.close()

  // console.log(newWatchedPaths)

  watcher.add(newWatchedPaths)
})

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

app.on('activate', () => mainWindow === null && createWindow())

ipcMain.on('close-app', () => mainWindow.close())

ipcMain.on('min-app', () => mainWindow.hide())

ipcMain.on('copy-files', (_, args: { srcDir: string; destDir: string }) => {
  const { srcDir, destDir } = args

  watcher.on('change', (path) => {
    if (path.includes(join(srcDir))) {
      console.log('changed item', path)
      copyDir(srcDir, destDir)
    }
  })
})

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val)
})

ipcMain.on('electron-store-set', async (_, key, val) => {
  store.set(key, val)
})

function createTray() {
  tray = new Tray(is.dev ? devIconPath : prodIconPath)

  tray.setToolTip('Salvage\nClick to Restore')

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })
}

function createWindow() {
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
    icon: is.dev ? devIconPath : prodIconPath,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false,
      nodeIntegration: true,
      devTools: false,
    },
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', () => tray.destroy())

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
}

function getSimilarity(srcDir: string, destDir: string) {
  const srcFile = fs.readFileSync(srcDir).toString()
  const destDirFile = fs.readFileSync(destDir).toString()
  const similarity = compareTwoStrings(srcFile, destDirFile)

  const isSimilar = similarity === 1

  return isSimilar
}

function filterFunc(srcDir: string, destDir: string) {
  const isSrcDir = fs.lstatSync(srcDir).isDirectory()

  if (isSrcDir) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    // console.log('is a Dir')
    return true
  }

  if (!fs.existsSync(destDir)) {
    // console.log('do not exist')
    return true
  }

  const isSimilar = getSimilarity(srcDir, destDir)

  // if (isSimilar) console.log('similar')
  // if (!isSimilar) console.log('not similar')

  if (!isSimilar) return true

  // MAYBE SHOULD RETURN TRUE
  return false
}

function copyDir(srcDir: string, destDir: string) {
  // console.log(`File has been changed`)

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  fse.copy(srcDir, destDir, { filter: filterFunc, overwrite: true }, (err) => {
    if (err) return console.error(err)
    // console.log('success')
  })
}
