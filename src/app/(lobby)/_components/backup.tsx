/* eslint-disable camelcase */
import { Icons } from '@/components/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { useBackupSelectedAtom } from '@/hooks/use-backup-selected'

import { useToast } from '@/hooks/use-toast'
import { tauriInvoke } from '@/lib/tauri'
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

type BackupProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function Backup({ backup }: BackupProps) {
  const { setBackupSelected } = useBackupSelectedAtom()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const form = useForm<CreateBackupSchema>({
    resolver: zodResolver(createBackupSchema),
    defaultValues: {
      name: backup.name,
      source: backup.source,
      destination: backup.destination,
      exclusions: backup.exclusions.map((exclusion) => ({ exclusion })),
    },
  })

  const { fields, append, remove } = useFieldArray<CreateBackupSchema>({
    control: form.control,
    name: 'exclusions',
  })

  React.useEffect(() => {
    const exclusions = backup.exclusions.map((exclusion) => ({ exclusion }))
    form.setValue('name', backup.name)
    form.setValue('source', backup.source)
    form.setValue('destination', backup.destination)
    form.setValue('exclusions', exclusions)
  }, [backup, form])

  async function onSubmit({ exclusions, ...values }: CreateBackupSchema) {
    const backup_item: BackupSchema = { ...backup, ...values }
    backup_item.exclusions = exclusions.map((exclusion) => exclusion.exclusion)
    const updates: string[] = []

    if (backup.name !== values.name) {
      await tauriInvoke('update_backup_name', { ...backup_item })
      updates.push('Name')
    }

    if (backup.source !== values.source) {
      await tauriInvoke('update_backup_source', { ...backup_item })
      updates.push('Source')
    }

    if (backup.destination !== values.destination) {
      await tauriInvoke('update_backup_destination', { ...backup_item })
      updates.push('Destination')
    }

    if (backup.exclusions.join('') !== backup_item.exclusions.join('')) {
      await tauriInvoke('update_backup_exclusions', { ...backup_item })
      updates.push('Exclusions')
    }

    queryClient.invalidateQueries({ queryKey: [`backups`] })

    toast({
      title: 'Updated:',
      description: updates.map((update, index) => (
        <p className="flex gap-1 font-semibold" key={index}>
          <Icons.check />
          <span>{update}</span>
        </p>
      )),
    })
  }

  return (
    <div className="space-y-4">
      <Card className="dark:bg-accent/20 p-2">
        <CardHeader className="space-y-0 p-2">
          <CardTitle className="font-semibold text-lg">
            Update your backup
          </CardTitle>
          <CardDescription>Update one or all backup info</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
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
                          className="w-full cursor-default"
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
                Update
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="dark:bg-accent/20 p-2">
        <CardHeader className="space-y-0 p-2">
          <CardTitle className="font-semibold text-lg">
            Delete your backup
          </CardTitle>
          <CardDescription>Permanently delete your backup.</CardDescription>
        </CardHeader>
        <CardContent className="px-2 py-2">
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'cursor-default',
              )}
            >
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-default">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className={cn(
                    buttonVariants({ variant: 'destructive' }),
                    'cursor-default',
                  )}
                  onClick={async () => {
                    setBackupSelected(null)
                    await tauriInvoke('remove_backup', { ...backup })
                    queryClient.invalidateQueries({ queryKey: [`backups`] })
                    toast({
                      title: 'Backup Deleted:',
                      description: `"${backup.name}"`,
                    })
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
