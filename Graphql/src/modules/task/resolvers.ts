import type { MutationResolvers } from '../../generated/graphql';

const Mutation: MutationResolvers = {
  createTask: (_, { input }, { prisma }) =>
    prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        assigneeId: input.assigneeId,
        status: 0,
      },
    }),
};

export const taskResolvers = { Mutation };
