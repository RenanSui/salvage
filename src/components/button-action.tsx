'use client'

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
      className={`group flex w-full cursor-default items-center gap-4 rounded-sm border bg-neutral-900 p-4 text-start transition-colors hover:bg-neutral-800 hover:opacity-80 ${className}`}
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
      <div className="ml-auto">
        {CustomButton ? (
          CustomButton
        ) : (
          <button
            className="rounded-sm bg-neutral-800 p-2 px-6 text-sm transition-colors hover:!bg-[rgb(72_72_72)] group-hover:bg-neutral-700"
            onClick={buttonTitleAction}
          >
            {buttonTitle}
          </button>
        )}
      </div>
    </div>
  )
}
