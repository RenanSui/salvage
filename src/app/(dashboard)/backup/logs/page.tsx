'use client'

import { Loadings } from '@/components/loadings'
import { LoggerContext } from '@/components/providers/logger-provider'
import { Shell, ShellCard } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useMounted } from '@/hooks/use-mounted'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import { logsColumns } from './_components/logs-columns'
import { LogsDataTable } from './_components/logs-data-table'

export default function LogsPage() {
  useTauriSize({ width: 600, height: 592 })

  const searchParams = useSearchParams()
  const mounted = useMounted()

  const id = searchParams.get('id') as string | undefined
  const { data: backup } = useBackupById(id || '')
  const { logs } = React.useContext(LoggerContext)
  const backupLogs = logs[backup?.id || ''] || []

  if (!mounted) {
    return (
      <Shell>
        <CardTitle className="pb-2 text-sm font-semibold">Files</CardTitle>
        <Loadings length={1} size="sm" />
        <Loadings length={10} size="sm" withIcon />
        <Loadings length={1} size="sm" />
      </Shell>
    )
  }

  return (
    <Shell>
      <CardTitle className="pb-2 text-sm font-semibold">Logs</CardTitle>
      <ShellCard className="min-h-[calc(100vh-112px)]">
        <LogsDataTable columns={logsColumns(backup?.source || '')} data={backupLogs} />
      </ShellCard>
    </Shell>
  )
}
