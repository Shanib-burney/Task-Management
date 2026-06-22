import bcrypt from 'bcryptjs';
import type { MutationResolvers, QueryResolvers, UserResolvers } from '../../generated/graphql';

const Query: QueryResolvers = {
  users: (_, __, { prisma }) => prisma.user.findMany(),
};

const Mutation: MutationResolvers = {
  createUser: async (_, { input }, { prisma }) => {
    const passwordHash = await bcrypt.hash(input.password, 10);
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: 0,
        status: 1,
      },
    });
  },
};

const User: UserResolvers = {
  ownedProjects: (parent, _, { loaders }) =>
    loaders.projectsByOwner.load(parent.id),
};

export const userResolvers = { Query, Mutation, User };
