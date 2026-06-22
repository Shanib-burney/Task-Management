import type { MutationResolvers } from '../../generated/graphql';

const Mutation: MutationResolvers = {
  createTeam: (_, { input }, { prisma }) =>
    prisma.team.create({
      data: { name: input.name },
    }),
};

export const teamResolvers = { Mutation };
