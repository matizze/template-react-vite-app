import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/use-auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="text-brand-500 size-8" />
      </div>
    )
  }
  if (!isAuthenticated) return null

  return <>{children}</>
}
