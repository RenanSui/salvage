/* eslint-disable camelcase */
'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from './icons'
import { Button, buttonVariants } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'

import { toast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import {
  CreateBackupSchema,
  createBackupSchema,
} from '@/lib/validations/backup'
import { BackupSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

type AddBackupDialogProps = React.HTMLAttributes<HTMLDivElement>

export default function AddBackupDialog({ children }: AddBackupDialogProps) {
  const [open, setOpen] = React.useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CreateBackupSchema>({
    resolver: zodResolver(createBackupSchema),
    defaultValues: {
      name: '',
      source: '',
      destination: '',
      exclusions: [],
    },
  })

  const { fields, append, remove } = useFieldArray<CreateBackupSchema>({
    control: form.control,
    name: 'exclusions',
  })

  async function onSubmit({ exclusions, ...values }: CreateBackupSchema) {
    const backup_item: BackupSchema = {
      ...values,
      id: '',
      is_file: false,
      exclusions: exclusions.map((exclusion) => exclusion.exclusion),
    }

    const isCreated = await backupService.create_backup(backup_item)
    if (isCreated === true) {
      toast({
        title: 'Backup Added:',
        description: `"${backup_item.name}"`,
      })
    }

    queryClient.invalidateQueries({ queryKey: ['backups'] })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        {children || (
          <span
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'w-full cursor-default',
            )}
          >
            New Backup
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl lg:max-w-4xl">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <DialogHeader>
            <DialogTitle>Create a new backup</DialogTitle>
            <DialogDescription>
              Create a new backup to manage your data
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4 max-w-screen-lg w-full"
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
                                const file = await backupService.select_file()
                                form.setValue('source', file)
                              }}
                            >
                              <Icons.file className="size-4" />
                              <span>Select a File</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="space-x-1"
                              onClick={async () => {
                                const folder =
                                  await backupService.select_folder()
                                form.setValue('source', folder)
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
                                const file = await backupService.select_file()
                                form.setValue('destination', file)
                              }}
                            >
                              <Icons.file className="size-4" />
                              <span>Select a File</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                const folder =
                                  await backupService.select_folder()
                                form.setValue('destination', folder)
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
