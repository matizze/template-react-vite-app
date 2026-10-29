import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AppLayoutProps = ComponentProps<'div'> & {
  children: ReactNode
}

export function AppLayout({ children, className, ...props }: AppLayoutProps) {
  return (
    <div
      className={cn('bg-background text-foreground flex min-h-dvh w-full flex-col', className)}
      {...props}
    >
      {children}
    </div>
  )
}
