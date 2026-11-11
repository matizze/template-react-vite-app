import { SignInForm } from '@/components/auth/sign-in-form'
import { PageMeta } from '@/components/shared/page-meta'
import type { useLoginModel } from './model'
import { LoginSkeleton } from './skeleton'

export function LoginView(props: ReturnType<typeof useLoginModel>) {
  const { handleSubmit, error, isSigningIn, isCheckingSession } = props

  if (isCheckingSession) return <LoginSkeleton />

  return (
    <>
      <PageMeta title="Sign in" />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <SignInForm onSubmit={handleSubmit} isSubmitting={isSigningIn} error={error} />
      </div>
    </>
  )
}
