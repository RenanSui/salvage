import { type FilesSchema } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sizeInBytes({ size, unit }: { size: FilesSchema['size']; unit: FilesSchema['unit'] }) {
  const sizeNumber = parseFloat(size)
  switch (unit) {
    case 'Tb':
      return sizeNumber * 1024 * 1024 * 1024 * 1024 // 1 Tb = 1024^4 bytes
    case 'Gb':
      return sizeNumber * 1024 * 1024 * 1024 // 1 Gb = 1024^3 bytes
    case 'Mb':
      return sizeNumber * 1024 * 1024 // 1 Mb = 1024^2 bytes
    case 'Kb':
      return sizeNumber * 1024 // 1 Kb = 1024 bytes
    default:
      return sizeNumber // Treat as bytes if unit is unrecognized
  }
}
