import DataLoader from "dataloader";
import { PrismaClient } from "@prisma-client";

export function createProjectLoaders(prisma: PrismaClient) {
  return {
    tasksByProject: new DataLoader<number, any[]>(async (projectIds) => {
      const tasks = await prisma.task.findMany({
        where: { projectId: { in: [...projectIds] } },
      });
      return projectIds.map((id) => tasks.filter((t) => t.projectId === id));
    }),
  };
}
