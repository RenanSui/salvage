import fse from 'fs-extra'
import path from 'path'

export const compareTwoStrings = async (first: string, second: string) => {
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

export const removeEmptyDir = async (destDir: string) => {
  try {
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

    Files.map(async (filePath) => {
      try {
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
      } catch (error) {
        return console.log(error)
      }
    })
  } catch (error) {}
}
