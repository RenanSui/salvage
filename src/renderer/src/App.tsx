import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { Icons } from './components/icons'
import { Menu } from './components/menu'
import { SalvageItem } from './components/salvage-item'
import { IconShell } from './components/shells/icon-shell'
import { Shell } from './components/shells/shell'
import { TailwindIndicator } from './components/tailwind-indicator'
import TitleBar from './components/title-bar'
import { Pattern } from './components/ui/pattern'
import { Vignette } from './components/ui/vignette'
import { randomId } from './lib/utils'
import { ISalvageItem } from './types'

function App(): JSX.Element {
  const [responsePathItems, setResponsePathItems] = useState<ISalvageItem[]>([])
  const [showMenu, setShowMenu] = useState(false)
  const [rerender, setRerender] = useState(false)

  function addPathItem() {
    const randomID = { id: randomId() }
    const newPaths = [randomID, ...responsePathItems]
    window.api.setStore('pathItems', newPaths)

    const response = window.api.getStore<ISalvageItem[]>('pathItems') || []
    setResponsePathItems(response)

    // toast('Path added!')
  }

  useEffect(() => {
    const response = window.api.getStore<ISalvageItem[]>('pathItems') || []
    setResponsePathItems(response)
  }, [rerender])

  return (
    <>
      <TitleBar {...{ showMenu, setShowMenu }} />

      {showMenu && <Menu />}

      <main className="bg-neutral-950 text-white ">
        <Shell className="overflow-hidden h-[calc(100vh-37px)] flex flex-shell gap-2 mx-2">
          <Shell
            variant={'transparent'}
            size={'sm'}
            center={true}
            as={'button'}
            onClick={addPathItem}
          >
            <IconShell variant="transparent" as={'span'}>
              <Icons.plusCircle className="group-hover:text-neutral-100 text-neutral-400 transition-all duration-300" />
            </IconShell>
          </Shell>

          {/* <button onClick={() => window.api.observeWatch()}>observe</button> */}

          <Shell className="salvageContainer h-[calc(100vh_-_95px)] gap-2 overflow-auto">
            {responsePathItems?.map((item) => (
              <SalvageItem
                item={item}
                key={item.id}
                setRerender={setRerender}
              />
            ))}
          </Shell>
        </Shell>
      </main>

      <Toaster />

      <Pattern />

      <Vignette />

      <TailwindIndicator />
    </>
  )
}

export default App
