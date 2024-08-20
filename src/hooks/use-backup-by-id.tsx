import { backupService } from '@/lib/backup/actions'
import { useQuery } from '@tanstack/react-query'

export function useBackupById(id: string | null) {
  return useQuery({
    queryKey: [`backup-${id}`],
    queryFn: async () => await backupService.fetch_backup_by_id(id || ''),
    refetchOnWindowFocus: false,
    gcTime: 0,
  })
}
