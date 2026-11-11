import type { TaskSchema } from '@/schemas'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TrashBinIcon } from '@/icons'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: TaskSchema
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  disabled?: boolean
}

export function TaskItem({ task, onToggle, onRemove, disabled }: TaskItemProps) {
  return (
    <li
      className={cn(
        'group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-gray-700',
        task.completed && 'bg-gray-50 dark:bg-white/2',
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        disabled={disabled}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        className="mt-0.5 size-5"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm leading-snug font-medium text-gray-800 dark:text-white/90',
            task.completed && 'text-gray-400 line-through dark:text-gray-500',
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 text-sm whitespace-pre-wrap text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Remove task"
        disabled={disabled}
        onClick={() => onRemove(task.id)}
        className="text-gray-400 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <TrashBinIcon className="size-4" />
      </Button>
    </li>
  )
}
