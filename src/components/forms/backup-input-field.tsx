'use client'

import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { type CreateBackupSchema } from '@/lib/validations/backup'
import { ChevronDownIcon, DesktopIcon } from '@radix-ui/react-icons'
import { type LucideIcon } from 'lucide-react'
import * as React from 'react'
import { type Control } from 'react-hook-form'

interface DropdownOption {
  icon: LucideIcon
  text: string
  action: () => Promise<void>
  disabled?: boolean
}

type DropdownActionsType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (name: keyof CreateBackupSchema, value: any) => void,
  field: keyof CreateBackupSchema,
) => DropdownOption[]

export const dropdownActions: DropdownActionsType = (setValue, field) => [
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

type BackupInputFieldProps = React.HTMLAttributes<HTMLInputElement> & {
  name: keyof CreateBackupSchema
  label: string
  placeholder: string
  control: Control<CreateBackupSchema>
  isDisabled?: boolean
  dropdownOptions?: DropdownOption[]
}

export function BackupInputField({
  name,
  label,
  placeholder,
  control,
  isDisabled = false,
  dropdownOptions,
  className,
}: BackupInputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('animate-fade-up p-4', className)}>
          <FormLabel className="font-heading text-base">{label}</FormLabel>
          <FormControl>
            <div className="flex space-x-1">
              <Input
                className="h-11 border-border dark:bg-neutral-950"
                placeholder={placeholder}
                disabled={isDisabled}
                {...field}
                value={Array.isArray(field.value) ? field.value.map((item) => item.exclusion).join(', ') : field.value}
              />
              {dropdownOptions && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'flex h-11 cursor-default gap-2 px-3 dark:bg-neutral-950 hover:dark:bg-neutral-900',
                    )}
                  >
                    <DesktopIcon className="size-4" />
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {dropdownOptions.map(({ icon: Icon, text, action, disabled }, index) => (
                      <DropdownMenuItem key={index} className="space-x-1" onClick={action} disabled={disabled}>
                        <Icon className="size-4" />
                        <span>{text}</span>
                      </DropdownMenuItem>
                    ))}
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
