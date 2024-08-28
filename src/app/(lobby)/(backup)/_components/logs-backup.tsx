'use client'

import {
  LogMessage,
  LoggerContext,
} from '@/components/providers/logger-provider'
import { CardDescription, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import * as React from 'react'
import { DataTable } from './data-table'

type LogBackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

const columns = (source: string) =>
  [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: ({ row }) => (
        <span>
          {row.original.day} {row.original.month}{' '}
          {row.original.timestamp.padEnd(12, '0')}
        </span>
      ),
    },
    {
      header: 'Event',
      accessorKey: 'event',
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.event_type}</span>
      ),
    },
    {
      header: 'Message',
      accessorKey: 'message',
      cell: ({ row }) => (
        <span className="truncate ltr">
          {row.original.message
            .replace(source.replaceAll(/\\/g, '\\\\'), '')
            .replaceAll('"', '')
            .replaceAll(/\\\\/g, '/')}
        </span>
      ),
    },
  ] satisfies ColumnDef<LogMessage, unknown>[]

export function LogsBackup({ backup }: LogBackupProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { logs } = React.useContext(LoggerContext)
  const backupLogs = logs[backup.id] || []
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
            <CardTitle>Files ({backupLogs.length})</CardTitle>
            <CardDescription>A list of your files</CardDescription>
          </div>
          <div className="flex items-center gap-2 p-2 text-sm">
            {backup.name}
            <Icon className="size-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-white/60 dark:bg-accent/20 rounded-b border-t-0 border">
          <DataTable columns={columns(backup.source)} data={backupLogs} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
