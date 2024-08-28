import { CardDescription, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { useFileSizesById } from '@/hooks/use-file-sizes-by-id'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { BackupSchema, StatisticsSchema } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, LoaderCircleIcon } from 'lucide-react'
import * as React from 'react'
import { DataTable } from './data-table'

type StatisticsBackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export const columns: ColumnDef<StatisticsSchema, unknown>[] = [
  {
    header: 'File',
    accessorKey: 'file',
    cell: ({ row }) => {
      return (
        <div
          className="w-full max-w-screen-sm"
          onClick={() => backupService.open_in_explorer(row.original.source)}
        >
          {row.original.file}
        </div>
      )
    },
  },
  {
    header: () => <div>Size</div>,
    accessorKey: 'size',
    cell: ({ row }) => (
      <div
        className="space-x-2"
        onClick={() => backupService.open_in_explorer(row.original.source)}
      >
        <span>{String(row.getValue('size'))}</span>
        <span>{row.original.unit.toUpperCase()}</span>
      </div>
    ),
  },
]

export function StatisticsBackup({ backup }: StatisticsBackupProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { data: fileSizes, isFetched } = useFileSizesById(backup.id)
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">Stats</CardTitle>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            'text-start bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border w-full p-2 cursor-default flex items-center justify-between transition-colors',
            isOpen ? 'rounded-t' : 'rounded',
          )}
        >
          <div className="p-2">
            <CardTitle>Files ({fileSizes.length})</CardTitle>
            <CardDescription>A list of your files</CardDescription>
          </div>
          <div className="flex items-center gap-2 p-2 text-sm">
            {backup.name}
            <Icon className="size-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-white/60 dark:bg-accent/20 rounded-b border-t-0 border">
          {isFetched ? (
            <DataTable columns={columns} data={fileSizes} />
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="relative flex justify-center items-center w-full h-12"
              >
                <Skeleton className="w-full h-12 absolute top-0 left-0 rounded-none border-foreground/10 border-b" />
                <LoaderCircleIcon className="animate-spin text-muted-foreground opacity-20 size-8" />
              </div>
            ))
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
