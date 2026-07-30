import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().trim().min(2).max(150),
  teamId: z.number().int().positive(),
  ownerId: z.number().int().positive(),
});
