/* eslint-disable camelcase */
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

import { backupService } from '@/lib/backup/actions'
import { BackupSchema } from '@/types'
import * as React from 'react'

type MonitorBackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function MonitorBackup({ backup }: MonitorBackupProps) {
  const [isMonitoring, setIsMonitoring] = React.useState(true)

  const handleSwitchChange = (checked: boolean) => {
    setIsMonitoring(checked)
    checked
      ? backupService.start_individual_backup(backup)
      : backupService.stop_individual_backup(backup)
  }

  return (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">Monitoring</CardTitle>
      <div className="flex justify-between items-center p-2 border rounded-md bg-neutral-50 dark:bg-neutral-900">
        <div className="space-y-0.5 p-2">
          <CardTitle>Backup Monitoring</CardTitle>
          <CardDescription>
            Enable automatic backup monitoring and logs
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {isMonitoring ? 'On' : 'Off'}
          <Switch
            className="cursor-default"
            checked={isMonitoring}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>
    </div>
  )
}
