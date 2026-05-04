import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/hooks/use-auth'
import { UIError } from '@/services/errors/ui-error'

export function useLoginModel() {
  const [, navigate] = useLocation()
  const {
    isAuthenticated,
    isLoading,
    signIn,
    isSigningIn,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/tasks', { replace: true })
  }, [isAuthenticated, navigate])

  async function handleSubmit() {
    setErrorMessage(null)
    try {
      await signIn({ email, password })
      navigate('/tasks', { replace: true })
    } catch (err: unknown) {
      if (err instanceof UIError || err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Erro ao fazer login.')
      }
    }
  }

  return {
    email,
    password,
    handleEmailChange: setEmail,
    handlePasswordChange: setPassword,
    handleSubmit,
    isSigningIn,
    isCheckingSession: isLoading,
    errorMessage,
  }
}
