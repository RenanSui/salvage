'use client'

import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { ButtonCard } from './ui/button-card'

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
    <ButtonCard className={className}>
      <ButtonCard.Icon>
        <Icon className="size-4" />
      </ButtonCard.Icon>
      <ButtonCard.Header>
        <ButtonCard.Title>{title}</ButtonCard.Title>
        {description && <ButtonCard.Description>{description}</ButtonCard.Description>}
      </ButtonCard.Header>
      <ButtonCard.Content>
        {CustomButton ? CustomButton : <ButtonCard.Action onClick={buttonTitleAction}>{buttonTitle}</ButtonCard.Action>}
      </ButtonCard.Content>
    </ButtonCard>
  )
}
