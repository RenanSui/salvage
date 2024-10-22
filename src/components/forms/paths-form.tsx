import { type CreateBackupSchema } from '@/lib/validations/backup'
import { type UseFormReturn } from 'react-hook-form'
import { BackupInputField, dropdownActions } from './backup-input-field'

export const PathsForm = ({ form }: { form: UseFormReturn<CreateBackupSchema> }) => {
  return (
    <>
      <BackupInputField
        name="name"
        label="Backup name"
        placeholder="Type the name of your backup here"
        control={form.control}
      />
      <BackupInputField
        name="source"
        label="Source path"
        placeholder="Path to the source file or directory"
        control={form.control}
        dropdownOptions={dropdownActions(form.setValue, 'source')}
        isDisabled
        className="pb-0"
      />
      <BackupInputField
        name="destination"
        label="Destination path"
        placeholder="Path to the destination directory"
        control={form.control}
        isDisabled
        dropdownOptions={dropdownActions(form.setValue, 'destination')}
      />
    </>
  )
}
