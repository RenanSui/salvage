const item = {
  title: 'Kingdom Hearts III',
  srcDir: 'C:\\Users\\renan\\Documents\\KINGDOM HEARTS III',
  destDir:
    'D:\\Games\\0.GAME SAVE FILES BACKUP\\Kingdom Hearts\\KINGDOM HEARTS III',
  active: true,
}

const SalvageItem = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const shareData = () => {
    console.log('hello from onclick button')
    // window.api.sendMsg('hello from renderer process')
    window.api.copyFiles({ srcDir: item.srcDir, destDir: item.destDir })
    // ipcRenderer.send('sayhello', 'hello from ipcrenderer')
    // ipcRenderer.send('msg', [item.srcDir, item.destDir])
  }

  return (
    <div className="p-4 bg-neutral-800 rounded-md flex gap-4">
      <div className="p-16 bg-neutral-700 px-20 relative z-[60]" />
      <div className="relative z-[60] flex flex-col gap-2">
        <h1 className="rounded-sm select-none text-2xl">Kingdom Hearts III</h1>
        <p className="rounded-sm select-none text-base">Source:</p>
        <p className="rounded-sm select-none text-sm text-red-700">
          Destination:
        </p>
      </div>
      <div className=" px-2 ml-auto">
        <button
          className="px-6 bg-neutral-700 rounded-md py-1"
          onClick={shareData}
        >
          Copy
        </button>
      </div>
    </div>
  )
}

export { SalvageItem }
