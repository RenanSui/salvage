import Store from 'electron-store'

export const store = new Store({})

export const getStore = (event: Electron.IpcMainEvent, val: string) => {
  event.returnValue = store.get(val)
}

export const setStore = (key: string, val: string) => {
  store.set(key, val)
}
