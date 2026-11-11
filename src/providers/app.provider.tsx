import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from './commons/query.provider'
import { RepositoryProvider } from './repository'
import { ThemeProvider } from './theme'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RepositoryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </RepositoryProvider>
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  )
}
