const MinimizeButton = () => {
  const minimizeApp = () => window.api.minimizeApp()

  return (
    <span
      className="after:bg-white relative z-50 flex w-[45px] items-center justify-center transition-all duration-300 after:absolute after:left-1/2 after:z-50 after:h-[1px] after:w-4 after:-translate-x-1/2 hover:bg-neutral-800"
      onClick={minimizeApp}
    />
  )
}

export { MinimizeButton }
