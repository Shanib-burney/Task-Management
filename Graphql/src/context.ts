import { PrismaClient } from '@prisma-client';
import { createUserLoaders } from './modules/user/dataloader';
import { createProjectLoaders } from './modules/project/dataloader';

export function createLoaders(prisma: PrismaClient) {
  return {
    ...createUserLoaders(prisma),
    ...createProjectLoaders(prisma),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;

export type GraphQLContext = {
  prisma: PrismaClient;
  loaders: Loaders;
  token: string;
};
