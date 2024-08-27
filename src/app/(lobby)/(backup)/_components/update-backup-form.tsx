/* eslint-disable camelcase */
import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useToast } from '@/hooks/use-toast'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import {
  CreateBackupSchema,
  createBackupSchema,
} from '@/lib/validations/backup'
import { BackupSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { BackupInputField, dropdownActions } from './backup-input-field'

type UpdateBackupFormProps = React.HTMLAttributes<HTMLDivElement> & {
  backup: BackupSchema
}

export default function UpdateBackupForm({ backup }: UpdateBackupFormProps) {
  const [isOpen, setIsOpen] = React.useState(false)
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
    form.reset({
      name: backup.name,
      source: backup.source,
      destination: backup.destination,
      exclusions: backup.exclusions.map((exclusion) => ({ exclusion })),
    })
  }, [backup, form])

  const onSubmit = async ({ exclusions, ...values }: CreateBackupSchema) => {
    const updatedBackup: BackupSchema = {
      ...backup,
      ...values,
      exclusions: exclusions.map((exclusion) =>
        exclusion.exclusion.replace('//', '\\').replace('/', '\\'),
      ),
    }

    const updates: string[] = []
    if (backup.name !== values.name) {
      await backupService.rename_backup(updatedBackup)
      updates.push('Name')
    }
    if (backup.source !== values.source) {
      await backupService.change_backup_source(updatedBackup)
      updates.push('Source')
    }
    if (backup.destination !== values.destination) {
      await backupService.change_backup_destination(updatedBackup)
      updates.push('Destination')
    }
    if (backup.exclusions.join('') !== updatedBackup.exclusions.join('')) {
      await backupService.modify_backup_exclusions(updatedBackup)
      updates.push('Exclusions')
    }

    queryClient.invalidateQueries({ queryKey: ['backups'] })
    backupService.restart_backups()

    toast({
      title: 'Updated:',
      description: updates.map((update, index) => (
        <p className="flex gap-1 font-semibold" key={index}>
          <Icons.check />
          <span>{update}</span>
        </p>
      )),
    })

    setIsOpen(false)
  }

  React.useEffect(() => {
    const exclusions = backup.exclusions.map((exclusion) => ({ exclusion }))
    form.setValue('name', backup.name)
    form.setValue('source', backup.source)
    form.setValue('destination', backup.destination)
    form.setValue('exclusions', exclusions)
  }, [backup, form])

  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <div className="space-y-1.5">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            'text-start bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border w-full p-2 cursor-default flex items-center justify-between transition-colors',
            isOpen ? 'rounded-t' : 'rounded',
          )}
        >
          <div className="p-2">
            <CardTitle>Update your backup</CardTitle>
            <CardDescription>Update one or all backup info</CardDescription>
          </div>
          <div className="flex items-center gap-2 p-2">
            {backup.name}
            <Icon className="size-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1 bg-white/60 dark:bg-accent/20 rounded-b border-t-0 border">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="divide-y bg-neutral-50 dark:bg-neutral-900/30"
            >
              <BackupInputField
                name="name"
                label="Name"
                placeholder="Type the name of your backup here"
                control={form.control}
              />
              <BackupInputField
                name="source"
                label="Source"
                placeholder="Path to the source file or directory"
                control={form.control}
                dropdownOptions={dropdownActions(form.setValue, 'source')}
              />
              <BackupInputField
                name="destination"
                label="Destination"
                placeholder="Path to the destination directory"
                control={form.control}
                isDisabled
                dropdownOptions={dropdownActions(form.setValue, 'destination')}
              />
              <FormField
                control={form.control}
                name="exclusions"
                render={() => (
                  <FormItem className="py-2 pb-4 px-4">
                    <FormLabel className="font-heading">Exclusions</FormLabel>
                    <FormControl>
                      <div className="space-y-1.5">
                        {fields.map((field, index) => (
                          <div
                            key={`exclusion-${index}`}
                            className="flex space-x-1"
                          >
                            <Input
                              className="border-border/50"
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
                    </FormControl>
                    <Button
                      type="button"
                      className="mt-4 w-full bg-transparent cursor-default"
                      variant="outline"
                      onClick={() => append({ exclusion: '' })}
                    >
                      Add New Exclusion
                    </Button>
                  </FormItem>
                )}
              />
              <div className="p-4">
                <Button type="submit" size="sm">
                  Update Backup
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
