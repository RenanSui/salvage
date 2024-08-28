import { Icons } from '@/components/icons'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import { ChevronRight } from 'lucide-react'
import * as React from 'react'
import { BackupDashboardSkeleton } from './backup-dashboard-skeleton'
import CreateBackupForm from './create-backup-form'
import DeleteBackup from './delete-backup'
import { LogsBackup } from './logs-backup'
import MonitorBackup from './monitor-backup'
import { StatisticsBackup } from './statistics-backup'
import UpdateBackupForm from './update-backup-form'

type BackupDashboardProps = {
  items: BackupSchema[]
} & React.HTMLAttributes<HTMLDivElement>

export function BackupDashboard({ items, className }: BackupDashboardProps) {
  const mounted = useMounted()
  const { backupSelected, setBackupSelected } = useBackupSelectedAtom()
  const { data: backup, isFetched } = useBackupById(backupSelected)

  if (!mounted) return <BackupDashboardSkeleton />

  const renderBackups = () => (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">Backups</CardTitle>
      {items.map((backup, index) => {
        const Icon = backup.is_file ? Icons.file : Icons.folder
        return (
          <div
            key={index}
            className="group p-2 flex items-center justify-between border bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-default"
            onClick={() => setBackupSelected(backup.id)}
          >
            <div className="space-y-0.5 p-2">
              <CardTitle>{backup.name}</CardTitle>
              <CardDescription>Source: {backup.source}</CardDescription>
            </div>
            <Icon className="transition-colors size-4 text-foreground/40 group-hover:text-foreground stroke-[2]" />
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      className={cn(
        'w-full max-w-screen-lg mx-auto',
        className,
        isFetched && 'animate-fade-up',
      )}
    >
      <ScrollArea className="h-[calc(100vh-78px)]">
        <div className="space-y-2 flex flex-col px-4 py-2 sticky top-0 z-50 w-full from-accent bg-gradient-to-b to-accent/30 backdrop-blur">
          <p className="text-foreground font-heading text-2xl leading-none tracking-tight flex gap-4 items-center cursor-default">
            <span
              className={cn(
                'transition-colors',
                backupSelected
                  ? 'hover:text-foreground text-muted-foreground/50'
                  : '',
              )}
              onClick={() => backupSelected && setBackupSelected(null)}
            >
              Dashboard
            </span>
            {backupSelected && (
              <>
                <ChevronRight className="size-5 text-foreground" />
                <span className="text-foreground">{backup?.name}</span>
              </>
            )}
          </p>
        </div>
        <div className="pt-4 px-4 space-y-8">
          {!backup ? (
            <>
              <CreateBackupForm />
              {renderBackups()}
            </>
          ) : (
            <>
              <MonitorBackup backup={backup} />
              <div className="space-y-1.5">
                <CardTitle className="font-semibold text-sm">Edit</CardTitle>
                <UpdateBackupForm backup={backup} />
                <DeleteBackup backup={backup} />
              </div>
              <StatisticsBackup backup={backup} />
              <LogsBackup backup={backup} />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
