import { z } from 'zod'

export const createBackupSchema = z.object({
  name: z.string().min(1, 'Name must contain at least 1 character(s)'),
  source: z.string().min(1, 'Source must contain at least 1 character(s)'),
  destination: z
    .string()
    .min(1, 'Destination must contain at least 1 character(s)'),
  exclusions: z.array(z.object({ exclusion: z.string() })),
})

export type CreateBackupSchema = z.infer<typeof createBackupSchema>
