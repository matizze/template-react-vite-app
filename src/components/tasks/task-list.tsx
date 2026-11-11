import type { TaskSchema } from '@/schemas'
import { TaskIcon } from '@/icons'
import { TaskItem } from './task-item'

interface TaskListProps {
  tasks: TaskSchema[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  disabled?: boolean
}

export function TaskList({ tasks, onToggle, onRemove, disabled }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <TaskIcon className="size-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">No tasks yet</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add your first one using the form.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRemove={onRemove}
          disabled={disabled}
        />
      ))}
    </ul>
  )
}
