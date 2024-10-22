'use client'

import { ButtonAction } from '@/components/button-action'
import { Loadings } from '@/components/loadings'
import { Shell } from '@/components/shells/shell'
import { CardTitle } from '@/components/ui/card'
import { useFileSizesById } from '@/hooks/use-file-sizes-by-id'
import { useTauriSize } from '@/hooks/use-tauri-size'
import { filesColumns } from './_components/files-columns'
import { FilesDataTable } from './_components/files-data-table'

export default function FilesPage({ params }: { params: { id: string } }) {
  useTauriSize({ width: 600, height: 636 })
  const { data: fileSizes, isFetched, isLoading, isFetching, error, refetch } = useFileSizesById(params.id)

  if (!isFetched || isLoading || isFetching) {
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
    <Shell>
      <CardTitle className="pb-2 text-sm font-semibold">Files</CardTitle>
      <FilesDataTable columns={filesColumns} data={fileSizes} />
    </Shell>
  )
}
