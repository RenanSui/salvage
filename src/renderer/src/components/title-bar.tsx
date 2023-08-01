import { toast } from 'sonner'
import { CloseButton } from './close-button'
import { Icons } from './icons'
import { MinimizeButton } from './minimize-button'
import { Button } from './ui/button'

const TitleBar = () => {
  const showWarning = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation()
    toast(
      <div>
        <h1 className="text-2xl mb-2">New version is available.</h1>
        <Button variant={'secondary'} onClick={updateApp}>
          Update
        </Button>
      </div>,
    )
  }

  const updateApp = () => {
    console.log('Updating!')
    console.log('Updated!')
  }

  return (
    <header className="relative z-20 flex h-[35px] w-full cursor-default items-center justify-center bg-black">
      <div className="flex mx-3 gap-2">
        <Icons.alignJustify className="cursor-pointer text-neutral-400 hover:text-green-300 transition-all duration-300" />
        <Icons.alertCircle
          className="cursor-pointer animate-pulse text-red-400 hover:text-neutral-400 transition-all duration-1000"
          onClick={showWarning}
        />
      </div>

      <div className="draggable h-full w-full"></div>

      <div className="z-50 flex h-[35px]">
        <MinimizeButton />
        <CloseButton />
      </div>
    </header>
  )
}

export default TitleBar
