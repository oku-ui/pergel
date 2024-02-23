// THIS FILE IS GENERATED, DO NOT EDIT!
/* eslint-disable eslint-comments/no-unlimited-disable */
/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */
/* pergel - oku-ui.com/pergel */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import type { Resolver as GraphCacheResolver, UpdateResolver as GraphCacheUpdateResolver, OptimisticMutationResolver as GraphCacheOptimisticMutationResolver } from '@urql/exchange-graphcache';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Query = {
  __typename?: 'Query';
  book: Book;
  books: Array<Book>;
  search?: Maybe<Array<Maybe<SearchResult>>>;
  users: Array<User>;
};


export type QueryBookArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySearchArgs = {
  input: SearchInput;
};


export type QueryUsersArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type SearchInput = {
  tableName: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type SearchResult = User | Book;

export type RoleStatus =
  | 'user'
  | 'admin'
  | 'superadmin';

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  roleStatus: RoleStatus;
};

export type UserInput = {
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserToken = {
  __typename?: 'UserToken';
  user: User;
  token: Scalars['String']['output'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: UserToken;
  updateUser: User;
  deleteUser: User;
  login: UserToken;
  logout: Scalars['Boolean']['output'];
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};

export type BookQueryVariables = Exact<{ [key: string]: never; }>;


export type BookQuery = { __typename?: 'Query', book: { __typename?: 'Book', id: string, title: string } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name?: string | null }> };

export type CreateUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserToken', token: string, user: { __typename?: 'User', id: string, name?: string | null, email?: string | null, createdAt: any } } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserToken', token: string, user: { __typename?: 'User', id: string, name?: string | null, email?: string | null, createdAt: any } } };


export const BookDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"book"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"book"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<BookQuery, BookQueryVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export type WithTypename<T extends { __typename?: any }> = Partial<T> & { __typename: NonNullable<T['__typename']> };

export type GraphCacheKeysConfig = {
  Book?: (data: WithTypename<Book>) => null | string,
  User?: (data: WithTypename<User>) => null | string,
  UserToken?: (data: WithTypename<UserToken>) => null | string
}

export type GraphCacheResolvers = {
  Query?: {
    book?: GraphCacheResolver<WithTypename<Query>, QueryBookArgs, WithTypename<Book> | string>,
    books?: GraphCacheResolver<WithTypename<Query>, Record<string, never>, Array<WithTypename<Book> | string>>,
    search?: GraphCacheResolver<WithTypename<Query>, QuerySearchArgs, Array<WithTypename<SearchResult> | string>>,
    users?: GraphCacheResolver<WithTypename<Query>, QueryUsersArgs, Array<WithTypename<User> | string>>
  },
  Book?: {
    id?: GraphCacheResolver<WithTypename<Book>, Record<string, never>, Scalars['ID'] | string>,
    title?: GraphCacheResolver<WithTypename<Book>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<Book>, Record<string, never>, Scalars['String'] | string>,
    updatedAt?: GraphCacheResolver<WithTypename<Book>, Record<string, never>, Scalars['String'] | string>
  },
  User?: {
    id?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['ID'] | string>,
    name?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    email?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['String'] | string>,
    createdAt?: GraphCacheResolver<WithTypename<User>, Record<string, never>, Scalars['DateTime'] | string>,
    roleStatus?: GraphCacheResolver<WithTypename<User>, Record<string, never>, RoleStatus | string>
  },
  UserToken?: {
    user?: GraphCacheResolver<WithTypename<UserToken>, Record<string, never>, WithTypename<User> | string>,
    token?: GraphCacheResolver<WithTypename<UserToken>, Record<string, never>, Scalars['String'] | string>
  }
};

export type GraphCacheOptimisticUpdaters = {
  createUser?: GraphCacheOptimisticMutationResolver<MutationCreateUserArgs, WithTypename<UserToken>>,
  updateUser?: GraphCacheOptimisticMutationResolver<MutationUpdateUserArgs, WithTypename<User>>,
  deleteUser?: GraphCacheOptimisticMutationResolver<MutationDeleteUserArgs, WithTypename<User>>,
  login?: GraphCacheOptimisticMutationResolver<MutationLoginArgs, WithTypename<UserToken>>,
  logout?: GraphCacheOptimisticMutationResolver<Record<string, never>, Scalars['Boolean']>
};

export type GraphCacheUpdaters = {
  Query?: {
    book?: GraphCacheUpdateResolver<{ book: WithTypename<Book> }, QueryBookArgs>,
    books?: GraphCacheUpdateResolver<{ books: Array<WithTypename<Book>> }, Record<string, never>>,
    search?: GraphCacheUpdateResolver<{ search: Maybe<Array<WithTypename<SearchResult>>> }, QuerySearchArgs>,
    users?: GraphCacheUpdateResolver<{ users: Array<WithTypename<User>> }, QueryUsersArgs>
  },
  Mutation?: {
    createUser?: GraphCacheUpdateResolver<{ createUser: WithTypename<UserToken> }, MutationCreateUserArgs>,
    updateUser?: GraphCacheUpdateResolver<{ updateUser: WithTypename<User> }, MutationUpdateUserArgs>,
    deleteUser?: GraphCacheUpdateResolver<{ deleteUser: WithTypename<User> }, MutationDeleteUserArgs>,
    login?: GraphCacheUpdateResolver<{ login: WithTypename<UserToken> }, MutationLoginArgs>,
    logout?: GraphCacheUpdateResolver<{ logout: Scalars['Boolean'] }, Record<string, never>>
  },
  Subscription?: {},
  Book?: {
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<Book>>, Record<string, never>>,
    title?: GraphCacheUpdateResolver<Maybe<WithTypename<Book>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Book>>, Record<string, never>>,
    updatedAt?: GraphCacheUpdateResolver<Maybe<WithTypename<Book>>, Record<string, never>>
  },
  User?: {
    id?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    name?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    email?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    createdAt?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>,
    roleStatus?: GraphCacheUpdateResolver<Maybe<WithTypename<User>>, Record<string, never>>
  },
  UserToken?: {
    user?: GraphCacheUpdateResolver<Maybe<WithTypename<UserToken>>, Record<string, never>>,
    token?: GraphCacheUpdateResolver<Maybe<WithTypename<UserToken>>, Record<string, never>>
  },
};

export type GraphCacheConfig = Parameters<typeof cacheExchange>[0] & {
  updates?: GraphCacheUpdaters,
  keys?: GraphCacheKeysConfig,
  optimistic?: GraphCacheOptimisticUpdaters,
  resolvers?: GraphCacheResolvers,
};