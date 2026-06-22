import { CreateProjectInput, CreateTaskInput, CreateUserArgs, GraphQLContext } from "./types";
import bcrypt from 'bcryptjs';

type MutationArgs<T> = {
  input: T;
};

export const resolvers = {
  Query: {
    users: async (_: unknown, __: unknown, { prisma }: GraphQLContext) => {
      return prisma.user.findMany();
    },
  },
  User: {
    ownedProjects: async (parent: { id: number }, _: unknown, { prisma }: any) => {
      return prisma.project.findMany({
        where: { ownerId: parent.id }, // 1 query PER user → N queries
      });
    },
  },

  Project: {
    tasks: async (parent: { id: number }, _: unknown, { prisma }: any) => {
      return prisma.task.findMany({
        where: { projectId: parent.id }, // 1 query PER project → N queries
      });
    },
  },

  // DataLoader versions (batch queries — no N+1):
  // User: {
  //   ownedProjects: (parent: { id: number }, _: any, { loaders }: GraphQLContext) => {
  //     return loaders.projectsByOwner.load(parent.id);
  //   },
  // },
  // Project: {
  //   tasks: (parent: { id: number }, _: any, { loaders }: GraphQLContext) => {
  //     return loaders.tasksByProject.load(parent.id);
  //   },
  // },

  Mutation: {
    createUser: async (_: unknown, args: MutationArgs<CreateUserArgs>, { prisma }: GraphQLContext) => {
      const passwordHash = await bcrypt.hash(args.input.password, 10);

      return prisma.user.create({
        data: {
          name: args.input.name,
          email: args.input.email,
          passwordHash: args.input.password, // bug: should use passwordHash variable
          role: 0,
          status: 1,
        },
      });
    },

    createProject: async (_: unknown, { input }: { input: CreateProjectInput }, { prisma }: GraphQLContext) => {
      return prisma.project.create({
        data: {
          name: input.name,
          teamId: input.teamId,
          ownerId: input.ownerId,
          status: 0,
        },
      });
    },

    createTask: async (_: any, { input }: { input: CreateTaskInput }, { prisma }: GraphQLContext) => {
      return prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
          assigneeId: input.assigneeId,
          status: 0,
        },
      });
    },

    createTeam: async (_: any, { input }: { input: { name: string } }, { prisma }: GraphQLContext) => {
      return prisma.team.create({
        data: { name: input.name },
      });
    },
  },
};
