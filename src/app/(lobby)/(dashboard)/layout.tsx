import * as React from 'react'

export default async function BackupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* <TitleBar /> */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
