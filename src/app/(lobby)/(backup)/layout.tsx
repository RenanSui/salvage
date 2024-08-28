import TitleBar from '@/components/layouts/title-bar'
import * as React from 'react'

export default async function BackupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <TitleBar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
