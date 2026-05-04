import type { Task } from '@/services/schemas/task'

export const ENDPOINT = '/tasks'

export type ListTasksRequest = void
export type ListTasksResponse = Task[]
