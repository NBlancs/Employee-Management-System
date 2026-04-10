export default defineNuxtRouteMiddleware((to) => {
  const authCookie = useCookie<string | null>('ems_auth')
  const isAuthenticated = authCookie.value === 'true'
  const path = to.path.toLowerCase()

  const isMainRoute = path === '/main' || path.startsWith('/main/')
  const isLandingRoute = path === '/landing' || path === '/'

  if (isMainRoute && !isAuthenticated) {
    return navigateTo('/landing')
  }

  if (isLandingRoute && isAuthenticated) {
    return navigateTo('/main')
  }

})