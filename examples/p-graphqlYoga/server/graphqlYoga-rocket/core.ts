import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import { createSchema } from 'graphql-yoga'
import type { RocketGraphQLService } from './services'
import { rocketGraphQLService } from './services'
import type { Resolvers } from '#rocket/server/graphqlYoga/generated/server'
import { schema } from '#rocket/server/graphqlYoga/generated/schema'

export type { RocketGraphQLService }
export { rocketGraphQLService }

export const rocketGraphQLResolvers: Resolvers = {
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

      const session = await rocketAuth.createSession(user.id, {})

      appendHeader(event, 'Set-Cookie', rocketAuth.createSessionCookie(session.id).serialize())

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

export const rocketGraphQLCreateSchema = createSchema({
  typeDefs: [schema, DateTimeTypeDefinition],
  resolvers: rocketGraphQLResolvers,
})
