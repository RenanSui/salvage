import Backup from './_components/backup'

export default function BackupPage({ params }: { params: { id: string } }) {
  return <Backup id={params.id} />
}
