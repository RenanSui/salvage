import { FC } from 'react'
import { Icons } from './icons'

type closeButtonProps = React.HTMLAttributes<HTMLSpanElement>

const CloseButton: FC<closeButtonProps> = ({ ...props }) => {
  return (
    <span
      className="group flex justify-center items-center px-3 hover:bg-red-500 h-full"
      {...props}
    >
      <Icons.x className="text-white" />
    </span>
  )
}

export { CloseButton }
