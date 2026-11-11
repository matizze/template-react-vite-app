import { ComponentCard } from '@/components/shared/component-card'
import { PageBreadcrumb } from '@/components/shared/page-breadcrumb'
import { PageMeta } from '@/components/shared/page-meta'
import { StatCard } from '@/components/shared/stat-card'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskList } from '@/components/tasks/task-list'
import { Badge } from '@/components/ui/badge'
import { CheckCircleIcon, HourglassIcon, ListIcon } from '@/icons'
import type { useTasksModel } from './model'
import { TasksSkeleton } from './skeleton'

export function TasksView(props: ReturnType<typeof useTasksModel>) {
  const {
    tasks,
    stats,
    isLoading,
    isCreating,
    isMutating,
    handleCreate,
    handleToggle,
    handleRemove,
  } = props

  const completion = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <>
      <PageMeta title="Tasks" description="Manage your tasks." />
      <PageBreadcrumb pageTitle="Tasks" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        <StatCard label="Total" value={stats.total} icon={<ListIcon />} />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CheckCircleIcon />}
          trend={
            <Badge color="success" size="sm">
              {completion}%
            </Badge>
          }
        />
        <StatCard label="Pending" value={stats.pending} icon={<HourglassIcon />} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ComponentCard title="New task" description="Add something to your list.">
            <TaskForm onSubmit={handleCreate} isSubmitting={isCreating} />
          </ComponentCard>
        </div>

        <div className="xl:col-span-2">
          <ComponentCard
            title="Your tasks"
            action={
              <Badge color="gray" size="sm">
                {stats.completed}/{stats.total} done
              </Badge>
            }
          >
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
          </ComponentCard>
        </div>
      </div>
    </>
  )
}
