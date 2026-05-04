import type { Task } from '@/services/schemas/task'

export interface IAppDB {
  tasks: {
    toArray(): Promise<Task[]>
    get(id: string): Promise<Task | undefined>
    add(task: Task): Promise<string>
    delete(id: string): Promise<void>
    update(id: string, changes: Partial<Task>): Promise<number>
    clear(): Promise<void>
    put(task: Task): Promise<string>
  }
}
