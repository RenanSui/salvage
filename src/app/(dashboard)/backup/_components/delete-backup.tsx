'use client'

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
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useToast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { type BackupSchema } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export const DeleteBackup = ({ backup }: { backup: BackupSchema }) => {
  const { setBackupSelected } = useBackupSelectedAtom()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  async function handleDeleteBackup() {
    setBackupSelected(null)
    if (await backupService.delete_backup(backup.id)) {
      toast({ title: 'Backup Deleted:', description: `"${backup.name}"` })
      await queryClient.invalidateQueries({ queryKey: ['backups'] })
      await backupService.restart_backups()
      router.push('/')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          buttonVariants({ size: 'sm', variant: 'outline' }),
          'cursor-default bg-transparent transition-colors hover:bg-destructive hover:text-white',
        )}
      >
        <Icons.delete className="size-4 shrink-0" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your backup and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-default">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: 'destructive' }), 'cursor-default')}
            onClick={handleDeleteBackup}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
