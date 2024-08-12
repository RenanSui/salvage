'use client'

import { Separator } from '@/components/ui/separator'
import { useBackups } from '@/hooks/use-backups'
import { useMounted } from '@/hooks/use-mounted'
import { BackupDashboard } from './_components/backup-dashboard'
import { DashboardSidebar } from './_components/dashboard-sidebar'
import { DashboardSidebarSkeleton } from './_components/dashboard-sidebar-skeleton'

export default function Page() {
  const mounted = useMounted()
  const { data: salvageData } = useBackups()

  if (!mounted) {
    return (
      <div className="flex min-h-[calc(100vh-28px)] p-4 gap-4">
        <DashboardSidebarSkeleton />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-28px)] p-4 gap-4">
      <DashboardSidebar items={salvageData} />
      <Separator orientation="vertical" className="min-h-[calc(100vh-60px)] " />
      <BackupDashboard />
    </div>
  )
}
