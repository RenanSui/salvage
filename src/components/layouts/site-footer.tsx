export const SiteFooter = () => {
  return (
    <footer className="flex flex-1 justify-around">
      <ButtonTest>Info</ButtonTest>
      <ButtonTest>Settings</ButtonTest>
      <ButtonTest>Color</ButtonTest>
      <ButtonTest>Info</ButtonTest>
    </footer>
  )
}

const ButtonTest = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className="group relative w-full py-2 transition-colors duration-300"
    >
      {children}
      <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-white  transition-all duration-300 group-hover:w-8" />
    </button>
  )
}
