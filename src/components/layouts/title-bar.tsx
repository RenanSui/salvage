'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { tauriWindow } from '@/lib/tauri'
import { ThemeToggle } from './theme-toggle'

type TitleBarProps = {
  title?: string
  customBreadcrumb?: React.ComponentType<{ defaultBreadcrumb: string }>
}

export function TitleBar({ title = 'Dashboard', customBreadcrumb: CustomBreadcrumb }: TitleBarProps) {
  return (
    <header className="flex items-center justify-between gap-1 p-4" data-tauri-drag-region>
      {CustomBreadcrumb ? (
        <CustomBreadcrumb defaultBreadcrumb={title} />
      ) : (
        <h1 className="max-w-40 truncate text-lg font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline">
          {title}
        </h1>
      )}
      <div className="ml-auto flex items-center rounded-md border border-border bg-neutral-50 p-1 dark:bg-neutral-950">
        <ThemeToggle />
      </div>
      <div className="flex items-center rounded-md border border-border bg-neutral-50 p-1 dark:bg-neutral-950">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 cursor-default rounded-sm px-2"
          onClick={async () => (await tauriWindow())?.appWindow.minimize()}
        >
          <Icons.minus />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 cursor-default rounded-sm px-2 hover:!bg-red-600"
          onClick={async () => (await tauriWindow())?.appWindow.close()}
        >
          <Icons.cross />
        </Button>
      </div>
    </header>
  )
}
