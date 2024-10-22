'use client'

import { ChevronRightIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'

type ButtonLinkProps = {
  href: string
  title: string
  description?: string
  className?: string
  Icon?: React.ElementType
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  href,
  title,
  description,
  className,
  Icon = ExclamationTriangleIcon,
}) => {
  return (
    <Link
      href={href}
      className={`group flex w-full cursor-default items-center gap-4 rounded-sm border p-4 text-start transition-colors dark:bg-neutral-900 dark:hover:bg-neutral-800 ${className}`}
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-800 transition-colors hover:!bg-[rgb(72_72_72)] group-hover:bg-neutral-700">
        <Icon className="size-4" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="max-w-[450px] truncate text-xs text-stone-400 lg:max-w-screen-xl">{description}</p>
        )}
      </div>
      <ChevronRightIcon className="ml-auto size-4 text-neutral-100" />
    </Link>
  )
}
