import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from './commons/query.provider'
import { RepositoryProvider } from './repository'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <RepositoryProvider>{children}</RepositoryProvider>
      <Toaster />
    </QueryProvider>
  )
}
