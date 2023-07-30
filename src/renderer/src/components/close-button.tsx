const CloseButton = () => {
  const closeApp = () => window.api.closeApp()

  return (
    <span
      className="group relative hover:bg-neutral-800 z-30 flex w-[45px] items-center justify-center transition-all duration-300"
      onClick={closeApp}
    >
      <span className="inline-block bg-white absolute left-1/2 h-[1px] w-5 -translate-x-1/2 rotate-45 rounded-full group-hover:bg-red-300"></span>
      <span className="inline-block bg-white absolute left-1/2 h-[1px] w-5 -translate-x-1/2 -rotate-45 rounded-full group-hover:bg-red-300"></span>
    </span>
  )
}

export { CloseButton }
