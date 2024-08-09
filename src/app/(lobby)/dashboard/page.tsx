'use client'

import { useMounted } from '@/hooks/use-mounted'
import { useSalvageData } from '@/hooks/use-salvage-data'
import { BackupDashboard } from './_components/backup-dashboard'
import { DashboardSidebar } from './_components/dashboard-sidebar'
import { DashboardSidebarSkeleton } from './_components/dashboard-sidebar-skeleton'

export default function Page() {
  const mounted = useMounted()
  const { data: salvageData } = useSalvageData()

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
      <BackupDashboard items={salvageData} />
    </div>
  )
}
