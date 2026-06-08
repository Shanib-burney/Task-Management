import { CreateUserArgs, GraphQLContext } from "./types";

type MutationCreateUserArgs = {
  input: CreateUserArgs;
};

export const resolvers = {
  Query: {
    users: async (_: unknown, __: unknown, { prisma }: GraphQLContext) => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    createUser: async (_: unknown, args: MutationCreateUserArgs, { prisma }: GraphQLContext) => {

      return prisma.user.create({
        data: {
           name: args.input.name,
          email: args.input.email,
          passwordHash: args.input.passwordHash,
          role: 0,
          status: 1,
        },
      });
    },
  },
};