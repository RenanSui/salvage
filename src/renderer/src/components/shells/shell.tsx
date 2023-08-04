import { ElementType, FC, HTMLAttributes } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const shell = tv({
  base: 'flex flex-col rounded-md transition-all duration-300',
  variants: {
    variant: {
      default: '',
      transparent:
        'bg-transparent hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700',
    },
    size: {
      default: 'p-0',
      sm: 'p-2',
      lg: 'p-4 pt-0',
    },
    center: {
      true: 'justify-center items-center',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface IconShell
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shell> {
  as?: ElementType
}

const Shell: FC<IconShell> = ({
  children,
  className,
  variant,
  size,
  center,
  as: Comp = 'section',
  ...props
}) => {
  return (
    <Comp className={shell({ variant, size, center, className })} {...props}>
      {children}
    </Comp>
  )
}

export { Shell }
