# Project Progress

Learning log for this GraphQL + Prisma task management project. Mirrors the Notion
"🧠 Progress & Learning Tracker" and "🧩 Features Kanban Board" — update both places
when this file changes.

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
- Project Model, Task Model, Project Creation (`createProject`), Task Creation (`createTask`)

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

- Update/Delete mutations for Project, Task, Team (no CRUD beyond create exists)
- Exposing `Task.assignee`, `Project.owner`/`team`, `User.teams` as queryable fields
