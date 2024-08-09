import { tauriInvoke } from '@/lib/tauri'
import { BackupSchema } from '@/types'
import { useQuery } from '@tanstack/react-query'

export function useSalvageData() {
  return useQuery({
    queryKey: ['salvage-data'],
    queryFn: async () => {
      return (await tauriInvoke<BackupSchema[]>('get_salvage_items')) ?? []
    },
    initialData: [],
    refetchOnWindowFocus: false,
  })
}
