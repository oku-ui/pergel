// Please move server/plugins/graphqlv1.ts. If you want to change graphqlv1.ts you can change it.
export default pergelChangeName().graphqlYoga().nitro().use({
  onRequest: [
    // If lucia true, remove comment
    // changeNameLuciaRequest,
  ],
  onBeforeOptions: async ({ options }, event) => {
    // const allowedOrigins = (propscess.env.ORIGIN as string).split(',')
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
    const db = await pergelChangeName()

    const storage = changeNameDrizzleStorage({ db })

    await options.add({
      db,
      storage,
    })
  },
})
