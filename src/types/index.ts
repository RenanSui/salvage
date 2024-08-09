import { CreateBackupSchema } from '@/lib/validations/backup'

export type BackupSchema = Omit<CreateBackupSchema, 'exclusions'> & {
  id: string
  exclusions: string[]
  is_file: boolean
}
