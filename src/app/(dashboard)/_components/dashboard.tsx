'use client'

import { ButtonAction } from '@/components/button-action'
import { ButtonLink } from '@/components/button-link'
import { CardMessage } from '@/components/card-message'
import { Loadings } from '@/components/loadings'
import { Shell, ShellCard } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useBackups } from '@/hooks/use-backups'
import { useMounted } from '@/hooks/use-mounted'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { FilePlusIcon } from '@radix-ui/react-icons'
import { BackupItem } from './backup-item'

export function Dashboard() {
  useTauriSize({ width: 600, height: 580 })
  const { data: backups, isLoading, isFetching, isError, refetch } = useBackups()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <Shell>
        <ShellCard>
          <section className="animate-fade-up p-4" style={{ animationDelay: '0.10s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={1} />
          </section>
          <section className="animate-fade-up p-4" style={{ animationDelay: '0.20s', animationFillMode: 'both' }}>
            <Skeleton className="mb-1 h-6 w-40 rounded" />
            <Loadings length={4} />
          </section>
        </ShellCard>
      </Shell>
    )
  }

  return (
    <Shell>
      <ShellCard>
        <section className="animate-fade-up p-4" style={{ animationDelay: '0.10s', animationFillMode: 'both' }}>
          <CardTitle className="pb-2 text-sm font-semibold">Salvage</CardTitle>
          <ButtonLink
            href="/create"
            title="Create a new backup"
            description="Create a new backup to manage your data"
            Icon={FilePlusIcon}
          />
        </section>

        <section className="animate-fade-up p-4" style={{ animationDelay: '0.20s', animationFillMode: 'both' }}>
          <CardTitle className="pb-2 text-sm font-semibold">Backups</CardTitle>

          {!isLoading || (isFetching && <Loadings length={3} />)}

          {isError && (
            <ButtonAction
              title="Error loading backups."
              description="Please try again."
              buttonTitle="Reload"
              buttonTitleAction={refetch}
            />
          )}

          {backups && backups.length > 0 ? (
            backups.map((backup, index) => <BackupItem key={index} backup={backup} />)
          ) : (
            <CardMessage
              title="No Backups Available"
              description="It appears there are currently no backups. Please create a backup to proceed."
            />
          )}
        </section>
      </ShellCard>
    </Shell>
  )
}
