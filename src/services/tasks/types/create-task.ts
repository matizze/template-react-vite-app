import type { Task } from '@/services/schemas/task'

export const ENDPOINT = '/tasks'

export interface CreateTaskRequest {
  title: string
  description?: string
}

export type CreateTaskResponse = Task
