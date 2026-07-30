import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql/error';
import type { GraphQLContext } from '../../context';
import { UserRole } from '../../modules/user/user.enum';

export function applyAuthDirective(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
      if (!authDirective) return fieldConfig;

      // Enum directive args resolve to their SDL name (e.g. "ADMIN"), not the numeric enum value.
      const requires: UserRole[] | undefined = authDirective.requires?.map(
        (roleName: keyof typeof UserRole) => UserRole[roleName],
      );
      const resolve = fieldConfig.resolve ?? defaultFieldResolver;

      fieldConfig.resolve = (source, args, context: GraphQLContext, info) => {
        if (!context.user) {
          throw new GraphQLError('You must be logged in to perform this action', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        if (requires?.length && !requires.includes(context.user.role)) {
          throw new GraphQLError('You are not authorized to perform this action', {
            extensions: { code: 'FORBIDDEN' },
          });
        }
        return resolve(source, args, context, info);
      };

      return fieldConfig;
    },
  });
}
