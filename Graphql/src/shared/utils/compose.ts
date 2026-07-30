import type { GraphQLResolveInfo } from 'graphql';

export type InputResolverFn<TResult, TInput, TContext> = (
  parent: unknown,
  args: { input: TInput },
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export type ResolverMiddleware<TInput, TContext> = <TResult>(
  next: InputResolverFn<TResult, TInput, TContext>,
) => InputResolverFn<TResult, TInput, TContext>;

export function compose<TInput, TContext>(
  ...middlewares: ResolverMiddleware<TInput, TContext>[]
) {
  return <TResult>(
    resolver: InputResolverFn<TResult, TInput, TContext>,
  ): InputResolverFn<TResult, TInput, TContext> =>
    middlewares.reduceRight<InputResolverFn<TResult, TInput, TContext>>(
      (next, middleware) => middleware(next),
      resolver,
    );
}
