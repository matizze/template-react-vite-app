import type { TaskSchema } from '@/schemas'

export const MOCK_TASKS: TaskSchema[] = [
  {
    id: 'tsk_1',
    title: 'Estudar React',
    description: 'Revisar hooks e context',
    completed: false,
    user_id: 'usr_1',
    created_at: '2026-05-01T10:00:00.000Z',
    updated_at: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'tsk_2',
    title: 'Refatorar mock client',
    description: 'Remover Dexie das deps',
    completed: true,
    user_id: 'usr_1',
    created_at: '2026-05-02T09:30:00.000Z',
    updated_at: '2026-05-03T15:00:00.000Z',
  },
]
