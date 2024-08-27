import { LoggerContext } from '@/components/providers/logger-provider'
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
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { ChevronRightIcon } from 'lucide-react'
import * as React from 'react'

type LogBackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function LogBackup({ backup }: LogBackupProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { logs } = React.useContext(LoggerContext)
  const backupLogs = logs[backup.id] || []
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">Logs</CardTitle>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            'text-start bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border w-full p-2 cursor-default flex items-center justify-between transition-colors',
            isOpen ? 'rounded-t' : 'rounded',
          )}
        >
          <div className="p-2">
            <CardTitle>Logs ({backupLogs.length})</CardTitle>
            <CardDescription>A list of your recent logs</CardDescription>
          </div>
          <div className="p-2">
            <Icon className="size-4 shrink-0" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1 bg-white/60 dark:bg-accent/20 rounded-b border-t-0">
          <ScrollArea className="h-[calc(100vh-11.5rem)]">
            <Table className="bg-neutral-50 dark:bg-neutral-900/30">
              <TableCaption>A list of your recent logs</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Timestamp</TableHead>
                  <TableHead className="w-28">Event</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center font-medium">
                      <ChevronRightIcon
                        className={cn(
                          'inline size-5 text-foreground',
                          index === 0 ? '' : 'opacity-0',
                        )}
                      />
                      {`${log.day} ${log.month} ${log.timestamp.padEnd(12, '0')}`}
                    </TableCell>
                    <TableCell className="uppercase">
                      {log.event_type}
                    </TableCell>
                    <TableCell>
                      {log.message
                        .replaceAll(/\\\\/g, '\\')
                        .replaceAll('"', '')
                        .replace(backup.source, '')
                        .replace(backup.destination, '')}
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
