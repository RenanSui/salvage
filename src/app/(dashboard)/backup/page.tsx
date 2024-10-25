'use client'

import { ButtonAction } from '@/components/button-action'
import { ButtonLink } from '@/components/button-link'
import { Loadings } from '@/components/loadings'
import { Shell, ShellCard } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBackupById } from '@/hooks/use-backup-by-id'
import { useMounted } from '@/hooks/use-mounted'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { ActivityLogIcon, Pencil2Icon } from '@radix-ui/react-icons'
import { FilesIcon, Plug2Icon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { DeleteBackup } from './_components/delete-backup'
import { MonitorBackup } from './_components/monitor-backup'

export default function BackupPage() {
  useTauriSize({ width: 600, height: 590 })

  const searchParams = useSearchParams()
  const mounted = useMounted()

  const id = searchParams.get('id') as string | undefined
  const { data: backup } = useBackupById(id || '')

  if (!mounted) {
    return (
      <Shell>
        <ShellCard>
          <section className="animate-fade-up p-4" style={{ animationDelay: '0.10s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={3} />
          </section>
          <section className="animate-fade-up p-4" style={{ animationDelay: '0.20s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={2} />
          </section>
        </ShellCard>
      </Shell>
    )
  }

  if (!backup || !id) {
    return (
      <Shell>
        <ShellCard>
          <section className="animate-fade-up p-4" style={{ animationDelay: '0.10s', animationFillMode: 'both' }}>
            <CardTitle className="pb-1 text-sm font-semibold">Backup</CardTitle>
            <ButtonLink
              href="/"
              title="Backup Not Found"
              description="There are currently no backups. Please create a backup to proceed."
            />
          </section>
        </ShellCard>
      </Shell>
    )
  }

  return (
    <Shell>
      <ShellCard>
        <div className="animate-fade-up space-y-1 p-4" style={{ animationDelay: '0.10s', animationFillMode: 'both' }}>
          <CardTitle className="pb-1 text-sm font-semibold">Backup</CardTitle>
          <ButtonAction
            title="Backup Monitoring"
            description="Enable automatic backup monitoring"
            CustomButton={<MonitorBackup backup={backup} />}
            Icon={Plug2Icon}
          />
          <ButtonLink
            href={`/backup/edit?id=${backup.id}`}
            title="Edit"
            description="Modify the details of your backup"
            Icon={Pencil2Icon}
          />
          <ButtonAction
            title="Delete"
            description="Permanently delete your backup"
            CustomButton={<DeleteBackup backup={backup} />}
          />
        </div>
        <div className="animate-fade-up space-y-1 p-4" style={{ animationDelay: '0.20s', animationFillMode: 'both' }}>
          <CardTitle className="pb-1 text-sm font-semibold">Details</CardTitle>
          <ButtonLink
            href={`/backup/files?id=${backup.id}`}
            title="Files"
            description="See the files associated with this backup"
            Icon={FilesIcon}
          />
          <ButtonLink
            href={`/backup/logs?id=${backup.id}`}
            title="Logs"
            description="Access and review the logs of this backup"
            Icon={ActivityLogIcon}
          />
        </div>
      </ShellCard>
    </Shell>
  )
}
