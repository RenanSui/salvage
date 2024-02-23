import { SiteFooter } from '@/components/layouts/site-footer'

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-900/50 text-white">
      {/* <SiteHeader /> */}
      <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
