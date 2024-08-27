/* eslint-disable camelcase */
import { Icons } from '@/components/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useToast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'

import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'

type DeleteBackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function DeleteBackup({ backup, ...props }: DeleteBackupProps) {
  const { setBackupSelected } = useBackupSelectedAtom()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function onDelete() {
    setBackupSelected(null)
    if (await backupService.delete_backup(backup.id)) {
      toast({ title: 'Backup Deleted:', description: `"${backup.name}"` })
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      backupService.restart_backups()
    }
  }

  return (
    <div className="space-y-1.5" {...props}>
      <div className="p-2 flex items-center justify-between border bg-neutral-50 dark:bg-neutral-900 rounded-md">
        <div className="space-y-0.5 p-2">
          <CardTitle>Delete your backup</CardTitle>
          <CardDescription>Permanently delete your backup</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'cursor-default bg-transparent mx-2 hover:bg-destructive hover:text-white transition-colors',
            )}
          >
            <Icons.delete className="size-4 shrink-0" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                backup and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-default">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className={cn(
                  buttonVariants({ variant: 'destructive' }),
                  'cursor-default',
                )}
                onClick={onDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
