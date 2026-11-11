import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading da página de tasks. O shell (sidebar/header) é do AppLayout e continua
 * visível; aqui só o conteúdo. `inline` renderiza apenas a lista.
 */
export function TasksSkeleton({ inline = false }: { inline?: boolean }) {
  const list = (
    <div className="flex flex-col gap-3">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  )

  if (inline) return list

  return (
    <div aria-busy="true">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl xl:col-span-2" />
      </div>
    </div>
  )
}
