'use client'

import { LoggerContext } from '@/components/providers/logger-provider'
import { Shell } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { useBackupById } from '@/hooks/use-backup-by-id'
import * as React from 'react'
import { logsColumns } from './_components/logs-columns'
import { LogsDataTable } from './_components/logs-data-table'

export default function LogsPage({ params }: { params: { id: string } }) {
  const { data: backup } = useBackupById(params.id)
  const { logs } = React.useContext(LoggerContext)
  const backupLogs = logs[backup?.id || ''] || []

  return (
    <Shell>
      <CardTitle className="pb-2 text-sm font-semibold">Logs</CardTitle>
      <LogsDataTable columns={logsColumns(backup?.source || '')} data={backupLogs} />
    </Shell>
  )
}
