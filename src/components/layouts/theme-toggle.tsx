'use client'

import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/use-mounted'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { LoaderCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()
  const mounted = !useMounted()

  React.useEffect(() => {
    setTimeout(() => theme)
  }, [theme])

  const handleThemeToggle = React.useCallback(() => {
    switch (true) {
      case mounted:
        null
        break
      case theme === 'dark':
        setTheme('light')
        break
      case theme === 'light':
        setTheme('dark')
        break
      default:
        console.warn(`Unknown theme: ${theme}`)
    }
  }, [mounted, setTheme, theme])

  const renderIcon = React.useMemo(() => {
    switch (true) {
      case mounted:
        return <LoaderCircleIcon className="size-4 animate-spin" />
      case theme === 'dark':
        return <SunIcon className="size-4" />
      case theme === 'light':
        return <MoonIcon className="size-4" />
      default:
        return null
    }
  }, [mounted, theme])

  return (
    <Button variant="ghost" size="sm" className="h-6 cursor-default rounded-sm px-2" onClick={handleThemeToggle}>
      {renderIcon}
      <span className="sr-only">Theme</span>
    </Button>
  )
}
