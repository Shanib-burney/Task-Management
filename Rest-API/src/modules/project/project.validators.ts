import { enumSchema } from '../shared/utils/utils';
import { z } from 'zod';
import { ProjectStatus, TaskStatus } from './project.enums';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name cannot be empty'),
  status: enumSchema(ProjectStatus).optional().default(ProjectStatus.ACTIVE),
  teamId: z.number(),
  ownerId: z.number(),
  tasks: z
    .array(
      z.object({
        title: z.string().min(1, 'Task title cannot be empty'),
        description: z.string().optional(),
        status: enumSchema(TaskStatus).optional().default(TaskStatus.TODO),
      }),
    )
    .optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name cannot be empty').optional(),
  status: enumSchema(ProjectStatus).optional(),
  teamId: z.number().optional(),
  ownerId: z.number().optional(),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;

export const createTasksSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().min(1, 'Task title cannot be empty'),
      description: z.string().optional(),
      status: enumSchema(TaskStatus).optional().default(TaskStatus.TODO),
      comments: z
        .array(
          z.object({
            content: z.string().min(1, 'Comment content cannot be empty'),
            authorId: z.number(),
          }),
        )
        .optional(),
    }),
  ),
});

export type CreateTasksDTO = z.infer<typeof createTasksSchema>;
