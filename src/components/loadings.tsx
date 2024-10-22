import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

const loadingsVariants = cva('transition-all hover:opacity-70', {
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
        className={cn('relative mb-1 flex w-full items-center justify-center', loadingsVariants({ size }))}
        {...props}
      >
        <Skeleton
          className={cn(
            'absolute left-0 top-0 w-full rounded-sm border-b border-foreground/10 bg-gradient-to-r from-neutral-600 from-20% to-neutral-800',
            loadingsVariants({ size }),
            className,
          )}
          style={{ animationDuration: `${1000 * index}ms`, animationDelay: `${index * 1000}ms` }}
        />
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground opacity-20" />
      </div>
    ))
  }

  return Array.from({ length }).map((_, index) => (
    <Skeleton
      key={index}
      className={cn(
        'mb-1 w-full bg-gradient-to-r from-neutral-600 from-20% to-neutral-800',
        loadingsVariants({ size }),
        className,
      )}
      style={{ animationDuration: `${1000 * index}ms`, animationDelay: `${index * 100}ms` }}
    />
  ))
}
