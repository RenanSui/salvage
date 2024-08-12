import { tauriInvoke } from '@/lib/tauri'
import { BackupSchema } from '@/types'
import { useQuery } from '@tanstack/react-query'

export function useBackups() {
  return useQuery({
    queryKey: ['backups'],
    queryFn: async () => {
      return (await tauriInvoke<BackupSchema[]>('get_all_backups')) ?? []
    },
    initialData: [],
    refetchOnWindowFocus: false,
  })
}
