'use client'

import { ButtonAction } from '@/components/button-action'
import { Loadings } from '@/components/loadings'
import { Shell, ShellCard } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { useFileSizesById } from '@/hooks/use-file-sizes-by-id'
import { useMounted } from '@/hooks/use-mounted'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { useSearchParams } from 'next/navigation'
import { filesColumns } from './_components/files-columns'
import { FilesDataTable } from './_components/files-data-table'

export default function FilesPage() {
  useTauriSize({ width: 600, height: 624 })

  const searchParams = useSearchParams()
  const mounted = useMounted()

  const id = searchParams.get('id') as string | undefined
  const { data: fileSizes, isFetched, isLoading, isFetching, error, refetch } = useFileSizesById(id || '')

  if (!isFetched || isLoading || isFetching || !mounted) {
    return (
      <Shell>
        <CardTitle className="pb-2 text-sm font-semibold">Files</CardTitle>
        <Loadings length={1} size="sm" />
        <Loadings length={10} size="sm" withIcon />
        <Loadings length={1} size="sm" />
      </Shell>
    )
  }

  if (error) {
    return (
      <Shell>
        <CardTitle className="pb-2 text-sm font-semibold">Files</CardTitle>
        <ButtonAction
          title="Error loading files."
          description="Please try again."
          buttonTitle="Reload"
          buttonTitleAction={refetch}
        />
      </Shell>
    )
  }

  return (
    <Shell className="pb-0">
      <CardTitle className="pb-2 text-sm font-semibold">Files</CardTitle>
      <ShellCard className="min-h-[calc(100vh-112px)]">
        <FilesDataTable columns={filesColumns} data={fileSizes} />
      </ShellCard>
    </Shell>
  )
}
