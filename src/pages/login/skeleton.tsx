import { AppLayout } from '@/components/layout/app-layout'
import { Skeleton } from '@/components/ui/skeleton'

export function LoginSkeleton() {
  return (
    <AppLayout>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
    </AppLayout>
  )
}
