export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  if (!user.value)
    await navigateTo('/login')
})
