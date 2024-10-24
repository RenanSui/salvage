'use client'

import { LoggerContext } from '@/components/providers/logger-provider'
import { Shell } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { useBackupById } from '@/hooks/use-backup-by-id'
import * as React from 'react'
import { logsColumns } from './_components/logs-columns'
import { LogsDataTable } from './_components/logs-data-table'
import { useMounted } from '@/hooks/use-mounted'
import { Loadings } from '@/components/loadings'
import { useTauriSize } from '@/hooks/use-tauri-size'

export default function LogsPage({ params }: { params: { id: string } }) {
  useTauriSize({ width: 600, height: 636 })
  const { data: backup } = useBackupById(params.id)
  const { logs } = React.useContext(LoggerContext)
  const backupLogs = logs[backup?.id || ''] || []
  const mounted = useMounted()

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
      <LogsDataTable columns={logsColumns(backup?.source || '')} data={backupLogs} />
    </Shell>
  )
}
