import { useState } from 'react'
import { Icons } from './icons'
import { IconShell } from './shells/icon-shell'

const TitleBar = () => {
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
        <IconShell variant="transparent" as={'button'}>
          <Icons.alignLeft className="text-white group-hover:text-green-300" />
        </IconShell>

        {showDownload ? (
          <IconShell
            variant="transparent"
            as={'button'}
            onClick={installUpdate}
            title="Install Update?"
          >
            <Icons.hardDriveDownload className="text-green-300 animate-pulse mb-1 group-hover:text-white" />
          </IconShell>
        ) : null}
      </div>

      <div className="draggable h-full w-full bg-transparent" />

      <div className="h-full flex">
        <IconShell as={'span'} onClick={minimizeApp}>
          <Icons.minus className="text-white" />
        </IconShell>

        <IconShell variant="red" as={'span'} onClick={closeApp}>
          <Icons.x className="text-white" />
        </IconShell>
      </div>
    </header>
  )
}

export default TitleBar
