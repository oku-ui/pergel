export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const db = await pergelChangeName()
    .drizzle()
    .postgresjs()
    .connect({
      event,
    })

  const result = await db
    .insert(changeNameTables.user)
    .values({
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: body.username,
    })
    .returning()

  return {
    statusCode: 200,
    body: result,
  }
})
