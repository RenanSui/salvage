import { Icons } from '../icons'

export default function TitleBar() {
  return (
    <div className="bg-custom-color-100 dark:bg-custom-color-200 shadow-md flex items-center justify-between">
      <button className="px-2 group">
        <Icons.logo
          className="transition-all"
          middleStroke="dark:group-hover:stroke-primary-foreground group-hover:stroke-primary"
          sideStrokes="dark:group-hover:stroke-primary-foreground group-hover:stroke-primary"
        />
      </button>
      <div className="flex items-center">
        <button className="w-11 h-7 hover:bg-[#DEDEDE] dark:hover:bg-[#505154] flex items-center justify-center transition-all">
          <Icons.minus />
        </button>
        <button className="w-11 h-7 hover:bg-red-500 flex items-center justify-center group transition-all">
          <Icons.cross className="group-hover:stroke-white" />
        </button>
      </div>
    </div>
  )
}
