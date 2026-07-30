# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                # tsx watch dev server (src/index.ts)
npm run build               # prisma generate -> graphql-codegen -> tsc -> copy .graphql files to dist
npm start                   # run compiled server (dist/index.js)

npm run generate            # regenerate Prisma client (after editing prisma/schema.prisma)
npm run codegen             # regenerate src/generated/graphql.ts (after editing any *.graphql file)

npm test                    # unit tests (jest.config.js), Prisma client is mocked (tests/setup.ts)
npm run test:e2e            # e2e tests (jest.e2e.config.js), hits a real DB, cleans tables between tests (tests/e2e/setup.ts)
npm run test:watch
npm run test:coverage
npx jest path/to/file.test.ts            # run a single unit test file
npx jest -t "test name"                  # run tests matching a name
npx jest --config jest.e2e.config.js path/to/file.e2e.ts   # single e2e test file

npm run lint / lint:fix
npm run format / format:fix
npm run type-check          # tsc --noEmit for src (tsconfig.app.json)
npm run type-check:test     # tsc --noEmit for tests
```

After changing `prisma/schema.prisma`, run `npm run generate`; a migration also needs to be created via `prisma migrate dev` (not currently wired as an npm script). After changing any `*.graphql` file, run `npm run codegen` to regenerate `src/generated/graphql.ts` — resolver types come from this generated file, not hand-written.

## Architecture

Express + Apollo Server (v5, `@as-integrations/express5`) GraphQL API on Prisma/Postgres. Entry point `src/index.ts` builds the Express app, verifies the JWT from the `Authorization: Bearer <token>` header into a `AuthUser` on each request, and mounts Apollo at `/graphql`.

**Module layout** — each domain (`user`, `project`, `task`, `team`, plus `shared` for cross-cutting SDL) lives under `src/modules/<name>/` with:
- `<name>.graphql` — SDL, merged in `src/schema.ts` via `mergeResolvers`/string concatenation of all `typeDefs`
- `resolvers.ts` — `Query`/`Mutation`/type resolvers, exported as `<name>Resolvers` from `index.ts`
- `<name>.validation.ts` — Zod schemas for mutation inputs
- `<name>.enum.ts` — numeric enums mirroring Prisma `@db.SmallInt` columns (e.g. `UserRole.ADMIN = 0`); GraphQL enum resolution maps int -> enum name (`user.enum.ts` wired into codegen's `enumValues` config)
- `dataloader.ts` (where present) — per-request `DataLoader`s, merged in `src/context.ts` `createLoaders()`

**Schema is source-of-truth, codegen types second.** `codegen.ts` points GraphQL Codegen at `src/modules/**/*.graphql` and maps each GraphQL object type to a hand-written "Mapper" type in `src/mappers.ts` (the shape actually returned by Prisma, e.g. `role: number` not the enum) — this is why resolvers can return raw Prisma rows and only convert enums at the field-resolver level (see `User.role` in `src/modules/user/resolvers.ts`).

**Resolver middleware.** Mutations that take an `input` are wrapped with `compose(...)` (`src/shared/utils/compose.ts`), typically `compose(withValidation(schema))(resolver)`. `withValidation` (`src/shared/middlewares/withValidation.ts`) parses `args.input` through the module's Zod schema and throws a `BAD_USER_INPUT` `GraphQLError` with per-field issues on failure — add new middlewares here rather than inlining validation in resolvers.

**Auth.** A custom `@auth(requires: [UserRole!])` schema directive (`src/shared/directives/auth.directive.ts`) is applied once in `src/schema.ts` via `mapSchema`/`MapperKind.OBJECT_FIELD`. Fields tagged `@auth` in SDL reject unauthenticated requests (`UNAUTHENTICATED`) or wrong roles (`FORBIDDEN`) before the resolver runs; `context.user` is populated (or `null`) in `src/index.ts` from the JWT, not per-resolver.

**Context** (`src/context.ts`): every resolver gets `{ prisma, loaders, user, logger }`. `loaders` is the merge of all modules' dataloaders — add a new module's loaders to `createLoaders()` when introducing one.

**Path aliases:** `@prisma-client` -> generated Prisma client (`src/generated/prisma/client`, path differs between `src` at dev-time via `module-alias` and `dist` at build-time — see `_moduleAliases` in `package.json`); `src/...` and `@/...` are usable in tests via Jest `moduleNameMapper` but plain relative imports are used in `src`.

**Testing split:** unit tests fully mock `prisma` and `bcryptjs`/`logger` (`tests/setup.ts`) — no real DB. E2E tests (`tests/e2e/`) connect to a real database, truncate all tables in FK-safe order before each test, and exercise the Express `app` exported from `src/index.ts` (guarded by `NODE_ENV !== 'test'` so the server doesn't auto-listen during tests).
