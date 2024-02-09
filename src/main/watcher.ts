import chokidar from 'chokidar'
import fse from 'fs-extra'
import path from 'path'
import { ISalvageItem } from '../preload/types'
import { copyDirectory } from './copy'
import { store } from './store'
import { removeEmptyDir } from './utils'

const logger = console.log.bind(console)

export const watcher = chokidar.watch(process.resourcesPath, {
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 5000,
  },
  ignoreInitial: true,
})

watcher
  .on('unlinkDir', (path) => logger(`Directory ${path} has been removed`))
  .on('ready', () => logger('Initial scan complete. Ready for changes'))
  .on('addDir', (path) => logger(`Directory ${path} has been added`))
  .on('change', (path) => logger(`File ${path} has been changed`))
  .on('unlink', (path) => logger(`File ${path} has been removed`))
  .on('add', (path) => logger(`File ${path} has been added`))
  .on('error', (error) => logger(`Watcher error: ${error}`))
  .on('raw', (event, path, details) =>
    logger('Raw event info:', event, path, details),
  )

const getFirstPathItem = (filePath: string) => {
  const pathItems = store.get('pathItems') as ISalvageItem[]

  const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

  return {
    destDir: pathItem[0].destDir,
    srcDir: pathItem[0].srcDir,
  }
}

// add file
export const handleAddFile = (filePath: string) => {
  const { srcDir, destDir } = getFirstPathItem(filePath)

  if (filePath.includes(path.join(srcDir)) === true) {
    copyDirectory(srcDir, destDir)
  }
}

// change file
export const handleChangeFile = (filePath: string) => {
  const { srcDir, destDir } = getFirstPathItem(filePath)

  if (filePath.includes(path.join(srcDir)) === true) {
    copyDirectory(srcDir, destDir)
  }
}

// delete file
export const handleDeleteFile = (filePath: string) => {
  const { srcDir, destDir } = getFirstPathItem(filePath)

  const isDestDir = fse.existsSync(destDir)

  if (!isDestDir) {
    return null
  }

  const replaceDir = filePath.replace(srcDir, destDir)

  fse.removeSync(replaceDir)
  fse.copySync(srcDir, destDir)

  removeEmptyDir(destDir)

  return null
}
