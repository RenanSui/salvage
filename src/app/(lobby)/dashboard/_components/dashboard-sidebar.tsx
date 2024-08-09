import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useBackupAtom } from '@/hooks/use-backup'
import { cn } from '@/lib/utils'
import { BackupSchema } from '@/types'
import Link from 'next/link'
import * as React from 'react'

type DashboardSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  items: BackupSchema[]
}

export function DashboardSidebar({
  items,
  className,
  ...props
}: DashboardSidebarProps) {
  const { backup: backupSelected, setBackup } = useBackupAtom()

  return (
    <Card
      className={cn('w-full max-w-[248px] p-2 space-y-2', className)}
      {...props}
    >
      <Link
        className={cn(buttonVariants({ size: 'sm' }), 'w-full cursor-default')}
        href="/add-new-backup"
      >
        Add New
      </Link>
      <Separator />
      <ScrollArea className="h-[calc(100vh-127px)]">
        {items.map((backup, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={cn(
              'group w-full justify-start items-center gap-1 mb-1 font-normal bg-transparent cursor-default',
              backup.id === backupSelected &&
                'bg-foreground/10 hover:bg-foreground/10',
            )}
            onClick={() => setBackup(backup.id)}
          >
            <Icons.file
              className={cn(
                'size-4 text-foreground/70 group-hover:text-foreground',
                backup.id === backupSelected &&
                  'text-custom-primary-200 group-hover:text-custom-primary-200',
              )}
            />
            <span
              className={cn(
                'text-sm text-foreground/70 group-hover:text-foreground',
                backup.id === backupSelected && 'font-semibold',
              )}
            >
              {backup.name}
            </span>
          </Button>
        ))}
      </ScrollArea>
    </Card>
  )
}