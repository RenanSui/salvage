import chokidar from 'chokidar'
import path from 'path'
import { ISalvageItem } from '../preload/types'
import { copyDirectory } from './copy'
import { store } from './store'
import { removeEmptyDir } from './utils'
import fse from 'fs-extra'

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

// add file
export const handleAddFile = (filePath: string) => {
  const pathItems = store.get('pathItems') as ISalvageItem[]

  const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

  const { destDir, srcDir } = pathItem[0]

  if (filePath.includes(path.join(srcDir)) === true) {
    copyDirectory(srcDir, destDir)
  }
}

// change file
export const handleChangeFile = (filePath: string) => {
  const pathItems = store.get('pathItems') as ISalvageItem[]

  const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

  const { destDir, srcDir } = pathItem[0]

  if (filePath.includes(path.join(srcDir)) === true) {
    copyDirectory(srcDir, destDir)
  }
}

// delete file
export const handleDeleteFile = async (filePath: string) => {
  try {
    const pathItems = store.get('pathItems') as ISalvageItem[]

    const pathItem = pathItems.filter((item) => filePath.includes(item.srcDir))

    const { destDir, srcDir } = pathItem[0]

    const replaceDir = filePath.replace(srcDir, destDir)

    await fse.remove(replaceDir)
    await fse.copy(srcDir, destDir)

    await removeEmptyDir(destDir)
  } catch (error) {
    console.log(error)
  }
}
