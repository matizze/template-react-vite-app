import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório'),
  description: z.string().trim(),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>
