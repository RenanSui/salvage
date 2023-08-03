import { useEffect, useState } from 'react'
import { Icons } from './components/icons'
import { SalvageItem } from './components/salvage-item'
import { randomId } from './lib/utils'
import { ISalvageItem } from './types'

function App(): JSX.Element {
  const [responsePathItems, setResponsePathItems] = useState<ISalvageItem[]>([])
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
    <main className="bg-neutral-950 text-white flex flex-col gap-2">
      <section className="salvageContainer h-[calc(100vh_-_53px)] mb-2 overflow-auto flex flex-col gap-2 mx-2 mt-2 flex-grow">
        <div
          className="bg-transparent hover:bg-neutral-900 border border-neutral-800 flex justify-center items-center group py-2 rounded-md cursor-pointer transition-all duration-300"
          onClick={addPathItem}
        >
          <Icons.plusCircle className="group-hover:text-neutral-100 text-neutral-400 transition-all duration-300" />
        </div>

        {/* <button onClick={() => window.api.observeWatch()}>observe</button> */}

        {responsePathItems?.map((item) => (
          <SalvageItem item={item} key={item.id} setRerender={setRerender} />
        ))}
      </section>
    </main>
  )
}

export default App
