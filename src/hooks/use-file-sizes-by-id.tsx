import { backupService } from '@/lib/backup/actions'
import { useQuery } from '@tanstack/react-query'

export function useFileSizesById(id: string | null) {
  return useQuery({
    queryKey: [`file-sizes-${id}`],
    queryFn: async () => await backupService.fetch_file_sizes_by_id(id || ''),
    initialData: [],
    refetchOnWindowFocus: false,
  })
}
