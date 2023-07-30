import { CloseButton } from '../close-button'
import { MinimizeButton } from '../minimize-button'

const TitleBar = () => {
  return (
    <header className="relative z-20 flex h-[35px] w-full cursor-default items-center justify-center bg-black">
      <div className="draggable h-full w-full"></div>

      <div className="right-0 top-0 z-50 flex h-[35px]">
        <MinimizeButton />
        <CloseButton />
      </div>
    </header>
  )
}

export default TitleBar
