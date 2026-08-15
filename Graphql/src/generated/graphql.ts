import { UserRole } from "../modules/user/user.enum";
import { GraphQLResolveInfo } from "graphql";
import { UserMapper, ProjectMapper, TaskMapper, TeamMapper } from "../mappers";
import { GraphQLContext } from "../context";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
export type EnumResolverSignature<T, AllowedValues = any> = {
  [key in keyof T]?: AllowedValues;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  token: Scalars["String"]["output"];
  user: User;
};

export type CreateProjectInput = {
  name: Scalars["String"]["input"];
  ownerId: Scalars["Int"]["input"];
  teamId: Scalars["Int"]["input"];
};

export type CreateTaskInput = {
  assigneeId?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  projectId: Scalars["Int"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateTeamInput = {
  name: Scalars["String"]["input"];
};

export type CreateUserInput = {
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  createProject: Project;
  createTask: Task;
  createTeam: Team;
  createUser: User;
  deleteTask: Task;
  login: AuthPayload;
};

export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};

export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};

export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeleteTaskArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type Project = {
  __typename?: "Project";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  status: Scalars["Int"]["output"];
  tasks: Array<Task>;
};

export type Query = {
  __typename?: "Query";
  users: Array<User>;
};

export type Task = {
  __typename?: "Task";
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  status: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
};

export type Team = {
  __typename?: "Team";
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type User = {
  __typename?: "User";
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  ownedProjects: Array<Project>;
  role: UserRole;
};

export { UserRole };

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<
  TTypes,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<
  T = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthPayload: ResolverTypeWrapper<
    Omit<AuthPayload, "user"> & { user: ResolversTypes["User"] }
  >;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  CreateProjectInput: CreateProjectInput;
  CreateTaskInput: CreateTaskInput;
  CreateTeamInput: CreateTeamInput;
  CreateUserInput: CreateUserInput;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Project: ResolverTypeWrapper<ProjectMapper>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Task: ResolverTypeWrapper<TaskMapper>;
  Team: ResolverTypeWrapper<TeamMapper>;
  User: ResolverTypeWrapper<UserMapper>;
  UserRole: UserRole;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: Omit<AuthPayload, "user"> & {
    user: ResolversParentTypes["User"];
  };
  Boolean: Scalars["Boolean"]["output"];
  CreateProjectInput: CreateProjectInput;
  CreateTaskInput: CreateTaskInput;
  CreateTeamInput: CreateTeamInput;
  CreateUserInput: CreateUserInput;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  LoginInput: LoginInput;
  Mutation: Record<PropertyKey, never>;
  Project: ProjectMapper;
  Query: Record<PropertyKey, never>;
  String: Scalars["String"]["output"];
  Task: TaskMapper;
  Team: TeamMapper;
  User: UserMapper;
}>;

export type AuthDirectiveArgs = {
  requires?: Maybe<Array<UserRole>>;
};

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = GraphQLContext,
  Args = AuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthPayloadResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["AuthPayload"] =
    ResolversParentTypes["AuthPayload"],
> = ResolversObject<{
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["Mutation"] =
    ResolversParentTypes["Mutation"],
> = ResolversObject<{
  createProject?: Resolver<
    ResolversTypes["Project"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateProjectArgs, "input">
  >;
  createTask?: Resolver<
    ResolversTypes["Task"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTaskArgs, "input">
  >;
  createTeam?: Resolver<
    ResolversTypes["Team"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTeamArgs, "input">
  >;
  createUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, "input">
  >;
  deleteTask?: Resolver<
    ResolversTypes["Task"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTaskArgs, "id">
  >;
  login?: Resolver<
    ResolversTypes["AuthPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "input">
  >;
}>;

export type ProjectResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["Project"] =
    ResolversParentTypes["Project"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes["Task"]>, ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["Query"] =
    ResolversParentTypes["Query"],
> = ResolversObject<{
  users?: Resolver<Array<ResolversTypes["User"]>, ParentType, ContextType>;
}>;

export type TaskResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["Task"] =
    ResolversParentTypes["Task"],
> = ResolversObject<{
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type TeamResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["Team"] =
    ResolversParentTypes["Team"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes["User"] =
    ResolversParentTypes["User"],
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ownedProjects?: Resolver<
    Array<ResolversTypes["Project"]>,
    ParentType,
    ContextType
  >;
  role?: Resolver<ResolversTypes["UserRole"], ParentType, ContextType>;
}>;

export type UserRoleResolvers = EnumResolverSignature<
  { ADMIN?: any; USER?: any },
  ResolversTypes["UserRole"]
>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserRole?: UserRoleResolvers;
}>;

export type DirectiveResolvers<ContextType = GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
}>;
