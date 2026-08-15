import type { ZodType } from "zod";
import { validate } from "../utils/validate";
import type { ResolverMiddleware } from "../utils/compose";
import type { GraphQLContext } from "../../context";

export function withValidation<TInput>(
  schema: ZodType<TInput>,
): ResolverMiddleware<TInput, GraphQLContext> {
  return (next) => (parent, args, context, info) => {
    const input = validate(schema, args.input);
    return next(parent, { input }, context, info);
  };
}
