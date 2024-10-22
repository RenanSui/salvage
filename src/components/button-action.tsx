'use client'

import { cn } from '@/lib/utils'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import * as React from 'react'

type BaseProps = {
  title: string
  description?: string
  className?: string
  Icon?: React.ElementType
}

type ButtonWithTitle = {
  buttonTitle: string
  buttonTitleAction: () => void
  CustomButton?: never // Ensure CustomButton is not allowed when buttonTitle is provided
}

type ButtonWithCustomComponent = {
  CustomButton: React.ReactNode // Ensure CustomButton is required in this case
  buttonTitle?: never // Ensure buttonTitle is not allowed when CustomButton is provided
  buttonTitleAction?: never // Ensure buttonTitleAction is not allowed when CustomButton is provided
}

type ButtonActionProps = BaseProps & (ButtonWithTitle | ButtonWithCustomComponent)

export const ButtonAction: React.FC<ButtonActionProps> = ({
  title,
  description,
  className,
  buttonTitle,
  buttonTitleAction,
  Icon = ExclamationTriangleIcon,
  CustomButton, // Optional custom button prop
}) => {
  return (
    <div
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
      <div className="ml-auto">
        {CustomButton ? (
          CustomButton
        ) : (
          <button
            className="bg-app-muted rounded-sm p-2 px-6 text-sm transition-colors hover:!bg-foreground/20 group-hover:bg-foreground/10"
            onClick={buttonTitleAction}
          >
            {buttonTitle}
          </button>
        )}
      </div>
    </div>
  )
}
