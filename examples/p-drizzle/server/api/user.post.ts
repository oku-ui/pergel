export default defineEventHandler(async () => {
  const connect = await pergelRocket().drizzle().postgresjs().connect({})
  const result = await connect.insert(tablesRocket.user).values({})
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
})
