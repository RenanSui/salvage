import { is } from '@electron-toolkit/utils'
import fse from 'fs-extra'
import path from 'path'

export const getSimilarity = async (srcDir: string, destDir: string) => {
  try {
    const srcFile = await fse.readFile(srcDir, 'utf-8')
    const destDirFile = await fse.readFile(destDir, 'utf-8')

    const similarity = compareTwoStrings(srcFile, destDirFile)
    const isSimilar = similarity === 1

    return isSimilar
  } catch (error) {
    console.error(error)
    return false
  }
}

export const compareTwoStrings = (first: string, second: string) => {
  // return string1 === string2
  first = first.replace(/\s+/g, '')
  second = second.replace(/\s+/g, '')

  if (first === second) return 1 // identical or empty
  if (first.length < 2 || second.length < 2) return 0 // if either is a 0-letter or 1-letter string

  const firstBigrams = new Map()
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2)
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1

    firstBigrams.set(bigram, count)
  }

  let intersectionSize = 0
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2)
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

    if (count > 0) {
      firstBigrams.set(bigram, count - 1)
      intersectionSize++
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2)
}

export const removeEmptyDir = (destDir: string) => {
  const Files: string[] = []

  const ThroughDirectory = (Directory: string) => {
    fse.readdirSync(Directory).forEach((File) => {
      const Absolute = path.join(Directory, File)
      if (fse.statSync(Absolute).isDirectory()) {
        ThroughDirectory(Absolute)
        return Files.push(Absolute)
      } else return Files.push(Absolute)
    })
  }

  ThroughDirectory(destDir)

  Files.map((filePath) => {
    const dirExist = fse.existsSync(filePath)
    if (!dirExist) {
      return null
    }

    const isDir = fse.lstatSync(filePath).isDirectory()
    if (!isDir) {
      return null
    }

    const isDirEmpty = fse.readdirSync(filePath).length === 0
    if (!isDirEmpty) {
      return null
    }

    // console.log('existe and its a dir and is empty')
    fse.removeSync(filePath)

    return null
  })
}

export const windowURL =
  is.dev && process.env.ELECTRON_RENDERER_URL
    ? process.env.ELECTRON_RENDERER_URL
    : path.join('file://', __dirname, '../renderer/index.html')

export const iconPath = is.dev
  ? path.join(__dirname, '../../resources/tray.png')
  : path.join(process.resourcesPath, 'app.asar.unpacked/resources/tray.png')
