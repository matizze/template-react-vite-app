import { TrashIcon } from 'lucide-react'
import type { Task } from '@/services/schemas/task'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  disabled?: boolean
}

export function TaskItem({ task, onToggle, onRemove, disabled }: TaskItemProps) {
  return (
    <li className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        disabled={disabled}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium leading-snug',
            task.completed && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">
            {task.description}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Remove task"
        disabled={disabled}
        onClick={() => onRemove(task.id)}
      >
        <TrashIcon className="size-4" />
      </Button>
    </li>
  )
}
