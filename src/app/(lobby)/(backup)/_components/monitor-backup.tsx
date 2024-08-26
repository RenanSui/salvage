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
  const [switchState, setSwitchState] = React.useState(true)

  return (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">Monitoring</CardTitle>
      <div
        className="p-2 flex flex-row items-center border justify-between bg-neutral-50
dark:bg-neutral-900 rounded-md"
      >
        <div className="space-y-0.5 p-2">
          <CardTitle>Backup Monitoring</CardTitle>
          <CardDescription>
            Enable automatic backup monitoring and logs
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {switchState ? 'On' : 'Off'}
          <Switch
            className="cursor-default"
            checked={switchState}
            onCheckedChange={(checked) => {
              setSwitchState(checked)

              if (checked) {
                backupService.start_individual_backup(backup)
              } else {
                backupService.stop_individual_backup(backup)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
