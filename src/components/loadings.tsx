import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

const loadingsVariants = cva('mb-1 w-full rounded-sm transition-all hover:opacity-70', {
  variants: {
    size: {
      default: 'h-[66px]',
      sm: 'h-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type LoadingsProps = React.ButtonHTMLAttributes<HTMLDivElement> &
  VariantProps<typeof loadingsVariants> & { length: number; withIcon?: boolean }

export function Loadings({ length = 3, withIcon = false, size, className, ...props }: LoadingsProps) {
  if (withIcon) {
    return Array.from({ length }).map((_, index) => (
      <div
        key={index}
        className={cn('relative flex w-full items-center justify-center', loadingsVariants({ size }))}
        {...props}
      >
        <Skeleton
          className={cn('absolute left-0 top-0', loadingsVariants({ size }), className)}
          style={{ animationDuration: `${1000 * index}ms`, animationDelay: `${index * 50}ms` }}
        />
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground opacity-20" />
      </div>
    ))
  }

  return Array.from({ length }).map((_, index) => (
    <Skeleton
      key={index}
      className={cn('', loadingsVariants({ size }), className)}
      style={{ animationDuration: `${1000 * index}ms`, animationDelay: `${index * 50}ms` }}
    />
  ))
}
