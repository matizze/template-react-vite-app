import { cn } from '@/lib/utils'

interface LogoProps {
  /** `full` mostra símbolo + nome; `icon` só o símbolo (sidebar recolhida). */
  variant?: 'full' | 'icon'
  size?: 'default' | 'lg'
  /** Força o nome em branco, para fundos escuros (ex.: painel do AuthLayout). */
  inverted?: boolean
  className?: string
}

/**
 * Marca do app. Para usar os assets oficiais, troque o conteúdo por
 * `<img src="/images/logo/logo.svg" />` mantendo a mesma API.
 */
export function Logo({
  variant = 'full',
  size = 'default',
  inverted = false,
  className,
}: LogoProps) {
  const lg = size === 'lg'

  return (
    <span className={cn('inline-flex items-center', lg ? 'gap-3' : 'gap-2.5', className)}>
      <span
        className={cn(
          'bg-brand-500 shadow-theme-xs flex shrink-0 items-center justify-center leading-none font-bold text-white',
          lg ? 'size-12 rounded-xl text-2xl' : 'size-8 rounded-lg text-lg',
        )}
      >
        M
      </span>
      {variant === 'full' && (
        <span
          className={cn(
            'font-semibold tracking-tight',
            lg ? 'text-3xl' : 'text-xl',
            inverted ? 'text-white' : 'text-gray-900 dark:text-white',
          )}
        >
          Matizze
        </span>
      )}
    </span>
  )
}
