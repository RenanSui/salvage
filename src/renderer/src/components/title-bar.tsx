import { toast } from 'sonner'
import { IconShell } from './icon-shell'
import { Icons } from './icons'
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
      <div className="h-full flex">
        {/* <Icons.alignJustify className="cursor-pointer text-neutral-400 hover:text-green-300 transition-all duration-300" />
        <Icons.alertCircle
          className="cursor-pointer animate-pulse text-red-400 hover:text-neutral-400 transition-all duration-1000"
          onClick={showWarning}
        /> */}
        <IconShell variant="transparent" as={'button'}>
          <Icons.alignJustify className="text-white group-hover:text-green-300" />
        </IconShell>

        <IconShell variant="transparent" as={'button'}>
          <Icons.hardDriveDownload
            className="text-green-300 animate-pulse mb-1 group-hover:text-white"
            onClick={showWarning}
          />
        </IconShell>
      </div>

      <div className="draggable h-full w-full bg-white" />

      <div className="h-full flex">
        <IconShell as={'span'}>
          <Icons.minus className="text-white" />
        </IconShell>

        <IconShell variant="red" as={'span'}>
          <Icons.x className="text-white" />
        </IconShell>
      </div>
    </header>
  )
}

export default TitleBar
