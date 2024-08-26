import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const sidebarAtom = atomWithStorage<boolean>('sidebar', true)

export function useSidebar() {
  const [sidebar, setSidebar] = useAtom(sidebarAtom)
  return { sidebar, setSidebar }
}
