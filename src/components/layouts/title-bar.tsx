'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { tauriWindow } from '@/lib/tauri'

type TitleBarProps = {
  title?: string
  customBreadcrumb?: React.ComponentType<{ defaultBreadcrumb: string }>
}

export function TitleBar({ title = 'Dashboard', customBreadcrumb: CustomBreadcrumb }: TitleBarProps) {
  return (
    <header className="flex items-center justify-between p-4" data-tauri-drag-region>
      {CustomBreadcrumb ? (
        <CustomBreadcrumb defaultBreadcrumb={title} />
      ) : (
        <h1 className="text-xl font-medium">{title}</h1>
      )}
      <div className="ml-auto flex items-center rounded-md border border-border p-1 dark:bg-neutral-950">
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
