import { useUser } from '../contexts/UserContext'

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, login, logout, register, updateUser } = useUser()

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register, 
    logout,
    updateUser,
    isLoggedIn: isAuthenticated && user !== null,
  }
}