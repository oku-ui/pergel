export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  const data = await useRequestFetch()('/api/auth/user')

  if (data)
    user.value = data
})
