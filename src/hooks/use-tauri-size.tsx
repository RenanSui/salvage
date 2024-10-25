'use client' // Ensure this is a client-side component

import { tauriWindow } from '@/lib/tauri'
import * as React from 'react'

type Size = {
  width: number
  height: number
}

export const useTauriSize = (initialSize: Size) => {
  const [size, setSize] = React.useState<Size>(initialSize)

  const updateWindowSize = React.useCallback(
    async (newSize: Size) => {
      // Use functional setState to get the latest value of size
      setSize((prevSize) => {
        if (newSize.width !== prevSize.width || newSize.height !== prevSize.height) {
          return newSize // Update state only if the size has changed
        }
        return prevSize // Return the previous size if there's no change
      })

      const appWindow = (await tauriWindow())?.appWindow
      const LogicalSize = (await tauriWindow())?.LogicalSize
      if (appWindow && LogicalSize) {
        await appWindow?.setSize(new LogicalSize(newSize.width, newSize.height))
      }
    },
    [], // No dependencies needed since we're using latest state in setSize
  )

  React.useEffect(() => {
    void updateWindowSize(initialSize)
  }, [initialSize, updateWindowSize])

  return { size, updateWindowSize }
}
