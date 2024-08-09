import { BackupSchema } from '@/types'
import { atom, useAtom } from 'jotai'

export const backupAtom = atom<BackupSchema['id'] | null>(null)

export function useBackupAtom() {
  const [backup, setBackup] = useAtom(backupAtom)
  return { backup, setBackup }
}
