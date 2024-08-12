import { tauriInvoke } from '@/lib/tauri'
import { BackupSchema } from '@/types'
import { useQuery } from '@tanstack/react-query'

export function useBackupById(id: string | null) {
  return useQuery({
    queryKey: [`backup-${id}`],
    queryFn: async () =>
      await tauriInvoke<BackupSchema>('get_backup_by_id', { id }),
    refetchOnWindowFocus: false,
    gcTime: 0,
  })
}
