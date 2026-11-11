import type { ReactNode } from 'react'
import { GridShape } from '@/components/shared/grid-shape'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Logo } from './logo'

/** Layout das telas de autenticação: formulário à esquerda, painel da marca à direita. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex min-h-dvh w-full flex-col justify-center sm:p-0 lg:flex-row">
        <main className="flex w-full flex-1 flex-col lg:w-1/2">{children}</main>

        <aside className="bg-brand-950 relative hidden min-h-dvh w-full items-center justify-center lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="z-1 flex items-center justify-center">
            <GridShape />
            <div className="flex max-w-xs flex-col items-center gap-4">
              <Logo size="lg" inverted />
              <p className="text-center text-gray-400 dark:text-white/60">
                Your workspace, organized in one place.
              </p>
            </div>
          </div>
        </aside>

        <div className="fixed inset-e-6 bottom-6 z-50 hidden sm:block">
          <ThemeToggle variant="floating" />
        </div>
      </div>
    </div>
  )
}
