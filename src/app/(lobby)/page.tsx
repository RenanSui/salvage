'use client'

import { Icons } from '@/components/ui/icons'

const Paths = [
  {
    id: 0,
    title: 'Salvage',
    source: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\sair',
    dest: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\entrar',
  },
]

type PathItems = (typeof Paths)[0]

export default function Lobby() {
  return (
    <div className="flex flex-col gap-2">
      <div className="mx-4 flex min-h-4 items-center justify-center rounded-md border border-dashed border-neutral-700 py-4 transition-colors duration-300 hover:bg-neutral-800/70">
        <Icons.cross className="rotate-45 text-neutral-600" />
      </div>

      <div>
        {Paths.map((item) => (
          <PathCard key={item.id} path={item} />
        ))}
      </div>
    </div>
  )
}

const PathCard = ({ path }: { path: PathItems }) => {
  const { dest, source, title } = path

  return (
    <div className="mx-4 flex min-h-4 flex-col items-center justify-center gap-4 rounded-md border border-neutral-700 p-4 transition-colors duration-300 hover:bg-neutral-800/70">
      <div className="mx-4 flex w-full justify-between">
        <Icons.minus className="h-4 w-4 text-neutral-600" />
        <Icons.cross className="h-4 w-4 text-neutral-600" />
      </div>
      <div className="flex w-full justify-between">
        <div>
          <h1>{title}</h1>
          <p>{source}</p>
          <p className="text-green-500">{dest}</p>
        </div>
        <div className="flex flex-col gap-4">
          <Icons.cross className="h-4 w-4 text-neutral-600" />
          <Icons.cross className="h-4 w-4 text-neutral-600" />
          <Icons.cross className="h-4 w-4 text-neutral-600" />
        </div>
      </div>
    </div>
  )
}
