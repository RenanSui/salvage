'use client'

import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { type CreateBackupSchema } from '@/lib/validations/backup'
import { type BackupSchema } from '@/types'

import { ExclusionsForm } from '@/components/forms/exclusions-form'
import { FormActionButtons, type FormState } from '@/components/forms/form-action-buttons'
import { OverviewForm } from '@/components/forms/overview-form'
import { PathsForm } from '@/components/forms/paths-form'
import { Shell, ShellCard } from '@/components/shells/shell'
import { useBackupForm } from '@/hooks/use-backup-form'
import { useTauriSize } from '@/hooks/use-tauri-size'

export default function CreatePage() {
  useTauriSize({ width: 600, height: 446 })
  const [formState, setFormState] = React.useState<FormState>('paths')
  const { form, formArray, isPathsValid } = useBackupForm()
  const queryClient = useQueryClient()
  const router = useRouter()

  const createBackup = React.useCallback(
    async (data: CreateBackupSchema) => {
      const backupItem: BackupSchema = {
        ...data,
        id: '',
        is_file: false,
        exclusions: data.exclusions.map((e) => e.exclusion.replace('//', '\\').replace('/', '\\')),
      }

      try {
        await backupService.create_backup(backupItem)
        await queryClient.invalidateQueries({ queryKey: ['backups'] })
        await backupService.restart_backups()

        toast({ title: `Backup ${backupItem.name} successfully created.` })
        router.push('/')
        form.reset()
      } catch (error) {
        console.error(error)
        toast({ title: `Error creating backup: ${backupItem.name}.` })
      }
    },
    [form, queryClient, router],
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
    const buttonProps = { setFormState, isPathsValid, handleSubmit: form.handleSubmit(createBackup) }
    switch (formState) {
      case 'paths':
        return <FormActionButtons {...buttonProps} next="exclusions" isDisabled={true} isPathsValid={isPathsValid} />
      case 'exclusions':
        return <FormActionButtons {...buttonProps} next="overview" prev="paths" />
      case 'overview':
        return <FormActionButtons {...buttonProps} next="exclusions" prev="exclusions" isSubmit />
      default:
        return null
    }
  }, [createBackup, formState, form, isPathsValid])

  return (
    <Shell>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createBackup)} className="flex min-h-[calc(100vh-86px)] flex-col space-y-4">
          <ShellCard size="auto">{currentForm}</ShellCard>
          <div className="flex items-center justify-between">
            <Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href="/">
              Cancel
            </Link>
            {currentButtons}
          </div>
        </form>
      </Form>
    </Shell>
  )
}
