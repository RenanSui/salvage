import { CloseButton } from '../close-button'
import { MinimizeButton } from '../minimize-button'

const TitleBar = () => {
  return (
    <header className="relative z-20 flex h-[35px] w-full cursor-default items-center justify-center bg-black">
      {/* <div className="ml-2 relative select-none flex cursor-pointer items-center justify-center gap-2 opacity-70 transition-all duration-300 hover:opacity-100">
        <div className="h-4 w-4 bg-[url(./tray.png)] bg-cover" />
        <h1 className="text-white font-sans text-base font-thin">Salvage</h1>
      </div> */}

      <div className="draggable h-full w-full"></div>

      <div className="right-0 top-0 z-50 flex h-[35px]">
        <MinimizeButton />
        <CloseButton />
      </div>
    </header>
  )
}

export default TitleBar
