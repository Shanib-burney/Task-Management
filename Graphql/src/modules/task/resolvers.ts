import type { MutationResolvers } from '../../generated/graphql';
import { compose } from '../../shared/utils/compose';
import { withValidation } from '../../shared/middlewares/withValidation';
import { createTaskSchema } from './task.validation';
import { GraphQLError } from 'graphql/error';

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
  deleteTask: (async (_, { id }, { prisma }) => {

    const task = await prisma.task.findUnique({ where: { id: Number(id) } })
    if (!task) {
      throw new GraphQLError(`Task with id ${id} not found`, {
        extensions: {
          code: 'NOT_FOUND'
        }
      })
    }

    return prisma.task.delete({ where: { id: Number(id) } })

  }),
};

export const taskResolvers = { Mutation };
