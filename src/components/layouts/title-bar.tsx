'use client'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { tauriWindow } from '@/lib/tauri'
import Link from 'next/link'
import { Icons } from '../icons'

export default function TitleBar() {
  return (
    <header
      className="sticky top-0 z-[999] bg-custom-gray-300/60 dark:bg-custom-dark-200/60 shadow-md flex items-center backdrop-blur"
      data-tauri-drag-region
    >
      <button className="px-2 group cursor-default">
        <Icons.logo
          className="transition-all"
          middleStroke="group-hover:stroke-custom-primary-500 dark:group-hover:stroke-custom-primary-200"
          sideStrokes="group-hover:stroke-custom-primary-500 dark:group-hover:stroke-custom-primary-200"
        />
      </button>

      <TitleBarMenubar />

      <div className="flex items-center ml-auto">
        <button
          className="w-11 h-7 hover:bg-custom-gray-500 flex items-center justify-center transition-all cursor-default"
          onClick={async () => (await tauriWindow())?.appWindow.minimize()}
        >
          <Icons.minus />
        </button>
        <button
          className="w-11 h-7 hover:bg-red-500 flex items-center justify-center group transition-all cursor-default"
          onClick={async () => (await tauriWindow())?.appWindow.close()}
        >
          <Icons.cross className="group-hover:stroke-white" />
        </button>
      </div>
    </header>
  )
}

export function TitleBarMenubar() {
  return (
    <Menubar className="bg-transparent shadow-none border-none p-0 h-7 px-1">
      <MenubarMenu>
        <MenubarTrigger className="bg-none py-0 px-2 text-muted-foreground opacity-80">
          Lobby
        </MenubarTrigger>
        <MenubarContent>
          <Link href="/">
            <MenubarItem>Lobby</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="bg-none py-0 px-2 text-muted-foreground opacity-80">
          Backups
        </MenubarTrigger>
        <MenubarContent>
          <Link href="/add-new-backup">
            <MenubarItem>New Backup</MenubarItem>
          </Link>
          <Link href="/dashboard">
            <MenubarItem>Dashboard</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="bg-none py-0 px-2 text-muted-foreground opacity-80">
          Help
        </MenubarTrigger>
        <MenubarContent>
          <Link href="/settings">
            <MenubarItem>Settings</MenubarItem>
          </Link>
          <Link href="/about" className="pointer-events-none">
            <MenubarItem disabled>About</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
