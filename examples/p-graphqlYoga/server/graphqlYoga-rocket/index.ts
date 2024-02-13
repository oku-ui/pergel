import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import { createSchema } from 'graphql-yoga'
import type { Resolvers } from '#rocket/graphqlYoga/server'
import { schema } from '#rocket/graphqlYoga/schema'

export const rocketGraphQLResolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
  },
  Query: {
  },
}

export const rocketGraphQLCreateSchema = createSchema({
  typeDefs: [schema, DateTimeTypeDefinition],
  resolvers: rocketGraphQLResolvers,
})
