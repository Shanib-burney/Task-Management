import type { MutationResolvers, ProjectResolvers } from '../../generated/graphql';

const Mutation: MutationResolvers = {
  createProject: (_, { input }, { prisma }) =>
    prisma.project.create({
      data: {
        name: input.name,
        teamId: input.teamId,
        ownerId: input.ownerId,
        status: 0,
      },
    }),
};

const Project: ProjectResolvers = {
  tasks: (parent, _, { loaders }) => loaders.tasksByProject.load(parent.id),
};

export const projectResolvers = { Mutation, Project };
