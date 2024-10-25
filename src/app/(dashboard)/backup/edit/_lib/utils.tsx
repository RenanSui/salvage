import { Icons } from '@/components/icons'
import { toast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { type CreateBackupSchema } from '@/lib/validations/backup'
import { type BackupSchema } from '@/types'

type BackupField = keyof BackupSchema

type FieldUpdate = {
  field: BackupField // Use BackupField here
  service: (backup: BackupSchema) => Promise<object>
}

export const updateBackupFields = async (
  updatedBackup: BackupSchema,
  values: CreateBackupSchema,
  backup: BackupSchema,
) => {
  const updates: string[] = []

  const fieldUpdates: FieldUpdate[] = [
    { field: 'name', service: backupService.rename_backup },
    { field: 'source', service: backupService.change_backup_source },
    { field: 'destination', service: backupService.change_backup_destination },
    { field: 'exclusions', service: backupService.modify_backup_exclusions },
  ]

  for (const { field, service } of fieldUpdates) {
    // Type guard to ensure we're only accessing valid fields
    if (field in backup && field in values) {
      const currentFieldValue = backup[field]
      const newFieldValue = values[field as keyof CreateBackupSchema]

      if (
        currentFieldValue !== newFieldValue ||
        (field === 'exclusions' && backup.exclusions.join('') !== updatedBackup.exclusions.join(''))
      ) {
        await service(updatedBackup)
        updates.push(field.charAt(0).toUpperCase() + field.slice(1)) // Capitalize the first letter
      }
    }
  }

  return updates
}

export const showUpdateToast = (updates: string[]) => {
  toast({
    title: 'Updated:',
    description: updates.map((update, index) => (
      <p className="flex gap-1 font-semibold" key={index}>
        <Icons.check />
        <span>{update}</span>
      </p>
    )),
  })
}
