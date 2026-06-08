import { PrismaClient } from "@prisma-client";

export type GraphQLContext = {
  prisma: PrismaClient;
};

export type CreateUserArgs = {
  name: string;
  email: string;
  passwordHash: string;
};