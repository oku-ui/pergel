import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import { createSchema } from 'graphql-yoga'
import { changeNameGraphQLService } from './services'
import type { Book, Resolvers, User } from '#changeName/graphqlYoga/server'
import { schema } from '#changeName/graphqlYoga/schema'

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
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          createdAt: user.createdAt,
          roleStatus: user.roleStatus,
        },
      }
    },
    // login: async (_root, _args, { storage, event }, _info) => {
    //   const db = await pergelChangeName().drizzle().postgresjs().connect({
    //     event,
    //   })
    //   const body = await readBody(event)
    //   const username = body.username
    //   if (
    //     typeof username !== 'string'
    //     || username.length < 3
    //     || username.length > 31
    //     || !/^[a-z0-9_-]+$/.test(username)
    //   ) {
    //     throw createError({
    //       message: 'Invalid username',
    //       statusCode: 400,
    //     })
    //   }
    //   const password = body.password
    //   if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    //     throw createError({
    //       message: 'Invalid password',
    //       statusCode: 400,
    //     })
    //   }

    //   const [existingUser] = await db.select()
    //     .from(changeNameTables.user).where(eq(changeNameTables.user.username, username)).execute()

    //   if (!existingUser) {
    //     throw createError({
    //       message: 'Incorrect username or password',
    //       statusCode: 400,
    //     })
    //   }

    //   const validPassword = await new Argon2id().verify(existingUser.password, password)
    //   if (!validPassword) {
    //     throw createError({
    //       message: 'Incorrect username or password',
    //       statusCode: 400,
    //     })
    //   }

    //   const session = await changeNameAuth.createSession(existingUser.id, {})
    //   appendHeader(event, 'Set-Cookie', changeNameAuth.createSessionCookie(session.id).serialize())
    // },
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
