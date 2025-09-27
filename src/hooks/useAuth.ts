import { useUser } from '../contexts/UserContext'

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, login, signup, logout } = useUser()

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    signup,
    logout,
    isLoggedIn: isAuthenticated && user !== null,
  }
}