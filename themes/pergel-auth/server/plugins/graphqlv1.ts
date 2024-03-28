export default pergelChangeName().graphqlYoga().nitro().use({
  onRequest: [
    changeNameLuciaRequest,
  ],
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
  async onBeforeContext({ options }) {
    const db = await changeNameDbConnect()

    const storage = changeNameDrizzleStorage({ db })

    await options.add({
      db,
      storage,
    })
  },
})
