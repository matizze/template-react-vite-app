import type { Task } from '@/services/schemas/task'

export const ENDPOINT = '/tasks'

export interface UpdateTaskRequest {
  id: string
  data: {
    title?: string
    description?: string
    completed?: boolean
  }
}

export type UpdateTaskResponse = Task
