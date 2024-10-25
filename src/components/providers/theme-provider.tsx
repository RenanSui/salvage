'use client'

import { useMounted } from '@/hooks/use-mounted'
import { ThemeProvider } from 'next-themes'
import { type HTMLAttributes } from 'react'

export function NextThemesProvider({ children }: HTMLAttributes<HTMLDivElement>) {
  const mounted = useMounted()
  if (!mounted) return <></>

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  )
}
