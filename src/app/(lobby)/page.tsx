'use client'

import { Icons } from '@/components/ui/icons'

export default function Lobby() {
  return (
    <div className="mx-4 flex min-h-4 items-center justify-center rounded-md border border-dashed border-neutral-700 py-4 transition-colors duration-300 hover:bg-neutral-800/70 ">
      <Icons.cross className="rotate-45 text-neutral-600" />
    </div>
  )
}
