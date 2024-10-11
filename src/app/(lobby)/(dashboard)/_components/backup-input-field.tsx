/* eslint-disable camelcase */
import { Icons } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { backupService } from '@/lib/backup/actions'
import { cn } from '@/lib/utils'
import { CreateBackupSchema } from '@/lib/validations/backup'
import { LucideIcon } from 'lucide-react'
import { Control } from 'react-hook-form'

interface DropdownOption {
  icon: LucideIcon
  text: string
  action: () => void
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

interface BackupInputFieldProps {
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
