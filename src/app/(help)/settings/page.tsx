import { ThemeToggle } from '@/components/layouts/theme-toggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-28px)] p-4 ">
      <Card
        className={cn(
          'w-full max-w-screen-lg pt-2 mx-auto border-none shadow-none bg-transparent',
        )}
      >
        <ScrollArea className="h-[calc(100vh-78px)]">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="font-heading text-3xl">Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <Card>
              <CardHeader>
                <CardTitle>Site Preferences</CardTitle>
                <CardDescription>Manage your site preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className='className="space-y-0.5"'>
                      <h1 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Change Color Theme
                      </h1>
                    </div>
                    <ThemeToggle labelled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}
