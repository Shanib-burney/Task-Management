import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty"),
  status: z.number().optional(),
  teamId: z.number(),
  ownerId: z.number(),
  tasks: z
    .array(
      z.object({
        title: z.string().min(1, "Task title cannot be empty"),
        description: z.string().optional(),
        status: z.number().optional(),
      }),
    )
    .optional()
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name cannot be empty").optional(),
  status: z.number().optional(),
  teamId: z.number().optional(),
  ownerId: z.number().optional(),
});

export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;
