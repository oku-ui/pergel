export default pergelChangeName().graphqlYoga().nitro().use({
  onBeforeOptions: async ({ options }) => {
    options.add({
      schema: changeNameGraphQLCreateSchema,
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
