import type {
  MutationResolvers,
  ProjectResolvers,
} from "../../generated/graphql";
import { compose } from "../../shared/utils/compose";
import { withValidation } from "../../shared/middlewares/withValidation";
import { createProjectSchema } from "./project.validation";

const Mutation: MutationResolvers = {
  createProject: compose(withValidation(createProjectSchema))(
    (_, { input }, { prisma }) =>
      prisma.project.create({
        data: {
          name: input.name,
          teamId: input.teamId,
          ownerId: input.ownerId,
          status: 0,
        },
      }),
  ),
};

const Project: ProjectResolvers = {
  tasks: (parent, _, { loaders }) => loaders.tasksByProject.load(parent.id),
};

export const projectResolvers = { Mutation, Project };
