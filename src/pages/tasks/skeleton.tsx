import { AppLayout } from '@/components/layout/app-layout'
import { Navbar } from '@/components/layout/navbar'
import { Skeleton } from '@/components/ui/skeleton'

export function TasksSkeleton({ inline = false }: { inline?: boolean }) {
  const list = (
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  )

  if (inline) return list

  return (
    <AppLayout>
      <Navbar>
        <Skeleton className="h-4 w-24" />
      </Navbar>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        {list}
      </main>
    </AppLayout>
  )
}
