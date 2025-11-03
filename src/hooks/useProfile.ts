import { useUser } from '../contexts/UserContext'

export const useProfile = () => {
  const { user, updateUser, error, clearError } = useUser()

  const updateProfile = async (profileData: { username:string, nome?: string; bio?: string; avatar?: string }) => {
    if (!user) return

    try {
      updateUser(profileData)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return {
    user,
    updateProfile,
    error,
    clearError,
  }
}