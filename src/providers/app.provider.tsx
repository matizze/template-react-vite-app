import type { ReactNode } from 'react'
import { QueryProvider } from './query.provider'
import { ServiceProvider } from './service.provider'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ServiceProvider>{children}</ServiceProvider>
    </QueryProvider>
  )
}
