export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const connect = await pergelRocket().drizzle().postgresjs().connect({})
  const result = await connect.insert(tablesRocket.user).values({
    name: body.name,
    email: body.email,
    password: body.password,
  }).returning()

  return {
    statusCode: 200,
    body: result,
  }
})
