import { CardDescription, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFileSizesById } from '@/hooks/use-file-sizes-by-id'
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import * as React from 'react'

type StatisticsBackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function StatisticsBackup({ backup }: StatisticsBackupProps) {
  const [collapsable, setCollapsable] = React.useState(false)
  const { data: fileSizes } = useFileSizesById(backup.id)

  console.log(backup.id)
  console.log(fileSizes)

  const Icon = collapsable ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">
        Statistics
        {/* Logs {`(${backupLogs.length})`} */}
      </CardTitle>
      <Collapsible open={collapsable} onOpenChange={setCollapsable}>
        <CollapsibleTrigger
          className={cn(
            'text-start bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border w-full p-2 cursor-default flex items-center justify-between transition-colors',
            collapsable ? 'rounded-t' : 'rounded',
          )}
        >
          <div className="p-2">
            <CardTitle>{backup.name} Statistics</CardTitle>
            <CardDescription>A list of your files</CardDescription>
          </div>
          <div className="flex items-center gap-2 p-2">
            <Icon className="size-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1 bg-white/60 dark:bg-accent/20 rounded-b border-t-0 border">
          <ScrollArea className="h-[calc(100vh-11.5rem)]">
            <Table className="bg-neutral-50 dark:bg-neutral-900/30">
              <TableCaption>A list of your files</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-72">File</TableHead>
                  <TableHead>
                    <div className="w-28 text-end">Size</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileSizes?.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.file}</TableCell>
                    <TableCell>
                      <div className="w-28 gap-2 flex justify-end">
                        <span>{file.size}</span>
                        <span>{file.unit.toUpperCase()}</span>
                        {/* {file.size} {file.unit.toUpperCase()} */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
