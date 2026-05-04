import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/hooks/use-auth'
import { TasksSkeleton } from '@/pages/tasks/skeleton'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) return <TasksSkeleton />
  if (!isAuthenticated) return null

  return <>{children}</>
}
