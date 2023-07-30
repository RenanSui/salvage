import { z } from 'zod'

export interface ISalvageItem {
  id: number
  title: string
  srcDir: string
  destDir: string
}

export const pathSchema = z.object({
  title: z.string().nonempty('title is required'),
  srcDir: z.string().nonempty('Source directory is required'),
  destDir: z.string().nonempty('Destination directory is required'),
})
