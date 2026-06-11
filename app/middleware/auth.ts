export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  if (!auth.loading) {
    if (!auth.isAuthenticated) {
      return navigateTo('/auth/login')
    }
    return
  }
  await auth.fetchMe()
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
