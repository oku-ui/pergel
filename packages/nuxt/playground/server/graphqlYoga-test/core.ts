import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import { createSchema } from 'graphql-yoga'
import type { TestGraphQLService } from './services'
import { testGraphQLService } from './services'
import type { Resolvers } from '#test/server/graphqlYoga/generated/server'
import { schema } from '#test/server/graphqlYoga/generated/schema'

export type { TestGraphQLService }
export { testGraphQLService }

export const testGraphQLResolvers: Resolvers = {
  DateTime: DateTimeResolver,
  SearchResult: {
    __resolveType: (obj) => {
      if ((obj as User).roleStatus)
        return 'User'

      if ((obj as Book).title)
        return 'Book'

      return null
    },
  },
  Mutation: {
    createUser: async (_root, _args, { storage, event }, _info) => {
      const { email, name, password } = _args.input

      const hashedPassword = await new Argon2id()
        .hash(password)

      const user = await storage.auth.create({
        email,
        hashedPassword,
        username: name,
      })

      if (!user)
        throw new GraphQLError('User not found')

      const session = await testAuth.createSession(user.id, {})

      appendHeader(event, 'Set-Cookie', testAuth.createSessionCookie(session.id).serialize())

      return {
        token: session.id,
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          createdAt: user.createdAt,
          roleStatus: user.roleStatus,
        },
      }
    },
  },
  Query: {
    users: async (_root, _args, { storage }, _info) => {
      const users = await storage.auth.users()
      return users
    },
    search: async (_root, _args, { storage }, _info) => {
      const { text, tableName } = _args.input
      const storageData = await storage.search.global({
        text,
        tableName,
      })

      return storageData
    },
  },
}

export const testGraphQLCreateSchema = createSchema({
  typeDefs: [schema, DateTimeTypeDefinition],
  resolvers: testGraphQLResolvers,
})