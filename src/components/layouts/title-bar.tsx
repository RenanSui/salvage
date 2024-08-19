'use client'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'

import { tauriWindow } from '@/lib/tauri'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Icons } from '../icons'
import { Separator } from '../ui/separator'

export default function TitleBar() {
  return (
    <header
      className="sticky top-0 bg-accent dark:bg-transparent flex items-center backdrop-blur"
      data-tauri-drag-region
    >
      <button className="px-2 group cursor-default">
        <Icons.logo
          className="transition-all"
          middleStroke="group-hover:stroke-blue-400"
          sideStrokes="group-hover:stroke-blue-400"
        />
      </button>

      <TitleBarMenubar />

      <div className="flex items-center ml-auto">
        <button
          className="w-11 h-7 hover:bg-border flex items-center justify-center transition-all cursor-default"
          onClick={async () => (await tauriWindow())?.appWindow.minimize()}
        >
          <Icons.minus />
        </button>
        <button
          className="w-11 h-7 hover:bg-destructive flex items-center justify-center group transition-all cursor-default"
          onClick={async () => (await tauriWindow())?.appWindow.close()}
        >
          <Icons.cross className="group-hover:stroke-white" />
        </button>
      </div>
    </header>
  )
}

export function TitleBarMenubar() {
  const { setTheme } = useTheme()

  return (
    <Menubar className="bg-transparent shadow-none border-none p-0 h-7 px-1">
      <MenubarMenu>
        <MenubarTrigger className="bg-none py-0 px-2 text-muted-foreground opacity-80">
          Tools
        </MenubarTrigger>
        <MenubarContent>
          <Link href="/">
            <MenubarItem>
              <Icons.dashboard className="mr-2 h-3 w-3" />
              <span>Backup</span>
            </MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="bg-none py-0 px-2 text-muted-foreground opacity-80">
          Preferences
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Icons.settings className="mr-2 h-3 w-3" />
            <span>Settings</span>
          </MenubarItem>
          <Separator className="my-1" />
          <MenubarItem disabled>
            <span className="text-center w-full">Quick Settings</span>
          </MenubarItem>
          <MenubarItem role="dark-toggle" onClick={() => setTheme('light')}>
            <SunIcon className="mr-2 h-3 w-3" />
            <span>Light</span>
          </MenubarItem>
          <MenubarItem role="dark-toggle" onClick={() => setTheme('dark')}>
            <MoonIcon className="mr-2 h-3 w-3" />
            <span>Dark</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="bg-none py-0 px-2 text-muted-foreground opacity-80">
          Help
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Icons.about className="mr-2 h-3 w-3" />
            <span>About</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
