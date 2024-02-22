'use client'

import { Icons } from '@/components/ui/icons'
import { invoke, listen } from '@/lib/tauri'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const Paths = [
  {
    id: 0,
    title: 'Salvage',
    source: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\sair',
    dest: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\entrar',
  },
]

type PathItems = (typeof Paths)[0]

const replaceDir =
  'C:\\Users\\renan\\Desktop\\New folder\\salvage\\sair\\aoba2.txt'.replace(
    Paths[0].source,
    Paths[0].dest,
  )

console.log(replaceDir)

export default function Lobby() {
  return (
    <div className="flex flex-col gap-2">
      <div className="mx-4 flex min-h-4 items-center justify-center rounded-md border border-dashed border-neutral-700 py-4 transition-colors duration-300 hover:bg-neutral-800/70">
        <Icons.cross className="rotate-45 text-neutral-600" />
      </div>

      <div className="flex flex-col gap-2">
        {Paths.map((item) => (
          <SalvageCard key={item.id} path={item} />
        ))}
      </div>
    </div>
  )
}

type RustEventMessage = {
  event: string
  id: number
  payload: {
    message: string
  }
  windowLabel?: string | null
}

const SalvageCard = ({ path }: { path: PathItems }) => {
  const [progress, setProgress] = useState(0)
  const { dest, source, title } = path

  useEffect(() => {
    invoke('salvage_watching', { source, dest })
      .then(() => console.log('succes'))
      .catch(console.error)
  }, [source, dest])

  useEffect(() => {
    listen('progress', (event: RustEventMessage) => {
      console.log('Progress: ', event.payload.message)
      const progressMessage = Number(event.payload.message)
      setProgress(progressMessage === 100 ? 0 : progressMessage)
    })
  }, [progress])

  return (
    <div className="mx-4 flex min-h-4 flex-col items-center justify-center gap-4 rounded-md border border-neutral-700 p-4 transition-colors duration-300 hover:bg-neutral-800/70">
      <div className="mx-4 flex w-full justify-between">
        <Icons.minus className="h-4 w-4 text-neutral-600" />
        <Icons.cross className="h-4 w-4 text-neutral-600" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <Ellipsis className="text-3xl">{title}</Ellipsis>
          <Ellipsis>{source}</Ellipsis>
          <Ellipsis>{dest}</Ellipsis>
        </div>
        <div className="flex flex-col gap-4">
          <Icons.cross className="h-4 w-4 text-neutral-600" />
          <Icons.cross className="h-4 w-4 text-neutral-600" />
          <Icons.cross className="h-4 w-4 text-neutral-600" />
        </div>
      </div>
      <ProgressBar progressWidth={progress} />
    </div>
  )
}

interface EllipsisProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string
}

const Ellipsis = ({ children, className, ...props }: EllipsisProps) => {
  return (
    <div
      title={children}
      className={cn(
        'w-72 overflow-hidden text-ellipsis whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const ProgressBar = ({ progressWidth }: { progressWidth: number }) => {
  return (
    <div className="h-2 w-full overflow-hidden rounded-xl border border-neutral-700">
      {progressWidth === 100 ? null : (
        <div
          className="h-full bg-neutral-700/50"
          style={{ width: `${progressWidth}%` }}
        ></div>
      )}
    </div>
  )
}
