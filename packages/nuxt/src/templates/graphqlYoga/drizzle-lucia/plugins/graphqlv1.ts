import { camelCase } from 'scule'

export default function (data: {
  projectName: string
}) {
  const pergelFunction = camelCase(`pergel_${data.projectName}`)
  const graphQLCreateSchema = camelCase(`${data.projectName}-GraphQLCreateSchema`)
  const drizzleStorage = camelCase(`${data.projectName}-Drizzle-Storage`)
  return /* TS */ `export default ${pergelFunction}().graphqlYoga().nitro().use({
  onBeforeOptions: async ({ options }) => {
    options.add({
      schema: ${graphQLCreateSchema},
    })
  },
  async onBeforeContext({ options }, event) {
    const db = await ${pergelFunction}().drizzle()
      .postgresjs()
      .connect({
        event,
      })

    const storage = ${drizzleStorage}({ db })

    await options.add({
      db,
      storage,
    })
  },
})
`
}
