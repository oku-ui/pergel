import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const functionName = camelCase(`${data.projectName}-GraphQLCreateSchema`)
  const resolverFunctionName = camelCase(`${data.projectName}-GraphQLResolvers`)
  return /* TS */ `import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars'

import { createSchema } from 'graphql-yoga'
import type { Book, Resolvers, User } from '#${data.projectName}/graphqlYoga/server'
import { schema } from '#${data.projectName}/graphqlYoga/schema'

export const ${resolverFunctionName}: Resolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
  },
  Query: {
  },
}

export const ${functionName} = createSchema({
  typeDefs: [schema, DateTimeTypeDefinition],
  resolvers: ${resolverFunctionName},
})
`
}
