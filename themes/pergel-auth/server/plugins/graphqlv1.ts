export default pergelChangeName().graphqlYoga().nitro().use({
  onBeforeOptions: async ({ options }, event) => {
    // const allowedOrigins = (env.ORIGIN as string).split(',')
    const origin = event.node.req.headers.origin as string
    options.add({
      schema: changeNameGraphQLCreateSchema,
      cors: {
        origin,
        credentials: true,
      },
    })
  },
  async onBeforeContext({ options }, event) {
    const db = await pergelChangeName().drizzle()
      .postgresjs()
      .connect({
        event,
      })

    const storage = changeNameDrizzleStorage({ db })

    await options.add({
      db,
      storage,
    })
  },
})