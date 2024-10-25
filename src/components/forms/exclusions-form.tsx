import { Icons } from '@/components/icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { type CreateBackupSchema } from '@/lib/validations/backup'
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form'

export const ExclusionsForm = ({
  form,
  formArray: { append, remove, fields },
}: {
  form: UseFormReturn<CreateBackupSchema>
  formArray: UseFieldArrayReturn<CreateBackupSchema>
}) => {
  return (
    <FormField
      control={form.control}
      name="exclusions"
      render={() => (
        <FormItem className="animate-fade-up px-4 py-2 pb-4">
          <FormLabel className="font-heading">Exclusions</FormLabel>
          <FormControl>
            <div className="space-y-1.5">
              {fields.map((field, index) => (
                <div key={index} className="flex space-x-1">
                  <Input
                    className="border-border/50 dark:bg-neutral-950"
                    placeholder="Add your exclusion here"
                    {...form.register(`exclusions.${index}.exclusion`)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        buttonVariants({
                          size: 'icon',
                          variant: 'outline',
                        }),
                        'cursor-default bg-background',
                      )}
                    >
                      <Icons.dots />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="flex items-center gap-1 focus:bg-destructive focus:text-white"
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
                className="w-full cursor-default dark:bg-neutral-950 hover:dark:bg-neutral-800"
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
  )
}
