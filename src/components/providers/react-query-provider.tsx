'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export const ReactQueryProvider = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
