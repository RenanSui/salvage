import { createBackupSchema, type CreateBackupSchema } from '@/lib/validations/backup'
import { type BackupSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'

export const useBackupForm = (backup?: BackupSchema | null | undefined) => {
  const form = useForm<CreateBackupSchema>({
    resolver: zodResolver(createBackupSchema),
    defaultValues: {
      name: backup?.name ?? '',
      source: backup?.source ?? '',
      destination: backup?.destination ?? '',
      exclusions: backup?.exclusions.map((exclusion) => ({ exclusion })) ?? [],
    },
  })

  const formArray = useFieldArray<CreateBackupSchema>({
    control: form.control,
    name: 'exclusions',
  })

  const {
    '0': name,
    '1': source,
    '2': destination,
  } = useWatch({
    control: form.control,
    name: ['name', 'source', 'destination'],
  })

  const isPathsValid = !!name && !!source && !!destination

  return {
    form,
    formArray,
    isPathsValid,
  }
}
