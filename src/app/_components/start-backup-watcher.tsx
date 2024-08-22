'use client'

import { backupService } from '@/lib/backup/actions'
import * as React from 'react'

export function StartBackupWatcher({
  children,
}: {
  children: React.ReactNode
}) {
  React.useEffect(() => {
    backupService.start_watching()
  }, [])

  return <>{children}</>
}
