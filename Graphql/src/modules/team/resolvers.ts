import type { MutationResolvers } from "../../generated/graphql";
import { compose } from "../../shared/utils/compose";
import { withValidation } from "../../shared/middlewares/withValidation";
import { createTeamSchema } from "./team.validation";

const Mutation: MutationResolvers = {
  createTeam: compose(withValidation(createTeamSchema))(
    (_, { input }, { prisma }) =>
      prisma.team.create({
        data: { name: input.name },
      }),
  ),
};

export const teamResolvers = { Mutation };
