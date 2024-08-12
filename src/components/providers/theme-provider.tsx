'use client'

import { ThemeProvider } from 'next-themes'
import { HTMLAttributes } from 'react'

export function NextThemesProvider({
  children,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  )
}
