import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import { createSchema } from 'graphql-yoga'
import { changeNameGraphQLService } from './services'
import type { Book, Resolvers, User } from '#changeName/server/graphqlYoga/generated/server'
import { schema } from '#changeName/server/graphqlYoga/generated/schema'

export const changeNameGraphQLResolvers: Resolvers = {
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
    createUser: async (_root, args, context, _info) => {
      const zodForm = zod.object({
        email: zod.string().email(),
        name: zod.string().min(3).max(31),
        password: zod.string().min(6).max(255),
      })

      const form = zodForm.parse({
        email: args.input.email,
        name: args.input.name,
        password: args.input.password,
      })

      const { auth, email } = changeNameGraphQLService({
        context,
      })

      const { session, user } = await auth.create({
        email: form.email,
        username: form.name,
        password: form.password,
      })

      if (session) {
        await email.verificationEmail({
          email: form.email,
        })
      }

      return {
        token: session.id,
        user,
      }
    },
    login: async (_root, args, context, _info) => {
      const zodForm = zod.object({
        password: zod.string().min(6).max(255),
        usernameOrEmail: zod.string().min(3).max(100),
      })

      const form = zodForm.parse({
        password: args.input.password,
        usernameOrEmail: args.input.usernameOrEmail,
      })

      const { auth } = changeNameGraphQLService({
        context,
      })

      try {
        const { session, user } = await auth.login({
          usernameOrEmail: form.usernameOrEmail,
          password: form.password,
        })

        return {
          token: session.id,
          user,
        }
      }
      catch (error) {
        throw new GraphQLError('Incorrect username or password', {
          extensions: {
            http: {
              status: 400,
            },
          },
        })
      }
    },
    logout: async (_root, _args, context, _info) => {
      const { auth } = changeNameGraphQLService({
        context,
      })

      await auth.logout()

      return true
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

export const changeNameGraphQLCreateSchema = createSchema({
  typeDefs: [schema, DateTimeTypeDefinition],
  resolvers: changeNameGraphQLResolvers,
})
