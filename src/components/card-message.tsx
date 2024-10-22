/* eslint-disable tailwindcss/classnames-order */
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

type CardMessageProps = {
  title: string
  description?: string
  Icon?: React.ElementType // Use ElementType to allow passing any valid JSX component as an icon
}

export function CardMessage({ Icon = ExclamationTriangleIcon, description, title }: CardMessageProps) {
  return (
    <div className="hover:bg-app-card group relative flex cursor-default items-center gap-2 rounded-md border border-transparent px-4 py-3 transition-colors duration-150 ease-in-out hover:border-border">
      <div className="bg-app-background flex size-8 items-center justify-center rounded-lg transition-colors duration-150 ease-in-out hover:!bg-foreground/20 group-hover:bg-foreground/10">
        <Icon className="size-4" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="max-w-[450px] truncate text-xs text-stone-400 lg:max-w-screen-xl">{description}</p>
        )}
      </div>
    </div>
  )
}
