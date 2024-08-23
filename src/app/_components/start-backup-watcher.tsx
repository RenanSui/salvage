'use client'

import { backupService } from '@/lib/backup/actions'
import * as React from 'react'

export function StartBackupWatcher() {
  React.useEffect(() => {
    backupService.start_watching()
  }, [])

  return null
}
