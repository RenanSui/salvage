/* eslint-disable tailwindcss/classnames-order */
'use client'

import { cn } from '@/lib/utils'
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
      className={cn(
        'group flex w-full cursor-default items-center gap-4 rounded-sm border p-4 text-start transition-colors',
        'bg-app-card hover:bg-app-muted/70',
        className,
      )}
    >
      <div className="bg-app-muted flex size-8 items-center justify-center rounded-lg transition-colors hover:!bg-foreground/20 group-hover:bg-foreground/10">
        <Icon className="size-4" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="max-w-[450px] truncate text-xs text-stone-400 lg:max-w-screen-xl">{description}</p>
        )}
      </div>
      <ChevronRightIcon className="ml-auto size-4 text-foreground" />
    </Link>
  )
}
