import fse from 'fs-extra'
import { getSimilarity } from './utils'

export const copyDirectory = async (srcDir: string, destDir: string) => {
  // Create dir if false
  if (fse.existsSync(destDir) === false) {
    fse.mkdirSync(destDir, { recursive: true })
  }

  try {
    // Copy all files from directory
    await fse.copy(srcDir, destDir, {
      filter: filterDirectory,
      dereference: true,
      overwrite: true,
    })
  } catch (error) {
    console.error(error)
  }
}

export const filterDirectory = async (srcDir: string, destDir: string) => {
  try {
    const srcDirStatus = fse.lstatSync(srcDir)
    const srcDirSize = Math.trunc(srcDirStatus.size / 1024)

    if (srcDirSize > 10000) {
      return true
    }

    // return false if is a symbolic link
    if (srcDirStatus.isSymbolicLink()) {
      return false
    }

    const isSourceDir = srcDirStatus.isDirectory()

    // return true if is a dir
    if (isSourceDir === true) {
      if (!fse.existsSync(destDir)) fse.mkdirSync(destDir, { recursive: true })
      return true
    }

    const dirExist = fse.existsSync(destDir)

    // return true if do not exist
    if (dirExist === false) {
      return true
    }

    const isSimilar = await getSimilarity(srcDir, destDir)

    // return true if files are not similar
    if (isSimilar === false) {
      return true
    }

    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
