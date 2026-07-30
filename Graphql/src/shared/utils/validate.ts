import { ZodType, ZodError } from 'zod';
import { GraphQLError } from 'graphql/error';

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new GraphQLError('Invalid input', {
      extensions: {
        code: 'BAD_USER_INPUT',
        issues: (result.error as ZodError).issues.map(i => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
    });
  }
  return result.data;
}
