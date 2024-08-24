import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ITabs, useTabsAtom } from '@/hooks/use-tabs'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export function BackupTabs() {
  const { tabs: tabSelected, setTabs } = useTabsAtom()

  const tabs = [
    {
      title: 'Backup',
      isActive: tabSelected === 'Backup',
      disabled: false,
    },
    {
      title: 'Statistics',
      isActive: tabSelected === 'Statistics',
      disabled: true,
    },
    {
      title: 'Logs',
      isActive: tabSelected === 'Logs',
      disabled: false,
    },
  ]

  return (
    <Tabs
      defaultValue={tabs.find((tab) => tab.isActive)?.title ?? tabs[0].title}
      className="size-full overflow-auto bg-transparent px-1"
      onValueChange={(value) => setTabs(value as ITabs)}
    >
      <ScrollArea
        orientation="horizontal"
        className="pb-2.5"
        scrollBarClassName="h-2"
      >
        <TabsList className="inline-flex items-center justify-center space-x-1.5 text-muted-foreground">
          {tabs.map((tab) => (
            <div
              role="none"
              key={tab.title}
              className={cn(
                'border-b-2 border-transparent py-1.5',
                tab.isActive && 'border-foreground',
              )}
            >
              <TabsTrigger
                disabled={tab.disabled}
                value={tab.title}
                className={cn(
                  'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  tab.isActive && 'text-foreground',
                  tab.disabled &&
                    'pointer-event-none opacity-60 hover:bg-transparent',
                )}
                asChild
              >
                <span className="cursor-default select-none">{tab.title}</span>
              </TabsTrigger>
            </div>
          ))}
        </TabsList>
        <Separator />
      </ScrollArea>
    </Tabs>
  )
}
