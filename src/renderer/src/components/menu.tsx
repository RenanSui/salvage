import { useEffect, useState } from 'react'

const Menu = () => {
  const [appVersion, setAppVersion] = useState({ version: '0.0.0' })

  useEffect(() => {
    const appVersion = window.api.getAppVersion()
    setAppVersion(appVersion)
  }, [])

  return (
    <section className="text-white absolute top-[35px] left-0 right-0 bottom-0 z-10 h-[100vh-35px] bg-neutral-950 flex justify-center">
      <div>
        <h1 className="text-green-300 mt-4 text-xl select-none">
          v{appVersion.version}
        </h1>
      </div>
    </section>
  )
}

export { Menu }
