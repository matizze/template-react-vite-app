import { AppLayout } from "@/components/layout/app-layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import type { useLoginModel } from "./model";
import { LoginSkeleton } from "./skeleton";

export function LoginView(props: ReturnType<typeof useLoginModel>) {
  const { handleSubmit, error, isSigningIn, isCheckingSession } = props;

  if (isCheckingSession) return <LoginSkeleton />;

  return (
    <AppLayout>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <SignInForm
          onSubmit={handleSubmit}
          isSubmitting={isSigningIn}
          error={error}
        />
      </main>
    </AppLayout>
  );
}
