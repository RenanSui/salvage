'use client'

import { ThemeProvider } from 'next-themes'
import { type HTMLAttributes } from 'react'

export function NextThemesProvider({ children }: HTMLAttributes<HTMLDivElement>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  )
}
