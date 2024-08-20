import { backupService } from '@/lib/backup/actions'
import { useQuery } from '@tanstack/react-query'

export function useBackups() {
  return useQuery({
    queryKey: ['backups'],
    queryFn: async () => await backupService.fetch_all_backups(),
    initialData: [],
    refetchOnWindowFocus: false,
  })
}
