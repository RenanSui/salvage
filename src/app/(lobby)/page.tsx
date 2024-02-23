'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { invoke, listen } from '@/lib/tauri'
import { cn, longestCommonStartingSubstring } from '@/lib/utils'
import { useEffect, useState } from 'react'

const Paths = [
  {
    id: 0,
    title: 'Salvage',
    source: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\sair',
    dest: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\entrar',
  },
  {
    id: 1,
    title: 'Salvage Salvage',
    source: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\sair',
    dest: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\entrar',
  },
  {
    id: 2,
    title: 'Salvage Salvage Salvage',
    source: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\sair',
    dest: 'C:\\Users\\renan\\Desktop\\New folder\\salvage\\entrar',
  },
]

type PathItems = (typeof Paths)[0]

export default function Lobby() {
  const [salvage, setSalvage] = useState(0)

  const addNewBackup = () => {
    console.log('Add New Backup')
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex min-h-4 items-center justify-center rounded-md border border-dashed border-neutral-700 py-4 transition-colors duration-300 hover:bg-neutral-800/70">
            <Icons.cross className="rotate-45 text-neutral-600" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="font-bold" onClick={addNewBackup}>
            <Ellipsis className="w-32">Add New Backup</Ellipsis>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Backups</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea>
            {Paths.map((item) => {
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setSalvage(item.id)}
                >
                  <Ellipsis className="w-32">{item.title}</Ellipsis>
                </DropdownMenuItem>
              )
            })}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-col gap-4">
        <SalvageCard path={Paths[salvage]} />
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
  windowLabel?: string
}

const SalvageCard = ({ path }: { path: PathItems }) => {
  const [progress, setProgress] = useState(0)
  const { dest, source, title } = path

  useEffect(() => {
    if (source.length > 0 && dest.length > 0) {
      invoke('salvage_watching', { source, dest })
        .then(() => console.log('succes'))
        .catch(console.error)
    }
  }, [source, dest])

  useEffect(() => {
    listen('progress', (event: RustEventMessage) => {
      console.log('Progress: ', event.payload.message)
      const progressMessage = Number(event.payload.message)
      setProgress(progressMessage === 100 ? 0 : progressMessage)
    })
  }, [progress])

  useEffect(() => {
    // register('CommandOrControl+Shift+C', (shortcut) => {
    //   console.log(`Shortcut ${shortcut} triggered`)
    // })
  }, [])

  const openPath = (path: string) => {
    invoke('open_path', { path })
      .then(() => console.log('succes'))
      .catch(console.error)
  }

  const commom = longestCommonStartingSubstring([source, dest])

  return (
    <div className=" flex min-h-4 flex-col items-center justify-center gap-4 rounded-md border border-neutral-700 p-4 transition-colors duration-300 hover:bg-neutral-800/70">
      <div className="mx-4 flex w-full justify-between">
        <Icons.minus className="h-4 w-4 text-neutral-600" />
        <Icons.cross className="h-4 w-4 text-neutral-600" />
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <Ellipsis className="cursor-default text-3xl">{title}</Ellipsis>
          <Ellipsis
            className="cursor-pointer transition-all duration-300 hover:text-neutral-400"
            onClick={() => openPath(source)}
            title={source}
          >
            {source.replace(commom, `..source\\${title}\\`)}
          </Ellipsis>
          <Ellipsis
            className="cursor-pointer transition-all duration-300 hover:text-neutral-400"
            onClick={() => openPath(dest)}
            title={dest}
          >
            {dest.replace(commom, `..destination\\${title}\\`)}
          </Ellipsis>
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
    <p
      className={cn(
        'w-72 select-none overflow-hidden text-ellipsis whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </p>
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
