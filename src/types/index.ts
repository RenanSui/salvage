import { type CreateBackupSchema } from '@/lib/validations/backup'

export type BackupSchema = Omit<CreateBackupSchema, 'exclusions'> & {
  id: string
  exclusions: string[]
  is_file: boolean
}

export type Unit = 'Kb' | 'Mb' | 'Gb' | 'Tb'

export type FilesSchema = {
  source: string
  file: string
  size: string
  unit: Unit
}
