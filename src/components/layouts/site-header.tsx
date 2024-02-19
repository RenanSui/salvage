export const SiteHeader = () => {
  return (
    <header className="relative flex justify-between bg-red-500/50">
      <button className="p-4">^</button>
      <h1 className="absolute left-1/2 top-4 -translate-x-1/2 cursor-default">
        Salvage
      </h1>
      <div className="flex">
        <button className="p-4">—</button>
        <button className="p-4">X</button>
      </div>
    </header>
  )
}
