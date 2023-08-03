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
import { toast } from 'sonner'
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

  const onSubmit = (data: PathSchema) => updateItem(data)

  const setForm = useCallback(() => {
    form.setValue('title', title)
    form.setValue('srcDir', srcDir)
    form.setValue('destDir', destDir)
  }, [title, srcDir, destDir, form])

  const watchPath = useCallback(() => {
    window.api.unwatchPath('pathItems', id)
    window.api.watchPath(srcDir)
    window.api.copyFiles({ srcDir, destDir })

    if (title) {
      toast(`Watching ${title}`)
    }

    setIsActive(true)
  }, [id, srcDir, destDir, title])

  const stopWatchPath = () => {
    window.api.unwatchPath('pathItems', id)

    if (title) {
      toast(`Stopped Watching ${title}`)
    }

    setIsActive(false)
  }

  const updateItem = (data: updateItemProps) => {
    const newUpdatedItem = { ...data, id }

    const SalvageItems = window.api.getStore<ISalvageItem[]>('pathItems') || []

    const newSalvageItems = SalvageItems.map((item) =>
      item.id === id ? newUpdatedItem : item,
    )

    if (title) {
      toast(`Updated ${title}`)
    }

    window.api.setStore('pathItems', newSalvageItems)
    setRerender((prev) => !prev)
    setSalvageState('maximized')
    watchPath()
  }

  const deleteItem = () => {
    const SalvageItems = window.api.getStore<ISalvageItem[]>('pathItems') || []
    const currentItemIndex = SalvageItems.findIndex((item) => item.id === id)

    // Remove item from array based on current item index
    const newSalvageItems = [
      ...SalvageItems.slice(0, currentItemIndex),
      ...SalvageItems.slice(currentItemIndex + 1),
    ]

    window.api.unwatchPath('pathItems', id)
    window.api.setStore('pathItems', newSalvageItems)

    if (title) {
      toast(`Deleted ${title}`)
    }

    setRerender((prev) => !prev)
  }

  const getDialogSourcePath = () => {
    const sourcePathFromDialog = window.api.getDialogPath()

    if (sourcePathFromDialog.canceled === false) {
      form.setValue('srcDir', sourcePathFromDialog.filePaths[0])
    }
  }

  const getDialogDestPath = () => {
    const sourcePathFromDialog = window.api.getDialogPath()

    if (sourcePathFromDialog.canceled === false) {
      form.setValue('destDir', sourcePathFromDialog.filePaths[0])
    }
  }

  useEffect(() => {
    watchPath()
    setForm()
  }, [watchPath, setForm])

  return (
    <section
      className={`p-4 pt-0 transition-all duration-300 border rounded-lg flex flex-col
        ${
          salvageState === 'minimized'
            ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-neutral-700'
            : 'bg-transparent hover:bg-neutral-900 border-neutral-800'
        }`}
    >
      <header className="flex items-center justify-between mt-1 ">
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
              setForm()
            }}
          />
        )}

        <Icons.x
          className="h-5 w-5 mr-1 cursor-pointer hover:text-red-300 transition-all duration-300"
          onClick={deleteItem}
        />
      </header>

      <main className="flex gap-1 w-full justify-between">
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
      </main>

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
                      onClick={getDialogSourcePath}
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
                      onClick={getDialogDestPath}
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
