import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/hooks/use-auth'

export function useLoginModel() {
  const [, navigate] = useLocation()
  const { isAuthenticated, isLoading, signIn, signInError, isSigningIn } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate('/tasks', { replace: true })
  }, [isAuthenticated, navigate])

  return {
    handleSubmit: signIn,
    error: signInError,
    isSigningIn,
    isCheckingSession: isLoading,
  }
}
