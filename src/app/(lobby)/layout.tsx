export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1 ">{children}</main>
    </div>
  )
}
