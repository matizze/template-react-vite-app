import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ComponentCardProps {
  title: string
  description?: string
  /** Conteúdo à direita do título (ex.: contador, filtro, botão). */
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** Card de seção com cabeçalho e corpo separados por borda (padrão TailAdmin). */
export function ComponentCard({
  title,
  description,
  action,
  className,
  children,
}: ComponentCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <header className="flex items-start justify-between gap-4 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        {action}
      </header>
      <div
        className={cn(
          'space-y-6 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800',
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}
