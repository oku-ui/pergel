export function changeNameDbConnect() {
  return pergelChangeName().drizzle()
    .postgresjs()
    .connect({
      pgOptions: {
        options: {
          connection: {
            TimeZone: 'UTC',
          },
        },
      },
    })
}
