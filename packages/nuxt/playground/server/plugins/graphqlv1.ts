import { createSchema } from 'graphql-yoga'
import type { Resolvers } from 'pergel/test/graphqlYoga/server'
import { schema } from 'pergel/test/graphqlYoga/schema'
import type { GraphqlYogaContext } from 'pergel/test'

const resolvers: Resolvers = {
  Query: {
    book: (_root, _args, _context, _info) => {
      return {
        id: '1',
        name: 'hello',
        email: 'hello',
        createdAt: 'hello',
        password: 'hello',
      }
    },
  },
}
const schemas = createSchema({
  typeDefs: schema,
  resolvers,
})

export default pergelTest().graphqlYoga().nitro().use<GraphqlYogaContext>({
  config: {
    mergeSchemas: true,
  },
  onBeforeOptions: async ({ options }) => {
    options.add({
      schema: schemas,
    })
  },
  async onBeforeContext({ options }) {
    const data = await options.add({

    })
    console.warn(data)
  },
})
