import { backupService } from '@/lib/backup/actions'
import { useQuery } from '@tanstack/react-query'

export function useEnv(key: string) {
  return useQuery({
    queryKey: [`env-${key}`],
    queryFn: async () => await backupService.get_env(key),
    refetchOnWindowFocus: false,
    gcTime: 0,
  })
}
