import AddBackupDialog from '@/components/add-backup-dialog'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import * as React from 'react'
import { DashboardSidebarSkeleton } from './dashboard-sidebar-skeleton'

type DashboardSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  items: BackupSchema[]
}

export function DashboardSidebar({
  items,
  className,
  ...props
}: DashboardSidebarProps) {
  const mounted = useMounted()
  const { backupSelected, setBackupSelected } = useBackupSelectedAtom()

  if (!mounted) {
    return <DashboardSidebarSkeleton />
  }

  return (
    <div
      className={cn(
        'w-full max-w-[200px] lg:max-w-[248px] p-2 space-y-2',
        className,
      )}
      {...props}
    >
      <AddBackupDialog>
        <Button size="sm" className={cn('w-full cursor-default')}>
          New Backup
        </Button>
      </AddBackupDialog>
      <Separator />
      <ScrollArea className="h-[calc(100vh-127px)]">
        {items.map((backup, index) => {
          const Icon = backup.is_file ? Icons.file : Icons.folder

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                'group w-full justify-start items-center gap-1 mb-1 font-normal bg-transparent cursor-default',
                backup.id === backupSelected &&
                  'bg-foreground/10 hover:bg-foreground/10',
              )}
              onClick={() => setBackupSelected(backup.id)}
            >
              <Icon
                className={cn(
                  'size-4 text-foreground/70 group-hover:text-foreground stroke-[3] ',
                  backup.id === backupSelected &&
                    'text-blue-500 group-hover:text-blue-500',
                )}
              />
              <span
                className={cn(
                  'text-sm text-foreground/70 group-hover:text-foreground',
                  backup.id === backupSelected && 'font-semibold',
                )}
              >
                {backup.name}
              </span>
            </Button>
          )
        })}
      </ScrollArea>
    </div>
  )
}
