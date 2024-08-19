import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useMounted } from '@/hooks/use-mounted'
import { useTabsAtom } from '@/hooks/use-tabs'
import { cn } from '@/lib/utils'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import Backup from './backup'
import { BackupDashboardSkeleton } from './backup-dashboard-skeleton'
import { BackupTabs } from './backup-tabs'

type BackupDashboardProps = React.HTMLAttributes<HTMLDivElement>

export function BackupDashboard({ className }: BackupDashboardProps) {
  const mounted = useMounted()
  const { tabs: tabSelected } = useTabsAtom()
  const { backupSelected } = useBackupSelectedAtom()
  const { data: backup, isFetched } = useBackupById(backupSelected)

  if (!mounted) {
    return <BackupDashboardSkeleton />
  }

  if (!backupSelected) {
    return (
      <Card
        className={cn(
          'w-full p-2 text-center border-none shadow-none bg-[#ff161600]',
          className,
        )}
      >
        <CardHeader
          className="animate-fade-up mt-20"
          style={{ animationDelay: '0.20s', animationFillMode: 'both' }}
        >
          <CardTitle className="font-heading text-2xl">Dashboard</CardTitle>
          <CardDescription>
            You haven&apos;t selected a backup yet.
          </CardDescription>
          <div className="rounded-full border border-dashed border-muted-foreground/75 self-center p-6">
            <ExclamationTriangleIcon
              className="size-10 text-muted-foreground/75"
              aria-hidden="true"
            />
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'w-full max-w-screen-lg pt-2 mx-auto',
        className,
        isFetched && 'animate-fade-up',
      )}
    >
      <ScrollArea className="h-[calc(100vh-78px)]">
        <div className="space-y-4 flex flex-col">
          <h1 className="font-heading text-3xl leading-none tracking-tight">
            Dashboard
          </h1>
          <BackupTabs />
          <p className="font-semibold leading-none tracking-tight text-2xl pb-2">
            {backup?.name}
          </p>
        </div>
        <div className="pt-4">
          {tabSelected === 'Backup' && backup && <Backup backup={backup} />}
        </div>
      </ScrollArea>
    </div>
  )
}
