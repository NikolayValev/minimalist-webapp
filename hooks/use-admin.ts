import { useAuth } from '@/contexts/auth-context'

export const useAdminCheck = () => {
  const { user, profile, isAdmin, loading } = useAuth()

  const isAuthenticated = !!user
  const hasAdminAccess = isAuthenticated && isAdmin

  return {
    isAuthenticated,
    isAdmin,
    hasAdminAccess,
    loading,
    profile,
    user
  }
}

export const requireAdmin = () => {
  const { hasAdminAccess, loading } = useAdminCheck()
  
  if (loading) {
    return { authorized: false, loading: true }
  }
  
  if (!hasAdminAccess) {
    return { authorized: false, loading: false }
  }
  
  return { authorized: true, loading: false }
}
