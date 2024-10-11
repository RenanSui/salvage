'use client'

import { useBackups } from '@/hooks/use-backups'
import { BackupDashboard } from './_components/backup-dashboard'
import { DashboardSidebar } from './_components/dashboard-sidebar'

export default function Page() {
  const { data: backupList } = useBackups()

  return (
    <div className="flex min-h-[calc(100vh-28px)] p-4 bg-accent dark:bg-transparent">
      <DashboardSidebar items={backupList || []} />
      <BackupDashboard items={backupList || []} />
    </div>
  )
}
