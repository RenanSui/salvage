import TitleBar from '@/components/layouts/title-bar'
import * as React from 'react'

type LobbyLayoutProps = React.HTMLAttributes<HTMLDivElement>

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <TitleBar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
