import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export function BackupDashboardSkeleton() {
  return (
    <ScrollArea className="h-[calc(100vh-78px)] w-full pt-[7px]">
      <div className="space-y-4 flex flex-col">
        <h1 className="font-heading text-3xl leading-none tracking-tight">
          <Skeleton className="h-8 w-36" />
        </h1>
        <ScrollArea orientation="horizontal" scrollBarClassName="h-2">
          <div className="gap-2 flex pt-[3px]">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </ScrollArea>
        <Skeleton className="h-8 w-56 pb-2" />
      </div>
      <div className="pt-4 space-y-4">
        <Skeleton className="w-full h-[500px]" />
        <Skeleton className="w-full h-[130px]" />
      </div>
    </ScrollArea>
  )
}
