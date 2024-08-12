import { ReactQueryProvider } from './react-query-provider'
import { NextThemesProvider } from './theme-provider'

export const Providers = async ({
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <ReactQueryProvider>
      <NextThemesProvider>{children}</NextThemesProvider>
    </ReactQueryProvider>
  )
}
