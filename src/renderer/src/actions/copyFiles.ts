import fs from 'fs'
import fse from 'fs-extra'
import { compareTwoStrings } from 'string-similarity'

const getSimilarity = (srcDir: string, destDir: string) => {
  let isSimilar

  if (fs.existsSync(destDir)) {
    setTimeout(() => {
      const srcFile = fs.readFileSync(srcDir).toString()
      const destDirFile = fs.readFileSync(destDir).toString()
      const similarity = compareTwoStrings(srcFile, destDirFile)

      console.log({ similarity })

      isSimilar = similarity === 1
    }, 1000)
  }

  // console.log({ isSimilar })
  return { isSimilar }
}

const filterFunc = (srcDir: string, destDir: string) => {
  const isSrcDir = fs.lstatSync(srcDir).isDirectory()

  if (isSrcDir) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    // console.log('is a Dir')
    return true
  }

  const { isSimilar } = getSimilarity(srcDir, destDir)

  // if (isSimilar) console.log('Similar')
  // if (!isSimilar) console.log('Not Similar')

  // if (isSimilar) return false
}

export const copyDir = (srcDir: string, destDir: string) => {
  console.log(`File has been changed`)
  fse.copy(srcDir, destDir, { filter: filterFunc, overwrite: true }, (err) => {
    if (err) return console.error(err)
    console.log('success')
  })
}
