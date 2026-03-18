import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty"),
  status: z.number(),
  teamId: z.number(),
  ownerId: z.number(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty").optional(),
  status: z.number().optional(),
  teamId: z.number().optional(),
  ownerId: z.number().optional(),
});
