import type { Task } from '@/services/schemas/task'

export const ENDPOINT = '/tasks'

export interface ToggleTaskRequest {
  id: string
}

export type ToggleTaskResponse = Task
