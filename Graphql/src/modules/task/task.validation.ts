import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).nullish(),
  projectId: z.number().int().positive(),
  assigneeId: z.number().int().positive().nullish(),
});

export const updateTaskSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(2000).nullish(),
});
