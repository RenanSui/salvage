import { backupService } from '@/lib/backup/actions'
import { type FilesSchema } from '@/types'
import { type ColumnDef } from '@tanstack/react-table'

export const filesColumns: ColumnDef<FilesSchema, unknown>[] = [
  {
    header: 'File',
    accessorKey: 'file',
    cell: ({ row }) => {
      return (
        <div className="w-full max-w-screen-sm" onClick={() => backupService.open_in_explorer(row.original.source)}>
          {row.original.file}
        </div>
      )
    },
  },
  {
    header: () => <div>Size</div>,
    accessorKey: 'size',
    cell: ({ row }) => (
      <div className="space-x-2" onClick={() => backupService.open_in_explorer(row.original.source)}>
        <span>{String(row.getValue('size'))}</span>
        <span>{row.original.unit.toUpperCase()}</span>
      </div>
    ),
  },
]
