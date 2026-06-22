import DataLoader from "dataloader";
import { PrismaClient } from "@prisma-client";

export function createLoaders(prisma: PrismaClient) {
  return {
    projectsByOwner: new DataLoader<number, any[]>(async (ownerIds) => {
      const projects = await prisma.project.findMany({
        where: { ownerId: { in: [...ownerIds] } },
      });

      return ownerIds.map((id) => projects.filter((p) => p.ownerId === id));
    }),

    tasksByProject: new DataLoader<number, any[]>(async (projectIds) => {
      const tasks = await prisma.task.findMany({
        where: { projectId: { in: [...projectIds] } },
      });

      return projectIds.map((id) => tasks.filter((t) => t.projectId === id));
    }),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
