export default pergelRocket().graphqlYoga().nitro().use({
  onBeforeOptions: async ({ options }) => {
    options.add({
      schema: rocketGraphQLCreateSchema,
    })
  },
  async onBeforeContext({ options }) {
    const data = await options.add({

    })
    console.warn(data)
  },
})
