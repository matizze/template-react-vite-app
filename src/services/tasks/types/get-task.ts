import type { Task } from '@/services/schemas/task'

export const ENDPOINT = '/tasks'

export interface GetTaskRequest {
  id: string
}

export type GetTaskResponse = Task
