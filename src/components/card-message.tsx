import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { ButtonCard, type ButtonCardProps } from './ui/button-card'

type CardMessageProps = {
  title: string
  description?: string
  Icon?: React.ElementType // Use ElementType to allow passing any valid JSX component as an icon
  variant?: ButtonCardProps['variant']
}

export function CardMessage({
  Icon = ExclamationTriangleIcon,
  variant = 'ghost',
  description,
  title,
}: CardMessageProps) {
  return (
    <ButtonCard variant={variant}>
      <ButtonCard.Icon variant={variant}>
        <Icon className="size-4" />
      </ButtonCard.Icon>
      <ButtonCard.Header>
        <ButtonCard.Title>{title}</ButtonCard.Title>
        {description && <ButtonCard.Description>{description}</ButtonCard.Description>}
      </ButtonCard.Header>
    </ButtonCard>
  )
}
