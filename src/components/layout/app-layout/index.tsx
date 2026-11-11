import type { ReactNode } from 'react'
import { ScrollToTop } from '@/components/shared/scroll-to-top'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from './header'
import { AppSidebar } from './sidebar'

/**
 * Shell das áreas autenticadas: sidebar recolhível + header + conteúdo centralizado.
 * Montado uma única vez em `App.tsx` em volta das rotas protegidas; as views
 * renderizam só o conteúdo da página.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="mx-auto w-full max-w-(--breakpoint-2xl) p-4 md:p-6">{children}</div>
      </SidebarInset>
      <ScrollToTop />
    </SidebarProvider>
  )
}
