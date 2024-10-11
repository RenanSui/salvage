import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export function BackupDashboardSkeleton() {
  return (
    <ScrollArea className="h-[calc(100vh-78px)] w-full">
      <div className="w-full p-2 space-y-4">
        <Skeleton className="h-8 w-36" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </ScrollArea>
  )
}
