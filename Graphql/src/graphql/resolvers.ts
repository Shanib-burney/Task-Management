export const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: any) => {
      return prisma.user.findMany();
    },
  },
};