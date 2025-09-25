import { useUser } from '../contexts/UserContext'

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, login, logout } = useUser()

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    isLoggedIn: isAuthenticated && user !== null,
  }
}