import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: ReactNode
  /** Elemento à direita do valor, normalmente um <Badge> de variação. */
  trend?: ReactNode
  className?: string
}

/** Card de métrica (KPI) no padrão TailAdmin: ícone, rótulo e valor em destaque. */
export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90 [&_svg]:size-6">
        {icon}
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <p className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">{value}</p>
        </div>
        {trend}
      </div>
    </div>
  )
}
