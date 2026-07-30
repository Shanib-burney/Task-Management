import type { MutationResolvers } from '../../generated/graphql';
import { compose } from '../../shared/utils/compose';
import { withValidation } from '../../shared/middlewares/withValidation';
import { createTaskSchema } from './task.validation';

const Mutation: MutationResolvers = {
  createTask: compose(withValidation(createTaskSchema))((_, { input }, { prisma }) =>
    prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        assigneeId: input.assigneeId,
        status: 0,
      },
    }),
  ),
};

export const taskResolvers = { Mutation };
