import type { Metadata } from 'next'
import '../styles/globals.css'

import { Providers } from '@/components/providers/providers'
import { Toaster } from '@/components/ui/toaster'
import { fontHeading } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { StartBackupWatcher } from './_components/start-backup-watcher'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-transparent font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
          fontHeading.variable,
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <StartBackupWatcher />
      </body>
    </html>
  )
}
