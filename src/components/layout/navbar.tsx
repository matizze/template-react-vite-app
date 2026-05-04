import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type NavbarProps = ComponentProps<'header'> & {
  children?: ReactNode
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

export function Navbar({ children, leftSlot, rightSlot, className, ...props }: NavbarProps) {
  return (
    <header
      className={cn(
        'bg-background/80 sticky top-0 z-30 flex h-14 w-full items-center gap-3 border-b px-4 backdrop-blur',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">{leftSlot}</div>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      <div className="flex items-center gap-2">{rightSlot}</div>
    </header>
  )
}
