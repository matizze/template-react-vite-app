import { LogOutIcon } from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskList } from '@/components/tasks/task-list'
import type { useTasksModel } from './model'
import { TasksSkeleton } from './skeleton'

export function TasksView(props: ReturnType<typeof useTasksModel>) {
  const {
    user,
    tasks,
    stats,
    isLoading,
    isMutating,
    handleCreate,
    handleToggle,
    handleRemove,
    handleSignOut,
    isSigningOut,
  } = props

  return (
    <AppLayout>
      <Navbar
        rightSlot={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOutIcon className="size-4" />
            Sign out
          </Button>
        }
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">Tasks</span>
          {user && (
            <span className="text-xs text-muted-foreground leading-tight">
              {user.name} · {user.email}
            </span>
          )}
        </div>
      </Navbar>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onSubmit={handleCreate} isSubmitting={isMutating} />
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <header className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold">Your tasks</h2>
            <p className="text-xs text-muted-foreground">
              {stats.completed}/{stats.total} done
            </p>
          </header>

          {isLoading ? (
            <TasksSkeleton inline />
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onRemove={handleRemove}
              disabled={isMutating}
            />
          )}
        </section>
      </main>
    </AppLayout>
  )
}
