import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'
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
  const { backupSelected, setBackupSelected } = useBackupSelectedAtom()

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
        {items.map((backup, index) => {
          const Icon = backup.is_file ? Icons.file : Icons.folder

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                'group w-full justify-start items-center gap-1 mb-1 font-normal bg-transparent cursor-default',
                backup.id === backupSelected &&
                  'bg-foreground/10 hover:bg-foreground/10',
              )}
              onClick={() => setBackupSelected(backup.id)}
            >
              <Icon
                className={cn(
                  'size-4 text-foreground/70 group-hover:text-foreground stroke-[1]',
                  backup.id === backupSelected &&
                    'text-custom-primary-200 group-hover:text-custom-primary-200 stroke-[3]',
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
          )
        })}
      </ScrollArea>
    </Card>
  )
}
