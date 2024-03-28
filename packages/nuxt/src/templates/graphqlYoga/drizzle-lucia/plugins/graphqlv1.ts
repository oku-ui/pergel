import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const pergelFunction = camelCase(`pergel-${data.projectName}`)
  const graphQLCreateSchema = camelCase(`${data.projectName}-GraphQLCreateSchema`)
  const drizzleStorage = camelCase(`${data.projectName}-Drizzle-Storage`)
  const luciaRequest = camelCase(`${data.projectName}-Lucia-Request`)
  return /* TS */ `// Please move server/plugins/graphqlv1.ts. If you want to change graphqlv1.ts you can change it.
export default ${pergelFunction}().graphqlYoga().nitro().use({
  onRequest: [
    // If lucia true, remove comment
    // ${luciaRequest},
  ],
  onBeforeOptions: async ({ options }, event) => {
    // const allowedOrigins = (propscess.env.ORIGIN as string).split(',')
    const origin = event.node.req.headers.origin as string
    options.add({
      schema: ${graphQLCreateSchema},
      cors: {
        origin,
        credentials: true,
      },
    })
  },
  async onBeforeContext({ options }, event) {
    const db = await ${pergelFunction}()

    const storage = ${drizzleStorage}({ db })

    await options.add({
      db,
      storage,
    })
  },
})
`
}
