import DataLoader from "dataloader";
import { PrismaClient } from "@prisma-client";

export function createUserLoaders(prisma: PrismaClient) {
  return {
    projectsByOwner: new DataLoader<number, any[]>(async (ownerIds) => {
      const projects = await prisma.project.findMany({
        where: { ownerId: { in: [...ownerIds] } },
      });
      return ownerIds.map((id) => projects.filter((p) => p.ownerId === id));
    }),
  };
}
