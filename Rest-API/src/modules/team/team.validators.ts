import { z } from "zod";
export const createTeamSchema = z.object({
  name: z.string().min(1),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
});

export type CreateTeamDTO = z.infer<typeof createTeamSchema>;
export type UpdateTeamDTO = z.infer<typeof updateTeamSchema>;
