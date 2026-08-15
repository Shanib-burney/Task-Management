import bcrypt from "bcryptjs";
import {
  type MutationResolvers,
  type QueryResolvers,
  type UserResolvers,
} from "../../generated/graphql";
import { UserRole } from "./user.enum";
import { GraphQLError } from "graphql/error";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../shared/utils/constants";
import { compose } from "../../shared/utils/compose";
import { withValidation } from "../../shared/middlewares/withValidation";
import { createUserSchema, loginSchema } from "./user.validation";

const Query: QueryResolvers = {
  users: (_, __, { prisma }) => prisma.user.findMany(),
};

const Mutation: MutationResolvers = {
  createUser: compose(withValidation(createUserSchema))(
    async (_, { input }, { prisma }) => {
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
  ),
  login: compose(withValidation(loginSchema))(
    async (_, { input }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const token = jwt.sign(
        { userId: user.id, role: UserRole[user.role] },
        JWT_SECRET,
        { expiresIn: "1d" },
      );
      return { token, user };
    },
  ),
};

const User: UserResolvers = {
  role: (parent) => UserRole[parent.role] as unknown as UserRole,
  ownedProjects: (parent, _, { loaders }) =>
    loaders.projectsByOwner.load(parent.id),
};

export const userResolvers = { Query, Mutation, User };
