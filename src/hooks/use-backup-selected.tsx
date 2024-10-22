import { type BackupSchema } from '@/types'
import { atom, useAtom } from 'jotai'

export const backupSelectedAtom = atom<BackupSchema['id'] | null>(null)

export function useBackupSelectedAtom() {
  const [backupSelected, setBackupSelected] = useAtom(backupSelectedAtom)
  return { backupSelected, setBackupSelected }
}
