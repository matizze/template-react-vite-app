import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type NavbarProps = ComponentProps<'header'> & {
  children?: ReactNode
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

export function Navbar({
  children,
  leftSlot,
  rightSlot,
  className,
  ...props
}: NavbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-14 w-full items-center gap-3 border-b bg-background/80 px-4 backdrop-blur',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">{leftSlot}</div>
      <div className="flex flex-1 items-center min-w-0">{children}</div>
      <div className="flex items-center gap-2">{rightSlot}</div>
    </header>
  )
}
