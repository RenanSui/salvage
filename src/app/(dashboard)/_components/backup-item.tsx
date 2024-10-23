import { Icons } from '@/components/icons'
import { ButtonCard } from '@/components/ui/button-card'
import { type BackupSchema } from '@/types'

type BackupItemProps = { backup: BackupSchema }

export function BackupItem({ backup }: BackupItemProps) {
  const Icon = backup.is_file ? Icons.file : Icons.folder

  return (
    <ButtonCard.Link variant="ghost" href={`/backup/${backup.id}`}>
      <ButtonCard.Icon variant="ghost">
        <Icon className="size-4" />
      </ButtonCard.Icon>
      <ButtonCard.Header>
        <ButtonCard.Title>{backup.name}</ButtonCard.Title>
        <ButtonCard.Description>{backup.source}</ButtonCard.Description>
      </ButtonCard.Header>
    </ButtonCard.Link>
  )
}
