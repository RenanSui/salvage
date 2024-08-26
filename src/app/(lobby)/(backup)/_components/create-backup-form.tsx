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
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import {
  CreateBackupSchema,
  createBackupSchema,
} from '@/lib/validations/backup'
import { BackupSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDownIcon, ChevronUpIcon, LucideIcon } from 'lucide-react'
import * as React from 'react'
import { Control, useFieldArray, useForm } from 'react-hook-form'

interface DropdownOption {
  icon: LucideIcon
  text: string
  action: () => void
  disabled?: boolean
}

interface BackupInputFieldProps {
  name: keyof CreateBackupSchema
  label: string
  placeholder: string
  control: Control<CreateBackupSchema>
  isDisabled?: boolean
  dropdownOptions?: DropdownOption[]
}

type DropdownActionsType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (name: keyof CreateBackupSchema, value: any) => void,
  field: keyof CreateBackupSchema,
) => DropdownOption[]

function BackupInputField({
  name,
  label,
  placeholder,
  control,
  isDisabled = false,
  dropdownOptions,
}: BackupInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="py-2 pb-4 px-4">
          <FormLabel className="font-heading">{label}</FormLabel>
          <FormControl>
            <div className="flex space-x-1">
              <Input
                className="border-border/50"
                placeholder={placeholder}
                disabled={isDisabled}
                {...field}
                value={
                  Array.isArray(field.value)
                    ? field.value.map((item) => item.exclusion).join(', ')
                    : field.value
                }
              />
              {dropdownOptions && (
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
                    {dropdownOptions.map(
                      ({ icon: Icon, text, action, disabled }, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="space-x-1"
                          onClick={action}
                          disabled={disabled}
                        >
                          <Icon className="size-4" />
                          <span>{text}</span>
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default function CreateBackupForm() {
  const [collapsable, setCollapsable] = React.useState(false)
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
      exclusions: exclusions.map((exclusion) =>
        exclusion.exclusion.replace('//', '\\').replace('/', '\\'),
      ),
    }

    await backupService.create_backup(backup_item)

    queryClient.invalidateQueries({ queryKey: ['backups'] })
    backupService.restart_backups()
    form.reset()
    setCollapsable(false)
  }

  const Icon = collapsable ? ChevronUpIcon : ChevronDownIcon

  const dropdownActions: DropdownActionsType = (setValue, field) => [
    {
      icon: Icons.file,
      text: 'Select a File',
      action: async () => setValue(field, await backupService.select_file()),
      disabled: field === 'destination', // Disable for "destination" field
    },
    {
      icon: Icons.folder,
      text: 'Select a Folder',
      action: async () => setValue(field, await backupService.select_folder()),
      disabled: false,
    },
  ]

  return (
    <div className="space-y-1.5">
      <CardTitle className="font-semibold text-sm">Create</CardTitle>
      <Collapsible open={collapsable} onOpenChange={setCollapsable}>
        <CollapsibleTrigger
          className={cn(
            'text-start bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border w-full p-2 cursor-default flex items-center justify-between transition-colors',
            collapsable ? 'rounded-t' : 'rounded',
          )}
        >
          <div className="p-2">
            <CardTitle>Create a new backup</CardTitle>
            <CardDescription>
              Create a new backup to manage your data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 p-2">
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

              <div className="py-4 px-4">
                <Button type="submit" className="cursor-default">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
