import { cn } from '@/lib/utils'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

export type ButtonCardProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof buttonCardVariants>
type ButtonCardLink = React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonCardVariants>
type ButtonCardIconProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof buttonCardIconVariants>
type ButtonCardActionProps = React.HTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonCardIconVariants>
type BaseProps = React.HTMLAttributes<HTMLElement> & { className?: string; children: React.ReactNode }

const buttonCardVariants = cva(
  'group flex w-full cursor-default items-center gap-4 rounded-sm p-4 text-start transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-app-card hover:bg-app-muted/70 border',
        ghost: 'border border-transparent hover:border hover:border-border hover:bg-app-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const createSubcomponent = (Component: React.ElementType, defaultClass: string) => {
  const Subcomponent: React.FC<BaseProps> = (props) => (
    <Component className={cn(defaultClass, props.className)} {...props}>
      {props.children}
    </Component>
  )

  Subcomponent.displayName = `${Component.toString()}-${Math.random() * 100000} ` // Set the display name

  return Subcomponent
}

function ButtonCard({ variant, className, children, ...props }: ButtonCardProps) {
  return (
    <div className={cn(buttonCardVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

ButtonCard.Link = (({ variant, className, children, href = '/', ...props }: ButtonCardLink) => {
  return (
    <Link href={href} className={cn(buttonCardVariants({ variant }), className)} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </Link>
  )
}) as React.FC<ButtonCardLink>

ButtonCard.Action = (({ variant, className, children, ...props }: ButtonCardActionProps) => {
  return (
    <button
      className={cn(buttonCardIconVariants({ variant }), 'size-auto rounded-sm p-2 px-6 text-sm', className)}
      {...props}
    >
      {children}
    </button>
  )
}) as React.FC<React.HTMLAttributes<HTMLButtonElement>>

const buttonCardIconVariants = cva('flex size-8 items-center justify-center rounded-lg transition-colors', {
  variants: {
    variant: {
      default: 'bg-app-muted hover:!bg-foreground/20 group-hover:bg-foreground/10',
      ghost: 'bg-app-background hover:!bg-foreground/20 group-hover:bg-foreground/10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

ButtonCard.Icon = (({ variant, className, children, ...props }: ButtonCardIconProps) => {
  return (
    <div className={cn(buttonCardIconVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}) as React.FC<ButtonCardIconProps>

ButtonCard.Header = createSubcomponent('div', 'space-y-1')
ButtonCard.Title = createSubcomponent('p', 'text-sm font-medium')
ButtonCard.Description = createSubcomponent('p', 'max-w-[400px] truncate text-xs text-stone-400')
ButtonCard.Content = createSubcomponent('div', 'ml-auto')

export { ButtonCard }
