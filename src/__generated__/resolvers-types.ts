import type { GraphQLResolveInfo } from 'graphql';
import type { GraphQLContext } from '../api/types.js';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  createUser: User;
};


export type MutationCreateProjectArgs = {
  authorOid: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String']['input'];
};

export type Project = {
  __typename?: 'Project';
  author: User;
  authorOid: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  oid: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects?: Maybe<Array<Maybe<Project>>>;
  status: StatusResponse;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryProjectArgs = {
  oid: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  oid: Scalars['ID']['input'];
};

export type StatusResponse = {
  __typename?: 'StatusResponse';
  env: Scalars['String']['output'];
  project: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  oid: Scalars['ID']['output'];
  projects?: Maybe<Array<Maybe<Project>>>;
  updatedAt: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Project: ResolverTypeWrapper<Project>;
  Query: ResolverTypeWrapper<{}>;
  StatusResponse: ResolverTypeWrapper<StatusResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  Mutation: {};
  Project: Project;
  Query: {};
  StatusResponse: StatusResponse;
  String: Scalars['String']['output'];
  User: User;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'authorOid' | 'name'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'name'>>;
}>;

export type ProjectResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = ResolversObject<{
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  authorOid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  oid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'oid'>>;
  projects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Project']>>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['StatusResponse'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'oid'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
}>;

export type StatusResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StatusResponse'] = ResolversParentTypes['StatusResponse']> = ResolversObject<{
  env?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  oid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Project']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StatusResponse?: StatusResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

