import { Button } from '../ui/button'
import { Icons } from '../ui/icons'

export const SiteHeader = () => {
  return (
    <header className="relative flex justify-between bg-neutral-800/10">
      {/* <Button size={'icon'} className="hover:text-yellow-500">
        <Icons.cross />
      </Button> */}

      <button className="group relative h-full p-7 transition-all duration-300 hover:text-yellow-500 [&>*]:hover:bg-yellow-500">
        <div className="absolute left-4 top-4 h-[2px] w-7 rotate-0 bg-white transition-all duration-300 group-hover:top-5 group-hover:w-4 group-hover:-rotate-[40deg]" />

        <div className="absolute left-4 top-6 h-[2px] w-5 bg-white transition-all duration-300 group-hover:-left-6" />

        <div className="absolute left-4 top-8 h-[2px] w-3 bg-white transition-all duration-300 group-hover:top-[29px] group-hover:w-4 group-hover:rotate-[40deg]" />
      </button>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 cursor-default">
        Salvage
      </div>

      <div className="flex items-center justify-center">
        <Button size={'icon'} className="hover:text-yellow-500">
          <Icons.minus />
        </Button>
        <Button size={'icon'} className="hover:text-yellow-500">
          <Icons.cross />
        </Button>
      </div>
    </header>
  )
}
