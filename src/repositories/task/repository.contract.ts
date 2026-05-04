import type { CreateTaskSchema, TaskSchema, UpdateTaskSchema } from '@/schemas'

export interface ITaskRepository {
  list(): Promise<TaskSchema[]>
  get(id: string): Promise<TaskSchema>
  create(input: CreateTaskSchema): Promise<TaskSchema>
  update(id: string, input: UpdateTaskSchema): Promise<TaskSchema>
  delete(id: string): Promise<void>
  toggle(id: string): Promise<TaskSchema>
}
