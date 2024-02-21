'use client'

import { window } from '@/lib/tauri'
import { MenuIcon } from '../menu-icon'
import { Button } from '../ui/button'
import { Icons } from '../ui/icons'

export const SiteHeader = () => {
  return (
    <header className="relative flex justify-between bg-neutral-800/10">
      <MenuIcon />

      <div className="absolute left-1/2 top-4 -translate-x-1/2 cursor-default">
        Salvage
      </div>

      <div className="flex items-center justify-center">
        <Button size={'icon'} className="cursor-default hover:text-yellow-500">
          <Icons.minus />
        </Button>
        <Button
          size={'icon'}
          className="cursor-default hover:text-yellow-500"
          onClick={async () => {
            const { appWindow } = await window()
            appWindow.close()
          }}
        >
          <Icons.cross />
        </Button>
      </div>
    </header>
  )
}
