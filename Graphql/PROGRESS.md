# Project Progress

Learning log for this GraphQL + Prisma task management project. Mirrors the Notion
"🧠 Progress & Learning Tracker" and "🧩 Features Kanban Board" — update both places
when this file changes.

## Next up

- **LC-027 — GraphQL Update & Delete Mutations** (Phase 1, in progress in the Notion
  Progress & Learning Tracker) — `deleteTask` is done (see below); `updateTask` is next,
  then Team, then User.
  Full scope: `updateProject`/`deleteProject`, `updateTask`/`deleteTask`, `updateTeam`/`deleteTeam`,
  `updateUser`, and `deactivateUser` (soft-delete via `UserStatus`, not a hard delete — Prisma
  cascade behavior is inconsistent for `User`, and `Project.owner` has no `onDelete` set on a
  required FK, so hard-deleting an owning user would fail at the DB level). Also requires adding
  a `DEACTIVATED` value to `UserStatus` in `user.enum.ts` (currently only `PENDING`/`ACTIVE`).
  Planned order: Project → Task → Team → User.
- **Authorization scope decided:** `UserRole` stays `ADMIN`/`USER` only — no `MEMBER`/`VIEWER`
  tier. Project mutations stay owner-or-`ADMIN`. Task/Comment mutations only need bare `@auth`
  for now (authentication only, no ownership/team check) — the real rule (global `ADMIN`, or
  any `UserTeam` membership row for the project's team, regardless of team-role) is deferred to
  **LC-012 (RBAC)**, to be built as a shared middleware, not inline per-resolver. Recorded on
  LC-012 and the "Protected Mutations" feature card in Notion.

## What I've learned so far

### Phase 1 – Prisma & GraphQL Foundation

- **Prisma setup & models** — initialized Prisma with PostgreSQL, modeled `User` and
  `Team`, hashed passwords with `bcrypt`. (`prisma/schema.prisma`, `src/modules/user/resolvers.ts`)
- **Prisma relations** — nested writes and relations between `Team → Project → Task`,
  and `User → assigned/owned` records. (`prisma/schema.prisma`)
- **Advanced relations (many-to-many + junction tables)** — `Comment` model and the
  `UserTeam` join table (`@@unique([userId, teamId])`) linking users to teams many-to-many.
  (`prisma/schema.prisma`)
- **GraphQL server setup & queries** — wired Apollo Server to the Prisma client via
  Express, first working query (`users`) returning live Postgres data.
  (`src/index.ts`, `src/modules/user/user.graphql`)
- **Mutations & input types** — write operations using dedicated GraphQL input types
  (`CreateUserInput`, `CreateProjectInput`, etc.), validated through Zod schemas via a
  shared `compose(withValidation(schema))` middleware rather than inline checks.
  (`src/shared/middlewares/withValidation.ts`, `src/modules/*/​*.validation.ts`)
- **Delete mutations & not-found handling** — `deleteTask(id: ID!): Task!` implemented:
  bare-id argument (not a wrapped input type, since there's nothing to group for a single
  scalar), `ID!` kept consistent with `Task.id`'s own type. Resolver does `findUnique` before
  `delete` (mirrors `login`'s find-check-throw shape) and throws `GraphQLError` with
  `extensions.code: 'NOT_FOUND'` when the id doesn't exist — a new error-code precedent
  alongside the existing `UNAUTHENTICATED`/`FORBIDDEN`/`BAD_USER_INPUT` ones. Chose
  check-first over catch-Prisma's-`P2025` because unit tests fully mock `prisma`
  (`tests/setup.ts`), and mocking `findUnique → null` is far simpler than constructing a fake
  `PrismaClientKnownRequestError`. (`src/modules/task/task.graphql`, `src/modules/task/resolvers.ts`)
- **GraphQL over HTTP status codes** — learned GraphQL responses are HTTP 200 by default
  regardless of body-level errors (`application/json` response mode); the newer
  `application/graphql-response+json` mode allows varying status by error type (request
  errors that never reach execution vs field errors from within a resolver), but this app
  doesn't implement that mode — not adopted, just documented understanding.

### Phase 2 – Security & Real-Time

- **JWT authentication** — login issues a JWT after `bcrypt.compare`; every request
  parses `Authorization: Bearer <token>` and populates `context.user`.
  (`src/index.ts`, `src/modules/user/resolvers.ts`)
- **GraphQL error handling** — standardized on `GraphQLError` with `extensions.code`
  (`UNAUTHENTICATED`, `FORBIDDEN`, `BAD_USER_INPUT`) instead of ad-hoc error shapes.
  (`src/shared/directives/auth.directive.ts`, `src/shared/utils/validate.ts`)

### Still learning / not started

- Nested resolvers and DataLoader batching are only partially done — `Project.tasks`
  and `User.ownedProjects` are loader-backed, but `Task`/`Team` have no loaders yet, and
  there's no `Comment` type/resolver at all despite the Prisma model existing.
- Role-based authorization: the `@auth(requires: [...])` directive itself works, but
  it's only actually role-restricted on the `users` query and `createTeam` — mutations
  like `createProject`/`createTask` are auth-gated but not role-gated yet.
- Field-level authorization, GraphQL subscriptions, and the NestJS/Next.js phases
  haven't been started.
- Two new concepts identified while auditing the schema: implementing **update/delete
  mutations** (no update or delete mutation exists for anything yet — only creates),
  and **exposing relational fields** that already exist in Prisma but aren't queryable
  yet (`Task.assignee`, `Project.owner`/`team`, `User.teams`).

## Features completed so far

**Core Infrastructure**
- Database Setup, User Model, Team Model, Database Migration

**Project & Task System**
- Project Model, Task Model, Project Creation (`createProject`), Task Creation (`createTask`),
  Task Deletion (`deleteTask`, with `NOT_FOUND` handling)

**Team Membership System**
- Team Membership Table (`UserTeam` join table — DB-level only, not yet exposed via GraphQL)

**GraphQL API Core**
- User Queries (`users` query, ADMIN-only)

**Authentication**
- User Registration (`createUser`), User Login (`login`), Password Hashing (`bcrypt`),
  JWT Verification (`context.user` from JWT)

**Error Handling**
- GraphQL Error Structure, Authentication Errors, Validation Errors

## In progress

- Nested Resolvers, DataLoader Integration, Protected Mutations, Role System — all
  partially implemented (see gaps above).

## Known gaps not yet tracked as separate learning, now added to the board

- Update/Delete mutations for Project, Task, Team (`deleteTask` now done — see above; the rest
  don't exist yet)
- Exposing `Task.assignee`, `Project.owner`/`team`, `User.teams` as queryable fields
- **Prisma error translation & production error safety** — Prisma's known errors (e.g. `P2025`)
  and raw stack traces currently leak to the client as `INTERNAL_SERVER_ERROR` unless a
  resolver explicitly guards against them (as `deleteTask` now does for its own not-found
  case). No global handling exists — no `formatError` hook on `ApolloServer`, and stack traces
  aren't stripped based on `NODE_ENV`. Tracked as a new Notion feature card ("Not Found &
  Production Error Safety") under LC-014, intentionally left as an addendum rather than
  reopening LC-014 itself (its original auth/validation-error scope is genuinely done).
