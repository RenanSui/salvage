import { ElementType, FC, HTMLAttributes } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const iconShell = tv({
  base: 'group flex justify-center items-center',
  variants: {
    variant: {
      default: 'hover:bg-neutral-800',
      red: 'hover:bg-red-500',
      transparent: 'hover:bg-transparent',
    },
    size: {
      default: 'px-3',
      sm: 'px-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface IconShell
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconShell> {
  as?: ElementType
}

const IconShell: FC<IconShell> = ({
  children,
  className,
  variant,
  size,
  as: Comp = 'section',
  ...props
}) => {
  return (
    <Comp className={iconShell({ variant, size, className })} {...props}>
      {children}
    </Comp>
  )
}

export { IconShell }
