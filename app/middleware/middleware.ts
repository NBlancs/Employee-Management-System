export default defineNuxtRouteMiddleware((to) => {
  const authCookie = useCookie<string | null>('ems_auth')
  const userCookie = useCookie<string | null>('ems_user')
  const isAuthenticated = authCookie.value === 'true'
  const path = to.path.toLowerCase()

  const parseUserCookie = () => {
    if (!userCookie.value) {
      return null
    }

    try {
      return JSON.parse(userCookie.value) as { role?: string; department?: string }
    } catch {
      return null
    }
  }

  const currentUser = parseUserCookie()
  const userRole = currentUser?.role?.toLowerCase() ?? ''
  const userDepartment = currentUser?.department?.toLowerCase() ?? ''

  const isAllowedDepartmentAndPosition = (): boolean => {
    const isHRDepartment =
      userDepartment.includes('human resources') || userDepartment.includes('hr')

    const allowedPositions = [
      'department head',
      'chief human resources officer',
      'hr generalist',
      'admin',
    ]

    const isAllowedPosition = allowedPositions.includes(userRole)

    return isHRDepartment && isAllowedPosition
  }

  const isAllowedRole = isAllowedDepartmentAndPosition()

  const isMainRoute = path === '/main' || path.startsWith('/main/')
  const isLandingRoute = path === '/landing' || path === '/'

  if (isAuthenticated && !isAllowedRole) {
    authCookie.value = null
    userCookie.value = null
    return navigateTo('/landing')
  }

  if (isMainRoute && (!isAuthenticated || !isAllowedRole)) {
    return navigateTo('/landing')
  }

  if (isLandingRoute && isAuthenticated) {
    return navigateTo('/main')
  }
 
})