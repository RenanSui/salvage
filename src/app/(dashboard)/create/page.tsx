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
import { Loadings } from '@/components/loadings'
import { Shell, ShellCard } from '@/components/shells/shell'
import { Skeleton } from '@/components/ui/skeleton'
import { useBackupForm } from '@/hooks/use-backup-form'
import { useMounted } from '@/hooks/use-mounted'
import { useTauriSize } from '@/hooks/use-tauri-size'

export default function CreatePage() {
  useTauriSize({ width: 600, height: 434 })
  const [formState, setFormState] = React.useState<FormState>('paths')
  const { form, formArray, isPathsValid } = useBackupForm()
  const queryClient = useQueryClient()
  const router = useRouter()
  const mounted = useMounted()

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
          <form onSubmit={form.handleSubmit(createBackup)}>{currentForm}</form>
        </Form>
      </ShellCard>
      <div className="flex items-center justify-between">
        <Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} href="/">
          Cancel
        </Link>
        {currentButtons}
      </div>
    </Shell>
  )
}
