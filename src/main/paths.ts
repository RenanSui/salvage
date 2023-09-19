import { dialog, shell } from 'electron'
import fse from 'fs-extra'
import path from 'path'
import log from 'electron-log'
import { store } from './store'
import { watcher } from './watcher'
import { ISalvageItem } from '../preload/types'

let unwatchPaths: string[] = []

export const handleOpenPath = (folderPath: string) => {
  const folderExist = fse.existsSync(folderPath)

  if (folderExist === false) fse.mkdirSync(folderPath, { recursive: true })

  shell.openPath(path.join(folderPath))
}

export const getDialogPath = async (event: Electron.IpcMainEvent) => {
  try {
    const dialogPath = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    event.returnValue = dialogPath
  } catch (error) {
    log.error(error)
  }
}

export const watchPath = (globalPaths, id: string) => {
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
}

export const unwatchPath = (globalPaths: string, id: string) => {
  if (!unwatchPaths.includes(id)) {
    unwatchPaths.push(id)
  }

  const globalStoragePaths = store.get(globalPaths) as ISalvageItem[]

  const newWatchedPaths = globalStoragePaths
    .filter((pathItem) => pathItem.id === id)
    .map((pathItem) => pathItem.srcDir)

  newWatchedPaths.map((pathItem) => {
    if (!pathItem) {
      return null
    }

    watcher.unwatch(path.join(pathItem, '**'))

    return null
  })

  console.log(watcher.getWatched())
}
