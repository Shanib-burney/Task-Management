import { readFileSync } from 'fs';
import { join } from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './modules/user';
import { projectResolvers } from './modules/project';
import { taskResolvers } from './modules/task';
import { teamResolvers } from './modules/team';
import { applyAuthDirective } from './shared/directives/auth.directive';

const loadGql = (file: string) =>
  readFileSync(join(__dirname, 'modules', file), 'utf-8');

export const typeDefs = [
  loadGql('shared/shared.graphql'),
  loadGql('user/user.graphql'),
  loadGql('project/project.graphql'),
  loadGql('task/task.graphql'),
  loadGql('team/team.graphql'),
];

export const resolvers = mergeResolvers([
  userResolvers,
  projectResolvers,
  taskResolvers,
  teamResolvers,
]);

export const schema = applyAuthDirective(
  makeExecutableSchema({ typeDefs, resolvers }),
);
