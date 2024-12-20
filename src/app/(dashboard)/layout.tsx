import { TitleBar } from '@/components/layouts/title-bar'
import { ScrollArea } from '@/components/ui/scroll-area'
import * as React from 'react'
import { DashboardBreadcrumb } from './_components/dashboard-breadcrumb'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden rounded-lg bg-app-background shadow-border">
      <TitleBar title="Dashboard" customBreadcrumb={DashboardBreadcrumb} />
      <main className="flex-1">
        <ScrollArea className="h-[calc(100vh-68px)]">{children}</ScrollArea>
      </main>
    </div>
  )
}
