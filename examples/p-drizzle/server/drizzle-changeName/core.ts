export function useChangeNameDbConnect() {
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
