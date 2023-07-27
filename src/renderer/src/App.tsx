import { SalvageItem } from './components/salvage-item'

function App(): JSX.Element {
  return (
    <main className="bg-black text-white flex flex-col gap-2">
      <div className="p-12 ml-2 rounded-md bg-neutral-900"></div>
      <section className="h-[calc(100vh-45px)] overflow-auto flex flex-col gap-2 mx-2 main flex-grow">
        <SalvageItem />
      </section>
    </main>
  )
}

export default App
