import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1),
  status: z.number().int(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.number().int().optional(),
});
