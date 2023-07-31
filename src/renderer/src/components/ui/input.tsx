import { cn } from '@renderer/lib/utils'
import React from 'react'
import { Button } from './button'

// import { cn } from '../../lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onClick, ...props }, ref) => {
    return (
      <div className="flex justify-center gap-2 items-center">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-neutral-800 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {onClick && (
          <Button
            size={'sm'}
            variant={'secondary'}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
            type="button"
          >
            Browse
          </Button>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
