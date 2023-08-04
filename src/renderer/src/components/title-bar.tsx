import { Dispatch, useState } from 'react'
import { Icons } from './icons'
import { IconShell } from './shells/icon-shell'

const TitleBar = ({
  showMenu,
  setShowMenu,
}: {
  showMenu: boolean
  setShowMenu: Dispatch<React.SetStateAction<boolean>>
}) => {
  const [showDownload, setShowDownload] = useState(false)

  window.electron.ipcRenderer.on('update-downloaded', () => {
    window.electron.ipcRenderer.removeAllListeners('update-downloaded')
    console.log('Update download received')
    setShowDownload(true)
  })

  const installUpdate = () => window.api.installUpdate()

  const closeApp = () => window.api.closeApp()
  const minimizeApp = () => window.api.minimizeApp()

  return (
    <header className="relative z-20 flex h-[35px] w-full cursor-default items-center justify-center bg-black">
      <div className="h-full flex">
        <IconShell
          variant="transparent"
          size="sm"
          as={'button'}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {showMenu ? (
            <Icons.chevronLeft className="text-white group-hover:text-green-300 stroke-[1.5]" />
          ) : (
            <Icons.alignLeft className="text-white group-hover:text-green-300 stroke-2" />
          )}
        </IconShell>

        {showDownload && (
          <IconShell
            variant="transparent"
            size="sm"
            as={'button'}
            onClick={installUpdate}
            title="Install Update?"
          >
            <Icons.hardDriveDownload className="text-green-300 animate-pulse mb-1 group-hover:text-white" />
          </IconShell>
        )}
      </div>

      <div className="draggable h-full w-full bg-transparent" />

      <div className="h-full flex">
        <IconShell as={'span'} onClick={minimizeApp}>
          <Icons.minus className="text-white stroke-[2]" />
        </IconShell>

        <IconShell variant="red" as={'span'} onClick={closeApp}>
          <Icons.x className="text-white stroke-[1.5]" />
        </IconShell>
      </div>
    </header>
  )
}

export default TitleBar
