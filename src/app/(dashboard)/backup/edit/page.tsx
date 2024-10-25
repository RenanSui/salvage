'use client'

import { ExclusionsForm } from '@/components/forms/exclusions-form'
import { FormActionButtons, type FormState } from '@/components/forms/form-action-buttons'
import { OverviewForm } from '@/components/forms/overview-form'
import { PathsForm } from '@/components/forms/paths-form'
import { Loadings } from '@/components/loadings'
import { Shell, ShellCard } from '@/components/shells/shell'
import { buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useBackupForm } from '@/hooks/use-backup-form'
import { useMounted } from '@/hooks/use-mounted'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { toast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { type CreateBackupSchema } from '@/lib/validations/backup'
import { type BackupSchema } from '@/types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { showUpdateToast, updateBackupFields } from './_lib/utils'
import { useQueryClient } from '@tanstack/react-query'

export default function EditPage() {
  useTauriSize({ width: 600, height: 446 })

  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const mounted = useMounted()
  const router = useRouter()

  const [formState, setFormState] = React.useState<FormState>('paths')
  const id = searchParams.get('id') as string | undefined
  const { data: backup } = useBackupById(id || '')
  const { form, formArray, isPathsValid } = useBackupForm(backup)

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
        router.push(`/backup?id=${backup.id}`)
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

  if (!mounted) {
    return (
      <Shell className="space-y-4">
        <ShellCard className="flex min-h-[calc(100vh-134px)] flex-col justify-between">
          <section className="animate-fade-up p-4 pb-0" style={{ animationDelay: '0.10s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={1} className="h-11" />
          </section>
          <section className="animate-fade-up p-4 pb-0" style={{ animationDelay: '0.20s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={1} className="h-10" />
          </section>
          <section className="animate-fade-up p-4" style={{ animationDelay: '0.30s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={1} className="h-10" />
          </section>
        </ShellCard>
        <div className="flex items-center justify-between">
          <Skeleton className="mb-1 h-8 w-16 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="mb-1 size-8 rounded" />
            <Skeleton className="mb-1 h-8 w-[72px] rounded" />
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell className="space-y-4">
      <ShellCard className="min-h-[calc(100vh-134px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(editBackup)}>{currentForm}</form>
        </Form>
      </ShellCard>
      <div className="flex items-center justify-between">
        <Link
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          href={backup ? `/backup?id=${backup?.id}` : '/'}
        >
          Cancel
        </Link>
        {currentButtons}
      </div>
    </Shell>
  )
}
