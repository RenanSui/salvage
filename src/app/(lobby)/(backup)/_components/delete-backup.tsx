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

export default function DeleteBackup({ backup }: DeleteBackupProps) {
  const { setBackupSelected } = useBackupSelectedAtom()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function onDelete() {
    setBackupSelected(null)
    const isDeleted = await backupService.delete_backup(backup.id)
    if (isDeleted) {
      toast({
        title: 'Backup Deleted:',
        description: `"${backup.name}"`,
      })

      queryClient.invalidateQueries({ queryKey: [`backups`] })
      backupService.restart_backups()
    }
  }

  return (
    <div className="space-y-1.5">
      {/* <CardTitle className="font-semibold text-sm">Delete</CardTitle> */}
      <div className="p-2 flex flex-row items-center border justify-between bg-neutral-50 dark:bg-neutral-900 rounded-md">
        <div className="space-y-0.5 p-2">
          <CardTitle>Delete your backup</CardTitle>
          <CardDescription>Permanently delete your backup</CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
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
    </div>
  )

  // return (
  //   <Card className="dark:bg-accent/20 p-2 hidden">
  //     <CardHeader className="space-y-0 p-2">
  //       <CardTitle className="font-semibold text-lg">
  //         Delete your backup
  //       </CardTitle>
  //       <CardDescription>Permanently delete your backup.</CardDescription>
  //     </CardHeader>
  //     <CardContent className="px-2 py-2">
  //       <AlertDialog>
  //         <AlertDialogTrigger
  //           className={cn(
  //             buttonVariants({ variant: 'destructive' }),
  //             'cursor-default',
  //           )}
  //         >
  //           Delete
  //         </AlertDialogTrigger>
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //             <AlertDialogDescription>
  //               This action cannot be undone. This will permanently delete your
  //               account and remove your data from our servers.
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <AlertDialogFooter>
  //             <AlertDialogCancel className="cursor-default">
  //               Cancel
  //             </AlertDialogCancel>
  //             <AlertDialogAction
  //               className={cn(
  //                 buttonVariants({ variant: 'destructive' }),
  //                 'cursor-default',
  //               )}
  //               onClick={onDelete}
  //             >
  //               Delete
  //             </AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     </CardContent>
  //   </Card>
  // )
}
