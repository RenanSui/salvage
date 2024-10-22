import { Icons } from '@/components/icons'
import { type BackupSchema } from '@/types'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

type BackupItemProps = { backup: BackupSchema }

export function BackupItem({ backup }: BackupItemProps) {
  const Icon = backup.is_file ? Icons.file : Icons.folder

  return (
    <Link
      href={`/backup/${backup.id}`}
      className="hover:bg-app-card group relative flex cursor-default items-center gap-2 rounded-md border border-transparent px-4 py-3 transition-colors duration-150 ease-in-out hover:border-border"
    >
      <div className="bg-app-background flex size-8 items-center justify-center rounded-lg transition-colors duration-150 ease-in-out hover:!bg-foreground/20 group-hover:bg-foreground/10">
        <Icon className="size-4" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{backup.name}</p>
        <p className="max-w-[400px] truncate text-xs text-stone-400">{backup.source}</p>
      </div>
      <ChevronRightIcon className="ml-auto size-4" />
    </Link>
  )
}
