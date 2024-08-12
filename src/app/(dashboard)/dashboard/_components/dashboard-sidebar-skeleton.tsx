import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSidebarSkeleton() {
  return (
    <Card className="w-full max-w-[248px] p-2 space-y-2">
      <Skeleton className="w-full h-8 px-3" />
      <Separator />
      <ScrollArea className="h-[calc(100vh-127px)]">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-8 px-3 mb-1" />
        ))}
      </ScrollArea>
    </Card>
  )
}
