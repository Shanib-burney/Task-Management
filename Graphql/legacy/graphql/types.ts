import { PrismaClient } from "@prisma-client";
import { Loaders } from "./dataloader";

export type GraphQLContext = {
    prisma: PrismaClient;
    loaders: Loaders;
};

export type CreateUserArgs = {
    name: string;
    email: string;
    password: string;
};

export type CreateProjectInput = {
    name: string;
    teamId: number;
    ownerId: number;
};

export type CreateTaskInput = {
    title: string;
    description?: string;
    projectId: number;
    assigneeId?: number;
};
