import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

type ShellProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof shellVariants> & { as?: React.ElementType }

const shellVariants = cva('p-4 pt-0', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Shell = ({ variant, className, children, as: Shell = 'div', ...props }: ShellProps) => {
  return (
    <Shell className={cn(shellVariants({ variant }), className)} {...props}>
      {children}
    </Shell>
  )
}

type ShellCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof shellCardVariants> & { as?: React.ElementType }

const shellCardVariants = cva('rounded-md border bg-app-shell', {
  variants: {
    variant: {
      default: '',
    },
    size: {
      default: 'min-h-[calc(100vh-86px)]',
      auto: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const ShellCard = ({ variant, size, className, children, as: Shell = 'section', ...props }: ShellCardProps) => {
  return (
    <Shell className={cn(shellCardVariants({ variant, size }), className)} {...props}>
      {children}
    </Shell>
  )
}

export { Shell, ShellCard, shellCardVariants, shellVariants }
