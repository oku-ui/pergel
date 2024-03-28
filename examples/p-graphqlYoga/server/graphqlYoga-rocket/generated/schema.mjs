// THIS FILE IS GENERATED, DO NOT EDIT!
/* eslint-disable eslint-comments/no-unlimited-disable */
/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */
/* pergel - oku-ui.com/pergel */
export const schema = `schema {
  query: Query
  mutation: Mutation
}

scalar DateTime

type Query {
  book(id: ID!): Book!
  books: [Book!]!
  search(input: SearchInput!): [SearchResult]
  users(search: String): [User!]!
}

type Book {
  id: ID!
  title: String!
  createdAt: String!
  updatedAt: String
}

input SearchInput {
  tableName: String!
  text: String!
}

union SearchResult = User | Book

enum RoleStatus {
  user
  admin
  superadmin
}

type User {
  id: ID!
  name: String
  email: String
  createdAt: DateTime!
  roleStatus: RoleStatus!
}

input UserInput {
  name: String!
  email: String!
  password: String!
}

input UserUpdateInput {
  name: String
  email: String
  password: String
}

type UserToken {
  user: User!
  token: String!
}

type Mutation {
  createUser(input: UserInput!): UserToken!
  updateUser(id: ID!, input: UserInput!): User!
  deleteUser(id: ID!): User!
  login(email: String!, password: String!): UserToken!
}`