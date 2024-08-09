import { atom, useAtom } from 'jotai'

export type ITabs = 'Backup' | 'Statistics' | 'Logs'

export const tabsAtom = atom<ITabs>('Backup')

export function useTabsAtom() {
  const [tabs, setTabs] = useAtom(tabsAtom)
  return { tabs, setTabs }
}
