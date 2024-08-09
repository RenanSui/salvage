import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBackupAtom } from '@/hooks/use-backup'
import { useTabsAtom } from '@/hooks/use-tabs'
import { BackupSchema } from '@/types'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import Backup from './backup'
import { BackupTabs } from './backup-tabs'

type BackupDashboardProps = React.HTMLAttributes<HTMLDivElement> & {
  items: BackupSchema[]
}

export function BackupDashboard({ items }: BackupDashboardProps) {
  const { tabs: tabSelected } = useTabsAtom()
  const { backup } = useBackupAtom()
  const backupSelected = items.find((item) => item.id === backup)

  if (!backup || !backupSelected) {
    return (
      <Card className="w-full p-2 text-center">
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
    <Card className="w-full p-2 ">
      <ScrollArea className="h-[calc(100vh-78px)]">
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="font-heading text-3xl">Dashboard</CardTitle>
          <BackupTabs />
          <p className="font-semibold leading-none tracking-tight text-2xl">
            {backupSelected.name}
          </p>
        </CardHeader>
        <CardContent className="p-0 py-4">
          {tabSelected === 'Backup' && <Backup backup={backupSelected} />}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
