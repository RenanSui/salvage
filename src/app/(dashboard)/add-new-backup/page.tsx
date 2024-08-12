/* eslint-disable camelcase */
'use client'

import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { tauriInvoke } from '@/lib/tauri'
import { cn } from '@/lib/utils'
import {
  CreateBackupSchema,
  createBackupSchema,
} from '@/lib/validations/backup'
import { BackupSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useFieldArray, useForm } from 'react-hook-form'

export default function Page() {
  const navigation = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<CreateBackupSchema>({
    resolver: zodResolver(createBackupSchema),
    defaultValues: {
      name: 'Teste',
      source: 'C:\\Users\\renansui\\Desktop\\salvage\\out\\123.txt',
      destination: 'C:\\Users\renansui\\Desktop\\salvage\\out',
      exclusions: [{ exclusion: 'teste' }, { exclusion: 'teste2' }],
    },
  })

  const { fields, append, remove } = useFieldArray<CreateBackupSchema>({
    control: form.control,
    name: 'exclusions',
  })

  async function onSubmit({ exclusions, ...values }: CreateBackupSchema) {
    const salvage_item: BackupSchema = {
      ...values,
      id: '',
      is_file: false,
      exclusions: exclusions.map((exclusion) => exclusion.exclusion),
    }

    await tauriInvoke<string>('add_backup', { salvage_item })

    queryClient.invalidateQueries({ queryKey: [`salvage-data`] })

    navigation.push('/dashboard')
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-28px)] p-4 bg-custom-gray-100 dark:bg-transparent">
      <Card className="dark:bg-custom-dark-400 w-full max-w-screen-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-heading text-2xl">
              Create a new backup
            </CardTitle>
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: 'icon', variant: 'ghost' }),
                'cursor-default',
              )}
            >
              <Icons.cross />
            </Link>
          </div>
          <CardDescription>
            Create a new backup to manage your files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-heading">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type the name of your backup here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-heading">Source</FormLabel>
                    <FormControl>
                      <div className="flex space-x-1">
                        <Input
                          placeholder="Path to the source file or directory"
                          {...field}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(
                              buttonVariants({ variant: 'outline' }),
                              'px-2 bg-transparent cursor-default',
                            )}
                          >
                            <Icons.computerUpload />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="space-x-1"
                              onClick={async () => {
                                const file =
                                  await tauriInvoke<string>('get_file')
                                form.setValue('source', file || field.value)
                              }}
                            >
                              <Icons.file className="size-4" />
                              <span>Select a File</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="space-x-1"
                              onClick={async () => {
                                const file =
                                  await tauriInvoke<string>('get_folder')
                                form.setValue('source', file || field.value)
                              }}
                            >
                              <Icons.folder className="size-4" />
                              <span>Select a Folder</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-heading">Destination</FormLabel>
                    <FormControl>
                      <div className="flex space-x-1">
                        <Input
                          disabled
                          placeholder="Path to the destination directory"
                          {...field}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={cn(
                              buttonVariants({ variant: 'outline' }),
                              'px-2 bg-transparent cursor-default',
                            )}
                          >
                            <Icons.computerUpload />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="space-x-1"
                              disabled
                              onClick={async () => {
                                const file =
                                  await tauriInvoke<string>('get_file')
                                form.setValue(
                                  'destination',
                                  file || field.value,
                                )
                              }}
                            >
                              <Icons.file className="size-4" />
                              <span>Select a File</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="space-x-1"
                              onClick={async () => {
                                const file =
                                  await tauriInvoke<string>('get_folder')
                                form.setValue(
                                  'destination',
                                  file || field.value,
                                )
                              }}
                            >
                              <Icons.folder className="size-4" />
                              <span>Select a Folder</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exclusions"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-heading">Exclusions</FormLabel>
                    <FormControl>
                      <div className="space-y-1">
                        <div className="space-y-1">
                          {fields.map((field, index) => (
                            <div
                              key={`exclusion-${index}`}
                              className="flex space-x-1"
                            >
                              <Input
                                key={field.id}
                                placeholder="Add your exclusion here"
                                {...form.register(
                                  `exclusions.${index}.exclusion`,
                                )}
                              />
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  className={cn(
                                    buttonVariants({
                                      size: 'icon',
                                      variant: 'outline',
                                    }),
                                    'cursor-default bg-transparent',
                                  )}
                                >
                                  <Icons.dots />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    className="focus:bg-destructive focus:text-white flex items-center gap-1"
                                    onClick={() => remove(index)}
                                  >
                                    <Icons.delete className="size-4" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent cursor-default"
                          onClick={() => append({ exclusion: '' })}
                        >
                          Add new exclusion
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="cursor-default">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
