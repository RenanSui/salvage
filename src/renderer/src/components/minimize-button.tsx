import { FC } from 'react'
import { Icons } from './icons'

type minimizeButtonProps = React.HTMLAttributes<HTMLSpanElement>

const MinimizeButton: FC<minimizeButtonProps> = ({ ...props }) => {
  return (
    <span
      className="group flex justify-center items-center px-3 hover:bg-neutral-800 h-full"
      {...props}
    >
      <Icons.minus className="text-white" />
    </span>
  )
}

export { MinimizeButton }
