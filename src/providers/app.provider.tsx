import type { ReactNode } from 'react'
import { QueryProvider } from './commons/query.provider'
import { RepositoryProvider } from './repository'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <RepositoryProvider>{children}</RepositoryProvider>
    </QueryProvider>
  )
}
