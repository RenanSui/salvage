'use client'

import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React from 'react'
import { ButtonCard } from './ui/button-card'

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
    <ButtonCard.Link href={href} className={className}>
      <ButtonCard.Icon>
        <Icon className="size-4" />
      </ButtonCard.Icon>
      <ButtonCard.Header>
        <ButtonCard.Title>{title}</ButtonCard.Title>
        {description && <ButtonCard.Description>{description}</ButtonCard.Description>}
      </ButtonCard.Header>
    </ButtonCard.Link>
  )
}
