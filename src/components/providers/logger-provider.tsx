'use client'

import { UnlistenFn, listen } from '@tauri-apps/api/event'
import * as React from 'react'

export type LogMessage = {
  id: string
  message: string
  month: string
  day: string
  timestamp: string
  event_type: string
}

export type Logs = { [key: string]: LogMessage[] }

export type LoggerContext = {
  logs: Logs
  createLog: (log: LogMessage) => void
}

export const LoggerContext = React.createContext<LoggerContext>({
  logs: {},
  createLog: () => {},
})

export const LoggerProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = React.useState<Logs>({})

  const createLog = (log: LogMessage) => {
    const { id } = log
    setLogs((prevLogs) => ({
      ...prevLogs,
      [id]: [{ ...log }, ...(prevLogs[id] || [])],
    }))
  }

  // Logger Service
  React.useEffect(() => {
    const setupListener = async () => {
      const unlisten: UnlistenFn = await listen<LogMessage>(
        'log-message',
        (event) => createLog(event.payload),
      )
      return unlisten
    }

    setupListener().catch((err) =>
      console.error('Error setting up listener:', err),
    )

    return () => {
      setupListener()
        .then((unlistenFn) => unlistenFn())
        .catch((err) => console.error('Error during cleanup:', err))
    }
  }, [])

  return (
    <LoggerContext.Provider value={{ logs, createLog }}>
      {children}
    </LoggerContext.Provider>
  )
}
