import { getSimilarity } from './utils'
import fse from 'fs-extra'

export const copyDirectory = (srcDir: string, destDir: string) => {
  // Create dir if false
  if (fse.existsSync(destDir) === false) {
    fse.mkdirSync(destDir, { recursive: true })
  }

  // Copy all files from directory
  fse.copySync(srcDir, destDir, {
    filter: filterDirectory,
    overwrite: true,
  })
}

export const filterDirectory = (srcDir: string, destDir: string) => {
  const isSourceDir = fse.lstatSync(srcDir).isDirectory()

  if (isSourceDir) {
    if (!fse.existsSync(destDir)) fse.mkdirSync(destDir, { recursive: true })
    // console.log('is a Dir')
    return true
  }

  if (fse.existsSync(destDir) === false) {
    // console.log('do not exist')
    return true
  }

  const isSimilar = getSimilarity(srcDir, destDir)

  // Not a dir, file exist and is not similar to each other
  if (isSimilar === false) {
    return true
  }

  return false
}
