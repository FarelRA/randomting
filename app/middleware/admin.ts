export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  if (!auth.loading && !auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  if (auth.loading) {
    await auth.fetchMe()
  }
  if (!auth.isAuthenticated) {
    return navigateTo('/auth/login')
  }
  if (!auth.isAdmin) {
    return navigateTo('/')
  }
})