import { AppLayout } from '@/components/layout/app-layout'
import { SignInForm } from '@/components/auth/sign-in-form'
import type { useLoginModel } from './model'
import { LoginSkeleton } from './skeleton'

export function LoginView(props: ReturnType<typeof useLoginModel>) {
  const {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    isSigningIn,
    isCheckingSession,
    errorMessage,
  } = props

  if (isCheckingSession) return <LoginSkeleton />

  return (
    <AppLayout>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <SignInForm
          email={email}
          password={password}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleSubmit}
          isSubmitting={isSigningIn}
          errorMessage={errorMessage}
        />
      </main>
    </AppLayout>
  )
}
