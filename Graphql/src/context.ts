import { PrismaClient } from '@prisma-client';
import { createUserLoaders } from './modules/user/dataloader';
import { createProjectLoaders } from './modules/project/dataloader';
import { UserRole } from './modules/user/user.enum';

export function createLoaders(prisma: PrismaClient) {
  return {
    ...createUserLoaders(prisma),
    ...createProjectLoaders(prisma),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;

export type AuthUser = {
  id: number;
  role: UserRole;
};

export type GraphQLContext = {
  prisma: PrismaClient;
  loaders: Loaders;
  user: AuthUser | null;
};
