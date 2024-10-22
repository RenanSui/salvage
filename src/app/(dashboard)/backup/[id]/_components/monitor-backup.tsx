'use client'

import { Switch } from '@/components/ui/switch'
import { backupService } from '@/lib/backup/actions'
import { type BackupSchema } from '@/types'
import * as React from 'react'

export const MonitorBackup = ({ backup }: { backup: BackupSchema }) => {
  const [isMonitoring, setIsMonitoring] = React.useState(true)

  const handleSwitchChange = async (checked: boolean) => {
    setIsMonitoring(checked)
    if (checked) {
      await backupService.start_individual_backup(backup)
    } else {
      await backupService.stop_individual_backup(backup)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-stone-200">
        {isMonitoring ? 'On' : 'Off'}
        <Switch className="cursor-default" checked={isMonitoring} onCheckedChange={handleSwitchChange} />
      </div>
    </>
  )
}
