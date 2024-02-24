// Please move server/plugins/graphqlv1.ts. If you want to change graphqlv1.ts you can change it.
export default pergelRocket().graphqlYoga().nitro().use({
  onRequest: [
    // If lucia true, remove comment
    // rocketLuciaRequest,
  ],
  onBeforeOptions: async ({ options }, event) => {
    // const allowedOrigins = (propscess.env.ORIGIN as string).split(',')
    const origin = event.node.req.headers.origin as string
    options.add({
      schema: rocketGraphQLCreateSchema,
      cors: {
        origin,
        credentials: true,
      },
    })
  },
  async onBeforeContext({ options }, event) {
    const db = await pergelRocket().drizzle()
      .postgresjs()
      .connect({
        event,
      })

    const storage = rocketDrizzleStorage({ db })

    await options.add({
      db,
      storage,
    })
  },
})
