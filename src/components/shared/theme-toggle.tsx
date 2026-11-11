import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@/icons'
import { cn } from '@/lib/utils'
import { useTheme } from '@/providers/theme'

interface ThemeToggleProps {
  /** `header`: botão outline do topo; `floating`: botão redondo flutuante (telas de auth). */
  variant?: 'header' | 'floating'
  className?: string
}

export function ThemeToggle({ variant = 'header', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <Button
      variant={variant === 'header' ? 'outline' : 'default'}
      size="icon-lg"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={cn(variant === 'floating' && 'size-14 rounded-full', className)}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
