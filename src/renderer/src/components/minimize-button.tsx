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

const MinimizeButton = () => {
  const minimizeApp = () => window.api.minimizeApp()

  return (
    <span
      className="after:bg-white relative z-50 flex w-[45px] items-center justify-center transition-all duration-300 after:absolute after:left-1/2 after:z-50 after:h-[1px] after:w-3 after:-translate-x-1/2 hover:bg-[rgba(61,61,61,0.3)]"
      onClick={minimizeApp}
    />
  )
}

export { MinimizeButton }
