import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ISalvageItem, pathSchema } from '../types'
import { Icons } from './icons'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'

interface SalvageItemProps {
  item: ISalvageItem
  setRerender: Dispatch<SetStateAction<boolean>>
}

interface updateItemProps {
  title: string
  srcDir: string
  destDir: string
}

type SalvageState = 'maximized' | 'editing' | 'minimized'
type PathSchema = z.infer<typeof pathSchema>

const SalvageItemComponent = ({ item, setRerender }: SalvageItemProps) => {
  const [salvageState, setSalvageState] = useState<SalvageState>('maximized')
  const [isActive, setIsActive] = useState(true)
  const { destDir, id, srcDir, title } = item

  const form = useForm<PathSchema>({
    resolver: zodResolver(pathSchema),
  })

  const updateItem = (data: updateItemProps) => {
    const newUpdatedItem = { ...data, id }

    const SalvageItems = window.api.get<ISalvageItem[]>('pathItems') || []

    const newSalvageItems = SalvageItems.map((item) =>
      item.id === id ? newUpdatedItem : item,
    )

    // console.log(newSalvageItems)

    window.api.set('pathItems', newSalvageItems)
    setRerender((prev) => !prev)
    setSalvageState('maximized')
  }

  const deleteItem = () => {
    const SalvageItems = window.api.get<ISalvageItem[]>('pathItems') || []
    const currentItemIndex = SalvageItems.findIndex((item) => item.id === id)

    // Remove item from array based on current item index
    const newSalvageItems = [
      ...SalvageItems.slice(0, currentItemIndex),
      ...SalvageItems.slice(currentItemIndex + 1),
    ]

    window.electron.ipcRenderer.send('unwatch-path', 'pathItems', id)
    window.api.set('pathItems', newSalvageItems)
    setRerender((prev) => !prev)
  }

  const onSubmit = (data: PathSchema) => updateItem(data)

  const stopWatchPath = () => {
    window.electron.ipcRenderer.send('unwatch-path', 'pathItems', id)
    setIsActive(false)
  }

  const watchPath = useCallback(() => {
    window.electron.ipcRenderer.send('unwatch-path', 'pathItems', id)
    window.electron.ipcRenderer.send('watch-path', srcDir)
    window.electron.ipcRenderer.send('copyFiles', { srcDir, destDir })
    setIsActive(true)
  }, [id, srcDir, destDir])

  const setForm = useCallback(() => {
    form.setValue('title', title)
    form.setValue('srcDir', srcDir)
    form.setValue('destDir', destDir)
  }, [title, srcDir, destDir, form])

  useEffect(() => {
    watchPath()
    setForm()
  }, [watchPath, setForm])

  useEffect(() => {
    // console.log({ isActive })
  }, [isActive])

  return (
    <>
      <section
        className={`p-4 pt-0 transition-all duration-300 border border-neutral-900 rounded-lg flex flex-col
        ${
          salvageState === 'minimized'
            ? 'bg-neutral-900 hover:bg-neutral-800'
            : 'hover:bg-neutral-900 bg-transparent'
        }`}
      >
        <section className="flex items-center justify-between mt-1 ">
          {salvageState === 'maximized' && (
            <Icons.chevronUp
              className="h-6 w-6 cursor-pointer hover:opacity-50 transition-all duration-300"
              onClick={() => setSalvageState('minimized')}
            />
          )}

          {salvageState === 'minimized' && (
            <Icons.chevronDown
              className="h-6 w-6 cursor-pointer hover:opacity-50 transition-all duration-300"
              onClick={() => setSalvageState('maximized')}
            />
          )}

          {salvageState === 'editing' && (
            <Icons.chevronLeft
              className="h-6 w-6 cursor-pointer hover:opacity-50 transition-all duration-300"
              onClick={() => {
                setSalvageState('maximized')
                watchPath()
              }}
            />
          )}

          <Icons.x
            className="h-5 w-5 mr-1 cursor-pointer hover:text-red-300 transition-all duration-300"
            onClick={deleteItem}
          />
        </section>

        <section className="flex gap-1 w-full justify-between">
          <div className="flex flex-col justify-between gap-2 max-w-[260px] flex-grow">
            {salvageState !== 'editing' && title && (
              <Ellipis className="text-3xl">{title}</Ellipis>
            )}

            {srcDir && salvageState === 'maximized' && (
              <Ellipis>Source: {srcDir}</Ellipis>
            )}

            {destDir && salvageState === 'maximized' && (
              <Ellipis className="text-green-300">Dest: {destDir}</Ellipis>
            )}
          </div>

          <div className=" flex flex-col gap-2 mt-2 justify-between">
            {salvageState !== 'editing' && (
              <Icons.refreshCw
                className={`h-7 w-7 cursor-pointer 
              ${
                srcDir &&
                destDir &&
                isActive &&
                'animate-loading text-green-300'
              }`}
                onClick={() => {
                  setIsActive((prev) => !prev)
                  if (!isActive) watchPath()
                  if (isActive) stopWatchPath()
                }}
              />
            )}

            {salvageState === 'maximized' && (
              <Icons.pencilLine
                className="h-7 w-7 cursor-pointer text-white hover:text-neutral-500 transition-all duration-300"
                onClick={() => {
                  setSalvageState('editing')
                  stopWatchPath()
                }}
              />
            )}
          </div>
        </section>

        {salvageState === 'editing' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Elden Ring" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="srcDir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="C:/Games/Elden Ring/save files"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destDir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="D:/Games/Save Backup/Elden Ring"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )}
      </section>
    </>
  )
}

const Ellipis = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <p
    title={JSON.stringify(children)}
    className={`cursor-default select-none whitespace-nowrap overflow-hidden overflow-ellipsis w-full ${className}`}
  >
    {children}
  </p>
)

export const SalvageItem = memo(SalvageItemComponent)
