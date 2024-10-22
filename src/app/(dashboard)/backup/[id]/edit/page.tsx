'use client'

import { ExclusionsForm } from '@/components/forms/exclusions-form'
import { FormActionButtons, type FormState } from '@/components/forms/form-action-buttons'
import { OverviewForm } from '@/components/forms/overview-form'
import { PathsForm } from '@/components/forms/paths-form'
import { buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useBackupForm } from '@/hooks/use-backup-form'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { toast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { type CreateBackupSchema } from '@/lib/validations/backup'
import { type BackupSchema } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { showUpdateToast, updateBackupFields } from './_lib/utils'
import { Shell, ShellCard } from '@/components/shells/shell'

export default function EditPage({ params }: { params: { id: string } }) {
  useTauriSize({ width: 600, height: 446 })
  const { data: backup } = useBackupById(params.id)
  const [formState, setFormState] = React.useState<FormState>('paths')
  const { form, formArray, isPathsValid } = useBackupForm(backup)
  const queryClient = useQueryClient()
  const router = useRouter()

  const editBackup = React.useCallback(
    async (values: CreateBackupSchema) => {
      if (!backup) {
        toast({ title: 'Error', description: 'Backup data is missing. Please try again.' })
        return
      }

      const updatedBackup: BackupSchema = {
        ...backup,
        ...values,
        exclusions: values.exclusions.map((e) => e.exclusion.replace('//', '\\').replace('/', '\\')),
      }

      try {
        const updates = await updateBackupFields(updatedBackup, values, backup)
        await queryClient.invalidateQueries({ queryKey: ['backups'] })
        await backupService.restart_backups()
        showUpdateToast(updates)
        router.push(`/backup/${backup.id}`)
        form.reset()
      } catch (error) {
        console.error(error)
        toast({ title: `Error modifying backup: ${updatedBackup.name}.` })
      }
    },
    [backup, form, queryClient, router],
  )

  const currentForm = React.useMemo(() => {
    switch (formState) {
      case 'paths':
        return <PathsForm form={form} />
      case 'exclusions':
        return <ExclusionsForm form={form} formArray={formArray} />
      case 'overview':
        return <OverviewForm values={form.getValues()} />
      default:
        return null
    }
  }, [formState, form, formArray])

  const currentButtons = React.useMemo(() => {
    const buttonProps = { setFormState, isPathsValid, handleSubmit: form.handleSubmit(editBackup) }
    switch (formState) {
      case 'paths':
        return <FormActionButtons {...buttonProps} next="exclusions" isDisabled={true} isPathsValid={isPathsValid} />
      case 'exclusions':
        return <FormActionButtons {...buttonProps} next="overview" prev="paths" />
      case 'overview':
        return <FormActionButtons {...buttonProps} next="exclusions" prev="exclusions" submitText="Edit" isSubmit />
      default:
        return null
    }
  }, [editBackup, formState, form, isPathsValid])

  return (
    <Shell>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(editBackup)} className="flex min-h-[calc(100vh-86px)] flex-col space-y-4">
          <ShellCard size="auto">{currentForm}</ShellCard>
          <div className="flex items-center justify-between">
            <Link
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              href={backup ? `/backup/${backup?.id}` : '/'}
            >
              Cancel
            </Link>
            {currentButtons}
          </div>
        </form>
      </Form>
    </Shell>
  )
}
