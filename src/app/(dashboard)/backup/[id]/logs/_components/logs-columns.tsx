import { type LogMessage } from '@/components/providers/logger-provider'
import { type ColumnDef } from '@tanstack/react-table'

export const logsColumns = (source: string) =>
  [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: ({ row }) => (
        <span className="font-light text-stone-300">
          {row.original.day} {row.original.month} {row.original.timestamp.padEnd(12, '0')}
        </span>
      ),
    },
    {
      header: 'Event',
      accessorKey: 'event',
      cell: ({ row }) => <span className="font-semibold">{row.original.event_type}</span>,
    },
    {
      header: 'Message',
      accessorKey: 'message',
      cell: ({ row }) => (
        <span className="block max-w-[200px] truncate font-light text-stone-300">
          {row.original.message
            .replace(source.replaceAll(/\\/g, '\\\\'), '')
            .replaceAll('"', '')
            .replaceAll(/\\\\/g, '/')}
        </span>
      ),
    },
  ] satisfies ColumnDef<LogMessage, unknown>[]
