import { z } from "zod";

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  completed: z.boolean().optional(),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
