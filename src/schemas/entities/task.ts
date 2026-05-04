import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type TaskSchema = z.infer<typeof taskSchema>
