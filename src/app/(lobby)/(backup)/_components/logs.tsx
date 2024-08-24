import { LoggerContext } from '@/components/providers/logger-provider'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import React from 'react'

type LogsProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function Logs({ backup }: LogsProps) {
  const { logs } = React.useContext(LoggerContext)
  const backupLogs = logs[backup.id]

  return (
    <div className="space-y-4">
      <Card className="p-0 cursor-default">
        <CardHeader className="space-y-0 p-2 border-b">
          <CardTitle className="font-semibold text-lg">Backup Logs</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-18.3rem)]">
          <div className="rounded-lg">
            {backupLogs?.map((log, index) => (
              <p
                key={index}
                className="space-x-1 border-b hover:bg-accent p-2 cursor-default"
              >
                <ChevronRightIcon
                  className={cn('inline', index === 0 ? '' : 'opacity-0')}
                />
                <span className="text-sm text-muted-foreground">{log.day}</span>
                <span className="text-sm text-muted-foreground">
                  {log.month}
                </span>
                <span className="text-sm text-muted-foreground font-mono pr-4">
                  {log.timestamp.padEnd(12, '0')}
                </span>
                <span className="text-xs text-foreground inline-block uppercase pr-4 w-[108px] text-center">
                  {log.event_type}
                </span>
                <span className="text-muted-foreground text-sm">
                  {log.message
                    .replaceAll(/\\\\/g, '\\')
                    .replaceAll('"', '')
                    .replace(backup.source, '')
                    .replace(backup.destination, '')}
                </span>
              </p>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
