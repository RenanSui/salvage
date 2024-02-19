'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export const MenuIcon = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)

  useEffect(() => {}, [])

  const toggleMenu = () => {
    const menuActive = document.body.getAttribute('data-menu-active')

    if (menuActive) {
      const toggleMenuActive = menuActive === 'true' ? 'false' : 'true'

      document.body.setAttribute('data-menu-active', toggleMenuActive)

      setIsMenuActive(menuActive !== 'true')
    }
  }

  return (
    <button
      className="group relative h-full cursor-default p-7 transition-all duration-300 hover:text-yellow-500 [&>*]:hover:bg-yellow-500"
      onClick={toggleMenu}
    >
      <div
        className={cn(
          'absolute left-4 top-4 h-[2px] w-7 rotate-0 bg-white transition-all duration-300',
          isMenuActive ? 'top-5 w-4 -rotate-[40deg]' : '',
        )}
      />

      <div
        className={cn(
          'absolute left-4 top-6 h-[2px] w-5 bg-white transition-all duration-300',
          isMenuActive ? '-left-6' : '',
        )}
      />

      <div
        className={cn(
          'absolute left-4 top-8 h-[2px] w-3 bg-white transition-all duration-300',
          isMenuActive ? 'top-[29px] w-4 rotate-[40deg]' : '',
        )}
      />
    </button>
  )
}
