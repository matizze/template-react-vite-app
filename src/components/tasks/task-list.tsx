import type { TaskSchema } from "@/schemas";
import { TaskItem } from "./task-item";

interface TaskListProps {
    tasks: TaskSchema[];
    onToggle: (id: string) => void;
    onRemove: (id: string) => void;
    disabled?: boolean;
}

export function TaskList({
    tasks,
    onToggle,
    onRemove,
    disabled,
}: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">
                No tasks yet. Add your first one above.
            </p>
        );
    }

    return (
        <ul className="flex flex-col gap-2">
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
    );
}
