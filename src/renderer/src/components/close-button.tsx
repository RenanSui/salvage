'use client'
// import { IpcRenderer } from 'electron'

// declare global {
//   interface Window {
//     require: (module: 'electron') => {
//       ipcRenderer: IpcRenderer
//     }
//   }
// }

// const { ipcRenderer } = window?.require('electron')

const CloseButton = () => {
  const closeApp = () => window.api.closeApp()

  return (
    <span
      className="before:bg-white after:bg-white relative z-30 flex w-[45px] items-center justify-center transition-all duration-300 before:absolute before:left-1/2 before:h-[1px] before:w-[14px] before:-translate-x-1/2 before:rotate-45 before:rounded-full after:absolute after:left-1/2 after:h-[1px] after:w-[14px] after:-translate-x-1/2 after:-rotate-45 after:rounded-full hover:bg-red-600"
      onClick={closeApp}
    />
  )
}

export { CloseButton }
