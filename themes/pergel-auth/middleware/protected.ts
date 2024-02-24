export default defineNuxtRouteMiddleware(async () => {
  const user = useUser()
  if (!user.value)
    return await navigateTo('/auth/login')
})
