import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useMounted } from '@/hooks/use-mounted'
import { useSidebar } from '@/hooks/use-sidebar'
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
  const { backupSelected, setBackupSelected } = useBackupSelectedAtom()
  const { sidebar } = useSidebar()
  const mounted = useMounted()

  if (!sidebar) return null
  if (!mounted) return <DashboardSidebarSkeleton />

  return (
    <div
      className={cn(
        'w-full max-w-[200px] lg:max-w-[248px] p-2 space-y-2',
        className,
      )}
      {...props}
    >
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'w-full justify-start items-center gap-1 font-normal bg-transparent cursor-default',
          !backupSelected && 'bg-black/5 dark:bg-accent hover:bg-foreground/10',
        )}
        onClick={() => setBackupSelected(null)}
      >
        <Icons.home className="size-4" />
        <span className="text-sm">Dashboard</span>
      </Button>
      <Separator />
      <ScrollArea className="h-[calc(100vh-127px)]">
        {items.map((backup) => {
          const Icon = backup.is_file ? Icons.file : Icons.folder
          const isSelected = backup.id === backupSelected

          return (
            <Button
              key={backup.id}
              variant="ghost"
              size="sm"
              className={cn(
                'group w-full justify-start items-center gap-1 mb-1 font-normal bg-transparent cursor-default',
                isSelected &&
                  'bg-black/5 dark:bg-accent hover:bg-foreground/10',
              )}
              onClick={() => setBackupSelected(backup.id)}
            >
              <Icon
                className={cn(
                  'size-4 text-foreground/70 group-hover:text-foreground',
                  isSelected && 'text-blue-500 group-hover:text-blue-500',
                )}
              />
              <span
                className={cn(
                  'text-sm text-foreground/70 group-hover:text-foreground',
                  isSelected && 'font-semibold',
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
