import { ReactQueryProvider } from './react-query-provider'

export const Providers = async ({
  children,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>
}
