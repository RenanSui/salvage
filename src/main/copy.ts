import { getSimilarity } from './utils'
import fse from 'fs-extra'

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

    if (srcDirStatus.isSymbolicLink()) {
      return false
    }

    const isSourceDir = srcDirStatus.isDirectory()

    if (isSourceDir) {
      if (!fse.existsSync(destDir)) fse.mkdirSync(destDir, { recursive: true })
      // console.log('is a Dir')
      return true
    }

    if (fse.existsSync(destDir) === false) {
      // console.log('do not exist')
      return true
    }

    const isSimilar = await getSimilarity(srcDir, destDir)

    // Not a dir, file exist and is not similar to each other
    if (isSimilar === false) {
      return true
    }

    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
