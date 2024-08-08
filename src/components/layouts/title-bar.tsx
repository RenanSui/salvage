'use client'

import { tauriWindow } from '@/lib/tauri'
import { Icons } from '../icons'

export default function TitleBar() {
  return (
    <header
      className="sticky top-0 z-[999] bg-custom-gray-300/60 dark:bg-custom-dark-200/60 shadow-md flex items-center justify-between backdrop-blur"
      data-tauri-drag-region
    >
      <button className="px-2 group cursor-default">
        <Icons.logo
          className="transition-all"
          middleStroke="group-hover:stroke-custom-primary-500 dark:group-hover:stroke-custom-primary-200"
          sideStrokes="group-hover:stroke-custom-primary-500 dark:group-hover:stroke-custom-primary-200"
        />
      </button>
      <div className="flex items-center">
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
