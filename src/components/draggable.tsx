'use client'

import { window } from '@/lib/tauri'
import { useEffect } from 'react'

export const Draggable = ({
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  useEffect(() => {
    const noDragSelector = 'h1, p'

    const handleDragging = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(noDragSelector)) return
      const tauriWindow = await window()
      await tauriWindow.appWindow.startDragging()
    }

    document.addEventListener('mousedown', handleDragging)
    return () => removeEventListener('mousedown', handleDragging)
  }, [])

  return <>{children}</>
}
