import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
import { useTabsAtom } from '@/hooks/use-tabs'
import { cn } from '@/lib/utils'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import Backup from './backup'
import { BackupTabs } from './backup-tabs'

type BackupDashboardProps = React.HTMLAttributes<HTMLDivElement>

export function BackupDashboard({ className }: BackupDashboardProps) {
  const { tabs: tabSelected } = useTabsAtom()
  const { backupSelected } = useBackupSelectedAtom()
  const { data: backup, isFetched } = useBackupById(backupSelected)

  if (!backupSelected) {
    return (
      <Card className={cn('w-full p-2 text-center', className)}>
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
    <Card
      className={cn(
        'w-full max-w-screen-lg pt-2 mx-auto border-none shadow-none bg-transparent',
        className,
        isFetched && 'animate-fade-up',
      )}
    >
      <ScrollArea className="h-[calc(100vh-78px)]">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="font-heading text-3xl">Dashboard</CardTitle>
          <BackupTabs />
          <p className="font-semibold leading-none tracking-tight text-2xl pb-2">
            {backup?.name}
          </p>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {tabSelected === 'Backup' && backup && <Backup backup={backup} />}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
