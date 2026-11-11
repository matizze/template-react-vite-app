import { Skeleton } from '@/components/ui/skeleton'

/** Renderizado dentro do AuthLayout enquanto a sessão é verificada. */
export function LoginSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-5 py-10"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-11 w-full rounded-[10px]" />
      <Skeleton className="h-11 w-full rounded-[10px]" />
      <Skeleton className="h-11 w-full rounded-[10px]" />
    </div>
  )
}
