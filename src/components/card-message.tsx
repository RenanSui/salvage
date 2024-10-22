import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

type CardMessageProps = {
  title: string
  description?: string
  Icon?: React.ElementType // Use ElementType to allow passing any valid JSX component as an icon
}

export function CardMessage({ Icon = ExclamationTriangleIcon, description, title }: CardMessageProps) {
  return (
    <div className="group relative flex cursor-default items-center gap-2 rounded-md border border-transparent px-4 py-3 transition-colors duration-150 ease-in-out hover:border-neutral-800 hover:bg-neutral-900">
      <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-900 transition-colors duration-150 ease-in-out group-hover:bg-neutral-800">
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
